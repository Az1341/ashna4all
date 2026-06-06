/* ============================================================
   GOALCURRENT.LIVE — Universal Shared Navigation v2
   Author: Ahmad Zafarani
   Consistent across ALL pages — sidebar left, hamburger left
   ============================================================ */

/* ── SIDEBAR HTML ── */
function renderSidebar(activePage) {
  var sections = {
    wc26: ['home','fixtures','groups','teams','bracket','venues','news','countdown','favourites'],
    pl:   ['pl-home','pl-table','pl-fixtures','pl-results','pl-news'],
    ucl:  ['ucl-home','ucl-fixtures','ucl-results','ucl-teams','ucl-news']
  };

  function isActive(key) { return activePage === key; }
  function sbLink(href, icon, label, key) {
    return '<a href="' + href + '" class="gc-sb-link' + (isActive(key) ? ' gc-sb-active' : '') + '">' +
           '<span class="gc-sb-icon">' + icon + '</span>' + label + '</a>';
  }
  function subLink(href, icon, label, key) {
    return '<a href="' + href + '" class="gc-sb-sub-link' + (isActive(key) ? ' gc-sb-sub-active' : '') + '">' + icon + ' ' + label + '</a>';
  }

  var wc26Open = sections.wc26.includes(activePage);
  var plOpen   = sections.pl.includes(activePage);
  var uclOpen  = sections.ucl.includes(activePage);

  return `
  <div class="gc-sb-overlay" id="gcSbOverlay" onclick="gcCloseSidebar()"></div>
  <nav class="gc-sidebar" id="gcSidebar">
    <div class="gc-sb-logo">
      <a href="/">⚽ Goal<span>Current</span>.live</a>
      <button class="gc-sb-close" onclick="gcCloseSidebar()">✕</button>
    </div>

    <div class="gc-sb-section">Main Menu</div>
    ${sbLink('/','🏠','Home','main-home')}
    ${sbLink('/premier-league/index.html','🔴','Live Scores','live')}
    ${sbLink('/premier-league/fixtures/index.html','📅','Fixtures','fixtures-main')}
    ${sbLink('/premier-league/table/index.html','🏅','Standings','standings')}
    ${sbLink('/worldcup2026/news/index.html','📰','Latest News','news-main')}

    <div class="gc-sb-section">Competitions</div>

    <div class="gc-sb-comp">
      <button class="gc-sb-comp-btn" onclick="gcToggleSub('pl-sub', this)">
        <span>🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League</span>
        <span class="gc-sb-badge gc-sb-badge-pl">PL</span>
      </button>
      <div class="gc-sb-sub ${plOpen ? 'open' : ''}" id="pl-sub">
        ${subLink('/premier-league/index.html','🏠','Overview','pl-home')}
        ${subLink('/premier-league/table/index.html','📊','Table','pl-table')}
        ${subLink('/premier-league/fixtures/index.html','📅','Fixtures','pl-fixtures')}
        ${subLink('/premier-league/results/index.html','✅','Results','pl-results')}
        ${subLink('/premier-league/news/index.html','📰','News','pl-news')}
      </div>
    </div>

    <div class="gc-sb-comp">
      <button class="gc-sb-comp-btn" onclick="gcToggleSub('wc26-sub', this)">
        <span>🏆 World Cup 2026</span>
        <span class="gc-sb-badge gc-sb-badge-gold">WC26</span>
      </button>
      <div class="gc-sb-sub ${wc26Open ? 'open' : ''}" id="wc26-sub">
        ${subLink('/worldcup2026/index.html','🏠','Overview','home')}
        ${subLink('/worldcup2026/groups/index.html','🔢','Groups','groups')}
        ${subLink('/worldcup2026/fixtures/index.html','📅','Fixtures','fixtures')}
        ${subLink('/worldcup2026/bracket/index.html','🏅','Bracket','bracket')}
        ${subLink('/worldcup2026/venues/index.html','🏟️','Venues','venues')}
        ${subLink('/worldcup2026/teams/index.html','👕','Teams','teams')}
        ${subLink('/worldcup2026/news/index.html','📰','News','news')}
        ${subLink('/countdown.html','⏱','Countdown','countdown')}
        ${subLink('/worldcup2026/favourites/index.html','⭐','Favourites','favourites')}
      </div>
    </div>

    <div class="gc-sb-comp">
      <button class="gc-sb-comp-btn" onclick="gcToggleSub('ucl-sub', this)">
        <span>⭐ Champions League</span>
        <span class="gc-sb-badge">UCL</span>
      </button>
      <div class="gc-sb-sub ${uclOpen ? 'open' : ''}" id="ucl-sub">
        ${subLink('/ucl/index.html','🏠','Overview','ucl-home')}
        ${subLink('/ucl/fixtures/index.html','📅','Fixtures','ucl-fixtures')}
        ${subLink('/ucl/results/index.html','✅','Results','ucl-results')}
        ${subLink('/ucl/teams/index.html','👕','Teams','ucl-teams')}
        ${subLink('/ucl/news/index.html','📰','News','ucl-news')}
      </div>
    </div>

    <div class="gc-sb-foot">
      <div class="gc-sb-social">
        <a href="https://twitter.com/GoalCurrentlive" target="_blank" rel="noopener">𝕏</a>
        <a href="https://tiktok.com/@goalcurrentlive" target="_blank" rel="noopener">🎵</a>
        <a href="https://instagram.com/goalcurrentlive" target="_blank" rel="noopener">📸</a>
      </div>
      © 2026 <strong style="color:#a8b2c8">Ashna4All</strong> · Ahmad Zafarani<br>
      Independent fan site · Not affiliated with FIFA, UEFA or PL<br>
      <a href="/about.html">About</a> · <a href="/privacy.html">Privacy</a> ·
      <a href="/terms.html">Terms</a> · <a href="/disclaimer.html">Disclaimer</a> ·
      <a href="/cookies.html">Cookies</a> · <a href="/contact.html">Contact</a>
    </div>
  </nav>`;
}

