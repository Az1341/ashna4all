/* ============================================================
   home.js — Home page + countdown to World Cup / PL final day
   goalcurrent.live
   ============================================================ */

var GC_HOME = (function () {

  var _timer = null;

  /* ── Key dates ────────────────────────────────────────── */
  var DATES = {
    PL_FINAL : new Date('2026-05-24T16:00:00+01:00'), // PL final day
    WC_START : new Date('2026-06-11T17:00:00+01:00')  // World Cup 2026 opener
  };

  /* ── Countdown engine ─────────────────────────────────── */
  function getCountdown(target) {
    var now  = new Date();
    var diff = target - now;
    if (diff <= 0) return null;
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000)  / 60000);
    var s = Math.floor((diff % 60000)    / 1000);
    return { d: d, h: h, m: m, s: s };
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function tickCountdown() {
    /* PL countdown */
    var plEl = document.getElementById('gc-cd-pl');
    if (plEl) {
      var pl = getCountdown(DATES.PL_FINAL);
      if (pl) {
        plEl.innerHTML =
          unit(pl.d, 'Days') + unit(pl.h, 'Hrs') +
          unit(pl.m, 'Min')  + unit(pl.s, 'Sec');
      } else {
        plEl.innerHTML = '<span class="gc-cd-live">🏴󠁧󠁢󠁥󠁮󠁧󠁿 Final Day is ON!</span>';
      }
    }

    /* WC countdown */
    var wcEl = document.getElementById('gc-cd-wc');
    if (wcEl) {
      var wc = getCountdown(DATES.WC_START);
      if (wc) {
        wcEl.innerHTML =
          unit(wc.d, 'Days') + unit(wc.h, 'Hrs') +
          unit(wc.m, 'Min')  + unit(wc.s, 'Sec');
      } else {
        wcEl.innerHTML = '<span class="gc-cd-live">🌍 World Cup is LIVE!</span>';
      }
    }
  }

  function unit(n, label) {
    return '<div class="gc-cd-unit"><span class="gc-cd-num">' + pad(n) +
           '</span><span class="gc-cd-label">' + label + '</span></div>';
  }

  /* ── Render ───────────────────────────────────────────── */
  function render(container) {
    if (_timer) clearInterval(_timer);

    container.innerHTML =
      '<div class="gc-home">' +

        /* Hero */
        '<div class="gc-hero">' +
          '<div class="gc-hero-badge">⚽ LIVE SCORES</div>' +
          '<h1 class="gc-hero-title">GoalCurrent<span class="gc-hero-dot">.live</span></h1>' +
          '<p class="gc-hero-sub">Premier League · World Cup 2026 · Real-time scores & stats</p>' +
        '</div>' +

        /* PL Countdown card */
        '<div class="gc-card gc-cd-card">' +
          '<div class="gc-cd-header">' +
            '<img src="https://a.espncdn.com/i/leaguelogos/soccer/500/23.png" class="gc-cd-logo" alt="PL">' +
            '<div>' +
              '<div class="gc-cd-title">🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League Final Day</div>' +
              '<div class="gc-cd-date">Sunday 24 May 2026 · 4:00 PM UK</div>' +
            '</div>' +
          '</div>' +
          '<div class="gc-cd-units" id="gc-cd-pl"></div>' +
          '<button class="gc-btn gc-btn-primary" onclick="GC.go(\'live\')">Watch Live Scores →</button>' +
        '</div>' +

        /* WC Countdown card */
        '<div class="gc-card gc-cd-card gc-cd-wc-card">' +
          '<div class="gc-cd-header">' +
            '<span class="gc-cd-wc-icon">🏆</span>' +
            '<div>' +
              '<div class="gc-cd-title">World Cup 2026</div>' +
              '<div class="gc-cd-date">Kicks off 11 June 2026 · USA · Canada · Mexico</div>' +
            '</div>' +
          '</div>' +
          '<div class="gc-cd-units" id="gc-cd-wc"></div>' +
          '<button class="gc-btn gc-btn-gold" onclick="GC.go(\'schedule\')">View Full Schedule →</button>' +
        '</div>' +

        /* Quick links */
        '<div class="gc-quicklinks">' +
          '<button class="gc-ql-btn" onclick="GC.go(\'live\')">' +
            '<span class="gc-ql-icon">🔴</span><span>Live Scores</span>' +
          '</button>' +
          '<button class="gc-ql-btn" onclick="GC.go(\'schedule\')">' +
            '<span class="gc-ql-icon">📅</span><span>Schedule</span>' +
          '</button>' +
          '<button class="gc-ql-btn" onclick="GC.go(\'groups\')">' +
            '<span class="gc-ql-icon">🏅</span><span>Standings</span>' +
          '</button>' +
        '</div>' +

        /* Brevo email signup */
        '<div class="gc-card gc-signup-card">' +
          '<div class="gc-signup-title">📬 Get Goal Alerts by Email</div>' +
          '<div class="gc-signup-sub">Never miss a goal — World Cup & Premier League updates</div>' +
          '<a href="https://6f3982fe.sibforms.com/serve/MUIFAA..." target="_blank" class="gc-btn gc-btn-green">Subscribe Free →</a>' +
        '</div>' +

      '</div>';

    /* start countdown ticking */
    tickCountdown();
    _timer = setInterval(tickCountdown, 1000);
  }

  return { render: render };

})();
