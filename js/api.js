/* ============================================================
   api.js — Smart multi-source football data engine
   goalcurrent.live
   Priority: ESPN → TheSportsDB → API-Football
   PL League ID (API-Football): 39  Season: 2025
   WC League ID (API-Football): 1   Season: 2026
   ============================================================ */

var GC_API = (function () {

  var API_FOOTBALL_KEY = '5daaac9cb6e548983db1a90l1a97d9c9';

  var IDS = {
    espn:        { PL: 'eng.1',  WC: 'fifa.world' },
    sportsdb:    { PL: '4328',   WC: '4429'        },
    apifootball: { PL: 39,       WC: 1             }
  };

  /* ── Date helpers ─────────────────────────────────────── */
  function today() {
    var d = new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var dd = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + dd;
  }

  function formatKickoff(iso) {
    if (!iso) return '';
    try {
      var d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch(e) { return iso; }
  }

  /* ── Normalise match from ESPN format ─────────────────── */
  function normaliseESPN(event, leagueLabel) {
    try {
      var comp  = event.competitions && event.competitions[0];
      if (!comp) return null;
      var comps = comp.competitors || [];
      var home  = comps.find(function(c){ return c.homeAway === 'home'; }) || comps[0] || {};
      var away  = comps.find(function(c){ return c.homeAway === 'away'; }) || comps[1] || {};
      var status = event.status || {};
      var stype  = (status.type || {});
      var state  = stype.state || '';   /* pre / in / post */
      var detail = stype.shortDetail || stype.description || '';

      /* Scorers — ESPN puts them in linescores / leaders — skip for now */
      return {
        id:         event.id,
        league:     leagueLabel || 'PL',
        homeTeam:   (home.team || {}).displayName || home.team && home.team.name || '?',
        awayTeam:   (away.team || {}).displayName || away.team && away.team.name || '?',
        homeLogo:   (home.team || {}).logo || null,
        awayLogo:   (away.team || {}).logo || null,
        homeScore:  home.score != null ? Number(home.score) : null,
        awayScore:  away.score != null ? Number(away.score) : null,
        kickoff:    event.date || null,
        isLive:     state === 'in',
        isPre:      state === 'pre',
        isFT:       state === 'post',
        minute:     state === 'in' ? (detail || null) : null,
        statusShort: detail,
        venue:      comp.venue ? comp.venue.fullName : null,
        city:       comp.venue && comp.venue.address ? comp.venue.address.city : null,
        tv:         [],
        scorers:    []
      };
    } catch(e) { return null; }
  }

  /* ── Normalise match from TheSportsDB format ──────────── */
  function normaliseSDB(event, leagueLabel) {
    try {
      var hs = event.intHomeScore, as = event.intAwayScore;
      var status = (event.strStatus || '').toLowerCase();
      var isLive = status === 'live' || status === 'in progress';
      var isFT   = status === 'match finished' || status === 'ft' || hs !== null;
      var isPre  = !isLive && !isFT;
      return {
        id:         event.idEvent,
        league:     leagueLabel || 'PL',
        homeTeam:   event.strHomeTeam || '?',
        awayTeam:   event.strAwayTeam || '?',
        homeLogo:   event.strHomeTeamBadge || null,
        awayLogo:   event.strAwayTeamBadge || null,
        homeScore:  hs != null ? Number(hs) : null,
        awayScore:  as != null ? Number(as) : null,
        kickoff:    event.strTimestamp || (event.dateEvent + 'T' + (event.strTime || '15:00:00') + 'Z'),
        isLive:     isLive,
        isPre:      isPre,
        isFT:       isFT,
        minute:     null,
        statusShort: event.strStatus || '',
        venue:      event.strVenue || null,
        city:       null,
        tv:         [],
        scorers:    []
      };
    } catch(e) { return null; }
  }

  /* ── Normalise match from API-Football format ─────────── */
  function normaliseAF(fixture, leagueLabel) {
    try {
      var f = fixture.fixture || {};
      var t = fixture.teams || {};
      var g = fixture.goals || {};
      var s = f.status || {};
      var elapsed = s.elapsed;
      var shortS  = s.short || '';
      var isLive  = ['1H','HT','2H','ET','BT','P','INT'].indexOf(shortS) > -1;
      var isFT    = ['FT','AET','PEN'].indexOf(shortS) > -1;
      var isPre   = !isLive && !isFT;
      return {
        id:         f.id,
        league:     leagueLabel || 'PL',
        homeTeam:   (t.home || {}).name || '?',
        awayTeam:   (t.away || {}).name || '?',
        homeLogo:   (t.home || {}).logo || null,
        awayLogo:   (t.away || {}).logo || null,
        homeScore:  g.home != null ? Number(g.home) : null,
        awayScore:  g.away != null ? Number(g.away) : null,
        kickoff:    f.date || null,
        isLive:     isLive,
        isPre:      isPre,
        isFT:       isFT,
        minute:     elapsed ? elapsed + "'" : null,
        statusShort: shortS,
        venue:      (f.venue || {}).name || null,
        city:       (f.venue || {}).city || null,
        tv:         [],
        scorers:    []
      };
    } catch(e) { return null; }
  }

  /* ── ESPN fetch ───────────────────────────────────────── */
  function fetchESPN(league, date) {
    var leagueId = IDS.espn[league] || IDS.espn.PL;
    /* ESPN date format: YYYYMMDD */
    var d = (date || today()).replace(/-/g, '');
    var url = 'https://site.api.espn.com/apis/site/v2/sports/soccer/' +
              leagueId + '/scoreboard?dates=' + d + '&limit=50';
    return fetch(url)
      .then(function(r){ return r.json(); })
      .then(function(data){
        var events = data.events || [];
        if (!events.length) throw new Error('ESPN: no events');
        var label = league === 'WC' ? 'World Cup' : 'Premier League';
        var matches = events.map(function(e){ return normaliseESPN(e, label); })
                            .filter(Boolean);
        console.log('[GC] ESPN OK —', matches.length, 'matches');
        return matches;
      });
  }

  /* ── TheSportsDB fetch ────────────────────────────────── */
  function fetchSDB(league, date) {
    var leagueId = IDS.sportsdb[league] || IDS.sportsdb.PL;
    var d = date || today();
    /* Free endpoint: eventsday.php returns all events on a date */
    var url = 'https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=' + d + '&l=' + leagueId;
    return fetch(url)
      .then(function(r){ return r.json(); })
      .then(function(data){
        var events = data.events || [];
        if (!events.length) throw new Error('SDB: no events');
        var label = league === 'WC' ? 'World Cup' : 'Premier League';
        var matches = events.map(function(e){ return normaliseSDB(e, label); })
                            .filter(Boolean);
        console.log('[GC] TheSportsDB OK —', matches.length, 'matches');
        return matches;
      });
  }

  /* ── API-Football fetch ───────────────────────────────── */
  function fetchAF(league, date) {
    var leagueId = IDS.apifootball[league] || IDS.apifootball.PL;
    var season   = league === 'WC' ? 2026 : 2025;
    var d = date || today();
    var url = 'https://v3.football.api-sports.io/fixtures?league=' +
              leagueId + '&season=' + season + '&date=' + d;
    return fetch(url, {
      headers: { 'x-apisports-key': API_FOOTBALL_KEY }
    })
    .then(function(r){ return r.json(); })
    .then(function(data){
      var fixtures = data.response || [];
      if (!fixtures.length) throw new Error('AF: no fixtures');
      var label = league === 'WC' ? 'World Cup' : 'Premier League';
      var matches = fixtures.map(function(f){ return normaliseAF(f, label); })
                            .filter(Boolean);
      console.log('[GC] API-Football OK —', matches.length, 'matches');
      return matches;
    });
  }

  /* ── Main public method: getByDate ────────────────────── */
  function getByDate(league, date) {
    /* Chain: ESPN → SDB → API-Football */
    return fetchESPN(league, date)
      .catch(function(e1){
        console.warn('[GC] ESPN failed:', e1.message, '— trying TheSportsDB…');
        return fetchSDB(league, date);
      })
      .catch(function(e2){
        console.warn('[GC] TheSportsDB failed:', e2.message, '— trying API-Football…');
        return fetchAF(league, date);
      })
      .catch(function(e3){
        console.error('[GC] All APIs failed:', e3.message);
        return [];
      });
  }

  /* ── Standings (API-Football only — most reliable) ────── */
  function getStandings(league) {
    var leagueId = IDS.apifootball[league] || IDS.apifootball.PL;
    var season   = league === 'WC' ? 2026 : 2025;
    var url = 'https://v3.football.api-sports.io/standings?league=' +
              leagueId + '&season=' + season;
    return fetch(url, { headers: { 'x-apisports-key': API_FOOTBALL_KEY } })
      .then(function(r){ return r.json(); })
      .then(function(data){
        var resp = data.response || [];
        if (!resp.length) return [];
        return (resp[0].league || {}).standings || [];
      });
  }

  return {
    today:          today,
    formatKickoff:  formatKickoff,
    getByDate:      getByDate,
    getStandings:   getStandings
  };

})();
