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

   Optional fields:
     source_url:   "https://..."   → "Read Full Story" button
     source_label: "BBC Sport"     → button label
     video_id:     "YouTube_ID"    → embeds YouTube video on your site
     image_url:    "https://..."   → shows a photo on the news card
   ============================================================ */

var GC_NEWS = [

  /* ── BREAKING NEWS ── most urgent at top ── */
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

  /* ── NORMAL NEWS ── latest first ── */
  {
    type:         "normal",
    emoji:        "⭐",
    tag:          "UCL Final",
    tagColor:     "#001489",
    title:        "Dembele to Play in UCL Final — PSG Get Good News",
    body:         "Ousmane Dembele, who left PSG's final Ligue 1 match early with calf discomfort, has confirmed he will be fit for the UCL Final against Arsenal on 30 May. The Ballon d'Or winner said: 'I have no doubt about it. I hope to be on the pitch.'",
    meta1:        "📅 22 May 2026",
    meta2:        "📍 Budapest Final · 30 May",
    bg:           "linear-gradient(135deg,#e3eaff,#cfe2ff)",
    source_url:   "https://psgtalk.com/2026/05/psg-good-news-ucl-final-arsenal/",
    source_label: "PSG Talk",
    video_id:     "xrJmtZi7ti0"
  },
  {
    type:         "normal",
    emoji:        "🏆",
    tag:          "UCL Final",
    tagColor:     "#001489",
    title:        "Luis Enrique: Everyone is Ready for Arsenal Final",
    body:         "PSG boss Luis Enrique spoke to the media ahead of the UCL Final: 'Everyone is ready. It will be a week with many changes, rest days and lots of training to prepare the small offensive and defensive details. The rest is sunshine in Paris and Budapest!'",
    meta1:        "📅 20 May 2026",
    meta2:        "📍 PSG Training Ground, Paris",
    bg:           "linear-gradient(135deg,#e3eaff,#cfe2ff)",
    source_url:   "https://tribuna.com/en/news/2026-05-20-everyone-is-ready-psg-manager-luis-enrique-previews-ucl-final-against-arsenal/",
    source_label: "Tribuna",
    video_id:     "_GuDlD-fjCI"
  },
  {
    type:         "normal",
    emoji:        "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    tag:          "PL Final Day",
    tagColor:     "#37003c",
    title:        "Arsenal Champions! PL Final Day — Relegation Still Undecided",
    body:         "Arsenal are crowned Premier League Champions for the first time in 22 years with 82 points! But the drama is not over — Tottenham sit just 2 points above West Ham on final day. All 10 matches kick off simultaneously at 16:00 UK on Sunday 24 May.",
    meta1:        "📅 Sunday 24 May 2026 · 16:00 UK",
    meta2:        "📍 All 10 Stadiums · Sky Sports",
    bg:           "linear-gradient(135deg,#f3e5f5,#ead5ff)",
    source_url:   "https://www.skysports.com/football/news/11095/13546159/premier-league-26-27-season-start-date-fixture-release-final-day-live-sky-sports-games-and-match-schedule",
    source_label: "Sky Sports"
  },
  {
    type:         "normal",
    emoji:        "🌍",
    tag:          "World Cup 2026",
    tagColor:     "#d97706",
    title:        "Modric, 40, Named in Croatia WC Squad — Dzeko Also Makes It",
    body:         "Veteran Luka Modric, 40, has been named in Croatia's World Cup 2026 squad. Bosnian legend Edin Dzeko, also 40, makes Bosnia's squad. Both veteran stars will be at what is expected to be their final World Cup.",
    meta1:        "📅 22 May 2026",
    meta2:        "📍 World Cup 2026 · Group L/B",
    bg:           "linear-gradient(135deg,#e8f5ff,#cce8ff)",
    source_url:   "https://sports.yahoo.com/articles/world-cup-2026-every-nation39s-squad-as-they-are-announced-182620826.html",
    source_label: "Yahoo Sports"
  },
  {
    type:         "normal",
    emoji:        "🇧🇷",
    tag:          "World Cup 2026",
    tagColor:     "#16a34a",
    title:        "Neymar Makes Brazil World Cup Squad Under Ancelotti",
    body:         "Neymar has been named in Carlo Ancelotti's Brazil squad for World Cup 2026. The 34-year-old Santos forward joins Vinicius Jr, Raphinha and Gabriel Martinelli in an exciting attack. Brazil face Morocco in Group C on 13 June.",
    meta1:        "📅 18 May 2026",
    meta2:        "📍 Group C · 13 Jun · New York/NJ",
    bg:           "linear-gradient(135deg,#dcfce7,#bbf7d0)",
    source_url:   "https://www.football365.com/news/2026-world-cup-squads-full-48-teams-every-player",
    source_label: "Football365"
  },
  {
    type:         "normal",
    emoji:        "🌍",
    tag:          "World Cup 2026",
    tagColor:     "#d97706",
    title:        "South Africa Name Preliminary WC2026 Squad",
    body:         "Bafana Bafana have revealed their 32-man preliminary squad ahead of the World Cup. South Africa open their campaign in the tournament opener against co-host Mexico on June 11 at Estadio Azteca, Mexico City.",
    meta1:        "📅 22 May 2026",
    meta2:        "📍 Group A · 11 Jun · Mexico City",
    bg:           "linear-gradient(135deg,#fef3c7,#fde68a)",
    source_url:   "https://sports.yahoo.com/soccer/live/2026-world-cup-news-live-tracker-squad-announcements-injuries-key-storylines-and-latest-updates-200000056.html",
    source_label: "Yahoo Sports"
  },
  {
    type:         "normal",
    emoji:        "⭐",
    tag:          "UCL Final",
    tagColor:     "#001489",
    title:        "UCL Final: The Killers to Headline Budapest Kick Off Show",
    body:         "The Killers will headline the 2026 UEFA Champions League Final Kick Off Show presented by Pepsi, alongside Sir David Beckham. The cinematic short film 'The Race Begins' follows Flowers and Beckham racing to reach the most anticipated match of the season.",
    meta1:        "📅 30 May 2026 · 17:00 UK",
    meta2:        "📍 Puskas Arena, Budapest",
    bg:           "linear-gradient(135deg,#e3eaff,#cfe2ff)",
    source_url:   "https://www.uefa.com/uefachampionsleague/match/2047742--paris-vs-arsenal/final/",
    source_label: "UEFA.com",
    video_id:     "dqRe7Bj2saA"
  }

];

