/* ============================================================
   GOALCURRENT.LIVE — Multi-API Integration Layer
   gc-api.js | Version 2.0 | World Cup 2026
   
   API SOURCES (in priority order):
   ① API-Football     — Live scores, lineups, events, stats
   ② Football-Data.org — Fixtures, standings, results (free)
   ③ TheSportsDB      — Teams, players, logos, stadiums
   ④ Local JSON       — Groups, bracket, countdown, venues
   
   USAGE:
     <script src="/js/gc-api.js"></script>
     GC.liveScores().then(matches => ...)
     GC.fixtures('WC2026').then(data => ...)
     GC.standings('WC2026').then(tables => ...)
   
   API KEYS — stored in localStorage, never hardcoded:
     localStorage.setItem('gc_apif_key', 'YOUR_KEY')   — API-Football
     localStorage.setItem('gc_fd_key',   'YOUR_KEY')   — Football-Data.org
   ============================================================ */

(function(window) {
'use strict';

/* ── CONFIGURATION ─────────────────────────────────────────── */
var CFG = {
  /* API-Football (RapidAPI) */
  APIF_HOST:    'https://v3.football.api-sports.io',
  APIF_RAPID:   'api-sports.io',                    /* RapidAPI host */

  /* Football-Data.org */
  FD_HOST:      'https://api.football-data.org/v4',
  FD_WC_CODE:   'WC',                               /* competition code */

  /* TheSportsDB */
  TSDB_HOST:    'https://www.thesportsdb.com/api/v1/json',
  TSDB_KEY:     '3',                                /* free public key */

  /* World Cup 2026 IDs */
  APIF_WC_ID:   1,    /* API-Football World Cup league ID */
  FD_WC_ID:     2000, /* Football-Data.org competition ID */
  SEASON:       2026,

  /* Cache durations (ms) */
  CACHE_LIVE:   30000,   /* 30s  — live scores */
  CACHE_FIX:    300000,  /* 5min — fixtures */
  CACHE_STAND:  300000,  /* 5min — standings */
  CACHE_TEAM:   3600000, /* 1hr  — team data */
};

/* ── KEY MANAGEMENT ────────────────────────────────────────── */
var KEYS = {
  apif: function(){ return localStorage.getItem('gc_apif_key') || localStorage.getItem('fd_key'); },
  fd:   function(){ return localStorage.getItem('gc_fd_key')   || localStorage.getItem('fd_key'); },
};

/* ── IN-MEMORY CACHE ───────────────────────────────────────── */
var CACHE = {};
function cacheGet(key) {
  var item = CACHE[key];
  if (!item) return null;
  if (Date.now() - item.ts > item.ttl) { delete CACHE[key]; return null; }
  return item.data;
}
function cacheSet(key, data, ttl) {
  CACHE[key] = { data: data, ts: Date.now(), ttl: ttl || 60000 };
}

/* ── HTTP HELPERS ──────────────────────────────────────────── */
function fetchJSON(url, headers) {
  return fetch(url, { headers: headers || {} })
    .then(function(r) {
      if (!r.ok) throw new Error('HTTP ' + r.status + ' — ' + url);
      return r.json();
    });
}

function apifFetch(endpoint, params) {
  var key = KEYS.apif();
  if (!key) return Promise.reject(new Error('API-Football key not set. Use localStorage.setItem("gc_apif_key","YOUR_KEY")'));
  var qs = Object.keys(params || {}).map(function(k){ return k+'='+encodeURIComponent(params[k]); }).join('&');
  var url = CFG.APIF_HOST + endpoint + (qs ? '?'+qs : '');
  return fetchJSON(url, { 'x-apisports-key': key });
}

function fdFetch(endpoint, params) {
  var key = KEYS.fd();
  var qs = Object.keys(params || {}).map(function(k){ return k+'='+encodeURIComponent(params[k]); }).join('&');
  var url = CFG.FD_HOST + endpoint + (qs ? '?'+qs : '');
  var headers = key ? { 'X-Auth-Token': key } : {};
  return fetchJSON(url, headers);
}

function tsdbFetch(endpoint) {
  var url = CFG.TSDB_HOST + '/' + CFG.TSDB_KEY + endpoint;
  return fetchJSON(url);
}

/* ── NORMALISATION HELPERS ─────────────────────────────────── */
/* Convert API-Football match to GC standard format */
function normaliseApifMatch(m) {
  return {
    id:       m.fixture.id,
    source:   'api-football',
    status:   normaliseStatus(m.fixture.status.short),
    elapsed:  m.fixture.status.elapsed,
    date:     m.fixture.date,
    dateBST:  toBST(m.fixture.date),
    venue:    m.fixture.venue.name,
    group:    (m.league && m.league.round) || '',
    comp:     'WC2026',
    home:     { name: m.teams.home.name,  score: m.goals.home,  logo: m.teams.home.logo,  id: m.teams.home.id  },
    away:     { name: m.teams.away.name,  score: m.goals.away,  logo: m.teams.away.logo,  id: m.teams.away.id  },
    events:   [],   /* populated separately by matchEvents() */
    lineups:  [],   /* populated separately by lineups() */
  };
}

/* Convert Football-Data.org match */
function normaliseFdMatch(m) {
  return {
    id:       m.id,
    source:   'football-data',
    status:   normaliseStatus(m.status),
    elapsed:  null,
    date:     m.utcDate,
    dateBST:  toBST(m.utcDate),
    venue:    (m.venue && m.venue.name) || '',
    group:    m.stage || m.group || '',
    comp:     'WC2026',
    home:     { name: m.homeTeam.name, score: m.score.fullTime.home, id: m.homeTeam.id },
    away:     { name: m.awayTeam.name, score: m.score.fullTime.away, id: m.awayTeam.id },
    events:   [],
    lineups:  [],
  };
}

/* Unified status codes */
function normaliseStatus(raw) {
  var map = {
    'NS':'upcoming', 'TBD':'upcoming', 'SCHEDULED':'upcoming',
    '1H':'live',     '2H':'live',     'ET':'live',   'P':'live',
    'LIVE':'live',   'IN_PLAY':'live',
    'HT':'ht',
    'FT':'ft',       'AET':'ft',      'PEN':'ft',    'FINISHED':'ft',
    'PST':'postponed','CANC':'cancelled','SUSP':'suspended',
  };
  return map[raw] || raw.toLowerCase();
}

/* Convert UTC date string → BST display string */
function toBST(utcStr) {
  try {
    var d = new Date(utcStr);
    return d.toLocaleTimeString('en-GB', {
      hour: '2-digit', minute: '2-digit',
      timeZone: 'Europe/London'
    }) + ' BST';
  } catch(e) { return ''; }
}

/* ── FLAG MAP (shared across the site) ────────────────────── */
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
function flag(name) { return FLAGS[name] || FLAGS[name && name.replace(/\s+/g,' ')] || '🏳️'; }

/* ── PUBLIC API NAMESPACE ──────────────────────────────────── */
var GC = {

  flags: FLAGS,
  flag:  flag,

  /* ── 1. LIVE SCORES ─────────────────────────────────────
     Primary: API-Football /fixtures?live=all&league=1&season=2026
     Fallback: Football-Data.org /competitions/WC/matches?status=LIVE
  ─────────────────────────────────────────────────────── */
  liveScores: function() {
    var cached = cacheGet('live');
    if (cached) return Promise.resolve(cached);

    var apifKey = KEYS.apif();

    /* Primary — API-Football */
    var primary = apifKey
      ? apifFetch('/fixtures', { live: 'all', league: CFG.APIF_WC_ID, season: CFG.SEASON })
          .then(function(res) {
            if (!res.response || !res.response.length) throw new Error('No live matches');
            var matches = res.response.map(normaliseApifMatch);
            cacheSet('live', matches, CFG.CACHE_LIVE);
            return matches;
          })
      : Promise.reject(new Error('No API-Football key'));

    /* Fallback — Football-Data.org */
    var fallback = fdFetch('/competitions/' + CFG.FD_WC_ID + '/matches', { status: 'LIVE' })
      .then(function(res) {
        var matches = (res.matches || []).map(normaliseFdMatch);
        cacheSet('live', matches, CFG.CACHE_LIVE);
        return matches;
      });

    return primary.catch(function() { return fallback; });
  },

  /* ── 2. TODAY'S FIXTURES ────────────────────────────────
     Returns all matches for today (BST date)
     Primary: Football-Data.org (free, reliable)
     Fallback: Local SCHEDULE from worldcup-data.js
  ─────────────────────────────────────────────────────── */
  todayFixtures: function() {
    var cached = cacheGet('today');
    if (cached) return Promise.resolve(cached);

    var today = new Date();
    var ds = today.toISOString().slice(0,10); /* YYYY-MM-DD UTC */

    var primary = fdFetch('/competitions/' + CFG.FD_WC_ID + '/matches', {
      dateFrom: ds, dateTo: ds
    }).then(function(res) {
      var matches = (res.matches || []).map(normaliseFdMatch);
      cacheSet('today', matches, CFG.CACHE_FIX);
      return matches;
    });

    /* Fallback — use local SCHEDULE if available */
    var fallback = new Promise(function(resolve) {
      var local = (typeof WC26 !== 'undefined' && WC26.schedule && WC26.schedule[ds]) || [];
      resolve(local.map(function(m) {
        return {
          id: m.n, source: 'local',
          status: 'upcoming', dateBST: m.t + ' BST',
          home: { name: m.h, score: null }, away: { name: m.a, score: null },
          group: 'Group ' + m.g, comp: 'WC2026', venue: m.v || '',
        };
      }));
    });

    return primary.catch(function() { return fallback; });
  },

  /* ── 3. FULL FIXTURES (all WC2026 matches) ──────────────
     Primary: Football-Data.org
     Fallback: Local SCHEDULE data
  ─────────────────────────────────────────────────────── */
  fixtures: function() {
    var cached = cacheGet('fixtures');
    if (cached) return Promise.resolve(cached);

    return fdFetch('/competitions/' + CFG.FD_WC_ID + '/matches')
      .then(function(res) {
        var matches = (res.matches || []).map(normaliseFdMatch);
        cacheSet('fixtures', matches, CFG.CACHE_FIX);
        return matches;
      })
      .catch(function() {
        /* Fallback: flatten local SCHEDULE */
        if (typeof WC26 !== 'undefined' && WC26.schedule) {
          var all = [];
          Object.keys(WC26.schedule).sort().forEach(function(date) {
            WC26.schedule[date].forEach(function(m) {
              all.push({
                id: m.n, source: 'local', status: 'upcoming',
                date: date + 'T' + (String(parseInt(m.t)-1)).padStart(2,'0') + ':00:00Z',
                dateBST: m.t + ' BST', group: 'Group ' + m.g,
                comp: 'WC2026', venue: m.v || '', stage: m.s || 'Group Stage',
                home: { name: m.h, score: null }, away: { name: m.a, score: null },
              });
            });
          });
          return all;
        }
        return [];
      });
  },

  /* ── 4. STANDINGS ───────────────────────────────────────
     Primary: Football-Data.org /competitions/WC/standings
     Fallback: local zero-table from GROUPS data
  ─────────────────────────────────────────────────────── */
  standings: function() {
    var cached = cacheGet('standings');
    if (cached) return Promise.resolve(cached);

    return fdFetch('/competitions/' + CFG.FD_WC_ID + '/standings')
      .then(function(res) {
        var groups = (res.standings || []).map(function(grp) {
          return {
            group: grp.group || grp.stage,
            table: grp.table.map(function(row) {
              return {
                pos:    row.position,
                team:   row.team.name,
                teamId: row.team.id,
                flag:   flag(row.team.name),
                p:  row.playedGames,
                w:  row.won,  d: row.draw, l: row.lost,
                gf: row.goalsFor, ga: row.goalsAgainst,
                gd: row.goalDifference, pts: row.points,
              };
            }),
          };
        });
        cacheSet('standings', groups, CFG.CACHE_STAND);
        return groups;
      })
      .catch(function() {
        /* Fallback: build zero-table from local group data */
        if (typeof WC26 === 'undefined') return [];
        return Object.keys(WC26.groups || {}).map(function(letter) {
          return {
            group: 'Group ' + letter,
            table: (WC26.groups[letter] || []).map(function(name, i) {
              return { pos: i+1, team: name, flag: flag(name),
                       p:0, w:0, d:0, l:0, gf:0, ga:0, gd:0, pts:0 };
            }),
          };
        });
      });
  },

  /* ── 5. MATCH EVENTS (goals, cards, subs) ───────────────
     API-Football only — no free alternative
  ─────────────────────────────────────────────────────── */
  matchEvents: function(fixtureId) {
    var cKey = 'events_' + fixtureId;
    var cached = cacheGet(cKey);
    if (cached) return Promise.resolve(cached);

    return apifFetch('/fixtures/events', { fixture: fixtureId })
      .then(function(res) {
        var events = (res.response || []).map(function(e) {
          return {
            time:   e.time.elapsed,
            extra:  e.time.extra,
            team:   e.team.name,
            player: e.player.name,
            assist: e.assist && e.assist.name,
            type:   e.type.toLowerCase(),   /* 'goal','card','subst' */
            detail: e.detail,               /* 'Normal Goal','Yellow Card' etc */
          };
        });
        cacheSet(cKey, events, CFG.CACHE_LIVE);
        return events;
      });
  },

  /* ── 6. LINEUPS ─────────────────────────────────────────
     API-Football only — returns both teams' formations + XIs
  ─────────────────────────────────────────────────────── */
  lineups: function(fixtureId) {
    var cKey = 'lineups_' + fixtureId;
    var cached = cacheGet(cKey);
    if (cached) return Promise.resolve(cached);

    return apifFetch('/fixtures/lineups', { fixture: fixtureId })
      .then(function(res) {
        var lineups = (res.response || []).map(function(t) {
          return {
            team:       t.team.name,
            teamId:     t.team.id,
            formation:  t.formation,
            startXI:    (t.startXI || []).map(function(p) {
              return { name: p.player.name, number: p.player.number, pos: p.player.pos, grid: p.player.grid };
            }),
            subs:       (t.substitutes || []).map(function(p) {
              return { name: p.player.name, number: p.player.number, pos: p.player.pos };
            }),
            coach:      t.coach && t.coach.name,
          };
        });
        cacheSet(cKey, lineups, CFG.CACHE_LIVE);
        return lineups;
      });
  },

  /* ── 7. MATCH STATISTICS ────────────────────────────────
     API-Football — shots, possession, passes, corners etc
  ─────────────────────────────────────────────────────── */
  matchStats: function(fixtureId) {
    var cKey = 'stats_' + fixtureId;
    var cached = cacheGet(cKey);
    if (cached) return Promise.resolve(cached);

    return apifFetch('/fixtures/statistics', { fixture: fixtureId })
      .then(function(res) {
        var stats = {};
        (res.response || []).forEach(function(t) {
          stats[t.team.name] = {};
          t.statistics.forEach(function(s) {
            stats[t.team.name][s.type] = s.value;
          });
        });
        cacheSet(cKey, stats, CFG.CACHE_LIVE);
        return stats;
      });
  },

  /* ── 8. TEAM INFO (TheSportsDB) ─────────────────────────
     Returns logo, badge, formed, country, description
  ─────────────────────────────────────────────────────── */
  teamInfo: function(teamName) {
    var cKey = 'team_' + teamName;
    var cached = cacheGet(cKey);
    if (cached) return Promise.resolve(cached);

    return tsdbFetch('/searchteams.php?t=' + encodeURIComponent(teamName))
      .then(function(res) {
        var t = res.teams && res.teams[0];
        if (!t) throw new Error('Team not found: ' + teamName);
        var info = {
          name:        t.strTeam,
          country:     t.strCountry,
          formed:      t.intFormedYear,
          logo:        t.strTeamBadge || t.strTeamLogo,
          jersey:      t.strTeamJersey,
          stadium:     t.strStadium,
          stadiumDesc: t.strStadiumDescription,
          stadiumImg:  t.strStadiumThumb,
          stadiumCap:  t.intStadiumCapacity,
          description: t.strDescriptionEN,
          website:     t.strWebsite,
          source:      'thesportsdb',
        };
        cacheSet(cKey, info, CFG.CACHE_TEAM);
        return info;
      });
  },

  /* ── 9. STADIUM INFO (TheSportsDB) ──────────────────────
     Returns photos, capacity, location
  ─────────────────────────────────────────────────────── */
  stadiumInfo: function(stadiumName) {
    var cKey = 'stadium_' + stadiumName;
    var cached = cacheGet(cKey);
    if (cached) return Promise.resolve(cached);

    return tsdbFetch('/searchvenues.php?e=' + encodeURIComponent(stadiumName))
      .then(function(res) {
        var v = res.venues && res.venues[0];
        if (!v) throw new Error('Venue not found: ' + stadiumName);
        var info = {
          name:     v.strVenue,
          country:  v.strCountry,
          city:     v.strLocation,
          capacity: v.intCapacity,
          thumb:    v.strThumb,
          fanart:   v.strFanart1,
          desc:     v.strDescriptionEN,
          source:   'thesportsdb',
        };
        cacheSet(cKey, info, CFG.CACHE_TEAM);
        return info;
      });
  },

  /* ── 10. PLAYER SEARCH (TheSportsDB) ────────────────────
     Returns player photo, nationality, position, description
  ─────────────────────────────────────────────────────── */
  playerInfo: function(playerName) {
    var cKey = 'player_' + playerName;
    var cached = cacheGet(cKey);
    if (cached) return Promise.resolve(cached);

    return tsdbFetch('/searchplayers.php?p=' + encodeURIComponent(playerName))
      .then(function(res) {
        var p = res.player && res.player[0];
        if (!p) throw new Error('Player not found: ' + playerName);
        var info = {
          name:        p.strPlayer,
          nationality: p.strNationality,
          position:    p.strPosition,
          dob:         p.dateBorn,
          height:      p.strHeight,
          weight:      p.strWeight,
          photo:       p.strThumb || p.strCutout,
          description: p.strDescriptionEN,
          source:      'thesportsdb',
        };
        cacheSet(cKey, info, CFG.CACHE_TEAM);
        return info;
      });
  },

  /* ── 11. NEXT MATCH for a team ──────────────────────────
     Returns the next scheduled WC2026 match for a given team name
  ─────────────────────────────────────────────────────── */
  nextMatch: function(teamName) {
    return GC.fixtures().then(function(all) {
      var now = Date.now();
      var upcoming = all.filter(function(m) {
        var isTeam = (m.home.name === teamName || m.away.name === teamName);
        var isFuture = m.date ? new Date(m.date) > now : true;
        var notDone  = m.status === 'upcoming';
        return isTeam && (isFuture || notDone);
      });
      upcoming.sort(function(a,b){ return new Date(a.date) - new Date(b.date); });
      return upcoming[0] || null;
    });
  },

  /* ── 12. CACHE UTILITIES ────────────────────────────────*/
  clearCache: function(key) {
    if (key) { delete CACHE[key]; }
    else { CACHE = {}; }
    console.log('[gc-api] Cache cleared:', key || 'all');
  },

  cacheStatus: function() {
    var out = {};
    Object.keys(CACHE).forEach(function(k) {
      var age = Math.round((Date.now() - CACHE[k].ts) / 1000);
      var remaining = Math.round((CACHE[k].ttl - (Date.now() - CACHE[k].ts)) / 1000);
      out[k] = { age: age + 's', remaining: remaining + 's' };
    });
    return out;
  },

  /* ── 13. KEY SETUP HELPER ───────────────────────────────
     Call GC.setup({ apif: 'YOUR_KEY', fd: 'YOUR_KEY' })
     to store API keys securely in localStorage
  ─────────────────────────────────────────────────────── */
  setup: function(keys) {
    if (keys.apif) { localStorage.setItem('gc_apif_key', keys.apif); console.log('[gc-api] API-Football key saved.'); }
    if (keys.fd)   { localStorage.setItem('gc_fd_key',   keys.fd);   console.log('[gc-api] Football-Data key saved.'); }
    console.log('[gc-api] Setup complete. Keys stored in localStorage.');
  },

  /* ── 14. STATUS CHECK ───────────────────────────────────
     GC.status() — prints which APIs are configured
  ─────────────────────────────────────────────────────── */
  status: function() {
    console.group('[gc-api] GoalCurrent API Status');
    console.log('API-Football key:', KEYS.apif() ? '✅ Set' : '❌ Not set (live scores/lineups unavailable)');
    console.log('Football-Data key:', KEYS.fd() ? '✅ Set' : '⚠️  Not set (using anonymous — rate limited)');
    console.log('TheSportsDB:', '✅ Always available (free public key)');
    console.log('Local data:', typeof WC26 !== 'undefined' ? '✅ worldcup-data.js loaded' : '⚠️  worldcup-data.js not loaded');
    console.log('Cache entries:', Object.keys(CACHE).length);
    console.groupEnd();
    return {
      apif: !!KEYS.apif(),
      fd:   !!KEYS.fd(),
      tsdb: true,
      local: typeof WC26 !== 'undefined',
    };
  },
};

/* ── EXPORT ─────────────────────────────────────────────── */
window.GC = GC;

/* Auto-log status on load (dev only) */
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  GC.status();
}

})(window);
