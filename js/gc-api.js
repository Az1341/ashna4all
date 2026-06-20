/* ============================================================
   GOALCURRENT.LIVE — Multi-API Integration Layer
   gc-api.js | Version 3.0 | World Cup 2026

   NEW IN v3.0 vs v2.0:
   ✅ Top scorers & assists (API-Football)
   ✅ Head-to-head history (API-Football)
   ✅ Injury reports (API-Football)
   ✅ Match predictions (API-Football)
   ✅ News RSS feed parser (BBC Sport / Sky Sports / FIFA)
   ✅ Auto-refresh widget helper (polls live scores automatically)
   ✅ Rate-limit queue (prevents hitting API limits)
   ✅ Retry logic with exponential backoff
   ✅ Offline detection + graceful degradation
   ✅ GC.render.*  — ready-made HTML renderers for every data type
   ✅ GC.watch()   — subscribe to live score updates via callback
   ✅ GC.bracket() — full knockout bracket builder from local data
   ✅ GC.today()   — single call: today's matches + live scores merged

   API SOURCES:
   ① API-Football     api-sports.io     — Live, lineups, events, stats, injuries, h2h
   ② Football-Data.org football-data.org — Fixtures, standings (free, reliable)
   ③ TheSportsDB      thesportsdb.com   — Team logos, stadiums, players (always free)
   ④ RSS Feeds        BBC / Sky / FIFA  — News headlines (no key needed)
   ⑤ Local JSON       worldcup-data.js  — Groups, bracket, venues (zero API calls)

   SETUP (one time in browser console):
   GC.setup({ apif: 'YOUR_KEY', fd: 'YOUR_KEY' })

   Keys stored in localStorage — never in code, never in GitHub.
   ============================================================ */

