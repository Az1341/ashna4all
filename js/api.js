/* ============================================================
   api.js — Smart multi-source football data engine
   Priority: ESPN → TheSportsDB → API-Football
   goalcurrent.live
   ============================================================ */

var GC_API = (function () {

  var API_FOOTBALL_KEY = '5daaac9cb6e548983db1a90l1a97d9c9';

  /* ── League IDs ───────────────────────────────────────── */
  var IDS = {
    espn: {
      PL:  'eng.1',       // Premier League
      WC:  'fifa.world'   // World Cup
    },
    sportsdb: {
      PL:  '4328',        // Premier League
      WC:  '4429'         // World Cup
    },
    apifootball: {
      PL:  39,            // Premier League 2025/26
      WC:  1              // World Cup 2026
    }
  };

  /* ── Helpers ──────────────────────────────────────────── */
  function get(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function dateStr(d) {
    // accepts Date or 'YYYY-MM-DD'
    if (typeof d === 'string') return d;
    return d.toISOString().slice(0, 10);
  }

  /* ══════════════════════════════════════════════════════
     ESPN  (primary — free, no key, very reliable)
  ══════════════════════════════════════════════════════ */
  var ESPN = {

    _base: 'https://site.api.espn.com/apis/site/v2/sports/soccer/',

    /* live + today matches for a league */
    live: function (leagueId) {
      var url = this._base + leagueId + '/scoreboard';
      return get(url).then(function (data) {
        return ESPN._parseEvents(data.events || []);
      });
    },

    /* matches for a specific date */
    byDate: function (leagueId, date) {
      var d = dateStr(date).replace(/-/g, '');
      var url = this._base + leagueId + '/scoreboard?dates=' + d;
      return get(url).then(function (data) {
        return ESPN._parseEvents(data.events || []);
      });
    },

    /* standings */
    standings: function (leagueId) {
      var url = this._base + leagueId + '/standings';
      return get(url).then(function (data) {
        return ESPN._parseStandings(data);
      });
    },

    /* ── parsers ── */
    _parseEvents: function (events) {
      return events.map(function (ev) {
        var comp   = ev.competitions && ev.competitions[0] || {};
        var comps  = comp.competitors || [];
        var home   = comps.find(function(c){ return c.homeAway === 'home'; }) || {};
        var away   = comps.find(function(c){ return c.homeAway === 'away'; }) || {};
        var status = ev.status || {};
        var st     = status.type || {};
        var venue  = comp.venue || {};
        var bcast  = (comp.broadcasts || []).map(function(b){ return b.names && b.names[0]; }).filter(Boolean);

        /* scorers */
        var scorers = [];
        (comp.details || []).forEach(function (d) {
          if (d.type && d.type.text === 'Goal') {
            var p = d.athletesInvolved && d.athletesInvolved[0];
            scorers.push({
              player : p ? p.displayName : '',
              team   : d.team ? d.team.displayName : '',
              minute : d.clock ? d.clock.displayValue : ''
            });
          }
        });

        return {
          id       : ev.id,
          source   : 'espn',
          league   : ev.season && ev.season.type === 3 ? 'World Cup 2026' : (ev.league && ev.league.name || ''),
          homeTeam : home.team ? home.team.displayName : '',
          awayTeam : away.team ? away.team.displayName : '',
          homeLogo : home.team ? home.team.logo : '',
          awayLogo : away.team ? away.team.logo : '',
          homeScore: home.score != null ? home.score : null,
          awayScore: away.score != null ? away.score : null,
          status   : st.name || '',           // 'STATUS_IN_PROGRESS' etc.
          statusShort: st.shortDetail || '',  // '45\'' or 'FT'
          statusLong : st.description || '',  // 'In Progress'
          minute   : status.displayClock || '',
          isLive   : st.state === 'in',
          isFT     : st.state === 'post',
          isPre    : st.state === 'pre',
          kickoff  : ev.date || '',
          venue    : venue.fullName || '',
          city     : venue.address ? venue.address.city : '',
          tv       : bcast,
          scorers  : scorers
        };
      });
    },

    _parseStandings: function (data) {
      var groups = [];
      var children = (data.children || [data]);
      children.forEach(function (group) {
        var name    = group.name || group.abbreviation || '';
        var entries = [];
        var standings = group.standings || {};
        (standings.entries || []).forEach(function (e) {
          var stats = {};
          (e.stats || []).forEach(function (s) { stats[s.name] = s.value; });
          entries.push({
            team  : e.team ? e.team.displayName : '',
            logo  : e.team ? e.team.logo : '',
            played: stats.gamesPlayed || 0,
            won   : stats.wins || 0,
            drawn : stats.ties || 0,
            lost  : stats.losses || 0,
            gf    : stats.pointsFor || 0,
            ga    : stats.pointsAgainst || 0,
            gd    : stats.pointDifferential || 0,
            pts   : stats.points || 0
          });
        });
        if (entries.length) groups.push({ name: name, entries: entries });
      });
      return groups;
    }
  };

  /* ══════════════════════════════════════════════════════
     TheSportsDB  (secondary — free, no key needed)
  ══════════════════════════════════════════════════════ */
  var SportsDB = {

    _base: 'https://www.thesportsdb.com/api/v1/json/3/',

    /* events on a specific date for a league */
    byDate: function (leagueId, date) {
      var d = dateStr(date);
      var url = this._base + 'eventsday.php?d=' + d + '&l=' + leagueId;
      return get(url).then(function (data) {
        return SportsDB._parseEvents(data.events || []);
      });
    },

    /* live events */
    live: function () {
      var url = this._base + 'liveevents.php';
      return get(url).then(function (data) {
        return SportsDB._parseEvents(data.events || []);
      });
    },

    /* standings */
    standings: function (leagueId, season) {
      season = season || '2025-2026';
      var url = this._base + 'lookuptable.php?l=' + leagueId + '&s=' + season;
      return get(url).then(function (data) {
        return SportsDB._parseStandings(data.table || []);
      });
    },

    _parseEvents: function (events) {
      if (!events) return [];
      return events.map(function (e) {
        var homeScore = e.intHomeScore != null ? e.intHomeScore : null;
        var awayScore = e.intAwayScore != null ? e.intAwayScore : null;
        var finished  = e.strStatus === 'Match Finished' || e.strStatus === 'FT';
        var live      = e.strStatus === 'In Progress' || e.strStatus === 'HT';
        return {
          id       : e.idEvent,
          source   : 'sportsdb',
          league   : e.strLeague || '',
          homeTeam : e.strHomeTeam || '',
          awayTeam : e.strAwayTeam || '',
          homeLogo : e.strHomeTeamBadge || '',
          awayLogo : e.strAwayTeamBadge || '',
          homeScore: homeScore,
          awayScore: awayScore,
          status   : e.strStatus || '',
          statusShort: finished ? 'FT' : (live ? e.strStatus : ''),
          statusLong : e.strStatus || '',
          minute   : e.strProgress || '',
          isLive   : live,
          isFT     : finished,
          isPre    : !finished && !live,
          kickoff  : e.strTimestamp || (e.dateEvent + 'T' + (e.strTime || '00:00:00')),
          venue    : e.strVenue || '',
          city     : '',
          tv       : e.strTVStation ? [e.strTVStation] : [],
          scorers  : []
        };
      });
    },

    _parseStandings: function (table) {
      return [{ name: 'Standings', entries: table.map(function (r) {
        return {
          team  : r.strTeam || '',
          logo  : r.strTeamBadge || '',
          played: +r.intPlayed || 0,
          won   : +r.intWin || 0,
          drawn : +r.intDraw || 0,
          lost  : +r.intLoss || 0,
          gf    : +r.intGoalsFor || 0,
          ga    : +r.intGoalsAgainst || 0,
          gd    : +r.intGoalDifference || 0,
          pts   : +r.intPoints || 0
        };
      })}];
    }
  };

  /* ══════════════════════════════════════════════════════
     API-Football  (tertiary — 100 req/day limit)
  ══════════════════════════════════════════════════════ */
  var APIFootball = {

    _base: 'https://v3.football.api-sports.io/',

    _get: function (endpoint) {
      return fetch(this._base + endpoint, {
        headers: {
          'x-apisports-key': API_FOOTBALL_KEY
        }
      }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      });
    },

    live: function (leagueId, season) {
      season = season || 2026;
      return this._get('fixtures?live=all&league=' + leagueId + '&season=' + season)
        .then(function (data) {
          return APIFootball._parseFixtures(data.response || []);
        });
    },

    byDate: function (leagueId, date, season) {
      season = season || 2026;
      var d = dateStr(date);
      return this._get('fixtures?date=' + d + '&league=' + leagueId + '&season=' + season)
        .then(function (data) {
          return APIFootball._parseFixtures(data.response || []);
        });
    },

    standings: function (leagueId, season) {
      season = season || 2026;
      return this._get('standings?league=' + leagueId + '&season=' + season)
        .then(function (data) {
          var league = data.response && data.response[0] && data.response[0].league;
          return APIFootball._parseStandings(league ? league.standings : []);
        });
    },

    _parseFixtures: function (fixtures) {
      return fixtures.map(function (fx) {
        var f  = fx.fixture || {};
        var t  = fx.teams   || {};
        var g  = fx.goals   || {};
        var l  = fx.league  || {};
        var st = f.status   || {};
        var scorers = [];
        (fx.events || []).forEach(function (ev) {
          if (ev.type === 'Goal') {
            scorers.push({
              player : ev.player ? ev.player.name : '',
              team   : ev.team   ? ev.team.name   : '',
              minute : ev.time   ? ev.time.elapsed + (ev.time.extra ? '+' + ev.time.extra : '') + "'" : ''
            });
          }
        });
        return {
          id        : f.id,
          source    : 'apifootball',
          league    : l.name || '',
          homeTeam  : t.home ? t.home.name : '',
          awayTeam  : t.away ? t.away.name : '',
          homeLogo  : t.home ? t.home.logo : '',
          awayLogo  : t.away ? t.away.logo : '',
          homeScore : g.home != null ? g.home : null,
          awayScore : g.away != null ? g.away : null,
          status    : st.long  || '',
          statusShort: st.short || '',
          statusLong : st.long  || '',
          minute    : st.elapsed ? st.elapsed + "'" : '',
          isLive    : ['1H','2H','ET','BT','HT'].indexOf(st.short) > -1,
          isFT      : ['FT','AET','PEN'].indexOf(st.short) > -1,
          isPre     : st.short === 'NS',
          kickoff   : f.date || '',
          venue     : f.venue ? f.venue.name : '',
          city      : f.venue ? f.venue.city : '',
          tv        : [],
          scorers   : scorers
        };
      });
    },

    _parseStandings: function (standings) {
      if (!standings) return [];
      return standings.map(function (group, i) {
        return {
          name   : Array.isArray(standings) && standings.length > 1 ? ('Group ' + String.fromCharCode(65 + i)) : 'Standings',
          entries: group.map(function (t) {
            var all = t.all || {};
            return {
              team  : t.team ? t.team.name : '',
              logo  : t.team ? t.team.logo : '',
              played: all.played || 0,
              won   : all.win    || 0,
              drawn : all.draw   || 0,
              lost  : all.lose   || 0,
              gf    : all.goals  ? all.goals.for     : 0,
              ga    : all.goals  ? all.goals.against : 0,
              gd    : t.goalsDiff || 0,
              pts   : t.points   || 0
            };
          })
        };
      });
    }
  };

  /* ══════════════════════════════════════════════════════
     PUBLIC — Smart fetch with fallback
  ══════════════════════════════════════════════════════ */

  /* which ESPN league ID to use */
  function espnId(type) {
    return type === 'WC' ? IDS.espn.WC : IDS.espn.PL;
  }
  function sdbId(type) {
    return type === 'WC' ? IDS.sportsdb.WC : IDS.sportsdb.PL;
  }
  function afId(type) {
    return type === 'WC' ? IDS.apifootball.WC : IDS.apifootball.PL;
  }

  /* season helper — PL uses 2025 (for 2025/26), WC uses 2026 */
  function season(type) {
    return type === 'WC' ? 2026 : 2025;
  }

  return {

    /* Live matches — tries ESPN first */
    getLive: function (type) {
      type = type || 'PL';
      return ESPN.live(espnId(type))
        .catch(function () { return SportsDB.live(); })
        .catch(function () { return APIFootball.live(afId(type), season(type)); })
        .catch(function () { return []; });
    },

    /* Matches by date */
    getByDate: function (type, date) {
      type = type || 'PL';
      date = date || today();
      return ESPN.byDate(espnId(type), date)
        .catch(function () { return SportsDB.byDate(sdbId(type), date); })
        .catch(function () { return APIFootball.byDate(afId(type), date, season(type)); })
        .catch(function () { return []; });
    },

    /* Standings */
    getStandings: function (type) {
      type = type || 'WC';
      return ESPN.standings(espnId(type))
        .catch(function () { return SportsDB.standings(sdbId(type)); })
        .catch(function () { return APIFootball.standings(afId(type), season(type)); })
        .catch(function () { return []; });
    },

    /* Today's date string */
    today: today,

    /* Format kickoff time to local */
    formatKickoff: function (iso) {
      if (!iso) return '';
      var d = new Date(iso);
      return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    },

    /* Format date label */
    formatDate: function (iso) {
      if (!iso) return '';
      var d = new Date(iso);
      return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    }
  };

})();