/* ── TOP ICON TAB BAR (WC2026 pages) ── */
function renderTabBar(activePage) {
  var tabs = [
    ['home',       '/worldcup2026/index.html',            '🏠', 'Overview'],
    ['fixtures',   '/worldcup2026/fixtures/index.html',   '📅', 'Fixtures'],
    ['groups',     '/worldcup2026/groups/index.html',     '🔢', 'Groups'],
    ['teams',      '/worldcup2026/teams/index.html',      '👕', 'Teams'],
    ['bracket',    '/worldcup2026/bracket/index.html',    '🏅', 'Bracket'],
    ['venues',     '/worldcup2026/venues/index.html',     '🏟️', 'Venues'],
    ['news',       '/worldcup2026/news/index.html',       '📰', 'News'],
    ['countdown',  '/countdown.html',                     '⏱', 'Countdown'],
    ['favourites', '/worldcup2026/favourites/index.html', '⭐', 'Favourites'],
  ];

  var html = '<nav class="gc-tabbar" id="gcTabBar">';
  tabs.forEach(function(t) {
    var active = activePage === t[0];
    html += '<a href="' + t[1] + '" class="gc-tab' + (active ? ' gc-tab-active' : '') + '">' +
            '<span class="gc-tab-icon">' + t[2] + '</span>' +
            '<span class="gc-tab-label">' + t[3] + '</span>' +
            '</a>';
  });
  html += '</nav>';
  return html;
}

/* ── TOP HEADER ── */
function renderHeader(activePage, subtitle, showTabBar) {
  subtitle = subtitle || 'World Cup 2026 · Premier League · UCL';
  showTabBar = showTabBar !== false;
  return `
  <header class="gc-hdr" id="gcHeader">
    <div class="gc-hdr-inner">
      <div class="gc-hdr-left">
        <button class="gc-hamburger" onclick="gcOpenSidebar()" aria-label="Open menu">☰</button>
        <a href="/" class="gc-hdr-logo">⚽ Goal<span>Current</span>.live</a>
      </div>
      <div class="gc-hdr-sub">${subtitle}</div>
    </div>
    ${showTabBar ? renderTabBar(activePage) : ''}
  </header>`;
}

/* ── FOOTER ── */
function renderFooter() {
  return `
  <footer class="gc-footer">
    <div class="gc-footer-links">
      <a href="/about.html">About</a>
      <a href="/contact.html">Contact</a>
      <a href="/privacy.html">Privacy Policy</a>
      <a href="/terms.html">Terms</a>
      <a href="/disclaimer.html">Disclaimer</a>
      <a href="/cookies.html">Cookies</a>
    </div>
    <div class="gc-footer-copy">
      © 2026 <strong>Ashna4All</strong> · Ahmad Zafarani · GoalCurrent.live<br>
      Independent fan site · Not affiliated with FIFA, UEFA or the Premier League
    </div>
  </footer>`;
}

/* ── NORDVPN BAR ── */
function renderNordBar() {
  return `
  <div class="gc-nord-bar">
    🔒 <strong>NordVPN</strong> — 75% off + 3 months FREE
    <a href="https://go.nordvpn.net/aff_c?offer_id=15&aff_id=148347&url_id=902" target="_blank" rel="noopener sponsored" class="gc-nord-btn">Get Deal →</a>
    <a href="https://go.nordpass.io/aff_c?offer_id=488&aff_id=148347&url_id=9356" target="_blank" rel="noopener sponsored" class="gc-nord-pass">NordPass</a>
    <span class="gc-nord-ad">#AD · <a href="/disclaimer.html">Affiliate</a></span>
  </div>`;
}

