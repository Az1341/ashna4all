/* ============================================================
   live.js — Live scores, scorers, auto-refresh
   goalcurrent.live
   ============================================================ */

var GC_LIVE = (function () {

  var _league = 'PL';
  var _refreshTimer = null;

  function setLeague(type) { _league = type; }

  /* ── render ───────────────────────────────────────────── */
  function render(container) {
    if (_refreshTimer) clearInterval(_refreshTimer);

    container.innerHTML = loadingHTML();

    fetchAndRender(container);

    // auto-refresh every 60 seconds while on live tab
    _refreshTimer = setInterval(function () {
      fetchAndRender(container);
    }, 60000);
  }

  function fetchAndRender(container) {
    GC_API.getLive(_league).then(function (matches) {
      if (!matches || !matches.length) {
        // no live — try today's schedule
        GC_API.getByDate(_league, GC_API.today()).then(function (todayMatches) {
          container.innerHTML = buildHTML(todayMatches, true);
        });
      } else {
        container.innerHTML = buildHTML(matches, false);
      }
    }).catch(function () {
      container.innerHTML = errorHTML();
    });
  }

  /* ── HTML builders ────────────────────────────────────── */
  function buildHTML(matches, isToday) {
    if (!matches || !matches.length) {
      return noMatchesHTML();
    }

    // group by status: live first, then upcoming, then finished
    var live      = matches.filter(function(m){ return m.isLive; });
    var upcoming  = matches.filter(function(m){ return m.isPre; });
    var finished  = matches.filter(function(m){ return m.isFT; });

    var html = '<div class="gc-live-wrap">';

    // header
    html += '<div class="gc-section-header">';
    html += isToday
      ? '<span class="gc-section-title">📅 Today\'s Matches</span>'
      : '<span class="gc-section-title"><span class="gc-live-dot"></span> Live Now</span>';
    html += '<span class="gc-section-count">' + matches.length + ' matches</span>';
    html += '</div>';

    if (live.length) {
      html += '<div class="gc-group-label">🔴 In Progress</div>';
      live.forEach(function(m){ html += matchCard(m); });
    }
    if (upcoming.length) {
      html += '<div class="gc-group-label">⏰ Upcoming Today</div>';
      upcoming.forEach(function(m){ html += matchCard(m); });
    }
    if (finished.length) {
      html += '<div class="gc-group-label">✅ Full Time</div>';
      finished.forEach(function(m){ html += matchCard(m); });
    }

    html += '<div class="gc-refresh-note">⟳ Auto-refreshes every 60 seconds</div>';
    html += '</div>';
    return html;
  }

  function matchCard(m) {
    var homeWin = m.homeScore > m.awayScore;
    var awayWin = m.awayScore > m.homeScore;
    var hasScore = m.homeScore !== null && m.awayScore !== null;

    var html = '<div class="gc-match-card' + (m.isLive ? ' gc-match-live' : '') + '">';

    /* league + status row */
    html += '<div class="gc-match-meta">';
    html += '<span class="gc-match-league">' + esc(m.league) + '</span>';
    html += statusBadge(m);
    html += '</div>';

    /* teams + score */
    html += '<div class="gc-match-body">';

    // home team
    html += '<div class="gc-team gc-team-home">';
    if (m.homeLogo) html += '<img class="gc-team-logo" src="' + esc(m.homeLogo) + '" alt="">';
    html += '<span class="gc-team-name' + (homeWin ? ' gc-team-winner' : '') + '">' + esc(m.homeTeam) + '</span>';
    html += '</div>';

    // score
    html += '<div class="gc-score-wrap">';
    if (hasScore) {
      html += '<span class="gc-score' + (m.isLive ? ' gc-score-live' : '') + '">' +
              m.homeScore + ' <span class="gc-score-sep">–</span> ' + m.awayScore + '</span>';
    } else {
      html += '<span class="gc-score gc-score-ko">' + GC_API.formatKickoff(m.kickoff) + '</span>';
    }
    if (m.isLive && m.minute) {
      html += '<div class="gc-match-minute">' + esc(m.minute) + '</div>';
    }
    html += '</div>';

    // away team
    html += '<div class="gc-team gc-team-away">';
    if (m.awayLogo) html += '<img class="gc-team-logo" src="' + esc(m.awayLogo) + '" alt="">';
    html += '<span class="gc-team-name' + (awayWin ? ' gc-team-winner' : '') + '">' + esc(m.awayTeam) + '</span>';
    html += '</div>';

    html += '</div>'; // .gc-match-body

    /* scorers */
    if (m.scorers && m.scorers.length) {
      html += '<div class="gc-scorers">';
      m.scorers.forEach(function (s) {
        var isHome = s.team === m.homeTeam;
        html += '<div class="gc-scorer' + (isHome ? ' gc-scorer-home' : ' gc-scorer-away') + '">' +
                '⚽ ' + esc(s.player) +
                (s.minute ? ' <span class="gc-scorer-min">' + esc(s.minute) + '</span>' : '') +
                '</div>';
      });
      html += '</div>';
    }

    /* venue + TV */
    if (m.venue || (m.tv && m.tv.length)) {
      html += '<div class="gc-match-footer">';
      if (m.venue) html += '<span class="gc-venue">🏟 ' + esc(m.venue) + (m.city ? ', ' + esc(m.city) : '') + '</span>';
      if (m.tv && m.tv.length) html += '<span class="gc-tv">📺 ' + m.tv.map(esc).join(', ') + '</span>';
      html += '</div>';
    }

    html += '</div>'; // .gc-match-card
    return html;
  }

  function statusBadge(m) {
    if (m.isLive) {
      return '<span class="gc-badge gc-badge-live">🔴 ' + esc(m.statusShort || 'LIVE') + '</span>';
    }
    if (m.isFT) {
      return '<span class="gc-badge gc-badge-ft">FT</span>';
    }
    return '<span class="gc-badge gc-badge-pre">' + GC_API.formatKickoff(m.kickoff) + '</span>';
  }

  function loadingHTML() {
    return '<div class="gc-loading"><div class="gc-spinner"></div><span>Fetching live scores...</span></div>';
  }

  function noMatchesHTML() {
    return '<div class="gc-empty">📭 No matches found for today.<br><button class="gc-btn gc-btn-primary" onclick="GC.go(\'schedule\')">View Full Schedule</button></div>';
  }

  function errorHTML() {
    return '<div class="gc-empty">⚠️ Could not load scores. Please try again.<br><button class="gc-btn gc-btn-primary" onclick="GC_LIVE.render(document.getElementById(\'gc-content\'))">Retry</button></div>';
  }

  function esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;');
  }

  return {
    render    : render,
    setLeague : setLeague
  };

})();
