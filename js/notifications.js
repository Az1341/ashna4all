/* ============================================================
   notifications.js — OneSignal push (client opt-in + celebrations)
   goalcurrent.live

   SECURITY: This file is CLIENT-SIDE. It must NEVER contain the OneSignal
   REST API key or send REST push requests from the browser. Sending pushes
   requires the OneSignal REST API key, which is a server-only secret and must
   live ONLY in a Vercel serverless route using process.env.ONESIGNAL_REST_API_KEY
   (with process.env.ONESIGNAL_APP_ID). Trigger pushes by calling that server
   route, never from here.
   ============================================================ */

var GC_NOTIFY = (function () {

  /* ── OneSignal opt-in (client SDK only — no secret needed) ── */
  function optIn() {
    if (window.OneSignal) {
      try { OneSignal.User.PushSubscription.optIn(); } catch (e) {}
    }
  }

  /* ── Server-side push trigger ──────────────────────────────
     Client code must NOT call the OneSignal REST API directly.
     This helper only asks our own serverless route to send the push;
     the REST key stays server-side. If the route is not deployed yet,
     this is a safe no-op. */
  function push(title, message, url) {
    try {
      fetch('/api/notify', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ title: title, message: message, url: url || '' })
      }).catch(function () {});
    } catch (e) { /* no-op */ }
  }

  /* ── Goal celebration (local animation only) ──────────────── */
  function onGoal(team, player, minute) {
    showGoalAnimation(team, player, minute);
  }

  /* ── Card celebration (local animation only) ──────────────── */
  function onCard(colour, team, player, minute) {
    showCardAnimation(colour, player || team, minute);
  }

  /* ── Sub celebration (local animation only) ───────────────── */
  function onSub(team, playerOn, playerOff, minute) {
    showSubAnimation(team, playerOn, playerOff, minute);
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
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
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
