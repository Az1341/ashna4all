/* home.js — Home page, league-aware */
var GC_HOME = (function () {
  var _timer  = null;
  var _league = 'PL';

  var DATES = {
    PL:  new Date('2026-05-24T15:00:00Z'),  /* 16:00 UK BST */
    WC:  new Date('2026-06-11T19:00:00Z'),  /* 20:00 UK BST */
    UCL: new Date('2026-05-30T16:00:00Z')   /* 17:00 UK BST */
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

  function renderPL(container) {
    container.innerHTML =
      '<div style="padding-top:16px">' +
      heroBanner('PL') +

      /* Countdown */
      '<div class="gc-card gc-cd-card gc-cd-pl-card" style="margin-bottom:14px">' +
        '<div class="gc-cd-header">' +
          '<img class="gc-cd-logo" src="https://resources.premierleague.com/premierleague/badges/pl_3lions.png" onerror="this.src=\'https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Premier_League_Logo.svg/120px-Premier_League_Logo.svg.png\'" alt="PL">' +
          '<div><div class="gc-cd-title">🏆 Arsenal — Premier League Champions!</div><div class="gc-cd-sub">Final Day Sunday 24 May · 16:00 UK · All 10 matches</div></div>' +
        '</div>' +
        '<div class="gc-cd-units" id="gc-cd-PL"></div>' +
        '<button class="gc-btn gc-btn-primary" onclick="GC.go(\'live\')">⚽ Watch Live Scores →</button>' +
      '</div>' +

      /* Final day fixtures preview */
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

      /* Blog links */
      '<div class="gc-section-title">📰 Latest News</div>' +
      '<a href="/blog-pl-final-day.html" style="text-decoration:none;display:block;margin-bottom:10px">' +
        '<div class="gc-card" style="padding:14px;cursor:pointer">' +
          '<div style="font-size:11px;font-weight:700;color:#9B1C1C;margin-bottom:4px">🏴󠁧󠁢󠁥󠁮󠁧󠁩 PREMIER LEAGUE · FINAL DAY</div>' +
          '<div style="font-size:13px;font-weight:700;color:#0f172a;margin-bottom:4px">🏆 Arsenal Champions! PL Final Day — Everything You Need to Know</div>' +
          '<span style="font-size:12px;color:#2563eb;font-weight:600">Read more →</span>' +
        '</div>' +
      '</a>' +

      /* Email signup */
      '<div class="gc-card gc-signup-card">' +
        '<div class="gc-signup-title">📬 Get Goal Alerts by Email</div>' +
        '<div class="gc-signup-sub">Never miss a goal — Premier League &amp; World Cup 2026 updates. Free!</div>' +
        '<div id="gc-brevo-form" style="margin-top:14px">' +
          '<div id="gc-brevo-inline" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">' +
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

  function renderWC(container) {
    container.innerHTML =
      '<div style="padding-top:16px">' +
      heroBanner('WC') +

      /* Countdown */
      '<div class="gc-card gc-cd-card gc-cd-wc-card" style="margin-bottom:14px">' +
        '<div class="gc-cd-header">' +
          '<span class="gc-cd-icon">🏆</span>' +
          '<div><div class="gc-cd-title">FIFA World Cup 2026</div><div class="gc-cd-sub">USA · Canada · Mexico · 48 Teams · 104 Matches</div></div>' +
        '</div>' +
        '<div class="gc-cd-units" id="gc-cd-WC"></div>' +
        '<button class="gc-btn gc-btn-gold" onclick="GC.go(\'schedule\')">📅 View Full Schedule →</button>' +
      '</div>' +

      /* Opening match */
      '<div class="gc-section-title">🚀 Opening Match — 11 June 2026</div>' +
      '<div class="gc-card" style="padding:18px;margin-bottom:14px;text-align:center">' +
        '<div style="font-size:12px;font-weight:700;color:#64748b;margin-bottom:8px">GROUP A · ESTADIO AZTECA · MEXICO CITY</div>' +
        '<div style="display:flex;align-items:center;justify-content:center;gap:20px">' +
          '<div style="text-align:center"><div style="font-size:36px">🇲🇽</div><div style="font-size:14px;font-weight:700;color:#0f172a">Mexico</div></div>' +
          '<div style="text-align:center"><div style="font-size:22px;font-weight:700;color:#2563eb">20:00 UK</div><div style="font-size:11px;color:#64748b">BST</div></div>' +
          '<div style="text-align:center"><div style="font-size:36px">🇿🇦</div><div style="font-size:14px;font-weight:700;color:#0f172a">South Africa</div></div>' +
        '</div>' +
        '<div style="margin-top:10px;font-size:12px;color:#64748b">📺 ITV/STV (UK) · Fox (USA) · CTV/TSN (Canada)</div>' +
      '</div>' +

      /* England fixture */
      '<div class="gc-section-title">🏴󠁧󠁢󠁥󠁮󠁧󠁿 England — Group L</div>' +
      '<div class="gc-card" style="padding:16px;margin-bottom:14px">' +
        [
          {d:'17 Jun',h:'England',hf:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',a:'Croatia',af:'🇭🇷',t:'21:00',tv:'ITV'},
          {d:'23 Jun',h:'England',hf:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',a:'Ghana',af:'🇬🇭',t:'21:00',tv:'BBC'},
          {d:'27 Jun',h:'Panama',hf:'🇵🇦',a:'England',af:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',t:'22:00',tv:'ITV'}
        ].map(function(f){
          return '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(37,99,235,0.07);font-size:13px">' +
            '<span style="color:#64748b;font-size:11px;width:44px">' + f.d + '</span>' +
            '<span style="font-weight:600;color:#0f172a">' + f.hf + ' ' + f.h + '</span>' +
            '<span style="color:#2563eb;font-weight:700">' + f.t + '</span>' +
            '<span style="font-weight:600;color:#0f172a">' + f.a + ' ' + f.af + '</span>' +
            '<span style="font-size:11px;color:#64748b;width:30px;text-align:right">' + f.tv + '</span>' +
          '</div>';
        }).join('') +
      '</div>' +

      /* Blog link */
      '<a href="/blog-england-croatia.html" style="text-decoration:none;display:block;margin-bottom:14px">' +
        '<div class="gc-card" style="padding:14px;cursor:pointer">' +
          '<div style="font-size:11px;font-weight:700;color:#1d4ed8;margin-bottom:4px">🏆 WORLD CUP 2026 · GROUP L</div>' +
          '<div style="font-size:13px;font-weight:700;color:#0f172a;margin-bottom:4px">England vs Croatia — World Cup 2026 Preview</div>' +
          '<span style="font-size:12px;color:#2563eb;font-weight:600">Read preview →</span>' +
        '</div>' +
      '</a>' +

      /* Email signup */
      '<div class="gc-card gc-signup-card">' +
        '<div class="gc-signup-title">📬 Get World Cup Alerts by Email</div>' +
        '<div class="gc-signup-sub">Never miss a goal — World Cup 2026 scores delivered to your inbox. Free!</div>' +
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
    _timer = startCountdown('WC', DATES.WC);
  }

  function renderUCLHome(container) {
    container.innerHTML =
      '<div style="padding-top:16px">' +
      heroBanner('UCL') +

      /* Countdown */
      '<div class="gc-card" style="background:linear-gradient(135deg,rgba(26,26,46,0.06),rgba(15,52,96,0.04));border:1px solid rgba(255,215,0,0.25);padding:20px;margin-bottom:14px;text-align:center">' +
        '<div style="font-size:12px;font-weight:700;color:#0f3460;letter-spacing:1px;margin-bottom:10px">⭐ UCL FINAL COUNTDOWN</div>' +
        '<div style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:12px;margin-bottom:14px">' +
          '<div style="text-align:center"><div style="font-size:38px">🇫🇷</div><div style="font-size:16px;font-weight:800;color:#0f172a">PSG</div></div>' +
          '<div style="text-align:center">' +
            '<div class="gc-cd-units" id="gc-cd-UCL" style="justify-content:center"></div>' +
          '</div>' +
          '<div style="text-align:center"><div style="font-size:38px">🔴</div><div style="font-size:16px;font-weight:800;color:#9B1C1C">Arsenal</div></div>' +
        '</div>' +
        '<div style="font-size:12px;color:#475569">📅 Sat 30 May 2026 · 17:00 UK · Puskás Aréna, Budapest</div>' +
        '<button class="gc-btn gc-btn-primary" style="margin-top:12px" onclick="GC.go(\'ucl\')">⭐ Full Match Preview + Lineups →</button>' +
      '</div>' +

      /* Blog link */
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

  function renderAll(container) {
    /* HOME PAGE — shows ALL leagues */
    container.innerHTML =
      '<div style="padding-top:16px">' +

      /* Main hero */
      '<div class="gc-hero">' +
        '<div class="gc-hero-eyebrow"><span class="gc-hero-dot-red"></span>LIVE SCORES</div>' +
        '<h1 class="gc-hero-title">Goal<span>Current</span>.live</h1>' +
        '<p class="gc-hero-sub">Premier League · UCL Final · World Cup 2026 · Real-time scores</p>' +
      '</div>' +

      /* UCL Final card - most urgent */
      '<div class="gc-card" style="background:linear-gradient(135deg,rgba(26,26,46,0.07),rgba(15,52,96,0.04));border:1px solid rgba(255,215,0,0.3);padding:18px;margin-bottom:14px;cursor:pointer" onclick="GC.go(\'ucl\')">' +
        '<div style="font-size:11px;font-weight:700;color:#0f3460;letter-spacing:1px;margin-bottom:8px">⭐ NEXT UP · UCL FINAL · SAT 30 MAY · 17:00 UK</div>' +
        '<div style="display:flex;align-items:center;justify-content:space-between">' +
          '<div style="display:flex;align-items:center;gap:10px"><span style="font-size:28px">🇫🇷</span><span style="font-size:15px;font-weight:700;color:#0f172a">PSG</span></div>' +
          '<div style="text-align:center"><div class="gc-cd-units" id="gc-cd-UCL" style="justify-content:center;gap:6px"></div></div>' +
          '<div style="display:flex;align-items:center;gap:10px"><span style="font-size:15px;font-weight:700;color:#9B1C1C">Arsenal</span><span style="font-size:28px">🔴</span></div>' +
        '</div>' +
        '<div style="font-size:11px;color:#64748b;margin-top:8px;text-align:center">Puskas Arena, Budapest · BT Sport / TNT Sports</div>' +
      '</div>' +

      /* PL card */
      '<div class="gc-card gc-cd-card gc-cd-pl-card" style="margin-bottom:14px">' +
        heroBanner('PL') +
        '<div class="gc-cd-header"><img class="gc-cd-logo" src="https://resources.premierleague.com/premierleague/badges/pl_3lions.png" onerror="this.src=\'https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Premier_League_Logo.svg/120px-Premier_League_Logo.svg.png\'" alt="PL"><div><div class="gc-cd-title">🏆 Arsenal — PL Champions! Final Day</div><div class="gc-cd-sub">Sunday 24 May · 16:00 UK · All 10 matches</div></div></div>' +
        '<div class="gc-cd-units" id="gc-cd-PL"></div>' +
        '<button class="gc-btn gc-btn-primary" onclick="GC.go(\'live\')">⚽ Watch Live Scores →</button>' +
      '</div>' +

      /* WC card */
      '<div class="gc-card gc-cd-card gc-cd-wc-card" style="margin-bottom:14px">' +
        heroBanner('WC') +
        '<div class="gc-cd-header"><span class="gc-cd-icon">🏆</span><div><div class="gc-cd-title">FIFA World Cup 2026</div><div class="gc-cd-sub">USA · Canada · Mexico · 48 Teams · 104 Matches</div></div></div>' +
        '<div class="gc-cd-units" id="gc-cd-WC"></div>' +
        '<button class="gc-btn gc-btn-gold" onclick="GC.go(\'schedule\')">📅 View Full Schedule →</button>' +
      '</div>' +

      /* News section */
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

      /* Email signup */
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

  function render(container) {
    if      (_league === 'WC')  renderWC(container);
    else if (_league === 'UCL') renderUCLHome(container);
    else                         renderAll(container); /* PL or default = show all */
  }

  return {
    render   : render,
    setLeague: setLeague,
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
