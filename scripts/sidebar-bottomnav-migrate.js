#!/usr/bin/env node
/**
 * Remove sidebars + inject gc-bottomnav across all HTML files.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function walkHtml(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      if (name === 'node_modules' || name === '.git') continue;
      walkHtml(p, out);
    } else if (name.endsWith('.html')) {
      out.push(p);
    }
  }
  return out;
}

function dedupeFiles(files) {
  const seen = new Set();
  const out = [];
  for (const f of files) {
    const key = f.replace(/\\/g, '/').toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(f);
    }
  }
  return out.sort();
}

function getActiveTab(relPath) {
  const p = relPath.replace(/\\/g, '/').toLowerCase();
  if (p.includes('premier-league/') || p === 'premier-league/index.html') return 'pl';
  if (p.includes('worldcup2026/') || p === 'worldcup2026/index.html') return 'wc';
  if (p.includes('ucl/') || p === 'ucl/index.html') return 'ucl';
  if (p.includes('live/') || p === 'live/index.html') return 'live';
  return 'home';
}

function buildBottomNav(active) {
  const tabs = [
    { id: 'home', href: '/', icon: '🏠', label: 'Home' },
    { id: 'live', href: '/live/', icon: '⚡', label: 'Live' },
    { id: 'pl', href: '/premier-league/', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', label: 'PL' },
    { id: 'wc', href: '/worldcup2026/', icon: '🌍', label: 'WC26' },
    { id: 'ucl', href: '/ucl/', icon: '🏆', label: 'UCL' },
  ];
  const links = tabs.map(function (t) {
    const cls = t.id === active ? 'gc-tab active' : 'gc-tab';
    return '  <a href="' + t.href + '" class="' + cls + '">\n' +
      '    <span class="gc-tab-icon">' + t.icon + '</span>\n' +
      '    <span class="gc-tab-label">' + t.label + '</span>\n' +
      '  </a>';
  }).join('\n');
  return '<nav class="gc-bottomnav" role="navigation" aria-label="Main navigation">\n' +
    links + '\n</nav>';
}

const SIDEBAR_SELECTOR_RE = new RegExp(
  [
    '#gc-sidebar(?:-overlay|-close)?',
    '\\.gc-sidebar',
    '#sidebar\\b',
    '(?<![\\w-])\\.sidebar\\b',
    '#gcSidebar\\b',
    '\\.sb-overlay',
    '\\.sb-comp\\b',
    '\\.sb-footer',
    '\\.gc-hamburger',
    '\\.hamb\\b',
    '#overlay\\b',
    '\\.overlay\\.show',
    '\\.sidebar-header',
    '\\.sidebar-logo',
    '\\.sidebar-close',
    '\\.sidebar-nav',
    '\\.sidebar-section-label',
    '\\.sidebar-footer-social',
    '\\.nav-icon',
    '\\.sb-logo',
    '\\.sb-section',
    '\\.sb-nav-link',
    '\\.sb-comp-btn',
    '\\.sb-comp-badge',
    '\\.sb-chevron',
    '\\.sb-links',
    '\\.sb-link-icon',
    '\\.sb-footer',
    '\\.sb-divider',
    '\\.sb-wrap',
    '\\.sb-sec\\b',
    '\\.sb-close',
    '\\.sb-social',
    '\\.sb-icon',
    '\\.side-link',
    '\\.side-section',
    '\\.side-sub',
    '\\.side-foot',
    '\\.comp-title',
    '\\.brand\\b',
    '--sidebar-w',
    '--sb-w\\b',
    '--sidebar-width',
    '--sidebar-bg',
  ].join('|'),
  'i'
);

function stripCssRules(css) {
  let result = '';
  let i = 0;
  while (i < css.length) {
    if (/\s/.test(css[i])) {
      i++;
      continue;
    }
    const ch = css[i];
    if (ch === '@') {
      const block = extractAtRule(css, i);
      const cleaned = cleanAtRule(block.text);
      if (cleaned.trim()) result += cleaned;
      i = block.end;
      continue;
    }
    if (isSelectorStart(css, i)) {
      const block = extractRuleBlock(css, i);
      if (!SIDEBAR_SELECTOR_RE.test(block.selector)) {
        result += block.text;
      }
      i = block.end;
      continue;
    }
    result += ch;
    i++;
  }
  return cleanupCss(result);
}

function isSelectorStart(css, i) {
  const c = css[i];
  return /[.#\[:a-zA-Z_*]/.test(c);
}

function extractRuleBlock(css, start) {
  let i = start;
  while (i < css.length && css[i] !== '{') i++;
  const selector = css.slice(start, i).trim();
  const bodyStart = i;
  let depth = 0;
  while (i < css.length) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}') {
      depth--;
      if (depth === 0) {
        i++;
        break;
      }
    }
    i++;
  }
  return { selector, text: css.slice(start, i), end: i };
}

function extractAtRule(css, start) {
  let i = start;
  while (i < css.length && css[i] !== '{') i++;
  const prelude = css.slice(start, i);
  let depth = 0;
  const bodyStart = i;
  while (i < css.length) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}') {
      depth--;
      if (depth === 0) {
        i++;
        break;
      }
    }
    i++;
  }
  const text = css.slice(start, i);
  if (/^@media/i.test(prelude)) {
    const inner = text.slice(text.indexOf('{') + 1, text.lastIndexOf('}'));
    const cleanedInner = stripCssRules(inner);
    if (!cleanedInner.trim()) return { text: '', end: i };
    return { text: prelude + '{' + cleanedInner + '}', end: i };
  }
  if (/^@keyframes/i.test(prelude)) return { text, end: i };
  return { text: '', end: i };
}

function cleanAtRule(text) {
  if (!/^@media/i.test(text)) return text;
  const open = text.indexOf('{');
  const close = text.lastIndexOf('}');
  if (open < 0 || close < 0) return text;
  const inner = stripCssRules(text.slice(open + 1, close));
  if (!inner.trim()) return '';
  return text.slice(0, open + 1) + inner + '}';
}

function cleanupCss(css) {
  let out = css
    .replace(/\/\*[^*]*SIDEBAR[^*]*\*\/[\s\S]*?(?=\/\*|$)/gi, '')
    .replace(/margin-left\s*:\s*var\(--(?:sidebar-w|sb-w|sidebar-width)\)[^;]*;?/gi, '')
    .replace(/padding-left\s*:\s*60px[^;]*;?/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\{\s*\}/g, '');

  // Drop broken @media blocks (e.g. truncated by partial rule removal)
  out = out.replace(/@media[^{]+\{[^}]*$/g, '');
  out = out.replace(/@media[^{]+\{[^}]*\.gc-main\{[^}]*$/g, '');

  return out;
}

function removeBalancedElement(html, openRe) {
  const m = openRe.exec(html);
  if (!m) return html;
  const start = m.index;
  const tagMatch = m[0].match(/^<(\w+)/i);
  if (!tagMatch) return html;
  const tag = tagMatch[1].toLowerCase();
  let i = m.index + m[0].length;
  let depth = 1;
  const closeRe = new RegExp('<\\/' + tag + '\\s*>', 'gi');
  const openTagRe = new RegExp('<' + tag + '(\\s[^>]*)?>', 'gi');
  while (depth > 0 && i < html.length) {
    openTagRe.lastIndex = i;
    closeRe.lastIndex = i;
    const nextOpen = openTagRe.exec(html);
    const nextClose = closeRe.exec(html);
    if (!nextClose) break;
    if (nextOpen && nextOpen.index < nextClose.index) {
      depth++;
      i = nextOpen.index + nextOpen[0].length;
    } else {
      depth--;
      i = nextClose.index + nextClose[0].length;
      if (depth === 0) {
        return html.slice(0, start) + html.slice(i);
      }
    }
  }
  return html;
}

function removeSidebarHtml(html) {
  let out = html;

  const removals = [
    /<button[^>]*id=["']gc-hamburger["'][^>]*>[\s\S]*?<\/button>/gi,
    /<button[^>]*class=["'][^"']*\bgc-hamburger\b[^"']*["'][^>]*>[\s\S]*?<\/button>/gi,
    /<button[^>]*class=["'][^"']*\bsb-hamburger\b[^"']*["'][^>]*>[\s\S]*?<\/button>/gi,
    /<button[^>]*class=["'][^"']*\bhamb\b[^"']*["'][^>]*>[\s\S]*?<\/button>/gi,
    /<div[^>]*id=["']gc-sidebar-overlay["'][^>]*>\s*<\/div>/gi,
    /<div[^>]*class=["'][^"']*\bsb-overlay\b[^"']*["'][^>]*>\s*<\/div>/gi,
    /<div[^>]*id=["']overlay["'][^>]*>\s*<\/div>/gi,
    /<div[^>]*class=["']overlay["'][^>]*id=["']overlay["'][^>]*>\s*<\/div>/gi,
  ];
  for (const re of removals) {
    out = out.replace(re, '');
  }

  const balanced = [
    /<nav[^>]*id=["']gc-sidebar["'][^>]*>/i,
    /<nav[^>]*id=["']gcSidebar["'][^>]*>/i,
    /<nav[^>]*class=["'][^"']*gc-sidebar[^"']*["'][^>]*>/i,
    /<aside[^>]*id=["']gc-sidebar["'][^>]*>/i,
    /<aside[^>]*id=["']gcSidebar["'][^>]*>/i,
    /<aside[^>]*class=["'][^"']*gc-sidebar[^"']*["'][^>]*>/i,
    /<aside[^>]*id=["']sidebar["'][^>]*>/i,
    /<aside[^>]*class=["']sidebar["'][^>]*id=["']sidebar["'][^>]*>/i,
    /<aside[^>]*class=["']sidebar["'][^>]*>/i,
  ];
  for (const re of balanced) {
    const m = re.exec(out);
    if (m) {
      const tag = m[0].match(/^<(\w+)/i)[1];
      out = removeBalancedElement(out, new RegExp('<' + tag + '[^>]*(?:id=["\'](?:gc-sidebar|gcSidebar|sidebar)["\']|class=["\'][^"\']*(?:gc-sidebar|sidebar)[^"\']*["\'])[^>]*>', 'i'));
    }
  }

  // Remove sidebar comment blocks
  out = out.replace(/<!--[^>]*(?:SIDEBAR|HAMBURGER)[^>]*-->\s*/gi, '');

  return out;
}

