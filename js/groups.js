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
