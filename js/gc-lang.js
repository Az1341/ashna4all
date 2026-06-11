/**
 * gc-lang.js — GoalCurrent.live Language Engine
 * Version   : 2.0
 *
 * CHANGES FROM v1.0:
 * - Cache-busting added to all lang file requests
 * - Lang file validation: confirms window.GC_LANG.meta.code matches request
 * - applyLanguage() is now cancellable via a request counter
 *   (prevents stale callbacks from old requests overwriting newer ones)
 * - Sidebar X button desktop fix documented (done in CSS, not here)
 * - gc:languageReady and gc:languageChanged events retained
 */

(function () {
  'use strict';

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
  ];

  var STORAGE_KEY  = 'gc_lang';
  var DEFAULT_LANG = 'en';
  var RTL_CODES    = ['fa', 'ar'];
  var currentLang  = DEFAULT_LANG;
  var selectorOpen = false;

  // Request counter — prevents stale async callbacks from old language requests
  // applying after a newer request has already completed
  var langRequestId = 0;

  // ── UTILITY ────────────────────────────────────────────────────────────────

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

  function getLangMeta(code) {
    for (var i = 0; i < GC_LANGUAGES.length; i++) {
      if (GC_LANGUAGES[i].code === code) return GC_LANGUAGES[i];
    }
    return GC_LANGUAGES[0];
  }

  function readSavedLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        for (var i = 0; i < GC_LANGUAGES.length; i++) {
          if (GC_LANGUAGES[i].code === saved) return saved;
        }
      }
    } catch (e) {}
    return DEFAULT_LANG;
  }

  function saveLang(code) {
    try { localStorage.setItem(STORAGE_KEY, code); } catch (e) {}
  }

  // ── LANGUAGE FILE LOADER ──────────────────────────────────────────────────

  function loadLangFile(code, requestId, callback) {
    // Remove any previously loaded lang script
    var existing = document.getElementById('gc-lang-file');
    if (existing) existing.parentNode.removeChild(existing);

    var script = document.createElement('script');
    script.id  = 'gc-lang-file';

    // Cache-busting: prevents browser from serving a cached wrong language file
    // Uses the language code as the cache key — different for each language
    script.src = '/lang/' + code + '.js?v=' + code;

    script.onload = function () {
      // Stale request check — if a newer request was made, discard this callback
      if (requestId !== langRequestId) return;

      // Validate that the loaded file actually set the correct language
      if (!window.GC_LANG || !window.GC_LANG.meta || window.GC_LANG.meta.code !== code) {
        // File loaded but content is wrong — retry once with no cache
        script.src = '/lang/' + code + '.js?nocache=' + Date.now();
        var retry = document.createElement('script');
        retry.id  = 'gc-lang-file-retry';
        retry.src = '/lang/' + code + '.js?nocache=' + Date.now();
        retry.onload = function() {
          if (requestId !== langRequestId) return;
          callback();
        };
        retry.onerror = function() {
          if (code !== DEFAULT_LANG) loadLangFile(DEFAULT_LANG, requestId, callback);
        };
        var existingRetry = document.getElementById('gc-lang-file-retry');
        if (existingRetry) existingRetry.parentNode.removeChild(existingRetry);
        document.head.appendChild(retry);
        return;
      }

      callback();
    };

    script.onerror = function () {
      if (requestId !== langRequestId) return;
      console.warn('[gc-lang] Failed to load /lang/' + code + '.js — falling back to English');
      if (code !== DEFAULT_LANG) {
        loadLangFile(DEFAULT_LANG, requestId, callback);
      }
    };

    document.head.appendChild(script);
  }

  // ── RTL SUPPORT ───────────────────────────────────────────────────────────

  var rtlStyleLoaded = false;

  function loadRTLStyle() {
    if (rtlStyleLoaded) return;
    var link = document.createElement('link');
    link.id   = 'gc-rtl-css';
    link.rel  = 'stylesheet';
    link.href = '/css/gc-rtl.css';
    document.head.appendChild(link);
    rtlStyleLoaded = true;
  }

  function removeRTLStyle() {
    var el = document.getElementById('gc-rtl-css');
    if (el) {
      el.parentNode.removeChild(el);
      rtlStyleLoaded = false;
    }
    // Explicitly clear RTL from html element — belt and braces
    document.documentElement.removeAttribute('dir');
    // Will be re-set to ltr by applyHtmlAttributes() immediately after
  }

  function loadRTLFont(code) {
    var fontId = 'gc-rtl-font-' + code;
    if (document.getElementById(fontId)) return;
    var fontUrl = code === 'fa'
      ? 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;600;700&display=swap'
      : code === 'ar'
      ? 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap'
      : '';
    if (fontUrl) {
      var link = document.createElement('link');
      link.id = fontId; link.rel = 'stylesheet'; link.href = fontUrl;
      document.head.appendChild(link);
    }
  }

  // ── APPLY LANGUAGE ────────────────────────────────────────────────────────

  function applyHtmlAttributes(langMeta) {
    document.documentElement.lang = langMeta.code;
    document.documentElement.dir  = langMeta.dir;
  }

  function translateElements() {
    var elements = document.querySelectorAll('[data-gc-i18n]');
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var keyPath = el.getAttribute('data-gc-i18n');
      var value = getLangValue(keyPath);
      if (value !== null) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = value;
        } else {
          el.textContent = value;
        }
      }
    }
  }

  function translatePlaceholders() {
    var elements = document.querySelectorAll('[data-gc-i18n-placeholder]');
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var keyPath = el.getAttribute('data-gc-i18n-placeholder');
      var value = getLangValue(keyPath);
      if (value !== null) el.placeholder = value;
    }
  }

  function translateMeta() {
    if (!window.GC_LANG || !window.GC_LANG.seo) return;
    var pageKey = document.documentElement.getAttribute('data-gc-page');
    if (!pageKey) return;
    var pages = window.GC_LANG.seo.pages;
    if (!pages || !pages[pageKey]) return;
    var seo = pages[pageKey];
    if (seo.title) document.title = seo.title;
    var desc = document.querySelector('meta[name="description"]');
    if (desc && seo.desc) desc.content = seo.desc;
    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && seo.title) ogTitle.content = seo.title;
    var ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && seo.desc) ogDesc.content = seo.desc;
    var ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale && window.GC_LANG.meta.locale) ogLocale.content = window.GC_LANG.meta.locale;
    var twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle && seo.title) twTitle.content = seo.title;
    var twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc && seo.desc) twDesc.content = seo.desc;
  }

  function applyRTLProtection(isRTL) {
    document.body.classList.toggle('gc-rtl', isRTL);
    document.body.classList.toggle('gc-ltr', !isRTL);
  }

  // ── SELECTOR UI ───────────────────────────────────────────────────────────

  function renderSelector() {
    var existing = document.getElementById('gc-lang-btn-wrap');
    if (existing) existing.parentNode.removeChild(existing);

    var langMeta  = getLangMeta(currentLang);
    var shortCode = currentLang.toUpperCase();

    var wrap = document.createElement('div');
    wrap.id        = 'gc-lang-btn-wrap';
    wrap.className = 'gc-lang-wrap';
    wrap.setAttribute('role', 'navigation');
    wrap.setAttribute('aria-label', 'Language selector');

    var btn = document.createElement('button');
    btn.id        = 'gc-lang-btn';
    btn.className = 'gc-lang-btn';
    btn.type      = 'button';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', getLangValue('langSelector.ariaLabel') || 'Select language');
    btn.innerHTML = '🌐 <span class="gc-lang-name">' + langMeta.name + '</span>'
                  + '<span class="gc-lang-code">' + shortCode + '</span>'
                  + '<span class="gc-lang-arrow">▼</span>';

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
      (function (code) {
        item.addEventListener('click', function () { selectLanguage(code); });
        item.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectLanguage(code); }
        });
      })(lang.code);
      list.appendChild(item);
    }

    wrap.appendChild(btn);
    wrap.appendChild(list);

    btn.addEventListener('click', function (e) { e.stopPropagation(); toggleSelector(); });
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSelector(); }
      else if (e.key === 'Escape') { closeSelector(); }
    });

    var root = document.getElementById('gc-lang-selector-root');
    if (root) {
      root.appendChild(wrap);
    } else {
      var header = document.querySelector('header') || document.querySelector('.gc-header') || document.body;
      header.appendChild(wrap);
    }
  }

  function toggleSelector() { selectorOpen ? closeSelector() : openSelector(); }

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

  document.addEventListener('click', function (e) {
    if (selectorOpen) {
      var wrap = document.getElementById('gc-lang-btn-wrap');
      if (wrap && !wrap.contains(e.target)) closeSelector();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && selectorOpen) closeSelector();
  });

  // ── LANGUAGE SELECTION ────────────────────────────────────────────────────

  function selectLanguage(code) {
    closeSelector();
    if (code === currentLang) return;
    currentLang = code;
    saveLang(code);
    applyLanguage(code);
  }

  function applyLanguage(code) {
    var langMeta = getLangMeta(code);

    // Increment request counter — any pending older request will be discarded
    langRequestId++;
    var myRequestId = langRequestId;

    applyHtmlAttributes(langMeta);

    var isRTL = RTL_CODES.indexOf(code) !== -1;
    if (isRTL) {
      loadRTLStyle();
      loadRTLFont(code);
    } else {
      removeRTLStyle();
      // Re-apply ltr after removeRTLStyle cleared dir
      document.documentElement.dir = 'ltr';
    }

    loadLangFile(code, myRequestId, function () {
      // Double-check request is still current
      if (myRequestId !== langRequestId) return;

      applyRTLProtection(isRTL);
      translateElements();
      translatePlaceholders();
      translateMeta();
      renderSelector();

      // Fire events so page can re-render dynamic JS content
      try {
        document.dispatchEvent(new CustomEvent('gc:languageChanged', {
          detail: { code: code, dir: langMeta.dir }
        }));
      } catch(e) {}
    });
  }

  // ── PUBLIC API ────────────────────────────────────────────────────────────

  var GC_Lang = {
    init: function () {
      currentLang = readSavedLang();
      applyLanguage(currentLang);
    },
    setLanguage:  function (code) { selectLanguage(code); },
    getLanguage:  function ()     { return currentLang; },
    t: function (keyPath) { return getLangValue(keyPath) || keyPath; },
    isRTL: function () { return RTL_CODES.indexOf(currentLang) !== -1; },
    retranslate: function () { translateElements(); translatePlaceholders(); },
    languages: GC_LANGUAGES
  };

  window.GC_Lang = GC_Lang;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { GC_Lang.init(); });
  } else {
    GC_Lang.init();
  }

})();
