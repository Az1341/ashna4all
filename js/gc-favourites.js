/**
 * GoalCurrent.live — gc-favourites.js
 * Single favourites store for teams and matches.
 *
 * Storage schema (localStorage key "gc_favourites"):
 *   { teams: [ "Germany", "Japan" ], matches: [ 101, 104 ] }
 *
 * On first read it migrates legacy keys (non-destructive — legacy keys are
 * left untouched so existing pages keep working):
 *   wc26_favourites      → favourite team names (array)
 *   gc_wc26_favourites   → favourite match ids   (array)
 *
 * Public API:
 *   GCFavourites.getState()                    → { teams, matches }
 *   GCFavourites.saveState(state)
 *   GCFavourites.isTeam(name) / isMatch(id)
 *   GCFavourites.toggleTeam(name) / toggleMatch(id)   → boolean (now starred?)
 *   GCFavourites.renderStarButton({ type, id, starred, className, label })
 *   GCFavourites.bindStars(root)               → wire [data-gc-fav-team|match]
 *
 * Custom event "gc:favourites-change" is dispatched on document after writes.
 */
(function () {
  'use strict';

  var KEY = 'gc_favourites';
  var LEGACY_TEAMS = 'wc26_favourites';
  var LEGACY_MATCHES = 'gc_wc26_favourites';

  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      var v = JSON.parse(raw);
      return v == null ? fallback : v;
    } catch (e) {
      return fallback;
    }
  }

  function uniq(arr) {
    var seen = {};
    var out = [];
    (arr || []).forEach(function (v) {
      var k = String(v);
      if (!seen[k]) { seen[k] = 1; out.push(v); }
    });
    return out;
  }

  function normalizeState(raw) {
    raw = raw || {};
    return {
      teams: uniq(Array.isArray(raw.teams) ? raw.teams : []),
      matches: uniq(Array.isArray(raw.matches) ? raw.matches : [])
    };
  }

  function migrate() {
    var legacyTeams = readJSON(LEGACY_TEAMS, null);
    var legacyMatches = readJSON(LEGACY_MATCHES, null);
    if (legacyTeams == null && legacyMatches == null) return null;
    return normalizeState({
      teams: Array.isArray(legacyTeams) ? legacyTeams : [],
      matches: Array.isArray(legacyMatches) ? legacyMatches : []
    });
  }

  function getState() {
    var existing = localStorage.getItem(KEY);
    if (existing != null) {
      return normalizeState(readJSON(KEY, {}));
    }
    var migrated = migrate();
    if (migrated) {
      saveState(migrated);
      return migrated;
    }
    return { teams: [], matches: [] };
  }

  function saveState(state) {
    var clean = normalizeState(state);
    try {
      localStorage.setItem(KEY, JSON.stringify(clean));
    } catch (e) { /* storage full / blocked — ignore */ }
    try {
      document.dispatchEvent(new CustomEvent('gc:favourites-change', { detail: clean }));
    } catch (e2) { /* CustomEvent unsupported — ignore */ }
    return clean;
  }

  function isTeam(name) {
    if (name == null) return false;
    return getState().teams.indexOf(name) !== -1;
  }

  function isMatch(id) {
    if (id == null) return false;
    var matches = getState().matches.map(String);
    return matches.indexOf(String(id)) !== -1;
  }

  function toggleTeam(name) {
    if (name == null) return false;
    var state = getState();
    var idx = state.teams.indexOf(name);
    var nowOn;
    if (idx === -1) { state.teams.push(name); nowOn = true; }
    else { state.teams.splice(idx, 1); nowOn = false; }
    saveState(state);
    return nowOn;
  }

  function toggleMatch(id) {
    if (id == null) return false;
    var state = getState();
    var key = String(id);
    var idx = state.matches.map(String).indexOf(key);
    var nowOn;
    if (idx === -1) { state.matches.push(id); nowOn = true; }
    else { state.matches.splice(idx, 1); nowOn = false; }
    saveState(state);
    return nowOn;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /**
   * Returns HTML for a reusable star button.
   * opts:
   *   type      'team' | 'match'   (required)
   *   id        team name or match id (required)
   *   starred   boolean — defaults to current stored state
   *   className extra classes appended to .gc-fav-star
   *   label     accessible label (default "Save to favourites")
   */
  function renderStarButton(opts) {
    opts = opts || {};
    var type = opts.type === 'match' ? 'match' : 'team';
    var id = opts.id;
    var on = typeof opts.starred === 'boolean'
      ? opts.starred
      : (type === 'match' ? isMatch(id) : isTeam(id));
    var label = opts.label || (on ? 'Remove from favourites' : 'Save to favourites');
    var cls = 'gc-fav-star' + (on ? ' gc-fav-star--on' : '') +
      (opts.className ? ' ' + opts.className : '');
    var dataAttr = type === 'match' ? 'data-gc-fav-match' : 'data-gc-fav-team';

    return '<button type="button" class="' + esc(cls) + '"' +
      ' ' + dataAttr + '="' + esc(id) + '"' +
      ' aria-pressed="' + (on ? 'true' : 'false') + '"' +
      ' aria-label="' + esc(label) + '"' +
      ' title="' + esc(label) + '">' +
      (on ? '★' : '☆') +
      '</button>';
  }

  function syncButton(btn, on) {
    if (on) btn.classList.add('gc-fav-star--on');
    else btn.classList.remove('gc-fav-star--on');
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    var lbl = on ? 'Remove from favourites' : 'Save to favourites';
    btn.setAttribute('aria-label', lbl);
    btn.setAttribute('title', lbl);
    btn.textContent = on ? '★' : '☆';
  }

  /**
   * Wires every [data-gc-fav-team] / [data-gc-fav-match] element under root
   * (default: document). Initialises visual state and click handlers.
   * Safe to call multiple times — already-bound buttons are skipped.
   */
  function bindStars(root) {
    root = root || document;
    var nodes = root.querySelectorAll('[data-gc-fav-team],[data-gc-fav-match]');
    Array.prototype.forEach.call(nodes, function (btn) {
      if (btn.getAttribute('data-gc-fav-bound') === '1') return;
      btn.setAttribute('data-gc-fav-bound', '1');

      var teamName = btn.getAttribute('data-gc-fav-team');
      var matchId = btn.getAttribute('data-gc-fav-match');
      var isMatchBtn = matchId !== null;
      var key = isMatchBtn ? matchId : teamName;

      syncButton(btn, isMatchBtn ? isMatch(key) : isTeam(key));

      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var on = isMatchBtn ? toggleMatch(key) : toggleTeam(key);
        syncButton(btn, on);
      });
    });
  }

  window.GCFavourites = {
    getState: getState,
    saveState: saveState,
    isTeam: isTeam,
    isMatch: isMatch,
    toggleTeam: toggleTeam,
    toggleMatch: toggleMatch,
    renderStarButton: renderStarButton,
    bindStars: bindStars
  };

}());
