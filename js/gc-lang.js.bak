/**
 * gc-lang.js — GoalCurrent.live Language Engine
 * Version   : 1.0
 * Purpose   : Complete multilingual system for goalcurrent.live
 *
 * HOW IT WORKS:
 * 1. Reads saved language from localStorage on every page load
 * 2. Loads the correct /lang/xx.js file dynamically
 * 3. Sets html[lang] and html[dir] for SEO and accessibility
 * 4. Translates all [data-gc-i18n] elements
 * 5. Updates all SEO meta tags
 * 6. Renders the language selector in the header
 * 7. Saves selection to localStorage for persistence
 *
 * ADDING A NEW LANGUAGE:
 * 1. Create /lang/xx.js using en.js as template
 * 2. Add one entry to GC_LANGUAGES array below
 * Done — no other changes required anywhere.
 *
 * ADDING TO A NEW PAGE:
 * 1. Add <script src="/js/gc-lang.js"></script> to <head>
 * 2. Add <link rel="stylesheet" href="/css/gc-lang-selector.css"> to <head>
 * 3. Add data-gc-page="pageKey" attribute to <html> element
 * 4. Add data-gc-i18n="category.key" to any translatable element
 * Done — language system works automatically.
 */

(function () {
  'use strict';

  // ── MASTER LANGUAGE REGISTRY ───────────────────────────────────────────────
  // To add a new language: add one entry here and create /lang/xx.js
  // native name ONLY — never translated
  var GC_LANGUAGES = [
    { code: 'en', name: 'English',    dir: 'ltr', flag: '🇬🇧' },
    { code: 'fa', name: 'فارسی',      dir: 'rtl', flag: '🇮🇷' },
    { code: 'ar', name: 'العربية',    dir: 'rtl', flag: '🇸🇦' },
    { code: 'fr', name: 'Français',   dir: 'ltr', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch',    dir: 'ltr', flag: '🇩🇪' },
    { code: 'es', name: 'Español',    dir: 'ltr', flag: '🇪🇸' },
    { code: 'pt', name: 'Português',  dir: 'ltr', flag: '🇧🇷' },
    { code: 'it', name: 'Italiano',   dir: 'ltr', flag: '🇮🇹' },
    { code: 'nl', name: 'Nederlands', dir: 'ltr', flag: '🇳🇱' },
    { code: 'tr', name: 'Türkçe',     dir: 'ltr', flag: '🇹🇷' }
    // Future: { code: 'ja', name: '日本語', dir: 'ltr', flag: '🇯🇵' }
  ];

  var STORAGE_KEY    = 'gc_lang';         // localStorage key
  var DEFAULT_LANG   = 'en';              // fallback language
  var RTL_CODES      = ['fa', 'ar'];      // languages that need RTL layout
  var currentLang    = DEFAULT_LANG;
  var selectorOpen   = false;

  // ── UTILITY ────────────────────────────────────────────────────────────────

  /**
   * Safely read a nested key like "nav.liveScores" from window.GC_LANG.
   * Returns null if not found — calling code handles the fallback.
   */
  function getLangValue(keyPath) {
    if (!window.GC_LANG) return null;
    var parts = keyPath.split('.');
    var obj = window.GC_LANG;
    for (var i = 0; i < parts.length; i++) {
      if (obj === null || obj === undefined) return null;
      obj = obj[parts[i]];
    }
    return (typeof obj === 'string') ? obj : null;
  }

  /** Get the language object from registry by code */
  function getLangMeta(code) {
    for (var i = 0; i < GC_LANGUAGES.length; i++) {
      if (GC_LANGUAGES[i].code === code) return GC_LANGUAGES[i];
    }
    return GC_LANGUAGES[0]; // fallback to English
  }

  /** Read saved language from localStorage. Fallback to DEFAULT_LANG. */
  function readSavedLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        // Verify it's in our registry — reject unknown codes
        for (var i = 0; i < GC_LANGUAGES.length; i++) {
          if (GC_LANGUAGES[i].code === saved) return saved;
        }
      }
    } catch (e) {
      // localStorage unavailable (private browsing etc) — use default
    }
    return DEFAULT_LANG;
  }

  /** Save selected language to localStorage for persistence. */
  function saveLang(code) {
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch (e) {
      // Silently fail if localStorage unavailable
    }
  }

  // ── LANGUAGE FILE LOADER ──────────────────────────────────────────────────

  /**
   * Dynamically load /lang/xx.js then call the callback.
   * If English is already the default and window.GC_LANG is set, skip load.
   */
  function loadLangFile(code, callback) {
    // If the lang file is already loaded for this code, skip
    if (window.GC_LANG && window.GC_LANG.meta && window.GC_LANG.meta.code === code) {
      callback();
      return;
    }

    // Remove any previously loaded lang script
    var existing = document.getElementById('gc-lang-file');
    if (existing) existing.parentNode.removeChild(existing);

    var script = document.createElement('script');
    script.id  = 'gc-lang-file';
    script.src = '/lang/' + code + '.js';

    script.onload = function () {
      callback();
    };

    script.onerror = function () {
      // If lang file fails to load, fall back to English
      console.warn('[gc-lang] Failed to load /lang/' + code + '.js — falling back to English');
      if (code !== DEFAULT_LANG) {
        loadLangFile(DEFAULT_LANG, callback);
      }
    };

    document.head.appendChild(script);
  }

  // ── RTL SUPPORT ───────────────────────────────────────────────────────────

  var rtlStyleLoaded = false;

  /** Load gc-rtl.css only when an RTL language is active. */
  function loadRTLStyle() {
    if (rtlStyleLoaded) return;
    var link = document.createElement('link');
    link.id   = 'gc-rtl-css';
    link.rel  = 'stylesheet';
    link.href = '/css/gc-rtl.css';
    document.head.appendChild(link);
    rtlStyleLoaded = true;
  }

  /** Remove RTL stylesheet when switching back to LTR. */
  function removeRTLStyle() {
    var el = document.getElementById('gc-rtl-css');
    if (el) {
      el.parentNode.removeChild(el);
      rtlStyleLoaded = false;
    }
  }

  /** Load RTL font (Vazirmatn for FA, Cairo for AR) on demand. */
  function loadRTLFont(code) {
    var fontId = 'gc-rtl-font-' + code;
    if (document.getElementById(fontId)) return; // already loaded

    var fontUrl = '';
    if (code === 'fa') {
      fontUrl = 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;600;700&display=swap';
    } else if (code === 'ar') {
      fontUrl = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap';
    }

    if (fontUrl) {
      var link = document.createElement('link');
      link.id   = fontId;
      link.rel  = 'stylesheet';
      link.href = fontUrl;
      document.head.appendChild(link);
    }
  }

  // ── APPLY LANGUAGE TO PAGE ─────────────────────────────────────────────────

  /**
   * Set html[lang] and html[dir].
   * This runs immediately — before the rest of the page renders.
   * Critical for SEO and screen readers.
   */
  function applyHtmlAttributes(langMeta) {
    document.documentElement.lang = langMeta.code;
    document.documentElement.dir  = langMeta.dir;
  }

  /**
   * Translate all elements that have data-gc-i18n attribute.
   * Format: data-gc-i18n="category.key"
   * Example: <span data-gc-i18n="nav.liveScores">Live Scores</span>
   *
   * The existing English text is preserved as fallback — if a key
   * is not found in the language file, the element is left unchanged.
   */
  function translateElements() {
    var elements = document.querySelectorAll('[data-gc-i18n]');
    for (var i = 0; i < elements.length; i++) {
      var el      = elements[i];
      var keyPath = el.getAttribute('data-gc-i18n');
      var value   = getLangValue(keyPath);
      if (value !== null) {
        // For inputs, update placeholder not text content
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = value;
        } else {
          el.textContent = value;
        }
      }
      // If value is null, leave the element's existing text — English fallback
    }
  }

  /**
   * Update placeholder attributes specifically.
   * Format: data-gc-i18n-placeholder="category.key"
   */
  function translatePlaceholders() {
    var elements = document.querySelectorAll('[data-gc-i18n-placeholder]');
    for (var i = 0; i < elements.length; i++) {
      var el      = elements[i];
      var keyPath = el.getAttribute('data-gc-i18n-placeholder');
      var value   = getLangValue(keyPath);
      if (value !== null) el.placeholder = value;
    }
  }

  /**
   * Update all SEO meta tags dynamically.
   * Reads the page key from <html data-gc-page="pageKey">
   */
  function translateMeta() {
    if (!window.GC_LANG || !window.GC_LANG.seo) return;

    var pageKey = document.documentElement.getAttribute('data-gc-page');
    if (!pageKey) return;

    var pages = window.GC_LANG.seo.pages;
    if (!pages || !pages[pageKey]) return;

    var seo = pages[pageKey];

    // Title
    if (seo.title) document.title = seo.title;

    // Meta description
    var desc = document.querySelector('meta[name="description"]');
    if (desc && seo.desc) desc.content = seo.desc;

    // OG title
    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && seo.title) ogTitle.content = seo.title;

    // OG description
    var ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && seo.desc) ogDesc.content = seo.desc;

    // OG locale
    var ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale && window.GC_LANG.meta.locale) ogLocale.content = window.GC_LANG.meta.locale;

    // Twitter title
    var twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle && seo.title) twTitle.content = seo.title;

    // Twitter description
    var twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc && seo.desc) twDesc.content = seo.desc;
  }

  /**
   * Apply RTL-specific body class so CSS can target it.
   * Also ensures all score/time/stats containers stay LTR.
   */
  function applyRTLProtection(isRTL) {
    if (isRTL) {
      document.body.classList.add('gc-rtl');
      document.body.classList.remove('gc-ltr');
    } else {
      document.body.classList.add('gc-ltr');
      document.body.classList.remove('gc-rtl');
    }
  }

  // ── LANGUAGE SELECTOR UI ──────────────────────────────────────────────────

  /**
   * Build and inject the language selector into the page header.
   * Looks for id="gc-lang-selector-root" first.
   * If not found, appends to the first <header> element found.
   * If no header exists, appends to body as fixed element.
   */
  function renderSelector() {
    // Remove existing selector if present (re-render on language change)
    var existing = document.getElementById('gc-lang-btn-wrap');
    if (existing) existing.parentNode.removeChild(existing);

    var langMeta  = getLangMeta(currentLang);
    var shortCode = currentLang.toUpperCase(); // For mobile: EN, FA, etc.

    // Build wrapper
    var wrap = document.createElement('div');
    wrap.id             = 'gc-lang-btn-wrap';
    wrap.className      = 'gc-lang-wrap';
    wrap.setAttribute('role', 'navigation');
    wrap.setAttribute('aria-label', 'Language selector');

    // Build button
    var btn = document.createElement('button');
    btn.id          = 'gc-lang-btn';
    btn.className   = 'gc-lang-btn';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label',
      getLangValue('langSelector.ariaLabel') || 'Select language'
    );
    btn.innerHTML = '🌐 <span class="gc-lang-name">' + langMeta.name + '</span>'
                  + '<span class="gc-lang-code">' + shortCode + '</span>'
                  + '<span class="gc-lang-arrow">▼</span>';

    // Build dropdown list
    var list = document.createElement('ul');
    list.id        = 'gc-lang-list';
    list.className = 'gc-lang-list';
    list.setAttribute('role', 'listbox');
    list.style.display = 'none';

    for (var i = 0; i < GC_LANGUAGES.length; i++) {
      var lang = GC_LANGUAGES[i];
      var item = document.createElement('li');
      item.className = 'gc-lang-item' + (lang.code === currentLang ? ' gc-lang-active' : '');
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', lang.code === currentLang ? 'true' : 'false');
      item.setAttribute('data-lang-code', lang.code);
      item.setAttribute('tabindex', '0');
      item.innerHTML = (lang.code === currentLang ? '<span class="gc-lang-check">✓</span> ' : '<span class="gc-lang-check"> </span> ')
                     + lang.name;

      // Click handler
      (function (code) {
        item.addEventListener('click', function () {
          selectLanguage(code);
        });
        item.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectLanguage(code);
          }
        });
      })(lang.code);

      list.appendChild(item);
    }

    wrap.appendChild(btn);
    wrap.appendChild(list);

    // Toggle open/close
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleSelector();
    });

    // Keyboard: open on Enter/Space, close on Escape
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleSelector();
      } else if (e.key === 'Escape') {
        closeSelector();
      }
    });

    // Inject into page
    var root = document.getElementById('gc-lang-selector-root');
    if (root) {
      root.appendChild(wrap);
    } else {
      var header = document.querySelector('header') || document.querySelector('.gc-header') || document.body;
      header.appendChild(wrap);
    }
  }

  function toggleSelector() {
    selectorOpen ? closeSelector() : openSelector();
  }

  function openSelector() {
    var list = document.getElementById('gc-lang-list');
    var btn  = document.getElementById('gc-lang-btn');
    if (!list || !btn) return;
    list.style.display = 'block';
    btn.setAttribute('aria-expanded', 'true');
    btn.classList.add('gc-lang-btn--open');
    selectorOpen = true;
  }

  function closeSelector() {
    var list = document.getElementById('gc-lang-list');
    var btn  = document.getElementById('gc-lang-btn');
    if (!list || !btn) return;
    list.style.display = 'none';
    btn.setAttribute('aria-expanded', 'false');
    btn.classList.remove('gc-lang-btn--open');
    selectorOpen = false;
  }

  // Close when clicking anywhere outside the selector
  document.addEventListener('click', function (e) {
    if (selectorOpen) {
      var wrap = document.getElementById('gc-lang-btn-wrap');
      if (wrap && !wrap.contains(e.target)) {
        closeSelector();
      }
    }
  });

  // Close on Escape key anywhere on page
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && selectorOpen) {
      closeSelector();
    }
  });

  // Auto-close selector when any modal/popup opens
  // Listens for the common patterns used on goalcurrent.live
  document.addEventListener('click', function (e) {
    // If a match card, popup trigger, or cookie button is clicked, close selector
    if (e.target.closest && (
        e.target.closest('.match-card') ||
        e.target.closest('.gc-popup') ||
        e.target.closest('#cookieAccept') ||
        e.target.closest('#cookieDecline') ||
        e.target.closest('.gc-subscribe-close')
    )) {
      closeSelector();
    }
  });

  // ── LANGUAGE SELECTION ─────────────────────────────────────────────────────

  /**
   * Main function called when user selects a language.
   * Saves, loads, applies, translates — in correct order.
   */
  function selectLanguage(code) {
    closeSelector();
    if (code === currentLang) return; // No change needed

    currentLang = code;
    saveLang(code);
    applyLanguage(code);
  }

  /**
   * Apply a language to the current page.
   * Handles the full sequence: load file → set attributes → translate → update UI.
   */
  function applyLanguage(code) {
    var langMeta = getLangMeta(code);

    // 1. Set html[lang] and html[dir] immediately — before file loads
    applyHtmlAttributes(langMeta);

    // 2. Handle RTL CSS
    var isRTL = RTL_CODES.indexOf(code) !== -1;
    if (isRTL) {
      loadRTLStyle();
      loadRTLFont(code);
    } else {
      removeRTLStyle();
    }

    // 3. Load the language file, then translate everything
    loadLangFile(code, function () {
      applyRTLProtection(isRTL);
      translateElements();
      translatePlaceholders();
      translateMeta();
      renderSelector(); // Re-render to update active item highlight
    });
  }

  // ── INITIALISATION ────────────────────────────────────────────────────────

  /**
   * GC_Lang.init() — call this to start the language system.
   * Called automatically on DOMContentLoaded below.
   * Can also be called manually if needed.
   */
  var GC_Lang = {

    init: function () {
      currentLang = readSavedLang();
      applyLanguage(currentLang);
    },

    /**
     * Switch language programmatically.
     * Usage: GC_Lang.setLanguage('fa');
     */
    setLanguage: function (code) {
      selectLanguage(code);
    },

    /**
     * Get current active language code.
     * Usage: GC_Lang.getLanguage(); // returns 'en', 'fa', etc.
     */
    getLanguage: function () {
      return currentLang;
    },

    /**
     * Get a translation value by key path.
     * Usage: GC_Lang.t('nav.liveScores'); // returns 'Live Scores' in active lang
     */
    t: function (keyPath) {
      return getLangValue(keyPath) || keyPath;
    },

    /**
     * Check if current language is RTL.
     * Useful for page-specific JS that needs to know direction.
     */
    isRTL: function () {
      return RTL_CODES.indexOf(currentLang) !== -1;
    },

    /**
     * Force re-translation of all elements.
     * Useful after dynamically injected content (e.g. API-loaded fixtures).
     * Usage: GC_Lang.retranslate();
     */
    retranslate: function () {
      translateElements();
      translatePlaceholders();
    },

    /** Expose language list for external use */
    languages: GC_LANGUAGES
  };

  // Expose globally
  window.GC_Lang = GC_Lang;

  // Auto-initialise when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      GC_Lang.init();
    });
  } else {
    // DOM already ready (script loaded at bottom of body)
    GC_Lang.init();
  }

})();
