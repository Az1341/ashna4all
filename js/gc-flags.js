/**
 * GoalCurrent.live — gc-flags.js
 * Single global flag resolver for World Cup 2026 team names.
 *
 * Depends on: /js/worldcup-data.js (optional — merges WC26.flags when present)
 *
 * Usage:
 *   GCFlags.code('Germany')        → 'de'
 *   GCFlags.url('Curaçao', 80)     → flagcdn URL
 *   GCFlags.img('Netherlands', { w: 36, h: 24 })
 *   GCFlags.normalize('Curacao')   → canonical lookup key
 *
 * Never falls back to football emoji (⚽).
 */
(function () {
  'use strict';

  /* Canonical name → ISO code (mirrors worldcup-data.js + common aliases) */
  var ALIASES = {
    'Mexico': 'mx',
    'South Africa': 'za',
    'Korea Republic': 'kr',
    'South Korea': 'kr',
    'Czechia': 'cz',
    'Czech Republic': 'cz',
    'Canada': 'ca',
    'Bosnia & Herzegovina': 'ba',
    'Bosnia & Herz.': 'ba',
    'Bosnia and Herzegovina': 'ba',
    'Qatar': 'qa',
    'Switzerland': 'ch',
    'Brazil': 'br',
    'Morocco': 'ma',
    'Haiti': 'ht',
    'Scotland': 'gb-sct',
    'USA': 'us',
    'United States': 'us',
    'Paraguay': 'py',
    'Australia': 'au',
    'Türkiye': 'tr',
    'Turkey': 'tr',
    'Germany': 'de',
    'Curaçao': 'cw',
    'Curacao': 'cw',
    "Côte d'Ivoire": 'ci',
    'Ivory Coast': 'ci',
    'Ecuador': 'ec',
    'Netherlands': 'nl',
    'Japan': 'jp',
    'Sweden': 'se',
    'Tunisia': 'tn',
    'Belgium': 'be',
    'Egypt': 'eg',
    'IR Iran': 'ir',
    'Iran': 'ir',
    'New Zealand': 'nz',
    'Spain': 'es',
    'Cabo Verde': 'cv',
    'Cape Verde': 'cv',
    'Saudi Arabia': 'sa',
    'Uruguay': 'uy',
    'France': 'fr',
    'Senegal': 'sn',
    'Iraq': 'iq',
    'Norway': 'no',
    'Argentina': 'ar',
    'Algeria': 'dz',
    'Austria': 'at',
    'Jordan': 'jo',
    'Portugal': 'pt',
    'Congo DR': 'cd',
    'DR Congo': 'cd',
    'Uzbekistan': 'uz',
    'Colombia': 'co',
    'England': 'gb-eng',
    'Croatia': 'hr',
    'Ghana': 'gh',
    'Panama': 'pa'
  };

  var NORM = {};

  function strip(s) {
    return String(s == null ? '' : s)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  function buildNormMap() {
    var map = {};
    var src = ALIASES;
    if (window.WC26 && WC26.flags) {
      src = Object.assign({}, WC26.flags, ALIASES);
    }
    Object.keys(src).forEach(function (name) {
      map[strip(name)] = src[name];
      map[name] = src[name];
    });
    map.curacao = 'cw';
    NORM = map;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function lookupRaw(name) {
    if (!name) return null;
    if (window.WC26 && WC26.flags && WC26.flags[name]) return WC26.flags[name];
    if (ALIASES[name]) return ALIASES[name];
    var n = strip(name);
    if (NORM[n]) return NORM[n];
    return null;
  }

  function code(teamName) {
    if (!Object.keys(NORM).length) buildNormMap();
    return lookupRaw(teamName) || 'un';
  }

  function url(teamName, width) {
    width = width || 80;
    return 'https://flagcdn.com/w' + width + '/' + code(teamName) + '.png';
  }

  /* Regional-indicator emoji for a 2-letter ISO code (e.g. 'nl' → 🇳🇱).
     Returns '' for sub-region codes like 'gb-eng' (no simple emoji). */
  function flagEmoji(c2) {
    if (!c2 || c2.length !== 2) return '';
    var OFFSET = 0x1F1E6 - 65;
    var up = c2.toUpperCase();
    try {
      return String.fromCodePoint(up.charCodeAt(0) + OFFSET, up.charCodeAt(1) + OFFSET);
    } catch (e) { return ''; }
  }

  /* onerror handler: replace a failed flag <img> with the emoji flag,
     or a neutral grey placeholder — never a football emoji, never text. */
  function imgError(el) {
    if (!el || !el.parentNode) return;
    var em = el.getAttribute('data-gcemoji') || '';
    var w = el.getAttribute('width') || 36;
    var h = el.getAttribute('height') || 24;
    var span = document.createElement('span');
    if (em) {
      span.textContent = em;
      span.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;width:' +
        w + 'px;height:' + h + 'px;font-size:' + Math.round(h * 0.95) + 'px;line-height:1;flex-shrink:0';
    } else {
      span.className = 'gc-flag-placeholder';
      span.style.cssText = 'display:inline-block;width:' + w + 'px;height:' + h +
        'px;background:#e2e8f0;border-radius:4px;flex-shrink:0';
    }
    if (el.className) span.className = (span.className ? span.className + ' ' : '') + el.className;
    el.parentNode.replaceChild(span, el);
  }

  function img(teamName, opts) {
    opts = opts || {};
    var w = opts.w || 36;
    var h = opts.h || 24;
    var cls = opts.className ? ' class="' + esc(opts.className) + '"' : '';
    var loading = opts.loading || 'lazy';
    var c = code(teamName);

    if (c === 'un' && !lookupRaw(teamName)) {
      return '<span class="gc-flag-placeholder"' + cls +
        ' style="display:inline-block;width:' + w + 'px;height:' + h +
        'px;background:#e2e8f0;border-radius:4px;flex-shrink:0" aria-hidden="true"></span>';
    }

    var em = flagEmoji(c);
    return '<img src="' + esc(url(teamName, 80)) + '"' +
      ' srcset="' + esc(url(teamName, 160)) + ' 2x"' +
      ' alt="' + esc(teamName) + ' flag"' +
      ' width="' + w + '" height="' + h + '"' +
      ' data-gcemoji="' + esc(em) + '"' +
      ' onerror="window.GCFlags&&GCFlags._imgError&&GCFlags._imgError(this)"' +
      cls +
      ' style="object-fit:cover;border-radius:4px;display:block;flex-shrink:0"' +
      ' loading="' + esc(loading) + '">';
  }

  function normalize(teamName) {
    if (!teamName) return '';
    if (window.WC26 && WC26.flags && WC26.flags[teamName]) return teamName;
    if (ALIASES[teamName]) return teamName;
    var n = strip(teamName);
    var keys = Object.keys(ALIASES);
    for (var i = 0; i < keys.length; i++) {
      if (strip(keys[i]) === n) return keys[i];
    }
    if (window.WC26 && WC26.flags) {
      keys = Object.keys(WC26.flags);
      for (var j = 0; j < keys.length; j++) {
        if (strip(keys[j]) === n) return keys[j];
      }
    }
    return teamName;
  }

  buildNormMap();

  window.GCFlags = {
    code: code,
    url: url,
    img: img,
    emoji: flagEmoji,
    normalize: normalize,
    refresh: buildNormMap,
    _imgError: imgError
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildNormMap);
  }

}());
