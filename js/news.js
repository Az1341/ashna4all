/* ============================================================
   GoalCurrent.live — News Manager v3 (Magazine Carousel Style)
   ============================================================
   HOW TO USE:
   - Add news at TOP of GC_NEWS array
   - type: "breaking" = red ticker + breaking card
   - type: "normal"   = swipeable magazine card in carousel
   - image_url: background photo for the card
   - video_id: YouTube embed (shows in breaking card only)
   - source_url + source_label: Read button link
   ============================================================ */

var GC_NEWS = [

  /* ── BREAKING ── */
  {
    type:         "breaking",
    emoji:        "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    title:        "England WC2026 Squad Announced!",
    body:         "Thomas Tuchel names 26-man squad. Kane captains. Cole Palmer and Phil Foden LEFT OUT. Nine first-time tournament players included.",
    meta1:        "📅 22 May 2026",
    meta2:        "📍 Wembley Stadium",
    ticker:       "🏴󠁧󠁢󠁥󠁮󠁧󠁿 ENGLAND WC2026 SQUAD — Kane leads · Cole Palmer & Phil Foden LEFT OUT · Saka, Bellingham, Rice in · First match vs Croatia 17 Jun, Dallas",
    source_url:   "https://www.englandfootball.com/articles/2026/May/22/england-mens-world-cup-2026-squad-named-by-thomas-tuchel-20262205",
    source_label: "England FA",
    video_id:     "2umUvkWzzxw"
  },

  /* ── NORMAL — swipe carousel ── */
  {
    type:      "normal",
    tag:       "UCL FINAL",
    tagColor:  "#001489",
    emoji:     "⭐",
    title:     "Dembele Fit for UCL Final vs Arsenal",
    body:      "PSG star confirms he will play despite calf scare. 'I have no doubt about it.'",
    meta:      "beIN Sports · 1h ago",
    image_url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
    source_url:"https://psgtalk.com/2026/05/psg-good-news-ucl-final-arsenal/",
    source_label:"PSG Talk"
  },
  {
    type:      "normal",
    tag:       "UCL FINAL",
    tagColor:  "#001489",
    emoji:     "⭐",
    title:     "Luis Enrique: Everyone is Ready for Budapest",
    body:      "PSG boss previews UCL Final vs Arsenal. 'Working while having fun — that is the most important part.'",
    meta:      "Tribuna · 2h ago",
    image_url: "https://images.unsplash.com/photo-1487466365202-1afdb86c764e?w=800&q=80",
    source_url:"https://tribuna.com/en/news/2026-05-20-everyone-is-ready-psg-manager-luis-enrique-previews-ucl-final-against-arsenal/",
    source_label:"Tribuna"
  },
  {
    type:      "normal",
    tag:       "UCL FINAL",
    tagColor:  "#001489",
    emoji:     "🎵",
    title:     "The Killers to Headline UCL Final Kick Off Show",
    body:      "The Killers headline the Budapest Kick Off Show with Sir David Beckham. 30 May · 17:00 UK · Puskas Arena.",
    meta:      "UEFA.com · 2 weeks ago",
    image_url: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
    source_url:"https://www.uefa.com/uefachampionsleague/match/2047742--paris-vs-arsenal/final/",
    source_label:"UEFA"
  },
  {
    type:      "normal",
    tag:       "PL FINAL DAY",
    tagColor:  "#37003c",
    emoji:     "🏆",
    title:     "Arsenal Champions! Relegation Goes to Final Day",
    body:      "Arsenal crowned PL champions for first time in 22 years. Tottenham vs West Ham — one goes down on Sunday.",
    meta:      "Sky Sports · Today",
    image_url: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
    source_url:"https://www.skysports.com/football/news/11095/13546159/premier-league-26-27-season-start-date-fixture-release-final-day-live-sky-sports-games-and-match-schedule",
    source_label:"Sky Sports"
  },
  {
    type:      "normal",
    tag:       "WORLD CUP 2026",
    tagColor:  "#d97706",
    emoji:     "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    title:     "England's Big Omissions — Who Missed Out?",
    body:      "Cole Palmer, Phil Foden, Trent Alexander-Arnold and Harry Maguire all LEFT OUT of Tuchel's 26-man squad.",
    meta:      "beIN Sports · 1h ago",
    image_url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80",
    source_url:"https://www.espn.com/soccer/story/_/id/48841808/england-2026-world-cup-squad-foden-palmer-toney-magure-madueke-watkins-kane-stones-alexander-arnold",
    source_label:"ESPN"
  },
  {
    type:      "normal",
    tag:       "WORLD CUP 2026",
    tagColor:  "#d97706",
    emoji:     "🇧🇷",
    title:     "Neymar Back! Brazil Name WC Squad Under Ancelotti",
    body:      "Neymar makes Brazil's World Cup squad alongside Vinicius Jr, Raphinha and Gabriel Martinelli. Brazil face Morocco 13 June.",
    meta:      "Football365 · 4 days ago",
    image_url: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&q=80",
    source_url:"https://www.football365.com/news/2026-world-cup-squads-full-48-teams-every-player",
    source_label:"Football365"
  },
  {
    type:      "normal",
    tag:       "WORLD CUP 2026",
    tagColor:  "#d97706",
    emoji:     "🇭🇷",
    title:     "Modric, 40, Named in Croatia WC2026 Squad",
    body:      "Luka Modric, at 40 years old, has been included in Croatia's World Cup squad. Bosnia's Edin Dzeko, also 40, makes the cut too.",
    meta:      "Yahoo Sports · Today",
    image_url: "https://images.unsplash.com/photo-1551958219-acbc630e2914?w=800&q=80",
    source_url:"https://sports.yahoo.com/articles/world-cup-2026-every-nation39s-squad-as-they-are-announced-182620826.html",
    source_label:"Yahoo Sports"
  },
  {
    type:      "normal",
    tag:       "WORLD CUP 2026",
    tagColor:  "#d97706",
    emoji:     "🇿🇦",
    title:     "South Africa Name WC Preliminary Squad",
    body:      "Bafana Bafana reveal their squad ahead of June 11 opener vs Mexico at Estadio Azteca — a replay of the 2010 World Cup opener.",
    meta:      "Yahoo Sports · Today",
    image_url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    source_url:"https://sports.yahoo.com/soccer/live/2026-world-cup-news-live-tracker-squad-announcements-injuries-key-storylines-and-latest-updates-200000056.html",
    source_label:"Yahoo Sports"
  }
];

