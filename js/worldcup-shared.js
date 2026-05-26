/* ============================================
   GOALCURRENT.LIVE — World Cup 2026 Shared
   Shared utilities for all WC26 pages
   Author: Ahmad Zafarani
   ============================================ */

// === NAVIGATION ===
function renderNav(activePage) {
  return `
    <nav class="wc-nav">
      <div class="wc-nav-inner">
        <a href="/worldcup2026/" ${activePage === 'home' ? 'class="active"' : ''}>🏆 Overview</a>
        <a href="/worldcup2026/fixtures/" ${activePage === 'fixtures' ? 'class="active"' : ''}>📅 Fixtures</a>
        <a href="/worldcup2026/groups/" ${activePage === 'groups' ? 'class="active"' : ''}>👥 Groups</a>
        <a href="/worldcup2026/teams/" ${activePage === 'teams' ? 'class="active"' : ''}>🌍 Teams</a>
        <a href="/worldcup2026/bracket/" ${activePage === 'bracket' ? 'class="active"' : ''}>🏅 Bracket</a>
        <a href="/worldcup2026/venues/" ${activePage === 'venues' ? 'class="active"' : ''}>🏟️ Venues</a>
        <a href="/worldcup2026/news/" ${activePage === 'news' ? 'class="active"' : ''}>📰 News</a>
        <a href="/worldcup2026/favourites/" ${activePage === 'favourites' ? 'class="active"' : ''}>⭐ Favourites</a>
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
}