/* ============================================================
   app.js — Navigation, draw engine, background canvas
   goalcurrent.live
   ============================================================ */

var GC = (function () {

  var currentPage = 'home';
  var currentType = 'PL'; // 'PL' or 'WC'

  /* ── draw() — main render dispatcher ─────────────────── */
  function draw() {
    var el = document.getElementById('gc-content');
    if (!el) return;
    el.innerHTML = '<div class="gc-loading"><div class="gc-spinner"></div><span>Loading...</span></div>';

    switch (currentPage) {
      case 'home':     if (window.GC_HOME)     GC_HOME.render(el);     break;
      case 'live':     if (window.GC_LIVE)     GC_LIVE.render(el);     break;
      case 'schedule': if (window.GC_SCHEDULE) GC_SCHEDULE.render(el); break;
      case 'groups':   if (window.GC_GROUPS)   GC_GROUPS.render(el);   break;
      default:         el.innerHTML = '<p style="padding:20px">Page not found.</p>';
    }
  }

  /* ── go() — navigate to a page ───────────────────────── */
  function go(page) {
    currentPage = page;

    // update nav buttons
    document.querySelectorAll('.gc-nav-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.page === page);
    });

    draw();
  }

  /* ── initNav() ────────────────────────────────────────── */
  function initNav() {
    document.querySelectorAll('.gc-nav-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        go(btn.dataset.page);
      });
    });

    // league toggle (PL / WC)
    document.querySelectorAll('.gc-league-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentType = btn.dataset.league;
        document.querySelectorAll('.gc-league-btn').forEach(function (b) {
          b.classList.toggle('active', b.dataset.league === currentType);
        });
        // notify modules of league change
        if (window.GC_LIVE)     GC_LIVE.setLeague(currentType);
        if (window.GC_SCHEDULE) GC_SCHEDULE.setLeague(currentType);
        if (window.GC_GROUPS)   GC_GROUPS.setLeague(currentType);
        draw();
      });
    });
  }

  /* ── Background canvas ────────────────────────────────── */
  function initCanvas() {
    var c = document.getElementById('gc-canvas');
    if (!c) return;
    var ctx = c.getContext('2d');

    function resize() {
      c.width  = window.innerWidth;
      c.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // floating particles
    var particles = [];
    for (var i = 0; i < 55; i++) {
      particles.push({
        x  : Math.random() * window.innerWidth,
        y  : Math.random() * window.innerHeight,
        r  : Math.random() * 2 + 0.5,
        vx : (Math.random() - .5) * 0.3,
        vy : (Math.random() - .5) * 0.3,
        a  : Math.random() * 0.4 + 0.1
      });
    }

    function tick() {
      ctx.clearRect(0, 0, c.width, c.height);
      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0)        p.x = c.width;
        if (p.x > c.width)  p.x = 0;
        if (p.y < 0)        p.y = c.height;
        if (p.y > c.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59,130,246,' + p.a + ')';
        ctx.fill();
      });
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ── Auto-refresh live scores every 60s ──────────────── */
  function startAutoRefresh() {
    setInterval(function () {
      if (currentPage === 'live') draw();
    }, 60000);
  }

  /* ── Public API ───────────────────────────────────────── */
  return {
    go          : go,
    draw        : draw,
    getType     : function () { return currentType; },
    getPage     : function () { return currentPage; },

    init: function () {
      initNav();
      initCanvas();
      startAutoRefresh();
      go('home'); // start on home page
    }
  };

})();

