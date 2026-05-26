/* ============================================
   GOALCURRENT.LIVE — World Cup 2026 Shared
   Shared utilities for all WC26 pages
   Author: Ahmad Zafarani
   ============================================ */

// === NAVIGATION ===
function renderNav(activePage) {
  return `
    <div style="background:#0a1628;padding:10px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #2d3f5e;">
      <a href="/" style="font-size:1.1rem;font-weight:700;color:white;text-decoration:none;">⚽ Goal<span style="color:#f59e0b">Current</span>.live</a>
      <button onclick="toggleMobileNav()" style="background:none;border:none;color:white;font-size:1.5rem;cursor:pointer;display:block;">☰</button>
    </div>
    <nav class="wc-nav" id="wcNavLinks">
      <div class="wc-nav-inner">
        <a href="/worldcup2026/" ${activePage==='home'?'class="active"':''}>🏆 Overview</a>
        <a href="/worldcup2026/fixtures/" ${activePage==='fixtures'?'class="active"':''}>📅 Fixtures</a>
        <a href="/worldcup2026/groups/" ${activePage==='groups'?'class="active"':''}>👥 Groups</a>
        <a href="/worldcup2026/teams/" ${activePage==='teams'?'class="active"':''}>🌍 Teams</a>
        <a href="/worldcup2026/bracket/" ${activePage==='bracket'?'class="active"':''}>🏅 Bracket</a>
        <a href="/worldcup2026/venues/" ${activePage==='venues'?'class="active"':''}>🏟️ Venues</a>
        <a href="/worldcup2026/news/" ${activePage==='news'?'class="active"':''}>📰 News</a>
        <a href="/worldcup2026/favourites/" ${activePage==='favourites'?'class="active"':''}>⭐ Favourites</a>
      </div>
    </nav>
  `;
}
// === FAVOURITES ===
function getFavourites() {
  return JSON.parse(localStorage.getItem('wc26_favourites') || '[]');
}

function saveFavourites(favs) {
  localStorage.setItem('wc26_favourites', JSON.stringify(favs));
}

function isFavourite(matchId) {
  return getFavourites().includes(matchId);
}

function toggleFavourite(matchId) {
  let favs = getFavourites();
  if (favs.includes(matchId)) {
    favs = favs.filter(id => id !== matchId);
  } else {
    favs.push(matchId);
  }
  saveFavourites(favs);
  return favs.includes(matchId);
}

function getFavouriteCount() {
  return getFavourites().length;
}

// === FLAGS ===
function getFlag(teamName) {
  const groups = WC26.groups;
  for (const key in groups) {
    const team = groups[key].teams.find(t => t.name === teamName);
    if (team) return team.flag;
  }
  return '🏳️';
}

// === SEARCH ===
function searchTeams(query) {
  const results = [];
  const q = query.toLowerCase();
  for (const key in WC26.groups) {
    WC26.groups[key].teams.forEach(team => {
      if (team.name.toLowerCase().includes(q)) {
        results.push({ ...team, group: key });
      }
    });
  }
  return results;
}
// === COUNTDOWN ===
function getCountdown(targetDate) {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target - now;

  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, mins, secs };
}

function renderCountdown(targetDate) {
  const cd = getCountdown(targetDate);
  return `
    <div class="wc-countdown">
      <div class="wc-countdown-item">
        <div class="wc-count-num">${cd.days}</div>
        <div class="wc-count-label">Days</div>
      </div>
      <div class="wc-countdown-item">
        <div class="wc-count-num">${cd.hours}</div>
        <div class="wc-count-label">Hours</div>
      </div>
      <div class="wc-countdown-item">
        <div class="wc-count-num">${cd.mins}</div>
        <div class="wc-count-label">Mins</div>
      </div>
      <div class="wc-countdown-item">
        <div class="wc-count-num">${cd.secs}</div>
        <div class="wc-count-label">Secs</div>
      </div>
    </div>
  `;
}

// === FOOTER ===
function renderFooter() {
  return `
    <footer class="wc-footer">
      <p>© 2026 <a href="/">GoalCurrent.live</a> · Ahmad Zafarani</p>
      <p>Independent fan site · Not affiliated with FIFA, UEFA or the Premier League</p>
      <p>
        <a href="/privacy.html">Privacy</a> ·
        <a href="/terms.html">Terms</a> ·
        <a href="/disclaimer.html">Disclaimer</a> ·
        <a href="/cookies.html">Cookies</a>
      </p>
    </footer>
  `;
}
// === TIME FORMATTING ===
function formatKickoff(dateStr, timeStr) {
  const dt = new Date(`${dateStr}T${timeStr}`);
  return dt.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/London'
  }) + ' BST';
}

function formatMatchDate(dateStr) {
  const dt = new Date(dateStr);
  return dt.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

// === NOTIFICATIONS ===
function requestNotifications() {
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Notifications enabled');
      }
    });
  }
}

// === INIT ===
function initWC26Page(activePage) {
  const nav = document.getElementById('wc-nav');
  const footer = document.getElementById('wc-footer');
  if (nav) nav.innerHTML = renderNav(activePage);
  if (footer) footer.innerHTML = renderFooter();
  renderCookieBanner();
}
// === COOKIE CONSENT ===
function renderCookieBanner(){
  if(localStorage.getItem('wc26_cookies_accepted')) return;
  var banner=document.createElement('div');
  banner.id='wc26-cookie-banner';
  banner.style.cssText='position:fixed;bottom:0;left:0;right:0;background:#1e2d45;border-top:2px solid #f59e0b;padding:16px;z-index:9999;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;font-family:Inter,Segoe UI,sans-serif;';
  banner.innerHTML=`
    <div style="font-size:0.85rem;color:#e2e8f0;max-width:600px;">
      🍪 We use cookies to personalise content, save your favourites, and analyse traffic. 
      By clicking <strong>Accept</strong> you agree to our 
      <a href="/cookies.html" style="color:#f59e0b;text-decoration:none;">Cookie Policy</a>.
    </div>
    <div style="display:flex;gap:8px;">
      <button onclick="acceptCookies()" style="background:#f59e0b;color:#111827;border:none;padding:8px 20px;border-radius:6px;font-weight:700;cursor:pointer;font-size:0.85rem;">Accept</button>
      <button onclick="declineCookies()" style="background:transparent;color:#94a3b8;border:1px solid #2d3f5e;padding:8px 20px;border-radius:6px;cursor:pointer;font-size:0.85rem;">Decline</button>
    </div>
  `;
  document.body.appendChild(banner);
}

function acceptCookies(){
  localStorage.setItem('wc26_cookies_accepted','yes');
  var b=document.getElementById('wc26-cookie-banner');
  if(b) b.remove();
}

function declineCookies(){
  localStorage.setItem('wc26_cookies_accepted','no');
  var b=document.getElementById('wc26-cookie-banner');
  if(b) b.remove();
}
function toggleMobileNav(){
  var nav=document.getElementById('wcNavLinks');
  if(!nav) return;
  if(nav.style.display===''||nav.style.display==='none'){
    nav.style.display='block';
  } else {
    nav.style.display='none';
  }
}