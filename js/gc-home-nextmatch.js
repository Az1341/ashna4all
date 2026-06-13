/**
 * gc-home-nextmatch.js — GoalCurrent.live
 * ════════════════════════════════════════════════════════════════
 * Fully dynamic "Next Match / Live Now / Latest Result" bar.
 * Replaces ANY static "FIFA World Cup 2026 starts..." banner.
 *
 * HOW IT WORKS:
 *   1. Reads WC26.schedule (worldcup-data.js) to find next/live/last match.
 *   2. Polls /api/scores every 30s for live status + goals from api-football.
 *   3. Injects a self-updating bar above #gc-matches (or body if not found).
 *   4. No hardcoded teams, times, scores, or match info anywhere.
 *
 * LOAD ORDER:  worldcup-data.js → gc-home-nextmatch.js (defer)
 * ════════════════════════════════════════════════════════════════
 */
(function () {
  'use strict';

  /* ── Inject styles once ──────────────────────────────────────────────────── */
  var STYLE_ID = 'gc-nextmatch-style';
  if (!document.getElementById(STYLE_ID)) {
    var css =
      '#gc-nextmatch-bar{display:flex;align-items:center;gap:14px;' +
        'background:linear-gradient(135deg,#001a4d 0%,#003fb8 60%,#0057e7 100%);' +
        'border-radius:14px;padding:13px 16px;margin-bottom:14px;' +
        'box-shadow:0 6px 24px rgba(0,27,80,.32);cursor:default;position:relative;overflow:hidden}' +
      '#gc-nextmatch-bar:before{content:"";position:absolute;inset:0;' +
        'background:radial-gradient(ellipse at 80% 50%,rgba(255,255,255,.06) 0%,transparent 70%);pointer-events:none}' +
      '.gcnm-pill{flex-shrink:0;border-radius:999px;padding:5px 12px;' +
        'font-family:"Barlow Condensed",sans-serif;font-size:.78rem;font-weight:800;' +
        'letter-spacing:.06em;white-space:nowrap}' +
      '.gcnm-pill.live{background:#ef4444;color:#fff;animation:gcnm-pulse 1.4s infinite}' +
      '.gcnm-pill.next{background:#f59e0b;color:#0f172a}' +
      '.gcnm-pill.result{background:#10b981;color:#fff}' +
      '@keyframes gcnm-pulse{0%,100%{opacity:1}50%{opacity:.6}}' +
      '.gcnm-body{flex:1;min-width:0;color:#fff}' +
      '.gcnm-matchup{font-family:"Barlow Condensed",sans-serif;font-size:1.05rem;' +
        'font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.2}' +
      '.gcnm-matchup .gcnm-score{color:#f59e0b;margin:0 6px}' +
      '.gcnm-meta{font-size:.7rem;color:rgba(255,255,255,.65);font-weight:600;margin-top:3px}' +
      '.gcnm-countdown{flex-shrink:0;display:flex;gap:3px;align-items:center;direction:ltr}' +
      '.gcnm-box{background:rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.2);' +
        'border-radius:6px;padding:4px 7px;text-align:center;min-width:38px}' +
      '.gcnm-num{font-family:"Barlow Condensed",sans-serif;font-size:1.1rem;' +
        'font-weight:800;color:#fff;line-height:1;direction:ltr}' +
      '.gcnm-lbl{font-size:.5rem;text-transform:uppercase;color:rgba(255,255,255,.5);margin-top:1px}' +
      '.gcnm-sep{font-size:.9rem;font-weight:800;color:rgba(255,255,255,.35);' +
        'margin-bottom:4px;align-self:center}' +
      '.gcnm-link{flex-shrink:0;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);' +
        'border-radius:8px;padding:7px 12px;color:#fff;font-family:"Barlow Condensed",sans-serif;' +
        'font-size:.78rem;font-weight:700;text-decoration:none;white-space:nowrap;transition:background .15s}' +
      '.gcnm-link:hover{background:rgba(255,255,255,.22)}' +
      '@media(max-width:600px){' +
        '.gcnm-countdown{display:none}' +
        '.gcnm-matchup{font-size:.9rem}' +
      '}';
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = css;
    document.head.appendChild(s);
  }

  /* ── Helpers ─────────────────────────────────────────────────────────────── */
  function pad(n) { return String(n).padStart(2, '0'); }
  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function fmtTime(d) {
    if (window.GC_DateTime && GC_DateTime.formatMatchCardTime)
      return GC_DateTime.formatMatchCardTime(d.toISOString ? d.toISOString() : d);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  function fmtDate(d) {
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  /* ── Pick: live → next upcoming → latest result ─────────────────────────── */
  function pick() {
    if (!window.WC26 || !Array.isArray(WC26.schedule)) return null;
    var now  = Date.now();
    var sched = WC26.schedule.slice().sort(function (a, b) {
      return new Date(a.utc) - new Date(b.utc);
    });
    var live = null, next = null, last = null;
    for (var i = 0; i < sched.length; i++) {
      var m = sched[i];
      var t = new Date(m.utc).getTime();
      if (m.status === 'FT' || m.status === 'AET' || m.status === 'PEN') {
        last = m; continue;
      }
      if (t <= now && now < t + 130 * 60000) { live = m; break; }
      if (t > now) { next = m; break; }
    }
    return { live: live, next: next, last: last };
  }

  /* ── Countdown tick ──────────────────────────────────────────────────────── */
  var _timer = null;
  function stopTimer() { if (_timer) { clearInterval(_timer); _timer = null; } }
  function startCountdown(targetMs) {
    stopTimer();
    function tick() {
      var diff = targetMs - Date.now();
      if (diff < 0) { render(); return; }
      var h  = Math.floor(diff / 3600000);
      var mn = Math.floor(diff % 3600000 / 60000);
      var s  = Math.floor(diff % 60000 / 1000);
      var el = document.getElementById('gc-nextmatch-bar');
      if (!el) return;
      var nh = el.querySelector('.gcnm-h');
      var nm = el.querySelector('.gcnm-m');
      var ns = el.querySelector('.gcnm-s');
      if (nh) nh.textContent = pad(h);
      if (nm) nm.textContent = pad(mn);
      if (ns) ns.textContent = pad(s);
    }
    tick();
    _timer = setInterval(tick, 1000);
  }

  /* ── API live overlay ────────────────────────────────────────────────────── */
  var _apiCache = {}; /* id → api fixture object */

  function pollApi(matchId) {
    var today = (function () {
      if (window.GC_DateTime && GC_DateTime.getTodayLocalDateKey)
        return GC_DateTime.getTodayLocalDateKey();
      var d = new Date();
      return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    })();
    fetch('/api/scores?date=' + today, { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : { matches: [] }; })
      .then(function (json) {
        var matches = json.matches || [];
        matches.forEach(function (am) { _apiCache[am.id] = am; });
        render();
      })
      .catch(function () {});
  }

  /* ── Build bar HTML ──────────────────────────────────────────────────────── */
  function buildBar(state) {
    var p   = state.p;
    var api = state.api;
    var m   = p.live || p.next || p.last;
    if (!m) return '';

    var ko   = new Date(m.utc);
    var pill = '', matchupHtml = '', metaHtml = '', rightHtml = '';

    if (p.live) {
      /* ── LIVE ── */
      var apiStatus   = api && api.status && api.status.short || '';
      var apiElapsed  = api && api.status && api.status.elapsed || null;
      var gH = api && api.goals && api.goals.home != null ? api.goals.home : (m.homeScore != null ? m.homeScore : '?');
      var gA = api && api.goals && api.goals.away != null ? api.goals.away : (m.awayScore != null ? m.awayScore : '?');
      var minTxt = apiStatus === 'HT' ? 'HT' : (apiElapsed ? apiElapsed + "'" : '●');
      pill = '<span class="gcnm-pill live">🔴 LIVE ' + esc(minTxt) + '</span>';
      matchupHtml = esc(m.home) + ' <span class="gcnm-score">' + gH + ' – ' + gA + '</span> ' + esc(m.away);
      metaHtml = 'Group ' + esc(m.group || '–') + ' · ' + esc(m.venue || '') + ' · 📺 ' + esc(m.ukBroadcaster || 'TBC');
      rightHtml = '<a class="gcnm-link" href="/live/">🔴 Follow Live</a>';

    } else if (p.next) {
      /* ── NEXT MATCH ── */
      pill = '<span class="gcnm-pill next">⏭ NEXT MATCH</span>';
      matchupHtml = esc(m.home) + ' <span class="gcnm-score">vs</span> ' + esc(m.away);
      metaHtml = fmtDate(ko) + ' · ' + fmtTime(ko) + ' · Group ' + esc(m.group || '–') + ' · 📺 ' + esc(m.ukBroadcaster || 'TBC');
      var tgt = ko.getTime();
      var diff = tgt - Date.now();
      var hv = Math.floor(diff / 3600000);
      var mv = Math.floor(diff % 3600000 / 60000);
      var sv = Math.floor(diff % 60000 / 1000);
      rightHtml =
        '<div class="gcnm-countdown">' +
          '<div class="gcnm-box"><div class="gcnm-num gcnm-h">' + pad(hv) + '</div><div class="gcnm-lbl">Hrs</div></div>' +
          '<span class="gcnm-sep">:</span>' +
          '<div class="gcnm-box"><div class="gcnm-num gcnm-m">' + pad(mv) + '</div><div class="gcnm-lbl">Min</div></div>' +
          '<span class="gcnm-sep">:</span>' +
          '<div class="gcnm-box"><div class="gcnm-num gcnm-s">' + pad(sv) + '</div><div class="gcnm-lbl">Sec</div></div>' +
        '</div>' +
        '<a class="gcnm-link" href="/worldcup2026/fixtures/">📅 Fixtures</a>';

    } else if (p.last) {
      /* ── LATEST RESULT ── */
      pill = '<span class="gcnm-pill result">🏁 LATEST RESULT</span>';
      matchupHtml = esc(m.home) + ' <span class="gcnm-score">' + m.homeScore + ' – ' + m.awayScore + '</span> ' + esc(m.away);
      metaHtml = 'Full Time · ' + fmtDate(ko) + ' · Group ' + esc(m.group || '–');
      rightHtml = '<a class="gcnm-link" href="/worldcup2026/standings/">📊 Standings</a>';
    }

    return (
      '<div id="gc-nextmatch-bar">' +
        pill +
        '<div class="gcnm-body">' +
          '<div class="gcnm-matchup">' + matchupHtml + '</div>' +
          '<div class="gcnm-meta">' + metaHtml + '</div>' +
        '</div>' +
        rightHtml +
      '</div>'
    );
  }

  /* ── Render / update ─────────────────────────────────────────────────────── */
  function render() {
    var p = pick();
    if (!p) return;
    var m = p.live || p.next || p.last;
    if (!m) return;

    /* Get API data for live match if we have it cached */
    var api = null;
    Object.keys(_apiCache).forEach(function (apiId) {
      var am = _apiCache[apiId];
      var ah = String(am.home && am.home.name || '').toLowerCase();
      var aa = String(am.away && am.away.name || '').toLowerCase();
      var sh = String(m.home || '').toLowerCase();
      var sa = String(m.away || '').toLowerCase();
      if (ah.indexOf(sh.slice(0, 5)) !== -1 || aa.indexOf(sa.slice(0, 5)) !== -1) api = am;
    });

    var html = buildBar({ p: p, api: api });

    /* Find insertion point — before the Live Match Centre section label */
    var existing = document.getElementById('gc-nextmatch-bar');
    if (existing) {
      /* Already mounted — update inner content only to avoid DOM thrash */
      var tmp = document.createElement('div');
      tmp.innerHTML = html;
      var newBar = tmp.firstElementChild;
      if (newBar) {
        /* Swap pill + matchup + meta text without touching countdown boxes */
        var oldPill = existing.querySelector('.gcnm-pill');
        var newPill = newBar.querySelector('.gcnm-pill');
        if (oldPill && newPill) oldPill.outerHTML = newPill.outerHTML;
        var oldBody = existing.querySelector('.gcnm-body');
        var newBody = newBar.querySelector('.gcnm-body');
        if (oldBody && newBody) oldBody.innerHTML = newBody.innerHTML;
      }
    } else {
      /* First mount — insert before #gc-section-label or before #gc-matches */
      var anchor = document.getElementById('gc-section-label') ||
                   document.getElementById('gc-matches') ||
                   document.querySelector('.gc-content');
      if (!anchor) return;
      var wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      var bar = wrapper.firstElementChild;
      if (!bar) return;
      if (anchor.id === 'gc-matches' || anchor.id === 'gc-section-label') {
        anchor.parentNode.insertBefore(bar, anchor);
      } else {
        anchor.prepend(bar);
      }
    }

    /* Start countdown if next match mode */
    if (p.next) {
      startCountdown(new Date(m.utc).getTime());
    } else {
      stopTimer();
    }
  }

  /* ── Boot ────────────────────────────────────────────────────────────────── */
  function boot() {
    if (!window.WC26 || !Array.isArray(WC26.schedule)) {
      /* worldcup-data.js not ready yet — retry */
      setTimeout(boot, 50);
      return;
    }
    render();

    /* Poll API every 30s for live score updates */
    function poll() {
      var p = pick();
      if (!p) return;
      var m = p.live || p.next;
      if (m) pollApi(m.id);
    }
    poll();
    setInterval(function () { render(); poll(); }, 30000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
