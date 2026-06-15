/* ============================================================
   GOALCURRENT.LIVE — gc-shared.js
   Universal navigation, sidebar, header, footer
   Hamburger ☰ always visible on ALL screen sizes
   Standings added to WC26 navigation
   ============================================================ */

(function(){

/* ── DETECT ACTIVE PAGE ── */
var path = window.location.pathname.toLowerCase();
function isActive(href){ return path.indexOf(href.toLowerCase()) !== -1; }

/* ── DETECT ACTIVE SECTION ── */
var isPL = path.indexOf('/premier-league/') !== -1;
var isUCL = path.indexOf('/ucl/') !== -1;

/* ── INJECT GLOBAL CSS ── */
var style = document.createElement('style');
style.textContent = `
/* ── RESET & BASE ── */
:root{
  --sb-w:240px;--sb-bg:#07111f;--sb-hover:#10213a;
  --sb-border:rgba(255,255,255,.08);--sb-text:#b8c4d9;
}
.sb-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:400}
.sb-overlay.show{display:block}

/* ── SIDEBAR ── */
.gc-sidebar{
  width:var(--sb-w);
  background:linear-gradient(180deg,#07111f,#0b1628);
  min-height:100vh;position:relative;
  display:flex;flex-direction:column;z-index:500;
  overflow-y:auto;scrollbar-width:none;
  transition:transform .3s ease;
}
.gc-sidebar::-webkit-scrollbar{display:none}
.sb-logo{padding:18px 16px;border-bottom:1px solid var(--sb-border);flex-shrink:0}
.sb-logo a{font-size:17px;font-weight:800;color:white;text-decoration:none}
.sb-logo span{color:#3b82f6}
.sb-section{padding:14px 16px 4px;font-size:10px;font-weight:800;color:rgba(184,196,217,.48);text-transform:uppercase;letter-spacing:1.5px;}
.sb-link{display:flex;align-items:center;gap:10px;padding:10px 16px;color:var(--sb-text);text-decoration:none;font-size:13px;font-weight:600;}
.sb-link:hover,.sb-link.active{background:var(--sb-hover);color:white}
.sb-comp{border-top:1px solid var(--sb-border)}
.sb-comp-btn{display:flex;align-items:center;justify-content:space-between;width:100%;padding:11px 16px;background:none;border:none;color:var(--sb-text);font-size:13px;font-weight:700;cursor:pointer;text-align:left;font-family:Verdana,Geneva,Tahoma,sans-serif;}
.sb-comp-btn:hover{background:var(--sb-hover);color:white}
.sb-badge{font-size:10px;background:rgba(59,130,246,.25);color:#60a5fa;padding:2px 7px;border-radius:5px;font-weight:800;}
.sb-badge-gold{background:rgba(251,191,36,.25);color:#fbbf24}
.sb-badge-ucl{background:rgba(255,215,0,.2);color:#ffd700}
.sb-badge-pl{background:rgba(56,0,60,.5);color:#e9b4ff}
.sb-sub{display:none}.sb-sub.open{display:block}
.sb-sub-link{display:block;padding:8px 16px 8px 38px;color:rgba(184,196,217,.78);text-decoration:none;font-size:12px;}
.sb-sub-link:hover{background:var(--sb-hover);color:white}
.sb-sub-link.active{background:linear-gradient(135deg,#003fb8,#0057e7);color:white;font-weight:800;}
.sb-foot{margin-top:auto;padding:14px 16px;border-top:1px solid var(--sb-border);font-size:11px;color:rgba(184,196,217,.52);line-height:1.7;flex-shrink:0;}
.sb-foot a{color:rgba(184,196,217,.65);text-decoration:none}
.sb-social{display:flex;gap:8px;margin-bottom:10px}
.sb-social a{display:flex;align-items:center;justify-content:center;width:28px;height:28px;background:var(--sb-hover);border-radius:7px;font-size:13px;color:var(--sb-text);text-decoration:none;}

/* ── MAIN LAYOUT ── */
.gc-main-wrapper{margin-left:var(--sb-w);min-height:100vh;display:flex;flex-direction:column;transition:margin-left .3s ease;}
.gc-main-content{flex:1;padding:16px}

/* ── HEADER ── */
.gc-header{
  position:sticky;top:0;z-index:300;
  background:linear-gradient(135deg,#001a4d 0%,#002b80 50%,#003fb8 100%);
  border-bottom:2px solid rgba(245,158,11,.4);
  box-shadow:0 4px 24px rgba(0,27,80,.45);
  padding:0 16px;
}
.gc-hdr-top{display:flex;align-items:center;justify-content:space-between;padding:10px 0 8px;gap:10px;}
.gc-hdr-left{display:flex;align-items:center;gap:10px;min-width:0}

/* ── HAMBURGER — ALWAYS VISIBLE ── */
.gc-hamburger{
  display:flex!important;
  align-items:center;justify-content:center;
  background:rgba(255,255,255,.12);
  border:1px solid rgba(255,255,255,.2);
  border-radius:8px;
  font-size:18px;
  cursor:pointer;
  color:white;
  padding:6px 8px;
  flex-shrink:0;
  line-height:1;
  transition:background .2s;
  font-family:Verdana,sans-serif;
}
.gc-hamburger:hover{background:rgba(255,255,255,.22)}

.gc-hdr-logo{font-size:16px;font-weight:900;color:white;line-height:1.15;white-space:nowrap;}
.gc-hdr-logo span{color:#f59e0b}
.gc-hdr-sub{font-size:10px;color:rgba(255,255,255,.55);font-weight:700;letter-spacing:.3px;margin-top:1px;}
.gc-hdr-right{display:flex;align-items:center;gap:7px;flex-shrink:0}
.gc-phase-pill{font-size:10px;font-weight:900;color:#f59e0b;background:rgba(245,158,11,.15);border:1px solid rgba(245,158,11,.35);border-radius:20px;padding:4px 10px;white-space:nowrap;text-transform:uppercase;letter-spacing:.5px;}
.gc-tz-pill{font-size:10px;font-weight:900;color:white;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);border-radius:20px;padding:4px 10px;white-space:nowrap;}
.gc-hdr-nav{display:flex;gap:4px;padding-bottom:9px;overflow-x:auto;scrollbar-width:none;}
.gc-hdr-nav::-webkit-scrollbar{display:none}
.gc-hdr-navlink{font-size:10px;font-weight:800;color:rgba(255,255,255,.6);background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:4px 10px;text-decoration:none;white-space:nowrap;transition:.15s;flex-shrink:0;}
.gc-hdr-navlink:hover{background:rgba(255,255,255,.16);color:white}
.gc-hdr-navlink.active{background:#f59e0b;border-color:#f59e0b;color:#0f172a}

/* ── TICKER ── */
.gc-ticker{background:rgba(255,255,255,.66);backdrop-filter:blur(22px);border-bottom:1px solid rgba(255,255,255,.88);padding:7px 0;overflow:hidden;}
.gc-ticker-track{display:flex;gap:48px;animation:gc-ticker 30s linear infinite;white-space:nowrap}
.gc-ticker-item{font-size:12px;font-weight:800;color:#003fb8;white-space:nowrap;flex-shrink:0}
@keyframes gc-ticker{from{transform:translateX(100vw)}to{transform:translateX(-100%)}}

/* ── AD BAR ── */
.gc-nord-bar{background:rgba(255,255,255,.92);backdrop-filter:blur(20px);border-top:1px solid rgba(0,0,0,.08);padding:8px 16px;font-size:12px;text-align:center;color:#334155;}

/* ── FOOTER ── */
.gc-footer{background:rgba(255,255,255,.72);backdrop-filter:blur(20px);border-top:1px solid rgba(255,255,255,.9);color:#64748b;padding:20px 16px;font-size:11px;line-height:1.7}
.gc-footer-links{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:10px}
.gc-footer-links a{color:#2563eb;text-decoration:none}
.gc-footer-social{display:flex;gap:8px;margin-bottom:12px}
.gc-footer-social a{display:flex;align-items:center;justify-content:center;width:30px;height:30px;background:rgba(37,99,235,.08);border-radius:7px;font-size:14px;text-decoration:none;color:#2563eb}
.gc-footer-copy{color:#94a3b8;font-size:10px;line-height:1.8}

/* ── COOKIE BANNER ── */
.gc-cookie-banner{display:none;position:fixed;bottom:0;left:0;right:0;background:rgba(255,255,255,.97);backdrop-filter:blur(20px);border-top:2px solid #2563eb;padding:14px 20px;z-index:9999;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;font-family:Verdana,sans-serif}

/* ── RESPONSIVE ── */
@media(min-width:769px){
  .sb-overlay{display:none!important}
  .gc-sidebar{transform:translateX(0)!important}
  .gc-main-wrapper{margin-left:var(--sb-w)!important}
  /* Sidebar can still be toggled on desktop for more content space */
  .gc-sidebar.hidden-desktop{transform:translateX(-100%)!important}
  .gc-main-wrapper.expanded{margin-left:0!important}
}
@media(max-width:768px){
  .gc-main-wrapper{margin-left:0!important}
  .gc-sidebar{transform:translateX(-100%)!important;box-shadow:4px 0 24px rgba(0,0,0,.3)!important}
  .gc-sidebar.open{transform:translateX(0)!important}
  .gc-main-content{padding:10px!important}
  .gc-hdr-logo{font-size:14px!important}
  .gc-phase-pill{display:none!important}
}
`;
document.head.appendChild(style);

/* ── BUILD SIDEBAR HTML ── */
function makeSidebar(activePage){
  var wc26Open = isWC ? ' open' : '';
  var plOpen   = isPL  ? ' open' : '';
  var uclOpen  = isUCL ? ' open' : '';

  var wc26Links = [
    {href:'/worldcup2026/index.html',        icon:'🏠', label:'Overview'},
    {href:'/worldcup2026/groups/index.html', icon:'🔢', label:'Groups'},
    {href:'/worldcup2026/fixtures/index.html',icon:'📅', label:'Fixtures'},
    {href:'/worldcup2026/standings/index.html',icon:'📊', label:'Standings'},
    {href:'/worldcup2026/bracket/index.html', icon:'🏅', label:'Bracket'},
    {href:'/worldcup2026/venues/index.html',  icon:'🏟️', label:'Venues'},
    {href:'/worldcup2026/teams/index.html',   icon:'👕', label:'Teams'},
    {href:'/worldcup2026/news/index.html',    icon:'📰', label:'News'},
    {href:'/worldcup2026/favourites/index.html',icon:'⭐', label:'Favourites'},
  ];
  var plLinks = [
    {href:'/premier-league/index.html',           icon:'🏠', label:'Overview'},
    {href:'/premier-league/table/index.html',     icon:'📊', label:'Table'},
    {href:'/premier-league/fixtures/index.html',  icon:'📅', label:'Fixtures'},
    {href:'/premier-league/results/index.html',   icon:'✅', label:'Results'},
    {href:'/premier-league/teams/index.html',     icon:'👕', label:'Teams'},
    {href:'/premier-league/news/index.html',      icon:'📰', label:'News'},
  ];
  var uclLinks = [
    {href:'/ucl/index.html',           icon:'🏠', label:'Overview'},
    {href:'/ucl/fixtures/index.html',  icon:'📅', label:'Fixtures'},
    {href:'/ucl/results/index.html',   icon:'✅', label:'Results'},
    {href:'/ucl/teams/index.html',     icon:'👕', label:'Teams'},
    {href:'/ucl/news/index.html',      icon:'📰', label:'News'},
  ];

  function subLinks(links){
    return links.map(function(l){
      var active = isActive(l.href) ? ' active' : '';
      return '<a href="'+l.href+'" class="sb-sub-link'+active+'">'+l.icon+' '+l.label+'</a>';
    }).join('');
  }

  return '<nav class="gc-sidebar" id="gcSidebar">'+
    '<div class="sb-logo"><a href="/">⚽ Goal<span>Current</span>.live</a></div>'+
    '<div class="sb-section">Main Menu</div>'+
    '<a href="/" class="sb-link">🏠 Home</a>'+
    '<a href="/premier-league/index.html" class="sb-link">🔴 Live Scores</a>'+
    '<a href="/premier-league/fixtures/index.html" class="sb-link">📋 Fixtures</a>'+
    '<a href="/premier-league/table/index.html" class="sb-link">🏅 Standings</a>'+
    '<a href="/worldcup2026/news/index.html" class="sb-link">📰 Latest News</a>'+
    '<div class="sb-section">Competitions</div>'+
    '<div class="sb-comp">'+
      '<button class="sb-comp-btn" onclick="gcToggleSub(\'pl-sub\')">'+
        '<span>🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League</span><span class="sb-badge sb-badge-pl">PL</span>'+
      '</button>'+
      '<div class="sb-sub'+plOpen+'" id="pl-sub">'+subLinks(plLinks)+'</div>'+
    '</div>'+
    '<div class="sb-comp">'+
      '<button class="sb-comp-btn" onclick="gcToggleSub(\'wc-sub\')" style="color:white">'+
        '<span>🏆 World Cup 2026</span><span class="sb-badge sb-badge-gold">WC26</span>'+
      '</button>'+
      '<div class="sb-sub'+wc26Open+'" id="wc-sub">'+subLinks(wc26Links)+'</div>'+
    '</div>'+
    '<div class="sb-comp">'+
      '<button class="sb-comp-btn" onclick="gcToggleSub(\'ucl-sub\')">'+
        '<span>⭐ Champions League</span><span class="sb-badge sb-badge-ucl">UCL</span>'+
      '</button>'+
      '<div class="sb-sub'+uclOpen+'" id="ucl-sub">'+subLinks(uclLinks)+'</div>'+
    '</div>'+
    '<div class="sb-foot">'+
      '<div class="sb-social">'+
        '<a href="https://twitter.com/GoalCurrentlive" target="_blank" rel="noopener">𝕏</a>'+
        '<a href="https://tiktok.com/@goalcurrentlive" target="_blank" rel="noopener">🎵</a>'+
        '<a href="https://instagram.com/goalcurrentlive" target="_blank" rel="noopener">📸</a>'+
      '</div>'+
      '© 2026 <strong style="color:#a8b2c8">Ashna4All</strong><br>Ahmad Zafarani<br>'+
      '<a href="/about.html">About</a> · <a href="/privacy.html">Privacy</a> · '+
      '<a href="/terms.html">Terms</a> · <a href="/disclaimer.html">Disclaimer</a> · '+
      '<a href="/cookies.html">Cookies</a> · <a href="/contact.html">Contact</a>'+
    '</div>'+
  '</nav>';
}

/* ── BUILD HEADER HTML ── */
function makeHeader(opts){
  opts = opts || {};
  var title    = opts.title    || '⚽ GoalCurrent<span style="color:#f59e0b">.live</span>';
  var subtitle = opts.subtitle || 'World Cup 2026 · Premier League · UCL';
  var phase    = opts.phase    || '';

  /* Detect which section's tabs to show */
  var wc26Tabs = [
    {href:'/worldcup2026/index.html',            icon:'🏠', label:'Overview'},
    {href:'/worldcup2026/groups/index.html',     icon:'🔢', label:'Groups'},
    {href:'/worldcup2026/fixtures/index.html',   icon:'📅', label:'Fixtures'},
    {href:'/worldcup2026/standings/index.html',  icon:'📊', label:'Standings'},
    {href:'/worldcup2026/bracket/index.html',    icon:'🏅', label:'Bracket'},
    {href:'/worldcup2026/venues/index.html',     icon:'🏟️', label:'Venues'},
    {href:'/worldcup2026/teams/index.html',      icon:'👕', label:'Teams'},
    {href:'/worldcup2026/news/index.html',       icon:'📰', label:'News'},
    {href:'/worldcup2026/favourites/index.html', icon:'⭐', label:'Favourites'},
    {href:'/premier-league/index.html',          icon:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', label:'Premier League'},
  ];
  var plTabs = [
    {href:'/premier-league/index.html',          icon:'🏠', label:'Overview'},
    {href:'/premier-league/table/index.html',    icon:'📊', label:'Table'},
    {href:'/premier-league/fixtures/index.html', icon:'📅', label:'Fixtures'},
    {href:'/premier-league/results/index.html',  icon:'✅', label:'Results'},
    {href:'/premier-league/teams/index.html',    icon:'👕', label:'Teams'},
    {href:'/premier-league/news/index.html',     icon:'📰', label:'News'},
    {href:'/worldcup2026/index.html',            icon:'🏆', label:'World Cup 2026'},
  ];
  var uclTabs = [
    {href:'/ucl/index.html',          icon:'🏠', label:'Overview'},
    {href:'/ucl/fixtures/index.html', icon:'📅', label:'Fixtures'},
    {href:'/ucl/results/index.html',  icon:'✅', label:'Results'},
    {href:'/ucl/teams/index.html',    icon:'👕', label:'Teams'},
    {href:'/ucl/news/index.html',     icon:'📰', label:'News'},
    {href:'/worldcup2026/index.html', icon:'🏆', label:'World Cup 2026'},
  ];

  var tabs = isWC ? wc26Tabs : isPL ? plTabs : isUCL ? uclTabs : wc26Tabs;

  var navLinks = tabs.map(function(t){
    var active = isActive(t.href) ? ' active' : '';
    return '<a href="'+t.href+'" class="gc-hdr-navlink'+active+'">'+t.icon+' '+t.label+'</a>';
  }).join('');

  var tzLabel = '';
  try{ tzLabel = new Date().toLocaleTimeString('en-GB',{timeZoneName:'short'}).split(' ').pop()||'BST'; }catch(e){ tzLabel='BST'; }

  return '<header class="gc-header">'+
    '<div class="gc-hdr-top">'+
      '<div class="gc-hdr-left">'+
        '<button class="gc-hamburger" onclick="gcToggleSidebar()" aria-label="Toggle menu">☰</button>'+
        '<div>'+
          '<div class="gc-hdr-logo">'+title+'</div>'+
          '<div class="gc-hdr-sub">'+subtitle+'</div>'+
        '</div>'+
      '</div>'+
      '<div class="gc-hdr-right">'+
        (phase?'<span class="gc-phase-pill">'+phase+'</span>':'')+
        '<span class="gc-tz-pill">🕐 '+tzLabel+'</span>'+
      '</div>'+
    '</div>'+
    '<nav class="gc-hdr-nav">'+navLinks+'</nav>'+
  '</header>';
}

/* ── BUILD TICKER ── */
function makeTicker(){
  return '<div class="gc-ticker"><div class="gc-ticker-track">'+
    '<span class="gc-ticker-item">🏆 World Cup 2026 — 48 Teams · 16 Venues · 3 Host Nations · Starts 11 June</span>'+
    '<span class="gc-ticker-item">📅 England vs Croatia · 17 Jun · Dallas · 21:00 BST</span>'+
    '<span class="gc-ticker-item">⭐ Star ⭐ your favourite matches for alerts and tracking</span>'+
    '<span class="gc-ticker-item">📺 All matches FREE on BBC and ITV in the UK</span>'+
    '<span class="gc-ticker-item">🏆 Final: 19 July 2026 · MetLife Stadium, New Jersey</span>'+
  '</div></div>';
}

/* ── BUILD NORD BAR ── */
function makeNordBar(){
  return '<div class="gc-nord-bar">'+
    '🔒 <strong>NordVPN</strong> — 75% off + 3 months FREE '+
    '<a href="https://go.nordvpn.net/aff_c?offer_id=15&aff_id=148347&url_id=902" target="_blank" rel="noopener sponsored" style="background:#2563eb;color:white;padding:3px 10px;border-radius:20px;font-weight:800;text-decoration:none;margin:0 6px">Get Deal →</a>'+
    '<a href="https://go.nordpass.io/aff_c?offer_id=488&aff_id=148347&url_id=9356" target="_blank" rel="noopener sponsored" style="color:#2563eb;font-weight:800;text-decoration:none">NordPass</a>'+
    ' <span style="color:#94a3b8;font-size:10px">#AD · <a href="/disclaimer.html" style="color:#94a3b8">Affiliate link</a></span>'+
  '</div>';
}

/* ── BUILD FOOTER ── */
function makeFooter(){
  return '<footer class="gc-footer">'+
    '<div class="gc-footer-links">'+
      '<a href="/about.html">About</a><a href="/contact.html">Contact</a>'+
      '<a href="/privacy.html">Privacy Policy</a><a href="/terms.html">Terms</a>'+
      '<a href="/disclaimer.html">Disclaimer</a><a href="/cookies.html">Cookies</a>'+
    '</div>'+
    '<div class="gc-footer-social">'+
      '<a href="https://twitter.com/GoalCurrentlive" target="_blank" rel="noopener">𝕏</a>'+
      '<a href="https://tiktok.com/@goalcurrentlive" target="_blank" rel="noopener">🎵</a>'+
      '<a href="https://instagram.com/goalcurrentlive" target="_blank" rel="noopener">📸</a>'+
    '</div>'+
    '<div class="gc-footer-copy">'+
      '© 2026 <strong style="color:#64748b">Ashna4All</strong> · Ahmad Zafarani · GoalCurrent.live<br>'+
      'Independent fan site · Not affiliated with FIFA, UEFA or the Premier League<br>'+
      'Schedule source: FIFA.com · Data: <a href="https://football-data.org" style="color:#94a3b8">football-data.org</a>'+
    '</div>'+
  '</footer>';
}

/* ── BUILD COOKIE BANNER ── */
function makeCookieBanner(){
  return '<div class="gc-cookie-banner" id="gcCookieBanner">'+
    '<div style="font-size:11px;color:#334155;line-height:1.6;max-width:600px">'+
      '🍪 We use cookies to personalise content and analyse traffic. '+
      '<a href="/cookies.html" style="color:#2563eb;text-decoration:none">Cookie Policy</a>'+
    '</div>'+
    '<div style="display:flex;gap:8px">'+
      '<button onclick="gcAcceptCookies()" style="background:#2563eb;color:#fff;border:none;padding:8px 18px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;font-family:Verdana,sans-serif">Accept ✓</button>'+
      '<button onclick="gcDeclineCookies()" style="background:transparent;color:#64748b;border:1px solid #cbd5e1;padding:8px 18px;border-radius:8px;font-size:11px;cursor:pointer;font-family:Verdana,sans-serif">Decline</button>'+
    '</div>'+
  '</div>';
}

/* ── INJECT EVERYTHING ── */
function gcInit(opts){
  opts = opts || {};

  /* Sidebar overlay */
  var overlay = document.createElement('div');
  overlay.className = 'sb-overlay';
  overlay.id = 'gcSbOverlay';
  overlay.onclick = gcCloseSidebar;
  document.body.insertBefore(overlay, document.body.firstChild);

  /* Sidebar */
  var sidebarDiv = document.createElement('div');
  sidebarDiv.innerHTML = makeSidebar(opts.activePage);
  document.body.insertBefore(sidebarDiv.firstChild, overlay.nextSibling);

  /* Find or create main wrapper */
  var mainRoot = document.getElementById('gc-sidebar-root') ||
                 document.getElementById('wc-nav') ||
                 document.querySelector('.gc-main') ||
                 document.querySelector('.gc-main-wrapper');

  if(!mainRoot){
    /* Wrap all remaining body content */
    var wrapper = document.createElement('div');
    wrapper.className = 'gc-main-wrapper';
    while(document.body.children.length > 2){ /* sidebar + overlay already inserted */
      var child = document.body.children[2];
      if(child) wrapper.appendChild(child);
    }
    document.body.appendChild(wrapper);
    mainRoot = wrapper;
  } else {
    mainRoot.className = 'gc-main-wrapper';
  }

  /* Inject header at top of main wrapper */
  var hdrDiv = document.createElement('div');
  hdrDiv.innerHTML = makeHeader(opts);
  mainRoot.insertBefore(hdrDiv.firstChild, mainRoot.firstChild);

  /* Inject ticker after header */
  var tickerDiv = document.createElement('div');
  tickerDiv.innerHTML = makeTicker();
  var hdrEl = mainRoot.querySelector('.gc-header');
  if(hdrEl && hdrEl.nextSibling){
    mainRoot.insertBefore(tickerDiv.firstChild, hdrEl.nextSibling);
  }

  /* Inject nord bar before end */
  var nordDiv = document.createElement('div');
  nordDiv.innerHTML = makeNordBar();
  mainRoot.appendChild(nordDiv.firstChild);

  /* Inject footer */
  var footerDiv = document.createElement('div');
  footerDiv.innerHTML = makeFooter();
  mainRoot.appendChild(footerDiv.firstChild);

  /* Inject cookie banner */
  var cookieDiv = document.createElement('div');
  cookieDiv.innerHTML = makeCookieBanner();
  document.body.appendChild(cookieDiv.firstChild);

  /* Show cookie banner if not yet decided */
  if(!localStorage.getItem('gc_cookies')){
    setTimeout(function(){
      var b = document.getElementById('gcCookieBanner');
      if(b) b.style.display = 'flex';
    }, 1500);
  }
}

/* ── SIDEBAR CONTROLS ── */
window.gcToggleSidebar = function(){
  var sb = document.getElementById('gcSidebar');
  var ov = document.getElementById('gcSbOverlay');
  if(!sb) return;
  var isOpen = sb.classList.toggle('open');
  if(ov) ov.classList.toggle('show', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
};
window.gcCloseSidebar = function(){
  var sb = document.getElementById('gcSidebar');
  var ov = document.getElementById('gcSbOverlay');
  if(sb) sb.classList.remove('open');
  if(ov) ov.classList.remove('show');
  document.body.style.overflow = '';
};
window.gcToggleSub = function(id){
  var el = document.getElementById(id);
  if(el) el.classList.toggle('open');
};
window.gcAcceptCookies = function(){
  localStorage.setItem('gc_cookies','yes');
  var b = document.getElementById('gcCookieBanner');
  if(b) b.style.display = 'none';
};
window.gcDeclineCookies = function(){
  localStorage.setItem('gc_cookies','no');
  var b = document.getElementById('gcCookieBanner');
  if(b) b.style.display = 'none';
};

/* ── PUBLIC API ── */
window.initWC26Page = function(activePage, opts){
  gcInit(Object.assign({activePage: activePage}, opts||{}));
};

})();