/* Boot on DOM ready */
document.addEventListener('DOMContentLoaded', function () {
  GC.init();
});

/* ============================================================
   groups.js — Standings: Premier League table + WC groups
   goalcurrent.live
   ============================================================ */

var GC_GROUPS = (function () {

  var _league = 'PL';

  function setLeague(type) { _league = type; }

  /* ── render ───────────────────────────────────────────── */
  function render(container) {
    container.innerHTML =
      '<div class="gc-loading"><div class="gc-spinner"></div><span>Loading standings...</span></div>';

    GC_API.getStandings(_league).then(function (groups) {
      if (!groups || !groups.length) {
        container.innerHTML = '<div class="gc-empty">📭 Standings not available yet.</div>';
        return;
      }
      container.innerHTML = buildHTML(groups);
    }).catch(function () {
      container.innerHTML = '<div class="gc-empty">⚠️ Could not load standings. Please try again.</div>';
    });
  }

  /* ── build HTML ─────────────────────────────────────────*/
  function buildHTML(groups) {
    var html = '<div class="gc-groups-wrap">';
    html += '<div class="gc-section-title">' +
            (_league === 'WC' ? '🏆 World Cup 2026 Groups' : '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League 2025/26') +
            '</div>';

    groups.forEach(function (g) {
      html += groupTable(g);
    });

    html += '</div>';
    return html;
  }

  function groupTable(group) {
    var html = '<div class="gc-group-card">';
    html += '<div class="gc-group-name">' + esc(group.name) + '</div>';

    html += '<table class="gc-table">';
    html += '<thead><tr>' +
            '<th class="gc-th-team">Team</th>' +
            '<th>P</th><th>W</th><th>D</th><th>L</th>' +
            '<th>GF</th><th>GA</th><th>GD</th>' +
            '<th class="gc-th-pts">Pts</th>' +
            '</tr></thead>';
    html += '<tbody>';

    group.entries.forEach(function (t, i) {
      var rowClass = '';
      if (_league === 'PL') {
        if (i < 4)  rowClass = 'gc-row-cl';     // Champions League
        if (i === 4) rowClass = 'gc-row-el';    // Europa League
        if (i >= group.entries.length - 3) rowClass = 'gc-row-rel'; // Relegation
      } else {
        if (i < 2) rowClass = 'gc-row-cl'; // qualify from group
      }

      html += '<tr class="gc-table-row ' + rowClass + '">';
      html += '<td class="gc-td-team">';
      html += '<span class="gc-table-pos">' + (i + 1) + '</span>';
      if (t.logo) html += '<img class="gc-table-logo" src="' + esc(t.logo) + '" alt="">';
      html += '<span class="gc-table-name">' + esc(t.team) + '</span>';
      html += '</td>';
      html += '<td>' + t.played + '</td>';
      html += '<td>' + t.won   + '</td>';
      html += '<td>' + t.drawn + '</td>';
      html += '<td>' + t.lost  + '</td>';
      html += '<td>' + t.gf   + '</td>';
      html += '<td>' + t.ga   + '</td>';
      html += '<td>' + (t.gd >= 0 ? '+' : '') + t.gd + '</td>';
      html += '<td class="gc-td-pts"><strong>' + t.pts + '</strong></td>';
      html += '</tr>';
    });

    html += '</tbody></table>';

    // legend
    if (_league === 'PL') {
      html += '<div class="gc-legend">' +
              '<span class="gc-leg gc-row-cl">Champions League</span>' +
              '<span class="gc-leg gc-row-el">Europa League</span>' +
              '<span class="gc-leg gc-row-rel">Relegation</span>' +
              '</div>';
    } else {
      html += '<div class="gc-legend">' +
              '<span class="gc-leg gc-row-cl">Advance to Round of 32</span>' +
              '</div>';
    }

    html += '</div>'; // .gc-group-card
    return html;
  }

  function esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return {
    render    : render,
    setLeague : setLeague
  };

})();

