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
      WC:  'fifa.worldq' // World Cup 2026 qualifying/tournament
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
  var CORS = 'https://corsproxy.io/?';

  function get(url, useCors) {
    var fetchUrl = useCors ? (CORS + encodeURIComponent(url)) : url;
    return fetch(fetchUrl).then(function (r) {
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
      return get(url, true).then(function (data) {
        return ESPN._parseEvents(data.events || []);
      });
    },

    /* matches for a specific date */
    byDate: function (leagueId, date) {
      var d = dateStr(date).replace(/-/g, '');
      var url = this._base + leagueId + '/scoreboard?dates=' + d;
      return get(url, true).then(function (data) {
        return ESPN._parseEvents(data.events || []);
      });
    },

    /* standings */
    standings: function (leagueId) {
      var url = this._base + leagueId + '/standings?season=2025';
      return get(url, true).then(function (data) {
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
