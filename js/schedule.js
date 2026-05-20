/* schedule.js — Full schedule with hardcoded PL Final Day + API for other dates */
var GC_SCHEDULE = (function () {
  var _league = 'PL';
  var _date   = null;
  var _wcRound = 'group';
  var _wcDate  = '2026-06-11';

  /* ALL 10 PL Final Day matches - Sunday 24 May 2026 — 5:00 PM UK */
  /* Source: ESPN official fixtures */
  var KO = '2026-05-24T16:00:00Z'; /* 5pm UK = 4pm UTC */
  var B = 'https://resources.premierleague.com/premierleague/badges/50/';
  var PL_FINAL_DAY = [
    {homeTeam:'Brighton',         homeLogo:B+'t36.png', awayTeam:'Man United',       awayLogo:B+'t1.png',  homeScore:null,awayScore:null,kickoff:KO,venue:'Amex Stadium, Brighton',            isLive:false,isFT:false,isPre:true,league:'Premier League',scorers:[]},
    {homeTeam:'Burnley',          homeLogo:B+'t90.png', awayTeam:'Wolves',            awayLogo:B+'t39.png', homeScore:null,awayScore:null,kickoff:KO,venue:'Turf Moor, Burnley',                isLive:false,isFT:false,isPre:true,league:'Premier League',scorers:[]},
    {homeTeam:'Crystal Palace',   homeLogo:B+'t31.png', awayTeam:'Arsenal',           awayLogo:B+'t3.png',  homeScore:null,awayScore:null,kickoff:KO,venue:'Selhurst Park, London',             isLive:false,isFT:false,isPre:true,league:'Premier League',scorers:[]},
    {homeTeam:'Fulham',           homeLogo:B+'t54.png', awayTeam:'Newcastle',         awayLogo:B+'t4.png',  homeScore:null,awayScore:null,kickoff:KO,venue:'Craven Cottage, London',            isLive:false,isFT:false,isPre:true,league:'Premier League',scorers:[]},
    {homeTeam:'Liverpool',        homeLogo:B+'t14.png', awayTeam:'Brentford',         awayLogo:B+'t94.png', homeScore:null,awayScore:null,kickoff:KO,venue:'Anfield, Liverpool',                isLive:false,isFT:false,isPre:true,league:'Premier League',scorers:[]},
    {homeTeam:'Man City',         homeLogo:B+'t43.png', awayTeam:'Aston Villa',       awayLogo:B+'t7.png',  homeScore:null,awayScore:null,kickoff:KO,venue:'Etihad Stadium, Manchester',        isLive:false,isFT:false,isPre:true,league:'Premier League',scorers:[]},
    {homeTeam:"Nott'm Forest",    homeLogo:B+'t17.png', awayTeam:'Bournemouth',       awayLogo:B+'t91.png', homeScore:null,awayScore:null,kickoff:KO,venue:'City Ground, Nottingham',           isLive:false,isFT:false,isPre:true,league:'Premier League',scorers:[]},
    {homeTeam:'Sunderland',       homeLogo:B+'t56.png', awayTeam:'Chelsea',           awayLogo:B+'t8.png',  homeScore:null,awayScore:null,kickoff:KO,venue:'Stadium of Light, Sunderland',     isLive:false,isFT:false,isPre:true,league:'Premier League',scorers:[]},
    {homeTeam:'Tottenham',        homeLogo:B+'t6.png',  awayTeam:'Everton',           awayLogo:B+'t11.png', homeScore:null,awayScore:null,kickoff:KO,venue:'Tottenham Hotspur Stadium, London', isLive:false,isFT:false,isPre:true,league:'Premier League',scorers:[]},
    {homeTeam:'West Ham',         homeLogo:B+'t21.png', awayTeam:'Leeds United',      awayLogo:B+'t2.png',  homeScore:null,awayScore:null,kickoff:KO,venue:'London Stadium, London',            isLive:false,isFT:false,isPre:true,league:'Premier League',scorers:[]}
  ];

  var WC_ROUNDS = [
    {id:'group', label:'⚽ Group Stage',     from:'2026-06-11', to:'2026-07-02'},
    {id:'r32',   label:'🔥 Round of 32',    from:'2026-07-04', to:'2026-07-07'},
    {id:'r16',   label:'⚡ Round of 16',    from:'2026-07-09', to:'2026-07-12'},
    {id:'qf',    label:'🏆 Quarter-Finals', from:'2026-07-14', to:'2026-07-15'},
    {id:'sf',    label:'🌟 Semi-Finals',    from:'2026-07-18', to:'2026-07-19'},
    {id:'final', label:'👑 Final',          from:'2026-07-26', to:'2026-07-26'}
  ];

  function setLeague(t) { _league = t; }

  function render(container) {
    if (!_date) _date = GC_API.today();
    if (_league === 'WC') renderWC(container);
    else renderPL(container);
  }

  function renderPL(container) {
    container.innerHTML =
      '<div style="padding-top:16px">' +
      '<div class="gc-hero-banner-wrap" style="height:140px;margin-bottom:18px">' +
        '<img src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=900&q=80" style="width:100%;height:100%;object-fit:cover" alt="PL">' +
        '<div class="gc-hero-banner-overlay">' +
          '<div class="gc-hero-banner-title">🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League Schedule</div>' +
          '<div class="gc-hero-banner-sub">2025/26 Season — Final Day Sunday 24 May</div>' +
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
      var isFinalDay = iso === '2026-05-24';
      html += '<button class="gc-date-btn' +
        (isToday?' gc-date-today':'') + (isSel?' gc-date-selected':'') +
        '" onclick="GC_SCHEDULE._pick(\'' + iso + '\')" ' +
        'style="' + (isFinalDay && !isSel?'border-color:#d97706;':'') + '">' +
        '<span class="gc-date-wd">' + d.toLocaleDateString('en-GB',{weekday:'short'}) + '</span>' +
        '<span class="gc-date-d">'  + d.getDate() + '</span>' +
        '<span class="gc-date-m">'  + d.toLocaleDateString('en-GB',{month:'short'}) + '</span>' +
        (isFinalDay?'<span style="font-size:8px;color:#d97706;font-weight:700">FINAL</span>':'') +
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

    /* PL Final Day — always show all 10 games from hardcoded data */
    if (_date === '2026-05-24') {
      /* Try live API first to get actual scores */
      el.innerHTML = '<div class="gc-loading"><div class="gc-spinner"></div><span>Loading Final Day matches...</span></div>';
      GC_API.getByDate('PL', '2026-05-24').then(function(apiMatches) {
        if (apiMatches && apiMatches.length >= 8) {
          el.innerHTML = matchList(apiMatches, '2026-05-24');
        } else {
          /* Use hardcoded fallback with live scores merged */
          var merged = PL_FINAL_DAY.map(function(m) {
            if (apiMatches) {
              var found = apiMatches.find(function(a) {
                return a.homeTeam && m.homeTeam &&
                  a.homeTeam.toLowerCase().indexOf(m.homeTeam.toLowerCase().split(' ')[0]) > -1;
              });
              if (found) return Object.assign({}, m, {homeScore:found.homeScore, awayScore:found.awayScore, isLive:found.isLive, isFT:found.isFT, isPre:found.isPre, minute:found.minute, scorers:found.scorers||[]});
            }
            return m;
          });
          el.innerHTML = matchList(merged, '2026-05-24');
        }
      }).catch(function() {
        el.innerHTML = matchList(PL_FINAL_DAY, '2026-05-24');
      });
      return;
    }

    el.innerHTML = '<div class="gc-loading"><div class="gc-spinner"></div><span>Loading matches...</span></div>';
    GC_API.getByDate('PL', _date).then(function(matches) {
      el.innerHTML = matchList(matches, _date);
    }).catch(function() {
      el.innerHTML = '<div class="gc-empty">⚠️ Could not load matches.</div>';
    });
  }

  function renderWC(container) {
    var tabsHtml = '<div class="gc-round-tabs">';
    WC_ROUNDS.forEach(function(r) {
      tabsHtml += '<button class="gc-round-tab' + (r.id===_wcRound?' active':'') +
        '" onclick="GC_SCHEDULE._wcRoundPick(\'' + r.id + '\')">' + r.label + '</button>';
    });
    tabsHtml += '</div>';

    container.innerHTML =
      '<div style="padding-top:16px">' +
      '<div class="gc-hero-banner-wrap" style="height:160px;margin-bottom:18px">' +
        '<img src="https://images.unsplash.com/photo-1567521464027-f127ff144326?w=900&q=80" style="width:100%;height:100%;object-fit:cover" alt="WC">' +
        '<div class="gc-hero-banner-overlay">' +
          '<div class="gc-hero-banner-title">🏆 FIFA World Cup 2026 Schedule</div>' +
          '<div class="gc-hero-banner-sub">USA · Canada · Mexico — 11 Jun to 26 Jul 2026</div>' +
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

    var promises = [];
    var d = new Date(round.from);
    var end = new Date(round.to);
    while (d <= end) {
      promises.push(GC_API.getByDate('WC', d.toISOString().slice(0,10)));
      d.setDate(d.getDate()+1);
    }

    Promise.all(promises).then(function(results) {
      var all = [].concat.apply([], results);
      var seen = {};
      all = all.filter(function(m) {
        var key = (m.homeTeam||'')+'|'+(m.awayTeam||'')+'|'+(m.kickoff||'').slice(0,10);
        if (seen[key]) return false; seen[key]=true; return true;
      });
      all.sort(function(a,b){ return new Date(a.kickoff)-new Date(b.kickoff); });
      if (!all.length) {
        el.innerHTML = '<div class="gc-empty">📭 Schedule will appear closer to the tournament.<br><small>World Cup starts 11 June 2026 🏆</small></div>';
        return;
      }
      el.innerHTML = matchList(all, null);
    }).catch(function() {
      el.innerHTML = '<div class="gc-empty">📭 Schedule will appear closer to the tournament.<br><small>World Cup starts 11 June 2026 🏆</small></div>';
    });
  }

  function matchList(matches, dateIso) {
    if (!matches || !matches.length) return '<div class="gc-empty">📭 No matches on this date.</div>';
    matches.sort(function(a,b){ return new Date(a.kickoff)-new Date(b.kickoff); });
    var html = '<div>';
    if (dateIso) html += '<div class="gc-date-label">' + fmtDayLabel(dateIso) + ' — ' + matches.length + ' matches</div>';

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
    html += '<div class="gc-match-meta"><span class="gc-match-league">' + esc(m.league||'Premier League') + '</span>';
    if (m.isLive)    html += '<span class="gc-badge gc-badge-live">🔴 LIVE ' + esc(m.statusShort||'') + '</span>';
    else if (m.isFT) html += '<span class="gc-badge gc-badge-ft">Full Time</span>';
    else             html += '<span class="gc-badge gc-badge-pre">⏰ ' + GC_API.formatKickoff(m.kickoff) + '</span>';
    html += '</div>';
    html += '<div class="gc-match-body">';
    html += '<div class="gc-team">' + (m.homeLogo?'<img class="gc-team-logo" src="'+esc(m.homeLogo)+'" alt="">':'') + '<span class="gc-team-name'+(homeWin?' gc-team-winner':'')+'">'+esc(m.homeTeam)+'</span></div>';
    html += '<div class="gc-score-wrap">';
    if (hasScore) html += '<span class="gc-score'+(m.isLive?' gc-score-live':'')+'">'+m.homeScore+'<span class="gc-score-sep">–</span>'+m.awayScore+'</span>';
    else          html += '<span class="gc-score gc-score-ko">'+GC_API.formatKickoff(m.kickoff)+'</span>';
    if (m.isLive && m.minute) html += '<div class="gc-match-minute">'+esc(m.minute)+'</div>';
    html += '</div>';
    html += '<div class="gc-team gc-team-away">' + (m.awayLogo?'<img class="gc-team-logo" src="'+esc(m.awayLogo)+'" alt="">':'') + '<span class="gc-team-name'+(awayWin?' gc-team-winner':'')+'">'+esc(m.awayTeam)+'</span></div>';
    html += '</div>';
    if (m.scorers && m.scorers.length) {
      html += '<div class="gc-scorers">';
      m.scorers.forEach(function(s) { html += '<span class="gc-scorer">⚽ '+esc(s.player)+(s.minute?' <span class="gc-scorer-min">'+esc(s.minute)+'</span>':'')+'</span>'; });
      html += '</div>';
    }
    if (m.venue) html += '<div class="gc-match-footer"><span>🏟 '+esc(m.venue)+'</span></div>';
    html += '</div>';
    return html;
  }

  function fmtDayLabel(iso) {
    if (!iso || iso==='unknown') return '';
    var d = new Date(iso);
    if (iso === GC_API.today()) return 'Today — ' + d.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});
    if (iso === '2026-05-24') return '🏆 PL Final Day — Sunday 24 May 2026';
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
    _wcDayPick: function(iso) {
      _wcDate = iso;
      buildWCDateBar();
      loadWCDay();
    },
    _wcRoundPick: function(id) {
      _wcRound = id;
      /* Set default date for this round */
      var round = WC_ROUNDS.find(function(r){ return r.id===id; });
      if (round) _wcDate = round.from;
      document.querySelectorAll('.gc-round-tab').forEach(function(b) {
        b.classList.toggle('active', b.textContent.trim().indexOf(round?round.label.slice(2):'') > -1);
      });
      buildWCDateBar();
      loadWCDay();
    }
  };
})();