/* ============================================================
   home.js — Home page + countdown to World Cup / PL final day
   goalcurrent.live
   ============================================================ */

var GC_HOME = (function () {

  var _timer = null;

  /* ── Key dates ────────────────────────────────────────── */
  var DATES = {
    PL_FINAL : new Date('2026-05-24T16:00:00+01:00'), // PL final day
    WC_START : new Date('2026-06-11T17:00:00+01:00')  // World Cup 2026 opener
  };

  /* ── Countdown engine ─────────────────────────────────── */
  function getCountdown(target) {
    var now  = new Date();
    var diff = target - now;
    if (diff <= 0) return null;
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000)  / 60000);
    var s = Math.floor((diff % 60000)    / 1000);
    return { d: d, h: h, m: m, s: s };
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function tickCountdown() {
    /* PL countdown */
    var plEl = document.getElementById('gc-cd-pl');
    if (plEl) {
      var pl = getCountdown(DATES.PL_FINAL);
      if (pl) {
        plEl.innerHTML =
          unit(pl.d, 'Days') + unit(pl.h, 'Hrs') +
          unit(pl.m, 'Min')  + unit(pl.s, 'Sec');
      } else {
        plEl.innerHTML = '<span class="gc-cd-live">🏴󠁧󠁢󠁥󠁮󠁧󠁿 Final Day is ON!</span>';
      }
    }

    /* WC countdown */
    var wcEl = document.getElementById('gc-cd-wc');
    if (wcEl) {
      var wc = getCountdown(DATES.WC_START);
      if (wc) {
        wcEl.innerHTML =
          unit(wc.d, 'Days') + unit(wc.h, 'Hrs') +
          unit(wc.m, 'Min')  + unit(wc.s, 'Sec');
      } else {
        wcEl.innerHTML = '<span class="gc-cd-live">🌍 World Cup is LIVE!</span>';
      }
    }
  }

  function unit(n, label) {
    return '<div class="gc-cd-unit"><span class="gc-cd-num">' + pad(n) +
           '</span><span class="gc-cd-label">' + label + '</span></div>';
  }

  /* ── Render ───────────────────────────────────────────── */
  function render(container) {
    if (_timer) clearInterval(_timer);

    container.innerHTML =
      '<div class="gc-home">' +

        /* Hero */
        '<div class="gc-hero">' +
          '<div class="gc-hero-badge">⚽ LIVE SCORES</div>' +
          '<h1 class="gc-hero-title">GoalCurrent<span class="gc-hero-dot">.live</span></h1>' +
          '<p class="gc-hero-sub">Premier League · World Cup 2026 · Real-time scores & stats</p>' +
        '</div>' +

        /* PL Countdown card */
        '<div class="gc-card gc-cd-card">' +
          '<div class="gc-cd-header">' +
            '<img src="https://a.espncdn.com/i/leaguelogos/soccer/500/23.png" class="gc-cd-logo" alt="PL">' +
            '<div>' +
              '<div class="gc-cd-title">🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League Final Day</div>' +
              '<div class="gc-cd-date">Sunday 24 May 2026 · 4:00 PM UK</div>' +
            '</div>' +
          '</div>' +
          '<div class="gc-cd-units" id="gc-cd-pl"></div>' +
          '<button class="gc-btn gc-btn-primary" onclick="GC.go(\'live\')">Watch Live Scores →</button>' +
        '</div>' +

        /* WC Countdown card */
        '<div class="gc-card gc-cd-card gc-cd-wc-card">' +
          '<div class="gc-cd-header">' +
            '<span class="gc-cd-wc-icon">🏆</span>' +
            '<div>' +
              '<div class="gc-cd-title">World Cup 2026</div>' +
              '<div class="gc-cd-date">Kicks off 11 June 2026 · USA · Canada · Mexico</div>' +
            '</div>' +
          '</div>' +
          '<div class="gc-cd-units" id="gc-cd-wc"></div>' +
          '<button class="gc-btn gc-btn-gold" onclick="GC.go(\'schedule\')">View Full Schedule →</button>' +
        '</div>' +

        /* Quick links */
        '<div class="gc-quicklinks">' +
          '<button class="gc-ql-btn" onclick="GC.go(\'live\')">' +
            '<span class="gc-ql-icon">🔴</span><span>Live Scores</span>' +
          '</button>' +
          '<button class="gc-ql-btn" onclick="GC.go(\'schedule\')">' +
            '<span class="gc-ql-icon">📅</span><span>Schedule</span>' +
          '</button>' +
          '<button class="gc-ql-btn" onclick="GC.go(\'groups\')">' +
            '<span class="gc-ql-icon">🏅</span><span>Standings</span>' +
          '</button>' +
        '</div>' +

        /* Brevo email signup */
        '<div class="gc-card gc-signup-card">' +
          '<div class="gc-signup-title">📬 Get Goal Alerts by Email</div>' +
          '<div class="gc-signup-sub">Never miss a goal — World Cup & Premier League updates</div>' +
          '<a href="https://6f3982fe.sibforms.com/serve/MUIFAA..." target="_blank" class="gc-btn gc-btn-green">Subscribe Free →</a>' +
        '</div>' +

      '</div>';

    /* start countdown ticking */
    tickCountdown();
    _timer = setInterval(tickCountdown, 1000);
  }

  return { render: render };

})();

