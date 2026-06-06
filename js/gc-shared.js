/* ============================================================
   GOALCURRENT.LIVE — Universal Site Navigation
   Works on ALL pages: WC2026, Premier League, UCL, Home
   Self-contained: injects its own CSS automatically
   Author: Ahmad Zafarani (Ashna4All)
   ============================================================ */

(function injectCSS(){
  if(document.getElementById('gc-nav-styles')) return;
  var s=document.createElement('style');
  s.id='gc-nav-styles';
  s.textContent=`
/* ── SIDEBAR OVERLAY ── */
.gc-sb-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:400}
.gc-sb-overlay.show{display:block}

/* ── SIDEBAR ── */
.gc-sidebar{
  width:240px;background:linear-gradient(180deg,#07111f,#0b1628);
  height:100vh;position:fixed;top:0;left:0;
  display:flex;flex-direction:column;z-index:500;
  overflow-y:auto;scrollbar-width:none;
  transform:translateX(-100%);transition:transform .3s ease;
  box-shadow:4px 0 24px rgba(0,0,0,.3);font-family:Verdana,sans-serif;
}
.gc-sidebar::-webkit-scrollbar{display:none}
.gc-sidebar.open{transform:translateX(0)}

.gc-sb-logo{padding:16px 18px;border-bottom:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.gc-sb-logo a{font-size:16px;font-weight:800;color:white;text-decoration:none;font-family:Verdana,sans-serif}
.gc-sb-logo span{color:#3b82f6}
.gc-sb-close{background:none;border:none;color:rgba(255,255,255,.4);font-size:18px;cursor:pointer;padding:2px 6px;line-height:1}
.gc-sb-close:hover{color:white}

.gc-sb-section{padding:14px 16px 4px;font-size:10px;font-weight:800;color:rgba(184,196,217,.45);text-transform:uppercase;letter-spacing:1.5px;font-family:Verdana,sans-serif}

.gc-sb-link{display:flex;align-items:center;gap:10px;padding:10px 16px;color:#b8c4d9;text-decoration:none;font-size:13px;font-weight:600;font-family:Verdana,sans-serif;transition:background .2s}
.gc-sb-link:hover,.gc-sb-link.gc-sb-active{background:#10213a;color:white}
.gc-sb-link.gc-sb-active{border-left:3px solid #2563eb}

.gc-sb-comp{border-top:1px solid rgba(255,255,255,.08)}
.gc-sb-comp-btn{display:flex;align-items:center;justify-content:space-between;width:100%;padding:11px 16px;background:none;border:none;color:#b8c4d9;font-size:13px;font-weight:700;cursor:pointer;text-align:left;font-family:Verdana,sans-serif;transition:background .2s}
.gc-sb-comp-btn:hover{background:#10213a;color:white}

.gc-sb-badge{font-size:10px;background:rgba(59,130,246,.25);color:#60a5fa;padding:2px 7px;border-radius:5px;font-weight:800}
.gc-sb-badge-gold{background:rgba(251,191,36,.25);color:#fbbf24}
.gc-sb-badge-pl{background:rgba(56,0,60,.5);color:#e9b4ff}
.gc-sb-badge-ucl{background:rgba(255,215,0,.2);color:#ffd700}

.gc-sb-sub{display:none}
.gc-sb-sub.open{display:block}
.gc-sb-sub-link{display:block;padding:8px 16px 8px 38px;color:rgba(184,196,217,.78);text-decoration:none;font-size:12px;font-family:Verdana,sans-serif;transition:background .2s}
.gc-sb-sub-link:hover,.gc-sb-sub-link.gc-sb-sub-active{background:#10213a;color:white}
.gc-sb-sub-link.gc-sb-sub-active{background:linear-gradient(135deg,#003fb8,#0057e7);font-weight:700}

.gc-sb-foot{margin-top:auto;padding:14px 16px;border-top:1px solid rgba(255,255,255,.08);font-size:11px;color:rgba(184,196,217,.5);line-height:1.7;flex-shrink:0;font-family:Verdana,sans-serif}
.gc-sb-foot a{color:rgba(184,196,217,.65);text-decoration:none}
.gc-sb-foot a:hover{color:white}
.gc-sb-social{display:flex;gap:8px;margin-bottom:10px}
.gc-sb-social a{display:flex;align-items:center;justify-content:center;width:28px;height:28px;background:#10213a;border-radius:7px;font-size:13px;color:#b8c4d9;text-decoration:none}

/* ── HEADER ── */
.gc-hdr{position:sticky;top:0;z-index:300;background:linear-gradient(135deg,#001a4d,#002b80,#003fb8);border-bottom:2px solid rgba(245,158,11,.4);box-shadow:0 4px 24px rgba(0,27,80,.4);font-family:Verdana,sans-serif}
.gc-hdr-inner{display:flex;align-items:center;justify-content:space-between;padding:10px 16px 8px;gap:10px}
.gc-hdr-left{display:flex;align-items:center;gap:10px}
.gc-hamburger{background:none;border:none;font-size:22px;cursor:pointer;color:white;padding:4px 6px;flex-shrink:0;line-height:1}
.gc-hdr-logo{font-size:16px;font-weight:900;color:white;text-decoration:none;font-family:Verdana,sans-serif;line-height:1.2}
.gc-hdr-logo span{color:#f59e0b}
.gc-hdr-sub{font-size:10px;color:rgba(255,255,255,.55);font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

/* ── TAB BAR ── */
.gc-tabbar{display:flex;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;border-top:1px solid rgba(255,255,255,.08)}
.gc-tabbar::-webkit-scrollbar{display:none}
.gc-tab{display:inline-flex;flex-direction:column;align-items:center;gap:2px;padding:8px 14px;color:rgba(255,255,255,.55);text-decoration:none;font-family:Verdana,sans-serif;font-size:10px;font-weight:600;white-space:nowrap;flex-shrink:0;border-bottom:3px solid transparent;transition:color .2s,border-color .2s}
.gc-tab:hover{color:rgba(255,255,255,.9)}
.gc-tab.gc-tab-active{color:#f59e0b;border-bottom-color:#f59e0b}
.gc-tab-icon{font-size:16px;line-height:1}
.gc-tab-label{font-size:9px;letter-spacing:.04em}

/* ── LAYOUT ── */
.gc-main-wrapper{display:flex;flex-direction:column;min-height:100vh}
.gc-main-content{flex:1;padding:16px 14px 120px}

/* ── NORDVPN BAR ── */
.gc-nord-bar{background:rgba(255,255,255,.92);backdrop-filter:blur(20px);border-top:1px solid rgba(0,0,0,.08);padding:8px 16px;display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;font-size:12px;color:#334155;font-family:Verdana,sans-serif}
.gc-nord-btn{background:#2563eb;color:#fff;padding:5px 13px;border-radius:7px;font-size:12px;font-weight:700;text-decoration:none}
.gc-nord-pass{color:#2563eb;font-size:12px;font-weight:700;text-decoration:none}

/* ── COOKIE BANNER ── */
.gc-cookie-banner{position:fixed;bottom:0;left:0;right:0;background:rgba(255,255,255,.97);backdrop-filter:blur(20px);border-top:2px solid #2563eb;padding:14px 20px;z-index:9999;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;font-family:Verdana,sans-serif;box-shadow:0 -4px 20px rgba(0,0,0,.08)}
.gc-cookie-text{font-size:12px;color:#334155;line-height:1.6;max-width:600px}
.gc-cookie-text a{color:#2563eb;text-decoration:none}
.gc-cookie-btns{display:flex;gap:8px}
.gc-cookie-accept{background:#2563eb;color:#fff;border:none;padding:8px 18px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;font-family:Verdana,sans-serif}
.gc-cookie-decline{background:transparent;color:#64748b;border:1px solid #cbd5e1;padding:8px 18px;border-radius:8px;font-size:12px;cursor:pointer;font-family:Verdana,sans-serif}

/* ── FOOTER ── */
.gc-footer{background:rgba(255,255,255,.72);backdrop-filter:blur(20px);border-top:1px solid rgba(255,255,255,.9);padding:20px 16px;font-family:Verdana,sans-serif;font-size:11px;color:#64748b;text-align:center;line-height:1.8}
.gc-footer-links{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-bottom:10px}
.gc-footer-links a{color:#2563eb;text-decoration:none}
.gc-footer-copy{font-size:10px;color:#94a3b8}

/* ── DESKTOP ── */
@media(min-width:769px){
  .gc-sidebar{transform:translateX(0)!important}
  .gc-sb-overlay{display:none!important}
  .gc-sb-close{display:none}
  .gc-hamburger{display:none!important}
  .gc-main-wrapper{margin-left:240px}
  .gc-main-content{padding:20px 24px 100px}
  /* Ensure header is never hidden behind sidebar on desktop */
  body>.gc-hdr{margin-left:240px}
}

/* ── MOBILE ── */
@media(max-width:768px){
  .gc-hdr-sub{display:none}
  .gc-tab-label{font-size:8px}
  .gc-tab{padding:7px 10px}
  .gc-main-content{padding:12px 12px 120px}
}
  `;
  document.head.appendChild(s);
})();