/* ── COOKIE BANNER ── */
function renderCookieBanner() {
  if (localStorage.getItem('gc_cookies')) return;
  var b = document.createElement('div');
  b.id = 'gc-cookie';
  b.className = 'gc-cookie-banner';
  b.innerHTML = `
    <div class="gc-cookie-text">
      🍪 We use cookies to personalise content, save your favourites and analyse traffic.
      See our <a href="/cookies.html">Cookie Policy</a>.
    </div>
    <div class="gc-cookie-btns">
      <button onclick="gcAcceptCookies()" class="gc-cookie-accept">Accept All ✓</button>
      <button onclick="gcDeclineCookies()" class="gc-cookie-decline">Decline</button>
    </div>`;
  document.body.appendChild(b);
}

/* ── SIDEBAR CONTROLS ── */
window.gcOpenSidebar = function() {
  document.getElementById('gcSidebar').classList.add('open');
  document.getElementById('gcSbOverlay').classList.add('show');
  document.body.style.overflow = 'hidden';
};
window.gcCloseSidebar = function() {
  document.getElementById('gcSidebar').classList.remove('open');
  document.getElementById('gcSbOverlay').classList.remove('show');
  document.body.style.overflow = '';
};
window.gcToggleSub = function(id, btn) {
  var el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('open');
};

/* ── COOKIE CONTROLS ── */
window.gcAcceptCookies = function() {
  localStorage.setItem('gc_cookies', 'yes');
  var b = document.getElementById('gc-cookie'); if (b) b.remove();
};
window.gcDeclineCookies = function() {
  localStorage.setItem('gc_cookies', 'no');
  var b = document.getElementById('gc-cookie'); if (b) b.remove();
};

/* ── LEGACY COMPAT (old pages that call acceptCookies/declineCookies) ── */
window.acceptCookies  = window.gcAcceptCookies;
window.declineCookies = window.gcDeclineCookies;

/* ── FAVOURITES ── */
function getFavourites()          { return JSON.parse(localStorage.getItem('wc26_favourites') || '[]'); }
function saveFavourites(favs)     { localStorage.setItem('wc26_favourites', JSON.stringify(favs)); }
function isFavourite(id)          { return getFavourites().includes(id); }
function toggleFavourite(id) {
  var favs = getFavourites(), idx = favs.indexOf(id);
  if (idx > -1) favs.splice(idx, 1); else favs.push(id);
  saveFavourites(favs);
  return favs.includes(id);
}

/* ── COUNTDOWN HELPER ── */
function getCountdown(targetDate) {
  var diff = new Date(targetDate) - new Date();
  if (diff <= 0) return {days:0,hours:0,mins:0,secs:0};
  return {
    days:  Math.floor(diff/86400000),
    hours: Math.floor((diff%86400000)/3600000),
    mins:  Math.floor((diff%3600000)/60000),
    secs:  Math.floor((diff%60000)/1000)
  };
}

/* ── FORMAT HELPERS ── */
function formatKickoff(dateStr, timeStr) {
  var dt = new Date(dateStr + 'T' + timeStr);
  return dt.toLocaleTimeString('en-GB', {hour:'2-digit',minute:'2-digit',timeZone:'Europe/London'}) + ' BST';
}
function formatMatchDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {weekday:'long',day:'numeric',month:'long',year:'numeric'});
}

/* ── MAIN INIT ── */
function initWC26Page(activePage, opts) {
  opts = opts || {};
  var subtitle  = opts.subtitle  || 'World Cup 2026 · Premier League · UCL';
  var showTabs  = opts.showTabs  !== false;
  var showNord  = opts.showNord  !== false;

  /* Inject sidebar */
  var sbEl = document.getElementById('gc-sidebar-root');
  if (sbEl) sbEl.innerHTML = renderSidebar(activePage);

  /* Inject header */
  var hdrEl = document.getElementById('gc-header-root');
  if (hdrEl) hdrEl.innerHTML = renderHeader(activePage, subtitle, showTabs);

  /* Inject footer */
  var ftEl = document.getElementById('gc-footer-root');
  if (ftEl) ftEl.innerHTML = renderFooter();

  /* Inject nordvpn */
  if (showNord) {
    var ndEl = document.getElementById('gc-nord-root');
    if (ndEl) ndEl.innerHTML = renderNordBar();
  }

  /* Cookie banner */
  setTimeout(renderCookieBanner, 1500);

  /* Legacy nav support (old pages with wc-nav / wc-footer divs) */
  var legacyNav = document.getElementById('wc-nav');
  if (legacyNav) legacyNav.innerHTML = renderSidebar(activePage) + renderHeader(activePage, subtitle, showTabs);
  var legacyFt = document.getElementById('wc-footer');
  if (legacyFt) legacyFt.innerHTML = renderFooter();
}
