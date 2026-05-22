/* home.js — Home page, league-aware */
var GC_HOME = (function () {
  var _timer  = null;
  var _league = 'ALL';

  var DATES = {
    PL:  new Date('2026-05-24T15:00:00Z'),
    WC:  new Date('2026-06-11T19:00:00Z'),
    UCL: new Date('2026-05-30T16:00:00Z')
  };

  var HEROES = {
    PL:  { img:'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=900&q=80', title:'🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League 2025/26', sub:'Final Day — Sunday 24 May 2026 · All 10 games · 16:00 UK' },
    WC:  { img:'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=900&q=80', title:'🏆 FIFA World Cup 2026', sub:'USA · Canada · Mexico · 48 Teams · 104 Matches · 11 Jun' },
    UCL: { img:'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=900&q=80', title:'⭐ UEFA Champions League Final', sub:'PSG vs Arsenal · Budapest · 30 May 2026 · 17:00 UK' }
  };

  function heroBanner(t) {
    var h = HEROES[t];
    return '<div class="gc-hero-banner-wrap" style="height:150px;margin-bottom:14px">' +
      '<img src="' + h.img + '" style="width:100%;height:100%;object-fit:cover" alt="">' +
      '<div class="gc-hero-banner-overlay">' +
        '<div class="gc-hero-banner-title">' + h.title + '</div>' +
        '<div class="gc-hero-banner-sub">' + h.sub + '</div>' +
      '</div></div>';
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function startCountdown(key, targetDate) {
    function tick() {
      var el = document.getElementById('gc-cd-' + key);
      if (!el) return;
      var diff = targetDate - new Date();
      if (diff <= 0) { el.innerHTML = '<span class="gc-cd-unit"><span class="gc-cd-val" style="color:#dc2626">LIVE NOW!</span></span>'; return; }
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      el.innerHTML =
        '<span class="gc-cd-unit"><span class="gc-cd-val">' + d + '</span><span class="gc-cd-lbl">Days</span></span>' +
        '<span class="gc-cd-unit"><span class="gc-cd-val">' + pad(h) + '</span><span class="gc-cd-lbl">Hrs</span></span>' +
        '<span class="gc-cd-unit"><span class="gc-cd-val">' + pad(m) + '</span><span class="gc-cd-lbl">Min</span></span>' +
        '<span class="gc-cd-unit"><span class="gc-cd-val">' + pad(s) + '</span><span class="gc-cd-lbl">Sec</span></span>';
    }
    tick();
    return setInterval(tick, 1000);
  }

  function setLeague(t) { _league = t; }

  /* ══ PL ONLY PAGE ══════════════════════════════════════ */
  function renderPL(container) {
    container.innerHTML =
      '<div style="padding-top:16px">' +
      heroBanner('PL') +

      '<div class="gc-card gc-cd-card gc-cd-pl-card" style="margin-bottom:14px">' +
        '<div class="gc-cd-header">' +
          "<img class=\"gc-cd-logo\" src=\"https://resources.premierleague.com/premierleague/badges/pl_3lions.png\" alt=\"PL\">" +
          '<div><div class="gc-cd-title">🏆 Arsenal — Premier League Champions!</div><div class="gc-cd-sub">Final Day Sunday 24 May · 16:00 UK · All 10 matches</div></div>' +
        '</div>' +
        '<div class="gc-cd-units" id="gc-cd-PL"></div>' +
        '<button class="gc-btn gc-btn-primary" onclick="GC.go(&quot;live&quot;)">⚽ Watch Live Scores →</button>' +
      '</div>' +

      '<div class="gc-section-title">📋 Final Day Fixtures — 16:00 UK</div>' +
      '<div class="gc-card" style="padding:14px;margin-bottom:14px">' +
        ['Brighton vs Man United','Burnley vs Wolves','Crystal Palace vs Arsenal','Fulham vs Newcastle',
         'Liverpool vs Brentford','Man City vs Aston Villa',"Nott'm Forest vs Bournemouth",
         'Sunderland vs Chelsea','Tottenham vs Everton','West Ham vs Leeds United'].map(function(m) {
          var isArsenal = m.indexOf('Arsenal') > -1;
          return '<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid rgba(37,99,235,0.07);font-size:13px' + (isArsenal ? ';font-weight:700;color:#9B1C1C' : ';color:#334155') + '">' +
            '<span>' + (isArsenal ? '🏆 ' : '') + m + '</span>' +
            '<span style="color:#2563eb;font-weight:600;font-size:12px">16:00</span>' +
          '</div>';
        }).join('') +
      '</div>' +

      '<div class="gc-section-title">📰 PL News</div>' +
      '<a href="/blog-pl-final-day.html" style="text-decoration:none;display:block;margin-bottom:10px">' +
        '<div class="gc-card" style="padding:14px;cursor:pointer">' +
          '<div style="font-size:11px;font-weight:700;color:#9B1C1C;margin-bottom:4px">🏴󠁧󠁢󠁥󠁮󠁧󠁩 PREMIER LEAGUE · FINAL DAY</div>' +
          '<div style="font-size:13px;font-weight:700;color:#0f172a;margin-bottom:4px">🏆 Arsenal Champions! PL Final Day — Everything You Need to Know</div>' +
          '<span style="font-size:12px;color:#2563eb;font-weight:600">Read more →</span>' +
        '</div>' +
      '</a>' +

      '<div class="gc-card gc-signup-card">' +
        '<div class="gc-signup-title">📬 Get PL Goal Alerts by Email</div>' +
        '<div class="gc-signup-sub">Never miss a Premier League goal. Free!</div>' +
        '<div id="gc-brevo-form" style="margin-top:14px">' +
          '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">' +
            '<input type="email" id="gc-email-input" placeholder="Your email address" style="flex:1;min-width:200px;max-width:300px;padding:11px 14px;border:1px solid rgba(100,160,220,0.3);border-radius:8px;background:rgba(255,255,255,0.85);font-family:Verdana,sans-serif;font-size:13px;color:#0f172a;outline:none">' +
            '<button onclick="GC_HOME._subscribe()" style="background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;border:none;padding:11px 20px;border-radius:8px;font-family:Verdana,sans-serif;font-size:13px;font-weight:700;cursor:pointer">Subscribe Free →</button>' +
          '</div>' +
          '<div id="gc-brevo-msg" style="margin-top:10px;font-size:12px;color:#16a34a;display:none;font-weight:600"></div>' +
        '</div>' +
      '</div>' +

      '</div>';

    if (_timer) clearInterval(_timer);
    _timer = startCountdown('PL', DATES.PL);
  }


  /* ══ WC GROUPS DATA ════════════════════════════════════ */
  var WC_GROUPS = [
    { name:'A', teams:[
      {flag:'🇲🇽',name:'Mexico'},   {flag:'🇿🇦',name:'South Africa'},
      {flag:'🇰🇷',name:'South Korea'},{flag:'🇨🇿',name:'Czechia'}
    ]},
    { name:'B', teams:[
      {flag:'🇨🇦',name:'Canada'},   {flag:'🇨🇭',name:'Switzerland'},
      {flag:'🇶🇦',name:'Qatar'},    {flag:'🇧🇦',name:'Bosnia & Herz.'}
    ]},
    { name:'C', teams:[
      {flag:'🇧🇷',name:'Brazil'},   {flag:'🇲🇦',name:'Morocco'},
      {flag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿',name:'Scotland'},{flag:'🇭🇹',name:'Haiti'}
    ]},
    { name:'D', teams:[
      {flag:'🇺🇸',name:'USA'},      {flag:'🇵🇾',name:'Paraguay'},
      {flag:'🇦🇺',name:'Australia'},{flag:'🇹🇷',name:'Turkiye'}
    ]},
    { name:'E', teams:[
      {flag:'🇩🇪',name:'Germany'},  {flag:'🇨🇼',name:'Curacao'},
      {flag:'🇨🇮',name:"Côte d'Ivoire"},{flag:'🇪🇨',name:'Ecuador'}
    ]},
    { name:'F', teams:[
      {flag:'🇳🇱',name:'Netherlands'},{flag:'🇯🇵',name:'Japan'},
      {flag:'🇹🇳',name:'Tunisia'},  {flag:'🇸🇪',name:'Sweden'}
    ]},
    { name:'G', teams:[
      {flag:'🇧🇪',name:'Belgium'},  {flag:'🇪🇬',name:'Egypt'},
      {flag:'🇮🇷',name:'Iran'},     {flag:'🇳🇿',name:'New Zealand'}
    ]},
    { name:'H', teams:[
      {flag:'🇪🇸',name:'Spain'},    {flag:'🇨🇻',name:'Cape Verde'},
      {flag:'🇸🇦',name:'Saudi Arabia'},{flag:'🇺🇾',name:'Uruguay'}
    ]},
    { name:'I', teams:[
      {flag:'🇫🇷',name:'France'},   {flag:'🇸🇳',name:'Senegal'},
      {flag:'🇳🇴',name:'Norway'},   {flag:'🇮🇶',name:'Iraq'}
    ]},
    { name:'J', teams:[
      {flag:'🇦🇷',name:'Argentina'},{flag:'🇩🇿',name:'Algeria'},
      {flag:'🇦🇹',name:'Austria'}, {flag:'🇯🇴',name:'Jordan'}
    ]},
    { name:'K', teams:[
      {flag:'🇵🇹',name:'Portugal'}, {flag:'🇨🇴',name:'Colombia'},
      {flag:'🇺🇿',name:'Uzbekistan'},{flag:'🇨🇩',name:'DR Congo'}
    ]},
    { name:'L', teams:[
      {flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',name:'England'},  {flag:'🇭🇷',name:'Croatia'},
      {flag:'🇬🇭',name:'Ghana'},    {flag:'🇵🇦',name:'Panama'}
    ]}
  ];

  var _wcGroup = 0; /* current group index */

  function renderWCGroup(container, idx) {
    _wcGroup = idx;
    var g = WC_GROUPS[idx];
    var prev = idx > 0 ? WC_GROUPS[idx-1].name : null;
    var next = idx < WC_GROUPS.length-1 ? WC_GROUPS[idx+1].name : null;

    var teamsHtml = g.teams.map(function(t, i) {
      return '<div style="display:grid;grid-template-columns:32px 1fr 26px 26px 26px 34px;gap:4px;padding:10px 14px;background:' + (i%2===0?'rgba(255,255,255,0.58)':'rgba(255,255,255,0.35)') + ';border-top:1px solid rgba(100,160,220,0.1);align-items:center;font-size:13px;font-weight:600">' +
        '<span style="font-size:22px">' + t.flag + '</span>' +
        '<span style="color:#0f172a">' + t.name + '</span>' +
        '<span style="text-align:center;color:#94a3b8;font-size:11px">0</span>' +
        '<span style="text-align:center;color:#94a3b8;font-size:11px">0</span>' +
        '<span style="text-align:center;color:#94a3b8;font-size:11px">0</span>' +
        '<span style="text-align:right;font-weight:800;color:#2563eb">0</span>' +
      '</div>';
    }).join('');

    container.innerHTML =
      '<div style="padding-top:16px">' +

      /* Header */
      '<div style="background:linear-gradient(135deg,#002868,#bf0a30);padding:16px;border-radius:16px;margin:0 16px 14px;text-align:center">' +
        '<div style="font-size:10px;font-weight:800;letter-spacing:2px;color:rgba(255,255,255,0.7);margin-bottom:4px">FIFA WORLD CUP 2026</div>' +
        '<div style="font-family:Verdana,sans-serif;font-size:28px;font-weight:900;color:#ffd700;letter-spacing:2px">GROUP ' + g.name + '</div>' +
        '<div style="font-size:11px;color:rgba(255,255,255,0.6);margin-top:4px">USA · Canada · Mexico · 11 Jun – 19 Jul 2026</div>' +
      '</div>' +

      /* Group navigation arrows */
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:0 16px;margin-bottom:14px">' +
        (prev ?
          '<button onclick="GC_HOME._wcNav(' + (idx-1) + ')" style="background:#2563eb;color:#fff;border:none;border-radius:10px;padding:8px 14px;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:6px;font-family:Verdana,sans-serif">← Group ' + prev + '</button>' :
          '<div></div>'
        ) +
        /* Group dots navigation */
        '<div style="display:flex;gap:5px">' +
          WC_GROUPS.map(function(gr, i) {
            return '<div onclick="GC_HOME._wcNav(' + i + ')" style="width:' + (i===idx?'20px':'8px') + ';height:8px;border-radius:20px;background:' + (i===idx?'#2563eb':'rgba(37,99,235,0.25)') + ';cursor:pointer;transition:all .2s"></div>';
          }).join('') +
        '</div>' +
        (next ?
          '<button onclick="GC_HOME._wcNav(' + (idx+1) + ')" style="background:#2563eb;color:#fff;border:none;border-radius:10px;padding:8px 14px;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:6px;font-family:Verdana,sans-serif">Group ' + next + ' →</button>' :
          '<div></div>'
        ) +
      '</div>' +

      /* Group table */
      '<div style="margin:0 16px;border-radius:14px;overflow:hidden;border:1.5px solid rgba(37,99,235,0.15);box-shadow:0 2px 8px rgba(0,122,255,0.05);margin-bottom:14px">' +
        '<div style="display:grid;grid-template-columns:32px 1fr 26px 26px 26px 34px;gap:4px;padding:8px 14px;background:#dbeafe;font-size:9px;font-weight:700;color:#2563eb;letter-spacing:1px;text-transform:uppercase">' +
          '<span></span><span>Team</span><span style="text-align:center">P</span><span style="text-align:center">W</span><span style="text-align:center">D</span><span style="text-align:right">Pts</span>' +
        '</div>' +
        teamsHtml +
      '</div>' +

      /* Chip tabs for this group */
      '<div style="display:flex;gap:8px;padding:0 16px 10px;overflow-x:auto;scrollbar-width:none">' +
        '<button onclick="GC_HOME._wcTab(this,\'fixtures\',' + idx + ')" class="gc-round-tab active" style="font-family:Verdana,sans-serif">📅 Fixtures</button>' +
        '<button onclick="GC_HOME._wcTab(this,\'news\',' + idx + ')" class="gc-round-tab" style="font-family:Verdana,sans-serif">📰 News</button>' +
        '<button onclick="GC_HOME._wcTab(this,\'teams\',' + idx + ')" class="gc-round-tab" style="font-family:Verdana,sans-serif">👕 Teams</button>' +
      '</div>' +

      /* Tab content area */
      '<div id="wc-tab-content" style="padding:0 16px">' +
        renderWCFixtures(g) +
      '</div>' +

      /* Countdown */
      '<div class="gc-card" style="margin:14px 16px;text-align:center">' +
        '<div style="font-size:11px;font-weight:700;color:#64748b;margin-bottom:8px">⏱ World Cup Begins In</div>' +
        '<div class="gc-cd-units" id="gc-cd-WC" style="justify-content:center"></div>' +
      '</div>' +

      '</div>';

    if (_timer) clearInterval(_timer);
    _timer = startCountdown('WC', DATES.WC);
  }

  function renderWCFixtures(g) {
    return '<div style="font-size:11px;font-weight:700;color:#64748b;margin-bottom:8px;letter-spacing:1px;text-transform:uppercase">Group ' + g.name + ' Fixtures</div>' +
    '<div style="background:rgba(255,255,255,0.7);border:1px solid rgba(37,99,235,0.1);border-radius:12px;padding:12px;font-size:12px;color:#64748b;text-align:center">' +
      '📅 Group ' + g.name + ' fixtures will appear here once the tournament begins on 11 June 2026' +
    '</div>';
  }

  function renderWCNews(g, container) {
    container.innerHTML = '<div style="font-size:11px;font-weight:700;color:#64748b;margin-bottom:8px;letter-spacing:1px;text-transform:uppercase">📰 Latest Group ' + g.name + ' News</div>' +
      '<div class="gc-loading"><div class="gc-spinner"></div><span>Loading news...</span></div>';

    /* Fetch live news from ESPN for the teams in this group */
    var teamNames = g.teams.map(function(t){ return t.name; }).join(' OR ');
    var query = encodeURIComponent('World Cup 2026 Group ' + g.name);
    var url = 'https://corsproxy.io/?' + encodeURIComponent('https://site.api.espn.com/apis/site/v2/sports/soccer/news?limit=5&query=' + query);

    fetch(url)
      .then(function(r){ return r.json(); })
      .then(function(data){
        var articles = data.articles || data.feed || [];
        if (!articles.length) throw new Error('no articles');
        var html = articles.slice(0,4).map(function(a){
          return '<a href="' + (a.links && a.links.web ? a.links.web.href : '#') + '" target="_blank" rel="noopener" style="text-decoration:none;display:block;margin-bottom:8px">' +
            '<div class="gc-card" style="padding:12px;cursor:pointer">' +
              '<div style="font-size:10px;font-weight:700;color:#2563eb;margin-bottom:4px">🌍 WC2026 · GROUP ' + g.name + '</div>' +
              '<div style="font-size:12px;font-weight:700;color:#0f172a;line-height:1.4;margin-bottom:4px">' + (a.headline || a.title || '') + '</div>' +
              '<span style="font-size:11px;color:#2563eb;font-weight:600">Read →</span>' +
            '</div>' +
          '</a>';
        }).join('');
        container.innerHTML = '<div style="font-size:11px;font-weight:700;color:#64748b;margin-bottom:8px;letter-spacing:1px;text-transform:uppercase">📰 Latest Group ' + g.name + ' News</div>' + html;
      })
      .catch(function(){
        container.innerHTML = '<div style="font-size:11px;font-weight:700;color:#64748b;margin-bottom:8px;letter-spacing:1px;text-transform:uppercase">📰 Latest Group ' + g.name + ' News</div>' +
          '<div style="background:rgba(255,255,255,0.7);border:1px solid rgba(37,99,235,0.1);border-radius:12px;padding:14px;font-size:12px;color:#64748b;text-align:center">' +
            'News for Group ' + g.name + ' will appear here once the tournament begins.' +
          '</div>';
      });
  }

  function renderWCTeams(g) {
    return '<div style="font-size:11px;font-weight:700;color:#64748b;margin-bottom:8px;letter-spacing:1px;text-transform:uppercase">👕 Group ' + g.name + ' Teams</div>' +
    g.teams.map(function(t){
      return '<div style="display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.7);border:1px solid rgba(37,99,235,0.1);border-radius:12px;padding:12px 14px;margin-bottom:8px">' +
        '<span style="font-size:32px">' + t.flag + '</span>' +
        '<div><div style="font-size:14px;font-weight:700;color:#0f172a">' + t.name + '</div>' +
        '<div style="font-size:11px;color:#64748b;margin-top:2px">FIFA World Cup 2026 · Group ' + g.name + '</div></div>' +
      '</div>';
    }).join('');
  }


  /* ══ WC ONLY PAGE ══════════════════════════════════════ */
  function renderWC(container) {
    renderWCGroup(container, _wcGroup);
  }

  /* ══ UCL HOME CARD ═════════════════════════════════════ */
  function renderUCLHome(container) {
    container.innerHTML =
      '<div style="padding-top:16px">' +
      heroBanner('UCL') +

      '<div class="gc-card" style="background:linear-gradient(135deg,rgba(26,26,46,0.06),rgba(15,52,96,0.04));border:1px solid rgba(255,215,0,0.25);padding:20px;margin-bottom:14px;text-align:center">' +
        '<div style="font-size:12px;font-weight:700;color:#0f3460;letter-spacing:1px;margin-bottom:10px">⭐ UCL FINAL COUNTDOWN</div>' +
        '<div style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:12px;margin-bottom:14px">' +
          '<div style="text-align:center"><div style="font-size:38px">🇫🇷</div><div style="font-size:16px;font-weight:800;color:#0f172a">PSG</div></div>' +
          '<div style="text-align:center"><div class="gc-cd-units" id="gc-cd-UCL" style="justify-content:center"></div></div>' +
          '<div style="text-align:center"><div style="font-size:38px">🔴</div><div style="font-size:16px;font-weight:800;color:#9B1C1C">Arsenal</div></div>' +
        '</div>' +
        '<div style="font-size:12px;color:#475569">📅 Sat 30 May 2026 · 17:00 UK · Puskás Aréna, Budapest</div>' +
        '<button class="gc-btn gc-btn-primary" style="margin-top:12px" onclick="GC.go(&quot;ucl&quot;)">⭐ Full Match Preview + Lineups →</button>' +
      '</div>' +

      '<a href="/blog-ucl-final.html" style="text-decoration:none;display:block;margin-bottom:14px">' +
        '<div class="gc-card" style="padding:16px;cursor:pointer;border:1px solid rgba(255,215,0,0.2)">' +
          '<div style="font-size:11px;font-weight:700;color:#0f3460;letter-spacing:1px;margin-bottom:6px">⭐ UCL FINAL · 30 MAY 2026</div>' +
          '<div style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:4px">PSG vs Arsenal — 2026 Champions League Final Preview</div>' +
          '<div style="font-size:12px;color:#64748b;margin-bottom:8px">Full preview · Expected lineups · GoalCurrent prediction</div>' +
          '<span style="font-size:12px;color:#2563eb;font-weight:600">Read full preview →</span>' +
        '</div>' +
      '</a>' +

      '</div>';

    if (_timer) clearInterval(_timer);
    _timer = startCountdown('UCL', DATES.UCL);
  }

  /* ══ HOME PAGE — shows ALL leagues ═════════════════════ */
  function renderAll(container) {
    container.innerHTML =
      '<div style="padding-top:16px">' +

      '<div class="gc-hero">' +
        '<div class="gc-hero-eyebrow"><span class="gc-hero-dot-red"></span>LIVE SCORES</div>' +
        '<h1 class="gc-hero-title">Goal<span>Current</span>.live</h1>' +
        '<p class="gc-hero-sub">Premier League · UCL Final · World Cup 2026 · Real-time scores</p>' +
      '</div>' +



      '<div class="gc-card gc-cd-card gc-cd-pl-card" style="margin-bottom:14px">' +
        heroBanner('PL') +
        '<div class="gc-cd-header"><img class="gc-cd-logo" src="https://resources.premierleague.com/premierleague/badges/pl_3lions.png"  alt="PL"><div><div class="gc-cd-title">🏆 Arsenal — PL Champions! Final Day</div><div class="gc-cd-sub">Sunday 24 May · 16:00 UK · All 10 matches</div></div></div>' +
        '<div class="gc-cd-units" id="gc-cd-PL"></div>' +
        '<button class="gc-btn gc-btn-primary" onclick="GC.go(&quot;live&quot;)">⚽ Watch Live Scores →</button>' +
      '</div>' +

      /* UCL FINAL CARD — between PL and WC */
      '<div class="gc-card" style="background:linear-gradient(135deg,#1a1a2e,#0f3460);border:1px solid rgba(255,215,0,0.4);padding:18px;margin-bottom:14px;cursor:pointer;text-align:center" onclick="GC.go(&quot;ucl&quot;)">' +
        '<div style="font-size:11px;font-weight:700;color:#ffd700;letter-spacing:2px;margin-bottom:10px">⭐ UEFA CHAMPIONS LEAGUE FINAL 2026</div>' +
        '<div style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:8px;margin-bottom:12px">' +
          '<div style="text-align:center"><div style="font-size:32px">🇫🇷</div><div style="font-size:15px;font-weight:800;color:#fff;margin-top:4px">PSG</div></div>' +
          '<div style="text-align:center"><div style="font-family:Verdana,sans-serif;font-size:13px;font-weight:700;color:rgba(255,255,255,0.5);margin-bottom:4px">SAT 30 MAY</div><div class="gc-cd-units" id="gc-cd-UCL" style="justify-content:center;gap:4px"></div></div>' +
          '<div style="text-align:center"><div style="font-size:32px">🔴</div><div style="font-size:15px;font-weight:800;color:#fff;margin-top:4px">Arsenal</div></div>' +
        '</div>' +
        '<div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:12px">📍 Puskás Aréna, Budapest · 17:00 UK · BT Sport / TNT Sports</div>' +
        '<span style="display:inline-block;background:rgba(255,215,0,0.15);color:#ffd700;border:1px solid rgba(255,215,0,0.3);padding:7px 16px;border-radius:20px;font-size:12px;font-weight:700">⭐ Full Preview + Lineups →</span>' +
      '</div>' +

      '<div class="gc-card gc-cd-card gc-cd-wc-card" style="margin-bottom:14px">' +
        heroBanner('WC') +
        '<div class="gc-cd-header"><span class="gc-cd-icon">🏆</span><div><div class="gc-cd-title">FIFA World Cup 2026</div><div class="gc-cd-sub">USA · Canada · Mexico · 48 Teams · 104 Matches</div></div></div>' +
        '<div class="gc-cd-units" id="gc-cd-WC"></div>' +
        '<button class="gc-btn gc-btn-gold" onclick="GC.go(&quot;schedule&quot;)">📅 View Full Schedule →</button>' +
      '</div>' +

      '<div class="gc-section-title">📰 Latest News</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">' +
        '<a href="/blog-ucl-final.html" style="text-decoration:none">' +
          '<div class="gc-card" style="padding:14px;cursor:pointer;height:100%">' +
            '<div style="font-size:10px;font-weight:700;color:#0f3460;margin-bottom:4px">⭐ UCL FINAL</div>' +
            '<div style="font-size:12px;font-weight:700;color:#0f172a;margin-bottom:4px;line-height:1.4">PSG vs Arsenal — UCL Final Preview</div>' +
            '<span style="font-size:11px;color:#2563eb;font-weight:600">Read →</span>' +
          '</div>' +
        '</a>' +
        '<a href="/blog-pl-final-day.html" style="text-decoration:none">' +
          '<div class="gc-card" style="padding:14px;cursor:pointer;height:100%">' +
            '<div style="font-size:10px;font-weight:700;color:#9B1C1C;margin-bottom:4px">🏴󠁧󠁢󠁥󠁮󠁧󠁩 PL FINAL DAY</div>' +
            '<div style="font-size:12px;font-weight:700;color:#0f172a;margin-bottom:4px;line-height:1.4">Arsenal Champions! Final Day Guide</div>' +
            '<span style="font-size:11px;color:#2563eb;font-weight:600">Read →</span>' +
          '</div>' +
        '</a>' +
        '<a href="/blog-england-croatia.html" style="text-decoration:none">' +
          '<div class="gc-card" style="padding:14px;cursor:pointer;height:100%">' +
            '<div style="font-size:10px;font-weight:700;color:#1d4ed8;margin-bottom:4px">🏆 WORLD CUP 2026</div>' +
            '<div style="font-size:12px;font-weight:700;color:#0f172a;margin-bottom:4px;line-height:1.4">England vs Croatia — WC2026 Preview</div>' +
            '<span style="font-size:11px;color:#2563eb;font-weight:600">Read →</span>' +
          '</div>' +
        '</a>' +
      '</div>' +

      '<div class="gc-card gc-signup-card">' +
        '<div class="gc-signup-title">📬 Get Goal Alerts by Email</div>' +
        '<div class="gc-signup-sub">Never miss a goal — PL · UCL Final · World Cup 2026. Free!</div>' +
        '<div id="gc-brevo-form" style="margin-top:14px">' +
          '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">' +
            '<input type="email" id="gc-email-input" placeholder="Your email address" style="flex:1;min-width:200px;max-width:300px;padding:11px 14px;border:1px solid rgba(100,160,220,0.3);border-radius:8px;background:rgba(255,255,255,0.85);font-family:Verdana,sans-serif;font-size:13px;color:#0f172a;outline:none">' +
            '<button onclick="GC_HOME._subscribe()" style="background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;border:none;padding:11px 20px;border-radius:8px;font-family:Verdana,sans-serif;font-size:13px;font-weight:700;cursor:pointer">Subscribe Free →</button>' +
          '</div>' +
          '<div id="gc-brevo-msg" style="margin-top:10px;font-size:12px;color:#16a34a;display:none;font-weight:600"></div>' +
        '</div>' +
      '</div>' +

      '</div>';

    if (_timer) clearInterval(_timer);
    _timer = startCountdown('PL',  DATES.PL);
    startCountdown('WC',  DATES.WC);
    startCountdown('UCL', DATES.UCL);
  }

  /* ══ MAIN RENDER — decides which page to show ══════════ */
  function render(container) {
    if      (_league === 'WC')  renderWC(container);
    else if (_league === 'UCL') renderUCLHome(container);
    else if (_league === 'PL')  renderPL(container);
    else                         renderAll(container);
  }

  return {
    render   : render,
    setLeague: setLeague,
    _wcNav: function(idx) {
      var el = document.getElementById('gc-content');
      if (el) renderWCGroup(el, idx);
    },
    _wcTab: function(btn, tab, idx) {
      /* Switch chip active state */
      btn.closest('div').querySelectorAll('.gc-round-tab').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      var content = document.getElementById('wc-tab-content');
      if (!content) return;
      var g = WC_GROUPS[idx];
      if (tab === 'fixtures') content.innerHTML = renderWCFixtures(g);
      else if (tab === 'teams')    content.innerHTML = renderWCTeams(g);
      else if (tab === 'news')     renderWCNews(g, content);
    },
    _subscribe: function() {
      var input = document.getElementById('gc-email-input');
      var msg   = document.getElementById('gc-brevo-msg');
      if (!input || !input.value || input.value.indexOf('@') < 0) {
        if (msg) { msg.style.display='block'; msg.style.color='#dc2626'; msg.textContent='Please enter a valid email address.'; }
        return;
      }
      var form = document.createElement('form');
      form.method='POST';
      form.action='https://6f3982fe.sibforms.com/serve/MUIFAAeE0hUslfMPz6bu9jEdklCxC0j3MKRhPltWSCDC_tVUwEcn-BPO3nLjIw2aSho06qiaVbJQeSm82mDriQMJMGfLswlCCKPLLfx0zUzMswOSlJdOlApYAZWAC_afmaPFWT15_roCfNbtYVtGFlMgKM1HGk_pVspxm85Bu_diOgScU9dhJ5759I1ylWVpHoPZGfmBCXXou9sSrQ==';
      form.target='_blank'; form.style.display='none';
      var f1=document.createElement('input'); f1.name='EMAIL'; f1.value=input.value;
      var f2=document.createElement('input'); f2.name='email_address_check'; f2.value='';
      var f3=document.createElement('input'); f3.name='locale'; f3.value='en';
      form.appendChild(f1); form.appendChild(f2); form.appendChild(f3);
      document.body.appendChild(form); form.submit(); document.body.removeChild(form);
      if (msg) { msg.style.display='block'; msg.style.color='#16a34a'; msg.textContent='Thank you! Please check your email to confirm.'; }
      if (input) input.value='';
    }
  };
})();