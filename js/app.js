/* app.js — Navigation: Home/Live/Schedule/Groups/MyTeams */
var GC = (function () {
  var currentPage = 'home';
  var currentType = 'PL';

  function draw() {
    var el = document.getElementById('gc-content');
    if (!el) return;
    el.innerHTML = '<div class="gc-loading"><div class="gc-spinner"></div><span>Loading...</span></div>';
    switch (currentPage) {
      case 'home':     if (window.GC_HOME)     GC_HOME.render(el);     break;
      case 'live':     if (window.GC_LIVE)     GC_LIVE.render(el);     break;
      case 'schedule': if (window.GC_SCHEDULE) GC_SCHEDULE.render(el); break;
      case 'groups':   if (window.GC_GROUPS)   GC_GROUPS.render(el);   break;
      case 'myteams':  if (window.GC_MYTEAMS)  GC_MYTEAMS.render(el);  break;
      default: el.innerHTML = '<p style="padding:20px">Page not found.</p>';
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

  return {
    go: go, draw: draw,
    getType: function() { return currentType; },
    init: function() {
      initNav(); initCanvas();
      setInterval(function() { if(currentPage==='live') draw(); }, 60000);
      go('home');
    }
  };
})();

document.addEventListener('DOMContentLoaded', function() { GC.init(); });
