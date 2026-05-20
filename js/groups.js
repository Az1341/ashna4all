/* groups.js — PL standings + WC groups + knockout bracket */
var GC_GROUPS = (function () {
  var _league = 'PL';
  function setLeague(t) { _league = t; }

  function render(container) {
    container.innerHTML = '<div class="gc-loading"><div class="gc-spinner"></div><span>Loading standings...</span></div>';
    GC_API.getStandings(_league).then(function(groups) {
      if (!groups || !groups.length) {
        container.innerHTML = '<div class="gc-empty">📭 Standings not available yet.</div>';
        return;
      }
      container.innerHTML = buildHTML(groups);
    }).catch(function() {
      container.innerHTML = '<div class="gc-empty">⚠️ Could not load standings.</div>';
    });
  }

  function buildHTML(groups) {
    var html = '<div style="padding-top:16px">';

    /* hero banner */
    if (_league === 'WC') {
      html += '<div class="gc-hero-banner-wrap" style="height:150px;margin-bottom:18px">' +
        '<img src="https://images.unsplash.com/photo-1567521464027-f127ff144326?w=900&q=80" alt="WC" style="width:100%;height:100%;object-fit:cover">' +
        '<div class="gc-hero-banner-overlay">' +
          '<div class="gc-hero-banner-title">🏆 World Cup 2026 Standings</div>' +
          '<div class="gc-hero-banner-sub">48 Teams · 12 Groups</div>' +
        '</div></div>';
    } else {
      html += '<div class="gc-hero-banner-wrap" style="height:150px;margin-bottom:18px">' +
        '<img src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=900&q=80" alt="PL" style="width:100%;height:100%;object-fit:cover">' +
        '<div class="gc-hero-banner-overlay">' +
          '<div class="gc-hero-banner-title">🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League Table 2025/26</div>' +
          '<div class="gc-hero-banner-sub">Final standings</div>' +
        '</div></div>';
    }

    html += '<div class="gc-section-title">' + (_league==='WC'?'🏆 World Cup 2026 Groups':'🏴󠁧󠁢󠁥󠁮󠁧󠁩 Premier League 2025/26') + '</div>';

    groups.forEach(function(g) { html += groupTable(g); });

    /* WC knockout bracket */
    if (_league === 'WC') {
      html += '<div class="gc-section-title" style="margin-top:28px">🗓 Knockout Stage</div>';
      html += knockoutBracket();
    }

    html += '</div>';
    return html;
  }

  function groupTable(group) {
    var html = '<div class="gc-group-card">';
    html += '<div class="gc-group-name">' + esc(group.name) + '</div>';
    html += '<table class="gc-table"><thead><tr>' +
      '<th class="gc-th-team">Team</th>' +
      '<th title="Played">P</th><th title="Won">W</th><th title="Drawn">D</th><th title="Lost">L</th>' +
      '<th title="Goals For">GF</th><th title="Goals Against">GA</th><th title="Goal Difference">GD</th>' +
      '<th class="gc-th-pts" title="Points">Pts</th>' +
      '</tr></thead><tbody>';

    group.entries.forEach(function(t, i) {
      var rowCls = '';
      if (_league === 'PL') {
        if (i < 4)  rowCls = 'gc-row-qualify';
        else if (i === 4) rowCls = 'gc-row-el';
        else if (i >= group.entries.length - 3) rowCls = 'gc-row-relegate';
      } else {
        if (i < 2) rowCls = 'gc-row-qualify';
      }
      html += '<tr class="gc-table-row ' + rowCls + '">' +
        '<td class="gc-td-team"><div class="gc-td-inner">' +
          '<span class="gc-tbl-pos">' + (i+1) + '</span>' +
          (t.logo ? '<img class="gc-tbl-logo" src="'+esc(t.logo)+'" alt="">' : '') +
          '<span class="gc-tbl-name">' + esc(t.team) + '</span>' +
        '</div></td>' +
        '<td>' + t.played + '</td>' +
        '<td>' + t.won   + '</td>' +
        '<td>' + t.drawn + '</td>' +
        '<td>' + t.lost  + '</td>' +
        '<td>' + t.gf    + '</td>' +
        '<td>' + t.ga    + '</td>' +
        '<td>' + (t.gd>=0?'+':'') + t.gd + '</td>' +
        '<td class="gc-td-pts">' + t.pts + '</td>' +
      '</tr>';
    });

    html += '</tbody></table>';
    if (_league === 'PL') {
      html += '<div class="gc-legend">' +
        '<span class="gc-leg"><span class="gc-leg-dot" style="background:#2563eb"></span>Champions League</span>' +
        '<span class="gc-leg"><span class="gc-leg-dot" style="background:#ea580c"></span>Europa League</span>' +
        '<span class="gc-leg"><span class="gc-leg-dot" style="background:#dc2626"></span>Relegation</span>' +
      '</div>';
    } else {
      html += '<div class="gc-legend">' +
        '<span class="gc-leg"><span class="gc-leg-dot" style="background:#2563eb"></span>Advance to Round of 32</span>' +
      '</div>';
    }
    html += '</div>';
    return html;
  }

  function knockoutBracket() {
    var rounds = [
      { title: 'Round of 32', matches: [
        {h:'Group A1',a:'Group B2'},{h:'Group C1',a:'Group D2'},
        {h:'Group E1',a:'Group F2'},{h:'Group G1',a:'Group H2'},
        {h:'Group I1',a:'Group J2'},{h:'Group K1',a:'Group L2'},
        {h:'Group B1',a:'Group A2'},{h:'Group D1',a:'Group C2'},
        {h:'Group F1',a:'Group E2'},{h:'Group H1',a:'Group G2'},
        {h:'Group J1',a:'Group I2'},{h:'Group L1',a:'Group K2'},
        {h:'3rd Place x',a:'3rd Place y'},{h:'3rd Place x',a:'3rd Place y'},
        {h:'3rd Place x',a:'3rd Place y'},{h:'3rd Place x',a:'3rd Place y'}
      ]},
      { title: 'Round of 16', matches: [
        {h:'W R32-1',a:'W R32-2'},{h:'W R32-3',a:'W R32-4'},
        {h:'W R32-5',a:'W R32-6'},{h:'W R32-7',a:'W R32-8'},
        {h:'W R32-9',a:'W R32-10'},{h:'W R32-11',a:'W R32-12'},
        {h:'W R32-13',a:'W R32-14'},{h:'W R32-15',a:'W R32-16'}
      ]},
      { title: 'Quarter-Finals', matches: [
        {h:'W R16-1',a:'W R16-2'},{h:'W R16-3',a:'W R16-4'},
        {h:'W R16-5',a:'W R16-6'},{h:'W R16-7',a:'W R16-8'}
      ]},
      { title: 'Semi-Finals', matches: [
        {h:'W QF-1',a:'W QF-2'},{h:'W QF-3',a:'W QF-4'}
      ]},
      { title: '👑 Final', matches: [
        {h:'W SF-1',a:'W SF-2'}
      ]}
    ];

    var html = '<div class="gc-bracket"><div class="gc-bracket-inner">';
    rounds.forEach(function(round) {
      html += '<div class="gc-bracket-col">';
      html += '<div class="gc-bracket-round-title">' + round.title + '</div>';
      round.matches.forEach(function(m) {
        html += '<div class="gc-bracket-match gc-bracket-tbd">' +
          '<div class="gc-bracket-team"><span class="gc-bracket-name">' + esc(m.h) + '</span><span class="gc-bracket-score">-</span></div>' +
          '<div class="gc-bracket-team"><span class="gc-bracket-name">' + esc(m.a) + '</span><span class="gc-bracket-score">-</span></div>' +
        '</div>';
      });
      html += '</div>';
    });
    html += '</div></div>';
    return html;
  }

  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  return { render: render, setLeague: setLeague };
})();