/* ============================================================
   RENDERER — do not edit below this line
   ============================================================ */
(function () {

  function esc(s) {
    return String(s || '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function injectStyles() {
    if (document.getElementById('gc-news-style')) return;
    var s = document.createElement('style');
    s.id = 'gc-news-style';
    s.textContent = [
      '@keyframes gc-ticker-scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}',
      '@keyframes gc-brk-blink{0%,100%{opacity:1}50%{opacity:.3}}',
      '#gc-breaking-ticker{background:#cc0000;height:34px;display:flex;align-items:center;overflow:hidden;position:relative;z-index:9998;border-bottom:1px solid rgba(255,255,255,.15)}',
      '#gc-breaking-ticker .gc-tlbl{background:#fff;color:#cc0000;font-size:9px;font-weight:900;letter-spacing:1.5px;padding:0 10px;height:100%;display:flex;align-items:center;flex-shrink:0;white-space:nowrap;font-family:Verdana,sans-serif}',
      '#gc-breaking-ticker .gc-twrap{overflow:hidden;flex:1}',
      '#gc-breaking-ticker .gc-tinner{display:inline-flex;white-space:nowrap;animation:gc-ticker-scroll 28s linear infinite;font-size:11px;font-weight:700;color:#fff;padding-left:20px;font-family:Verdana,sans-serif}',
      '#gc-breaking-card{margin:12px 16px;background:#ffffff;border:1.5px solid #d1d9f0;border-radius:16px;padding:14px;box-shadow:0 4px 16px rgba(100,160,220,0.12);font-family:Verdana,Geneva,sans-serif}',
      '#gc-breaking-card .gc-bc-top{display:flex;align-items:center;gap:6px;margin-bottom:8px}',
      '#gc-breaking-card .gc-bc-dot{width:8px;height:8px;background:#cc0000;border-radius:50%;animation:gc-brk-blink 1s infinite;flex-shrink:0}',
      '#gc-breaking-card .gc-bc-lbl{font-size:9px;font-weight:900;letter-spacing:2px;color:#cc0000;text-transform:uppercase}',
      '#gc-breaking-card h3{font-size:15px;font-weight:800;color:#1c1c1e;margin:0 0 6px;line-height:1.3}',
      '#gc-breaking-card p{font-size:12px;color:#3c3c3e;line-height:1.6;margin:0}',
      '#gc-breaking-card .gc-bc-meta{display:flex;gap:12px;margin-top:10px;font-size:10px;color:#6e6e73;flex-wrap:wrap}',
      '.gc-news-source-btn{display:inline-flex;align-items:center;gap:6px;margin-top:12px;background:#1c1c1e;color:#fff;font-family:Verdana,sans-serif;font-size:11px;font-weight:700;padding:7px 14px;border-radius:20px;text-decoration:none;transition:opacity .2s}',
      '.gc-news-source-btn:hover{opacity:.85}',
      '.gc-news-source-btn.blue{background:#2563eb}',
      '.gc-news-video{margin-top:14px;width:100%;max-width:420px;height:236px;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,.12)}',
      '.gc-news-video iframe{width:100%;height:100%;border:none;border-radius:12px;display:block}',
      '.gc-news-image{margin-top:12px;width:100%;max-width:460px;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.1)}',
      '.gc-news-image img{width:100%;height:auto;display:block;border-radius:12px}',
      /* normal news cards */
      '.gc-news-section{padding:0 16px;margin-bottom:14px}',
      '.gc-news-section-title{font-size:11px;font-weight:700;color:#64748b;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px}',
      '.gc-news-item{background:#fff;border:1.5px solid #e2e8f0;border-radius:14px;padding:14px;margin-bottom:10px;box-shadow:0 2px 8px rgba(100,160,220,0.07)}',
      '.gc-news-item-tag{display:inline-block;font-size:9px;font-weight:800;letter-spacing:1px;text-transform:uppercase;padding:3px 8px;border-radius:20px;margin-bottom:6px;color:#fff}',
      '.gc-news-item-title{font-size:13px;font-weight:800;color:#0f172a;line-height:1.4;margin-bottom:6px}',
      '.gc-news-item-body{font-size:11px;color:#475569;line-height:1.6;margin-bottom:8px}',
      '.gc-news-item-meta{font-size:10px;color:#94a3b8}',
      '.gc-news-item-source{display:inline-flex;align-items:center;gap:4px;margin-top:8px;font-size:11px;font-weight:700;color:#2563eb;text-decoration:none}',
      '.gc-news-item-source:hover{text-decoration:underline}'
    ].join('');
    document.head.appendChild(s);
  }

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

  function buildBreakingCard(n) {
    var card = document.createElement('div');
    card.id  = 'gc-breaking-card';

    var videoHtml = '';
    if (n.video_id) {
      videoHtml = '<div class="gc-news-video">' +
                  '<iframe src="https://www.youtube.com/embed/' + esc(n.video_id) + '?rel=0&modestbranding=1" ' +
                  'title="' + esc(n.title) + '" allowfullscreen loading="lazy"></iframe>' +
                  '</div>';
    }

    var imageHtml = '';
    if (n.image_url && !n.video_id) {
      imageHtml = '<div class="gc-news-image"><img src="' + esc(n.image_url) + '" alt="' + esc(n.title) + '" loading="lazy"></div>';
    }

    var sourceBtn = '';
    if (n.source_url) {
      sourceBtn = '<a class="gc-news-source-btn blue" href="' + esc(n.source_url) + '" target="_blank" rel="noopener">' +
                  '&#128240; Read Full Story on ' + esc(n.source_label || 'Source') + ' &rarr;</a>';
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
      videoHtml + imageHtml + sourceBtn;

    return card;
  }

  function buildNormalNewsSection(items) {
    if (!items.length) return;

    /* Wait for gc-content then inject news section */
    function tryInsert() {
      var content = document.getElementById('gc-content');
      if (!content || document.getElementById('gc-news-section')) return false;

      /* Find a good insertion point — after breaking card or at end of first child div */
      var section = document.createElement('div');
      section.id = 'gc-news-section';
      section.className = 'gc-news-section';

      var titleEl = document.createElement('div');
      titleEl.className = 'gc-news-section-title';
      titleEl.textContent = '📰 Latest News';
      section.appendChild(titleEl);

      items.forEach(function(n) {
        var item = document.createElement('div');
        item.className = 'gc-news-item';
        if (n.bg) item.style.background = n.bg;

        var videoHtml = n.video_id ?
          '<div class="gc-news-video" style="height:200px;margin-top:10px">' +
          '<iframe src="https://www.youtube.com/embed/' + esc(n.video_id) + '?rel=0&modestbranding=1" ' +
          'title="' + esc(n.title) + '" allowfullscreen loading="lazy"></iframe></div>' : '';

        var imageHtml = (n.image_url && !n.video_id) ?
          '<div class="gc-news-image"><img src="' + esc(n.image_url) + '" alt="' + esc(n.title) + '" loading="lazy"></div>' : '';

        var sourceLink = n.source_url ?
          '<a class="gc-news-item-source" href="' + esc(n.source_url) + '" target="_blank" rel="noopener">' +
          '&#128240; ' + esc(n.source_label || 'Read more') + ' &rarr;</a>' : '';

        item.innerHTML =
          (n.tag ? '<span class="gc-news-item-tag" style="background:' + esc(n.tagColor||'#2563eb') + '">' + esc(n.emoji||'') + ' ' + esc(n.tag) + '</span>' : '') +
          '<div class="gc-news-item-title">' + esc(n.title) + '</div>' +
          '<div class="gc-news-item-body">' + esc(n.body) + '</div>' +
          (n.meta1 ? '<div class="gc-news-item-meta">' + esc(n.meta1) + (n.meta2 ? ' &nbsp;·&nbsp; ' + esc(n.meta2) : '') + '</div>' : '') +
          videoHtml + imageHtml + sourceLink;

        section.appendChild(item);
      });

      /* Insert before the signup card or at end of content */
      var signup = content.querySelector('.gc-signup-card');
      if (signup && signup.parentNode) {
        signup.parentNode.insertBefore(section, signup);
      } else {
        content.appendChild(section);
      }
      return true;
    }

    if (!tryInsert()) {
      var ob = new MutationObserver(function() {
        if (tryInsert()) ob.disconnect();
      });
      ob.observe(document.body, { childList: true, subtree: true });
      setTimeout(function(){ ob.disconnect(); }, 30000);
    }
  }

  function insertCard(card) {
    var content = document.getElementById('gc-content');
    if (content && !document.getElementById('gc-breaking-card')) {
      content.insertBefore(card, content.firstChild);
      return true;
    }
    return false;
  }

  function init() {
    injectStyles();

    var breaking = GC_NEWS.filter(function(n){ return n.type === 'breaking'; });
    var normal   = GC_NEWS.filter(function(n){ return n.type === 'normal'; });

    /* ticker */
    if (breaking.length && !document.getElementById('gc-breaking-ticker')) {
      buildTicker(breaking);
    }

    /* breaking card */
    if (breaking.length) {
      var card = buildBreakingCard(breaking[0]);
      if (!insertCard(card)) {
        var ob = new MutationObserver(function() {
          if (insertCard(card)) ob.disconnect();
        });
        ob.observe(document.body, { childList: true, subtree: true });
        setTimeout(function(){ ob.disconnect(); }, 30000);
      }
    }

    /* normal news section — delayed to let home page render first */
    if (normal.length) {
      setTimeout(function() {
        buildNormalNewsSection(normal);
      }, 2000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