/* ── SIDEBAR ── */
function gcRenderSidebar(activePage){
  var wc26 =['home','fixtures','groups','teams','bracket','venues','news','countdown','favourites'];
  var pl   =['pl-home','pl-table','pl-fixtures','pl-results','pl-teams','pl-news'];
  var ucl  =['ucl-home','ucl-fixtures','ucl-results','ucl-teams','ucl-news'];

  function a(k){return activePage===k;}
  function lnk(href,icon,label,key){
    return '<a href="'+href+'" class="gc-sb-link'+(a(key)?' gc-sb-active':'')+'">'+icon+' '+label+'</a>';
  }
  function sub(href,icon,label,key){
    return '<a href="'+href+'" class="gc-sb-sub-link'+(a(key)?' gc-sb-sub-active':'')+'">'+icon+' '+label+'</a>';
  }

  return (
    '<div class="gc-sb-overlay" id="gcSbOverlay" onclick="gcCloseSidebar()"></div>'+
    '<nav class="gc-sidebar" id="gcSidebar">'+
      '<div class="gc-sb-logo">'+
        '<a href="/">⚽ Goal<span>Current</span>.live</a>'+
        '<button class="gc-sb-close" onclick="gcCloseSidebar()">✕</button>'+
      '</div>'+

      '<div class="gc-sb-section">Main Menu</div>'+
      lnk('/','🏠','Home','main-home')+
      lnk('/premier-league/index.html','🔴','Live Scores','live')+
      lnk('/premier-league/fixtures/index.html','📅','Fixtures','fixtures-main')+
      lnk('/premier-league/table/index.html','🏅','Standings','standings')+
      lnk('/worldcup2026/news/index.html','📰','Latest News','news-main')+

      '<div class="gc-sb-section">Competitions</div>'+

      /* PREMIER LEAGUE */
      '<div class="gc-sb-comp">'+
        '<button class="gc-sb-comp-btn" onclick="gcToggleSub(\'gc-pl-sub\')">'+
          '<span>🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League</span>'+
          '<span class="gc-sb-badge gc-sb-badge-pl">PL</span>'+
        '</button>'+
        '<div class="gc-sb-sub'+(pl.includes(activePage)?' open':'')+'" id="gc-pl-sub">'+
          sub('/premier-league/index.html','🏠','Overview','pl-home')+
          sub('/premier-league/table/index.html','📊','Table','pl-table')+
          sub('/premier-league/fixtures/index.html','📅','Fixtures','pl-fixtures')+
          sub('/premier-league/results/index.html','✅','Results','pl-results')+
          sub('/premier-league/teams/index.html','👕','Teams','pl-teams')+
          sub('/premier-league/news/index.html','📰','News','pl-news')+
        '</div>'+
      '</div>'+

      /* WORLD CUP 2026 */
      '<div class="gc-sb-comp">'+
        '<button class="gc-sb-comp-btn" onclick="gcToggleSub(\'gc-wc-sub\')" style="color:white">'+
          '<span>🏆 World Cup 2026</span>'+
          '<span class="gc-sb-badge gc-sb-badge-gold">WC26</span>'+
        '</button>'+
        '<div class="gc-sb-sub'+(wc26.includes(activePage)?' open':'')+'" id="gc-wc-sub">'+
          sub('/worldcup2026/index.html','🏠','Overview','home')+
          sub('/worldcup2026/groups/index.html','🔢','Groups','groups')+
          sub('/worldcup2026/fixtures/index.html','📅','Fixtures','fixtures')+
          sub('/worldcup2026/bracket/index.html','🏅','Bracket','bracket')+
          sub('/worldcup2026/venues/index.html','🏟️','Venues','venues')+
          sub('/worldcup2026/teams/index.html','👕','Teams','teams')+
          sub('/worldcup2026/news/index.html','📰','News','news')+
          sub('/countdown.html','⏱','Countdown','countdown')+
          sub('/worldcup2026/favourites/index.html','⭐','Favourites','favourites')+
        '</div>'+
      '</div>'+

      /* CHAMPIONS LEAGUE */
      '<div class="gc-sb-comp">'+
        '<button class="gc-sb-comp-btn" onclick="gcToggleSub(\'gc-ucl-sub\')">'+
          '<span>⭐ Champions League</span>'+
          '<span class="gc-sb-badge gc-sb-badge-ucl">UCL</span>'+
        '</button>'+
        '<div class="gc-sb-sub'+(ucl.includes(activePage)?' open':'')+'" id="gc-ucl-sub">'+
          sub('/ucl/index.html','🏠','Overview','ucl-home')+
          sub('/ucl/fixtures/index.html','📅','Fixtures','ucl-fixtures')+
          sub('/ucl/results/index.html','✅','Results','ucl-results')+
          sub('/ucl/teams/index.html','👕','Teams','ucl-teams')+
          sub('/ucl/news/index.html','📰','News','ucl-news')+
        '</div>'+
      '</div>'+

      '<div class="gc-sb-foot">'+
        '<div class="gc-sb-social">'+
          '<a href="https://twitter.com/GoalCurrentlive" target="_blank" rel="noopener">𝕏</a>'+
          '<a href="https://tiktok.com/@goalcurrentlive" target="_blank" rel="noopener">🎵</a>'+
          '<a href="https://instagram.com/goalcurrentlive" target="_blank" rel="noopener">📸</a>'+
        '</div>'+
        '© 2026 <strong style="color:#a8b2c8">Ashna4All</strong> · Ahmad Zafarani<br>'+
        'Independent fan site · Not affiliated with FIFA, UEFA or PL<br>'+
        '<a href="/about.html">About</a> · <a href="/privacy.html">Privacy</a> · '+
        '<a href="/terms.html">Terms</a> · <a href="/disclaimer.html">Disclaimer</a> · '+
        '<a href="/cookies.html">Cookies</a> · <a href="/contact.html">Contact</a>'+
      '</div>'+
    '</nav>'
  );
}

