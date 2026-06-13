/* /js/standings.js - GoalCurrent.live
 * Renders all 12 group tables from window.WC26 + window.WC26_LIVE.
 * - FT matches: taken from WC26.schedule (status==='FT'/'AET'/'PEN')
 * - LIVE matches: in-progress goals from WC26_LIVE overlay ("as it stands")
 * - Sort: Points -> GD -> GF -> alphabetical
 * - Live rows highlighted with pulsing indicator
 * - wc-live-poll.js calls window.renderStandings() every 30s during live matches
 */
(function () {
  'use strict';

  var root = document.getElementById('standings-root');
  if (!root) { console.error('[Standings] #standings-root not found'); return; }
  if (!window.WC26) {
    root.innerHTML = '<p style="color:var(--text-mid)">Standings are loading...</p>';
    console.error('[Standings] WC26 data not loaded');
    return;
  }

  var GROUPS = 'ABCDEFGHIJKL'.split('');
  var HOSTS  = ['Mexico', 'Canada', 'USA'];

  function esc(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function flagHTML(team) {
    var code = WC26.flags && WC26.flags[team];
    if (!code) return '';
    return '<img src="https://flagcdn.com/w80/' + code + '.png" alt="' + esc(team) +
      '" width="20" height="14" style="object-fit:cover;border-radius:4px;display:block" loading="lazy">';
  }

  /* Returns true for confirmed finished matches */
  function isFT(m) {
    return (m.status === 'FT' || m.status === 'AET' || m.status === 'PEN') &&
           typeof m.homeScore === 'number' &&
           typeof m.awayScore === 'number';
  }

  /* Build standings for a group letter.
     Merges confirmed FT results + live in-progress goals. */
  function buildRows(letter) {
    var teams = WC26.groups && WC26.groups[letter];
    if (!teams) return [];

    /* Initialise stats */
    var stats = {};
    teams.forEach(function (t) {
      stats[t] = { team:t, p:0, w:0, d:0, l:0, gf:0, ga:0, liveMatch:null };
    });

    /* Step 1: confirmed FT matches from WC26.schedule */
    (WC26.schedule || []).forEach(function (m) {
      if (m.group !== letter) return;
      if (!isFT(m)) return;
      var H = stats[m.home], A = stats[m.away];
      if (!H || !A) return;
      H.p++; A.p++;
      H.gf += m.homeScore; H.ga += m.awayScore;
      A.gf += m.awayScore; A.ga += m.homeScore;
      if      (m.homeScore > m.awayScore) { H.w++; A.l++; }
      else if (m.homeScore < m.awayScore) { A.w++; H.l++; }
      else                                { H.d++; A.d++; }
    });

    /* Step 2: live in-progress matches ("as it stands") from WC26_LIVE */
    var liveOverlay = window.WC26_LIVE || {};
    Object.keys(liveOverlay).forEach(function (key) {
      var lm = liveOverlay[key];
      if (!lm.live) return;
      if (lm.group !== letter) return;
      var H = stats[lm.home], A = stats[lm.away];
      if (!H || !A) return;
      if (lm.hg === null || lm.ag === null) return;
      /* Add live contribution ON TOP of FT stats already counted */
      H.p++; A.p++;
      H.gf += lm.hg; H.ga += lm.ag;
      A.gf += lm.ag; A.ga += lm.hg;
      if      (lm.hg > lm.ag) { H.w++; A.l++; }
      else if (lm.hg < lm.ag) { A.w++; H.l++; }
      else                     { H.d++; A.d++; }
      /* Tag teams with live match info for visual indicator */
      H.liveMatch = lm;
      A.liveMatch = lm;
    });

    /* Compute GD and Pts */
    var rows = teams.map(function (t) {
      var r = stats[t];
      r.gd  = r.gf - r.ga;
      r.pts = r.w * 3 + r.d;
      return r;
    });

    /* Sort: Points -> GD -> GF -> alpha */
    rows.sort(function (x, y) {
      return (y.pts - x.pts) || (y.gd - x.gd) || (y.gf - x.gf) ||
             x.team.localeCompare(y.team);
    });
    return rows;
  }

  /* Check if any match is live in a group */
  function groupHasLive(letter) {
    var liveOverlay = window.WC26_LIVE || {};
    return Object.keys(liveOverlay).some(function (key) {
      var lm = liveOverlay[key];
      return lm.live && lm.group === letter;
    });
  }

  function livePill(lm) {
    if (!lm) return '';
    var min = lm.elapsed ? lm.elapsed + "'" : lm.status;
    return '<span style="display:inline-block;background:#dc2626;color:#fff;' +
           'font-size:.6rem;font-weight:800;padding:1px 6px;border-radius:999px;' +
           'margin-left:6px;vertical-align:middle;animation:gc-pulse 1.4s infinite">' +
           'LIVE ' + esc(min) + '</span>';
  }

  function rowHTML(r, idx) {
    var cls     = idx < 2 ? 'qualified' : (idx === 2 ? 'third' : '');
    var hostTag = HOSTS.indexOf(r.team) !== -1
      ? '<span style="font-size:.6rem;background:var(--gold);color:#fff;padding:1px 5px;border-radius:4px;margin-left:4px">Host</span>'
      : '';
    var livePillHTML = r.liveMatch ? livePill(r.liveMatch) : '';
    return '<tr class="' + cls + '">' +
      '<td><div class="gc-team-row">' + flagHTML(r.team) +
      '<span>' + esc(r.team) + hostTag + livePillHTML + '</span></div></td>' +
      '<td>' + r.p + '</td><td>' + r.w + '</td><td>' + r.d + '</td><td>' + r.l + '</td>' +
      '<td>' + r.gf + '</td><td>' + r.ga + '</td>' +
      '<td>' + (r.gd > 0 ? '+' : '') + r.gd + '</td>' +
      '<td style="font-weight:800">' + r.pts + '</td></tr>';
  }

  function groupHTML(letter) {
    var teams = WC26.groups && WC26.groups[letter];
    if (!teams) return '';
    var rows    = buildRows(letter);
    var hasLive = groupHasLive(letter);
    var liveTag = hasLive
      ? '<span style="font-size:.65rem;background:#dc2626;color:#fff;' +
        'padding:2px 8px;border-radius:999px;margin-left:8px;' +
        'animation:gc-pulse 1.4s infinite">AS IT STANDS</span>'
      : '';
    return '<div style="margin-bottom:28px">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">' +
      '<h2 class="gc-group-label" style="margin-bottom:0;border-bottom:none">' +
      'Group ' + letter + liveTag + '</h2>' +
      '<a href="/worldcup2026/groups/group-' + letter.toLowerCase() + '/" ' +
      'style="font-size:.72rem;color:var(--blue);text-decoration:none;font-weight:700;' +
      'border:1px solid rgba(37,99,235,.25);padding:3px 10px;border-radius:12px">View Group -></a>' +
      '</div>' +
      '<div style="font-size:.75rem;color:var(--text-light);margin-bottom:8px">' +
      teams.map(esc).join(' - ') + '</div>' +
      '<div style="overflow-x:auto"><table class="gc-standings-table">' +
      '<thead><tr><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th>' +
      '<th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr></thead>' +
      '<tbody>' + rows.map(rowHTML).join('') + '</tbody>' +
      '</table></div></div>';
  }

  /* Inject pulse keyframe once */
  if (!document.getElementById('gc-pulse-style')) {
    var st = document.createElement('style');
    st.id  = 'gc-pulse-style';
    st.textContent = '@keyframes gc-pulse{0%,100%{opacity:1}50%{opacity:.5}}';
    document.head.appendChild(st);
  }

  function render() {
    root.innerHTML = GROUPS.map(groupHTML).join('');
  }

  window.renderStandings = render;
  render();
})();
