/* app.js — Navigation: Home/Live/Schedule/Groups/MyTeams */
var GC = (function () {
  var currentPage = 'home';
  var currentType = 'PL';

  function draw() {
    var el = document.getElementById('gc-content');
    if (!el) return;
    el.innerHTML = '<div class="gc-loading"><div class="gc-spinner"></div><span>Loading...</span></div>';

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
        case 'news':     renderNews(el);   break;
        case 'ucl':      renderUCL(el);    break;
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
        /* UCL goes to its own dedicated page */
        if (currentType === 'UCL') { go('ucl'); return; }
        /* Update all pages to show relevant content */
        if (window.GC_LIVE)     GC_LIVE.setLeague(currentType);
        if (window.GC_SCHEDULE) GC_SCHEDULE.setLeague(currentType);
        if (window.GC_GROUPS)   GC_GROUPS.setLeague(currentType);
        if (window.GC_HOME)     GC_HOME.setLeague(currentType);
        /* Always go to home when switching league */
        go('home');
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

  function renderNews(container) {
    container.innerHTML =
      '<div style="padding-top:16px">' +
      '<div class="gc-hero-banner-wrap" style="height:140px;margin-bottom:18px">' +
        '<img src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=900&q=80" style="width:100%;height:100%;object-fit:cover" alt="Football News">' +
        '<div class="gc-hero-banner-overlay">' +
          '<div class="gc-hero-banner-title">📰 Latest Football News</div>' +
          '<div class="gc-hero-banner-sub">GoalCurrent.live · Match previews, reports and analysis</div>' +
        '</div>' +
      '</div>' +

      '<div class="gc-section-title">⭐ Champions League</div>' +
      '<a href="/blog-ucl-final.html" style="text-decoration:none;display:block;margin-bottom:12px">' +
        '<div class="gc-card" style="cursor:pointer;padding:18px;border:1px solid rgba(255,215,0,0.3);background:linear-gradient(135deg,rgba(26,26,46,0.06),rgba(15,52,96,0.04))">' +
          '<div style="font-size:11px;font-weight:700;color:#0f3460;letter-spacing:1px;margin-bottom:6px">⭐ UCL FINAL · 30 MAY 2026 · 17:00 UK</div>' +
          '<div style="font-size:15px;font-weight:700;color:#0f172a;margin-bottom:4px">🇫🇷 PSG vs Arsenal 🔴 — 2026 Champions League Final Preview</div>' +
          '<div style="font-size:12px;color:#64748b;margin-bottom:8px">🏟 Puskás Aréna, Budapest · Full preview, expected line-ups and prediction</div>' +
          '<span style="font-size:12px;color:#2563eb;font-weight:600">Read full preview + lineups →</span>' +
        '</div>' +
      '</a>' +

      '<div class="gc-section-title">🏴󠁧󠁢󠁥󠁮󠁧󠁩 Premier League</div>' +
      '<a href="/blog-pl-final-day.html" style="text-decoration:none;display:block;margin-bottom:12px">' +
        '<div class="gc-card" style="cursor:pointer;padding:18px">' +
          '<div style="font-size:11px;font-weight:700;color:#9B1C1C;letter-spacing:1px;margin-bottom:6px">🏴󠁧󠁢󠁥󠁮󠁧󠁩 PREMIER LEAGUE · FINAL DAY · 24 MAY 2026</div>' +
          '<div style="font-size:15px;font-weight:700;color:#0f172a;margin-bottom:4px">🏆 Arsenal Confirmed Champions! PL Final Day — Everything You Need to Know</div>' +
          '<div style="font-size:12px;color:#64748b;margin-bottom:8px">All 10 matches at 16:00 UK · Title race · Relegation battle · Full fixtures</div>' +
          '<span style="font-size:12px;color:#2563eb;font-weight:600">Read full article →</span>' +
        '</div>' +
      '</a>' +

      '<div class="gc-section-title">🏆 World Cup 2026</div>' +
      '<a href="/blog-england-croatia.html" style="text-decoration:none;display:block;margin-bottom:12px">' +
        '<div class="gc-card" style="cursor:pointer;padding:18px">' +
          '<div style="font-size:11px;font-weight:700;color:#1d4ed8;letter-spacing:1px;margin-bottom:6px">🏆 WORLD CUP 2026 · GROUP L · 17 JUN · 21:00 UK</div>' +
          '<div style="font-size:15px;font-weight:700;color:#0f172a;margin-bottom:4px">🏴󠁧󠁢󠁥󠁮󠁧󠁿 England vs Croatia — World Cup 2026 Group L Preview</div>' +
          '<div style="font-size:12px;color:#64748b;margin-bottom:8px">AT&T Stadium, Dallas · ITV · Full preview and prediction</div>' +
          '<span style="font-size:12px;color:#2563eb;font-weight:600">Read full preview →</span>' +
        '</div>' +
      '</a>' +

      '</div>';
  }

  function renderUCL(container) {
    var kickoff = new Date('2026-05-30T16:00:00Z');
    var now = new Date();
    var diff = kickoff - now;
    var isFuture = diff > 0;
    var isLive = diff <= 0 && diff > -7200000;
    var days  = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var mins  = Math.floor((diff % 3600000) / 60000);

    var psgPlayers = ['GK:Donnarumma','RB:Hakimi','CB:Marquinhos','CB:Pacho','LB:Mendes','CM:Vitinha','CM:Fabian Ruiz','CM:Zaire-Emery','RW:Dembele','ST:Mayulu','LW:Barcola'];
    var arsPlayers = ['GK:Raya','RB:Ben White','CB:Saliba','CB:Gabriel','LB:Calafiori','CM:Odegaard','CM:Rice','CM:Merino','RW:Saka','ST:Havertz','LW:Martinelli'];

    var scoreBox = isFuture
      ? '<div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:6px">KICK OFF</div><div style="font-size:28px;font-weight:800;color:#ffd700">17:00 UK</div><div style="margin-top:10px;background:rgba(255,215,0,0.15);padding:8px 14px;border-radius:10px;font-size:14px;color:#ffd700;font-weight:700">' + days + 'd ' + hours + 'h ' + mins + 'm</div>'
      : isLive
      ? '<div style="background:#dc2626;color:#fff;padding:5px 14px;border-radius:20px;font-size:13px;font-weight:700;margin-bottom:8px">LIVE</div><div style="font-size:40px;font-weight:800;color:#ffd700">0 – 0</div>'
      : '<div style="font-size:28px;font-weight:800;color:#ffd700">FT</div>';

    var html =
      '<div style="padding-top:16px">' +

      '<div style="background:linear-gradient(135deg,#1a1a2e,#0f3460);border-radius:20px;padding:24px 16px;margin-bottom:16px;text-align:center;border:2px solid rgba(255,215,0,0.35);box-shadow:0 8px 32px rgba(0,0,0,0.25)">' +
        '<div style="font-size:11px;font-weight:700;color:#ffd700;letter-spacing:2px;margin-bottom:8px">UEFA CHAMPIONS LEAGUE FINAL 2026</div>' +
        '<div style="font-size:11px;color:rgba(255,255,255,0.55);margin-bottom:16px">Sat 30 May 2026 &middot; Puskas Arena, Budapest</div>' +
        '<div style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px">' +
          '<div style="text-align:center"><div style="font-size:42px">&#127467;&#127479;</div><div style="font-size:18px;font-weight:800;color:#fff;margin-top:4px">PSG</div><div style="font-size:10px;color:rgba(255,255,255,0.45)">Holders</div></div>' +
          '<div style="text-align:center;min-width:100px">' + scoreBox + '</div>' +
          '<div style="text-align:center"><div style="font-size:42px">&#128308;</div><div style="font-size:18px;font-weight:800;color:#fff;margin-top:4px">Arsenal</div><div style="font-size:10px;color:rgba(255,255,255,0.45)">PL Champions</div></div>' +
        '</div>' +
        '<div style="font-size:11px;color:rgba(255,255,255,0.45);margin-top:14px">TV: BT Sport / TNT Sports (UK) &middot; The Killers Kick Off Show</div>' +
      '</div>' +

      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px">' +
        '<div class="gc-card" style="text-align:center;padding:14px"><div style="font-size:20px">&#127967;</div><div style="font-size:11px;font-weight:700;color:#0f172a;margin-top:4px">Venue</div><div style="font-size:10px;color:#64748b;margin-top:2px">Puskas Arena<br>Budapest</div></div>' +
        '<div class="gc-card" style="text-align:center;padding:14px"><div style="font-size:20px">&#9200;</div><div style="font-size:11px;font-weight:700;color:#0f172a;margin-top:4px">Kick Off</div><div style="font-size:10px;color:#64748b;margin-top:2px">17:00 UK BST<br>18:00 CET</div></div>' +
        '<div class="gc-card" style="text-align:center;padding:14px"><div style="font-size:20px">&#128250;</div><div style="font-size:11px;font-weight:700;color:#0f172a;margin-top:4px">TV UK</div><div style="font-size:10px;color:#64748b;margin-top:2px">BT Sport<br>TNT Sports</div></div>' +
      '</div>' +

      '<div class="gc-section-title">&#128302; Our Prediction</div>' +
      '<div class="gc-card" style="background:linear-gradient(135deg,rgba(34,197,94,0.07),rgba(37,99,235,0.04));border:1px solid rgba(37,99,235,0.15);padding:20px;margin-bottom:16px;text-align:center">' +
        '<div style="font-size:11px;font-weight:700;color:#15803d;letter-spacing:1px;margin-bottom:8px">&#9917; GOALCURRENT PREDICTION</div>' +
        '<div style="font-size:34px;font-weight:700;color:#0f172a;letter-spacing:4px;margin-bottom:6px">Arsenal 2 &mdash; 1 PSG</div>' +
        '<div style="font-size:12px;color:#64748b">Arsenal to complete an incredible domestic and European double! &#128308;&#127942;</div>' +
      '</div>' +

      '<div class="gc-section-title">&#128221; Match Preview</div>' +
      '<div class="gc-card" style="padding:20px;margin-bottom:12px">' +
        '<p style="font-size:13px;color:#334155;line-height:1.8;margin-bottom:10px">The biggest night in European club football arrives on <strong>Saturday 30 May 2026</strong>. <strong>Paris Saint-Germain</strong> face <strong>Arsenal</strong> in the UEFA Champions League Final at the spectacular Puskas Arena in Budapest, Hungary.</p>' +
        '<p style="font-size:13px;color:#334155;line-height:1.8;margin-bottom:10px">PSG arrive as defending champions, bidding to become only the second club to retain the trophy in the Champions League era after Real Madrid.</p>' +
        '<p style="font-size:13px;color:#334155;line-height:1.8">Arsenal arrive as <strong>Premier League 2025/26 Champions</strong>. This is their first UCL Final since 2006 — 20 years of waiting.</p>' +
      '</div>' +
      '<div class="gc-card" style="border-left:4px solid #2563eb;border-radius:0 12px 12px 0;padding:14px 18px;margin-bottom:16px;font-size:13px;color:#1e40af;font-style:italic;background:rgba(37,99,235,0.04)">' +
        '"Premier League champions AND European champions in the same season would be one of the greatest achievements in Arsenal's history."' +
      '</div>' +

      '<div class="gc-section-title">&#11088; Key Players</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">' +
        '<div class="gc-card" style="padding:14px">' +
          '<div style="font-size:12px;font-weight:700;color:#0f172a;margin-bottom:8px;text-align:center">&#127467;&#127479; PSG Stars</div>' +
          '<div style="font-size:12px;color:#334155;padding:5px 0;border-bottom:1px solid rgba(37,99,235,0.06)">&#11088; Ousmane Dembele</div>' +
          '<div style="font-size:12px;color:#334155;padding:5px 0;border-bottom:1px solid rgba(37,99,235,0.06)">&#11088; Bradley Barcola</div>' +
          '<div style="font-size:12px;color:#334155;padding:5px 0;border-bottom:1px solid rgba(37,99,235,0.06)">&#11088; Vitinha</div>' +
          '<div style="font-size:12px;color:#334155;padding:5px 0;border-bottom:1px solid rgba(37,99,235,0.06)">&#11088; Achraf Hakimi</div>' +
          '<div style="font-size:12px;color:#334155;padding:5px 0">&#11088; Gianluigi Donnarumma</div>' +
        '</div>' +
        '<div class="gc-card" style="padding:14px">' +
          '<div style="font-size:12px;font-weight:700;color:#9B1C1C;margin-bottom:8px;text-align:center">&#128308; Arsenal Stars</div>' +
          '<div style="font-size:12px;color:#334155;padding:5px 0;border-bottom:1px solid rgba(155,28,28,0.06)">&#11088; Bukayo Saka</div>' +
          '<div style="font-size:12px;color:#334155;padding:5px 0;border-bottom:1px solid rgba(155,28,28,0.06)">&#11088; Martin Odegaard</div>' +
          '<div style="font-size:12px;color:#334155;padding:5px 0;border-bottom:1px solid rgba(155,28,28,0.06)">&#11088; Declan Rice</div>' +
          '<div style="font-size:12px;color:#334155;padding:5px 0;border-bottom:1px solid rgba(155,28,28,0.06)">&#11088; Kai Havertz</div>' +
          '<div style="font-size:12px;color:#334155;padding:5px 0">&#11088; Gabriel Martinelli</div>' +
        '</div>' +
      '</div>' +

      '<div class="gc-section-title">&#128089; Expected Line-ups</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">' +
        '<div class="gc-card" style="padding:14px">' +
          '<div style="font-size:12px;font-weight:700;text-align:center;margin-bottom:4px;color:#0f172a">&#127467;&#127479; Paris Saint-Germain</div>' +
          '<div style="font-size:10px;color:#64748b;text-align:center;margin-bottom:8px">4-3-3</div>' +
          buildLineup(psgPlayers) +
        '</div>' +
        '<div class="gc-card" style="padding:14px">' +
          '<div style="font-size:12px;font-weight:700;text-align:center;margin-bottom:4px;color:#9B1C1C">&#128308; Arsenal</div>' +
          '<div style="font-size:10px;color:#64748b;text-align:center;margin-bottom:8px">4-3-3</div>' +
          buildLineup(arsPlayers) +
        '</div>' +
      '</div>' +

      '<a href="/blog-ucl-final.html" style="text-decoration:none;display:block">' +
        '<div class="gc-card" style="text-align:center;padding:16px;border:1px solid rgba(37,99,235,0.2);background:rgba(37,99,235,0.04)">' +
          '<div style="font-size:13px;font-weight:700;color:#0f172a;margin-bottom:4px">&#128214; Read Full UCL Final Preview</div>' +
          '<div style="font-size:12px;color:#64748b;margin-bottom:8px">Detailed analysis, head-to-head and full prediction</div>' +
          '<span style="font-size:12px;color:#2563eb;font-weight:600">Read more &#8594;</span>' +
        '</div>' +
      '</a>' +

      '</div>';

    container.innerHTML = html;

    if (isLive) {
      setTimeout(function() { renderUCL(container); }, 60000);
    }
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