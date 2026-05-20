/* schedule.js — Full schedule with hardcoded PL Final Day + API for other dates */
var GC_SCHEDULE = (function () {
  var _league = 'PL';
  var _date   = null;
  var _wcRound = 'group';
  var _wcDate  = '2026-06-11';
  var _tz     = 'UK'; /* UK | CA | USA | OTHER */

  /* ALL 10 PL Final Day matches - Sunday 24 May 2026 — 5:00 PM UK */
  /* Source: ESPN official fixtures */
  var KO = '2026-05-24T15:00:00Z'; /* 4pm UK (BST) = 3pm UTC */
  var B = 'https://resources.premierleague.com/premierleague/badges/50/';
  var PL_FINAL_DAY = [
    {homeTeam:'Brighton',         homeLogo:B+'t36.png', awayTeam:'Man United',       awayLogo:B+'t1.png',  homeScore:null,awayScore:null,kickoff:KO,venue:'Amex Stadium, Brighton',            isLive:false,isFT:false,isPre:true,league:'Premier League',scorers:[]},
    {homeTeam:'Burnley',          homeLogo:B+'t90.png', awayTeam:'Wolves',            awayLogo:B+'t39.png', homeScore:null,awayScore:null,kickoff:KO,venue:'Turf Moor, Burnley',                isLive:false,isFT:false,isPre:true,league:'Premier League',scorers:[]},
    {homeTeam:'Crystal Palace',   homeLogo:B+'t31.png', awayTeam:'Arsenal',           awayLogo:B+'t3.png',  homeScore:null,awayScore:null,kickoff:KO,venue:'Selhurst Park, London',             isLive:false,isFT:false,isPre:true,league:'Premier League',scorers:[]},
    {homeTeam:'Fulham',           homeLogo:B+'t54.png', awayTeam:'Newcastle',         awayLogo:B+'t4.png',  homeScore:null,awayScore:null,kickoff:KO,venue:'Craven Cottage, London',            isLive:false,isFT:false,isPre:true,league:'Premier League',scorers:[]},
    {homeTeam:'Liverpool',        homeLogo:B+'t14.png', awayTeam:'Brentford',         awayLogo:B+'t94.png', homeScore:null,awayScore:null,kickoff:KO,venue:'Anfield, Liverpool',                isLive:false,isFT:false,isPre:true,league:'Premier League',scorers:[]},
    {homeTeam:'Man City',         homeLogo:B+'t43.png', awayTeam:'Aston Villa',       awayLogo:B+'t7.png',  homeScore:null,awayScore:null,kickoff:KO,venue:'Etihad Stadium, Manchester',        isLive:false,isFT:false,isPre:true,league:'Premier League',scorers:[]},
    {homeTeam:"Nott'm Forest",    homeLogo:B+'t17.png', awayTeam:'Bournemouth',       awayLogo:B+'t91.png', homeScore:null,awayScore:null,kickoff:KO,venue:'City Ground, Nottingham',           isLive:false,isFT:false,isPre:true,league:'Premier League',scorers:[]},
    {homeTeam:'Sunderland',       homeLogo:B+'t56.png', awayTeam:'Chelsea',           awayLogo:B+'t8.png',  homeScore:null,awayScore:null,kickoff:KO,venue:'Stadium of Light, Sunderland',     isLive:false,isFT:false,isPre:true,league:'Premier League',scorers:[]},
    {homeTeam:'Tottenham',        homeLogo:B+'t6.png',  awayTeam:'Everton',           awayLogo:B+'t11.png', homeScore:null,awayScore:null,kickoff:KO,venue:'Tottenham Hotspur Stadium, London', isLive:false,isFT:false,isPre:true,league:'Premier League',scorers:[]},
    {homeTeam:'West Ham',         homeLogo:B+'t21.png', awayTeam:'Leeds United',      awayLogo:B+'t2.png',  homeScore:null,awayScore:null,kickoff:KO,venue:'London Stadium, London',            isLive:false,isFT:false,isPre:true,league:'Premier League',scorers:[]}
  ];


  /* ✅ ALL 72 WC 2026 Group Stage fixtures — VERIFIED UK times from Squawka */
  var F = 'https://media.api-sports.io/flags/';
  var WC_FIXTURES = [
    /* Thu 11 Jun */
    {date:'2026-06-11',time:'20:00',home:'Mexico',        hf:F+'mx.svg',     away:'South Africa',     af:F+'za.svg',     group:'Group A',venue:'Estadio Azteca, Mexico City'},
    /* Fri 12 Jun */
    {date:'2026-06-12',time:'03:00',home:'South Korea',   hf:F+'kr.svg',     away:'Czechia',          af:F+'cz.svg',     group:'Group A',venue:'Estadio Akron, Guadalajara'},
    {date:'2026-06-12',time:'20:00',home:'Canada',        hf:F+'ca.svg',     away:'Bosnia & Herz.',   af:F+'ba.svg',     group:'Group B',venue:'BMO Field, Toronto'},
    /* Sat 13 Jun */
    {date:'2026-06-13',time:'02:00',home:'USA',           hf:F+'us.svg',     away:'Paraguay',         af:F+'py.svg',     group:'Group D',venue:'SoFi Stadium, Los Angeles'},
    {date:'2026-06-13',time:'20:00',home:'Qatar',         hf:F+'qa.svg',     away:'Switzerland',      af:F+'ch.svg',     group:'Group B',venue:'AT&T Stadium, Dallas'},
    {date:'2026-06-13',time:'23:00',home:'Brazil',        hf:F+'br.svg',     away:'Morocco',          af:F+'ma.svg',     group:'Group C',venue:'MetLife Stadium, New York/NJ'},
    /* Sun 14 Jun */
    {date:'2026-06-14',time:'02:00',home:'Haiti',         hf:F+'ht.svg',     away:'Scotland',         af:F+'gb-sct.svg', group:'Group C',venue:'Hard Rock Stadium, Miami'},
    {date:'2026-06-14',time:'05:00',home:'Australia',     hf:F+'au.svg',     away:'Türkiye',          af:F+'tr.svg',     group:'Group D',venue:'BC Place, Vancouver'},
    {date:'2026-06-14',time:'18:00',home:'Germany',       hf:F+'de.svg',     away:'Curaçao',          af:F+'cw.svg',     group:'Group E',venue:'NRG Stadium, Houston'},
    {date:'2026-06-14',time:'21:00',home:'Netherlands',   hf:F+'nl.svg',     away:'Japan',            af:F+'jp.svg',     group:'Group F',venue:'AT&T Stadium, Dallas'},
    /* Mon 15 Jun */
    {date:'2026-06-15',time:'00:00',home:'Ivory Coast',   hf:F+'ci.svg',     away:'Ecuador',          af:F+'ec.svg',     group:'Group E',venue:'Lincoln Financial Field, Philadelphia'},
    {date:'2026-06-15',time:'03:00',home:'Sweden',        hf:F+'se.svg',     away:'Tunisia',          af:F+'tn.svg',     group:'Group F',venue:'Estadio BBVA, Monterrey'},
    {date:'2026-06-15',time:'17:00',home:'Spain',         hf:F+'es.svg',     away:'Cape Verde',       af:F+'cv.svg',     group:'Group H',venue:'Mercedes-Benz Stadium, Atlanta'},
    {date:'2026-06-15',time:'20:00',home:'Belgium',       hf:F+'be.svg',     away:'Egypt',            af:F+'eg.svg',     group:'Group G',venue:'Lumen Field, Seattle'},
    {date:'2026-06-15',time:'23:00',home:'Saudi Arabia',  hf:F+'sa.svg',     away:'Uruguay',          af:F+'uy.svg',     group:'Group H',venue:'MetLife Stadium, New York/NJ'},
    /* Tue 16 Jun */
    {date:'2026-06-16',time:'02:00',home:'🇮🇷 Iran',       hf:F+'ir.svg',     away:'New Zealand',      af:F+'nz.svg',     group:'Group G',venue:'SoFi Stadium, Los Angeles'},
    {date:'2026-06-16',time:'20:00',home:'France',        hf:F+'fr.svg',     away:'Senegal',          af:F+'sn.svg',     group:'Group I',venue:'MetLife Stadium, New York/NJ'},
    {date:'2026-06-16',time:'23:00',home:'Iraq',          hf:F+'iq.svg',     away:'Norway',           af:F+'no.svg',     group:'Group I',venue:'Lincoln Financial Field, Philadelphia'},
    /* Wed 17 Jun */
    {date:'2026-06-17',time:'02:00',home:'Argentina',     hf:F+'ar.svg',     away:'Algeria',          af:F+'dz.svg',     group:'Group J',venue:'Arrowhead Stadium, Kansas City'},
    {date:'2026-06-17',time:'05:00',home:'Austria',       hf:F+'at.svg',     away:'Jordan',           af:F+'jo.svg',     group:'Group J',venue:"Levi's Stadium, San Jose"},
    {date:'2026-06-17',time:'18:00',home:'Portugal',      hf:F+'pt.svg',     away:'DR Congo',         af:F+'cd.svg',     group:'Group K',venue:'Lincoln Financial Field, Philadelphia'},
    {date:'2026-06-17',time:'21:00',home:'England',       hf:F+'gb-eng.svg', away:'Croatia',          af:F+'hr.svg',     group:'Group L',venue:'AT&T Stadium, Dallas'},
    /* Thu 18 Jun */
    {date:'2026-06-18',time:'00:00',home:'Ghana',         hf:F+'gh.svg',     away:'Panama',           af:F+'pa.svg',     group:'Group L',venue:'Arrowhead Stadium, Kansas City'},
    {date:'2026-06-18',time:'03:00',home:'Uzbekistan',    hf:F+'uz.svg',     away:'Colombia',         af:F+'co.svg',     group:'Group K',venue:'Hard Rock Stadium, Miami'},
    {date:'2026-06-18',time:'17:00',home:'Czechia',       hf:F+'cz.svg',     away:'South Africa',     af:F+'za.svg',     group:'Group A',venue:'Mercedes-Benz Stadium, Atlanta'},
    {date:'2026-06-18',time:'20:00',home:'Switzerland',   hf:F+'ch.svg',     away:'Bosnia & Herz.',   af:F+'ba.svg',     group:'Group B',venue:"Levi's Stadium, San Jose"},
    {date:'2026-06-18',time:'23:00',home:'Canada',        hf:F+'ca.svg',     away:'Qatar',            af:F+'qa.svg',     group:'Group B',venue:'SoFi Stadium, Los Angeles'},
    /* Fri 19 Jun */
    {date:'2026-06-19',time:'02:00',home:'Mexico',        hf:F+'mx.svg',     away:'South Korea',      af:F+'kr.svg',     group:'Group A',venue:'Estadio Akron, Guadalajara'},
    {date:'2026-06-19',time:'20:00',home:'USA',           hf:F+'us.svg',     away:'Australia',        af:F+'au.svg',     group:'Group D',venue:'Lumen Field, Seattle'},
    {date:'2026-06-19',time:'23:00',home:'Scotland',      hf:F+'gb-sct.svg', away:'Morocco',          af:F+'ma.svg',     group:'Group C',venue:'SoFi Stadium, Los Angeles'},
    /* Sat 20 Jun */
    {date:'2026-06-20',time:'02:00',home:'Brazil',        hf:F+'br.svg',     away:'Haiti',            af:F+'ht.svg',     group:'Group C',venue:'Hard Rock Stadium, Miami'},
    {date:'2026-06-20',time:'05:00',home:'Türkiye',       hf:F+'tr.svg',     away:'Paraguay',         af:F+'py.svg',     group:'Group D',venue:"Levi's Stadium, San Jose"},
    {date:'2026-06-20',time:'18:00',home:'Netherlands',   hf:F+'nl.svg',     away:'Sweden',           af:F+'se.svg',     group:'Group F',venue:'NRG Stadium, Houston'},
    {date:'2026-06-20',time:'21:00',home:'Germany',       hf:F+'de.svg',     away:'Ivory Coast',      af:F+'ci.svg',     group:'Group E',venue:'BMO Field, Toronto'},
    /* Sun 21 Jun */
    {date:'2026-06-21',time:'01:00',home:'Ecuador',       hf:F+'ec.svg',     away:'Curaçao',          af:F+'cw.svg',     group:'Group E',venue:'SoFi Stadium, Los Angeles'},
    {date:'2026-06-21',time:'05:00',home:'Tunisia',       hf:F+'tn.svg',     away:'Japan',            af:F+'jp.svg',     group:'Group F',venue:'Estadio BBVA, Monterrey'},
    {date:'2026-06-21',time:'17:00',home:'Spain',         hf:F+'es.svg',     away:'Saudi Arabia',     af:F+'sa.svg',     group:'Group H',venue:'Mercedes-Benz Stadium, Atlanta'},
    {date:'2026-06-21',time:'20:00',home:'Belgium',       hf:F+'be.svg',     away:'🇮🇷 Iran',          af:F+'ir.svg',     group:'Group G',venue:'SoFi Stadium, Los Angeles'},
    {date:'2026-06-21',time:'23:00',home:'Uruguay',       hf:F+'uy.svg',     away:'Cape Verde',       af:F+'cv.svg',     group:'Group H',venue:'Hard Rock Stadium, Miami'},
    /* Mon 22 Jun */
    {date:'2026-06-22',time:'02:00',home:'New Zealand',   hf:F+'nz.svg',     away:'Egypt',            af:F+'eg.svg',     group:'Group G',venue:'BC Place, Vancouver'},
    {date:'2026-06-22',time:'18:00',home:'Argentina',     hf:F+'ar.svg',     away:'Austria',          af:F+'at.svg',     group:'Group J',venue:'AT&T Stadium, Dallas'},
    {date:'2026-06-22',time:'22:00',home:'France',        hf:F+'fr.svg',     away:'Iraq',             af:F+'iq.svg',     group:'Group I',venue:'Lincoln Financial Field, Philadelphia'},
    /* Tue 23 Jun */
    {date:'2026-06-23',time:'01:00',home:'Norway',        hf:F+'no.svg',     away:'Senegal',          af:F+'sn.svg',     group:'Group I',venue:'Gillette Stadium, Boston'},
    {date:'2026-06-23',time:'04:00',home:'Jordan',        hf:F+'jo.svg',     away:'Algeria',          af:F+'dz.svg',     group:'Group J',venue:'Empower Field, Denver'},
    {date:'2026-06-23',time:'18:00',home:'Portugal',      hf:F+'pt.svg',     away:'Colombia',         af:F+'co.svg',     group:'Group K',venue:'Lincoln Financial Field, Philadelphia'},
    {date:'2026-06-23',time:'21:00',home:'England',       hf:F+'gb-eng.svg', away:'Ghana',            af:F+'gh.svg',     group:'Group L',venue:'Gillette Stadium, Boston'},
    /* Wed 24 Jun */
    {date:'2026-06-24',time:'00:00',home:'Panama',        hf:F+'pa.svg',     away:'Croatia',          af:F+'hr.svg',     group:'Group L',venue:'MetLife Stadium, New York/NJ'},
    {date:'2026-06-24',time:'03:00',home:'Colombia',      hf:F+'co.svg',     away:'DR Congo',         af:F+'cd.svg',     group:'Group K',venue:'Hard Rock Stadium, Miami'},
    {date:'2026-06-24',time:'20:00',home:'Bosnia & Herz.',hf:F+'ba.svg',     away:'Qatar',            af:F+'qa.svg',     group:'Group B',venue:'AT&T Stadium, Dallas'},
    {date:'2026-06-24',time:'20:00',home:'Switzerland',   hf:F+'ch.svg',     away:'Canada',           af:F+'ca.svg',     group:'Group B',venue:'BMO Field, Toronto'},
    {date:'2026-06-24',time:'23:00',home:'Morocco',       hf:F+'ma.svg',     away:'Haiti',            af:F+'ht.svg',     group:'Group C',venue:'Mercedes-Benz Stadium, Atlanta'},
    {date:'2026-06-24',time:'23:00',home:'Scotland',      hf:F+'gb-sct.svg', away:'Brazil',           af:F+'br.svg',     group:'Group C',venue:'SoFi Stadium, Los Angeles'},
    /* Thu 25 Jun */
    {date:'2026-06-25',time:'02:00',home:'Czechia',       hf:F+'cz.svg',     away:'Mexico',           af:F+'mx.svg',     group:'Group A',venue:'Estadio Azteca, Mexico City'},
    {date:'2026-06-25',time:'02:00',home:'South Africa',  hf:F+'za.svg',     away:'South Korea',      af:F+'kr.svg',     group:'Group A',venue:'Estadio BBVA, Monterrey'},
    {date:'2026-06-25',time:'21:00',home:'Curaçao',       hf:F+'cw.svg',     away:'Ivory Coast',      af:F+'ci.svg',     group:'Group E',venue:'NRG Stadium, Houston'},
    {date:'2026-06-25',time:'21:00',home:'Ecuador',       hf:F+'ec.svg',     away:'Germany',          af:F+'de.svg',     group:'Group E',venue:'Lincoln Financial Field, Philadelphia'},
    /* Fri 26 Jun */
    {date:'2026-06-26',time:'00:00',home:'Japan',         hf:F+'jp.svg',     away:'Sweden',           af:F+'se.svg',     group:'Group F',venue:'AT&T Stadium, Dallas'},
    {date:'2026-06-26',time:'00:00',home:'Tunisia',       hf:F+'tn.svg',     away:'Netherlands',      af:F+'nl.svg',     group:'Group F',venue:'Arrowhead Stadium, Kansas City'},
    {date:'2026-06-26',time:'03:00',home:'Paraguay',      hf:F+'py.svg',     away:'Australia',        af:F+'au.svg',     group:'Group D',venue:"Levi's Stadium, San Jose"},
    {date:'2026-06-26',time:'03:00',home:'Türkiye',       hf:F+'tr.svg',     away:'USA',              af:F+'us.svg',     group:'Group D',venue:'SoFi Stadium, Los Angeles'},
    {date:'2026-06-26',time:'20:00',home:'Norway',        hf:F+'no.svg',     away:'France',           af:F+'fr.svg',     group:'Group I',venue:'Gillette Stadium, Boston'},
    {date:'2026-06-26',time:'20:00',home:'Senegal',       hf:F+'sn.svg',     away:'Iraq',             af:F+'iq.svg',     group:'Group I',venue:'Lincoln Financial Field, Philadelphia'},
    /* Sat 27 Jun */
    {date:'2026-06-27',time:'01:00',home:'Cape Verde',    hf:F+'cv.svg',     away:'Saudi Arabia',     af:F+'sa.svg',     group:'Group H',venue:'Mercedes-Benz Stadium, Atlanta'},
    {date:'2026-06-27',time:'01:00',home:'Uruguay',       hf:F+'uy.svg',     away:'Spain',            af:F+'es.svg',     group:'Group H',venue:'Estadio Akron, Guadalajara'},
    {date:'2026-06-27',time:'04:00',home:'Egypt',         hf:F+'eg.svg',     away:'🇮🇷 Iran',          af:F+'ir.svg',     group:'Group G',venue:'Lumen Field, Seattle'},
    {date:'2026-06-27',time:'04:00',home:'New Zealand',   hf:F+'nz.svg',     away:'Belgium',          af:F+'be.svg',     group:'Group G',venue:'SoFi Stadium, Los Angeles'},
    {date:'2026-06-27',time:'22:00',home:'Croatia',       hf:F+'hr.svg',     away:'Ghana',            af:F+'gh.svg',     group:'Group L',venue:'Gillette Stadium, Boston'},
    {date:'2026-06-27',time:'22:00',home:'Panama',        hf:F+'pa.svg',     away:'England',          af:F+'gb-eng.svg', group:'Group L',venue:'MetLife Stadium, New York/NJ'},
    /* Sun 28 Jun */
    {date:'2026-06-28',time:'00:30',home:'Colombia',      hf:F+'co.svg',     away:'Portugal',         af:F+'pt.svg',     group:'Group K',venue:'Lincoln Financial Field, Philadelphia'},
    {date:'2026-06-28',time:'00:30',home:'DR Congo',      hf:F+'cd.svg',     away:'Uzbekistan',       af:F+'uz.svg',     group:'Group K',venue:'Hard Rock Stadium, Miami'},
    {date:'2026-06-28',time:'03:00',home:'Algeria',       hf:F+'dz.svg',     away:'Austria',          af:F+'at.svg',     group:'Group J',venue:'Arrowhead Stadium, Kansas City'},
    {date:'2026-06-28',time:'03:00',home:'Jordan',        hf:F+'jo.svg',     away:'Argentina',        af:F+'ar.svg',     group:'Group J',venue:'AT&T Stadium, Dallas'}
  ];  var WC_ROUNDS = [
    {id:'group', label:'⚽ Group Stage',     from:'2026-06-11', to:'2026-07-02'},
    {id:'r32',   label:'🔥 Round of 32',    from:'2026-07-04', to:'2026-07-07'},
    {id:'r16',   label:'⚡ Round of 16',    from:'2026-07-09', to:'2026-07-12'},
    {id:'qf',    label:'🏆 Quarter-Finals', from:'2026-07-14', to:'2026-07-15'},
    {id:'sf',    label:'🌟 Semi-Finals',    from:'2026-07-18', to:'2026-07-19'},
    {id:'final', label:'👑 Final',          from:'2026-07-26', to:'2026-07-26'}
  ];

  function setLeague(t) { _league = t; }

  function render(container) {
    if (!_date) _date = GC_API.today();
    if (_league === 'WC') renderWC(container);
    else renderPL(container);
  }

  function renderPL(container) {
    container.innerHTML =
      '<div style="padding-top:16px">' +
      '<div class="gc-hero-banner-wrap" style="height:140px;margin-bottom:18px">' +
        '<img src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=900&q=80" style="width:100%;height:100%;object-fit:cover" alt="PL">' +
        '<div class="gc-hero-banner-overlay">' +
          '<div class="gc-hero-banner-title">🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League Schedule</div>' +
          '<div class="gc-hero-banner-sub">2025/26 Season — Final Day Sunday 24 May</div>' +
        '</div>' +
      '</div>' +
      '<div class="gc-section-title">📅 Pick a Date</div>' +
      '<div class="gc-datebar" id="gc-datebar"></div>' +
      '<div id="gc-sch-matches"></div>' +
      '</div>';
    buildDateBar();
    loadPLMatches();
  }

  function buildDateBar() {
    var bar = document.getElementById('gc-datebar');
    if (!bar) return;
    var html = '';
    var base = new Date();
    for (var i = -7; i <= 28; i++) {
      var d = new Date(base);
      d.setDate(base.getDate() + i);
      var iso = d.toISOString().slice(0,10);
      var isToday = iso === GC_API.today();
      var isSel   = iso === _date;
      var isFinalDay = iso === '2026-05-24';
      html += '<button class="gc-date-btn' +
        (isToday?' gc-date-today':'') + (isSel?' gc-date-selected':'') +
        '" onclick="GC_SCHEDULE._pick(\'' + iso + '\')" ' +
        'style="' + (isFinalDay && !isSel?'border-color:#d97706;':'') + '">' +
        '<span class="gc-date-wd">' + d.toLocaleDateString('en-GB',{weekday:'short'}) + '</span>' +
        '<span class="gc-date-d">'  + d.getDate() + '</span>' +
        '<span class="gc-date-m">'  + d.toLocaleDateString('en-GB',{month:'short'}) + '</span>' +
        (isFinalDay?'<span style="font-size:8px;color:#d97706;font-weight:700">FINAL</span>':'') +
        '</button>';
    }
    bar.innerHTML = html;
    setTimeout(function() {
      var sel = bar.querySelector('.gc-date-selected');
      if (sel) sel.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'});
    }, 100);
  }

  function loadPLMatches() {
    var el = document.getElementById('gc-sch-matches');
    if (!el) return;

    /* PL Final Day — always show all 10 games from hardcoded data */
    if (_date === '2026-05-24') {
      /* Try live API first to get actual scores */
      el.innerHTML = '<div class="gc-loading"><div class="gc-spinner"></div><span>Loading Final Day matches...</span></div>';
      GC_API.getByDate('PL', '2026-05-24').then(function(apiMatches) {
        if (apiMatches && apiMatches.length >= 8) {
          el.innerHTML = matchList(apiMatches, '2026-05-24');
        } else {
          /* Use hardcoded fallback with live scores merged */
          var merged = PL_FINAL_DAY.map(function(m) {
            if (apiMatches) {
              var found = apiMatches.find(function(a) {
                return a.homeTeam && m.homeTeam &&
                  a.homeTeam.toLowerCase().indexOf(m.homeTeam.toLowerCase().split(' ')[0]) > -1;
              });
              if (found) return Object.assign({}, m, {homeScore:found.homeScore, awayScore:found.awayScore, isLive:found.isLive, isFT:found.isFT, isPre:found.isPre, minute:found.minute, scorers:found.scorers||[]});
            }
            return m;
          });
          el.innerHTML = matchList(merged, '2026-05-24');
        }
      }).catch(function() {
        el.innerHTML = matchList(PL_FINAL_DAY, '2026-05-24');
      });
      return;
    }

    el.innerHTML = '<div class="gc-loading"><div class="gc-spinner"></div><span>Loading matches...</span></div>';
    GC_API.getByDate('PL', _date).then(function(matches) {
      el.innerHTML = matchList(matches, _date);
    }).catch(function() {
      el.innerHTML = '<div class="gc-empty">⚠️ Could not load matches.</div>';
    });
  }

  function renderWC(container) {
    /* Default to 11 Jun if no date set */
    if (!_wcDate) _wcDate = '2026-06-11';

    /* Build round tabs */
    var tabsHtml = '<div class="gc-round-tabs">';
    WC_ROUNDS.forEach(function(r) {
      tabsHtml += '<button class="gc-round-tab' + (r.id===_wcRound?' active':'') +
        '" onclick="GC_SCHEDULE._wcRoundPick(\'' + r.id + '\')">' + r.label + '</button>';
    });
    tabsHtml += '</div>';

    /* Build timezone selector */
    var tzHtml = '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">' +
      '<button onclick="GC_SCHEDULE._setTz('UK')"  id="tz-UK"    class="gc-tz-btn' + (_tz==='UK'   ?' gc-tz-active':'') + '">🇬🇧 UK</button>' +
      '<button onclick="GC_SCHEDULE._setTz('CA')"  id="tz-CA"    class="gc-tz-btn' + (_tz==='CA'   ?' gc-tz-active':'') + '">🇨🇦 Canada</button>' +
      '<button onclick="GC_SCHEDULE._setTz('USA')" id="tz-USA"   class="gc-tz-btn' + (_tz==='USA'  ?' gc-tz-active':'') + '">🇺🇸 USA</button>' +
      '<button onclick="GC_SCHEDULE._setTz('OTHER')" id="tz-OTHER" class="gc-tz-btn' + (_tz==='OTHER'?' gc-tz-active':'') + '">🌍 My Time</button>' +
    '</div>';

    container.innerHTML =
      '<div style="padding-top:16px">' +
      '<div class="gc-hero-banner-wrap" style="height:160px;margin-bottom:18px">' +
        '<img src="https://images.unsplash.com/photo-1567521464027-f127ff144326?w=900&q=80" style="width:100%;height:100%;object-fit:cover" alt="WC">' +
        '<div class="gc-hero-banner-overlay">' +
          '<div class="gc-hero-banner-title">🏆 Ahmad's World Cup 2026 Schedule</div>' +
          '<div class="gc-hero-banner-sub">By Ahmad (A.Zafarani) · USA · Canada · Mexico · 48 Teams · 104 Matches</div>' +
        '</div>' +
      '</div>' +
      tzHtml +
      '<div class="gc-section-title">📅 World Cup Schedule</div>' +
      tabsHtml +
      '<div class="gc-datebar" id="gc-wc-datebar"></div>' +
      '<div id="gc-sch-matches"></div>' +
      '</div>';

    buildWCDateBar();
    loadWCDay();
  }

  function buildWCDateBar() {
    var bar = document.getElementById('gc-wc-datebar');
    if (!bar) return;
    var round = WC_ROUNDS.find(function(r){ return r.id === _wcRound; }) || WC_ROUNDS[0];
    /* Get unique dates from fixtures for this round */
    var dates = [];
    var seen = {};
    WC_FIXTURES.forEach(function(f) {
      if (f.date >= round.from && f.date <= round.to && !seen[f.date]) {
        dates.push(f.date); seen[f.date] = true;
      }
    });
    dates.sort();
    if (!dates.length) { bar.innerHTML = ''; return; }
    /* Default to first date of round */
    if (!_wcDate || _wcDate < round.from || _wcDate > round.to) _wcDate = dates[0];
    var html = '';
    dates.forEach(function(iso) {
      var d = new Date(iso + 'T12:00:00Z');
      var isSel = iso === _wcDate;
      html += '<button class="gc-date-btn' + (isSel?' gc-date-selected':'') +
        '" onclick="GC_SCHEDULE._wcDayPick('' + iso + '')">' +
        '<span class="gc-date-wd">' + d.toLocaleDateString('en-GB',{weekday:'short'}) + '</span>' +
        '<span class="gc-date-d">'  + d.getDate() + '</span>' +
        '<span class="gc-date-m">'  + d.toLocaleDateString('en-GB',{month:'short'}) + '</span>' +
        '</button>';
    });
    bar.innerHTML = html;
    setTimeout(function() {
      var sel = bar.querySelector('.gc-date-selected');
      if (sel) sel.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'});
    }, 100);
  }

  function loadWCDay() {
    var el = document.getElementById('gc-sch-matches');
    if (!el) return;

    /* Get fixtures for selected date */
    var dayFixtures = WC_FIXTURES.filter(function(f){ return f.date === _wcDate; });

    if (!dayFixtures.length) {
      el.innerHTML = '<div class="gc-empty">📭 No matches on this date.</div>';
      return;
    }

    /* Broadcaster data per team */
    var TV = {
      'Mexico':{'uk':'ITV/STV','us':'Fox','ca':'CTV/TSN'},
      'South Africa':{'uk':'ITV/STV','us':'Fox','ca':'TSN'},
      'South Korea':{'uk':'ITV','us':'FS1','ca':'TSN'},
      'Czechia':{'uk':'ITV','us':'FS1','ca':'TSN'},
      'Canada':{'uk':'BBC','us':'Fox','ca':'CTV/TSN'},
      'Bosnia & Herz.':{'uk':'BBC','us':'Fox','ca':'TSN'},
      'USA':{'uk':'BBC','us':'Fox','ca':'TSN'},
      'Paraguay':{'uk':'BBC','us':'Fox','ca':'TSN'},
      'Qatar':{'uk':'ITV','us':'FS1','ca':'TSN'},
      'Switzerland':{'uk':'ITV','us':'FS1','ca':'TSN'},
      'Brazil':{'uk':'BBC','us':'FS1','ca':'TSN'},
      'Morocco':{'uk':'BBC','us':'FS1','ca':'TSN'},
      'Haiti':{'uk':'BBC','us':'Fox','ca':'TSN'},
      'Scotland':{'uk':'BBC','us':'Fox','ca':'TSN'},
      'Germany':{'uk':'ITV','us':'Fox','ca':'TSN'},
      'Curaçao':{'uk':'ITV','us':'Fox','ca':'TSN'},
      'Netherlands':{'uk':'ITV','us':'FS1','ca':'TSN'},
      'Japan':{'uk':'ITV','us':'FS1','ca':'TSN'},
      'Ivory Coast':{'uk':'BBC','us':'FS1','ca':'TSN'},
      'Ecuador':{'uk':'BBC','us':'FS1','ca':'TSN'},
      'Sweden':{'uk':'ITV','us':'Fox','ca':'TSN'},
      'Tunisia':{'uk':'ITV','us':'Fox','ca':'TSN'},
      'Spain':{'uk':'ITV','us':'FS1','ca':'TSN'},
      'Cape Verde':{'uk':'ITV','us':'FS1','ca':'TSN'},
      'Belgium':{'uk':'BBC','us':'Fox','ca':'TSN'},
      'Egypt':{'uk':'BBC','us':'Fox','ca':'TSN'},
      'Saudi Arabia':{'uk':'ITV','us':'FS1','ca':'TSN'},
      'Uruguay':{'uk':'ITV','us':'FS1','ca':'TSN'},
      '🇮🇷 Iran':{'uk':'BBC','us':'Fox','ca':'TSN'},
      'New Zealand':{'uk':'BBC','us':'Fox','ca':'TSN'},
      'France':{'uk':'BBC','us':'FS1','ca':'TSN'},
      'Senegal':{'uk':'BBC','us':'FS1','ca':'TSN'},
      'Iraq':{'uk':'BBC','us':'Fox','ca':'TSN'},
      'Norway':{'uk':'BBC','us':'Fox','ca':'TSN'},
      'Argentina':{'uk':'ITV','us':'FS1','ca':'TSN'},
      'Algeria':{'uk':'ITV','us':'FS1','ca':'TSN'},
      'Austria':{'uk':'BBC','us':'Fox','ca':'TSN'},
      'Jordan':{'uk':'BBC','us':'Fox','ca':'TSN'},
      'Portugal':{'uk':'BBC','us':'FS1','ca':'TSN'},
      'DR Congo':{'uk':'BBC','us':'FS1','ca':'TSN'},
      'England':{'uk':'ITV','us':'Fox','ca':'TSN'},
      'Croatia':{'uk':'ITV','us':'Fox','ca':'TSN'},
      'Ghana':{'uk':'ITV','us':'FS1','ca':'TSN'},
      'Panama':{'uk':'ITV','us':'FS1','ca':'TSN'},
      'Uzbekistan':{'uk':'BBC','us':'Fox','ca':'TSN'},
      'Colombia':{'uk':'BBC','us':'Fox','ca':'TSN'},
      'Türkiye':{'uk':'ITV','us':'FS1','ca':'TSN'},
      'Australia':{'uk':'ITV','us':'FS1','ca':'TSN'}
    };

    var matches = dayFixtures.map(function(f) {
      /* Convert UK BST to UTC */
      var h = parseInt(f.time.split(':')[0]);
      var min = f.time.split(':')[1];
      var utcH = (h - 1 + 24) % 24;
      var tv = TV[f.home] || {uk:'BBC/ITV',us:'Fox/FS1',ca:'TSN/CTV'};
      return {
        homeTeam:f.home, homeLogo:f.hf,
        awayTeam:f.away, awayLogo:f.af,
        homeScore:null, awayScore:null,
        kickoff:f.date+'T'+(utcH<10?'0'+utcH:utcH)+':'+min+':00Z',
        venue:f.venue, league:f.group,
        isLive:false, isFT:false, isPre:true,
        statusShort:'', minute:'', scorers:[], tv:[],
        _ukTime:f.time, _date:f.date, _tv:tv
      };
    });

    el.innerHTML = matchList(matches, _wcDate);
  }

  function matchList(matches, dateIso) {
    if (!matches || !matches.length) return '<div class="gc-empty">📭 No matches on this date.</div>';
    matches.sort(function(a,b){ return new Date(a.kickoff)-new Date(b.kickoff); });
    var html = '<div>';
    if (dateIso) html += '<div class="gc-date-label">' + fmtDayLabel(dateIso) + ' — ' + matches.length + ' matches</div>';

    var grouped = {};
    matches.forEach(function(m) {
      var day = m.kickoff ? m.kickoff.slice(0,10) : 'unknown';
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(m);
    });

    Object.keys(grouped).sort().forEach(function(day) {
      if (!dateIso && day !== 'unknown') {
        html += '<div class="gc-group-label">' + fmtDayLabel(day) + '</div>';
      }
      grouped[day].forEach(function(m) { html += matchCard(m); });
    });
    html += '</div>';
    return html;
  }

  /* Format time based on selected timezone */
  function localTime(isoDate, ukTime) {
    try {
      /* UK BST = UTC+1. Convert to UTC first */
      var h = parseInt(ukTime.split(':')[0]);
      var min = ukTime.split(':')[1];
      var utcH = (h - 1 + 24) % 24;
      var utcStr = isoDate + 'T' + (utcH<10?'0'+utcH:utcH) + ':' + min + ':00Z';
      var dt = new Date(utcStr);

      /* Timezone map */
      var tzMap = {
        'UK'   : 'Europe/London',
        'CA'   : 'America/Toronto',
        'USA'  : 'America/New_York',
        'OTHER': Intl.DateTimeFormat().resolvedOptions().timeZone
      };
      var tz = tzMap[_tz] || 'Europe/London';

      /* Format time */
      var timeStr = dt.toLocaleTimeString('en-GB', {
        hour:'2-digit', minute:'2-digit',
        hour12: false, timeZone: tz
      });

      /* Add timezone label */
      var tzLabel = {'UK':'BST','CA':'ET','USA':'ET','OTHER':'Local'}[_tz]||'';
      return timeStr + ' <span style="font-size:9px;opacity:0.7">' + tzLabel + '</span>';
    } catch(e) { return ukTime; }
  }

  function matchCard(m) {
    var hasScore = m.homeScore !== null && m.awayScore !== null;
    var homeWin  = m.homeScore > m.awayScore;
    var awayWin  = m.awayScore > m.homeScore;
    var isWC     = m.league && m.league.indexOf('Group') > -1;

    /* Get local time for WC fixtures */
    var displayTime = m.kickoff ? GC_API.formatKickoff(m.kickoff) : '';
    if (m._ukTime && m._date) {
      displayTime = localTime(m._date, m._ukTime);
    }

    var html = '<div class="gc-match-card' + (m.isLive?' gc-match-live':'') + '">';

    /* Meta row: league + status */
    html += '<div class="gc-match-meta">';
    html += '<span class="gc-match-league">' + esc(m.league||'Premier League') + '</span>';
    if (m.isLive)    html += '<span class="gc-badge gc-badge-live">🔴 LIVE ' + esc(m.statusShort||'') + '</span>';
    else if (m.isFT) html += '<span class="gc-badge gc-badge-ft">Full Time</span>';
    else             html += '<span class="gc-badge gc-badge-pre">⏰ ' + displayTime + '</span>';
    html += '</div>';

    /* Teams + score */
    html += '<div class="gc-match-body">';
    html += '<div class="gc-team">' + (m.homeLogo?'<img class="gc-team-logo" src="'+esc(m.homeLogo)+'" alt="">':'') + '<span class="gc-team-name'+(homeWin?' gc-team-winner':'')+'">'+esc(m.homeTeam)+'</span></div>';
    html += '<div class="gc-score-wrap">';
    if (hasScore) html += '<span class="gc-score'+(m.isLive?' gc-score-live':'')+'">'+m.homeScore+'<span class="gc-score-sep">–</span>'+m.awayScore+'</span>';
    else          html += '<span class="gc-score gc-score-ko">' + displayTime + '</span>';
    if (m.isLive && m.minute) html += '<div class="gc-match-minute">'+esc(m.minute)+'</div>';
    html += '</div>';
    html += '<div class="gc-team gc-team-away">' + (m.awayLogo?'<img class="gc-team-logo" src="'+esc(m.awayLogo)+'" alt="">':'') + '<span class="gc-team-name'+(awayWin?' gc-team-winner':'')+'">'+esc(m.awayTeam)+'</span></div>';
    html += '</div>';

    /* Scorers */
    if (m.scorers && m.scorers.length) {
      html += '<div class="gc-scorers">';
      m.scorers.forEach(function(s) { html += '<span class="gc-scorer">⚽ '+esc(s.player)+(s.minute?' <span class="gc-scorer-min">'+esc(s.minute)+'</span>':'')+'</span>'; });
      html += '</div>';
    }

    /* Footer: venue + broadcaster */
    var footerParts = [];
    if (m.venue) footerParts.push('🏟 ' + esc(m.venue));
    if (m._tv) {
      var tvStr = '';
      if (m._tv.uk) tvStr += '🇬🇧 ' + m._tv.uk;
      if (m._tv.us) tvStr += (tvStr?' · ':'') + '🇺🇸 ' + m._tv.us;
      if (m._tv.ca) tvStr += (tvStr?' · ':'') + '🇨🇦 ' + m._tv.ca;
      if (tvStr) footerParts.push('📺 ' + tvStr);
    } else if (m.tv && m.tv.length) {
      footerParts.push('📺 ' + m.tv.map(esc).join(', '));
    }
    if (footerParts.length) {
      html += '<div class="gc-match-footer" style="flex-direction:column;gap:3px">';
      footerParts.forEach(function(p){ html += '<span>' + p + '</span>'; });
      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  function fmtDayLabel(iso) {
    if (!iso || iso==='unknown') return '';
    var d = new Date(iso);
    if (iso === GC_API.today()) return 'Today — ' + d.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});
    if (iso === '2026-05-24') return '🏆 PL Final Day — Sunday 24 May 2026';
    return d.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  }

  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return {
    render    : render,
    setLeague : setLeague,
    _pick     : function(iso) { _date = iso; buildDateBar(); loadPLMatches(); },
    _setTz    : function(tz) {
      _tz = tz;
      ['UK','CA','USA','OTHER'].forEach(function(t) {
        var btn = document.getElementById('tz-' + t);
        if (btn) btn.className = 'gc-tz-btn' + (t===tz?' gc-tz-active':'');
      });
      loadWCDay();
    },
    _wcDayPick: function(iso) {
      _wcDate = iso;
      buildWCDateBar();
      loadWCDay();
    },
    _setTz    : function(tz) {
      _tz = tz;
      /* Update button styles */
      ['UK','CA','USA','OTHER'].forEach(function(t) {
        var btn = document.getElementById('tz-' + t);
        if (btn) btn.className = 'gc-tz-btn' + (t === tz ? ' gc-tz-active' : '');
      });
      loadWCDay();
    },
    _wcDayPick: function(iso) {
      _wcDate = iso;
      buildWCDateBar();
      loadWCDay();
    },
    _wcRoundPick: function(id) {
      _wcRound = id;
      /* Set default date for this round */
      var round = WC_ROUNDS.find(function(r){ return r.id===id; });
      if (round) _wcDate = round.from;
      document.querySelectorAll('.gc-round-tab').forEach(function(b) {
        b.classList.toggle('active', b.textContent.trim().indexOf(round?round.label.slice(2):'') > -1);
      });
      buildWCDateBar();
      loadWCDay();
    }
  };
})();