;(function(window, undefined) {
'use strict';

/* ── CONFIG ─────────────────────────────────────────────────── */
var CFG = {
  APIF_HOST:   'https://v3.football.api-sports.io',
  FD_HOST:     'https://api.football-data.org/v4',
  TSDB_HOST:   'https://www.thesportsdb.com/api/v1/json/3',
  FD_WC_ID:    2000,
  APIF_WC_ID:  1,
  SEASON:      2026,
  TTL_LIVE:    30000,    /* 30s  */
  TTL_FIX:     300000,   /* 5min */
  TTL_STAND:   300000,   /* 5min */
  TTL_TEAM:    3600000,  /* 1hr  */
  TTL_NEWS:    600000,   /* 10min */
  TTL_H2H:     86400000, /* 24hr */
  TTL_PRED:    3600000,  /* 1hr  */
  MAX_RETRIES: 3,
  RETRY_BASE:  1000,     /* ms, doubles each retry */
  RATE_LIMIT:  5,        /* max concurrent requests */
};

/* ── KEYS ──────────────────────────────────────────────────── */
var K = {
  apif: function(){ return localStorage.getItem('gc_apif_key') || localStorage.getItem('fd_key') || ''; },
  fd:   function(){ return localStorage.getItem('gc_fd_key')   || localStorage.getItem('gc_fdkey') || ''; },
};

/* ── CACHE ─────────────────────────────────────────────────── */
var _cache = {};
function cGet(k){ var x=_cache[k]; if(!x||Date.now()-x.t>x.ttl){delete _cache[k];return null;} return x.d; }
function cSet(k,d,ttl){ _cache[k]={d:d,t:Date.now(),ttl:ttl||60000}; }

/* ── RATE LIMIT QUEUE ──────────────────────────────────────── */
var _queue = [], _active = 0;
function enqueue(fn) {
  return new Promise(function(resolve, reject) {
    _queue.push({ fn: fn, resolve: resolve, reject: reject });
    drain();
  });
}
function drain() {
  if (_active >= CFG.RATE_LIMIT || !_queue.length) return;
  _active++;
  var job = _queue.shift();
  job.fn().then(function(v){ _active--; job.resolve(v); drain(); })
           .catch(function(e){ _active--; job.reject(e);  drain(); });
}

/* ── RETRY FETCH ───────────────────────────────────────────── */
function fetchRetry(url, opts, attempt) {
  attempt = attempt || 0;
  /* Offline check */
  if (!navigator.onLine) return Promise.reject(new Error('offline'));
  return fetch(url, opts || {})
    .then(function(r) {
      if (r.status === 429 && attempt < CFG.MAX_RETRIES) {
        /* Rate limited — wait and retry */
        var delay = CFG.RETRY_BASE * Math.pow(2, attempt);
        return new Promise(function(res){ setTimeout(res, delay); })
          .then(function(){ return fetchRetry(url, opts, attempt+1); });
      }
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .catch(function(e) {
      if (attempt < CFG.MAX_RETRIES && e.message !== 'offline') {
        var delay = CFG.RETRY_BASE * Math.pow(2, attempt);
        return new Promise(function(res){ setTimeout(res, delay); })
          .then(function(){ return fetchRetry(url, opts, attempt+1); });
      }
      throw e;
    });
}

/* ── HTTP HELPERS ──────────────────────────────────────────── */
function apif(ep, params) {
  var key = K.apif();
  if (!key) return Promise.reject(new Error('gc_apif_key not set'));
  var qs = params ? '?'+Object.keys(params).map(function(k){ return k+'='+encodeURIComponent(params[k]); }).join('&') : '';
  return enqueue(function(){
    return fetchRetry(CFG.APIF_HOST + ep + qs, { headers: { 'x-apisports-key': key } });
  });
}
function fd(ep, params) {
  var key = K.fd();
  var qs = params ? '?'+Object.keys(params).map(function(k){ return k+'='+encodeURIComponent(params[k]); }).join('&') : '';
  var headers = key ? { 'X-Auth-Token': key } : {};
  return enqueue(function(){
    return fetchRetry(CFG.FD_HOST + ep + qs, { headers: headers });
  });
}
function tsdb(ep) {
  return enqueue(function(){
    return fetchRetry(CFG.TSDB_HOST + ep);
  });
}

/* ── NORMALISERS ───────────────────────────────────────────── */
var STATUS_MAP = {
  'NS':'upcoming','TBD':'upcoming','SCHEDULED':'upcoming','TIMED':'upcoming',
  '1H':'live','2H':'live','ET':'live','P':'live','LIVE':'live','IN_PLAY':'live',
  'HT':'ht',
  'FT':'ft','AET':'ft','PEN':'ft','FINISHED':'ft',
  'PST':'postponed','CANC':'cancelled','SUSP':'suspended','AWD':'awarded',
};
function nStatus(s){ return STATUS_MAP[s] || (s||'').toLowerCase(); }

function toBST(utc) {
  try {
    return new Date(utc).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/London'})+' BST';
  } catch(e){ return ''; }
}
function toDateBST(utc) {
  try {
    return new Date(utc).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',timeZone:'Europe/London'});
  } catch(e){ return ''; }
}

function nApif(m) {
  return {
    id: m.fixture.id, source: 'api-football',
    status: nStatus(m.fixture.status.short),
    elapsed: m.fixture.status.elapsed,
    date: m.fixture.date, dateBST: toBST(m.fixture.date), dateLabelBST: toDateBST(m.fixture.date),
    venue: m.fixture.venue.name, city: m.fixture.venue.city,
    group: (m.league&&m.league.round)||'', comp:'WC2026',
    home:{ name:m.teams.home.name, score:m.goals.home,  logo:m.teams.home.logo,  id:m.teams.home.id,  winner:m.teams.home.winner  },
    away:{ name:m.teams.away.name, score:m.goals.away,  logo:m.teams.away.logo,  id:m.teams.away.id,  winner:m.teams.away.winner  },
  };
}
function nFd(m) {
  return {
    id: m.id, source: 'football-data',
    status: nStatus(m.status),
    elapsed: null,
    date: m.utcDate, dateBST: toBST(m.utcDate), dateLabelBST: toDateBST(m.utcDate),
    venue: (m.venue&&m.venue.name)||'', city:'',
    group: m.stage||m.group||'', comp:'WC2026',
    home:{ name:m.homeTeam.name, score:m.score.fullTime.home, id:m.homeTeam.id },
    away:{ name:m.awayTeam.name, score:m.score.fullTime.away, id:m.awayTeam.id },
  };
}

/* ── FLAGS ─────────────────────────────────────────────────── */
var FLAGS = {
  'Algeria':'🇩🇿','Argentina':'🇦🇷','Australia':'🇦🇺','Austria':'🇦🇹',
  'Belgium':'🇧🇪','Bosnia & Herzegovina':'🇧🇦','Bosnia':'🇧🇦','Brazil':'🇧🇷',
  'Canada':'🇨🇦','Cape Verde':'🇨🇻','Colombia':'🇨🇴','Croatia':'🇭🇷',
  'Curaçao':'🇨🇼','Czech Republic':'🇨🇿','DR Congo':'🇨🇩','Ecuador':'🇪🇨',
  'Egypt':'🇪🇬','England':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','France':'🇫🇷','Germany':'🇩🇪',
  'Ghana':'🇬🇭','Haiti':'🇭🇹','Iran':'🇮🇷','Iraq':'🇮🇶',
  'Ivory Coast':'🇨🇮','Japan':'🇯🇵','Jordan':'🇯🇴','Mexico':'🇲🇽',
  'Morocco':'🇲🇦','Netherlands':'🇳🇱','New Zealand':'🇳🇿','Norway':'🇳🇴',
  'Panama':'🇵🇦','Paraguay':'🇵🇾','Portugal':'🇵🇹','Qatar':'🇶🇦',
  'Saudi Arabia':'🇸🇦','Scotland':'🏴󠁧󠁢󠁳󠁣󠁴󠁿','Senegal':'🇸🇳','South Africa':'🇿🇦',
  'South Korea':'🇰🇷','Spain':'🇪🇸','Sweden':'🇸🇪','Switzerland':'🇨🇭',
  'Tunisia':'🇹🇳','Turkey':'🇹🇷','Uruguay':'🇺🇾','USA':'🇺🇸','Uzbekistan':'🇺🇿',
  /* API name variants */
  'Korea Republic':'🇰🇷','Czechia':'🇨🇿','Côte d\'Ivoire':'🇨🇮',
  'IR Iran':'🇮🇷','Türkiye':'🇹🇷','Cabo Verde':'🇨🇻',
  'Congo DR':'🇨🇩','Bosnia and Herzegovina':'🇧🇦',
};

/* ── WATCHERS (live-score subscribers) ─────────────────────── */
var _watchers = [];
var _watchTimer = null;
function _notifyWatchers(matches) {
  _watchers.forEach(function(cb){ try{ cb(matches); }catch(e){} });
}

/* ══════════════════════════════════════════════════════════════
   PUBLIC API
══════════════════════════════════════════════════════════════ */
var GC = {

  version: '3.0',
  flags: FLAGS,
  flag: function(n){ return FLAGS[n] || FLAGS[(n||'').replace(/\s+/g,' ')] || '🏳️'; },

  /* ─────────────────────────────────────────────────────────
     CORE DATA METHODS (carried over from v2, now with retry
     + rate limiting + offline graceful degradation)
  ───────────────────────────────────────────────────────── */

  liveScores: function() {
    var c = cGet('live'); if(c) return Promise.resolve(c);
    var primary = K.apif()
      ? apif('/fixtures',{live:'all',league:CFG.APIF_WC_ID,season:CFG.SEASON})
          .then(function(r){ if(!r.response||!r.response.length) throw new Error('empty'); return r.response.map(nApif); })
      : Promise.reject(new Error('no key'));
    var fallback = fd('/competitions/'+CFG.FD_WC_ID+'/matches',{status:'LIVE'})
      .then(function(r){ return (r.matches||[]).map(nFd); });
    return primary.catch(function(){ return fallback; })
      .then(function(m){ cSet('live',m,CFG.TTL_LIVE); return m; })
      .catch(function(){ return cGet('live')||[]; }); /* return stale cache on failure */
  },

  todayFixtures: function() {
    var c = cGet('today'); if(c) return Promise.resolve(c);
    var ds = new Date().toISOString().slice(0,10);
    return fd('/competitions/'+CFG.FD_WC_ID+'/matches',{dateFrom:ds,dateTo:ds})
      .then(function(r){ var m=(r.matches||[]).map(nFd); cSet('today',m,CFG.TTL_FIX); return m; })
      .catch(function(){
        var loc = typeof WC26!=='undefined'&&WC26.schedule&&WC26.schedule[ds]||[];
        return loc.map(function(m){
          return { id:m.n, source:'local', status:'upcoming', dateBST:m.t+' BST',
                   home:{name:m.h,score:null}, away:{name:m.a,score:null},
                   group:'Group '+m.g, comp:'WC2026', venue:m.v||'' };
        });
      });
  },

  fixtures: function() {
    var c = cGet('fixtures'); if(c) return Promise.resolve(c);
    return fd('/competitions/'+CFG.FD_WC_ID+'/matches')
      .then(function(r){ var m=(r.matches||[]).map(nFd); cSet('fixtures',m,CFG.TTL_FIX); return m; })
      .catch(function(){
        if(typeof WC26==='undefined') return [];
        var all=[];
        Object.keys(WC26.schedule||{}).sort().forEach(function(date){
          (WC26.schedule[date]||[]).forEach(function(m){
            all.push({ id:m.n, source:'local', status:'upcoming',
                       date:date+'T'+(String(parseInt(m.t,10)-1)).padStart(2,'0')+':00:00Z',
                       dateBST:m.t+' BST', dateLabelBST:toDateBST(date+'T12:00:00Z'),
                       group:'Group '+m.g, comp:'WC2026', venue:m.v||'',
                       home:{name:m.h,score:null}, away:{name:m.a,score:null} });
          });
        });
        return all;
      });
  },

  standings: function() {
    var c = cGet('standings'); if(c) return Promise.resolve(c);
    return fd('/competitions/'+CFG.FD_WC_ID+'/standings')
      .then(function(r){
        var g=(r.standings||[]).map(function(grp){
          return { group:grp.group||grp.stage, table:grp.table.map(function(row){
            return { pos:row.position, team:row.team.name, teamId:row.team.id,
                     flag:GC.flag(row.team.name),
                     p:row.playedGames, w:row.won, d:row.draw, l:row.lost,
                     gf:row.goalsFor, ga:row.goalsAgainst, gd:row.goalDifference, pts:row.points };
          })};
        });
        cSet('standings',g,CFG.TTL_STAND); return g;
      })
      .catch(function(){
        if(typeof WC26==='undefined') return [];
        return Object.keys(WC26.groups||{}).map(function(letter){
          return { group:'Group '+letter,
                   table:(WC26.groups[letter]||[]).map(function(name,i){
                     return { pos:i+1, team:name, flag:GC.flag(name),
                              p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0 };
                   })};
        });
      });
  },

  matchEvents: function(id) {
    var c=cGet('ev_'+id); if(c) return Promise.resolve(c);
    return apif('/fixtures/events',{fixture:id})
      .then(function(r){
        var ev=(r.response||[]).map(function(e){
          return { time:e.time.elapsed, extra:e.time.extra, team:e.team.name,
                   player:e.player.name, assist:e.assist&&e.assist.name,
                   type:e.type.toLowerCase(), detail:e.detail };
        });
        cSet('ev_'+id,ev,CFG.TTL_LIVE); return ev;
      });
  },

  lineups: function(id) {
    var c=cGet('lu_'+id); if(c) return Promise.resolve(c);
    return apif('/fixtures/lineups',{fixture:id})
      .then(function(r){
        var lu=(r.response||[]).map(function(t){
          return { team:t.team.name, teamId:t.team.id, formation:t.formation,
                   coach:t.coach&&t.coach.name,
                   startXI:(t.startXI||[]).map(function(p){
                     return { name:p.player.name, number:p.player.number, pos:p.player.pos, grid:p.player.grid };
                   }),
                   subs:(t.substitutes||[]).map(function(p){
                     return { name:p.player.name, number:p.player.number, pos:p.player.pos };
                   })};
        });
        cSet('lu_'+id,lu,CFG.TTL_LIVE); return lu;
      });
  },

  matchStats: function(id) {
    var c=cGet('st_'+id); if(c) return Promise.resolve(c);
    return apif('/fixtures/statistics',{fixture:id})
      .then(function(r){
        var s={};
        (r.response||[]).forEach(function(t){
          s[t.team.name]={};
          t.statistics.forEach(function(x){ s[t.team.name][x.type]=x.value; });
        });
        cSet('st_'+id,s,CFG.TTL_LIVE); return s;
      });
  },

  teamInfo: function(name) {
    var c=cGet('ti_'+name); if(c) return Promise.resolve(c);
    return tsdb('/searchteams.php?t='+encodeURIComponent(name))
      .then(function(r){
        var t=r.teams&&r.teams[0]; if(!t) throw new Error('not found');
        var info={ name:t.strTeam, country:t.strCountry, formed:t.intFormedYear,
                   logo:t.strTeamBadge||t.strTeamLogo, jersey:t.strTeamJersey,
                   stadium:t.strStadium, stadiumThumb:t.strStadiumThumb,
                   stadiumCap:t.intStadiumCapacity, stadiumDesc:t.strStadiumDescription,
                   description:t.strDescriptionEN, website:t.strWebsite, source:'thesportsdb' };
        cSet('ti_'+name,info,CFG.TTL_TEAM); return info;
      });
  },

  stadiumInfo: function(name) {
    var c=cGet('vi_'+name); if(c) return Promise.resolve(c);
    return tsdb('/searchvenues.php?e='+encodeURIComponent(name))
      .then(function(r){
        var v=r.venues&&r.venues[0]; if(!v) throw new Error('not found');
        var info={ name:v.strVenue, country:v.strCountry, city:v.strLocation,
                   capacity:v.intCapacity, thumb:v.strThumb, fanart:v.strFanart1,
                   desc:v.strDescriptionEN, source:'thesportsdb' };
        cSet('vi_'+name,info,CFG.TTL_TEAM); return info;
      });
  },

  playerInfo: function(name) {
    var c=cGet('pi_'+name); if(c) return Promise.resolve(c);
    return tsdb('/searchplayers.php?p='+encodeURIComponent(name))
      .then(function(r){
        var p=r.player&&r.player[0]; if(!p) throw new Error('not found');
        var info={ name:p.strPlayer, nationality:p.strNationality, position:p.strPosition,
                   dob:p.dateBorn, height:p.strHeight, weight:p.strWeight,
                   photo:p.strThumb||p.strCutout, description:p.strDescriptionEN, source:'thesportsdb' };
        cSet('pi_'+name,info,CFG.TTL_TEAM); return info;
      });
  },

  nextMatch: function(teamName) {
    return GC.fixtures().then(function(all){
      var now=Date.now();
      var up=all.filter(function(m){
        return (m.home.name===teamName||m.away.name===teamName)
            && m.status==='upcoming'
            && new Date(m.date)>now;
      });
      up.sort(function(a,b){ return new Date(a.date)-new Date(b.date); });
      return up[0]||null;
    });
  },

  /* ─────────────────────────────────────────────────────────
     NEW v3.0 — TOP SCORERS & ASSISTS
     Returns golden boot leaderboard for WC2026
  ───────────────────────────────────────────────────────── */
  topScorers: function() {
    var c=cGet('topscorers'); if(c) return Promise.resolve(c);
    return apif('/players/topscorers',{league:CFG.APIF_WC_ID,season:CFG.SEASON})
      .then(function(r){
        var list=(r.response||[]).map(function(item){
          return {
            rank:       item.statistics[0]&&item.statistics[0].goals.total,
            name:       item.player.name,
            photo:      item.player.photo,
            nationality:item.player.nationality,
            team:       item.statistics[0]&&item.statistics[0].team.name,
            goals:      item.statistics[0]&&item.statistics[0].goals.total,
            assists:    item.statistics[0]&&item.statistics[0].goals.assists,
            apps:       item.statistics[0]&&item.statistics[0].games.appearences,
          };
        });
        cSet('topscorers',list,CFG.TTL_FIX); return list;
      });
  },

  /* ─────────────────────────────────────────────────────────
     NEW v3.0 — HEAD TO HEAD
     Returns last N meetings between two teams
  ───────────────────────────────────────────────────────── */
  headToHead: function(team1Id, team2Id, last) {
    var key='h2h_'+team1Id+'_'+team2Id;
    var c=cGet(key); if(c) return Promise.resolve(c);
    return apif('/fixtures/headtohead',{h2h:team1Id+'-'+team2Id,last:last||5})
      .then(function(r){
        var matches=(r.response||[]).map(nApif);
        cSet(key,matches,CFG.TTL_H2H); return matches;
      });
  },

  /* ─────────────────────────────────────────────────────────
     NEW v3.0 — INJURY REPORTS
     Returns current injuries for a team or all WC2026
  ───────────────────────────────────────────────────────── */
  injuries: function(teamId) {
    var key='inj_'+(teamId||'all');
    var c=cGet(key); if(c) return Promise.resolve(c);
    var params={ league:CFG.APIF_WC_ID, season:CFG.SEASON };
    if(teamId) params.team = teamId;
    return apif('/injuries',params)
      .then(function(r){
        var list=(r.response||[]).map(function(i){
          return {
            player:  i.player.name,
            photo:   i.player.photo,
            team:    i.team.name,
            type:    i.player.type,   /* 'Missing Fixture' | 'Questionable' */
            reason:  i.player.reason,
          };
        });
        cSet(key,list,CFG.TTL_FIX); return list;
      });
  },

  /* ─────────────────────────────────────────────────────────
     NEW v3.0 — MATCH PREDICTIONS
     Returns win probability for a fixture
  ───────────────────────────────────────────────────────── */
  predictions: function(fixtureId) {
    var c=cGet('pred_'+fixtureId); if(c) return Promise.resolve(c);
    return apif('/predictions',{fixture:fixtureId})
      .then(function(r){
        var p=r.response&&r.response[0];
        if(!p) throw new Error('No prediction');
        var pred={
          winner:      p.predictions&&p.predictions.winner&&p.predictions.winner.name,
          advice:      p.predictions&&p.predictions.advice,
          homeWin:     p.predictions&&p.predictions.percent&&p.predictions.percent.home,
          draw:        p.predictions&&p.predictions.percent&&p.predictions.percent.draw,
          awayWin:     p.predictions&&p.predictions.percent&&p.predictions.percent.away,
          homeForm:    p.teams&&p.teams.home&&p.teams.home.league&&p.teams.home.league.form,
          awayForm:    p.teams&&p.teams.away&&p.teams.away.league&&p.teams.away.league.form,
          source:      'api-football',
        };
        cSet('pred_'+fixtureId,pred,CFG.TTL_PRED); return pred;
      });
  },

  /* ─────────────────────────────────────────────────────────
     NEW v3.0 — NEWS RSS FEED
     Parses BBC Sport / Sky Sports RSS — no API key needed
     Proxy required for CORS — uses allorigins.win (free)
  ───────────────────────────────────────────────────────── */
  news: function(source) {
    var feeds = {
      bbc:   'https://feeds.bbci.co.uk/sport/football/rss.xml',
      sky:   'https://www.skysports.com/rss/12040',             /* Sky Sports Football */
      fifa:  'https://www.fifa.com/fifaplus/en/articles/rss',
    };
    source = source || 'bbc';
    var url = feeds[source] || feeds.bbc;
    var key = 'news_'+source;
    var c = cGet(key); if(c) return Promise.resolve(c);

    /* Use allorigins.win as CORS proxy — free, no key needed */
    var proxy = 'https://api.allorigins.win/get?url=' + encodeURIComponent(url);
    return fetch(proxy)
      .then(function(r){ return r.json(); })
      .then(function(res){
        var xml = res.contents;
        var parser = new DOMParser();
        var doc = parser.parseFromString(xml, 'text/xml');
        var items = Array.from(doc.querySelectorAll('item')).slice(0,20).map(function(item){
          return {
            title:   item.querySelector('title')&&item.querySelector('title').textContent,
            link:    item.querySelector('link')&&item.querySelector('link').textContent,
            desc:    item.querySelector('description')&&item.querySelector('description').textContent,
            pubDate: item.querySelector('pubDate')&&item.querySelector('pubDate').textContent,
            source:  source,
          };
        });
        /* Filter to World Cup relevant items */
        var wc = items.filter(function(i){
          return /world cup|wc2026|wc 2026|fifa|worldcup/i.test(i.title+' '+(i.desc||''));
        });
        var result = wc.length ? wc : items; /* fallback to all football news */
        cSet(key, result, CFG.TTL_NEWS);
        return result;
      });
  },

  /* ─────────────────────────────────────────────────────────
     NEW v3.0 — BRACKET
     Returns the knockout bracket slots from local data
     (no API needed — bracket doesn't change until R32 starts)
  ───────────────────────────────────────────────────────── */
  bracket: function() {
    /* Slot labels for 48-team WC2026 bracket */
    return Promise.resolve({
      roundOf32: [
        { slot:'1A', desc:'1st Group A vs 2nd Group B' },
        { slot:'1B', desc:'1st Group C vs 2nd Group D' },
        { slot:'1C', desc:'1st Group E vs 2nd Group F' },
        { slot:'1D', desc:'1st Group G vs 2nd Group H' },
        { slot:'1E', desc:'1st Group I vs 2nd Group J' },
        { slot:'1F', desc:'1st Group K vs 2nd Group L' },
        { slot:'1G', desc:'2nd Group A vs 1st Group B' },
        { slot:'1H', desc:'2nd Group C vs 1st Group D' },
        { slot:'1I', desc:'2nd Group E vs 1st Group F' },
        { slot:'1J', desc:'2nd Group G vs 1st Group H' },
        { slot:'1K', desc:'2nd Group I vs 1st Group J' },
        { slot:'1L', desc:'2nd Group K vs 1st Group L' },
        { slot:'1M', desc:'3rd Group A/B/C/D vs 3rd Group E/F/G/H' },
        { slot:'1N', desc:'3rd Group I/J/K/L vs TBD' },
        { slot:'1O', desc:'Best 3rd Group TBD' },
        { slot:'1P', desc:'Best 3rd Group TBD' },
      ],
      roundOf16: Array.from({length:8},function(_,i){ return { slot:'R16_'+(i+1), home:null, away:null, winner:null }; }),
      quarterFinals: Array.from({length:4},function(_,i){ return { slot:'QF_'+(i+1), home:null, away:null, winner:null }; }),
      semiFinals: Array.from({length:2},function(_,i){ return { slot:'SF_'+(i+1), home:null, away:null, winner:null }; }),
      thirdPlace: { slot:'3RD', home:null, away:null, winner:null },
      final:      { slot:'FINAL', home:null, away:null, winner:null,
                    date:'2026-07-19', venue:'MetLife Stadium, New Jersey' },
    });
  },

  /* ─────────────────────────────────────────────────────────
     NEW v3.0 — TODAY() — single merged call
     Returns today's matches with live scores merged in
  ───────────────────────────────────────────────────────── */
  today: function() {
    return Promise.all([ GC.todayFixtures(), GC.liveScores() ])
      .then(function(results){
        var fixtures = results[0], live = results[1];
        var liveMap = {};
        live.forEach(function(m){ liveMap[m.id] = m; });
        return fixtures.map(function(f){
          return liveMap[f.id] ? Object.assign({}, f, liveMap[f.id]) : f;
        });
      });
  },

  /* ─────────────────────────────────────────────────────────
     NEW v3.0 — WATCH — subscribe to live score updates
     callback(matches) fires every intervalMs (default 30s)
     Returns unsubscribe function
  ───────────────────────────────────────────────────────── */
  watch: function(callback, intervalMs) {
    intervalMs = intervalMs || CFG.TTL_LIVE;
    _watchers.push(callback);

    if (!_watchTimer) {
      _watchTimer = setInterval(function(){
        GC.liveScores().then(_notifyWatchers);
      }, intervalMs);
    }

    /* Immediate first call */
    GC.liveScores().then(function(m){ callback(m); });

    /* Return unsubscribe function */
    return function unwatch() {
      _watchers = _watchers.filter(function(cb){ return cb !== callback; });
      if (!_watchers.length && _watchTimer) {
        clearInterval(_watchTimer);
        _watchTimer = null;
      }
    };
  },

  /* ─────────────────────────────────────────────────────────
     NEW v3.0 — RENDER helpers
     Ready-made HTML strings for quick page integration
  ───────────────────────────────────────────────────────── */
  render: {

    /* Render a single match row */
    matchRow: function(m) {
      var hs = m.home.score !== null ? m.home.score : '';
      var as = m.away.score !== null ? m.away.score : '';
      var statusLabel = m.status==='live'  ? '<span style="color:#ef4444;font-weight:900;animation:gc-blink 1s infinite">🔴 '+( m.elapsed||'LIVE')+'\'</span>'
                      : m.status==='ht'   ? '<span style="color:#ea580c;font-weight:900">HT</span>'
                      : m.status==='ft'   ? '<span style="color:#15803d;font-weight:800">FT</span>'
                      : '<span style="color:#2563eb;font-weight:800">'+m.dateBST+'</span>';
      return '<div class="gc-match-row" data-id="'+m.id+'" data-status="'+m.status+'" style="display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:1px solid rgba(37,99,235,.06);font-size:11px;font-family:Verdana,sans-serif">'+
        '<span style="min-width:80px;text-align:center">'+statusLabel+'</span>'+
        '<span style="flex:1;font-weight:700;color:#0f172a">'+GC.flag(m.home.name)+' '+m.home.name+' <span style="color:#94a3b8">vs</span> '+GC.flag(m.away.name)+' '+m.away.name+'</span>'+
        '<span style="font-weight:900;color:#0f172a;min-width:30px;text-align:center">'+(hs!==''&&as!=='' ? hs+' – '+as : '–')+'</span>'+
        '<span style="font-size:9px;color:#94a3b8;min-width:50px;text-align:right">'+m.group+'</span>'+
      '</div>';
    },

    /* Render a standings table for one group */
    standingsTable: function(group) {
      var rows = group.table.map(function(r,i){
        var hl = i<2 ? 'border-left:3px solid '+(i===0?'#10b981':'#3b82f6')+';padding-left:5px' : '';
        return '<tr style="border-bottom:1px solid rgba(37,99,235,.05)">'+
          '<td style="padding:7px 3px;'+hl+'">'+r.pos+'</td>'+
          '<td style="padding:7px 3px;font-weight:700">'+r.flag+' '+r.team+'</td>'+
          '<td style="text-align:center;padding:7px 3px">'+r.p+'</td>'+
          '<td style="text-align:center;padding:7px 3px">'+r.w+'</td>'+
          '<td style="text-align:center;padding:7px 3px">'+r.d+'</td>'+
          '<td style="text-align:center;padding:7px 3px">'+r.l+'</td>'+
          '<td style="text-align:center;padding:7px 3px">'+r.gd+'</td>'+
          '<td style="text-align:center;padding:7px 3px;font-weight:900;color:#0f172a">'+r.pts+'</td>'+
        '</tr>';
      }).join('');
      return '<table style="width:100%;border-collapse:collapse;font-size:11px;font-family:Verdana,sans-serif">'+
        '<thead><tr style="border-bottom:2px solid rgba(37,99,235,.1)">'+
        '<th style="padding:4px 3px;text-align:left;font-size:9px;color:#94a3b8">#</th>'+
        '<th style="padding:4px 3px;text-align:left;font-size:9px;color:#94a3b8">TEAM</th>'+
        '<th style="padding:4px 3px;text-align:center;font-size:9px;color:#94a3b8">P</th>'+
        '<th style="padding:4px 3px;text-align:center;font-size:9px;color:#94a3b8">W</th>'+
        '<th style="padding:4px 3px;text-align:center;font-size:9px;color:#94a3b8">D</th>'+
        '<th style="padding:4px 3px;text-align:center;font-size:9px;color:#94a3b8">L</th>'+
        '<th style="padding:4px 3px;text-align:center;font-size:9px;color:#94a3b8">GD</th>'+
        '<th style="padding:4px 3px;text-align:center;font-size:9px;color:#94a3b8">PTS</th>'+
        '</tr></thead><tbody>'+rows+'</tbody></table>';
    },

    /* Render top scorers leaderboard */
    topScorers: function(list) {
      return list.slice(0,10).map(function(p,i){
        return '<div style="display:flex;align-items:center;gap:10px;padding:9px 14px;border-bottom:1px solid rgba(37,99,235,.06);font-size:11px;font-family:Verdana,sans-serif">'+
          '<span style="font-size:12px;font-weight:900;color:#94a3b8;min-width:20px">'+(i+1)+'</span>'+
          (p.photo ? '<img src="'+p.photo+'" style="width:28px;height:28px;border-radius:50%;object-fit:cover">' : '<span style="font-size:22px">'+GC.flag(p.nationality||p.team)+'</span>')+
          '<span style="flex:1;font-weight:700;color:#0f172a">'+p.name+'</span>'+
          '<span style="font-size:9px;color:#64748b">'+GC.flag(p.team)+' '+p.team+'</span>'+
          '<span style="font-size:14px;font-weight:900;color:#f59e0b;min-width:24px;text-align:right">'+p.goals+'⚽</span>'+
        '</div>';
      }).join('');
    },

    /* Render news feed items */
    newsFeed: function(items) {
      return items.slice(0,10).map(function(item){
        var ago = item.pubDate ? _timeAgo(new Date(item.pubDate)) : '';
        return '<a href="'+item.link+'" target="_blank" rel="noopener" style="display:flex;gap:10px;padding:11px 14px;border-bottom:1px solid rgba(37,99,235,.06);text-decoration:none;font-family:Verdana,sans-serif">'+
          '<div style="flex:1;min-width:0">'+
            '<div style="font-size:12px;font-weight:800;color:#0f172a;line-height:1.4;margin-bottom:3px">'+item.title+'</div>'+
            '<div style="font-size:10px;color:#94a3b8">'+item.source.toUpperCase()+(ago?' · '+ago:'')+'</div>'+
          '</div>'+
        '</a>';
      }).join('');
    },

    /* Render an event timeline (goals, cards, subs) */
    eventTimeline: function(events, homeTeam, awayTeam) {
      if (!events.length) return '<div style="padding:14px;text-align:center;color:#94a3b8;font-size:12px">No events yet</div>';
      return events.map(function(e){
        var icon = e.type==='goal'  ? (e.detail==='Own Goal'?'⚽ (OG)':'⚽')
                 : e.type==='card'  ? (e.detail==='Yellow Card'?'🟨':'🟥')
                 : e.type==='subst' ? '🔄' : '•';
        var isHome = e.team === homeTeam;
        return '<div style="display:flex;align-items:center;gap:8px;padding:6px 14px;font-size:11px;font-family:Verdana,sans-serif;'+(isHome?'':'flex-direction:row-reverse;text-align:right')+'">'+
          '<span style="font-size:10px;font-weight:900;color:#64748b;min-width:30px">'+e.time+'\'</span>'+
          '<span>'+icon+'</span>'+
          '<span style="font-weight:700;color:#0f172a">'+e.player+'</span>'+
          (e.assist ? '<span style="font-size:9px;color:#94a3b8">('+e.assist+')</span>' : '')+
        '</div>';
      }).join('');
    },
  },

  /* ─────────────────────────────────────────────────────────
     UTILITIES
  ───────────────────────────────────────────────────────── */
  setup: function(keys) {
    if(keys.apif){ localStorage.setItem('gc_apif_key',keys.apif); }
    if(keys.fd)  { localStorage.setItem('gc_fd_key',  keys.fd);   }
  },

  clearCache: function(key){ if(key){ delete _cache[key]; }else{ _cache={}; } },
  cacheStatus: function(){
    var out={};
    Object.keys(_cache).forEach(function(k){
      out[k]={ age:Math.round((Date.now()-_cache[k].t)/1000)+'s', remaining:Math.round((_cache[k].ttl-(Date.now()-_cache[k].t))/1000)+'s' };
    });
    return out;
  },

  status: function() {
    return { version:GC.version, apif:!!K.apif(), fd:!!K.fd(), tsdb:true, rss:true, local:typeof WC26!=='undefined' };
  },
};

/* ── INTERNAL HELPERS ──────────────────────────────────────── */
function _timeAgo(date) {
  var diff = Date.now() - date;
  if (diff < 60000)  return 'just now';
  if (diff < 3600000) return Math.floor(diff/60000)+'m ago';
  if (diff < 86400000) return Math.floor(diff/3600000)+'h ago';
  return Math.floor(diff/86400000)+'d ago';
}

/* Inject blink keyframe once */
if (!document.getElementById('gc-api-style')) {
  var s = document.createElement('style');
  s.id = 'gc-api-style';
  s.textContent = '@keyframes gc-blink{0%,100%{opacity:1}50%{opacity:.4}}';
  document.head.appendChild(s);
}

window.GC = GC;

})(window);
