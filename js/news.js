/* ============================================================
   GoalCurrent.live — News Manager
   ============================================================
   HOW TO USE:
   - To ADD news:    add a new {...} block at the TOP of GC_NEWS array
   - To REMOVE news: delete the {...} block
   - To EDIT news:   change the text inside any block
   - NEVER touch index.html for news changes!

   type options:
     "breaking"  → red scrolling ticker + red card at top of home page
     "normal"    → standard news card in Latest News section
   ============================================================ */

var GC_NEWS = [

  /* ── BREAKING NEWS ── add most urgent at the top ── */
  {
    type:  "breaking",
    emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    title: "England WC2026 Squad Announced!",
    body:  "Thomas Tuchel has named his official 26-man England squad for FIFA World Cup 2026. Captain Harry Kane leads the side. Big omissions: Cole Palmer and Phil Foden both LEFT OUT. Nine first-time tournament players included.",
    meta1: "📅 Today · 22 May 2026",
    meta2: "📍 Wembley Stadium, London",
    ticker: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 ENGLAND WC2026 SQUAD ANNOUNCED — Kane leads 26-man squad · Cole Palmer & Phil Foden LEFT OUT · Saka, Bellingham, Rice included · First match vs Croatia 17 Jun, Dallas"
  },

  /* ── NORMAL NEWS ── */
  {
    type:  "normal",
    emoji: "🏆",
    tag:   "UCL Final",
    tagColor: "#001489",
    title: "PSG vs Arsenal — UCL Final Preview",
    body:  "The biggest night in European club football. PSG vs Arsenal, Saturday 30 May, 17:00 UK. Puskás Aréna, Budapest.",
    bg:    "linear-gradient(135deg,#e3eaff,#cfe2ff)"
  },
  {
    type:  "normal",
    emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    tag:   "PL Final Day",
    tagColor: "#6a0080",
    title: "Arsenal — PL Champions 2025/26! Final Day Guide",
    body:  "All 10 Premier League matches kick off simultaneously on Sunday 24 May at 16:00 BST. Arsenal have already been crowned champions.",
    bg:    "linear-gradient(135deg,#f3e5f5,#ead5ff)"
  },
  {
    type:  "normal",
    emoji: "🌍",
    tag:   "World Cup 2026",
    tagColor: "#d97706",
    title: "England vs Croatia — WC2026 Group B Preview",
    body:  "England begin their World Cup 2026 campaign against Croatia on Wednesday 17 June in Dallas. Group B also includes Senegal and Iran.",
    bg:    "linear-gradient(135deg,#e8f5ff,#cce8ff)"
  }

];

/* ============================================================
   RENDERER — do not edit below this line
   ============================================================ */
(function() {

  /* ── helpers ── */
  function esc(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ── ticker ── */
  function buildTicker() {
    var items = GC_NEWS.filter(function(n){ return n.type === 'breaking'; });
    if (!items.length) return;

    /* inject keyframe once */
    if (!document.getElementById('gc-news-style')) {
      var s = document.createElement('style');
      s.id = 'gc-news-style';
      s.textContent = [
        '@keyframes gc-ticker-scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}',
        '@keyframes gc-brk-blink{0%,100%{opacity:1}50%{opacity:.3}}',
        '#gc-breaking-ticker{background:#cc0000;height:34px;display:flex;align-items:center;overflow:hidden;position:relative;z-index:9998;border-bottom:1px solid rgba(255,255,255,.15)}',
        '#gc-breaking-ticker .gc-tlbl{background:#fff;color:#cc0000;font-size:9px;font-weight:900;letter-spacing:1.5px;padding:0 10px;height:100%;display:flex;align-items:center;flex-shrink:0;white-space:nowrap;font-family:Verdana,sans-serif}',
        '#gc-breaking-ticker .gc-twrap{overflow:hidden;flex:1}',
        '#gc-breaking-ticker .gc-tinner{display:inline-flex;white-space:nowrap;animation:gc-ticker-scroll 28s linear infinite;font-size:11px;font-weight:700;color:#fff;padding-left:20px;font-family:Verdana,sans-serif}',
        '#gc-breaking-card{margin:12px 16px;background:#fff5f5;border:1.5px solid #ffcdd2;border-radius:16px;padding:14px;box-shadow:0 2px 12px rgba(204,0,0,.08);font-family:Verdana,Geneva,sans-serif}',
        '#gc-breaking-card .gc-bc-top{display:flex;align-items:center;gap:6px;margin-bottom:8px}',
        '#gc-breaking-card .gc-bc-dot{width:8px;height:8px;background:#cc0000;border-radius:50%;animation:gc-brk-blink 1s infinite;flex-shrink:0}',
        '#gc-breaking-card .gc-bc-lbl{font-size:9px;font-weight:900;letter-spacing:2px;color:#cc0000;text-transform:uppercase}',
        '#gc-breaking-card h3{font-size:15px;font-weight:800;color:#1c1c1e;margin:0 0 6px;line-height:1.3}',
        '#gc-breaking-card p{font-size:12px;color:#3c3c3e;line-height:1.6;margin:0}',
        '#gc-breaking-card .gc-bc-meta{display:flex;gap:12px;margin-top:10px;font-size:10px;color:#6e6e73;flex-wrap:wrap}'
      ].join('');
      document.head.appendChild(s);
    }

    /* build ticker text — repeat twice for seamless loop */
    var text = items.map(function(n){ return n.ticker || (n.emoji + ' ' + n.title); }).join('   •   ');
    var doubled = '&nbsp;' + esc(text) + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                  '&nbsp;' + esc(text) + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';

    /* inject ticker bar before canvas */
    var ticker = document.createElement('div');
    ticker.id  = 'gc-breaking-ticker';
    ticker.innerHTML = '<div class="gc-tlbl">&#128680; BREAKING</div>' +
                       '<div class="gc-twrap"><div class="gc-tinner">' + doubled + '</div></div>';

    var canvas = document.getElementById('gc-canvas');
    if (canvas) {
      canvas.parentNode.insertBefore(ticker, canvas);
    } else {
      document.body.insertBefore(ticker, document.body.firstChild);
    }

    /* inject breaking card — show only first breaking item */
    var n = items[0];
    var card = document.createElement('div');
    card.id  = 'gc-breaking-card';
    card.innerHTML =
      '<div class="gc-bc-top"><div class="gc-bc-dot"></div>' +
      '<div class="gc-bc-lbl">&#128680; Breaking News</div></div>' +
      '<h3>' + esc(n.emoji) + ' ' + esc(n.title) + '</h3>' +
      '<p>' + esc(n.body) + '</p>' +
      '<div class="gc-bc-meta">' +
        (n.meta1 ? '<span>' + esc(n.meta1) + '</span>' : '') +
        (n.meta2 ? '<span>' + esc(n.meta2) + '</span>' : '') +
      '</div>';

    /* insert breaking card at top of #gc-content when it exists */
    function tryInsertCard() {
      var content = document.getElementById('gc-content');
      if (content && !document.getElementById('gc-breaking-card')) {
        content.insertBefore(card, content.firstChild);
      }
    }
    tryInsertCard();
    /* also watch for gc-content being populated by JS */
    var ob = new MutationObserver(function(){ tryInsertCard(); });
    ob.observe(document.body, { childList:true, subtree:true });
    setTimeout(function(){ ob.disconnect(); }, 10000);
  }

  /* ── run after DOM ready ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildTicker);
  } else {
    buildTicker();
  }

})();