/* ── TAB BAR — changes based on section ── */
function gcRenderTabBar(activePage, section){
  var tabs = {
    wc26: [
      ['home',       '/worldcup2026/index.html',           '🏠','Overview'],
      ['fixtures',   '/worldcup2026/fixtures/index.html',  '📅','Fixtures'],
      ['groups',     '/worldcup2026/groups/index.html',    '🔢','Groups'],
      ['teams',      '/worldcup2026/teams/index.html',     '👕','Teams'],
      ['bracket',    '/worldcup2026/bracket/index.html',   '🏅','Bracket'],
      ['venues',     '/worldcup2026/venues/index.html',    '🏟️','Venues'],
      ['news',       '/worldcup2026/news/index.html',      '📰','News'],
      ['countdown',  '/countdown.html',                    '⏱','Countdown'],
      ['favourites', '/worldcup2026/favourites/index.html','⭐','Favourites'],
    ],
    pl: [
      ['pl-home',     '/premier-league/index.html',         '🏠','Overview'],
      ['pl-table',    '/premier-league/table/index.html',   '📊','Table'],
      ['pl-fixtures', '/premier-league/fixtures/index.html','📅','Fixtures'],
      ['pl-results',  '/premier-league/results/index.html', '✅','Results'],
      ['pl-teams',    '/premier-league/teams/index.html',   '👕','Teams'],
      ['pl-news',     '/premier-league/news/index.html',    '📰','News'],
    ],
    ucl: [
      ['ucl-home',     '/ucl/index.html',          '🏠','Overview'],
      ['ucl-fixtures', '/ucl/fixtures/index.html', '📅','Fixtures'],
      ['ucl-results',  '/ucl/results/index.html',  '✅','Results'],
      ['ucl-teams',    '/ucl/teams/index.html',     '👕','Teams'],
      ['ucl-news',     '/ucl/news/index.html',      '📰','News'],
    ]
  };

  /* Auto-detect section if not specified */
  if(!section){
    if(['pl-home','pl-table','pl-fixtures','pl-results','pl-teams','pl-news'].includes(activePage)) section='pl';
    else if(['ucl-home','ucl-fixtures','ucl-results','ucl-teams','ucl-news'].includes(activePage)) section='ucl';
    else section='wc26';
  }

  var list = tabs[section] || tabs.wc26;
  return '<nav class="gc-tabbar">'+list.map(function(t){
    return '<a href="'+t[1]+'" class="gc-tab'+(activePage===t[0]?' gc-tab-active':'')+'">' +
           '<span class="gc-tab-icon">'+t[2]+'</span>'+
           '<span class="gc-tab-label">'+t[3]+'</span></a>';
  }).join('')+'</nav>';
}

