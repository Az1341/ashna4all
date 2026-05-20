/* home.js — Home page with hero banners + countdown */
var GC_HOME = (function () {
  var _timer = null;
  var DATES = {
    PL: new Date('2026-05-24T16:00:00+01:00'),
    WC: new Date('2026-06-11T17:00:00+01:00')
  };

  /* Hero images — using reliable public URLs */
  var HEROES = {
    PL: {
      img: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Premier_League_Logo.svg/1200px-Premier_League_Logo.svg.png',
      bg:  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=900&q=80',
      title: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League 2025/26',
      sub:   'Final Day — Sunday 24 May 2026'
    },
    WC: {
      img: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/67/2026_FIFA_World_Cup_emblem.svg/800px-2026_FIFA_World_Cup_emblem.svg.png',
      bg:  'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=900&q=80',
      title: '🏆 FIFA World Cup 2026',
      sub:   'USA · Canada · Mexico — 11 Jun to 26 Jul 2026'
    }
  };

  function getCountdown(target) {
    var diff = target - new Date();
    if (diff <= 0) return null;
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000)
    };
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function unit(n, l) {
    return '<div class="gc-cd-unit"><span class="gc-cd-num">' + pad(n) +
           '</span><span class="gc-cd-lbl">' + l + '</span></div>';
  }

  function tick() {
    ['PL','WC'].forEach(function(k) {
      var el = document.getElementById('gc-cd-' + k);
      if (!el) return;
      var cd = getCountdown(DATES[k]);
      if (cd) {
        el.innerHTML = unit(cd.d,'Days') + unit(cd.h,'Hrs') + unit(cd.m,'Min') + unit(cd.s,'Sec');
      } else {
        el.innerHTML = '<span class="gc-cd-live">' + (k==='PL'?'🏴󠁧󠁢󠁥󠁮󠁧󠁿':'🌍') + ' LIVE NOW!</span>';
      }
    });
  }

  function heroBanner(key) {
    var h = HEROES[key];
    return '<div class="gc-hero-banner-wrap">' +
      '<img src="' + h.bg + '" alt="' + h.title + '" onerror="this.style.display=\'none\'">' +
      '<div class="gc-hero-banner-overlay">' +
        '<div class="gc-hero-banner-title">' + h.title + '</div>' +
        '<div class="gc-hero-banner-sub">' + h.sub + '</div>' +
      '</div>' +
    '</div>';
  }

  function render(container) {
    if (_timer) clearInterval(_timer);
    container.innerHTML =
      '<div style="padding-top:20px">' +

      /* Hero */
      '<div class="gc-hero">' +
        '<div class="gc-hero-eyebrow"><span class="gc-hero-dot-red"></span>LIVE SCORES</div>' +
        '<h1 class="gc-hero-title">Goal<span>Current</span>.live</h1>' +
        '<p class="gc-hero-sub">Premier League · World Cup 2026 · Real-time scores & stats</p>' +
      '</div>' +

      /* PL card with banner */
      '<div class="gc-card gc-cd-card gc-cd-pl-card">' +
        heroBanner('PL') +
        '<div class="gc-cd-header">' +
          '<img class="gc-cd-logo" src="https://resources.premierleague.com/premierleague/badges/pl_3lions.png" onerror="this.src=\'https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Premier_League_Logo.svg/120px-Premier_League_Logo.svg.png\'" alt="PL">' +
          '<div><div class="gc-cd-title">🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League Final Day</div><div class="gc-cd-sub">Sunday 24 May 2026 · 4:00 PM UK · All 10 games</div></div>' +
        '</div>' +
        '<div class="gc-cd-units" id="gc-cd-PL"></div>' +
        '<button class="gc-btn gc-btn-primary" onclick="GC.go(\'live\')">⚽ Watch Live Scores →</button>' +
      '</div>' +

      /* WC card with Azadi stadium banner */
      '<div class="gc-card gc-cd-card gc-cd-wc-card">' +
        heroBanner('WC') +
        '<div class="gc-cd-header">' +
          '<span class="gc-cd-icon">🏆</span>' +
          '<div><div class="gc-cd-title">FIFA World Cup 2026</div><div class="gc-cd-sub">USA · Canada · Mexico · 48 Teams · 104 Matches</div></div>' +
        '</div>' +
        '<div class="gc-cd-units" id="gc-cd-WC"></div>' +
        '<button class="gc-btn gc-btn-gold" onclick="GC.go(\'schedule\')">📅 View Full Schedule →</button>' +
      '</div>' +

      /* Quick links */
      '<div class="gc-quicklinks">' +
        '<button class="gc-ql-btn" onclick="GC.go(\'live\')"><span class="gc-ql-icon">🔴</span>Live</button>' +
        '<button class="gc-ql-btn" onclick="GC.go(\'schedule\')"><span class="gc-ql-icon">📅</span>Schedule</button>' +
        '<button class="gc-ql-btn" onclick="GC.go(\'groups\')"><span class="gc-ql-icon">🏅</span>Standings</button>' +
        '<button class="gc-ql-btn" onclick="GC.go(\'myteams\')"><span class="gc-ql-icon">⭐</span>My Teams</button>' +
      '</div>' +

      /* Email signup */
      '<div class="gc-card gc-signup-card">' +
        '<div class="gc-signup-title">📬 Get Goal Alerts by Email</div>' +
        '<div class="gc-signup-sub">Never miss a goal — World Cup & Premier League updates</div>' +
        '<a href="https://6f3982fe.sibforms.com/serve/MUIFAA..." target="_blank" class="gc-btn gc-btn-green">Subscribe Free →</a>' +
      '</div>' +

      '</div>';

    tick();
    _timer = setInterval(tick, 1000);
  }

  return { render: render };
})();