/* ============================================================
   RENDERER
   ============================================================ */
(function () {

  function esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

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
      '#gc-breaking-card{margin:12px 16px;background:#ffffff;border:1.5px solid #d1d9f0;border-radius:16px;padding:14px;box-shadow:0 4px 16px rgba(100,160,220,0.12);font-family:Verdana,Geneva,sans-serif}',
      '#gc-breaking-card .gc-bc-top{display:flex;align-items:center;gap:6px;margin-bottom:8px}',
      '#gc-breaking-card .gc-bc-dot{width:8px;height:8px;background:#cc0000;border-radius:50%;animation:gc-brk-blink 1s infinite;flex-shrink:0}',
      '#gc-breaking-card .gc-bc-lbl{font-size:9px;font-weight:900;letter-spacing:2px;color:#cc0000;text-transform:uppercase}',
      '#gc-breaking-card h3{font-size:15px;font-weight:800;color:#1c1c1e;margin:0 0 6px;line-height:1.3}',
      '#gc-breaking-card p{font-size:12px;color:#3c3c3e;line-height:1.6;margin:0}',
      '#gc-breaking-card .gc-bc-meta{display:flex;gap:12px;margin-top:10px;font-size:10px;color:#6e6e73;flex-wrap:wrap}',
      '.gc-news-source-btn{display:inline-flex;align-items:center;gap:6px;margin-top:12px;background:#2563eb;color:#fff;font-family:Verdana,sans-serif;font-size:11px;font-weight:700;padding:7px 14px;border-radius:20px;text-decoration:none;transition:opacity .2s}',
      '.gc-news-source-btn:hover{opacity:.85}',
      '.gc-news-video{margin-top:14px;width:100%;max-width:420px;height:236px;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,.12)}',
      '.gc-news-video iframe{width:100%;height:100%;border:none;border-radius:12px;display:block}',
      /* magazine carousel */
      '#gc-news-carousel-wrap{padding:0 16px;margin-bottom:16px}',
      '#gc-news-carousel-wrap .gc-news-carousel-title{font-size:11px;font-weight:700;color:#64748b;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px}',
      '#gc-news-carousel{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding-bottom:8px}',
      '#gc-news-carousel::-webkit-scrollbar{display:none}',
      '.gc-news-card{flex-shrink:0;width:260px;height:320px;border-radius:18px;overflow:hidden;position:relative;scroll-snap-align:start;box-shadow:0 6px 24px rgba(0,0,0,0.22);cursor:pointer}',
      '.gc-news-card-bg{position:absolute;inset:0;background-size:cover;background-position:center;z-index:0;transition:transform .3s}',
      '.gc-news-card:hover .gc-news-card-bg{transform:scale(1.04)}',
      '.gc-news-card-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.90) 0%,rgba(0,0,0,0.35) 55%,rgba(0,0,0,0.0) 100%);z-index:1}',
      '.gc-news-card-content{position:absolute;bottom:0;left:0;right:0;z-index:2;padding:14px}',
      '.gc-news-card-tag{display:inline-block;font-size:8px;font-weight:900;letter-spacing:1.2px;text-transform:uppercase;padding:3px 8px;border-radius:20px;margin-bottom:6px;color:#fff}',
      '.gc-news-card-title{font-size:14px;font-weight:900;color:#fff;line-height:1.3;margin-bottom:6px;text-shadow:0 1px 6px rgba(0,0,0,0.6)}',
      '.gc-news-card-meta{font-size:10px;color:rgba(255,255,255,0.6);margin-bottom:10px}',
      '.gc-news-card-btns{display:flex;gap:6px}',
      '.gc-news-card-btn{flex:1;padding:8px 0;border-radius:9px;font-family:Verdana,sans-serif;font-size:11px;font-weight:700;text-align:center;text-decoration:none;color:#fff;display:block;background:rgba(255,255,255,0.18);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.22);transition:background .2s}',
      '.gc-news-card-btn:hover{background:rgba(255,255,255,0.32)}',
      '.gc-news-card-btn.read{background:rgba(37,99,235,0.85);border-color:rgba(37,99,235,0.5)}'
    ].join('');
    document.head.appendChild(s);
  }

  /* ── TICKER ── */
  function buildTicker(items) {
    if (document.getElementById('gc-breaking-ticker')) return;
    var text = items.map(function(n){ return n.ticker || (n.emoji + ' ' + n.title); }).join('   \u2022   ');
    var doubled = '\u00a0' + text + '\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0' + text + '\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0';
    var ticker = document.createElement('div');
    ticker.id = 'gc-breaking-ticker';
    ticker.innerHTML = '<div class="gc-tlbl">&#128680; BREAKING</div><div class="gc-twrap"><div class="gc-tinner">' + esc(doubled) + '</div></div>';
    var canvas = document.getElementById('gc-canvas');
    if (canvas) canvas.parentNode.insertBefore(ticker, canvas);
    else document.body.insertBefore(ticker, document.body.firstChild);
  }

  /* ── BREAKING CARD ── */
  function buildBreakingCard(n) {
    var card = document.createElement('div');
    card.id = 'gc-breaking-card';
    var videoHtml = n.video_id ?
      '<div class="gc-news-video"><iframe src="https://www.youtube.com/embed/' + esc(n.video_id) + '?rel=0&modestbranding=1" title="' + esc(n.title) + '" allowfullscreen loading="lazy"></iframe></div>' : '';
    var sourceBtn = n.source_url ?
      '<a class="gc-news-source-btn" href="' + esc(n.source_url) + '" target="_blank" rel="noopener">&#128240; Read Full Story on ' + esc(n.source_label||'Source') + ' &rarr;</a>' : '';
    card.innerHTML =
      '<div class="gc-bc-top"><div class="gc-bc-dot"></div><div class="gc-bc-lbl">&#128680; Breaking News</div></div>' +
      '<h3>' + esc(n.emoji) + ' ' + esc(n.title) + '</h3>' +
      '<p>' + esc(n.body) + '</p>' +
      '<div class="gc-bc-meta">' + (n.meta1?'<span>'+esc(n.meta1)+'</span>':'') + (n.meta2?'<span>'+esc(n.meta2)+'</span>':'') + '</div>' +
      videoHtml + sourceBtn;
    return card;
  }

  function insertCard(card) {
    var content = document.getElementById('gc-content');
    if (content && !document.getElementById('gc-breaking-card')) {
      content.insertBefore(card, content.firstChild);
      return true;
    }
    return false;
  }

  /* ── MAGAZINE CAROUSEL ── */
  function buildCarousel(items) {
    function tryInsert() {
      var content = document.getElementById('gc-content');
      if (!content || document.getElementById('gc-news-carousel-wrap')) return false;

      var wrap = document.createElement('div');
      wrap.id = 'gc-news-carousel-wrap';

      var titleEl = document.createElement('div');
      titleEl.className = 'gc-news-carousel-title';
      titleEl.textContent = '📰 Latest News — Swipe →';
      wrap.appendChild(titleEl);

      var carousel = document.createElement('div');
      carousel.id = 'gc-news-carousel';

      items.forEach(function(n) {
        var card = document.createElement('div');
        card.className = 'gc-news-card';

        var bgImg = n.image_url || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80';

        var readBtn = n.source_url ?
          '<a class="gc-news-card-btn read" href="' + esc(n.source_url) + '" target="_blank" rel="noopener">&#128279; Read</a>' : '';

        var shareBtn = '<a class="gc-news-card-btn" onclick="if(navigator.share)navigator.share({title:\'' + esc(n.title).replace(/'/g,'') + '\',url:\'' + esc(n.source_url||'https://goalcurrent.live') + '\'});return false;" href="#">&#128257; Share</a>';

        card.innerHTML =
          '<div class="gc-news-card-bg" style="background-image:url(' + esc(bgImg) + ')"></div>' +
          '<div class="gc-news-card-overlay"></div>' +
          '<div class="gc-news-card-content">' +
            (n.tag ? '<span class="gc-news-card-tag" style="background:' + esc(n.tagColor||'#2563eb') + '">' + esc(n.emoji||'') + ' ' + esc(n.tag) + '</span>' : '') +
            '<div class="gc-news-card-title">' + esc(n.title) + '</div>' +
            (n.meta ? '<div class="gc-news-card-meta">' + esc(n.meta) + '</div>' : '') +
            '<div class="gc-news-card-btns">' + readBtn + shareBtn + '</div>' +
          '</div>';

        carousel.appendChild(card);
      });

      wrap.appendChild(carousel);

      /* Insert before email signup card */
      var signup = content.querySelector('.gc-signup-card');
      if (signup && signup.parentNode) signup.parentNode.insertBefore(wrap, signup);
      else content.appendChild(wrap);
      return true;
    }

    if (!tryInsert()) {
      var ob = new MutationObserver(function() { if (tryInsert()) ob.disconnect(); });
      ob.observe(document.body, { childList: true, subtree: true });
      setTimeout(function(){ ob.disconnect(); }, 30000);
    }
  }

  /* ── MAIN ── */
  function init() {
    injectStyles();
    var breaking = GC_NEWS.filter(function(n){ return n.type === 'breaking'; });
    var normal   = GC_NEWS.filter(function(n){ return n.type === 'normal'; });

    if (breaking.length) {
      buildTicker(breaking);
      var card = buildBreakingCard(breaking[0]);
      if (!insertCard(card)) {
        var ob = new MutationObserver(function(){ if(insertCard(card)) ob.disconnect(); });
        ob.observe(document.body, { childList:true, subtree:true });
        setTimeout(function(){ ob.disconnect(); }, 30000);
      }
    }

    if (normal.length) {
      setTimeout(function(){ buildCarousel(normal); }, 2000);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