/* ── HEADER ── */
function gcRenderHeader(activePage, subtitle, showTabs, section){
  return (
    '<header class="gc-hdr" id="gcHeader">'+
      '<div class="gc-hdr-inner">'+
        '<div class="gc-hdr-left">'+
          '<button class="gc-hamburger" onclick="gcOpenSidebar()">☰</button>'+
          '<a href="/" class="gc-hdr-logo">⚽ Goal<span>Current</span>.live</a>'+
        '</div>'+
        '<div class="gc-hdr-sub">'+(subtitle||'World Cup 2026 · Premier League · UCL')+'</div>'+
      '</div>'+
      (showTabs!==false ? gcRenderTabBar(activePage, section) : '')+
    '</header>'
  );
}

/* ── FOOTER ── */
function gcRenderFooter(){
  return (
    '<footer class="gc-footer">'+
      '<div class="gc-footer-links">'+
        '<a href="/about.html">About</a>'+
        '<a href="/contact.html">Contact</a>'+
        '<a href="/privacy.html">Privacy Policy</a>'+
        '<a href="/terms.html">Terms</a>'+
        '<a href="/disclaimer.html">Disclaimer</a>'+
        '<a href="/cookies.html">Cookies</a>'+
      '</div>'+
      '<div class="gc-footer-copy">'+
        '© 2026 <strong>Ashna4All</strong> · Ahmad Zafarani · GoalCurrent.live<br>'+
        'Independent fan site · Not affiliated with FIFA, UEFA or the Premier League'+
      '</div>'+
    '</footer>'
  );
}

