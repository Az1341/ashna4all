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

   Optional fields for any news item:
     source_url:   "https://..."   → "Read Full Story" button linking to original article
     source_label: "BBC Sport"     → name shown on the button
     video_id:     "YouTube_ID"    → embeds YouTube video directly on your site
   ============================================================ */

var GC_NEWS = [

  /* ── BREAKING NEWS ── add most urgent at the top ── */
  {
    type:         "breaking",
    emoji:        "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    title:        "England WC2026 Squad Announced!",
    body:         "Thomas Tuchel has named his official 26-man England squad for FIFA World Cup 2026. Captain Harry Kane leads the side. Big omissions: Cole Palmer and Phil Foden both LEFT OUT. Nine first-time tournament players included.",
    meta1:        "📅 Today · 22 May 2026",
    meta2:        "📍 Wembley Stadium, London",
    ticker:       "🏴󠁧󠁢󠁥󠁮󠁧󠁿 ENGLAND WC2026 SQUAD ANNOUNCED — Kane leads 26-man squad · Cole Palmer & Phil Foden LEFT OUT · Saka, Bellingham, Rice included · First match vs Croatia 17 Jun, Dallas",
    source_url:   "https://www.englandfootball.com/articles/2026/May/22/england-mens-world-cup-2026-squad-named-by-thomas-tuchel-20262205",
    source_label: "England Football FA",
    video_id:     "2umUvkWzzxw"
  },

  /* ── NORMAL NEWS ── */
  {
    type:         "normal",
    emoji:        "🏆",
    tag:          "UCL Final",
    tagColor:     "#001489",
    title:        "PSG vs Arsenal — UCL Final Preview",
    body:         "The biggest night in European club football. PSG vs Arsenal, Saturday 30 May, 17:00 UK. Puskás Aréna, Budapest.",
    bg:           "linear-gradient(135deg,#e3eaff,#cfe2ff)",
    source_url:   "https://www.bbc.co.uk/sport/football/articles/champions-league-final",
    source_label: "BBC Sport"
  },
  {
    type:         "normal",
    emoji:        "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    tag:          "PL Final Day",
    tagColor:     "#6a0080",
    title:        "Arsenal — PL Champions 2025/26! Final Day Guide",
    body:         "All 10 Premier League matches kick off simultaneously on Sunday 24 May at 16:00 BST. Arsenal have already been crowned champions.",
    bg:           "linear-gradient(135deg,#f3e5f5,#ead5ff)",
    source_url:   "https://www.premierleague.com",
    source_label: "Premier League"
  },
  {
    type:         "normal",
    emoji:        "🌍",
    tag:          "World Cup 2026",
    tagColor:     "#d97706",
    title:        "England vs Croatia — WC2026 Group B Preview",
    body:         "England begin their World Cup 2026 campaign against Croatia on Wednesday 17 June in Dallas. Group B also includes Senegal and Iran.",
    bg:           "linear-gradient(135deg,#e8f5ff,#cce8ff)",
    source_url:   "https://www.skysports.com/football/news/11095/13543070/world-cup-2026-squad-lists-england-scotland-brazil-usa-spain-france-germany-netherlands-argentina-portugal-and-more",
    source_label: "Sky Sports"
  }

];

/* ============================================================
   RENDERER — do not edit below this line
   ============================================================ */
