/* =========================================================
   /js/groups.js — GoalCurrent.live World Cup 2026
   Single dynamic renderer for ALL 12 group pages (A–L).
   Data source: /js/worldcup-data.js (window.WC26) ONLY.
   - Standings computed from FT matches only
   - Sort: Points → Goal Difference → Goals For
   - Qualification colours applied AFTER sorting
   - Kick-off times shown in the visitor's local timezone
   - Zero hardcoded teams, fixtures, standings or BST text
   Usage:
     <div id="group-root" data-group="A"></div>
     <script src="/js/worldcup-data.js"></script>
     <script src="/js/groups.js"></script>
   ========================================================= */
(function () {
  "use strict";

  var root = document.getElementById("group-root");
  if (!root) return;

  var GROUP = (root.getAttribute("data-group") || "A").toUpperCase();
  var WC = window.WC26 || {};
  var FLAGS = window.TEAM_FLAGS || WC.TEAM_FLAGS || {};

  /* ---------- tolerant field access ---------- */
  function pick(obj, keys, fallback) {
    for (var i = 0; i < keys.length; i++) {
      if (obj && obj[keys[i]] !== undefined && obj[keys[i]] !== null) return obj[keys[i]];
    }
    return fallback;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function getGroupTeams() {
    var g = WC.groups;
    if (!g) return [];
    if (!Array.isArray(g) && g[GROUP]) {
      return g[GROUP].map(function (t) {
        return typeof t === "string" ? t : pick(t, ["name", "team", "title"], "");
      });
    }
    if (Array.isArray(g)) {
      var found = null;
      for (var i = 0; i < g.length; i++) {
        var letter = String(pick(g[i], ["group", "letter", "id", "name"], "")).toUpperCase().replace("GROUP ", "");
        if (letter === GROUP) { found = g[i]; break; }
      }
      if (found) {
        return (found.teams || []).map(function (t) {
          return typeof t === "string" ? t : pick(t, ["name", "team", "title"], "");
        });
      }
    }
    return [];
  }

  function getGroupFixtures() {
    var sched = WC.schedule || WC.fixtures || WC.matches || [];
    if (!Array.isArray(sched)) return [];
    return sched.filter(function (m) {
      var g = String(pick(m, ["group", "grp", "stage"], "")).toUpperCase().replace("GROUP ", "");
      return g === GROUP;
    });
  }

  function teamName(m, side) {
    var v = side === "home"
      ? pick(m, ["home", "homeTeam", "team1", "h"], "")
      : pick(m, ["away", "awayTeam", "team2", "a"], "");
    return typeof v === "string" ? v : pick(v, ["name", "team"], "");
  }
  function score(m, side) {
    var v = side === "home"
      ? pick(m, ["homeScore", "scoreHome", "homeGoals", "hs"], null)
      : pick(m, ["awayScore", "scoreAway", "awayGoals", "as"], null);
    if (v === "" || v === null || v === undefined) return null;
    var n = Number(v);
    return isNaN(n) ? null : n;
  }
  function status(m) { return String(pick(m, ["status", "state"], "")).toUpperCase(); }
  function isFT(m) {
    var s = status(m);
    if (s === "FT" || s === "FINISHED" || s === "AET" || s === "PEN") return true;
    // Fallback: explicit finished flag
    return pick(m, ["finished", "isFinished"], false) === true;
  }
  function isLive(m) {
    var s = status(m);
    return s === "LIVE" || s === "1H" || s === "2H" || s === "HT" || s === "ET";
  }

  function kickoffDate(m) {
    var iso = pick(m, ["kickoffUTC", "dateUTC", "utc", "kickoff", "datetime", "dateTime", "timestamp"], null);
    if (typeof iso === "number") { var dn = new Date(iso * (iso < 1e12 ? 1000 : 1)); if (!isNaN(dn)) return dn; }
    if (iso) { var d = new Date(iso); if (!isNaN(d)) return d; }
    var date = pick(m, ["date", "day"], null);
    var time = pick(m, ["timeUTC", "time", "ko"], null);
    if (date && time) {
      var hasTZ = /Z|[+-]\d{2}:?\d{2}$/.test(String(time));
      var d2 = new Date(date + "T" + time + (hasTZ ? "" : "Z"));
      if (!isNaN(d2)) return d2;
    }
    if (date) { var d3 = new Date(date); if (!isNaN(d3)) return d3; }
    return null;
  }
  function localDateStr(d) {
    if (!d) return "Date TBC";
    return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  }
  function localTimeStr(d) {
    if (!d) return "TBC";
    return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }
  function tzAbbr(d) {
    if (!d) return "";
    try {
      var parts = new Intl.DateTimeFormat(undefined, { timeZoneName: "short" }).formatToParts(d);
      for (var i = 0; i < parts.length; i++) if (parts[i].type === "timeZoneName") return parts[i].value;
    } catch (e) {}
    return "";
  }

  function flagImg(name, w, h) {
    var src = FLAGS[name] || "";
    if (!src) {
      return '<span style="display:inline-block;width:' + w + 'px;height:' + h + 'px;background:rgba(0,0,0,.06);border-radius:4px"></span>';
    }
    return '<img src="' + esc(src) + '" alt="' + esc(name) + '" width="' + w + '" height="' + h + '" style="object-fit:cover;border-radius:4px;display:block" loading="lazy">';
  }
  function isHost(name) {
    var hosts = WC.hosts || [];
    return Array.isArray(hosts) && hosts.indexOf(name) !== -1;
  }

  /* ---------- standings (FT only) ---------- */
  function buildStandings(teams, fixtures) {
    var table = {};
    teams.forEach(function (t) {
      table[t] = { team: t, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 };
    });
    fixtures.forEach(function (m) {
      if (!isFT(m)) return;
      var h = teamName(m, "home"), a = teamName(m, "away");
      var hs = score(m, "home"), as = score(m, "away");
      if (hs === null || as === null || !table[h] || !table[a]) return;
      var H = table[h], A = table[a];
      H.P++; A.P++;
      H.GF += hs; H.GA += as;
      A.GF += as; A.GA += hs;
      if (hs > as) { H.W++; A.L++; H.Pts += 3; }
      else if (hs < as) { A.W++; H.L++; A.Pts += 3; }
      else { H.D++; A.D++; H.Pts++; A.Pts++; }
    });
    var rows = teams.map(function (t) { var r = table[t]; r.GD = r.GF - r.GA; return r; });
    rows.sort(function (x, y) {
      return (y.Pts - x.Pts) || (y.GD - x.GD) || (y.GF - x.GF) || x.team.localeCompare(y.team);
    });
    return rows;
  }

  /* ---------- rendering (uses existing site classes) ---------- */
  function renderStandings(rows) {
    var html = '<div class="gc-section-hdr">📊 Standings</div>' +
      '<div style="overflow-x:auto;margin-bottom:24px">' +
      '<table class="gc-standings-table"><thead><tr>' +
      '<th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th>' +
      '<th>GF</th><th>GA</th><th>GD</th><th>Pts</th>' +
      '</tr></thead><tbody>';
    rows.forEach(function (r, i) {
      var pos = i + 1;
      var cls = pos <= 2 ? "qualified" : (pos === 3 ? "third" : "");
      var hostBadge = isHost(r.team)
        ? '<span style="font-size:.65rem;background:var(--gold);color:#fff;padding:1px 5px;border-radius:4px;margin-left:4px">Host</span>'
        : "";
      html += '<tr' + (cls ? ' class="' + cls + '"' : "") + '>' +
        '<td><div class="gc-team-row">' + flagImg(r.team, 20, 14) +
        '<span>' + esc(r.team) + hostBadge + '</span></div></td>' +
        '<td>' + r.P + '</td><td>' + r.W + '</td><td>' + r.D + '</td><td>' + r.L + '</td>' +
        '<td>' + r.GF + '</td><td>' + r.GA + '</td><td>' + (r.GD > 0 ? "+" : "") + r.GD + '</td>' +
        '<td><strong>' + r.Pts + '</strong></td></tr>';
    });
    html += '</tbody></table></div>' +
      '<p style="font-size:.72rem;color:var(--text-light);margin:-12px 0 24px">' +
      '<span style="display:inline-block;width:12px;height:12px;background:#10b981;border-radius:2px;margin-right:4px;vertical-align:middle"></span>Qualify for Round of 32 &nbsp;&nbsp;' +
      '<span style="display:inline-block;width:12px;height:12px;background:var(--gold);border-radius:2px;margin-right:4px;vertical-align:middle"></span>Potential best third-place' +
      '</p>';
    return html;
  }

  function renderFixtures(fixtures) {
    var sorted = fixtures.slice().sort(function (a, b) {
      var da = kickoffDate(a), db = kickoffDate(b);
      return (da ? da.getTime() : 9e15) - (db ? db.getTime() : 9e15);
    });
    var html = '<div class="gc-section-hdr">📅 Group ' + GROUP + ' Fixtures</div>';
    sorted.forEach(function (m) {
      var h = teamName(m, "home"), a = teamName(m, "away");
      var hs = score(m, "home"), as = score(m, "away");
      var ko = kickoffDate(m);
      var venue = pick(m, ["venue", "stadium", "city"], "");
      var matchNo = pick(m, ["matchNumber", "match", "no", "id"], "");
      var tv = pick(m, ["tv", "tvUK", "broadcaster"], "");
      var ft = isFT(m), live = isLive(m);

      var centre;
      if ((ft || live) && hs !== null && as !== null) {
        centre = '<div class="gc-match-vs" style="font-family:var(--font-heading);font-size:1.6rem;color:var(--text-dark)">' + hs + '–' + as + '</div>' +
          (live
            ? '<div class="gc-match-time" style="color:#dc2626">LIVE</div>'
            : '<div class="gc-match-time"><small>FT</small></div>');
      } else {
        centre = '<div class="gc-match-vs">VS</div>' +
          '<div class="gc-match-time">' + esc(localTimeStr(ko)) + ' <small>' + esc(tzAbbr(ko)) + '</small></div>';
      }

      html += '<div class="gc-match-card">' +
        '<div class="gc-match-meta">' +
        '<span>Group ' + GROUP + (matchNo ? ' · Match #' + esc(matchNo) : '') + (venue ? ' · 📍 ' + esc(venue) : '') + '</span>' +
        '<span>📅 ' + esc(localDateStr(ko)) + '</span>' +
        '</div>' +
        '<div class="gc-match-teams">' +
        '<div class="gc-match-team">' + flagImg(h, 64, 43) + '<div class="gc-match-name">' + esc(h) + '</div></div>' +
        '<div class="gc-match-center">' + centre + '</div>' +
        '<div class="gc-match-team">' + flagImg(a, 64, 43) + '<div class="gc-match-name">' + esc(a) + '</div></div>' +
        '</div>' +
        '<div class="gc-match-footer">' +
        (tv ? '<div class="gc-tv-badge">📺 UK: <span class="gc-tv-pill">' + esc(tv) + '</span></div>' : '<span></span>') +
        '<a href="/worldcup2026/fixtures/" style="font-size:.72rem;color:var(--blue);text-decoration:none;font-weight:600">Full details →</a>' +
        '</div></div>';
    });
    return html;
  }

  function renderQualBox() {
    return '<div class="gc-qual-box">' +
      '<h3>✅ Qualification</h3>' +
      '<p>Top 2 teams from Group ' + GROUP + ' advance to the Round of 32. The best 8 third-placed teams across all groups also advance.</p>' +
      '</div>';
  }

  /* ---------- boot ---------- */
  function render() {
    var teams = getGroupTeams();
    var fixtures = getGroupFixtures();
    if (!teams.length) {
      root.innerHTML = '<p style="padding:30px;text-align:center;color:var(--text-light)">Group ' + GROUP + ' data is unavailable. Please check back shortly.</p>';
      return;
    }
    var subtitle = teams.map(esc).join(" · ");
    root.innerHTML =
      '<p style="color:var(--text-mid);font-size:.9rem;margin-bottom:20px">' + subtitle + '</p>' +
      renderStandings(buildStandings(teams, fixtures)) +
      renderFixtures(fixtures) +
      renderQualBox();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