/* ============================================================
   live.js — Live scores, scorers, auto-refresh
   goalcurrent.live
   ============================================================ */

var GC_LIVE = (function () {

  var _league = 'PL';
  var _refreshTimer = null;

  function setLeague(type) { _league = type; }

  /* ── render ───────────────────────────────────────────── */
  function render(container) {
    if (_refreshTimer) clearInterval(_refreshTimer);

    container.innerHTML = loadingHTML();

    fetchAndRender(container);

    // auto-refresh every 60 seconds while on live tab
    _refreshTimer = setInterval(function () {
      fetchAndRender(container);
    }, 60000);
  }

  function fetchAndRender(container) {
    GC_API.getLive(_league).then(function (matches) {
      if (!matches || !matches.length) {
        // no live — try today's schedule
        GC_API.getByDate(_league, GC_API.today()).then(function (todayMatches) {
          container.innerHTML = buildHTML(todayMatches, true);
        });
      } else {
        container.innerHTML = buildHTML(matches, false);
      }
    }).catch(function () {
      container.innerHTML = errorHTML();
    });
  }

  /* ── HTML builders ────────────────────────────────────── */
  function buildHTML(matches, isToday) {
    if (!matches || !matches.length) {
      return noMatchesHTML();
    }

    // group by status: live first, then upcoming, then finished
    var live      = matches.filter(function(m){ return m.isLive; });
    var upcoming  = matches.filter(function(m){ return m.isPre; });
    var finished  = matches.filter(function(m){ return m.isFT; });

    var html = '<div class="gc-live-wrap">';

    // header
    html += '<div class="gc-section-header">';
    html += isToday
      ? '<span class="gc-section-title">📅 Today\'s Matches</span>'
      : '<span class="gc-section-title"><span class="gc-live-dot"></span> Live Now</span>';
    html += '<span class="gc-section-count">' + matches.length + ' matches</span>';
    html += '</div>';

    if (live.length) {
      html += '<div class="gc-group-label">🔴 In Progress</div>';
      live.forEach(function(m){ html += matchCard(m); });
    }
    if (upcoming.length) {
      html += '<div class="gc-group-label">⏰ Upcoming Today</div>';
      upcoming.forEach(function(m){ html += matchCard(m); });
    }
    if (finished.length) {
      html += '<div class="gc-group-label">✅ Full Time</div>';
      finished.forEach(function(m){ html += matchCard(m); });
    }

    html += '<div class="gc-refresh-note">⟳ Auto-refreshes every 60 seconds</div>';
    html += '</div>';
    return html;
  }

  function matchCard(m) {
    var homeWin = m.homeScore > m.awayScore;
    var awayWin = m.awayScore > m.homeScore;
    var hasScore = m.homeScore !== null && m.awayScore !== null;

    var html = '<div class="gc-match-card' + (m.isLive ? ' gc-match-live' : '') + '">';

    /* league + status row */
    html += '<div class="gc-match-meta">';
    html += '<span class="gc-match-league">' + esc(m.league) + '</span>';
    html += statusBadge(m);
    html += '</div>';

    /* teams + score */
    html += '<div class="gc-match-body">';

    // home team
    html += '<div class="gc-team gc-team-home">';
    if (m.homeLogo) html += '<img class="gc-team-logo" src="' + esc(m.homeLogo) + '" alt="">';
    html += '<span class="gc-team-name' + (homeWin ? ' gc-team-winner' : '') + '">' + esc(m.homeTeam) + '</span>';
    html += '</div>';

    // score
    html += '<div class="gc-score-wrap">';
    if (hasScore) {
      html += '<span class="gc-score' + (m.isLive ? ' gc-score-live' : '') + '">' +
              m.homeScore + ' <span class="gc-score-sep">–</span> ' + m.awayScore + '</span>';
    } else {
      html += '<span class="gc-score gc-score-ko">' + GC_API.formatKickoff(m.kickoff) + '</span>';
    }
    if (m.isLive && m.minute) {
      html += '<div class="gc-match-minute">' + esc(m.minute) + '</div>';
    }
    html += '</div>';

    // away team
    html += '<div class="gc-team gc-team-away">';
    if (m.awayLogo) html += '<img class="gc-team-logo" src="' + esc(m.awayLogo) + '" alt="">';
    html += '<span class="gc-team-name' + (awayWin ? ' gc-team-winner' : '') + '">' + esc(m.awayTeam) + '</span>';
    html += '</div>';

    html += '</div>'; // .gc-match-body

    /* scorers */
    if (m.scorers && m.scorers.length) {
      html += '<div class="gc-scorers">';
      m.scorers.forEach(function (s) {
        var isHome = s.team === m.homeTeam;
        html += '<div class="gc-scorer' + (isHome ? ' gc-scorer-home' : ' gc-scorer-away') + '">' +
                '⚽ ' + esc(s.player) +
                (s.minute ? ' <span class="gc-scorer-min">' + esc(s.minute) + '</span>' : '') +
                '</div>';
      });
      html += '</div>';
    }

    /* venue + TV */
    if (m.venue || (m.tv && m.tv.length)) {
      html += '<div class="gc-match-footer">';
      if (m.venue) html += '<span class="gc-venue">🏟 ' + esc(m.venue) + (m.city ? ', ' + esc(m.city) : '') + '</span>';
      if (m.tv && m.tv.length) html += '<span class="gc-tv">📺 ' + m.tv.map(esc).join(', ') + '</span>';
      html += '</div>';
    }

    html += '</div>'; // .gc-match-card
    return html;
  }

  function statusBadge(m) {
    if (m.isLive) {
      return '<span class="gc-badge gc-badge-live">🔴 ' + esc(m.statusShort || 'LIVE') + '</span>';
    }
    if (m.isFT) {
      return '<span class="gc-badge gc-badge-ft">FT</span>';
    }
    return '<span class="gc-badge gc-badge-pre">' + GC_API.formatKickoff(m.kickoff) + '</span>';
  }

  function loadingHTML() {
    return '<div class="gc-loading"><div class="gc-spinner"></div><span>Fetching live scores...</span></div>';
  }

  function noMatchesHTML() {
    return '<div class="gc-empty">📭 No matches found for today.<br><button class="gc-btn gc-btn-primary" onclick="GC.go(\'schedule\')">View Full Schedule</button></div>';
  }

  function errorHTML() {
    return '<div class="gc-empty">⚠️ Could not load scores. Please try again.<br><button class="gc-btn gc-btn-primary" onclick="GC_LIVE.render(document.getElementById(\'gc-content\'))">Retry</button></div>';
  }

  function esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;');
  }

  return {
    render    : render,
    setLeague : setLeague
  };

})();

