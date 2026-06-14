/**
 * GoalCurrent.live — gc-shell.js
 * One standard application shell: header + sidebar, shared across pages.
 *
 * OPT-IN ONLY. Nothing renders until you call GCShell.init() (or add
 * <body data-gc-shell="auto">). This keeps Phase 1 from touching any
 * existing page automatically.
 *
 * Guarantees:
 *   - One standard header and one standard sidebar
 *   - Logo + "GoalCurrent.live" on a single horizontal line (.gc-shell-brand)
 *   - Active menu detection from the URL or a data-gc-section attribute
 *   - No overlap between hamburger, logo and close button:
 *       • Hamburger ☰ lives ONLY in the header (.gc-shell-hamburger),
 *         hidden on desktop (≥769px)
 *       • Close ✕ lives ONLY inside the sidebar head (.gc-shell-sidebar-close)
 *       • Brand/logo gets its own flex slot in both header and sidebar
 *
 * Public API:
 *   GCShell.init(options?)
 *   GCShell.openSidebar() / closeSidebar() / toggleSidebar()
 *   GCShell.toggleSection(id)   // 'gc-shell-pl' | 'gc-shell-wc' | 'gc-shell-ucl'
 *   GCShell.detectSection()     // 'home' | 'worldcup2026' | 'premier-league' | 'ucl'
 *   GCShell.isActive(href)      // boolean — URL-based active link
 *
 * init(options):
 *   mount            CSS selector for an existing mount node (default: body)
 *   section          force a section ('home'|'worldcup2026'|'premier-league'|'ucl')
 *   headerTitle      optional title shown in the header
 *   headerSubtitle   optional subtitle shown in the header
 *   showSubnav       boolean — show section tab pills (default true)
 *   contentSelector  selector for existing content to move inside the shell
 */