/* ── NORDVPN ── */
function gcRenderNord(){
  return (
    '<div class="gc-nord-bar">'+
      '🔒 <strong>NordVPN</strong> — 75% off + 3 months FREE '+
      '<a href="https://go.nordvpn.net/aff_c?offer_id=15&aff_id=148347&url_id=902" target="_blank" rel="noopener sponsored" class="gc-nord-btn">Get Deal →</a>'+
      '<a href="https://go.nordpass.io/aff_c?offer_id=488&aff_id=148347&url_id=9356" target="_blank" rel="noopener sponsored" class="gc-nord-pass">NordPass</a>'+
      '<span style="font-size:10px;color:#94a3b8">#AD · <a href="/disclaimer.html" style="color:#94a3b8;text-decoration:none">Affiliate</a></span>'+
    '</div>'
  );
}

/* ── COOKIE BANNER ── */
function gcRenderCookieBanner(){
  if(localStorage.getItem('gc_cookies')) return;
  var b=document.createElement('div');
  b.className='gc-cookie-banner'; b.id='gc-cookie';
  b.innerHTML=(
    '<div class="gc-cookie-text">🍪 We use cookies to personalise content, save your favourites and analyse traffic. See our <a href="/cookies.html">Cookie Policy</a>.</div>'+
    '<div class="gc-cookie-btns">'+
      '<button class="gc-cookie-accept" onclick="gcAcceptCookies()">Accept All ✓</button>'+
      '<button class="gc-cookie-decline" onclick="gcDeclineCookies()">Decline</button>'+
    '</div>'
  );
  document.body.appendChild(b);
}

