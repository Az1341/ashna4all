/* live.js — Live scores with My Teams highlighting */
var GC_LIVE = (function () {
  var _league = 'PL';
  var _timer  = null;
  function setLeague(t) { _league = t; }

  function render(container) {
    if (_timer) clearInterval(_timer);
    container.innerHTML = '<div class="gc-loading"><div class="gc-spinner"></div><span>Fetching live scores...</span></div>';
    fetchAndRender(container);
    _timer = setInterval(function() { fetchAndRender(container); }, 60000);
  }

  function fetchAndRender(container) {
    // Try today's matches first (more reliable than live endpoint)
    GC_API.getByDate(_league, GC_API.today()).then(function(matches) {
      if (matches && matches.length) {
        container.innerHTML = buildHTML(matches, true);
      } else {
        container.innerHTML = noMatchesHTML();
      }
    }).catch(function(err) {
      console.log('API error:', err);
      container.innerHTML = '<div class="gc-empty">⚠️ Could not load scores right now.<br><small>This may be a CORS issue with the free API.</small><br><br><button class="gc-btn gc-btn-primary" onclick="GC.draw()">🔄 Retry</button></div>';
    });
  }

  function buildHTML(matches, isToday) {
    if (!matches || !matches.length) return noMatchesHTML();
    var live     = matches.filter(function(m){ return m.isLive; });
    var upcoming = matches.filter(function(m){ return m.isPre; });
    var finished = matches.filter(function(m){ return m.isFT; });

    var html = '<div style="padding-top:16px">';

    /* Live hero banner */
    html += '<div class="gc-hero-banner-wrap" style="height:130px;margin-bottom:18px">' +
      '<img src="' + (_league==='WC'
        ? 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=900&q=80'
        : 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=900&q=80') +
      '" alt="" style="width:100%;height:100%;object-fit:cover">' +
      '<div class="gc-hero-banner-overlay">' +
        '<div class="gc-hero-banner-title">' + (isToday ? '📅 Today\'s Matches' : '<span style="display:inline-flex;align-items:center;gap:8px"><span class="gc-live-dot"></span>Live Now</span>') + '</div>' +
        '<div class="gc-hero-banner-sub">' + matches.length + ' matches · Auto-refreshes every 60s</div>' +
      '</div></div>';

    html += '<div class="gc-section-header">' +
      '<span class="gc-section-title" style="margin-bottom:0">' + (isToday ? '📅 Today' : '<span class="gc-live-dot"></span>Live') + '</span>' +
      '<span class="gc-section-count">' + matches.length + ' matches</span>' +
    '</div>';

    if (live.length)     { html += '<div class="gc-group-label">🔴 In Progress</div>';  live.forEach(function(m){ html += matchCard(m); }); }
    if (upcoming.length) { html += '<div class="gc-group-label">⏰ Upcoming</div>';      upcoming.forEach(function(m){ html += matchCard(m); }); }
    if (finished.length) { html += '<div class="gc-group-label">✅ Full Time</div>';     finished.forEach(function(m){ html += matchCard(m); }); }

    html += '<div class="gc-refresh-note">⟳ Auto-refreshes every 60 seconds</div>';
    html += '</div>';
    return html;
  }

  function matchCard(m) {
    var hasScore = m.homeScore !== null && m.awayScore !== null;
    var homeWin  = m.homeScore > m.awayScore;
    var awayWin  = m.awayScore > m.homeScore;
    var isMine   = window.GC_MYTEAMS && GC_MYTEAMS.isMyMatch(m);

    var html = '<div class="gc-match-card' + (m.isLive?' gc-match-live':'') + (isMine?' gc-match-mine':'') + '">';
    if (isMine) html += '<div style="font-size:10px;font-weight:700;color:#d97706;margin-bottom:6px">⭐ Your Team</div>';

    html += '<div class="gc-match-meta">' +
      '<span class="gc-match-league">' + esc(m.league) + '</span>';
    if (m.isLive)    html += '<span class="gc-badge gc-badge-live">🔴 ' + esc(m.statusShort||'LIVE') + '</span>';
    else if (m.isFT) html += '<span class="gc-badge gc-badge-ft">Full Time</span>';
    else             html += '<span class="gc-badge gc-badge-pre">⏰ ' + GC_API.formatKickoff(m.kickoff) + '</span>';
    html += '</div>';

    html += '<div class="gc-match-body">';
    html += '<div class="gc-team">';
    if (m.homeLogo) html += '<img class="gc-team-logo" src="' + esc(m.homeLogo) + '" alt="">';
    html += '<span class="gc-team-name' + (homeWin?' gc-team-winner':'') + '">' + esc(m.homeTeam) + '</span></div>';

    html += '<div class="gc-score-wrap">';
    if (hasScore) html += '<span class="gc-score' + (m.isLive?' gc-score-live':'') + '">' + m.homeScore + '<span class="gc-score-sep">–</span>' + m.awayScore + '</span>';
    else          html += '<span class="gc-score gc-score-ko">' + GC_API.formatKickoff(m.kickoff) + '</span>';
    if (m.isLive && m.minute) html += '<div class="gc-match-minute">' + esc(m.minute) + '</div>';
    html += '</div>';

    html += '<div class="gc-team gc-team-away">';
    if (m.awayLogo) html += '<img class="gc-team-logo" src="' + esc(m.awayLogo) + '" alt="">';
    html += '<span class="gc-team-name' + (awayWin?' gc-team-winner':'') + '">' + esc(m.awayTeam) + '</span></div>';
    html += '</div>';

    if (m.scorers && m.scorers.length) {
      html += '<div class="gc-scorers">';
      m.scorers.forEach(function(s) {
        html += '<span class="gc-scorer">⚽ ' + esc(s.player) + (s.minute?' <span class="gc-scorer-min">'+esc(s.minute)+'</span>':'') + '</span>';
      });
      html += '</div>';
    }
    if (m.venue || (m.tv && m.tv.length)) {
      html += '<div class="gc-match-footer">';
      if (m.venue) html += '<span>🏟 ' + esc(m.venue) + (m.city?', '+esc(m.city):'') + '</span>';
      if (m.tv && m.tv.length) html += '<span>📺 ' + m.tv.map(esc).join(', ') + '</span>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function noMatchesHTML() {
    return '<div class="gc-empty">📭 No matches today.<br><button class="gc-btn gc-btn-primary" onclick="GC.go(\'schedule\')">View Schedule</button></div>';
  }

  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return { render: render, setLeague: setLeague };
})();
