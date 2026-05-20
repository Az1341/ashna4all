/* ============================================================
   notifications.js — OneSignal push notifications
   goalcurrent.live
   ============================================================ */

var GC_NOTIFY = (function () {

  var APP_ID  = 'e6a77420-dc1d-4dae-895f-ee68950148f9';
  var REST_KEY = 'os_v2_app_42txiig4dvg25ck75zujkaki7ekky7dn5k3uhzeeljnes4t772nbpnydk4sfdwyppcjt5f6k32rzctubbeajvtaq74matbstdqj3xai';
  var SITE_URL = 'https://goalcurrent.live';

  /* ── OneSignal opt-in ─────────────────────────────────── */
  function optIn() {
    if (window.OneSignal) {
      try { OneSignal.User.PushSubscription.optIn(); } catch (e) {}
    }
  }

  /* ── Send push via REST API ───────────────────────────── */
  function push(title, message, url) {
    fetch('https://onesignal.com/api/v1/notifications', {
      method : 'POST',
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': 'Basic ' + REST_KEY
      },
      body: JSON.stringify({
        app_id           : APP_ID,
        included_segments: ['All'],
        headings         : { en: title },
        contents         : { en: message },
        url              : url || SITE_URL,
        web_push_topic   : 'match-event'
      })
    }).catch(function () {});
  }

  /* ── Goal celebration ─────────────────────────────────── */
  function onGoal(team, player, minute) {
    showGoalAnimation(team, player, minute);
    push(
      '⚽ GOAL! ' + team,
      (player ? player + ' · ' : '') + (minute || '') + ' — goalcurrent.live',
      SITE_URL
    );
  }

  /* ── Card celebration ─────────────────────────────────── */
  function onCard(colour, team, player, minute) {
    showCardAnimation(colour, player || team, minute);
    var em = colour === 'red' ? '🟥 RED CARD' : '🟨 Yellow Card';
    push(
      em + ' — ' + (player || team),
      team + (minute ? ' · ' + minute : '') + ' — goalcurrent.live',
      SITE_URL
    );
  }

  /* ── Sub celebration ──────────────────────────────────── */
  function onSub(team, playerOn, playerOff, minute) {
    showSubAnimation(team, playerOn, playerOff, minute);
    push(
      '🔄 Sub — ' + team,
      '🟢 ' + playerOn + (playerOff ? ' | 🔴 ' + playerOff : '') + (minute ? ' · ' + minute : ''),
      SITE_URL
    );
  }

  /* ══════════════════════════════════════════════════════
     Celebration animations
  ══════════════════════════════════════════════════════ */

  function showGoalAnimation(team, player, minute) {
    var el = createOverlay('gc-anim-goal');
    el.innerHTML =
      '<div class="gc-anim-inner">' +
        '<div class="gc-anim-icon">⚽</div>' +
        '<div class="gc-anim-title">GOAL!</div>' +
        '<div class="gc-anim-team">' + esc(team) + '</div>' +
        (player ? '<div class="gc-anim-player">' + esc(player) + (minute ? ' · ' + esc(minute) : '') + '</div>' : '') +
      '</div>';
    spawnConfetti(el, 60);
    showAndRemove(el, 3500);
  }

  function showCardAnimation(colour, player, minute) {
    var el = createOverlay('gc-anim-card');
    var icon = colour === 'red' ? '🟥' : '🟨';
    el.innerHTML =
      '<div class="gc-anim-inner">' +
        '<div class="gc-anim-icon">' + icon + '</div>' +
        '<div class="gc-anim-title">' + (colour === 'red' ? 'RED CARD' : 'YELLOW CARD') + '</div>' +
        '<div class="gc-anim-player">' + esc(player) + (minute ? ' · ' + esc(minute) : '') + '</div>' +
      '</div>';
    showAndRemove(el, 2500);
  }

  function showSubAnimation(team, playerOn, playerOff, minute) {
    var el = createOverlay('gc-anim-sub');
    el.innerHTML =
      '<div class="gc-anim-inner">' +
        '<div class="gc-anim-icon">🔄</div>' +
        '<div class="gc-anim-title">SUBSTITUTION</div>' +
        '<div class="gc-anim-team">' + esc(team) + '</div>' +
        '<div class="gc-anim-player">🟢 ' + esc(playerOn) + (playerOff ? ' | 🔴 ' + esc(playerOff) : '') + (minute ? ' · ' + esc(minute) : '') + '</div>' +
      '</div>';
    showAndRemove(el, 2500);
  }

  /* ── helpers ─────────────────────────────────────────── */
  function createOverlay(cls) {
    var el = document.createElement('div');
    el.className = 'gc-celebration ' + cls;
    document.body.appendChild(el);
    return el;
  }

  function showAndRemove(el, delay) {
    setTimeout(function () { el.classList.add('gc-anim-show'); }, 50);
    setTimeout(function () {
      el.classList.remove('gc-anim-show');
      setTimeout(function () { el.parentNode && el.parentNode.removeChild(el); }, 400);
    }, delay);
  }

  function spawnConfetti(parent, count) {
    var colours = ['#f97316','#22c55e','#2563eb','#facc15','#ec4899','#ffffff'];
    for (var i = 0; i < count; i++) {
      (function () {
        var dot = document.createElement('div');
        dot.className = 'gc-confetti-dot';
        dot.style.cssText =
          'left:' + (Math.random() * 100) + '%;' +
          'background:' + colours[Math.floor(Math.random() * colours.length)] + ';' +
          'animation-delay:' + (Math.random() * 0.6) + 's;' +
          'animation-duration:' + (0.8 + Math.random() * 0.8) + 's;';
        parent.appendChild(dot);
      })();
    }
  }

  function esc(str) {
    if (!str) return '';
    return String(str).replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  /* ── Test helpers (browser console) ──────────────────── */
  window.testGoal = function () { onGoal('England', 'Harry Kane', "23'"); };
  window.testCard = function (c) { onCard(c || 'yellow', 'Brazil', 'Vinicius Jr', "67'"); };
  window.testSub  = function () { onSub('France', 'Mbappé', 'Giroud', "72'"); };

  return {
    optIn : optIn,
    push  : push,
    onGoal: onGoal,
    onCard: onCard,
    onSub : onSub
  };

})();

/* Auto opt-in when OneSignal is ready */
if (window.OneSignal) {
  OneSignal.push(function () { GC_NOTIFY.optIn(); });
}