/* ── SIDEBAR CONTROLS ── */
window.gcOpenSidebar=function(){
  var s=document.getElementById('gcSidebar'),o=document.getElementById('gcSbOverlay');
  if(s)s.classList.add('open');if(o)o.classList.add('show');
  document.body.style.overflow='hidden';
};
window.gcCloseSidebar=function(){
  var s=document.getElementById('gcSidebar'),o=document.getElementById('gcSbOverlay');
  if(s)s.classList.remove('open');if(o)o.classList.remove('show');
  document.body.style.overflow='';
};
window.gcToggleSub=function(id){
  var el=document.getElementById(id);if(el)el.classList.toggle('open');
};
window.gcAcceptCookies=function(){
  localStorage.setItem('gc_cookies','yes');
  var b=document.getElementById('gc-cookie');if(b)b.remove();
};
window.gcDeclineCookies=function(){
  localStorage.setItem('gc_cookies','no');
  var b=document.getElementById('gc-cookie');if(b)b.remove();
};

/* ── LEGACY ALIASES (old pages) ── */
window.openSidebar=window.gcOpenSidebar;
window.closeSidebar=window.gcCloseSidebar;
window.toggleSub=window.gcToggleSub;
window.acceptCookies=window.gcAcceptCookies;
window.declineCookies=window.gcDeclineCookies;

/* ── HELPERS ── */
function getFavourites(){return JSON.parse(localStorage.getItem('wc26_favourites')||'[]');}
function saveFavourites(f){localStorage.setItem('wc26_favourites',JSON.stringify(f));}
function isFavourite(id){return getFavourites().includes(id);}
function toggleFavourite(id){var f=getFavourites(),i=f.indexOf(id);if(i>-1)f.splice(i,1);else f.push(id);saveFavourites(f);return f.includes(id);}
function getCountdown(d){var diff=new Date(d)-new Date();if(diff<=0)return{days:0,hours:0,mins:0,secs:0};return{days:Math.floor(diff/86400000),hours:Math.floor((diff%86400000)/3600000),mins:Math.floor((diff%3600000)/60000),secs:Math.floor((diff%60000)/1000)};}
function formatKickoff(d,t){return new Date(d+'T'+t).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/London'})+' BST';}
function formatMatchDate(d){return new Date(d).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'});}

/* ── MAIN INIT ── */
function initWC26Page(activePage, opts){
  opts=opts||{};
  var subtitle = opts.subtitle||'World Cup 2026 · Premier League · UCL';
  var showTabs = opts.showTabs!==false;
  var section  = opts.section||null;

  var sbHtml  = gcRenderSidebar(activePage);
  var hdrHtml = gcRenderHeader(activePage, subtitle, showTabs, section);
  var ftHtml  = gcRenderFooter();
  var ndHtml  = gcRenderNord();

  /* ── NEW style pages (gc-sidebar-root etc) ── */
  function replaceEl(id, html){
    var el=document.getElementById(id);
    if(el)el.outerHTML=html;
  }
  replaceEl('gc-sidebar-root', sbHtml);
  replaceEl('gc-header-root',  hdrHtml);
  replaceEl('gc-footer-root',  ftHtml);
  replaceEl('gc-nord-root',    ndHtml);

  /* ── LEGACY pages (wc-nav / wc-footer) ── */
  var legacyNav = document.getElementById('wc-nav');
  var legacyFt  = document.getElementById('wc-footer');

  if(legacyNav){
    document.body.insertAdjacentHTML('afterbegin', sbHtml);
    legacyNav.outerHTML = hdrHtml;
    /* Wrap main content for sidebar offset */
    var main=document.querySelector('main,.wc-container,#gc-content,.gc-content');
    if(main && !document.querySelector('.gc-main-wrapper')){
      var w=document.createElement('div');
      w.className='gc-main-wrapper';
      main.parentNode.insertBefore(w,main);
      w.appendChild(main);
    }
  }
  if(legacyFt){
    legacyFt.outerHTML = ndHtml + ftHtml;
  }

  /* Cookie banner */
  setTimeout(gcRenderCookieBanner,1500);
}

/* Site-wide alias so ANY page can call initPage() */
window.initPage = initWC26Page;