(function () {

  /* ── helpers ── */
  function esc(s) {
    return String(s || '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ── inject styles once ── */
  function injectStyles() {
    if (document.getElementById('gc-news-style')) return;
    var s = document.createElement('style');
    s.id = 'gc-news-style';
    s.textContent = [
      /* ticker */
      '@keyframes gc-ticker-scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}',
      '@keyframes gc-brk-blink{0%,100%{opacity:1}50%{opacity:.3}}',
      '#gc-breaking-ticker{background:#cc0000;height:34px;display:flex;align-items:center;overflow:hidden;position:relative;z-index:9998;border-bottom:1px solid rgba(255,255,255,.15)}',
      '#gc-breaking-ticker .gc-tlbl{background:#fff;color:#cc0000;font-size:9px;font-weight:900;letter-spacing:1.5px;padding:0 10px;height:100%;display:flex;align-items:center;flex-shrink:0;white-space:nowrap;font-family:Verdana,sans-serif}',
      '#gc-breaking-ticker .gc-twrap{overflow:hidden;flex:1}',
      '#gc-breaking-ticker .gc-tinner{display:inline-flex;white-space:nowrap;animation:gc-ticker-scroll 28s linear infinite;font-size:11px;font-weight:700;color:#fff;padding-left:20px;font-family:Verdana,sans-serif}',
      /* breaking card */
      '#gc-breaking-card{margin:12px 16px;background:rgba(255,255,255,0.82);border:1.5px solid rgba(37,99,235,0.2);border-radius:16px;padding:14px;box-shadow:0 2px 12px rgba(37,99,235,0.08);font-family:Verdana,Geneva,sans-serif}',
      '#gc-breaking-card .gc-bc-top{display:flex;align-items:center;gap:6px;margin-bottom:8px}',
      '#gc-breaking-card .gc-bc-dot{width:8px;height:8px;background:#cc0000;border-radius:50%;animation:gc-brk-blink 1s infinite;flex-shrink:0}',
      '#gc-breaking-card .gc-bc-lbl{font-size:9px;font-weight:900;letter-spacing:2px;color:#cc0000;text-transform:uppercase}',
      '#gc-breaking-card h3{font-size:15px;font-weight:800;color:#1c1c1e;margin:0 0 6px;line-height:1.3}',
      '#gc-breaking-card p{font-size:12px;color:#3c3c3e;line-height:1.6;margin:0}',
      '#gc-breaking-card .gc-bc-meta{display:flex;gap:12px;margin-top:10px;font-size:10px;color:#6e6e73;flex-wrap:wrap}',
      /* source button */
      '.gc-news-source-btn{display:inline-flex;align-items:center;gap:6px;margin-top:12px;background:#1c1c1e;color:#fff;font-family:Verdana,sans-serif;font-size:11px;font-weight:700;padding:7px 14px;border-radius:20px;text-decoration:none;transition:opacity .2s}',
      '.gc-news-source-btn:hover{opacity:.85}',
      '.gc-news-source-btn.blue{background:#2563eb}',
      /* video embed */
      '.gc-news-video{margin-top:14px;width:100%;max-width:420px;height:236px;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,.12)}',
      '.gc-news-video iframe{width:100%;height:100%;border:none;border-radius:12px;display:block}'
    ].join('');
    document.head.appendChild(s);
  }

  /* ── build ticker ── */
  function buildTicker(items) {
    var text = items.map(function(n){ return n.ticker || (n.emoji + ' ' + n.title); }).join('   \u2022   ');
    var doubled = '\u00a0' + text + '\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0' +
                  '\u00a0' + text + '\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0';

    var ticker = document.createElement('div');
    ticker.id  = 'gc-breaking-ticker';
    ticker.innerHTML = '<div class="gc-tlbl">&#128680; BREAKING</div>' +
                       '<div class="gc-twrap"><div class="gc-tinner">' + esc(doubled) + '</div></div>';

    var canvas = document.getElementById('gc-canvas');
    if (canvas) canvas.parentNode.insertBefore(ticker, canvas);
    else document.body.insertBefore(ticker, document.body.firstChild);
  }

  /* ── build breaking card ── */
  function buildBreakingCard(n) {
    var card = document.createElement('div');
    card.id  = 'gc-breaking-card';

    /* source button HTML */
    var sourceBtn = '';
    if (n.source_url) {
      sourceBtn = '<a class="gc-news-source-btn blue" href="' + esc(n.source_url) + '" target="_blank" rel="noopener">' +
                  '&#128240; Read Full Story on ' + esc(n.source_label || 'Source') + ' &rarr;</a>';
    }

    /* video embed HTML */
    var videoHtml = '';
    if (n.video_id) {
      videoHtml = '<div class="gc-news-video">' +
                  '<iframe src="https://www.youtube.com/embed/' + esc(n.video_id) + '?rel=0&modestbranding=1" ' +
                  'title="' + esc(n.title) + '" allowfullscreen loading="lazy"></iframe>' +
                  '</div>';
    }

    card.innerHTML =
      '<div class="gc-bc-top"><div class="gc-bc-dot"></div>' +
      '<div class="gc-bc-lbl">&#128680; Breaking News</div></div>' +
      '<h3>' + esc(n.emoji) + ' ' + esc(n.title) + '</h3>' +
      '<p>' + esc(n.body) + '</p>' +
      '<div class="gc-bc-meta">' +
        (n.meta1 ? '<span>' + esc(n.meta1) + '</span>' : '') +
        (n.meta2 ? '<span>' + esc(n.meta2) + '</span>' : '') +
      '</div>' +
      videoHtml +
      sourceBtn;

    return card;
  }

  /* ── insert card into #gc-content ── */
  function insertCard(card) {
    var content = document.getElementById('gc-content');
    if (content && !document.getElementById('gc-breaking-card')) {
      content.insertBefore(card, content.firstChild);
      return true;
    }
    return false;
  }

  /* ── main ── */
  function init() {
    injectStyles();

    var breaking = GC_NEWS.filter(function(n){ return n.type === 'breaking'; });
    if (!breaking.length) return;

    /* ticker */
    if (!document.getElementById('gc-breaking-ticker')) {
      buildTicker(breaking);
    }

    /* breaking card — try now, then watch for gc-content */
    var card = buildBreakingCard(breaking[0]);
    if (!insertCard(card)) {
      var ob = new MutationObserver(function() {
        if (insertCard(card)) ob.disconnect();
      });
      ob.observe(document.body, { childList: true, subtree: true });
      setTimeout(function(){ ob.disconnect(); }, 30000);
    }
  }

  /* Wait for app.js to fully render gc-content before inserting news */
  function delayedInit() {
    setTimeout(function() {
      init();
    }, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', delayedInit);
  } else {
    delayedInit();
  }

})();