/* ============================================================
   notifications.js — OneSignal push notifications
   goalcurrent.live
   ============================================================ */

var GC_NOTIFY = (function () {

  var APP_ID  = 'e6a77420-dc1d-4dae-895f-ee68950148f9';
  var REST_KEY = 'os_v2_app_42txiig4dvg25ck75zujkaki7ekky7dn5k3uhzeeljnes4t772nbpnydk4sfdwyppcjt5f6k32rzctubbeajvtaq74matbstdqj3xai';
  var SITE_URL = 'https://goalcurrent.live';

  /* ── OneSignal opt-in ─────────────────────────────────── */
  function optIn() {
    if (window.OneSignal) {
      try { OneSignal.User.PushSubscription.optIn(); } catch (e) {}
    }
  }

  /* ── Send push via REST API ───────────────────────────── */
  function push(title, message, url) {
    fetch('https://onesignal.com/api/v1/notifications', {
      method : 'POST',
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': 'Basic ' + REST_KEY
      },
      body: JSON.stringify({
        app_id           : APP_ID,
        included_segments: ['All'],
        headings         : { en: title },
        contents         : { en: message },
        url              : url || SITE_URL,
        web_push_topic   : 'match-event'
      })
    }).catch(function () {});
  }

  /* ── Goal celebration ─────────────────────────────────── */
  function onGoal(team, player, minute) {
    showGoalAnimation(team, player, minute);
    push(
      '⚽ GOAL! ' + team,
      (player ? player + ' · ' : '') + (minute || '') + ' — goalcurrent.live',
      SITE_URL
    );
  }

  /* ── Card celebration ─────────────────────────────────── */
  function onCard(colour, team, player, minute) {
    showCardAnimation(colour, player || team, minute);
    var em = colour === 'red' ? '🟥 RED CARD' : '🟨 Yellow Card';
    push(
      em + ' — ' + (player || team),
      team + (minute ? ' · ' + minute : '') + ' — goalcurrent.live',
      SITE_URL
    );
  }

  /* ── Sub celebration ──────────────────────────────────── */
  function onSub(team, playerOn, playerOff, minute) {
    showSubAnimation(team, playerOn, playerOff, minute);
    push(
      '🔄 Sub — ' + team,
      '🟢 ' + playerOn + (playerOff ? ' | 🔴 ' + playerOff : '') + (minute ? ' · ' + minute : ''),
      SITE_URL
    );
  }

  /* ══════════════════════════════════════════════════════
     Celebration animations
  ══════════════════════════════════════════════════════ */

  function showGoalAnimation(team, player, minute) {
    var el = createOverlay('gc-anim-goal');
    el.innerHTML =
      '<div class="gc-anim-inner">' +
        '<div class="gc-anim-icon">⚽</div>' +
        '<div class="gc-anim-title">GOAL!</div>' +
        '<div class="gc-anim-team">' + esc(team) + '</div>' +
        (player ? '<div class="gc-anim-player">' + esc(player) + (minute ? ' · ' + esc(minute) : '') + '</div>' : '') +
      '</div>';
    spawnConfetti(el, 60);
    showAndRemove(el, 3500);
  }

  function showCardAnimation(colour, player, minute) {
    var el = createOverlay('gc-anim-card');
    var icon = colour === 'red' ? '🟥' : '🟨';
    el.innerHTML =
      '<div class="gc-anim-inner">' +
        '<div class="gc-anim-icon">' + icon + '</div>' +
        '<div class="gc-anim-title">' + (colour === 'red' ? 'RED CARD' : 'YELLOW CARD') + '</div>' +
        '<div class="gc-anim-player">' + esc(player) + (minute ? ' · ' + esc(minute) : '') + '</div>' +
      '</div>';
    showAndRemove(el, 2500);
  }

  function showSubAnimation(team, playerOn, playerOff, minute) {
    var el = createOverlay('gc-anim-sub');
    el.innerHTML =
      '<div class="gc-anim-inner">' +
        '<div class="gc-anim-icon">🔄</div>' +
        '<div class="gc-anim-title">SUBSTITUTION</div>' +
        '<div class="gc-anim-team">' + esc(team) + '</div>' +
        '<div class="gc-anim-player">🟢 ' + esc(playerOn) + (playerOff ? ' | 🔴 ' + esc(playerOff) : '') + (minute ? ' · ' + esc(minute) : '') + '</div>' +
      '</div>';
    showAndRemove(el, 2500);
  }

  /* ── helpers ─────────────────────────────────────────── */
  function createOverlay(cls) {
    var el = document.createElement('div');
    el.className = 'gc-celebration ' + cls;
    document.body.appendChild(el);
    return el;
  }

  function showAndRemove(el, delay) {
    setTimeout(function () { el.classList.add('gc-anim-show'); }, 50);
    setTimeout(function () {
      el.classList.remove('gc-anim-show');
      setTimeout(function () { el.parentNode && el.parentNode.removeChild(el); }, 400);
    }, delay);
  }

  function spawnConfetti(parent, count) {
    var colours = ['#f97316','#22c55e','#2563eb','#facc15','#ec4899','#ffffff'];
    for (var i = 0; i < count; i++) {
      (function () {
        var dot = document.createElement('div');
        dot.className = 'gc-confetti-dot';
        dot.style.cssText =
          'left:' + (Math.random() * 100) + '%;' +
          'background:' + colours[Math.floor(Math.random() * colours.length)] + ';' +
          'animation-delay:' + (Math.random() * 0.6) + 's;' +
          'animation-duration:' + (0.8 + Math.random() * 0.8) + 's;';
        parent.appendChild(dot);
      })();
    }
  }

  function esc(str) {
    if (!str) return '';
    return String(str).replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  /* ── Test helpers (browser console) ──────────────────── */
  window.testGoal = function () { onGoal('England', 'Harry Kane', "23'"); };
  window.testCard = function (c) { onCard(c || 'yellow', 'Brazil', 'Vinicius Jr', "67'"); };
  window.testSub  = function () { onSub('France', 'Mbappé', 'Giroud', "72'"); };

  return {
    optIn : optIn,
    push  : push,
    onGoal: onGoal,
    onCard: onCard,
    onSub : onSub
  };

})();