function stripSidebarJs(html) {
  let out = html;

  // Remove standalone sidebar open/close functions
  out = out.replace(/function\s+gcOpenSidebar\s*\([^)]*\)\s*\{[^}]*(?:\{[^}]*\}[^}]*)*\}/g, '');
  out = out.replace(/function\s+gcCloseSidebar\s*\([^)]*\)\s*\{[^}]*(?:\{[^}]*\}[^}]*)*\}/g, '');
  out = out.replace(/function\s+openSB\s*\([^)]*\)\s*\{[^}]*(?:\{[^}]*\}[^}]*)*\}/g, '');
  out = out.replace(/function\s+closeSB\s*\([^)]*\)\s*\{[^}]*(?:\{[^}]*\}[^}]*)*\}/g, '');

  // openSB/closeSB one-liners
  out = out.replace(/function\s+openSB\s*\(\)\s*\{[^}]+\}/g, '');
  out = out.replace(/function\s+closeSB\s*\(\)\s*\{[^}]+\}/g, '');
  out = out.replace(/document\.getElementById\(['"]gc-hamburger['"]\)\.addEventListener\(['"]click['"],openSB\)\s*;?\s*/g, '');
  out = out.replace(/document\.addEventListener\(['"]keydown['"],function\(e\)\{if\(e\.key===['"]Escape['"]\)closeSB\(\);\}\)\s*;?\s*/g, '');

  // Sidebar section comment blocks in scripts
  out = out.replace(/\/\/ ── SIDEBAR[\s\S]*?\/\/ ── COOKIE/g, '// ── COOKIE');

  // Inline gcOpenSidebar/gcCloseSidebar one-liners
  out = out.replace(/function\s+gcOpenSidebar\s*\(\)\s*\{[^;]*;[^}]*\}/g, '');
  out = out.replace(/function\s+gcCloseSidebar\s*\(\)\s*\{[^;]*;[^}]*\}/g, '');

  // Sidebar variable declarations at script start
  out = out.replace(/var\s+sidebar\s*=\s*document\.getElementById\(['"]gc-sidebar['"]\)\s*;?\s*/g, '');
  out = out.replace(/var\s+overlay\s*=\s*document\.getElementById\(['"]gc-sidebar-overlay['"]\)\s*;?\s*/g, '');
  out = out.replace(/var\s+hamburger\s*=\s*document\.getElementById\(['"]gc-hamburger['"]\)\s*;?\s*/g, '');

  // Sidebar event listeners (single line)
  out = out.replace(/hamburger\.addEventListener\(['"]click['"][^;]*;\s*/g, '');
  out = out.replace(/document\.getElementById\(['"]gc-sidebar-close['"]\)\.addEventListener\(['"]click['"][^;]*;\s*/g, '');
  out = out.replace(/document\.getElementById\(['"]gc-sidebar-overlay['"]\)\.addEventListener\(['"]click['"][^;]*;\s*/g, '');

  // document.addEventListener click handlers for sidebar only
  out = out.replace(/document\.addEventListener\(['"]click['"],function\(e\)\{[^}]*gc-hamburger[^}]*\}\)\s*;?\s*/g, '');
  out = out.replace(/document\.addEventListener\(['"]click['"],function\(e\)\{[^}]*gc-sidebar[^}]*\}\)\s*;?\s*/g, '');
  out = out.replace(/document\.addEventListener\(['"]keydown['"],function\(e\)\{if\(e\.key===['"]Escape['"]\)[^}]*gcCloseSidebar[^}]*\}\)\s*;?\s*/g, '');
  out = out.replace(/document\.addEventListener\(['"]keydown['"],function\(e\)\{if\(e\.key===['"]Escape['"]\)[^}]*gc-sidebar[^}]*\}\)\s*;?\s*/g, '');

  // IIFE sidebar close blocks at bottom
  out = out.replace(/<script>\s*\(function\(\)\{\s*\/\/ Sidebar close button[\s\S]*?\}\)\(\);\s*<\/script>/gi, '');

  // UCL pattern click handler for sidebar
  out = out.replace(/document\.addEventListener\(['"]click['"],function\(e\)\{\s*var sb=document\.getElementById\(['"]gc-sidebar['"]\)[\s\S]*?\}\);\s*/g, '');

  // fixtures onclick handlers in remaining code - remove openSidebar/closeSidebar calls
  out = out.replace(/onclick="closeSidebar\(\)"/g, '');
  out = out.replace(/onclick="openSidebar\(\)"/g, '');

  // gcOpenSidebar/gcCloseSidebar inline in addEventListener one-liners in index.html style
  out = out.replace(/if\(e\.target\.closest&&e\.target\.closest\(['"]#gc-hamburger['"]\)\)\{gcOpenSidebar\(\);return;\}[^]*?if\(e\.target\.id==='gc-sidebar-overlay'\)\{gcCloseSidebar\(\);return;\}/g, '');

  out = out.replace(/function\s+openSidebar\s*\([^)]*\)\s*\{[^}]*(?:\{[^}]*\}[^}]*)*\}/g, '');
  out = out.replace(/function\s+closeSidebar\s*\([^)]*\)\s*\{[^}]*(?:\{[^}]*\}[^}]*)*\}/g, '');

  out = out.replace(/document\.addEventListener\(['"]DOMContentLoaded['"],\s*function\(\)\s*\{\s*document\.addEventListener\(['"]click['"],\s*function\(e\)\s*\{\s*var hamburger = document\.querySelector\(['"]\.sb-hamburger['"]\);[\s\S]*?\}\);\s*\}\);\s*/g, '');

  out = out.replace(/function\s+sbToggle\s*\([^)]*\)\s*\{[^}]+\}\s*/g, '');

  return out;
}

function fixLayoutCss(html) {
  let out = html;
  out = out.replace(/#gc-page-wrap\{([^}]*?)margin-left:var\(--sidebar-w\)([^}]*)\}/g, '#gc-page-wrap{$1$2}');
  out = out.replace(/#gc-page-wrap\{([^}]*?)margin-left:var\(--sb-w\)([^}]*)\}/g, '#gc-page-wrap{$1$2}');
  out = out.replace(/\.gc-page-wrap\{([^}]*?)margin-left:var\(--sb-w\)([^}]*)\}/g, '.gc-page-wrap{$1$2}');
  out = out.replace(/\.main\{margin-left:var\(--sb-w\);/g, '.main{');
  out = out.replace(/#gc-main\{margin-left:var\(--sb-w\);/g, '#gc-main{');
  out = out.replace(/#gc-main\{margin-left:var\(--sidebar-w\);/g, '#gc-main{');
  out = out.replace(/\.gc-main-wrapper\{margin-left:var\(--sb-w\)/g, '.gc-main-wrapper{margin-left:0');
  return out;
}

function processStyleBlocks(html) {
  return html.replace(/<style([^>]*)>([\s\S]*?)<\/style>/gi, function (_, attrs, css) {
    let cleaned = stripCssRules(css);
    cleaned = fixLayoutCss(cleaned);
    return '<style' + attrs + '>' + cleaned + '</style>';
  });
}

function injectBottomNav(html, relPath) {
  const nav = buildBottomNav(getActiveTab(relPath));
  if (/class=["']gc-bottomnav["']/.test(html)) {
    return html.replace(/<nav class="gc-bottomnav"[\s\S]*?<\/nav>/, nav);
  }
  const consentRe = /(<script[^>]*src=["']\/js\/gc-consent\.js["'][^>]*><\/script>\s*)/i;
  if (consentRe.test(html)) {
    return html.replace(consentRe, '$1\n' + nav + '\n');
  }
  return html.replace(/<\/body>/i, nav + '\n</body>');
}

function ensureNavCssLink(html) {
  if (html.includes('/css/gc-bottomnav.css')) return html;
  if (html.includes('/css/gc-design-spec.css')) return html;
  if (html.includes('/css/style.css')) return html;
  const link = '<link rel="stylesheet" href="/css/gc-bottomnav.css">\n';
  return html.replace(/<\/head>/i, link + '</head>');
}

function processFile(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
  let html = fs.readFileSync(filePath, 'utf8');
  const original = html;

  const hadSidebar = /#gc-sidebar|\.gc-sidebar|#sidebar\b|class=["']sidebar["']|gc-hamburger|sb-hamburger/.test(html);

  html = removeSidebarHtml(html);
  html = processStyleBlocks(html);
  html = fixLayoutCss(html);
  html = stripSidebarJs(html);
  html = injectBottomNav(html, rel);
  html = ensureNavCssLink(html);

  // Collapse excessive blank lines in body start
  html = html.replace(/<body>\s{3,}/, '<body>\n\n');

  if (html !== original) {
    fs.writeFileSync(filePath, html, 'utf8');
    return { rel, hadSidebar, changed: true };
  }
  return { rel, hadSidebar, changed: false };
}

const files = dedupeFiles(walkHtml(ROOT));
const results = files.map(processFile);
const changed = results.filter(r => r.changed);

console.log('Processed:', files.length, 'files');
console.log('Modified:', changed.length, 'files');
changed.forEach(r => console.log('  ' + r.rel + (r.hadSidebar ? ' (sidebar removed)' : ' (bottomnav added)')));
