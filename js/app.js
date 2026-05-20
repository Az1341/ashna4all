/* ============================================================
   app.js — Navigation, draw engine, background canvas
   goalcurrent.live
   ============================================================ */

var GC = (function () {

  var currentPage = 'home';
  var currentType = 'PL'; // 'PL' or 'WC'

  /* ── draw() — main render dispatcher ─────────────────── */
  function draw() {
    var el = document.getElementById('gc-content');
    if (!el) return;
    el.innerHTML = '<div class="gc-loading"><div class="gc-spinner"></div><span>Loading...</span></div>';

    switch (currentPage) {
      case 'home':     if (window.GC_HOME)     GC_HOME.render(el);     break;
      case 'live':     if (window.GC_LIVE)     GC_LIVE.render(el);     break;
      case 'schedule': if (window.GC_SCHEDULE) GC_SCHEDULE.render(el); break;
      case 'groups':   if (window.GC_GROUPS)   GC_GROUPS.render(el);   break;
      default:         el.innerHTML = '<p style="padding:20px">Page not found.</p>';
    }
  }

  /* ── go() — navigate to a page ───────────────────────── */
  function go(page) {
    currentPage = page;

    // update nav buttons
    document.querySelectorAll('.gc-nav-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.page === page);
    });

    draw();
  }

  /* ── initNav() ────────────────────────────────────────── */
  function initNav() {
    document.querySelectorAll('.gc-nav-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        go(btn.dataset.page);
      });
    });

    // league toggle (PL / WC)
    document.querySelectorAll('.gc-league-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentType = btn.dataset.league;
        document.querySelectorAll('.gc-league-btn').forEach(function (b) {
          b.classList.toggle('active', b.dataset.league === currentType);
        });
        // notify modules of league change
        if (window.GC_LIVE)     GC_LIVE.setLeague(currentType);
        if (window.GC_SCHEDULE) GC_SCHEDULE.setLeague(currentType);
        if (window.GC_GROUPS)   GC_GROUPS.setLeague(currentType);
        draw();
      });
    });
  }

  /* ── Background canvas ────────────────────────────────── */
  function initCanvas() {
    var c = document.getElementById('gc-canvas');
    if (!c) return;
    var ctx = c.getContext('2d');

    function resize() {
      c.width  = window.innerWidth;
      c.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // floating particles
    var particles = [];
    for (var i = 0; i < 55; i++) {
      particles.push({
        x  : Math.random() * window.innerWidth,
        y  : Math.random() * window.innerHeight,
        r  : Math.random() * 2 + 0.5,
        vx : (Math.random() - .5) * 0.3,
        vy : (Math.random() - .5) * 0.3,
        a  : Math.random() * 0.4 + 0.1
      });
    }

    function tick() {
      ctx.clearRect(0, 0, c.width, c.height);
      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0)        p.x = c.width;
        if (p.x > c.width)  p.x = 0;
        if (p.y < 0)        p.y = c.height;
        if (p.y > c.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59,130,246,' + p.a + ')';
        ctx.fill();
      });
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ── Auto-refresh live scores every 60s ──────────────── */
  function startAutoRefresh() {
    setInterval(function () {
      if (currentPage === 'live') draw();
    }, 60000);
  }

  /* ── Public API ───────────────────────────────────────── */
  return {
    go          : go,
    draw        : draw,
    getType     : function () { return currentType; },
    getPage     : function () { return currentPage; },

    init: function () {
      initNav();
      initCanvas();
      startAutoRefresh();
      go('home'); // start on home page
    }
  };

})();

/* Boot on DOM ready */
document.addEventListener('DOMContentLoaded', function () {
  GC.init();
});
