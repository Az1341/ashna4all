/* ============================================================
   GoalCurrent.live — Final Day Celebration Popup
   Shows once on homepage with fireworks + predictions
   ============================================================ */
(function() {

  var STORAGE_KEY = 'gc_finalday_popup_24may';

  /* Only show once per session */
  if (sessionStorage.getItem(STORAGE_KEY)) return;

  function injectStyles() {
    var s = document.createElement('style');
    s.textContent = `
      @keyframes gc-firework-burst {
        0%   { transform: scale(0) rotate(0deg); opacity: 1; }
        100% { transform: scale(1.5) rotate(180deg); opacity: 0; }
      }
      @keyframes gc-popup-in {
        0%   { transform: scale(0.5) translateY(40px); opacity: 0; }
        70%  { transform: scale(1.05) translateY(-5px); opacity: 1; }
        100% { transform: scale(1) translateY(0); opacity: 1; }
      }
      @keyframes gc-popup-out {
        0%   { transform: scale(1); opacity: 1; }
        100% { transform: scale(0.8); opacity: 0; }
      }
      @keyframes gc-confetti-fall {
        0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
      @keyframes gc-pulse-ring {
        0%   { transform: scale(0.8); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
      }
      @keyframes gc-shimmer {
        0%   { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      @keyframes gc-bounce {
        0%,100% { transform: translateY(0); }
        50%      { transform: translateY(-8px); }
      }

      #gc-fd-overlay {
        position: fixed; inset: 0; z-index: 99999;
        background: rgba(0,0,0,0.75);
        backdrop-filter: blur(6px);
        display: flex; align-items: center; justify-content: center;
        padding: 16px;
      }

      #gc-fd-popup {
        background: #fff;
        border-radius: 24px;
        max-width: 560px; width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        -ms-overflow-style: none; scrollbar-width: none;
        box-shadow: 0 24px 60px rgba(0,0,0,0.3);
        animation: gc-popup-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        position: relative;
      }
      #gc-fd-popup::-webkit-scrollbar { display: none; }

      /* Hero section */
      #gc-fd-hero {
        background: linear-gradient(135deg, #38003c 0%, #5c0070 50%, #38003c 100%);
        border-radius: 24px 24px 0 0;
        padding: 28px 20px 22px;
        text-align: center;
        position: relative;
        overflow: hidden;
      }
      #gc-fd-hero::before {
        content: '';
        position: absolute; inset: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
        background-size: 200% 100%;
        animation: gc-shimmer 2s infinite;
      }

      .gc-fd-trophy {
        font-size: 52px;
        display: block;
        animation: gc-bounce 2s ease-in-out infinite;
        margin-bottom: 8px;
      }
      .gc-fd-hero-tag {
        font-size: 9px; font-weight: 700; letter-spacing: 2px;
        text-transform: uppercase; color: rgba(255,255,255,0.6);
        margin-bottom: 8px;
      }
      .gc-fd-hero-title {
        font-size: 22px; font-weight: 800; color: #fff;
        letter-spacing: -0.5px; line-height: 1.2;
        margin-bottom: 6px;
      }
      .gc-fd-hero-title em { color: #00ff85; font-style: normal; }
      .gc-fd-hero-sub {
        font-size: 12px; color: rgba(255,255,255,0.7);
        margin-bottom: 16px;
      }
      .gc-fd-kickoff {
        display: inline-flex; align-items: center; gap: 6px;
        background: rgba(255,255,255,0.15);
        border: 1px solid rgba(255,255,255,0.3);
        color: #fff; font-size: 13px; font-weight: 700;
        padding: 8px 18px; border-radius: 999px;
      }

      /* Body */
      #gc-fd-body { padding: 20px; }

      /* CTA buttons */
      .gc-fd-btns {
        display: grid; grid-template-columns: 1fr 1fr;
        gap: 8px; margin-bottom: 20px;
      }
      .gc-fd-btn {
        display: flex; align-items: center; justify-content: center;
        gap: 6px; padding: 11px 8px;
        border-radius: 12px; font-family: Verdana, sans-serif;
        font-size: 12px; font-weight: 700;
        text-decoration: none; border: none; cursor: pointer;
        transition: all 0.2s;
      }
      .gc-fd-btn:hover { transform: translateY(-2px); }
      .gc-fd-btn-live {
        background: linear-gradient(135deg, #dc2626, #ef4444);
        color: #fff;
        grid-column: 1 / -1;
        font-size: 14px; padding: 14px;
      }
      .gc-fd-btn-pl { background: #38003c; color: #fff; }
      .gc-fd-btn-news { background: #f2f2f7; color: #1c1c1e; }

      /* Predictions */
      .gc-fd-pred-title {
        font-size: 10px; font-weight: 700; letter-spacing: 1.5px;
        text-transform: uppercase; color: #6e6e73;
        margin-bottom: 12px; display: flex; align-items: center; gap: 8px;
      }
      .gc-fd-pred-title::after { content: ''; flex: 1; height: 1px; background: #e5e5ea; }

      .gc-fd-pred {
        display: flex; align-items: center;
        padding: 9px 0; border-bottom: 1px solid #f2f2f7;
        gap: 8px;
      }
      .gc-fd-pred:last-child { border-bottom: none; }
      .gc-fd-pred-teams {
        flex: 1; font-size: 12.5px; font-weight: 600; color: #1c1c1e;
      }
      .gc-fd-pred-teams small { display: block; font-size: 10px; color: #8e8e93; font-weight: 400; margin-top: 1px; }
      .gc-fd-pred-score {
        background: #38003c; color: #fff;
        font-size: 13px; font-weight: 800;
        padding: 4px 10px; border-radius: 8px;
        white-space: nowrap; flex-shrink: 0;
      }
      .gc-fd-pred-score.rel { background: #dc2626; }
      .gc-fd-pred-score.gold { background: #d97706; }

      .gc-fd-close {
        position: absolute; top: 12px; right: 14px;
        background: rgba(255,255,255,0.2); border: none;
        width: 28px; height: 28px; border-radius: 50%;
        font-size: 14px; color: #fff; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        z-index: 10; transition: background 0.18s;
      }
      .gc-fd-close:hover { background: rgba(255,255,255,0.35); }

      .gc-fd-disclaimer {
        font-size: 9.5px; color: #aeaeb2;
        text-align: center; margin-top: 14px; line-height: 1.5;
      }

      /* Confetti dots */
      .gc-confetti {
        position: fixed; pointer-events: none; z-index: 100000;
        top: 0; left: 0; width: 100%; height: 100%;
        overflow: hidden;
      }
      .gc-confetti-dot {
        position: absolute;
        width: 8px; height: 8px;
        border-radius: 2px;
        animation: gc-confetti-fall linear forwards;
      }
    `;
    document.head.appendChild(s);
  }

  function makeConfetti() {
    var container = document.createElement('div');
    container.className = 'gc-confetti';
    var colors = ['#38003c','#00ff85','#ffd700','#ef4444','#3b82f6','#f97316','#fff'];
    for (var i = 0; i < 60; i++) {
      var dot = document.createElement('div');
      dot.className = 'gc-confetti-dot';
      dot.style.cssText = [
        'left:' + Math.random()*100 + '%',
        'top:-10px',
        'background:' + colors[Math.floor(Math.random()*colors.length)],
        'animation-duration:' + (2 + Math.random()*3) + 's',
        'animation-delay:' + (Math.random()*2) + 's',
        'width:' + (6+Math.random()*8) + 'px',
        'height:' + (6+Math.random()*8) + 'px',
        'border-radius:' + (Math.random()>0.5?'50%':'2px')
      ].join(';');
      container.appendChild(dot);
    }
    document.body.appendChild(container);
    setTimeout(function(){ container.remove(); }, 5000);
  }

  function closePopup() {
    var overlay = document.getElementById('gc-fd-overlay');
    if (!overlay) return;
    overlay.style.transition = 'opacity 0.3s';
    overlay.style.opacity = '0';
    setTimeout(function(){ overlay.remove(); }, 300);
  }

  function goToPage(page) {
    closePopup();
    /* Trigger app.js navigation if on homepage */
    var btn = document.querySelector('.gc-topnav-btn[data-page="' + page + '"]');
    if (btn) { btn.click(); return; }
    var sbBtn = document.querySelector('.sb-nav-link[data-page="' + page + '"]');
    if (sbBtn) sbBtn.click();
  }

  function build() {
    injectStyles();
    makeConfetti();
    sessionStorage.setItem(STORAGE_KEY, '1');

    var overlay = document.createElement('div');
    overlay.id = 'gc-fd-overlay';
    overlay.innerHTML = `
      <div id="gc-fd-popup">
        <button class="gc-fd-close" onclick="document.getElementById('gc-fd-overlay').remove()">✕</button>

        <div id="gc-fd-hero">
          <span class="gc-fd-trophy">🏆</span>
          <div class="gc-fd-hero-tag">Premier League 2025/26 · Gameweek 38</div>
          <div class="gc-fd-hero-title">It's <em>Final Day!</em> 🎉</div>
          <div class="gc-fd-hero-sub">Arsenal are Champions · Relegation battle · All 10 matches</div>
          <div class="gc-fd-kickoff">🕓 All kick off at 16:00 BST today</div>
        </div>

        <div id="gc-fd-body">
          <div class="gc-fd-btns">
            <button class="gc-fd-btn gc-fd-btn-live" onclick="document.getElementById('gc-fd-overlay').remove();var b=document.querySelector('[data-page=live]');if(b)b.click();">
              🔴 Watch Live Scores Now →
            </button>
            <a href="/premier-league/fixtures/" class="gc-fd-btn gc-fd-btn-pl" onclick="closePopup()">
              📅 Today's Fixtures
            </a>
            <button class="gc-fd-btn gc-fd-btn-news" onclick="document.getElementById('gc-fd-overlay').remove();var b=document.querySelector('[data-page=news]');if(b)b.click();">
              📰 Latest News
            </button>
          </div>

          <div class="gc-fd-pred-title">🔮 GoalCurrent Score Predictions — GW38</div>

          <div class="gc-fd-pred">
            <div class="gc-fd-pred-teams">Brighton vs Man United<small>Amex Stadium · 16:00 BST</small></div>
            <div class="gc-fd-pred-score">3 – 1</div>
          </div>
          <div class="gc-fd-pred">
            <div class="gc-fd-pred-teams">Burnley vs Wolves<small>Turf Moor · 16:00 BST</small></div>
            <div class="gc-fd-pred-score">1 – 1</div>
          </div>
          <div class="gc-fd-pred">
            <div class="gc-fd-pred-teams">Crystal Palace vs Arsenal 🏆<small>Selhurst Park · 16:00 BST</small></div>
            <div class="gc-fd-pred-score gold">0 – 3</div>
          </div>
          <div class="gc-fd-pred">
            <div class="gc-fd-pred-teams">Fulham vs Newcastle<small>Craven Cottage · 16:00 BST</small></div>
            <div class="gc-fd-pred-score">1 – 2</div>
          </div>
          <div class="gc-fd-pred">
            <div class="gc-fd-pred-teams">Liverpool vs Brentford<small>Anfield · 16:00 BST</small></div>
            <div class="gc-fd-pred-score">2 – 2</div>
          </div>
          <div class="gc-fd-pred">
            <div class="gc-fd-pred-teams">Man City vs Aston Villa<small>Etihad Stadium · 16:00 BST</small></div>
            <div class="gc-fd-pred-score">2 – 1</div>
          </div>
          <div class="gc-fd-pred">
            <div class="gc-fd-pred-teams">Nott'm Forest vs Bournemouth<small>City Ground · 16:00 BST</small></div>
            <div class="gc-fd-pred-score">1 – 1</div>
          </div>
          <div class="gc-fd-pred">
            <div class="gc-fd-pred-teams">Sunderland vs Chelsea<small>Stadium of Light · 16:00 BST</small></div>
            <div class="gc-fd-pred-score">1 – 2</div>
          </div>
          <div class="gc-fd-pred">
            <div class="gc-fd-pred-teams">Tottenham vs Everton ⚠️<small>Spurs Stadium · 16:00 BST</small></div>
            <div class="gc-fd-pred-score rel">1 – 1</div>
          </div>
          <div class="gc-fd-pred">
            <div class="gc-fd-pred-teams">West Ham vs Leeds United 🔴<small>London Stadium · 16:00 BST</small></div>
            <div class="gc-fd-pred-score rel">1 – 2</div>
          </div>

          <div class="gc-fd-disclaimer">
            🔮 Predictions sourced from LiveScore.com · For entertainment only · Not betting advice<br>
            Verified fixtures from official Premier League website
          </div>
        </div>
      </div>
    `;

    /* Close on backdrop click */
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closePopup();
    });

    document.body.appendChild(overlay);
  }

  /* Show after 1.5 seconds */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(build, 1500); });
  } else {
    setTimeout(build, 1500);
  }

})();
