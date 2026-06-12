/* /js/standings.js — renders all 12 group tables from window.WC26
   Same sort as groups.js: Points → GD → GF. Colours applied AFTER sorting.
   Zero hardcoded team data. */
(function () {
  'use strict';

  var root = document.getElementById('standings-root');
  if (!root) { console.error('[Standings] #standings-root not found'); return; }
  if (!window.WC26) {
    root.innerHTML = '<p style="color:var(--text-mid)">Standings are loading…</p>';
    console.error('[Standings] WC26 data not loaded');
    return;
  }

  var GROUPS = 'ABCDEFGHIJKL'.split('');
  var HOSTS = ['Mexico', 'Canada', 'USA'];

  function getTeams(letter) {
    var g = WC26.groups && (WC26.groups[letter] || WC26.groups['Group ' + letter]);
    if (!g) return null;
    var arr = g.teams || g;
    return arr.map(function (t) {
      return typeof t === 'string' ? t : (t.name || t.team);
    });
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function flagHTML(team) {
    /* WC26.flagImg returns a FULL <img> tag, so we build our own from the
       name→ISO map to control size (w80 source shown at 20×14, like the site standard) */
    var code = WC26.flags && WC26.flags[team];
    if (!code) return '';
    return '<img src="https://flagcdn.com/w80/' + code + '.png" alt="' + esc(team) +
      '" width="20" height="14" style="object-fit:cover;border-radius:4px;display:block" loading="lazy">';
  }

  function isFT(m) {
    return m.status === 'FT' &&
           typeof m.homeScore === 'number' &&
           typeof m.awayScore === 'number';
  }

  function buildRows(teams) {
    var stats = {};
    teams.forEach(function (t) {
      stats[t] = { team: t, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0 };
    });
    (WC26.schedule || []).forEach(function (m) {
      if (!isFT(m)) return;
      var h = stats[m.home], a = stats[m.away];
      if (!h || !a) return; /* match belongs to another group */
      h.p++; a.p++;
      h.gf += m.homeScore; h.ga += m.awayScore;
      a.gf += m.awayScore; a.ga += m.homeScore;
      if (m.homeScore > m.awayScore) { h.w++; a.l++; }
      else if (m.homeScore < m.awayScore) { a.w++; h.l++; }
      else { h.d++; a.d++; }
    });
    var rows = teams.map(function (t) {
      var r = stats[t];
      r.gd = r.gf - r.ga;
      r.pts = r.w * 3 + r.d;
      return r;
    });
    rows.sort(function (x, y) {
      return (y.pts - x.pts) || (y.gd - x.gd) || (y.gf - x.gf) ||
             x.team.localeCompare(y.team);
    });
    return rows;
  }

  function rowHTML(r, idx) {
    var cls = idx < 2 ? 'qualified' : (idx === 2 ? 'third' : '');
    var host = HOSTS.indexOf(r.team) !== -1
      ? '<span style="font-size:.6rem;background:var(--gold);color:#fff;padding:1px 5px;border-radius:4px;margin-left:4px">Host</span>'
      : '';
    return '<tr class="' + cls + '"><td><div class="gc-team-row">' + flagHTML(r.team) +
      '<span>' + esc(r.team) + host + '</span></div></td>' +
      '<td>' + r.p + '</td><td>' + r.w + '</td><td>' + r.d + '</td><td>' + r.l + '</td>' +
      '<td>' + r.gf + '</td><td>' + r.ga + '</td>' +
      '<td>' + (r.gd > 0 ? '+' : '') + r.gd + '</td>' +
      '<td style="font-weight:800">' + r.pts + '</td></tr>';
  }

  function groupHTML(letter) {
    var teams = getTeams(letter);
    if (!teams) return '';
    var rows = buildRows(teams);
    return '<div style="margin-bottom:28px">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">' +
      '<h2 class="gc-group-label" style="margin-bottom:0;border-bottom:none">Group ' + letter + '</h2>' +
      '<a href="/worldcup2026/groups/group-' + letter.toLowerCase() + '/" ' +
      'style="font-size:.72rem;color:var(--blue);text-decoration:none;font-weight:700;' +
      'border:1px solid rgba(37,99,235,.25);padding:3px 10px;border-radius:12px">View Group →</a></div>' +
      '<div style="font-size:.75rem;color:var(--text-light);margin-bottom:8px">' +
      teams.map(esc).join(' · ') + '</div>' +
      '<div style="overflow-x:auto"><table class="gc-standings-table">' +
      '<thead><tr><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th>' +
      '<th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr></thead>' +
      '<tbody>' + rows.map(rowHTML).join('') + '</tbody></table></div></div>';
  }

  function render() {
    root.innerHTML = GROUPS.map(groupHTML).join('');
  }

  window.renderStandings = render;   /* wc-results.js calls this after merging API results */
  render();
})();
