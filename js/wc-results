/* /js/wc-results.js — AUTO RESULTS
   Fetches all WC fixtures from /api/scores?results=wc (api-football PRO, edge-cached)
   and merges finished scores into window.WC26.schedule in the browser.
   Manual results already in worldcup-data.js ALWAYS win (API never overwrites them).
   After each merge it calls window.renderStandings() / window.renderGroup() if present.
   Load order on a page: worldcup-data.js → renderer (standings.js/groups.js) → wc-results.js */
(function () {
  'use strict';
  if (!window.WC26 || !Array.isArray(WC26.schedule)) return;

  /* api-football name → worldcup-data.js name */
  var NAME_MAP = {
    'south korea': 'Korea Republic',
    'korea republic': 'Korea Republic',
    'czech republic': 'Czechia',
    'czechia': 'Czechia',
    'bosnia and herzegovina': 'Bosnia & Herzegovina',
    'bosnia herzegovina': 'Bosnia & Herzegovina',
    'usa': 'USA',
    'united states': 'USA',
    'turkiye': 'Turkey',
    'turkey': 'Turkey',
    'ivory coast': 'Ivory Coast',
    'cote d ivoire': 'Ivory Coast',
    'curacao': 'Curaçao',
    'cape verde islands': 'Cape Verde',
    'cape verde': 'Cape Verde',
    'congo dr': 'DR Congo',
    'dr congo': 'DR Congo',
    'ir iran': 'Iran',
    'iran': 'Iran'
  };

  function norm(n) {
    return String(n || '').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  /* Build lookup with normalised keys + all WC26 team names */
  var LOOKUP = {};
  Object.keys(NAME_MAP).forEach(function (k) { LOOKUP[norm(k)] = NAME_MAP[k]; });
  Object.keys(WC26.flags || {}).forEach(function (name) {
    if (!LOOKUP[norm(name)]) LOOKUP[norm(name)] = name;
  });

  function canon(apiName) { return LOOKUP[norm(apiName)] || null; }

  var FINISHED = ['FT', 'AET', 'PEN'];

  function findEntry(fx) {
    var kick = new Date(fx.utc).getTime();
    if (isNaN(kick)) return null;
    var h = canon(fx.home), a = canon(fx.away);
    for (var i = 0; i < WC26.schedule.length; i++) {
      var m = WC26.schedule[i];
      var t = new Date(m.utc).getTime();
      if (Math.abs(t - kick) > 3 * 3600 * 1000) continue;   /* same kick-off window */
      var teamHit = (h && m.home === h) || (a && m.away === a);
      if (teamHit) return m;
    }
    return null;
  }

  function merge(fixtures) {
    var changed = 0;
    fixtures.forEach(function (fx) {
      if (FINISHED.indexOf(fx.status) === -1) return;        /* only count FT results */
      if (fx.goalsHome == null || fx.goalsAway == null) return;
      var m = findEntry(fx);
      if (!m) { console.warn('[WC results] no match for', fx.home, 'vs', fx.away, fx.utc); return; }
      if (m.status === 'FT') return;                          /* manual edit wins */
      m.homeScore = Number(fx.goalsHome);
      m.awayScore = Number(fx.goalsAway);
      m.status = 'FT';
      changed++;
    });
    return changed;
  }

  function rerender() {
    if (typeof window.renderStandings === 'function') window.renderStandings();
    if (typeof window.renderGroup === 'function') window.renderGroup();
  }

  function poll() {
    fetch('/api/scores?results=wc', { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (data) {
        var n = merge(data.matches || []);
        if (n > 0) {
          console.info('[WC results] merged ' + n + ' new result(s) from api-football');
          rerender();
        }
      })
      .catch(function (e) { console.warn('[WC results] fetch failed:', e.message); });
  }

  poll();                       /* on page load */
  setInterval(poll, 120000);    /* and every 2 minutes */
})();
