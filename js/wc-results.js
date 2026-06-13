(function () {
  'use strict';
  if (!window.WC26 || !Array.isArray(WC26.schedule)) return;

  var NAME_MAP = {
    'south korea':            'Korea Republic',
    'korea republic':         'Korea Republic',
    'czech republic':         'Czechia',
    'czechia':                'Czechia',
    'bosnia and herzegovina': 'Bosnia & Herzegovina',
    'bosnia herzegovina':     'Bosnia & Herzegovina',
    'usa':                    'USA',
    'united states':          'USA',
    'turkiye':                'Türkiye',
    'turkey':                 'Türkiye',
    'ivory coast':            "Côte d'Ivoire",
    'cote d ivoire':          "Côte d'Ivoire",
    'curacao':                'Curaçao',
    'cape verde islands':     'Cabo Verde',
    'cape verde':             'Cabo Verde',
    'cabo verde':             'Cabo Verde',
    'congo dr':               'Congo DR',
    'dr congo':               'Congo DR',
    'ir iran':                'IR Iran',
    'iran':                   'IR Iran'
  };

  function norm(n) {
    return String(n || '').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  var LOOKUP = {};
  Object.keys(NAME_MAP).forEach(function (k) { LOOKUP[norm(k)] = NAME_MAP[k]; });
  Object.keys(WC26.flags || {}).forEach(function (name) {
    if (!LOOKUP[norm(name)]) LOOKUP[norm(name)] = name;
  });

  function canon(apiName) { return LOOKUP[norm(apiName)] || null; }

  var FINISHED = ['FT', 'AET', 'PEN'];
  var LIVE_ST  = {'1H':1,'HT':1,'2H':1,'ET':1,'BT':1,'P':1,'INT':1,'LIVE':1};

  /* Extract fields defensively — handles BOTH old and new api/scores.js shapes */
  function extractFields(fx) {
    /* status: object {short,elapsed} or plain string */
    var statusShort, elapsed, goalsHome, goalsAway, utcStr, homeName, awayName;

    if (fx.status && typeof fx.status === 'object') {
      statusShort = fx.status.short || '';
      elapsed     = fx.status.elapsed || null;
    } else {
      statusShort = String(fx.status || '');
      elapsed     = null;
    }

    /* goals: {home,away} object or top-level goalsHome/goalsAway */
    if (fx.goals && typeof fx.goals === 'object') {
      goalsHome = fx.goals.home;
      goalsAway = fx.goals.away;
    } else {
      goalsHome = fx.goalsHome != null ? fx.goalsHome : null;
      goalsAway = fx.goalsAway != null ? fx.goalsAway : null;
    }

    /* fulltime score fallback when goals object is null mid-match */
    if ((goalsHome == null || goalsAway == null) &&
        fx.score && fx.score.fulltime) {
      if (fx.score.fulltime.home != null) goalsHome = fx.score.fulltime.home;
      if (fx.score.fulltime.away != null) goalsAway = fx.score.fulltime.away;
    }

    /* UTC: prefer fx.utc alias, then fx.date, then reconstruct from timestamp */
    utcStr = fx.utc || fx.date || null;
    if (!utcStr && fx.timestamp) {
      utcStr = new Date(fx.timestamp * 1000).toISOString();
    }

    /* team names: object {name} or plain string */
    homeName = (fx.home && typeof fx.home === 'object') ? fx.home.name : String(fx.home || '');
    awayName = (fx.away && typeof fx.away === 'object') ? fx.away.name : String(fx.away || '');

    return { statusShort:statusShort, elapsed:elapsed,
             goalsHome:goalsHome, goalsAway:goalsAway,
             utcStr:utcStr, homeName:homeName, awayName:awayName };
  }

  /* Find matching WC26.schedule entry.
     Strategy 1: UTC time window + one team name match.
     Strategy 2: both team names match regardless of time (handles clock drift). */
  function findEntry(homeName, awayName, utcStr) {
    var h = canon(homeName);
    var a = canon(awayName);

    /* Strategy 2 first — most reliable when both names resolve */
    if (h && a) {
      for (var i = 0; i < WC26.schedule.length; i++) {
        var m = WC26.schedule[i];
        if (m.home === h && m.away === a) return m;
      }
    }

    /* Strategy 1 — time window + one team */
    if (utcStr) {
      var kick = new Date(utcStr).getTime();
      if (!isNaN(kick)) {
        for (var j = 0; j < WC26.schedule.length; j++) {
          var s = WC26.schedule[j];
          var t = new Date(s.utc).getTime();
          if (Math.abs(t - kick) > 3 * 3600 * 1000) continue;
          if ((h && s.home === h) || (a && s.away === a)) return s;
        }
      }
    }

    return null;
  }

  /* Merge finished results into WC26.schedule */
  function mergeFinished(fixtures) {
    var changed = 0;
    fixtures.forEach(function (fx) {
      var f = extractFields(fx);
      if (FINISHED.indexOf(f.statusShort) === -1) return;
      if (f.goalsHome == null || f.goalsAway == null) return;
      var m = findEntry(f.homeName, f.awayName, f.utcStr);
      if (!m) {
        console.warn('[WC results] no schedule entry for:', f.homeName, 'vs', f.awayName);
        return;
      }
      /* Manual FT entry in worldcup-data.js always wins */
      if (m.status === 'FT' || m.status === 'AET' || m.status === 'PEN') return;
      m.homeScore = Number(f.goalsHome);
      m.awayScore = Number(f.goalsAway);
      m.status    = f.statusShort; /* FT | AET | PEN */
      changed++;
    });
    return changed;
  }

  /* Merge live/in-progress matches into WC26_LIVE overlay */
  function mergeLive(fixtures) {
    var overlay = window.WC26_LIVE = window.WC26_LIVE || {};
    fixtures.forEach(function (fx) {
      var f = extractFields(fx);
      if (!LIVE_ST[f.statusShort]) return;
      var m = findEntry(f.homeName, f.awayName, f.utcStr);
      if (!m) return;
      var key = m.home + '|' + m.away;
      overlay[key] = {
        home:    m.home,
        away:    m.away,
        group:   m.group,
        hg:      f.goalsHome,
        ag:      f.goalsAway,
        elapsed: f.elapsed,
        status:  f.statusShort,
        live:    true,
        ft:      false
      };
    });
  }

  /* Remove ended matches from live overlay */
  function cleanLiveOverlay(fixtures) {
    var overlay = window.WC26_LIVE || {};
    fixtures.forEach(function (fx) {
      var f = extractFields(fx);
      if (FINISHED.indexOf(f.statusShort) === -1) return;
      var m = findEntry(f.homeName, f.awayName, f.utcStr);
      if (!m) return;
      var key = m.home + '|' + m.away;
      delete overlay[key];
    });
  }

  function rerender() {
    if (typeof window.renderStandings === 'function') window.renderStandings();
    if (typeof window.renderGroup     === 'function') window.renderGroup();
    if (typeof window.renderFixtures  === 'function') window.renderFixtures();
    if (typeof window.renderLivePage  === 'function') window.renderLivePage();
  }

  function poll() {
    fetch('/api/scores?results=wc', { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        var matches = data.matches || [];
        mergeLive(matches);
        cleanLiveOverlay(matches);
        var n = mergeFinished(matches);
        if (n > 0) {
          console.info('[WC results] merged ' + n + ' new FT result(s)');
        }
        /* Always re-render — live overlay may have changed even if no new FT */
        rerender();
      })
      .catch(function (e) {
        console.warn('[WC results] poll failed:', e.message);
      });
  }

  poll();
  setInterval(poll, 60000);

})();
