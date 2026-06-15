/* ================================================================
   GoalCurrent.live — gc-final-safe.js
   Safe patch: fixes links, adds fallback flags ONLY where needed,
   and adds fallback popups ONLY if master template versions absent.
   Does NOT touch pages that already have flagcdn images.
   ================================================================ */
(function () {
  'use strict';

  /* ── 1. FLAG DATA ─────────────────────────────────────────── */
  var FLAGS = {
    'Mexico':'🇲🇽','South Africa':'🇿🇦','South Korea':'🇰🇷',
    'Czech Republic':'🇨🇿','Czechia':'🇨🇿','Canada':'🇨🇦',
    'Bosnia & Herzegovina':'🇧🇦','Bosnia & Herz.':'🇧🇦',
    'Qatar':'🇶🇦','Switzerland':'🇨🇭','Brazil':'🇧🇷',
    'Morocco':'🇲🇦','Haiti':'🇭🇹','Scotland':'🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    'USA':'🇺🇸','United States':'🇺🇸','Paraguay':'🇵🇾',
    'Australia':'🇦🇺','Turkey':'🇹🇷','Türkiye':'🇹🇷',
    'Germany':'🇩🇪','Curaçao':'🇨🇼','Curacao':'🇨🇼',
    'Ivory Coast':'🇨🇮',"Côte d'Ivoire":'🇨🇮',
    'Ecuador':'🇪🇨','Netherlands':'🇳🇱','Japan':'🇯🇵',
    'Sweden':'🇸🇪','Tunisia':'🇹🇳','Belgium':'🇧🇪',
    'Egypt':'🇪🇬','Iran':'🇮🇷','New Zealand':'🇳🇿',
    'Spain':'🇪🇸','Cape Verde':'🇨🇻','Saudi Arabia':'🇸🇦',
    'Uruguay':'🇺🇾','France':'🇫🇷','Senegal':'🇸🇳',
    'Iraq':'🇮🇶','Norway':'🇳🇴','Argentina':'🇦🇷',
    'Algeria':'🇩🇿','Austria':'🇦🇹','Jordan':'🇯🇴',
    'Portugal':'🇵🇹','DR Congo':'🇨🇩','Uzbekistan':'🇺🇿',
    'Colombia':'🇨🇴','England':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','Croatia':'🇭🇷',
    'Ghana':'🇬🇭','Panama':'🇵🇦'
  };

  /* ── 2. HELPERS ───────────────────────────────────────────── */
  function esc(s) {
    return String(s).replace(/[&<>'"]/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c];
    });
  }

  function flagEmoji(name) { return FLAGS[name] || ''; }

  function makeFlag(name, big) {
    var f = flagEmoji(name);
    if (!f) return '';
    return '<span class="gc-safe-flag' + (big ? ' gc-safe-flag-lg' : '') +
           '" aria-hidden="true">' + f + '</span>';
  }

  function normaliseName(text) {
    var t = String(text || '').replace(/\s+/g, ' ').trim();
    if (!t) return null;
    /* strip leading emoji/flag codepoints */
    t = t.replace(/^[\u{1F1E6}-\u{1F1FF}\u{1F3F4}\u2600-\u27BF]+\s*/u, '').trim();
    return FLAGS[t] ? t : null;
  }

  /* Returns true if the element (or its nearest card ancestor)
     already contains a flagcdn image — skip enhancement in that case */
  function hasFlagcdnNearby(el) {
    /* check self */
    if (el.querySelector('img[src*="flagcdn"]')) return true;
    /* check parent and grandparent (the flag img is often a sibling) */
    var p = el.parentElement;
    if (p && p.querySelector('img[src*="flagcdn"]')) return true;
    var gp = p && p.parentElement;
    if (gp && gp.querySelector('img[src*="flagcdn"]')) return true;
    /* check if already enhanced */
    if (el.querySelector('.gc-safe-flag')) return true;
    return false;
  }

  /* ── 3. ENHANCE FLAGS ─────────────────────────────────────── */
  /* Only runs on elements that do NOT already have flagcdn images nearby.
     This means it safely handles old pages (no flagcdn) but leaves
     the new master-template pages (with flagcdn) completely untouched. */
  function enhanceFlags() {
    /* Skip homepage entirely */
    var path = location.pathname;
    if (path === '/' || path === '/index.html') return;

    /* Elements that might need emoji flags injected */
    var selectors = [
      '.gc-match-name', '.gc-tbl-name', '.gc-fav-name',
      '.gc-all-card-name', '.gc-bracket-name', '.fixture-teams strong',
      '.wc-match-team span', '.team-row'
    ];

    document.querySelectorAll(selectors.join(',')).forEach(function (el) {
      if (hasFlagcdnNearby(el)) return;
      var name = normaliseName(el.textContent);
      if (!name) return;
      el.innerHTML = '<span class="gc-safe-teamline">' +
                     makeFlag(name, false) +
                     '<span>' + esc(name) + '</span></span>';
    });

    /* Generic scan — only very short text nodes with no children
       and no flagcdn nearby */
    document.querySelectorAll('td, li').forEach(function (el) {
      if (el.children.length > 0) return;
      if (hasFlagcdnNearby(el)) return;
      if (el.textContent.trim().length > 35) return;
      var name = normaliseName(el.textContent);
      if (!name) return;
      el.innerHTML = '<span class="gc-safe-teamline">' +
                     makeFlag(name, false) +
                     '<span>' + esc(name) + '</span></span>';
    });
  }

  /* ── 4. FIX BROKEN LINKS ──────────────────────────────────── */
  function fixLinks() {
    document.querySelectorAll('a[href="/champions-league/"], a[href="/champions-league"]')
      .forEach(function (a) { a.setAttribute('href', '/ucl/'); });
    document.querySelectorAll('a[href="/news/"], a[href="/news"]')
      .forEach(function (a) { a.setAttribute('href', '/worldcup2026/news/'); });
  }

  /* ── 5. FALLBACK NORDVPN BAR ──────────────────────────────── */
  /* Only added if neither the master template bar nor an existing
     fallback bar is present */
  function addNord() {
    if (document.querySelector(
      '.gc-vpn-bar, .gc-ad-bar, .gc-safe-nord, #gc-nordvpn-bar, .nordvpn-banner'
    )) return;
    var d = document.createElement('div');
    d.className = 'gc-safe-nord';
    d.innerHTML = '🔒 <strong>Watching football abroad?</strong> Use ' +
      '<a href="https://go.nordvpn.net/aff_c?offer_id=15&aff_id=148347"' +
      ' target="_blank" rel="noopener sponsored">NordVPN</a>' +
      ' <small>Affiliate link — we may earn a commission</small>';
    var footer = document.querySelector('footer, .gc-footer');
    if (footer) footer.parentNode.insertBefore(d, footer);
    else document.body.appendChild(d);
  }

  /* ── 6. FALLBACK COOKIE BANNER ────────────────────────────── */
  /* Only added if no master template banner exists and user
     has not already made a choice */
  function addCookie() {
    if (document.querySelector('#gc-cookie-banner, .cookie-banner, .gc-safe-cookie')) return;
    if (localStorage.getItem('gc_cookies') || localStorage.getItem('gc_cookie_choice')) return;
    var b = document.createElement('div');
    b.className = 'gc-safe-cookie';
    b.innerHTML = '<p>We use cookies to personalise content and analyse traffic. ' +
      '<a href="/cookies.html">Cookie Policy</a></p>' +
      '<button class="reject" type="button">Decline</button>' +
      '<button class="accept" type="button">Accept ✓</button>';
    document.body.appendChild(b);
    function hide(v) {
      localStorage.setItem('gc_cookies', v);
      b.classList.remove('show');
    }
    b.querySelector('.accept').onclick = function () { hide('yes'); };
    b.querySelector('.reject').onclick = function () { hide('no'); };
    setTimeout(function () { b.classList.add('show'); }, 1500);
  }

  /* ── 7. FALLBACK SUBSCRIPTION POPUP ──────────────────────── */
  /* Only added if no master template popup exists */
  function addSubscribe() {
    if (document.querySelector(
      '#gc-sub-overlay, .gc-sub-overlay, .subscribe-popup, .gc-safe-sub'
    )) return;
    if (sessionStorage.getItem('gc_sub_closed')) return;
    var BREVO = 'https://6f3982fe.sibforms.com/serve/MUIFAAeE0hUslfMPz6bu9jEdklCxC0j3MKRhPltWSCDC_' +
      'tVUwEcn-BPO3nLjIw2aSho06qiaVbJQeSm82mDriQMJMGfLswlCCKPLLfx0zUzMswOSlJdOlApYAZWAC_afmaPFWT15_' +
      'roCfNbtYVtGFlMgKM1HGk_pVspxm85Bu_diOgScU9dhJ5759I1ylWVpHoPZGfmBCXXou9sSrQ==';
    var s = document.createElement('div');
    s.className = 'gc-safe-sub';
    s.innerHTML = '<div class="gc-safe-sub-card">' +
      '<h2>⚽ Stay Ahead of the Game</h2>' +
      '<p>Get World Cup 2026 goals, results and news straight to your inbox.</p>' +
      '<form action="' + BREVO + '" method="POST" target="_blank">' +
      '<input type="email" name="EMAIL" required placeholder="Your email address" autocomplete="email">' +
      '<input type="hidden" name="locale" value="en">' +
      '<button class="submit" type="submit">Subscribe Free</button></form>' +
      '<button class="close" type="button">Close ✕</button>' +
      '<p style="font-size:11px;color:#64748b;margin-top:8px">Powered by Brevo · unsubscribe any time</p>' +
      '</div>';
    document.body.appendChild(s);
    s.querySelector('.close').onclick = function () {
      sessionStorage.setItem('gc_sub_closed', '1');
      s.classList.remove('show');
    };
    s.querySelector('form').addEventListener('submit', function () {
      sessionStorage.setItem('gc_sub_closed', '1');
      setTimeout(function () { s.classList.remove('show'); }, 400);
    });
    setTimeout(function () { s.classList.add('show'); }, 7000);
  }

  /* ── 7b. ENSURE #gc-sub-thanks EXISTS ─────────────────────── */
  /* The master subscribe form's inline onsubmit references
     document.getElementById('gc-sub-thanks'); some pages ship the form
     without that element, which throws on submit. Inject a hidden one
     whenever the master overlay is present but the element is missing. */
  function ensureSubThanks() {
    if (document.getElementById('gc-sub-thanks')) return;
    var box = document.querySelector('#gc-sub-overlay .gc-sub-box') ||
              document.getElementById('gc-sub-overlay');
    if (!box) return;
    var t = document.createElement('p');
    t.id = 'gc-sub-thanks';
    t.style.cssText = 'display:none;margin-top:10px;font-weight:700;color:var(--blue,#2563eb)';
    t.textContent = '\u2705 Thank you \u2014 please check your inbox to confirm your subscription.';
    box.appendChild(t);
  }

  /* ── 8. FAVOURITES REMOVE BUTTON ─────────────────────────── */
  function makeFavRemovable() {
    if (!/\/worldcup2026\/favourites\//.test(location.pathname)) return;
    document.querySelectorAll('.gc-fav-card, .team-row.fav-item').forEach(function (card) {
      if (card.querySelector('.gc-safe-fav-remove')) return;
      var name = (card.textContent || '').replace('✕', '').trim().split('\n')[0].trim();
      if (!name) return;
      var btn = document.createElement('button');
      btn.className = 'gc-safe-fav-remove';
      btn.type = 'button';
      btn.textContent = 'Remove';
      btn.onclick = function (e) {
        e.preventDefault(); e.stopPropagation();
        try {
          var f = JSON.parse(localStorage.getItem('wc26_favourites') || '[]')
                    .filter(function (x) { return x !== name; });
          localStorage.setItem('wc26_favourites', JSON.stringify(f));
        } catch (err) {}
        card.remove();
      };
      card.appendChild(btn);
    });
  }

  /* ── 9. RUN ───────────────────────────────────────────────── */
  function run() {
    fixLinks();
    enhanceFlags();
    addNord();
    addCookie();
    addSubscribe();
    ensureSubThanks();
    makeFavRemovable();
    /* second pass for dynamically rendered content */
    setTimeout(enhanceFlags, 400);
    setTimeout(makeFavRemovable, 600);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

})();
