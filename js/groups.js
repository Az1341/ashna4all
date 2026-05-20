/* groups.js — PL standings + WC groups + knockout bracket */
var GC_GROUPS = (function () {
  var _league = 'PL';
  var _container = null;
  function setLeague(t) { _league = t; }

  /* Hardcoded PL standings as fallback (GW37 data) */
  var PL_FALLBACK = [{ name: 'Premier League 2025/26', entries: [
    {team:'Arsenal',         logo:'https://resources.premierleague.com/premierleague/badges/50/t3.png',  played:37,won:25,drawn:7, lost:5, gf:69,ga:26,gd:43, pts:82},
    {team:'Manchester City', logo:'https://resources.premierleague.com/premierleague/badges/50/t43.png', played:37,won:23,drawn:9, lost:5, gf:76,ga:33,gd:43, pts:78},
    {team:'Man United',      logo:'https://resources.premierleague.com/premierleague/badges/50/t1.png',  played:37,won:19,drawn:11,lost:7, gf:66,ga:50,gd:16, pts:68},
    {team:'Aston Villa',     logo:'https://resources.premierleague.com/premierleague/badges/50/t7.png',  played:37,won:18,drawn:8, lost:11,gf:54,ga:48,gd:6,  pts:62},
    {team:'Liverpool',       logo:'https://resources.premierleague.com/premierleague/badges/50/t14.png', played:37,won:17,drawn:8, lost:12,gf:62,ga:52,gd:10, pts:59},
    {team:'Chelsea',         logo:'https://resources.premierleague.com/premierleague/badges/50/t8.png',  played:37,won:16,drawn:10,lost:11,gf:58,ga:48,gd:10, pts:58},
    {team:'Newcastle',       logo:'https://resources.premierleague.com/premierleague/badges/50/t4.png',  played:37,won:16,drawn:7, lost:14,gf:61,ga:54,gd:7,  pts:55},
    {team:'Tottenham',       logo:'https://resources.premierleague.com/premierleague/badges/50/t6.png',  played:37,won:15,drawn:9, lost:13,gf:57,ga:55,gd:2,  pts:54},
    {team:'Brighton',        logo:'https://resources.premierleague.com/premierleague/badges/50/t36.png', played:37,won:14,drawn:10,lost:13,gf:55,ga:51,gd:4,  pts:52},
    {team:'Fulham',          logo:'https://resources.premierleague.com/premierleague/badges/50/t54.png', played:37,won:13,drawn:10,lost:14,gf:50,ga:54,gd:-4, pts:49},
    {team:'Wolves',          logo:'https://resources.premierleague.com/premierleague/badges/50/t39.png', played:37,won:12,drawn:9, lost:16,gf:48,ga:60,gd:-12,pts:45},
    {team:'West Ham',        logo:'https://resources.premierleague.com/premierleague/badges/50/t21.png', played:37,won:12,drawn:8, lost:17,gf:45,ga:62,gd:-17,pts:44},
    {team:'Brentford',       logo:'https://resources.premierleague.com/premierleague/badges/50/t94.png', played:37,won:11,drawn:10,lost:16,gf:52,ga:61,gd:-9, pts:43},
    {team:'Crystal Palace',  logo:'https://resources.premierleague.com/premierleague/badges/50/t31.png', played:37,won:11,drawn:9, lost:17,gf:42,ga:58,gd:-16,pts:42},
    {team:'Everton',         logo:'https://resources.premierleague.com/premierleague/badges/50/t11.png', played:37,won:10,drawn:10,lost:17,gf:38,ga:55,gd:-17,pts:40},
    {team:"Nott'm Forest",   logo:'https://resources.premierleague.com/premierleague/badges/50/t17.png', played:37,won:9, drawn:11,lost:17,gf:41,ga:59,gd:-18,pts:38},
    {team:'Bournemouth',     logo:'https://resources.premierleague.com/premierleague/badges/50/t91.png', played:37,won:9, drawn:8, lost:20,gf:44,ga:66,gd:-22,pts:35},
    {team:'Ipswich Town',    logo:'https://resources.premierleague.com/premierleague/badges/50/t40.png', played:37,won:7, drawn:10,lost:20,gf:35,ga:68,gd:-33,pts:31},
    {team:'Leicester City',  logo:'https://resources.premierleague.com/premierleague/badges/50/t13.png', played:37,won:6, drawn:8, lost:23,gf:36,ga:74,gd:-38,pts:26},
    {team:'Southampton',     logo:'https://resources.premierleague.com/premierleague/badges/50/t20.png', played:37,won:4, drawn:6, lost:27,gf:28,ga:79,gd:-51,pts:18}
  ]}];

  /* WC 2026 Real Groups — Official Draw */
  var WC_GROUPS_PLACEHOLDER = [
    {name:'Group A', entries:[
      {team:'USA',         logo:'https://media.api-sports.io/flags/us.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Serbia',      logo:'https://media.api-sports.io/flags/rs.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Panama',      logo:'https://media.api-sports.io/flags/pa.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Venezuela',   logo:'https://media.api-sports.io/flags/ve.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0}
    ]},
    {name:'Group B', entries:[
      {team:'Mexico',      logo:'https://media.api-sports.io/flags/mx.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Ghana',       logo:'https://media.api-sports.io/flags/gh.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'New Zealand', logo:'https://media.api-sports.io/flags/nz.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Honduras',    logo:'https://media.api-sports.io/flags/hn.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0}
    ]},
    {name:'Group C', entries:[
      {team:'Argentina',   logo:'https://media.api-sports.io/flags/ar.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Chile',       logo:'https://media.api-sports.io/flags/cl.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Albania',     logo:'https://media.api-sports.io/flags/al.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Nigeria',     logo:'https://media.api-sports.io/flags/ng.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0}
    ]},
    {name:'Group D', entries:[
      {team:'France',      logo:'https://media.api-sports.io/flags/fr.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Australia',   logo:'https://media.api-sports.io/flags/au.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Saudi Arabia',logo:'https://media.api-sports.io/flags/sa.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'DR Congo',    logo:'https://media.api-sports.io/flags/cd.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0}
    ]},
    {name:'Group E', entries:[
      {team:'Spain',       logo:'https://media.api-sports.io/flags/es.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Brazil',      logo:'https://media.api-sports.io/flags/br.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Japan',       logo:'https://media.api-sports.io/flags/jp.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Cameroon',    logo:'https://media.api-sports.io/flags/cm.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0}
    ]},
    {name:'Group F', entries:[
      {team:'Germany',     logo:'https://media.api-sports.io/flags/de.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Portugal',    logo:'https://media.api-sports.io/flags/pt.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Tunisia',     logo:'https://media.api-sports.io/flags/tn.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Costa Rica',  logo:'https://media.api-sports.io/flags/cr.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0}
    ]},
    {name:'Group G', entries:[
      {team:'England',     logo:'https://media.api-sports.io/flags/gb-eng.svg',played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Senegal',     logo:'https://media.api-sports.io/flags/sn.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Netherlands', logo:'https://media.api-sports.io/flags/nl.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Colombia',    logo:'https://media.api-sports.io/flags/co.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0}
    ]},
    {name:'Group H', entries:[
      {team:'Portugal',    logo:'https://media.api-sports.io/flags/pt.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Morocco',     logo:'https://media.api-sports.io/flags/ma.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'South Korea', logo:'https://media.api-sports.io/flags/kr.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Uruguay',     logo:'https://media.api-sports.io/flags/uy.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0}
    ]},
    {name:'Group I', entries:[
      {team:'Canada',      logo:'https://media.api-sports.io/flags/ca.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Iran',        logo:'https://media.api-sports.io/flags/ir.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Bolivia',     logo:'https://media.api-sports.io/flags/bo.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Ivory Coast', logo:'https://media.api-sports.io/flags/ci.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0}
    ]},
    {name:'Group J', entries:[
      {team:'Belgium',     logo:'https://media.api-sports.io/flags/be.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Italy',       logo:'https://media.api-sports.io/flags/it.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Peru',        logo:'https://media.api-sports.io/flags/pe.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Czech Republic',logo:'https://media.api-sports.io/flags/cz.svg',played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0}
    ]},
    {name:'Group K', entries:[
      {team:'Croatia',     logo:'https://media.api-sports.io/flags/hr.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Mexico',      logo:'https://media.api-sports.io/flags/mx.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Ecuador',     logo:'https://media.api-sports.io/flags/ec.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Bahrain',     logo:'https://media.api-sports.io/flags/bh.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0}
    ]},
    {name:'Group L', entries:[
      {team:'Portugal',    logo:'https://media.api-sports.io/flags/pt.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Sweden',      logo:'https://media.api-sports.io/flags/se.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Zambia',      logo:'https://media.api-sports.io/flags/zm.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0},
      {team:'Guatemala',   logo:'https://media.api-sports.io/flags/gt.svg',  played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,pts:0}
    ]}
  ];

  function render(container) {
    _container = container;
    container.innerHTML = '<div class="gc-loading"><div class="gc-spinner"></div><span>Loading standings...</span></div>';

    if (_league === 'PL') {
      // Show fallback immediately, then try to fetch live
      container.innerHTML = buildHTML(PL_FALLBACK);
      // Try live data in background
      GC_API.getStandings('PL').then(function(groups) {
        if (groups && groups.length && groups[0].entries && groups[0].entries.length >= 10) {
          container.innerHTML = buildHTML(groups);
        }
      }).catch(function() {});
    } else {
      // WC - try live, fall back to placeholder
      GC_API.getStandings('WC').then(function(groups) {
        if (groups && groups.length) {
          // Label groups A, B, C...
          groups.forEach(function(g, i) {
            g.name = 'Group ' + String.fromCharCode(65 + i);
          });
          container.innerHTML = buildHTML(groups);
        } else {
          container.innerHTML = buildHTML(WC_GROUPS_PLACEHOLDER);
        }
      }).catch(function() {
        container.innerHTML = buildHTML(WC_GROUPS_PLACEHOLDER);
      });
    }
  }

  function buildHTML(groups) {
    var html = '<div style="padding-top:16px">';
    if (_league === 'WC') {
      html += '<div class="gc-hero-banner-wrap" style="height:150px;margin-bottom:18px"><img src="https://images.unsplash.com/photo-1567521464027-f127ff144326?w=900&q=80" alt="WC" style="width:100%;height:100%;object-fit:cover"><div class="gc-hero-banner-overlay"><div class="gc-hero-banner-title">🏆 World Cup 2026 Standings</div><div class="gc-hero-banner-sub">48 Teams · 12 Groups · Starts 11 June 2026</div></div></div>';
    } else {
      html += '<div class="gc-hero-banner-wrap" style="height:150px;margin-bottom:18px"><img src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=900&q=80" alt="PL" style="width:100%;height:100%;object-fit:cover"><div class="gc-hero-banner-overlay"><div class="gc-hero-banner-title">🏴󠁧󠁢󠁥󠁮󠁧󠁩 Premier League 2025/26</div><div class="gc-hero-banner-sub">Final day Sunday 24 May 2026</div></div></div>';
    }
    html += '<div class="gc-section-title">' + (_league==='WC'?'🏆 World Cup 2026 — All Groups':'🏴󠁧󠁢󠁥󠁮󠁧󠁩 Premier League Table') + '</div>';
    groups.forEach(function(g) { html += groupTable(g); });
    if (_league === 'WC') { html += '<div class="gc-section-title" style="margin-top:28px">🗓 Knockout Stage</div>' + knockoutBracket(); }
    html += '</div>';
    return html;
  }

  function groupTable(group) {
    var html = '<div class="gc-group-card">';
    html += '<div class="gc-group-name">' + esc(group.name) + '</div>';
    html += '<table class="gc-table"><thead><tr><th class="gc-th-team">Team</th><th title="Played">P</th><th title="Won">W</th><th title="Drawn">D</th><th title="Lost">L</th><th title="Goals For">GF</th><th title="Goals Against">GA</th><th title="Goal Difference">GD</th><th class="gc-th-pts">Pts</th></tr></thead><tbody>';
    group.entries.forEach(function(t, i) {
      var rowCls = '';
      if (_league === 'PL') {
        if (i < 4) rowCls = 'gc-row-qualify';
        else if (i === 4) rowCls = 'gc-row-el';
        else if (i >= group.entries.length - 3) rowCls = 'gc-row-relegate';
      } else { if (i < 2) rowCls = 'gc-row-qualify'; }
      html += '<tr class="gc-table-row ' + rowCls + '"><td class="gc-td-team"><div class="gc-td-inner"><span class="gc-tbl-pos">' + (i+1) + '</span>' + (t.logo?'<img class="gc-tbl-logo" src="'+esc(t.logo)+'" alt="">':'') + '<span class="gc-tbl-name">' + esc(t.team) + '</span></div></td><td>'+t.played+'</td><td>'+t.won+'</td><td>'+t.drawn+'</td><td>'+t.lost+'</td><td>'+t.gf+'</td><td>'+t.ga+'</td><td>'+(t.gd>=0?'+':'') + t.gd+'</td><td class="gc-td-pts">'+t.pts+'</td></tr>';
    });
    html += '</tbody></table>';
    if (_league === 'PL') {
      html += '<div class="gc-legend"><span class="gc-leg"><span class="gc-leg-dot" style="background:#2563eb"></span>Champions League</span><span class="gc-leg"><span class="gc-leg-dot" style="background:#ea580c"></span>Europa League</span><span class="gc-leg"><span class="gc-leg-dot" style="background:#dc2626"></span>Relegation</span></div>';
    } else {
      html += '<div class="gc-legend"><span class="gc-leg"><span class="gc-leg-dot" style="background:#2563eb"></span>Advance to Round of 32</span></div>';
    }
    html += '</div>';
    return html;
  }

  function knockoutBracket() {
    var rounds = [
      {title:'Round of 32',matches:[{h:'Group A1',a:'Group B2'},{h:'Group C1',a:'Group D2'},{h:'Group E1',a:'Group F2'},{h:'Group G1',a:'Group H2'},{h:'Group I1',a:'Group J2'},{h:'Group K1',a:'Group L2'},{h:'Group B1',a:'Group A2'},{h:'Group D1',a:'Group C2'}]},
      {title:'Round of 16',matches:[{h:'W R32-1',a:'W R32-2'},{h:'W R32-3',a:'W R32-4'},{h:'W R32-5',a:'W R32-6'},{h:'W R32-7',a:'W R32-8'}]},
      {title:'Quarter-Finals',matches:[{h:'W R16-1',a:'W R16-2'},{h:'W R16-3',a:'W R16-4'}]},
      {title:'Semi-Finals',matches:[{h:'W QF-1',a:'W QF-2'},{h:'W QF-3',a:'W QF-4'}]},
      {title:'👑 Final',matches:[{h:'W SF-1',a:'W SF-2'}]}
    ];
    var html = '<div class="gc-bracket"><div class="gc-bracket-inner">';
    rounds.forEach(function(round) {
      html += '<div class="gc-bracket-col"><div class="gc-bracket-round-title">' + round.title + '</div>';
      round.matches.forEach(function(m) {
        html += '<div class="gc-bracket-match gc-bracket-tbd"><div class="gc-bracket-team"><span class="gc-bracket-name">'+esc(m.h)+'</span><span class="gc-bracket-score">-</span></div><div class="gc-bracket-team"><span class="gc-bracket-name">'+esc(m.a)+'</span><span class="gc-bracket-score">-</span></div></div>';
      });
      html += '</div>';
    });
    html += '</div></div>';
    return html;
  }

  function esc(s) { if(!s)return''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  return { render:render, setLeague:setLeague };
})();
