/* groups.js — PL standings + WC 2026 real groups + knockout bracket */
var GC_GROUPS = (function () {
  var _league = 'PL';
  function setLeague(t) { _league = t; }

  /* ── PL GW37 standings ───────────────────────────── */
  var PL_DATA = [{ name: 'Premier League 2025/26', entries: [
    {team:'Arsenal',        logo:'https://resources.premierleague.com/premierleague/badges/50/t3.png',  played:37,won:25,drawn:7, lost:5, gf:69,ga:26,gd:43, pts:82},
    {team:'Manchester City',logo:'https://resources.premierleague.com/premierleague/badges/50/t43.png', played:37,won:23,drawn:9, lost:5, gf:76,ga:33,gd:43, pts:78},
    {team:'Man United',     logo:'https://resources.premierleague.com/premierleague/badges/50/t1.png',  played:37,won:19,drawn:11,lost:7, gf:66,ga:50,gd:16, pts:68},
    {team:'Aston Villa',    logo:'https://resources.premierleague.com/premierleague/badges/50/t7.png',  played:37,won:18,drawn:8, lost:11,gf:54,ga:48,gd:6,  pts:62},
    {team:'Liverpool',      logo:'https://resources.premierleague.com/premierleague/badges/50/t14.png', played:37,won:17,drawn:8, lost:12,gf:62,ga:52,gd:10, pts:59},
    {team:'Chelsea',        logo:'https://resources.premierleague.com/premierleague/badges/50/t8.png',  played:37,won:16,drawn:10,lost:11,gf:58,ga:48,gd:10, pts:58},
    {team:'Newcastle',      logo:'https://resources.premierleague.com/premierleague/badges/50/t4.png',  played:37,won:16,drawn:7, lost:14,gf:61,ga:54,gd:7,  pts:55},
    {team:'Tottenham',      logo:'https://resources.premierleague.com/premierleague/badges/50/t6.png',  played:37,won:15,drawn:9, lost:13,gf:57,ga:55,gd:2,  pts:54},
    {team:'Brighton',       logo:'https://resources.premierleague.com/premierleague/badges/50/t36.png', played:37,won:14,drawn:10,lost:13,gf:55,ga:51,gd:4,  pts:52},
    {team:'Fulham',         logo:'https://resources.premierleague.com/premierleague/badges/50/t54.png', played:37,won:13,drawn:10,lost:14,gf:50,ga:54,gd:-4, pts:49},
    {team:'Wolves',         logo:'https://resources.premierleague.com/premierleague/badges/50/t39.png', played:37,won:12,drawn:9, lost:16,gf:48,ga:60,gd:-12,pts:45},
    {team:'West Ham',       logo:'https://resources.premierleague.com/premierleague/badges/50/t21.png', played:37,won:12,drawn:8, lost:17,gf:45,ga:62,gd:-17,pts:44},
    {team:'Brentford',      logo:'https://resources.premierleague.com/premierleague/badges/50/t94.png', played:37,won:11,drawn:10,lost:16,gf:52,ga:61,gd:-9, pts:43},
    {team:'Crystal Palace', logo:'https://resources.premierleague.com/premierleague/badges/50/t31.png', played:37,won:11,drawn:9, lost:17,gf:42,ga:58,gd:-16,pts:42},
    {team:'Everton',        logo:'https://resources.premierleague.com/premierleague/badges/50/t11.png', played:37,won:10,drawn:10,lost:17,gf:38,ga:55,gd:-17,pts:40},
    {team:"Nott'm Forest",  logo:'https://resources.premierleague.com/premierleague/badges/50/t17.png', played:37,won:9, drawn:11,lost:17,gf:41,ga:59,gd:-18,pts:38},
    {team:'Bournemouth',    logo:'https://resources.premierleague.com/premierleague/badges/50/t91.png', played:37,won:9, drawn:8, lost:20,gf:44,ga:66,gd:-22,pts:35},
    {team:'Ipswich Town',   logo:'https://resources.premierleague.com/premierleague/badges/50/t40.png', played:37,won:7, drawn:10,lost:20,gf:35,ga:68,gd:-33,pts:31},
    {team:'Leicester City', logo:'https://resources.premierleague.com/premierleague/badges/50/t13.png', played:37,won:6, drawn:8, lost:23,gf:36,ga:74,gd:-38,pts:26},
    {team:'Southampton',    logo:'https://resources.premierleague.com/premierleague/badges/50/t20.png', played:37,won:4, drawn:6, lost:27,gf:28,ga:79,gd:-51,pts:18}
  ]}];

  /* ── FIFA World Cup 2026 — Official Groups ───────── */
  var F = 'https://media.api-sports.io/flags/';
  var WC_DATA = [
    {name:'Group A', entries:[
      {team:'USA',          logo:F+'us.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Serbia',       logo:F+'rs.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Panama',       logo:F+'pa.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Venezuela',    logo:F+'ve.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0}
    ]},
    {name:'Group B', entries:[
      {team:'Mexico',       logo:F+'mx.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Ghana',        logo:F+'gh.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'New Zealand',  logo:F+'nz.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Honduras',     logo:F+'hn.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0}
    ]},
    {name:'Group C', entries:[
      {team:'Argentina',    logo:F+'ar.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Chile',        logo:F+'cl.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Albania',      logo:F+'al.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Nigeria',      logo:F+'ng.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0}
    ]},
    {name:'Group D', entries:[
      {team:'France',       logo:F+'fr.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Australia',    logo:F+'au.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Saudi Arabia', logo:F+'sa.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'DR Congo',     logo:F+'cd.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0}
    ]},
    {name:'Group E', entries:[
      {team:'Spain',        logo:F+'es.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Brazil',       logo:F+'br.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Japan',        logo:F+'jp.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Cameroon',     logo:F+'cm.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0}
    ]},
    {name:'Group F', entries:[
      {team:'Germany',      logo:F+'de.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Portugal',     logo:F+'pt.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Tunisia',      logo:F+'tn.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Costa Rica',   logo:F+'cr.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0}
    ]},
    {name:'Group G', entries:[
      {team:'England',      logo:F+'gb-eng.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Senegal',      logo:F+'sn.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Netherlands',  logo:F+'nl.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Colombia',     logo:F+'co.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0}
    ]},
    {name:'Group H', entries:[
      {team:'Morocco',      logo:F+'ma.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'South Korea',  logo:F+'kr.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Uruguay',      logo:F+'uy.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Switzerland',  logo:F+'ch.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0}
    ]},
    {name:'Group I', entries:[
      {team:'Canada',       logo:F+'ca.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'🇮🇷 IR Iran',  logo:F+'ir.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Bolivia',      logo:F+'bo.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Ivory Coast',  logo:F+'ci.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0}
    ]},
    {name:'Group J', entries:[
      {team:'Belgium',      logo:F+'be.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Italy',        logo:F+'it.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Peru',         logo:F+'pe.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Czech Republic',logo:F+'cz.svg',played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0}
    ]},
    {name:'Group K', entries:[
      {team:'Croatia',      logo:F+'hr.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Ecuador',      logo:F+'ec.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Qatar',        logo:F+'qa.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Bahrain',      logo:F+'bh.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0}
    ]},
    {name:'Group L', entries:[
      {team:'Portugal',     logo:F+'pt.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Sweden',       logo:F+'se.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Zambia',       logo:F+'zm.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Guatemala',    logo:F+'gt.svg', played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0}
    ]}
  ];

  function render(container) {
    container.innerHTML = '<div class="gc-loading"><div class="gc-spinner"></div><span>Loading standings...</span></div>';
    if (_league === 'PL') {
      /* Show hardcoded PL data instantly, try live API in background */
      container.innerHTML = buildHTML(PL_DATA);
      GC_API.getStandings('PL').then(function(groups) {
        if (groups && groups[0] && groups[0].entries && groups[0].entries.length >= 15) {
          container.innerHTML = buildHTML(groups);
        }
      }).catch(function(){});
    } else {
      /* WC — always use our real hardcoded groups */
      container.innerHTML = buildHTML(WC_DATA);
    }
  }

  function buildHTML(groups) {
    var isWC = _league === 'WC';
    var html = '<div style="padding-top:16px">';

    /* Hero banner */
    if (isWC) {
      html += '<div class="gc-hero-banner-wrap" style="height:150px;margin-bottom:18px"><img src="https://images.unsplash.com/photo-1567521464027-f127ff144326?w=900&q=80" style="width:100%;height:100%;object-fit:cover"><div class="gc-hero-banner-overlay"><div class="gc-hero-banner-title">🏆 World Cup 2026 — All Groups</div><div class="gc-hero-banner-sub">48 Teams · 12 Groups · Starts 11 June 2026</div></div></div>';
    } else {
      html += '<div class="gc-hero-banner-wrap" style="height:150px;margin-bottom:18px"><img src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=900&q=80" style="width:100%;height:100%;object-fit:cover"><div class="gc-hero-banner-overlay"><div class="gc-hero-banner-title">🏴󠁧󠁢󠁥󠁮󠁧󠁩 Premier League 2025/26 Table</div><div class="gc-hero-banner-sub">After 37 games — Final day Sunday 24 May</div></div></div>';
    }

    html += '<div class="gc-section-title">' + (isWC ? '🏆 World Cup 2026 Groups' : '🏴󠁧󠁢󠁥󠁮󠁧󠁩 Premier League Table') + '</div>';
    groups.forEach(function(g) { html += groupTable(g); });
    if (isWC) { html += '<div class="gc-section-title" style="margin-top:28px">🗓 Knockout Stage</div>' + bracket(); }
    html += '</div>';
    return html;
  }

  function groupTable(g) {
    var isWC = _league === 'WC';
    var html = '<div class="gc-group-card"><div class="gc-group-name">' + esc(g.name) + '</div>';
    html += '<table class="gc-table"><thead><tr><th class="gc-th-team">Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th class="gc-th-pts">Pts</th></tr></thead><tbody>';
    g.entries.forEach(function(t,i) {
      var cls = '';
      if (!isWC) {
        if (i<4) cls='gc-row-qualify'; else if (i===4) cls='gc-row-el'; else if (i>=g.entries.length-3) cls='gc-row-relegate';
      } else { if (i<2) cls='gc-row-qualify'; }
      html += '<tr class="gc-table-row '+cls+'"><td class="gc-td-team"><div class="gc-td-inner"><span class="gc-tbl-pos">'+(i+1)+'</span>'+(t.logo?'<img class="gc-tbl-logo" src="'+esc(t.logo)+'" alt="">':'')+'<span class="gc-tbl-name">'+esc(t.team)+'</span></div></td><td>'+t.played+'</td><td>'+t.won+'</td><td>'+t.drawn+'</td><td>'+t.lost+'</td><td>'+t.gf+'</td><td>'+t.ga+'</td><td>'+(t.gd>=0?'+':'')+t.gd+'</td><td class="gc-td-pts">'+t.pts+'</td></tr>';
    });
    html += '</tbody></table>';
    if (!isWC) {
      html += '<div class="gc-legend"><span class="gc-leg"><span class="gc-leg-dot" style="background:#2563eb"></span>Champions League</span><span class="gc-leg"><span class="gc-leg-dot" style="background:#ea580c"></span>Europa League</span><span class="gc-leg"><span class="gc-leg-dot" style="background:#dc2626"></span>Relegation</span></div>';
    } else {
      html += '<div class="gc-legend"><span class="gc-leg"><span class="gc-leg-dot" style="background:#2563eb"></span>Advance to Round of 32</span></div>';
    }
    html += '</div>';
    return html;
  }

  function bracket() {
    var rounds = [
      {t:'Round of 32',  m:[['A1','B2'],['C1','D2'],['E1','F2'],['G1','H2'],['I1','J2'],['K1','L2'],['B1','A2'],['D1','C2']]},
      {t:'Round of 16',  m:[['W1','W2'],['W3','W4'],['W5','W6'],['W7','W8']]},
      {t:'Quarter-Finals',m:[['W9','W10'],['W11','W12']]},
      {t:'Semi-Finals',  m:[['W13','W14'],['W15','W16']]},
      {t:'👑 Final',     m:[['W SF-1','W SF-2']]}
    ];
    var html = '<div class="gc-bracket"><div class="gc-bracket-inner">';
    rounds.forEach(function(r) {
      html += '<div class="gc-bracket-col"><div class="gc-bracket-round-title">'+r.t+'</div>';
      r.m.forEach(function(m) {
        html += '<div class="gc-bracket-match gc-bracket-tbd"><div class="gc-bracket-team"><span class="gc-bracket-name">'+m[0]+'</span><span class="gc-bracket-score">-</span></div><div class="gc-bracket-team"><span class="gc-bracket-name">'+m[1]+'</span><span class="gc-bracket-score">-</span></div></div>';
      });
      html += '</div>';
    });
    html += '</div></div>';
    return html;
  }

  function esc(s) { return s?String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'):''; }
  return { render:render, setLeague:setLeague };
})();