(function () {
  'use strict';

  var STYLE_ID = 'gc-shell-style';
  var initialised = false;

  /* ── Navigation model ─────────────────────────────── */
  var SECTIONS = {
    'worldcup2026': {
      id: 'gc-shell-wc',
      label: '🏆 World Cup 2026',
      badge: 'WC26',
      badgeClass: 'gc-shell-badge--gold',
      links: [
        { href: '/worldcup2026/index.html', icon: '🏠', label: 'Overview' },
        { href: '/worldcup2026/groups/index.html', icon: '🔢', label: 'Groups' },
        { href: '/worldcup2026/fixtures/index.html', icon: '📅', label: 'Fixtures' },
        { href: '/worldcup2026/standings/index.html', icon: '📊', label: 'Standings' },
        { href: '/worldcup2026/bracket/index.html', icon: '🏅', label: 'Bracket' },
        { href: '/worldcup2026/venues/index.html', icon: '🏟️', label: 'Venues' },
        { href: '/worldcup2026/teams/index.html', icon: '👕', label: 'Teams' },
        { href: '/worldcup2026/news/index.html', icon: '📰', label: 'News' },
        { href: '/worldcup2026/favourites/index.html', icon: '⭐', label: 'Favourites' }
      ]
    },
    'premier-league': {
      id: 'gc-shell-pl',
      label: '🏴 Premier League',
      badge: 'PL',
      badgeClass: 'gc-shell-badge--pl',
      links: [
        { href: '/premier-league/index.html', icon: '🏠', label: 'Overview' },
        { href: '/premier-league/table/index.html', icon: '📊', label: 'Table' },
        { href: '/premier-league/fixtures/index.html', icon: '📅', label: 'Fixtures' },
        { href: '/premier-league/results/index.html', icon: '✅', label: 'Results' },
        { href: '/premier-league/teams/index.html', icon: '👕', label: 'Teams' },
        { href: '/premier-league/news/index.html', icon: '📰', label: 'News' }
      ]
    },
    'ucl': {
      id: 'gc-shell-ucl',
      label: '⭐ Champions League',
      badge: 'UCL',
      badgeClass: 'gc-shell-badge--ucl',
      links: [
        { href: '/ucl/index.html', icon: '🏠', label: 'Overview' },
        { href: '/ucl/fixtures/index.html', icon: '📅', label: 'Fixtures' },
        { href: '/ucl/results/index.html', icon: '✅', label: 'Results' },
        { href: '/ucl/teams/index.html', icon: '👕', label: 'Teams' },
        { href: '/ucl/news/index.html', icon: '📰', label: 'News' }
      ]
    }
  };

  var MAIN_LINKS = [
    { href: '/', icon: '🏠', label: 'Home' },
    { href: '/live/index.html', icon: '🔴', label: 'Live Scores' },
    { href: '/worldcup2026/fixtures/index.html', icon: '📅', label: 'Fixtures' },
    { href: '/worldcup2026/news/index.html', icon: '📰', label: 'Latest News' }
  ];

  /* ── Helpers ──────────────────────────────────────── */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function currentPath() {
    return (window.location.pathname || '/').toLowerCase();
  }

  function isActive(href) {
    if (!href) return false;
    var h = String(href).toLowerCase();
    var path = currentPath();
    if (h === '/') {
      return path === '/' || path === '/index.html';
    }
    var clean = h.replace(/index\.html$/, '').replace(/\/$/, '');
    var pathClean = path.replace(/index\.html$/, '').replace(/\/$/, '');
    return pathClean === clean || (clean && pathClean.indexOf(clean) === 0);
  }

  function detectSection() {
    var bodyAttr = document.body && document.body.getAttribute('data-gc-section');
    if (bodyAttr && (SECTIONS[bodyAttr] || bodyAttr === 'home')) return bodyAttr;
    var path = currentPath();
    if (path.indexOf('/premier-league/') !== -1) return 'premier-league';
    if (path.indexOf('/ucl/') !== -1) return 'ucl';
    if (path.indexOf('/worldcup2026/') !== -1) return 'worldcup2026';
    return 'home';
  }

  /* ── Styles (namespaced, injected once) ───────────── */
  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var css =
      ':root{--gc-shell-w:240px}' +
      '.gc-shell-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:400}' +
      '.gc-shell-overlay.is-open{display:block}' +

      /* Sidebar */
      '.gc-shell-sidebar{width:var(--gc-shell-w);background:linear-gradient(180deg,#07111f,#0b1628);height:100vh;position:fixed;top:0;left:0;display:flex;flex-direction:column;z-index:500;overflow-y:auto;scrollbar-width:none;transform:translateX(-100%);transition:transform .3s ease;box-shadow:4px 0 24px rgba(0,0,0,.3);font-family:Verdana,Geneva,Tahoma,sans-serif}' +
      '.gc-shell-sidebar::-webkit-scrollbar{display:none}' +
      '.gc-shell-sidebar.is-open{transform:translateX(0)}' +
      '.gc-shell-sidebar-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:14px 14px;border-bottom:1px solid rgba(255,255,255,.08);flex-shrink:0}' +
      '.gc-shell-sidebar-close{background:none;border:none;color:rgba(255,255,255,.55);font-size:20px;line-height:1;cursor:pointer;padding:2px 6px;flex-shrink:0;font-family:inherit}' +
      '.gc-shell-sidebar-close:hover{color:#fff}' +
      '.gc-shell-section-label{padding:14px 16px 4px;font-size:10px;font-weight:800;color:rgba(184,196,217,.48);text-transform:uppercase;letter-spacing:1.5px}' +
      '.gc-shell-link{display:flex;align-items:center;gap:10px;padding:10px 16px;color:#b8c4d9;text-decoration:none;font-size:13px;font-weight:600}' +
      '.gc-shell-link:hover,.gc-shell-link.is-active{background:#10213a;color:#fff}' +
      '.gc-shell-link.is-active{border-left:3px solid #2563eb}' +
      '.gc-shell-comp{border-top:1px solid rgba(255,255,255,.08)}' +
      '.gc-shell-comp-btn{display:flex;align-items:center;justify-content:space-between;width:100%;padding:11px 16px;background:none;border:none;color:#b8c4d9;font-size:13px;font-weight:700;cursor:pointer;text-align:left;font-family:inherit}' +
      '.gc-shell-comp-btn:hover{background:#10213a;color:#fff}' +
      '.gc-shell-badge{font-size:10px;background:rgba(59,130,246,.25);color:#60a5fa;padding:2px 7px;border-radius:5px;font-weight:800}' +
      '.gc-shell-badge--gold{background:rgba(251,191,36,.25);color:#fbbf24}' +
      '.gc-shell-badge--ucl{background:rgba(255,215,0,.2);color:#ffd700}' +
      '.gc-shell-badge--pl{background:rgba(56,0,60,.5);color:#e9b4ff}' +
      '.gc-shell-sub{display:none}.gc-shell-sub.is-open{display:block}' +
      '.gc-shell-sub-link{display:flex;align-items:center;gap:8px;padding:8px 16px 8px 38px;color:rgba(184,196,217,.78);text-decoration:none;font-size:12px}' +
      '.gc-shell-sub-link:hover{background:#10213a;color:#fff}' +
      '.gc-shell-sub-link.is-active{background:linear-gradient(135deg,#003fb8,#0057e7);color:#fff;font-weight:800}' +

      /* Brand row — logo + wordmark on one horizontal line */
      '.gc-shell-brand{display:flex;align-items:center;gap:8px;text-decoration:none;min-width:0}' +
      '.gc-shell-brand-logo{width:26px;height:26px;flex-shrink:0;display:block}' +
      '.gc-shell-brand-text{font-size:16px;font-weight:900;color:#fff;white-space:nowrap;line-height:1;font-family:Verdana,Geneva,Tahoma,sans-serif}' +
      '.gc-shell-brand-text span{color:#f59e0b}' +

      /* Header */
      '.gc-shell-header{position:sticky;top:0;z-index:300;background:linear-gradient(135deg,#001a4d 0%,#002b80 50%,#003fb8 100%);border-bottom:2px solid rgba(245,158,11,.4);box-shadow:0 4px 24px rgba(0,27,80,.45);padding:0 16px;font-family:Verdana,Geneva,Tahoma,sans-serif}' +
      '.gc-shell-header-top{display:flex;align-items:center;gap:10px;padding:10px 0 8px}' +
      '.gc-shell-header-left{display:flex;align-items:center;gap:10px;min-width:0}' +
      '.gc-shell-hamburger{display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);border-radius:8px;font-size:18px;line-height:1;cursor:pointer;color:#fff;padding:6px 9px;flex-shrink:0;transition:background .2s;font-family:inherit}' +
      '.gc-shell-hamburger:hover{background:rgba(255,255,255,.22)}' +
      '.gc-shell-brand--header{margin-right:2px}' +
      '.gc-shell-header-titles{min-width:0;line-height:1.15;padding-left:12px;margin-left:6px;border-left:1px solid rgba(255,255,255,.18)}' +
      '.gc-shell-header-title{font-size:15px;font-weight:900;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '.gc-shell-header-sub{font-size:10px;color:rgba(255,255,255,.55);font-weight:700;letter-spacing:.3px;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '.gc-shell-header-spacer{flex:1}' +
      '.gc-shell-subnav{display:flex;gap:4px;padding-bottom:9px;overflow-x:auto;scrollbar-width:none}' +
      '.gc-shell-subnav::-webkit-scrollbar{display:none}' +
      '.gc-shell-pill{font-size:10px;font-weight:800;color:rgba(255,255,255,.6);background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:4px 10px;text-decoration:none;white-space:nowrap;transition:.15s;flex-shrink:0}' +
      '.gc-shell-pill:hover{background:rgba(255,255,255,.16);color:#fff}' +
      '.gc-shell-pill.is-active{background:#f59e0b;border-color:#f59e0b;color:#0f172a}' +

      /* Main wrapper / content */
      '.gc-shell-main{margin-left:var(--gc-shell-w);min-height:100vh;display:flex;flex-direction:column;transition:margin-left .3s ease}' +
      '.gc-shell-content{flex:1}' +

      /* Sidebar footer */
      '.gc-shell-foot{margin-top:auto;padding:14px 16px;border-top:1px solid rgba(255,255,255,.08);font-size:11px;color:rgba(184,196,217,.52);line-height:1.7;flex-shrink:0}' +
      '.gc-shell-social{display:flex;gap:8px;margin-bottom:10px}' +
      '.gc-shell-social a{display:flex;align-items:center;justify-content:center;width:28px;height:28px;background:#10213a;border-radius:7px;font-size:13px;color:#b8c4d9;text-decoration:none}' +

      /* Desktop ≥769px: sidebar fixed open, hamburger + close hidden */
      '@media(min-width:769px){' +
      '.gc-shell-overlay{display:none!important}' +
      '.gc-shell-sidebar{transform:translateX(0)!important}' +
      '.gc-shell-sidebar-close{display:none}' +
      '.gc-shell-hamburger{display:none!important}' +
      '.gc-shell-main{margin-left:var(--gc-shell-w)!important}' +
      '}' +

      /* Mobile ≤768px: sidebar slides over, header makes room for hamburger */
      '@media(max-width:768px){' +
      '.gc-shell-main{margin-left:0!important}' +
      '.gc-shell-sidebar{transform:translateX(-100%)!important}' +
      '.gc-shell-sidebar.is-open{transform:translateX(0)!important}' +
      '.gc-shell-header-title{font-size:14px}' +
      '}';

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* ── Markup builders ──────────────────────────────── */
  function brandHTML(extraCls) {
    return '<a class="gc-shell-brand' + (extraCls ? ' ' + extraCls : '') + '" href="/">' +
      '<img class="gc-shell-brand-logo" src="/logo.svg" alt="GoalCurrent.live logo"' +
      ' onerror="this.style.display=\'none\'">' +
      '<span class="gc-shell-brand-text">Goal<span>Current</span>.live</span>' +
      '</a>';
  }

  function mainLinksHTML() {
    return MAIN_LINKS.map(function (l) {
      var active = isActive(l.href) ? ' is-active' : '';
      return '<a href="' + esc(l.href) + '" class="gc-shell-link' + active + '">' +
        '<span>' + l.icon + '</span><span>' + esc(l.label) + '</span></a>';
    }).join('');
  }

  function compHTML(key, activeSection) {
    var sec = SECTIONS[key];
    var open = key === activeSection ? ' is-open' : '';
    var subs = sec.links.map(function (l) {
      var active = isActive(l.href) ? ' is-active' : '';
      return '<a href="' + esc(l.href) + '" class="gc-shell-sub-link' + active + '">' +
        '<span>' + l.icon + '</span><span>' + esc(l.label) + '</span></a>';
    }).join('');

    return '<div class="gc-shell-comp">' +
      '<button type="button" class="gc-shell-comp-btn" data-gc-shell-section="' + sec.id + '">' +
      '<span>' + sec.label + '</span>' +
      '<span class="gc-shell-badge ' + sec.badgeClass + '">' + sec.badge + '</span>' +
      '</button>' +
      '<div class="gc-shell-sub' + open + '" id="' + sec.id + '">' + subs + '</div>' +
      '</div>';
  }

  function sidebarHTML(activeSection) {
    return '<nav class="gc-shell-sidebar" id="gc-shell-sidebar" aria-label="Main navigation">' +
      '<div class="gc-shell-sidebar-head">' +
      brandHTML() +
      '<button type="button" class="gc-shell-sidebar-close" id="gc-shell-sidebar-close"' +
      ' aria-label="Close menu">✕</button>' +
      '</div>' +
      '<div class="gc-shell-section-label">Main Menu</div>' +
      mainLinksHTML() +
      '<div class="gc-shell-section-label">Competitions</div>' +
      compHTML('premier-league', activeSection) +
      compHTML('worldcup2026', activeSection) +
      compHTML('ucl', activeSection) +
      '<div class="gc-shell-foot">' +
      '<div class="gc-shell-social">' +
      '<a href="https://twitter.com/goalcurrentlive" target="_blank" rel="noopener">𝕏</a>' +
      '<a href="https://tiktok.com/@goalcurrent" target="_blank" rel="noopener">🎵</a>' +
      '<a href="https://instagram.com/goalcurrentlive" target="_blank" rel="noopener">📸</a>' +
      '</div>' +
      '© 2026 <strong style="color:#a8b2c8">Ashna4All</strong>' +
      '</div>' +
      '</nav>';
  }

  function subnavHTML(activeSection) {
    var sec = SECTIONS[activeSection] || SECTIONS.worldcup2026;
    return '<nav class="gc-shell-subnav" aria-label="Section navigation">' +
      sec.links.map(function (l) {
        var active = isActive(l.href) ? ' is-active' : '';
        return '<a href="' + esc(l.href) + '" class="gc-shell-pill' + active + '">' +
          l.icon + ' ' + esc(l.label) + '</a>';
      }).join('') +
      '</nav>';
  }

  function headerHTML(opts, activeSection) {
    var showSubnav = opts.showSubnav !== false;

    var titleBlock = '';
    if (opts.headerTitle != null || opts.headerSubtitle != null) {
      titleBlock = '<div class="gc-shell-header-titles">' +
        (opts.headerTitle != null ? '<div class="gc-shell-header-title">' + esc(opts.headerTitle) + '</div>' : '') +
        (opts.headerSubtitle != null ? '<div class="gc-shell-header-sub">' + esc(opts.headerSubtitle) + '</div>' : '') +
        '</div>';
    }

    return '<header class="gc-shell-header">' +
      '<div class="gc-shell-header-top">' +
      '<button type="button" class="gc-shell-hamburger" id="gc-shell-hamburger"' +
      ' aria-label="Open menu" aria-controls="gc-shell-sidebar">☰</button>' +
      brandHTML('gc-shell-brand--header') +
      titleBlock +
      '<div class="gc-shell-header-spacer"></div>' +
      '</div>' +
      (showSubnav ? subnavHTML(activeSection) : '') +
      '</header>';
  }

  /* ── Sidebar controls ─────────────────────────────── */
  function openSidebar() {
    var sb = document.getElementById('gc-shell-sidebar');
    var ov = document.getElementById('gc-shell-overlay');
    if (sb) sb.classList.add('is-open');
    if (ov) ov.classList.add('is-open');
    if (window.innerWidth <= 768) document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    var sb = document.getElementById('gc-shell-sidebar');
    var ov = document.getElementById('gc-shell-overlay');
    if (sb) sb.classList.remove('is-open');
    if (ov) ov.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  function toggleSidebar() {
    var sb = document.getElementById('gc-shell-sidebar');
    if (sb && sb.classList.contains('is-open')) closeSidebar();
    else openSidebar();
  }
  function toggleSection(id) {
    var el = document.getElementById(id);
    if (el) el.classList.toggle('is-open');
  }

  /* ── Mount ────────────────────────────────────────── */
  function init(options) {
    if (initialised) return window.GCShell;
    options = options || {};

    injectStyles();

    var activeSection = options.section || detectSection();
    if (!SECTIONS[activeSection] && activeSection !== 'home') {
      activeSection = 'worldcup2026';
    }

    var mount = options.mount
      ? document.querySelector(options.mount)
      : document.body;
    if (!mount) mount = document.body;

    /* Overlay */
    var overlay = document.createElement('div');
    overlay.className = 'gc-shell-overlay';
    overlay.id = 'gc-shell-overlay';
    overlay.addEventListener('click', closeSidebar);
    document.body.insertBefore(overlay, document.body.firstChild);

    /* Sidebar */
    var sbHolder = document.createElement('div');
    sbHolder.innerHTML = sidebarHTML(activeSection);
    document.body.insertBefore(sbHolder.firstChild, overlay.nextSibling);

    /* Main wrapper */
    var main = document.createElement('div');
    main.className = 'gc-shell-main';
    main.id = 'gc-shell-main';

    /* Header */
    var hdrHolder = document.createElement('div');
    hdrHolder.innerHTML = headerHTML(options, activeSection);
    main.appendChild(hdrHolder.firstChild);

    /* Content slot */
    var content = document.createElement('div');
    content.className = 'gc-shell-content';
    content.id = 'gc-shell-content';

    if (options.contentSelector) {
      var existing = document.querySelector(options.contentSelector);
      if (existing) content.appendChild(existing);
    }
    main.appendChild(content);

    if (mount === document.body) {
      document.body.appendChild(main);
    } else {
      mount.appendChild(main);
    }

    /* Wire controls */
    var hamburger = document.getElementById('gc-shell-hamburger');
    if (hamburger) hamburger.addEventListener('click', toggleSidebar);
    var closeBtn = document.getElementById('gc-shell-sidebar-close');
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);

    var compBtns = document.querySelectorAll('[data-gc-shell-section]');
    Array.prototype.forEach.call(compBtns, function (btn) {
      btn.addEventListener('click', function () {
        toggleSection(btn.getAttribute('data-gc-shell-section'));
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.keyCode === 27) closeSidebar();
    });

    initialised = true;
    return window.GCShell;
  }

  window.GCShell = {
    init: init,
    openSidebar: openSidebar,
    closeSidebar: closeSidebar,
    toggleSidebar: toggleSidebar,
    toggleSection: toggleSection,
    detectSection: detectSection,
    isActive: isActive
  };

  /* Optional auto-init — only if a page explicitly opts in. */
  function maybeAutoInit() {
    if (document.body && document.body.getAttribute('data-gc-shell') === 'auto') {
      init();
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', maybeAutoInit);
  } else {
    maybeAutoInit();
  }

}());
