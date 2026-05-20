/* schedule.js — Full schedule: PL date picker + WC all rounds */
var GC_SCHEDULE = (function () {
  var _league = 'PL';
  var _date   = null;
  var _wcRound = 'group';

  var WC_ROUNDS = [
    { id:'group', label:'⚽ Group Stage',     from:'2026-06-11', to:'2026-07-02' },
    { id:'r32',   label:'🔥 Round of 32',    from:'2026-07-04', to:'2026-07-07' },
    { id:'r16',   label:'⚡ Round of 16',    from:'2026-07-09', to:'2026-07-12' },
    { id:'qf',    label:'🏆 Quarter-Finals', from:'2026-07-14', to:'2026-07-15' },
    { id:'sf',    label:'🌟 Semi-Finals',    from:'2026-07-18', to:'2026-07-19' },
    { id:'final', label:'👑 Final',          from:'2026-07-26', to:'2026-07-26' }
  ];

  function setLeague(t) { _league = t; }

  function render(container) {
    if (!_date) _date = GC_API.today();
    if (_league === 'WC') renderWC(container);
    else renderPL(container);
  }

  /* ── PL: scrollable date picker ────────────────────── */
  function renderPL(container) {
    container.innerHTML =
      '<div style="padding-top:16px">' +
      /* PL hero banner */
      '<div class="gc-hero-banner-wrap" style="height:140px;margin-bottom:18px">' +
        '<img src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=900&q=80" alt="PL" style="width:100%;height:100%;object-fit:cover">' +
        '<div class="gc-hero-banner-overlay">' +
          '<div class="gc-hero-banner-title">🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League Schedule</div>' +
          '<div class="gc-hero-banner-sub">2025/26 Season</div>' +
        '</div>' +
      '</div>' +
      '<div class="gc-section-title">📅 Pick a Date</div>' +
      '<div class="gc-datebar" id="gc-datebar"></div>' +
      '<div id="gc-sch-matches"></div>' +
      '</div>';

    buildDateBar();
    loadPLMatches();
  }

  function buildDateBar() {
    var bar = document.getElementById('gc-datebar');
    if (!bar) return;
    var html = '';
    var base = new Date();
    for (var i = -7; i <= 28; i++) {
      var d = new Date(base);
      d.setDate(base.getDate() + i);
      var iso = d.toISOString().slice(0,10);
      var isToday = iso === GC_API.today();
      var isSel   = iso === _date;
      html += '<button class="gc-date-btn' +
        (isToday?' gc-date-today':'') + (isSel?' gc-date-selected':'') +
        '" onclick="GC_SCHEDULE._pick(\'' + iso + '\')">' +
        '<span class="gc-date-wd">' + d.toLocaleDateString('en-GB',{weekday:'short'}) + '</span>' +
        '<span class="gc-date-d">'  + d.getDate() + '</span>' +
        '<span class="gc-date-m">'  + d.toLocaleDateString('en-GB',{month:'short'}) + '</span>' +
        '</button>';
    }
    bar.innerHTML = html;
    setTimeout(function() {
      var sel = bar.querySelector('.gc-date-selected');
      if (sel) sel.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'});
    }, 100);
  }

  function loadPLMatches() {
    var el = document.getElementById('gc-sch-matches');
    if (!el) return;
    el.innerHTML = '<div class="gc-loading"><div class="gc-spinner"></div><span>Loading matches...</span></div>';
    GC_API.getByDate('PL', _date).then(function(matches) {
      el.innerHTML = matchList(matches, _date);
    }).catch(function() {
      el.innerHTML = '<div class="gc-empty">⚠️ Could not load matches.</div>';
    });
  }

  /* ── WC: round tabs + matches ───────────────────────── */
  function renderWC(container) {
    var tabsHtml = '<div class="gc-round-tabs">';
    WC_ROUNDS.forEach(function(r) {
      tabsHtml += '<button class="gc-round-tab' + (r.id===_wcRound?' active':'') +
        '" onclick="GC_SCHEDULE._wcRoundPick(\'' + r.id + '\')">' + r.label + '</button>';
    });
    tabsHtml += '</div>';

    container.innerHTML =
      '<div style="padding-top:16px">' +
      /* WC hero banner — Azadi Stadium */
      '<div class="gc-hero-banner-wrap" style="height:160px;margin-bottom:18px">' +
        '<img src="https://images.unsplash.com/photo-1567521464027-f127ff144326?w=900&q=80" alt="World Cup" style="width:100%;height:100%;object-fit:cover">' +
        '<div class="gc-hero-banner-overlay">' +
          '<div class="gc-hero-banner-title">🏆 FIFA World Cup 2026</div>' +
          '<div class="gc-hero-banner-sub">USA · Canada · Mexico</div>' +
        '</div>' +
      '</div>' +
      '<div class="gc-section-title">📅 World Cup Schedule</div>' +
      tabsHtml +
      '<div id="gc-sch-matches"></div>' +
      '</div>';

    loadWCRound();
  }

  function loadWCRound() {
    var el = document.getElementById('gc-sch-matches');
    if (!el) return;
    var round = WC_ROUNDS.find(function(r){ return r.id === _wcRound; });
    if (!round) return;

    el.innerHTML = '<div class="gc-loading"><div class="gc-spinner"></div><span>Loading ' + round.label + '...</span></div>';

    // fetch matches for the date range
    var promises = [];
    var d = new Date(round.from);
    var end = new Date(round.to);
    while (d <= end) {
      promises.push(GC_API.getByDate('WC', d.toISOString().slice(0,10)));
      var nd = new Date(d); nd.setDate(nd.getDate()+1); d = nd;
    }

    Promise.all(promises).then(function(results) {
      var all = [].concat.apply([], results);
      // deduplicate
      var seen = {};
      all = all.filter(function(m) {
        var key = (m.homeTeam||'')+'|'+(m.awayTeam||'')+'|'+(m.kickoff||'');
        if (seen[key]) return false; seen[key]=true; return true;
      });
      // sort by date
      all.sort(function(a,b){ return new Date(a.kickoff)-new Date(b.kickoff); });
      if (!all.length) {
        el.innerHTML = '<div class="gc-empty">📭 No matches found for this round yet.<br><small>Data will appear closer to the tournament.</small></div>';
        return;
      }
      el.innerHTML = matchList(all, null);
    }).catch(function() {
      el.innerHTML = '<div class="gc-empty">⚠️ Could not load World Cup schedule.</div>';
    });
  }

  /* ── shared match list renderer ─────────────────────── */
  function matchList(matches, dateIso) {
    if (!matches || !matches.length) {
      return '<div class="gc-empty">📭 No matches on this date.</div>';
    }
    matches.sort(function(a,b){ return new Date(a.kickoff)-new Date(b.kickoff); });

    var html = '<div>';
    if (dateIso) html += '<div class="gc-date-label">' + fmtDayLabel(dateIso) + '</div>';

    // group by date for WC multi-day view
    var grouped = {};
    matches.forEach(function(m) {
      var day = m.kickoff ? m.kickoff.slice(0,10) : 'unknown';
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(m);
    });

    Object.keys(grouped).sort().forEach(function(day) {
      if (!dateIso && day !== 'unknown') {
        html += '<div class="gc-group-label">' + fmtDayLabel(day) + '</div>';
      }
      grouped[day].forEach(function(m) { html += matchCard(m); });
    });

    html += '</div>';
    return html;
  }

  function matchCard(m) {
    var hasScore = m.homeScore !== null && m.awayScore !== null;
    var homeWin  = m.homeScore > m.awayScore;
    var awayWin  = m.awayScore > m.homeScore;

    var html = '<div class="gc-match-card' + (m.isLive?' gc-match-live':'') + '">';
    html += '<div class="gc-match-meta">';
    html += '<span class="gc-match-league">' + esc(m.league) + '</span>';
    if (m.isLive)      html += '<span class="gc-badge gc-badge-live">🔴 LIVE ' + esc(m.statusShort) + '</span>';
    else if (m.isFT)   html += '<span class="gc-badge gc-badge-ft">Full Time</span>';
    else               html += '<span class="gc-badge gc-badge-pre">⏰ ' + GC_API.formatKickoff(m.kickoff) + '</span>';
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

  function fmtDayLabel(iso) {
    if (!iso || iso === 'unknown') return '';
    var d = new Date(iso);
    if (iso === GC_API.today()) return 'Today — ' + d.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});
    return d.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  }

  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return {
    render    : render,
    setLeague : setLeague,
    _pick     : function(iso) { _date = iso; buildDateBar(); loadPLMatches(); },
    _wcRoundPick: function(id) {
      _wcRound = id;
      document.querySelectorAll('.gc-round-tab').forEach(function(b){ b.classList.toggle('active', b.textContent.includes(WC_ROUNDS.find(function(r){return r.id===id;}).label.slice(2))); });
      loadWCRound();
    }
  };
})();
