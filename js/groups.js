/* /js/groups.js - GoalCurrent.live World Cup 2026
 * Single dynamic renderer for ALL 12 group pages (A-L).
 * Data source: WC26.schedule + WC26_LIVE overlay.
 *
 * - FT standings: from WC26.schedule confirmed results
 * - LIVE standings: WC26_LIVE overlay adds in-progress goals ("as it stands")
 * - Live matches: show live score + elapsed minute with LIVE badge
 * - Polls via wc-live-poll.js (window.renderGroup called every 30s)
 * - Zero hardcoded teams, fixtures, standings or times
 *
 * Usage:
 *   <div id="group-root" data-group="A"></div>
 *   <script src="/js/worldcup-data.js"></script>
 *   <script src="/js/groups.js"></script>
 *   <script src="/js/wc-live-poll.js" defer></script>
 */
(function () {
  'use strict';

  var root = document.getElementById('group-root');
  if (!root) return;

  var GROUP = (root.getAttribute('data-group') || 'A').toUpperCase();
  var WC    = window.WC26 || {};

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  /* ---- team name helpers ---- */
  function teamName(m, side) {
    var v = side === 'home' ? m.home : m.away;
    return typeof v === 'string' ? v : ((v && v.name) || '');
  }
  function score(m, side) {
    var v = side === 'home' ? m.homeScore : m.awayScore;
    if (v === null || v === undefined || v === '') return null;
    var n = Number(v);
    return isNaN(n) ? null : n;
  }

  /* ---- status helpers ---- */
  var LIVE_S = { '1H':1,'HT':1,'2H':1,'ET':1,'BT':1,'P':1,'INT':1,'LIVE':1 };
  function isFT(m) {
    return (m.status === 'FT' || m.status === 'AET' || m.status === 'PEN') &&
           typeof m.homeScore === 'number' && typeof m.awayScore === 'number';
  }
  function isLive(m) {
    return !!(m.status && LIVE_S[m.status]);
  }

  /* ---- date/time helpers ---- */
  function kickoffDate(m) {
    if (m.utc) { var d = new Date(m.utc); if (!isNaN(d)) return d; }
    if (m.date && m.bst) {
      var db = new Date(m.date + 'T' + m.bst + ':00+01:00');
      if (!isNaN(db)) return db;
    }
    return null;
  }
  function localDateStr(d) {
    if (!d) return 'Date TBC';
    return d.toLocaleDateString(undefined, { weekday:'short', day:'numeric', month:'short', year:'numeric' });
  }
  function localTimeStr(d) {
    if (!d) return 'TBC';
    return d.toLocaleTimeString(undefined, { hour:'2-digit', minute:'2-digit' });
  }
  function tzAbbr(d) {
    if (!d) return '';
    try {
      var parts = new Intl.DateTimeFormat(undefined, { timeZoneName:'short' }).formatToParts(d);
      for (var i = 0; i < parts.length; i++) {
        if (parts[i].type === 'timeZoneName') return parts[i].value;
      }
    } catch (e) {}
    return '';
  }

  /* ---- flag helper ---- */
  function flagImg(name, w, h) {
    var code = WC.flags && WC.flags[name];
    if (!code) {
      return '<span style="display:inline-block;width:' + w + 'px;height:' + h +
             'px;background:rgba(0,0,0,.06);border-radius:4px"></span>';
    }
    return '<img src="https://flagcdn.com/w80/' + code + '.png" alt="' + esc(name) +
           '" width="' + w + '" height="' + h +
           '" style="object-fit:cover;border-radius:4px;display:block" loading="lazy">';
  }

  function isHost(name) {
    return ['Mexico','Canada','USA'].indexOf(name) !== -1;
  }

  /* ---- get group fixtures ---- */
  function getGroupFixtures() {
    return (WC.schedule || []).filter(function (m) {
      return m.group === GROUP;
    }).sort(function (a, b) {
      var da = kickoffDate(a), db = kickoffDate(b);
      return (da ? da.getTime() : 9e15) - (db ? db.getTime() : 9e15);
    });
  }

  /* ---- live overlay for this group ---- */
  function getLiveForGroup() {
    var overlay = window.WC26_LIVE || {};
    var result  = {};
    Object.keys(overlay).forEach(function (key) {
      var lm = overlay[key];
      if (lm.live && lm.group === GROUP) result[key] = lm;
    });
    return result;
  }

  /* ---- build standings: FT + live as-it-stands ---- */
  function buildStandings() {
    var teams = WC.groups && WC.groups[GROUP];
    if (!teams) return [];

    var stats = {};
    teams.forEach(function (t) {
      stats[t] = { team:t, P:0, W:0, D:0, L:0, GF:0, GA:0, GD:0, Pts:0, liveMatch:null };
    });

    /* Step 1: confirmed FT results */
    getGroupFixtures().forEach(function (m) {
      if (!isFT(m)) return;
      var H = stats[m.home], A = stats[m.away];
      if (!H || !A) return;
      H.P++; A.P++;
      H.GF += m.homeScore; H.GA += m.awayScore;
      A.GF += m.awayScore; A.GA += m.homeScore;
      if      (m.homeScore > m.awayScore) { H.W++; A.L++; H.Pts += 3; }
      else if (m.homeScore < m.awayScore) { A.W++; H.L++; A.Pts += 3; }
      else                                { H.D++; A.D++; H.Pts++;    A.Pts++; }
    });

    /* Step 2: live in-progress goals (as it stands) */
    var liveMap = getLiveForGroup();
    Object.keys(liveMap).forEach(function (key) {
      var lm = liveMap[key];
      var H = stats[lm.home], A = stats[lm.away];
      if (!H || !A || lm.hg === null || lm.ag === null) return;
      H.P++; A.P++;
      H.GF += lm.hg; H.GA += lm.ag;
      A.GF += lm.ag; A.GA += lm.hg;
      if      (lm.hg > lm.ag) { H.W++; A.L++; H.Pts += 3; }
      else if (lm.hg < lm.ag) { A.W++; H.L++; A.Pts += 3; }
      else                     { H.D++; A.D++; H.Pts++;    A.Pts++; }
      H.liveMatch = lm;
      A.liveMatch = lm;
    });

    var rows = teams.map(function (t) {
      var r = stats[t];
      r.GD = r.GF - r.GA;
      return r;
    });
    rows.sort(function (x, y) {
      return (y.Pts - x.Pts) || (y.GD - x.GD) || (y.GF - x.GF) ||
             x.team.localeCompare(y.team);
    });
    return rows;
  }

  /* ---- render standings table ---- */
  function renderStandingsHTML(rows) {
    var hasLive = rows.some(function (r) { return r.liveMatch; });
    var liveTag = hasLive
      ? '<span style="font-size:.65rem;background:#dc2626;color:#fff;' +
        'padding:2px 8px;border-radius:999px;margin-left:8px;' +
        'animation:gc-pulse 1.4s infinite">AS IT STANDS</span>'
      : '';

    var html = '<div class="gc-section-hdr">Standings' + liveTag + '</div>' +
      '<div style="overflow-x:auto;margin-bottom:24px">' +
      '<table class="gc-standings-table"><thead><tr>' +
      '<th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th>' +
      '<th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr></thead><tbody>';

    rows.forEach(function (r, i) {
      var cls      = i < 2 ? 'qualified' : (i === 2 ? 'third' : '');
      var hostTag  = isHost(r.team)
        ? '<span style="font-size:.65rem;background:var(--gold);color:#fff;' +
          'padding:1px 5px;border-radius:4px;margin-left:4px">Host</span>'
        : '';
      var livePill = r.liveMatch
        ? '<span style="font-size:.6rem;background:#dc2626;color:#fff;' +
          'padding:1px 5px;border-radius:999px;margin-left:4px;' +
          'animation:gc-pulse 1.4s infinite">LIVE</span>'
        : '';
      html += '<tr' + (cls ? ' class="' + cls + '"' : '') + '>' +
        '<td><div class="gc-team-row">' + flagImg(r.team, 20, 14) +
        '<span>' + esc(r.team) + hostTag + livePill + '</span></div></td>' +
        '<td>' + r.P + '</td><td>' + r.W + '</td><td>' + r.D + '</td><td>' + r.L + '</td>' +
        '<td>' + r.GF + '</td><td>' + r.GA + '</td>' +
        '<td>' + (r.GD > 0 ? '+' : '') + r.GD + '</td>' +
        '<td><strong>' + r.Pts + '</strong></td></tr>';
    });

    html += '</tbody></table></div>' +
      '<p style="font-size:.72rem;color:var(--text-light);margin:-12px 0 24px">' +
      '<span style="display:inline-block;width:12px;height:12px;background:#10b981;' +
      'border-radius:2px;margin-right:4px;vertical-align:middle"></span>Qualify for Round of 32 ' +
      '<span style="display:inline-block;width:12px;height:12px;background:var(--gold);' +
      'border-radius:2px;margin-right:4px;vertical-align:middle;margin-left:12px"></span>' +
      'Potential best third-place</p>';
    return html;
  }

  /* ---- render fixtures ---- */
  function renderFixturesHTML(fixtures) {
    var liveMap = getLiveForGroup();
    var html = '<div class="gc-section-hdr">Group ' + GROUP + ' Fixtures</div>';

    fixtures.forEach(function (m) {
      var h    = teamName(m, 'home');
      var a    = teamName(m, 'away');
      var hs   = score(m, 'home');
      var as   = score(m, 'away');
      var ko   = kickoffDate(m);
      var tv   = m.ukBroadcaster || '';
      var venue = m.venue || '';

      /* Check live overlay */
      var liveKey  = h + '|' + a;
      var lm       = liveMap[liveKey] || null;
      var ft       = isFT(m);
      var live     = lm && lm.live;

      /* Live goals override schedule goals */
      var showHg   = live ? lm.hg : hs;
      var showAg   = live ? lm.ag : as;
      var elapsed  = live ? (lm.elapsed ? lm.elapsed + "'" : lm.status) : '';

      var centreHTML;
      if (live && showHg !== null && showAg !== null) {
        var liveGrd = window.WC26 && WC26.scoreGuard
          ? WC26.scoreGuard({ utc: m.utc, status: lm.status, homeScore: showHg, awayScore: showAg }, 'groups-live')
          : { show: ko && ko.getTime() <= Date.now() };
        centreHTML = liveGrd.show
          ? '<div class="gc-match-vs" style="font-family:var(--font-heading);font-size:1.6rem;color:var(--text-dark)">' +
            showHg + '-' + showAg + '</div>' +
            '<div class="gc-match-time" style="color:#dc2626;font-weight:800">' +
            '<span style="display:inline-block;width:8px;height:8px;background:#dc2626;' +
            'border-radius:50%;margin-right:4px;animation:gc-pulse 1s infinite"></span>' +
            'LIVE ' + esc(elapsed) + '</div>'
          : '<div class="gc-match-vs">VS</div>' +
            '<div class="gc-match-time">' + esc(localTimeStr(ko)) +
            ' <small>' + esc(tzAbbr(ko)) + '</small></div>';
      } else if (ft && showHg !== null && showAg !== null) {
        var ftGrd = window.WC26 && WC26.scoreGuard
          ? WC26.scoreGuard({ utc: m.utc, status: m.status, homeScore: showHg, awayScore: showAg }, 'groups-ft')
          : { show: ko && ko.getTime() <= Date.now() };
        centreHTML = ftGrd.show
          ? '<div class="gc-match-vs" style="font-family:var(--font-heading);font-size:1.6rem;color:var(--text-dark)">' +
            showHg + '-' + showAg + '</div>' +
            '<div class="gc-match-time"><small>FT</small></div>'
          : '<div class="gc-match-vs">VS</div>' +
            '<div class="gc-match-time">' + esc(localTimeStr(ko)) +
            ' <small>' + esc(tzAbbr(ko)) + '</small></div>';
      } else {
        centreHTML =
          '<div class="gc-match-vs">VS</div>' +
          '<div class="gc-match-time">' + esc(localTimeStr(ko)) +
          ' <small>' + esc(tzAbbr(ko)) + '</small></div>';
      }

      html +=
        '<div class="gc-match-card">' +
        '<div class="gc-match-meta">' +
        '<span>Group ' + GROUP + (venue ? ' - ' + esc(venue) : '') + '</span>' +
        '<span>' + esc(localDateStr(ko)) + '</span>' +
        '</div>' +
        '<div class="gc-match-teams">' +
        '<div class="gc-match-team">' + flagImg(h, 64, 43) +
        '<div class="gc-match-name">' + esc(h) + '</div></div>' +
        '<div class="gc-match-center">' + centreHTML + '</div>' +
        '<div class="gc-match-team">' + flagImg(a, 64, 43) +
        '<div class="gc-match-name">' + esc(a) + '</div></div>' +
        '</div>' +
        '<div class="gc-match-footer">' +
        (tv ? '<div class="gc-tv-badge">UK: <span class="gc-tv-pill">' + esc(tv) + '</span></div>' : '<span></span>') +
        '<a href="/worldcup2026/fixtures/" style="font-size:.72rem;color:var(--blue);' +
        'text-decoration:none;font-weight:600">Full details -></a>' +
        '</div></div>';
    });
    return html;
  }

  function renderQualBox() {
    return '<div class="gc-qual-box">' +
      '<h3>Qualification</h3>' +
      '<p>Top 2 teams from Group ' + GROUP + ' advance to the Round of 32. ' +
      'The best 8 third-placed teams across all groups also advance.</p>' +
      '</div>';
  }

  /* Inject pulse keyframe once */
  if (!document.getElementById('gc-pulse-style')) {
    var st = document.createElement('style');
    st.id  = 'gc-pulse-style';
    st.textContent = '@keyframes gc-pulse{0%,100%{opacity:1}50%{opacity:.5}}';
    document.head.appendChild(st);
  }

  /* ---- main render ---- */
  function render() {
    var teams = WC.groups && WC.groups[GROUP];
    if (!teams || !teams.length) {
      root.innerHTML = '<p style="padding:30px;text-align:center;color:var(--text-light)">' +
        'Group ' + GROUP + ' data unavailable.</p>';
      return;
    }
    var fixtures = getGroupFixtures();
    var rows     = buildStandings();
    var subtitle = teams.map(esc).join(' - ');

    root.innerHTML =
      '<p style="color:var(--text-mid);font-size:.9rem;margin-bottom:20px">' + subtitle + '</p>' +
      renderStandingsHTML(rows) +
      renderFixturesHTML(fixtures) +
      renderQualBox();
  }

  /* Expose for wc-live-poll.js to call */
  window.renderGroup = render;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
