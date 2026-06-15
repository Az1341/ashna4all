/* /js/wc-live-poll.js - GoalCurrent.live
 * ============================================================
 * Live match poller - polls /api/scores every 30s for
 * in-progress WC2026 matches and maintains window.WC26_LIVE:
 * a flat map of { "Home|Away": { hg, ag, elapsed, status } }
 *
 * NEVER writes to WC26.schedule — finished scores come from wc-results.js.
 *
 * Calls window.renderStandings() and window.renderGroup()
 * after every poll that returns data changes.
 *
 * Load order: worldcup-data.js -> renderer -> wc-live-poll.js
 * ============================================================ */
(function () {
  'use strict';

  if (!window.WC26 || !Array.isArray(WC26.schedule)) return;

  /* Live overlay - keyed by canonical "Home|Away" string */
  window.WC26_LIVE = window.WC26_LIVE || {};

  var LIVE_STATUSES = { '1H':1,'HT':1,'2H':1,'ET':1,'BT':1,'P':1,'INT':1,'LIVE':1 };

  /* Name normaliser - same logic as wc-results.js */
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

  var LOOKUP = {};
  Object.keys(NAME_MAP).forEach(function (k) {
    LOOKUP[k.toLowerCase().replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim()] = NAME_MAP[k];
  });
  Object.keys(WC26.flags || {}).forEach(function (name) {
    var key = name.toLowerCase().replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim();
    if (!LOOKUP[key]) LOOKUP[key] = name;
  });

  function canon(apiName) {
    var key = String(apiName || '').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim();
    return LOOKUP[key] || null;
  }

  /* Find matching entry in WC26.schedule by team names */
  function findSchedule(homeName, awayName) {
    var h = canon(homeName), a = canon(awayName);
    if (!h || !a) return null;
    for (var i = 0; i < WC26.schedule.length; i++) {
      var m = WC26.schedule[i];
      if (m.home === h && m.away === a) return m;
    }
    return null;
  }

  function liveKey(h, a) { return h + '|' + a; }

  var _lastHash = '';

  function poll() {
    fetch('/api/scores?live=true', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (data) {
        var matches = data.matches || [];
        var newLive = {};

        matches.forEach(function (m) {
          var statusShort = (m.status && m.status.short) || '';
          var homeName    = (m.home && m.home.name) || '';
          var awayName    = (m.away && m.away.name) || '';
          var sched       = findSchedule(homeName, awayName);
          if (!sched) return;

          var hg = (m.goals && m.goals.home != null) ? m.goals.home : null;
          var ag = (m.goals && m.goals.away != null) ? m.goals.away : null;
          var elapsed = (m.status && m.status.elapsed) || null;
          var key = liveKey(sched.home, sched.away);

          if (LIVE_STATUSES[statusShort]) {
            newLive[key] = {
              home:    sched.home,
              away:    sched.away,
              group:   sched.group,
              hg:      hg,
              ag:      ag,
              elapsed: elapsed,
              status:  statusShort,
              live:    true
            };
          }
        });

        /* Detect changes */
        var newHash = JSON.stringify(newLive);
        var changed = newHash !== _lastHash;
        _lastHash = newHash;

        /* Update global live overlay */
        window.WC26_LIVE = newLive;

        if (changed) {
          if (typeof window.renderStandings === 'function') window.renderStandings();
          if (typeof window.renderGroup     === 'function') window.renderGroup();
          if (typeof window.renderLivePage  === 'function') window.renderLivePage();
        }
      })
      .catch(function (e) {
        console.warn('[WC Live Poll] fetch failed:', e);
      });
  }

  /* Poll every 30 seconds. First call on load. */
  poll();
  setInterval(poll, 30000);

  /* Expose for manual trigger */
  window.WC26_pollLive = poll;

})();
