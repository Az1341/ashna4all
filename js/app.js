/* app.js — Navigation: Home/Live/Schedule/Groups/MyTeams */
var GC = (function () {
  var currentPage = 'home';
  var currentType = 'PL';

  function draw() {
    var el = document.getElementById('gc-content');
    if (!el) return;
    el.innerHTML = '<div class="gc-loading"><div class="gc-spinner"></div><span>Loading...</span></div>';

    // Safety timeout — if still loading after 8s show error
    var safetyTimer = setTimeout(function() {
      if (el.querySelector('.gc-spinner')) {
        el.innerHTML = '<div class="gc-empty">⚠️ Taking too long to load.<br><button class="gc-btn gc-btn-primary" onclick="GC.draw()">🔄 Retry</button></div>';
      }
    }, 8000);

    try {
      switch (currentPage) {
        case 'home':     if (window.GC_HOME)     GC_HOME.render(el);     break;
        case 'live':     if (window.GC_LIVE)     GC_LIVE.render(el);     break;
        case 'schedule': if (window.GC_SCHEDULE) GC_SCHEDULE.render(el); break;
        case 'groups':   if (window.GC_GROUPS)   GC_GROUPS.render(el);   break;
        case 'myteams':  if (window.GC_MYTEAMS)  GC_MYTEAMS.render(el);  break;
        default: el.innerHTML = '<p style="padding:20px">Page not found.</p>';
      }
      clearTimeout(safetyTimer);
    } catch(e) {
      clearTimeout(safetyTimer);
      el.innerHTML = '<div class="gc-empty">⚠️ Error loading page: ' + e.message + '<br><button class="gc-btn gc-btn-primary" onclick="GC.draw()">🔄 Retry</button></div>';
      console.error('Draw error:', e);
    }
  }

  function go(page) {
    currentPage = page;
    document.querySelectorAll('[data-page]').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.page === page);
    });
    draw();
    window.scrollTo(0, 0);
  }

  function initNav() {
    document.querySelectorAll('[data-page]').forEach(function(btn) {
      btn.addEventListener('click', function() { go(btn.dataset.page); });
    });
    document.querySelectorAll('.gc-league-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        currentType = btn.dataset.league;
        document.querySelectorAll('.gc-league-btn').forEach(function(b) {
          b.classList.toggle('active', b.dataset.league === currentType);
        });
        if (window.GC_LIVE)     GC_LIVE.setLeague(currentType);
        if (window.GC_SCHEDULE) GC_SCHEDULE.setLeague(currentType);
        if (window.GC_GROUPS)   GC_GROUPS.setLeague(currentType);
        draw();
      });
    });
  }

  function initCanvas() {
    var c = document.getElementById('gc-canvas');
    if (!c) return;
    var ctx = c.getContext('2d');
    function resize() { c.width = window.innerWidth; c.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);
    var particles = [];
    for (var i = 0; i < 45; i++) {
      particles.push({
        x: Math.random()*window.innerWidth, y: Math.random()*window.innerHeight,
        r: Math.random()*2+.5,
        vx:(Math.random()-.5)*.22, vy:(Math.random()-.5)*.22,
        a: Math.random()*.12+.03
      });
    }
    function tick() {
      ctx.clearRect(0,0,c.width,c.height);
      particles.forEach(function(p) {
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=c.width; if(p.x>c.width)p.x=0;
        if(p.y<0)p.y=c.height; if(p.y>c.height)p.y=0;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle='rgba(37,99,235,'+p.a+')'; ctx.fill();
      });
      requestAnimationFrame(tick);
    }
    tick();
  }

  function renderUCL(container) {
    /* UCL Final: PSG vs Arsenal - 30 May 2026 17:00 UK */
    var kickoff = new Date('2026-05-30T16:00:00Z'); /* 18:00 CET = 17:00 UK BST */
    var now = new Date();
    var diff = kickoff - now;
    var isLive = diff < 0 && diff > -7200000; /* within 2 hours */
    var isFuture = diff > 0;

    var days = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var mins = Math.floor((diff % 3600000) / 60000);
    var countdown = isFuture ? (days + 'd ' + hours + 'h ' + mins + 'm') : '';

    container.innerHTML =
      '<div style="padding-top:16px">' +

      /* Hero Banner */
      '<div style="background:linear-gradient(135deg,#1a1a2e,#16213e,#0f3460);border-radius:20px;padding:24px;margin-bottom:18px;text-align:center;border:1px solid rgba(255,215,0,0.3)">' +
        '<div style="font-size:13px;font-weight:700;color:#ffd700;letter-spacing:2px;margin-bottom:8px">⭐ UEFA CHAMPIONS LEAGUE FINAL 2026</div>' +
        '<div style="font-size:13px;color:rgba(255,255,255,0.7);margin-bottom:16px">📅 Saturday 30 May 2026 &nbsp;·&nbsp; ⏰ 17:00 UK (18:00 CET) &nbsp;·&nbsp; 🏟 Puskás Aréna, Budapest</div>' +

        /* Teams */
        '<div style="display:flex;align-items:center;justify-content:center;gap:20px;margin:20px 0">' +
          '<div style="text-align:center">' +
            '<div style="font-size:48px">🇫🇷</div>' +
            '<div style="font-size:18px;font-weight:800;color:#ffffff;margin-top:6px">PSG</div>' +
            '<div style="font-size:12px;color:rgba(255,255,255,0.6)">Paris Saint-Germain</div>' +
          '</div>' +
          '<div style="text-align:center">' +
            (isLive ?
              '<div style="background:#dc2626;color:#fff;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:700;margin-bottom:8px">🔴 LIVE</div>' :
              '<div style="font-size:14px;color:rgba(255,255,255,0.5);margin-bottom:8px">VS</div>') +
            (isFuture ? '<div style="font-size:22px;font-weight:700;color:#ffd700">' + countdown + '</div><div style="font-size:10px;color:rgba(255,255,255,0.5)">until kick off</div>' : '') +
          '</div>' +
          '<div style="text-align:center">' +
            '<div style="font-size:48px">🔴</div>' +
            '<div style="font-size:18px;font-weight:800;color:#ffffff;margin-top:6px">Arsenal</div>' +
            '<div style="font-size:12px;color:rgba(255,255,255,0.6)">The Gunners</div>' +
          '</div>' +
        '</div>' +

        '<div style="font-size:12px;color:rgba(255,255,255,0.6)">📺 BT Sport / TNT Sports (UK) &nbsp;·&nbsp; 🎵 The Killers - Kick Off Show</div>' +
      '</div>' +

      /* Match Info Cards */
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">' +
        '<div class="gc-card" style="text-align:center;padding:16px">' +
          '<div style="font-size:24px;margin-bottom:6px">🏟</div>' +
          '<div style="font-size:12px;font-weight:700;color:#0f172a">Venue</div>' +
          '<div style="font-size:12px;color:#475569;margin-top:4px">Puskás Aréna<br>Budapest, Hungary</div>' +
        '</div>' +
        '<div class="gc-card" style="text-align:center;padding:16px">' +
          '<div style="font-size:24px;margin-bottom:6px">⏰</div>' +
          '<div style="font-size:12px;font-weight:700;color:#0f172a">Kick Off</div>' +
          '<div style="font-size:12px;color:#475569;margin-top:4px">17:00 UK (BST)<br>18:00 CET · 16:00 UTC</div>' +
        '</div>' +
      '</div>' +

      /* PSG Lineup */
      '<div class="gc-section-title">👕 Expected Line-ups</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">' +
        /* PSG */
        '<div class="gc-card" style="padding:16px">' +
          '<div style="font-size:13px;font-weight:700;color:#0f172a;margin-bottom:10px;text-align:center">🇫🇷 Paris Saint-Germain</div>' +
          '<div style="font-size:11px;color:#64748b;margin-bottom:6px;text-align:center">4-3-3 (Expected)</div>' +
          buildLineup(['GK: Donnarumma','RB: Hakimi','CB: Marquinhos','CB: Pacho','LB: Mendes','CM: Vitinha','CM: Fabian Ruiz','CM: Zaire-Emery','RW: Dembele','ST: Mayulu','LW: Barcola']) +
        '</div>' +
        /* Arsenal */
        '<div class="gc-card" style="padding:16px">' +
          '<div style="font-size:13px;font-weight:700;color:#0f172a;margin-bottom:10px;text-align:center">🔴 Arsenal</div>' +
          '<div style="font-size:11px;color:#64748b;margin-bottom:6px;text-align:center">4-3-3 (Expected)</div>' +
          buildLineup(['GK: Raya','RB: Ben White','CB: Saliba','CB: Gabriel','LB: Calafiori','CM: Odegaard','CM: Rice','CM: Merino','RW: Saka','ST: Havertz','LW: Martinelli']) +
        '</div>' +
      '</div>' +

      /* UCL Final Blog Link */
      '<div class="gc-card" style="background:linear-gradient(135deg,rgba(26,26,46,0.08),rgba(15,52,96,0.08));border:1px solid rgba(255,215,0,0.2);padding:20px;text-align:center">' +
        '<div style="font-size:20px;margin-bottom:8px">⭐</div>' +
        '<div style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:6px">PSG vs Arsenal — UCL Final Preview</div>' +
        '<div style="font-size:12px;color:#475569;margin-bottom:12px">Arsenal bid to become European Champions in Budapest — full preview, stats and prediction</div>' +
        '<a href="/blog-ucl-final.html" style="background:linear-gradient(135deg,#1a1a2e,#0f3460);color:#ffd700;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:12px;font-weight:700">Read Full Preview →</a>' +
      '</div>' +

      '</div>';
  }

  function buildLineup(players) {
    var html = '<div style="display:flex;flex-direction:column;gap:4px">';
    players.forEach(function(p) {
      var pos = p.split(':')[0];
      var name = p.split(':')[1];
      var posColor = {GK:'#f59e0b',RB:'#3b82f6',CB:'#3b82f6',LB:'#3b82f6',CM:'#22c55e',RW:'#ef4444',ST:'#ef4444',LW:'#ef4444'}[pos] || '#64748b';
      html += '<div style="display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid rgba(37,99,235,0.06)">' +
        '<span style="font-size:9px;font-weight:700;color:' + posColor + ';width:26px;flex-shrink:0">' + pos + '</span>' +
        '<span style="font-size:12px;color:#334155">' + name.trim() + '</span>' +
      '</div>';
    });
    return html + '</div>';
  }


  return {
    go: go, draw: draw,
    getType: function() { return currentType; },
    init: function() {
      initNav(); initCanvas();
      // Auto-refresh live scores without resetting page
      setInterval(function() {
        if(currentPage === 'live') {
          var el = document.getElementById('gc-content');
          if (el && window.GC_LIVE) GC_LIVE.fetchOnly(el);
        }
      }, 60000);
      go('home');
    }
  };
})();

document.addEventListener('DOMContentLoaded', function() { GC.init(); });
