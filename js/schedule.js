/* ============================================================
   schedule.js — Full schedule, date picker, past results
   goalcurrent.live
   ============================================================ */

var GC_SCHEDULE = (function () {

  var _league      = 'PL';
  var _selectedDate = null;

  function setLeague(type) { _league = type; }

  /* ── render ───────────────────────────────────────────── */
  function render(container) {
    if (!_selectedDate) _selectedDate = GC_API.today();
    container.innerHTML = buildShell();
    renderDateBar();
    loadMatches(container);
  }

  /* outer shell with date bar + content area */
  function buildShell() {
    return '<div class="gc-schedule-wrap">' +
      '<div class="gc-schedule-header">' +
        '<div class="gc-section-title">📅 Match Schedule</div>' +
      '</div>' +
      '<div class="gc-datebar" id="gc-datebar"></div>' +
      '<div id="gc-schedule-matches"></div>' +
    '</div>';
  }

  /* ── date bar — 7 days centred on today ──────────────── */
  function renderDateBar() {
    var bar = document.getElementById('gc-datebar');
    if (!bar) return;

    var days = [];
    var base = new Date();
    for (var i = -3; i <= 7; i++) {
      var d = new Date(base);
      d.setDate(base.getDate() + i);
      days.push(d);
    }

    var html = '';
    days.forEach(function (d) {
      var iso    = d.toISOString().slice(0, 10);
      var isToday = iso === GC_API.today();
      var isSel  = iso === _selectedDate;
      var weekday = d.toLocaleDateString('en-GB', { weekday: 'short' });
      var dayNum  = d.getDate();
      var mon     = d.toLocaleDateString('en-GB', { month: 'short' });

      html += '<button class="gc-date-btn' +
              (isToday ? ' gc-date-today' : '') +
              (isSel   ? ' gc-date-selected' : '') +
              '" data-date="' + iso + '" onclick="GC_SCHEDULE._pick(\'' + iso + '\')">' +
              '<span class="gc-date-wd">' + weekday + '</span>' +
              '<span class="gc-date-d">'  + dayNum  + '</span>' +
              '<span class="gc-date-m">'  + mon     + '</span>' +
              '</button>';
    });

    bar.innerHTML = html;

    // scroll selected into view
    setTimeout(function () {
      var sel = bar.querySelector('.gc-date-selected');
      if (sel) sel.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    }, 100);
  }

  /* ── pick a date ─────────────────────────────────────── */
  function pickDate(iso) {
    _selectedDate = iso;
    renderDateBar();
    var cont = document.getElementById('gc-schedule-matches');
    if (cont) loadMatches(cont);
  }

  /* ── fetch + render matches for selected date ─────────── */
  function loadMatches(container) {
    var target = typeof container === 'string'
      ? document.getElementById(container)
      : (container.id === 'gc-schedule-matches' ? container : document.getElementById('gc-schedule-matches'));

    if (!target) return;
    target.innerHTML = '<div class="gc-loading"><div class="gc-spinner"></div><span>Loading matches...</span></div>';

    GC_API.getByDate(_league, _selectedDate).then(function (matches) {
      target.innerHTML = buildMatchList(matches);
    }).catch(function () {
      target.innerHTML = '<div class="gc-empty">⚠️ Could not load matches. Please try again.</div>';
    });
  }

  function buildMatchList(matches) {
    if (!matches || !matches.length) {
      return '<div class="gc-empty">📭 No matches on this date.</div>';
    }

    // sort by kickoff time
    matches.sort(function (a, b) {
      return new Date(a.kickoff) - new Date(b.kickoff);
    });

    var html = '<div class="gc-match-list">';
    html += '<div class="gc-date-label">' + formatDayLabel(_selectedDate) + '</div>';

    matches.forEach(function (m) {
      html += scheduleCard(m);
    });

    html += '</div>';
    return html;
  }

  function scheduleCard(m) {
    var hasScore = m.homeScore !== null && m.awayScore !== null;
    var homeWin  = m.homeScore > m.awayScore;
    var awayWin  = m.awayScore > m.homeScore;

    var html = '<div class="gc-match-card' + (m.isLive ? ' gc-match-live' : '') + '">';

    // meta row
    html += '<div class="gc-match-meta">';
    html += '<span class="gc-match-league">' + esc(m.league) + '</span>';
    if (m.isLive) {
      html += '<span class="gc-badge gc-badge-live">🔴 ' + esc(m.statusShort || 'LIVE') + '</span>';
    } else if (m.isFT) {
      html += '<span class="gc-badge gc-badge-ft">Full Time</span>';
    } else {
      html += '<span class="gc-badge gc-badge-pre">⏰ ' + GC_API.formatKickoff(m.kickoff) + '</span>';
    }
    html += '</div>';

    // teams + score
    html += '<div class="gc-match-body">';

    html += '<div class="gc-team gc-team-home">';
    if (m.homeLogo) html += '<img class="gc-team-logo" src="' + esc(m.homeLogo) + '" alt="">';
    html += '<span class="gc-team-name' + (homeWin ? ' gc-team-winner' : '') + '">' + esc(m.homeTeam) + '</span>';
    html += '</div>';

    html += '<div class="gc-score-wrap">';
    if (hasScore) {
      html += '<span class="gc-score' + (m.isLive ? ' gc-score-live' : '') + '">' +
              m.homeScore + ' – ' + m.awayScore + '</span>';
    } else {
      html += '<span class="gc-score gc-score-ko">' + GC_API.formatKickoff(m.kickoff) + '</span>';
    }
    if (m.isLive && m.minute) {
      html += '<div class="gc-match-minute">' + esc(m.minute) + '</div>';
    }
    html += '</div>';

    html += '<div class="gc-team gc-team-away">';
    if (m.awayLogo) html += '<img class="gc-team-logo" src="' + esc(m.awayLogo) + '" alt="">';
    html += '<span class="gc-team-name' + (awayWin ? ' gc-team-winner' : '') + '">' + esc(m.awayTeam) + '</span>';
    html += '</div>';

    html += '</div>'; // .gc-match-body

    // scorers (past results)
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

    // venue + TV
    if (m.venue || (m.tv && m.tv.length)) {
      html += '<div class="gc-match-footer">';
      if (m.venue) html += '<span class="gc-venue">🏟 ' + esc(m.venue) + (m.city ? ', ' + esc(m.city) : '') + '</span>';
      if (m.tv && m.tv.length) html += '<span class="gc-tv">📺 ' + m.tv.map(esc).join(', ') + '</span>';
      html += '</div>';
    }

    html += '</div>'; // .gc-match-card
    return html;
  }

  /* ── helpers ─────────────────────────────────────────── */
  function formatDayLabel(iso) {
    var d = new Date(iso);
    var today = GC_API.today();
    if (iso === today) return 'Today — ' + d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    var yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    if (iso === yesterday.toISOString().slice(0,10)) return 'Yesterday — ' + d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  function esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return {
    render    : render,
    setLeague : setLeague,
    _pick     : pickDate   // called from inline onclick
  };

})();
