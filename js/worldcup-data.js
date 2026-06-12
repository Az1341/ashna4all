/* =========================================================
   /js/groups.js — GoalCurrent.live World Cup 2026
   Single dynamic renderer for all 12 group pages (A–L).
   Data source: /js/worldcup-data.js (window.WC26) ONLY.
   Usage in page:
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
  var FLAGS = window.TEAM_FLAGS || {};

  /* ---------- helpers: tolerant field access ---------- */
  function pick(obj, keys, fallback) {
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
    }
    return fallback;
  }

  function getGroupTeams() {
    var g = WC.groups;
    if (!g) return [];
    // Shape 1: { A: ["Team", ...] } or { A: [{name:...}, ...] }
    if (!Array.isArray(g) && g[GROUP]) {
      return g[GROUP].map(function (t) {
        return typeof t === "string" ? t : pick(t, ["name", "team", "title"], "");
      });
    }
    // Shape 2: [{ group:"A", teams:[...] }]
    if (Array.isArray(g)) {
      var found = g.find(function (x) {
        return String(pick(x, ["group", "letter", "id"], "")).toUpperCase() === GROUP;
      });
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
      var g = String(pick(m, ["group", "grp"], "")).toUpperCase();
      // accept "A" or "Group A"
      return g === GROUP || g === "GROUP " + GROUP;
    });
  }

  function teamName(m, side) {
    return side === "home"
      ? pick(m, ["home", "homeTeam", "team1", "h"], "")
      : pick(m, ["away", "awayTeam", "team2", "a"], "");
  }
  function score(m, side) {
    var v = side === "home"
      ? pick(m, ["homeScore", "scoreHome", "hs", "homeGoals"], null)
      : pick(m, ["awayScore", "scoreAway", "as", "awayGoals"], null);
    return v === "" || v === null || v === undefined ? null : Number(v);
  }
  function status(m) {
    return String(pick(m, ["status", "state"], "")).toUpperCase();
  }
  function isFT(m) {
    var s = status(m);
    return s === "FT" || s === "FINISHED" || s === "AET" || s === "PEN";
  }
  function kickoffDate(m) {
    // Prefer a full ISO/UTC timestamp; fall back to date + time fields.
    var iso = pick(m, ["kickoffUTC", "dateUTC", "utc", "kickoff", "datetime", "dateTime"], null);
    if (iso) {
      var d = new Date(iso);
      if (!isNaN(d)) return d;
    }
    var date = pick(m, ["date", "day"], null);
    var time = pick(m, ["time", "timeUTC", "ko"], null);
    if (date && time) {
      var d2 = new Date(date + "T" + time + (String(time).match(/Z|[+-]\d\d:?\d\d$/) ? "" : "Z"));
      if (!isNaN(d2)) return d2;
    }
    if (date) {
      var d3 = new Date(date);
      if (!isNaN(d3)) return d3;
    }
    return null;
  }
  function localTime(d) {
    if (!d) return "TBC";
    return d.toLocaleString(undefined, {
      weekday: "short", day: "numeric", month: "short",
      hour: "2-digit", minute: "2-digit"
    });
  }
  function flagImg(name) {
    var src = FLAGS[name];
    if (!src) return "";
    return '<img src="' + src + '" alt="' + esc(name) + ' flag" width="32" height="22" loading="lazy" style="border-radius:3px;box-shadow:0 1px 2px rgba(0,0,0,.2);vertical-align:middle;">';
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- standings calculation (FT matches only) ---------- */
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
    var rows = teams.map(function (t) {
      var r = table[t];
      r.GD = r.GF - r.GA;
      return r;
    });
    rows.sort(function (x, y) {
      return (y.Pts - x.Pts) || (y.GD - x.GD) || (y.GF - x.GF) || x.team.localeCompare(y.team);
    });
    return rows;
  }

  /* ---------- rendering ---------- */
  // WC26 qualification: top 2 qualify (green), 3rd may qualify as best third (amber)
  function rowStyle(pos) {
    if (pos <= 2) return "background:linear-gradient(90deg,rgba(22,163,74,.12),transparent);border-left:4px solid #16a34a;";
    if (pos === 3) return "background:linear-gradient(90deg,rgba(217,119,6,.10),transparent);border-left:4px solid #d97706;";
    return "border-left:4px solid transparent;";
  }

  function renderStandings(rows) {
    var html = '' +
      '<div style="background:#fff;border-radius:14px;box-shadow:0 4px 14px rgba(0,40,120,.08);overflow:hidden;margin-bottom:28px;">' +
      '<div style="background:linear-gradient(135deg,#001a4d,#002b80,#003fb8);color:#fff;padding:14px 18px;font-weight:700;font-size:1.05rem;">Group ' + GROUP + ' Standings</div>' +
      '<table style="width:100%;border-collapse:collapse;font-size:15px;">' +
      '<thead><tr style="color:#475569;font-size:12px;text-transform:uppercase;letter-spacing:.04em;">' +
      '<th style="padding:10px 8px;text-align:left;">#</th>' +
      '<th style="padding:10px 8px;text-align:left;">Team</th>' +
      '<th style="padding:10px 6px;">P</th><th style="padding:10px 6px;">W</th>' +
      '<th style="padding:10px 6px;">D</th><th style="padding:10px 6px;">L</th>' +
      '<th style="padding:10px 6px;">GF</th><th style="padding:10px 6px;">GA</th>' +
      '<th style="padding:10px 6px;">GD</th><th style="padding:10px 8px;">Pts</th>' +
      '</tr></thead><tbody>';
    rows.forEach(function (r, i) {
      var pos = i + 1;
      html += '<tr style="' + rowStyle(pos) + 'border-top:1px solid #e2e8f0;">' +
        '<td style="padding:10px 8px;font-weight:700;color:#334155;">' + pos + '</td>' +
        '<td style="padding:10px 8px;font-size:18px;font-weight:600;color:#0f172a;white-space:nowrap;">' + flagImg(r.team) + ' <span style="margin-left:8px;">' + esc(r.team) + '</span></td>' +
        '<td style="padding:10px 6px;text-align:center;">' + r.P + '</td>' +
        '<td style="padding:10px 6px;text-align:center;">' + r.W + '</td>' +
        '<td style="padding:10px 6px;text-align:center;">' + r.D + '</td>' +
        '<td style="padding:10px 6px;text-align:center;">' + r.L + '</td>' +
        '<td style="padding:10px 6px;text-align:center;">' + r.GF + '</td>' +
        '<td style="padding:10px 6px;text-align:center;">' + r.GA + '</td>' +
        '<td style="padding:10px 6px;text-align:center;font-weight:600;">' + (r.GD > 0 ? "+" : "") + r.GD + '</td>' +
        '<td style="padding:10px 8px;text-align:center;font-weight:800;color:#1d4ed8;">' + r.Pts + '</td>' +
        '</tr>';
    });
    html += '</tbody></table>' +
      '<div style="padding:10px 18px;font-size:12px;color:#64748b;display:flex;gap:18px;">' +
      '<span><span style="display:inline-block;width:10px;height:10px;background:#16a34a;border-radius:2px;margin-right:6px;"></span>Qualified for Round of 32</span>' +
      '<span><span style="display:inline-block;width:10px;height:10px;background:#d97706;border-radius:2px;margin-right:6px;"></span>Possible best third place</span>' +
      '</div></div>';
    return html;
  }

  function renderFixtures(fixtures) {
    var sorted = fixtures.slice().sort(function (a, b) {
      var da = kickoffDate(a), db = kickoffDate(b);
      return (da ? da.getTime() : 0) - (db ? db.getTime() : 0);
    });
    var html = '<div style="background:#fff;border-radius:14px;box-shadow:0 4px 14px rgba(0,40,120,.08);overflow:hidden;">' +
      '<div style="background:linear-gradient(135deg,#001a4d,#002b80,#003fb8);color:#fff;padding:14px 18px;font-weight:700;font-size:1.05rem;">Group ' + GROUP + ' Fixtures &amp; Results</div>';
    sorted.forEach(function (m) {
      var h = teamName(m, "home"), a = teamName(m, "away");
      var hs = score(m, "home"), as = score(m, "away");
      var ft = isFT(m);
      var live = /LIVE|1H|2H|HT/.test(status(m));
      var venue = pick(m, ["venue", "stadium", "city"], "");
      var centre;
      if (ft || (live && hs !== null && as !== null)) {
        centre = '<span style="font-family:\'Barlow Condensed\',sans-serif;font-size:2.2rem;font-weight:800;color:#0f172a;">' + hs + ' – ' + as + '</span>' +
          (live ? '<div style="color:#dc2626;font-weight:700;font-size:12px;">LIVE</div>' : '<div style="color:#64748b;font-size:12px;">FT</div>');
      } else {
        centre = '<span style="font-size:1.7rem;font-weight:700;color:#1d4ed8;">vs</span>' +
          '<div style="color:#334155;font-size:13px;font-weight:600;margin-top:2px;">' + esc(localTime(kickoffDate(m))) + '</div>';
      }
      html += '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:16px 18px;border-top:1px solid #e2e8f0;">' +
        '<div style="flex:1;text-align:right;font-size:18px;font-weight:600;color:#0f172a;">' + esc(h) + ' ' + flagImg(h) + '</div>' +
        '<div style="min-width:120px;text-align:center;">' + centre + '</div>' +
        '<div style="flex:1;text-align:left;font-size:18px;font-weight:600;color:#0f172a;">' + flagImg(a) + ' ' + esc(a) + '</div>' +
        '</div>' +
        (venue ? '<div style="padding:0 18px 12px;text-align:center;font-size:12px;color:#64748b;">' + esc(venue) + '</div>' : '');
    });
    html += '</div>';
    return html;
  }

  /* ---------- boot ---------- */
  function render() {
    var teams = getGroupTeams();
    var fixtures = getGroupFixtures();
    if (!teams.length) {
      root.innerHTML = '<div style="padding:30px;text-align:center;color:#64748b;">Group ' + GROUP + ' data is loading…</div>';
      return;
    }
    var rows = buildStandings(teams, fixtures);
    root.innerHTML =
      '<h1 style="color:#001a4d;font-size:1.8rem;margin:0 0 18px;">World Cup 2026 — Group ' + GROUP + '</h1>' +
      renderStandings(rows) +
      renderFixtures(fixtures);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();