/* ============================================
   GOALCURRENT.LIVE — World Cup 2026 Shared
   Author: Ahmad Zafarani
   ============================================ */

window.toggleMobileNav = function() {
  var nav = document.getElementById('wcNavLinks');
  if (!nav) return;
  if (nav.style.display === 'none') {
    nav.style.display = 'block';
  } else {
    nav.style.display = 'none';
  }
};

function renderNav(activePage) {
  var links = [
    ['home', '/worldcup2026/', '&#127942; Overview'],
    ['fixtures', '/worldcup2026/fixtures/', '&#128197; Fixtures'],
    ['groups', '/worldcup2026/groups/', '&#128101; Groups'],
    ['teams', '/worldcup2026/teams/', '&#127758; Teams'],
    ['bracket', '/worldcup2026/bracket/', '&#127949; Bracket'],
    ['venues', '/worldcup2026/venues/', '&#127967; Venues'],
    ['news', '/worldcup2026/news/', '&#128240; News'],
    ['favourites', '/worldcup2026/favourites/', '&#11088; Favourites']
  ];

  var navLinks = links.map(function(l) {
    var isActive = activePage === l[0];
    return '<a href="' + l[1] + '" style="color:' + (isActive ? '#f59e0b' : '#94a3b8') + ';text-decoration:none;padding:14px 16px;font-size:0.9rem;font-weight:500;white-space:nowrap;border-bottom:3px solid ' + (isActive ? '#f59e0b' : 'transparent') + ';display:inline-block;">' + l[2] + '</a>';
  }).join('');

  return '<div style="background:#0a1628;padding:10px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #2d3f5e;">' +
    '<a href="/" style="font-size:1.1rem;font-weight:700;color:white;text-decoration:none;">&#9917; Goal<span style="color:#f59e0b">Current</span>.live</a>' +
'<button type="button" id="hamburgerBtn" style="background:none;border:none;color:white;font-size:1.5rem;cursor:pointer;padding:4px 8px;">&#9776;</button>'+
    '</div>' +
    '<nav id="wcNavLinks" style="background:#111827;border-bottom:1px solid #2d3f5e;overflow-x:auto;white-space:nowrap;display:none;">'+
    navLinks +
    '</nav>';
}

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
  var favs = getFavourites();
  var idx = favs.indexOf(matchId);
  if (idx > -1) { favs.splice(idx, 1); } else { favs.push(matchId); }
  saveFavourites(favs);
  return favs.includes(matchId);
}

function getFavouriteCount() {
  return getFavourites().length;
}

function getFlag(teamName) {
  var groups = WC26.groups;
  for (var key in groups) {
    var team = groups[key].teams.find(function(t) { return t.name === teamName; });
    if (team) return team.flag;
  }
  return '';
}

function searchTeams(query) {
  var results = [];
  var q = query.toLowerCase();
  for (var key in WC26.groups) {
    WC26.groups[key].teams.forEach(function(team) {
      if (team.name.toLowerCase().includes(q)) {
        results.push({ name: team.name, flag: team.flag, confederation: team.confederation, group: key });
      }
    });
  }
  return results;
}

function getCountdown(targetDate) {
  var now = new Date();
  var target = new Date(targetDate);
  var diff = target - now;
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
  return {
    days: Math.floor(diff / (1000*60*60*24)),
    hours: Math.floor((diff % (1000*60*60*24)) / (1000*60*60)),
    mins: Math.floor((diff % (1000*60*60)) / (1000*60)),
    secs: Math.floor((diff % (1000*60)) / 1000)
  };
}

function renderCountdown(targetDate) {
  var cd = getCountdown(targetDate);
  return '<div class="wc-countdown">' +
    '<div class="wc-countdown-item"><div class="wc-count-num">' + cd.days + '</div><div class="wc-count-label">Days</div></div>' +
    '<div class="wc-countdown-item"><div class="wc-count-num">' + cd.hours + '</div><div class="wc-count-label">Hours</div></div>' +
    '<div class="wc-countdown-item"><div class="wc-count-num">' + cd.mins + '</div><div class="wc-count-label">Mins</div></div>' +
    '<div class="wc-countdown-item"><div class="wc-count-num">' + cd.secs + '</div><div class="wc-count-label">Secs</div></div>' +
    '</div>';
}

function renderFooter() {
  return '<footer class="wc-footer">' +
    '<p>&#169; 2026 <a href="/">GoalCurrent.live</a> &middot; Ahmad Zafarani</p>' +
    '<p>Independent fan site &middot; Not affiliated with FIFA, UEFA or the Premier League</p>' +
    '<p><a href="/privacy.html">Privacy</a> &middot; <a href="/terms.html">Terms</a> &middot; <a href="/disclaimer.html">Disclaimer</a> &middot; <a href="/cookies.html">Cookies</a></p>' +
    '</footer>';
}

function formatKickoff(dateStr, timeStr) {
  var dt = new Date(dateStr + 'T' + timeStr);
  return dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' }) + ' BST';
}

function formatMatchDate(dateStr) {
  var dt = new Date(dateStr);
  return dt.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function requestNotifications() {
  if ('Notification' in window) {
    Notification.requestPermission().then(function(p) {
      if (p === 'granted') { console.log('Notifications enabled'); }
    });
  }
}

function renderCookieBanner() {
  if (localStorage.getItem('wc26_cookies_accepted')) return;
  var banner = document.createElement('div');
  banner.id = 'wc26-cookie-banner';
  banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#1e2d45;border-top:2px solid #f59e0b;padding:16px;z-index:9999;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;font-family:Inter,Segoe UI,sans-serif;';
  banner.innerHTML = '<div style="font-size:0.85rem;color:#e2e8f0;max-width:600px;">&#127850; We use cookies to personalise content, save your favourites, and analyse traffic. By clicking <strong>Accept</strong> you agree to our <a href="/cookies.html" style="color:#f59e0b;text-decoration:none;">Cookie Policy</a>.</div><div style="display:flex;gap:8px;"><button onclick="acceptCookies()" style="background:#f59e0b;color:#111827;border:none;padding:8px 20px;border-radius:6px;font-weight:700;cursor:pointer;font-size:0.85rem;">Accept</button><button onclick="declineCookies()" style="background:transparent;color:#94a3b8;border:1px solid #2d3f5e;padding:8px 20px;border-radius:6px;cursor:pointer;font-size:0.85rem;">Decline</button></div>';
  document.body.appendChild(banner);
}

function acceptCookies() {
  localStorage.setItem('wc26_cookies_accepted', 'yes');
  var b = document.getElementById('wc26-cookie-banner');
  if (b) b.remove();
}

function declineCookies() {
  localStorage.setItem('wc26_cookies_accepted', 'no');
  var b = document.getElementById('wc26-cookie-banner');
  if (b) b.remove();
}

function initWC26Page(activePage) {
  var navEl = document.getElementById('wc-nav');
  var footer = document.getElementById('wc-footer');
  if (navEl) navEl.innerHTML = renderNav(activePage);
  if (footer) footer.innerHTML = renderFooter();
  renderCookieBanner();

  var btn = document.getElementById('hamburgerBtn');
  if (btn) {
    btn.addEventListener('click', function(e) {
  e.preventDefault();
      var nav = document.getElementById('wcNavLinks');
      if (!nav) return;
      if (nav.style.display === 'none') {
        nav.style.display = 'block';
      } else {
        nav.style.display = 'none';
      }
    });
  }
}
