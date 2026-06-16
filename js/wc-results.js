/* /js/wc-results.js - GoalCurrent.live
 * Merges finished WC2026 fixtures from /api/scores?results=wc into WC26.schedule.
 * All scores are API-driven — worldcup-data.js holds fixture metadata only.
 * Load order: worldcup-data.js -> page renderer -> wc-results.js -> wc-live-poll.js
 */
(function () {
  'use strict';

  if (!window.WC26 || !Array.isArray(WC26.schedule)) return;

  var FT_STATUSES = { FT:1, AET:1, PEN:1 };

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
    'iran':                   'IR Iran',
    'new zealand':            'New Zealand'
  };

  var LOOKUP = {};
  Object.keys(NAME_MAP).forEach(function (k) {
    LOOKUP[k.toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim()] = NAME_MAP[k];
  });
  Object.keys(WC26.flags || {}).forEach(function (name) {
    var key = name.toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!LOOKUP[key]) LOOKUP[key] = name;
  });

  function canon(apiName) {
    var key = String(apiName || '').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();
    return LOOKUP[key] || null;
  }

  function findSchedule(homeName, awayName) {
    var h = canon(homeName), a = canon(awayName);
    if (!h || !a) return null;
    for (var i = 0; i < WC26.schedule.length; i++) {
      var m = WC26.schedule[i];
      if (m.home === h && m.away === a) return m;
    }
    return null;
  }

  function mergeOne(sched, apiMatch) {
    var st = (apiMatch.status && apiMatch.status.short) || '';
    if (!FT_STATUSES[st]) return false;
    var hg = apiMatch.goals && apiMatch.goals.home;
    var ag = apiMatch.goals && apiMatch.goals.away;
    if (hg === null || hg === undefined || ag === null || ag === undefined) return false;
    sched.homeScore = Number(hg);
    sched.awayScore = Number(ag);
    sched.status = st;
    return true;
  }

  function notifyRenderers() {
    if (typeof window.renderStandings === 'function') window.renderStandings();
    if (typeof window.renderGroup === 'function') window.renderGroup();
    if (typeof window.renderLivePage === 'function') window.renderLivePage();
    if (typeof window.renderMatches === 'function') window.renderMatches();
    if (typeof window.renderFixtures === 'function') window.renderFixtures();
  }

  function markReady() {
    window.WC26_RESULTS_READY = true;
    document.dispatchEvent(new CustomEvent('WC26_results_ready'));
  }

  function mergeResults(matches) {
    var changed = 0;
    (matches || []).forEach(function (m) {
      var homeName = (m.home && m.home.name) || '';
      var awayName = (m.away && m.away.name) || '';
      var sched = findSchedule(homeName, awayName);
      if (!sched) return;
      if (mergeOne(sched, m)) changed++;
    });
    if (changed) console.info('[WC Results] merged', changed, 'finished matches from API');
    return changed > 0;
  }

  var _initial = true;

  function syncResults() {
    return fetch('/api/scores?results=wc', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (data) {
        var changed = mergeResults(data.matches);
        if (changed || _initial) notifyRenderers();
        _initial = false;
        markReady();
      })
      .catch(function (e) {
        console.warn('[WC Results] fetch failed:', e);
        if (_initial) notifyRenderers();
        _initial = false;
        markReady();
      });
  }

  syncResults();
  setInterval(syncResults, 300000);

  window.WC26_syncResults = syncResults;
})();