/* Auto opt-in when OneSignal is ready */
if (window.OneSignal) {
  OneSignal.push(function () { GC_NOTIFY.optIn(); });
}

/* ============================================================
   schedule.js — Full schedule, date picker, past results
   goalcurrent.live
   ============================================================ */

var GC_SCHEDULE = (function () {

  var _league      = 'PL';
  var _selectedDate = null;

  function setLeague(type) { _league = type; }

  /* ── render ───────────────────────────────────────────── */
  function render(container) {
    if (!_selectedDate) _selectedDate = GC_API.today();
    container.innerHTML = buildShell();
    renderDateBar();
    loadMatches(container);
  }

  /* outer shell with date bar + content area */
  function buildShell() {
    return '<div class="gc-schedule-wrap">' +
      '<div class="gc-schedule-header">' +
        '<div class="gc-section-title">📅 Match Schedule</div>' +
      '</div>' +
      '<div class="gc-datebar" id="gc-datebar"></div>' +
      '<div id="gc-schedule-matches"></div>' +
    '</div>';
  }

  /* ── date bar — 7 days centred on today ──────────────── */
  function renderDateBar() {
    var bar = document.getElementById('gc-datebar');
    if (!bar) return;

    var days = [];
    var base = new Date();
    for (var i = -3; i <= 7; i++) {
      var d = new Date(base);
      d.setDate(base.getDate() + i);
      days.push(d);
    }

    var html = '';
    days.forEach(function (d) {
      var iso    = d.toISOString().slice(0, 10);
      var isToday = iso === GC_API.today();
      var isSel  = iso === _selectedDate;
      var weekday = d.toLocaleDateString('en-GB', { weekday: 'short' });
      var dayNum  = d.getDate();
      var mon     = d.toLocaleDateString('en-GB', { month: 'short' });

      html += '<button class="gc-date-btn' +
              (isToday ? ' gc-date-today' : '') +
              (isSel   ? ' gc-date-selected' : '') +
              '" data-date="' + iso + '" onclick="GC_SCHEDULE._pick(\'' + iso + '\')">' +
              '<span class="gc-date-wd">' + weekday + '</span>' +
              '<span class="gc-date-d">'  + dayNum  + '</span>' +
              '<span class="gc-date-m">'  + mon     + '</span>' +
              '</button>';
    });

    bar.innerHTML = html;

    // scroll selected into view
    setTimeout(function () {
      var sel = bar.querySelector('.gc-date-selected');
      if (sel) sel.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    }, 100);
  }

  /* ── pick a date ─────────────────────────────────────── */
  function pickDate(iso) {
    _selectedDate = iso;
    renderDateBar();
    var cont = document.getElementById('gc-schedule-matches');
    if (cont) loadMatches(cont);
  }

  /* ── fetch + render matches for selected date ─────────── */
  function loadMatches(container) {
    var target = typeof container === 'string'
      ? document.getElementById(container)
      : (container.id === 'gc-schedule-matches' ? container : document.getElementById('gc-schedule-matches'));

    if (!target) return;
    target.innerHTML = '<div class="gc-loading"><div class="gc-spinner"></div><span>Loading matches...</span></div>';

    GC_API.getByDate(_league, _selectedDate).then(function (matches) {
      target.innerHTML = buildMatchList(matches);
    }).catch(function () {
      target.innerHTML = '<div class="gc-empty">⚠️ Could not load matches. Please try again.</div>';
    });
  }

  function buildMatchList(matches) {
    if (!matches || !matches.length) {
      return '<div class="gc-empty">📭 No matches on this date.</div>';
    }

    // sort by kickoff time
    matches.sort(function (a, b) {
      return new Date(a.kickoff) - new Date(b.kickoff);
    });

    var html = '<div class="gc-match-list">';
    html += '<div class="gc-date-label">' + formatDayLabel(_selectedDate) + '</div>';

    matches.forEach(function (m) {
      html += scheduleCard(m);
    });

    html += '</div>';
    return html;
  }

  function scheduleCard(m) {
    var hasScore = m.homeScore !== null && m.awayScore !== null;
    var homeWin  = m.homeScore > m.awayScore;
    var awayWin  = m.awayScore > m.homeScore;

    var html = '<div class="gc-match-card' + (m.isLive ? ' gc-match-live' : '') + '">';

    // meta row
    html += '<div class="gc-match-meta">';
    html += '<span class="gc-match-league">' + esc(m.league) + '</span>';
    if (m.isLive) {
      html += '<span class="gc-badge gc-badge-live">🔴 ' + esc(m.statusShort || 'LIVE') + '</span>';
    } else if (m.isFT) {
      html += '<span class="gc-badge gc-badge-ft">Full Time</span>';
    } else {
      html += '<span class="gc-badge gc-badge-pre">⏰ ' + GC_API.formatKickoff(m.kickoff) + '</span>';
    }
    html += '</div>';

    // teams + score
    html += '<div class="gc-match-body">';

    html += '<div class="gc-team gc-team-home">';
    if (m.homeLogo) html += '<img class="gc-team-logo" src="' + esc(m.homeLogo) + '" alt="">';
    html += '<span class="gc-team-name' + (homeWin ? ' gc-team-winner' : '') + '">' + esc(m.homeTeam) + '</span>';
    html += '</div>';

    html += '<div class="gc-score-wrap">';
    if (hasScore) {
      html += '<span class="gc-score' + (m.isLive ? ' gc-score-live' : '') + '">' +
              m.homeScore + ' – ' + m.awayScore + '</span>';
    } else {
      html += '<span class="gc-score gc-score-ko">' + GC_API.formatKickoff(m.kickoff) + '</span>';
    }
    if (m.isLive && m.minute) {
      html += '<div class="gc-match-minute">' + esc(m.minute) + '</div>';
    }
    html += '</div>';

    html += '<div class="gc-team gc-team-away">';
    if (m.awayLogo) html += '<img class="gc-team-logo" src="' + esc(m.awayLogo) + '" alt="">';
    html += '<span class="gc-team-name' + (awayWin ? ' gc-team-winner' : '') + '">' + esc(m.awayTeam) + '</span>';
    html += '</div>';

    html += '</div>'; // .gc-match-body

    // scorers (past results)
    if (m.scorers && m.scorers.length) {
      html += '<div class="gc-scorers">';
      m.scorers.forEach(function (s) {
        var isHome = s.team === m.homeTeam;
        html += '<div class="gc-scorer' + (isHome ? ' gc-scorer-home' : ' gc-scorer-away') + '">' +
                '⚽ ' + esc(s.player) +
                (s.minute ? ' <span class="gc-scorer-min">' + esc(s.minute) + '</span>' : '') +
                '</div>';
      });
      html += '</div>';
    }

    // venue + TV
    if (m.venue || (m.tv && m.tv.length)) {
      html += '<div class="gc-match-footer">';
      if (m.venue) html += '<span class="gc-venue">🏟 ' + esc(m.venue) + (m.city ? ', ' + esc(m.city) : '') + '</span>';
      if (m.tv && m.tv.length) html += '<span class="gc-tv">📺 ' + m.tv.map(esc).join(', ') + '</span>';
      html += '</div>';
    }

    html += '</div>'; // .gc-match-card
    return html;
  }

  /* ── helpers ─────────────────────────────────────────── */
  function formatDayLabel(iso) {
    var d = new Date(iso);
    var today = GC_API.today();
    if (iso === today) return 'Today — ' + d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    var yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    if (iso === yesterday.toISOString().slice(0,10)) return 'Yesterday — ' + d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  function esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return {
    render    : render,
    setLeague : setLeague,
    _pick     : pickDate   // called from inline onclick
  };

})();
