// api/scores.js — GoalCurrent.live
// api-football v3 (api-sports.io) — PRO plan
// WC 2026: League ID 1 | Season 2026
// Endpoints served:
//   GET /api/scores                      → today's WC fixtures (by visitor date)
//   GET /api/scores?date=YYYY-MM-DD      → fixtures for specific date
//   GET /api/scores?live=true            → currently live WC fixtures
//   GET /api/scores?results=wc           → ALL finished WC fixtures (for wc-results.js)
//   GET /api/scores?id=FIXTURE_ID        → full match detail (events, lineups, stats, players)

const API_KEY  = process.env.API_FOOTBALL_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';
const WC_LEAGUE  = 1;
const WC_SEASON  = 2026;
const TOURNAMENT_START = new Date('2026-06-11T19:00:00Z');

const reqHeaders = () => ({ 'x-apisports-key': API_KEY });

function isTournamentLive() { return new Date() >= TOURNAMENT_START; }
function todayUTC()         { return new Date().toISOString().split('T')[0]; }

async function apiFetch(path) {
  const res = await fetch(`${BASE_URL}${path}`, { headers: reqHeaders() });
  if (!res.ok) throw new Error(`api-sports ${res.status} — ${path}`);
  const json = await res.json();
  if (json.errors && Object.keys(json.errors).length)
    throw new Error(JSON.stringify(json.errors));
  return json.response || [];
}

// ── formatters ────────────────────────────────────────────────────────────────

function fmtFixture(f) {
  return {
    id:        f.fixture.id,
    date:      f.fixture.date,
    utc:       f.fixture.date,
    timestamp: f.fixture.timestamp,
    venue:     f.fixture.venue?.name  || '',
    city:      f.fixture.venue?.city  || '',
    referee:   f.fixture.referee      || '',
    status: {
      long:    f.fixture.status.long,
      short:   f.fixture.status.short,
      elapsed: f.fixture.status.elapsed
    },
    league: {
      id:    f.league.id,
      name:  f.league.name,
      round: f.league.round
    },
    home:  { id: f.teams.home.id, name: f.teams.home.name, logo: f.teams.home.logo, winner: f.teams.home.winner },
    away:  { id: f.teams.away.id, name: f.teams.away.name, logo: f.teams.away.logo, winner: f.teams.away.winner },
    goals: { home: f.goals.home, away: f.goals.away },
    goalsHome: f.goals.home,
    goalsAway: f.goals.away,
    score: {
      halftime:  { home: f.score.halftime?.home,  away: f.score.halftime?.away  },
      fulltime:  { home: f.score.fulltime?.home,  away: f.score.fulltime?.away  },
      extratime: { home: f.score.extratime?.home, away: f.score.extratime?.away },
      penalty:   { home: f.score.penalty?.home,   away: f.score.penalty?.away   }
    }
  };
}

function fmtEvents(events) {
  return events.map(e => ({
    time:     e.time.elapsed,
    extra:    e.time.extra   || null,
    team:     { id: e.team.id,   name: e.team.name },
    player:   { id: e.player.id, name: e.player.name },
    assist:   e.assist?.name || null,
    type:     e.type,
    detail:   e.detail,
    comments: e.comments || null
  }));
}

function fmtLineups(lineups) {
  return lineups.map(l => ({
    team:      { id: l.team.id, name: l.team.name, logo: l.team.logo },
    coach:     { id: l.coach?.id, name: l.coach?.name, photo: l.coach?.photo },
    formation: l.formation,
    startXI: (l.startXI || []).map(p => ({
      id:     p.player.id,
      name:   p.player.name,
      number: p.player.number,
      pos:    p.player.pos,
      grid:   p.player.grid
    })),
    substitutes: (l.substitutes || []).map(p => ({
      id:     p.player.id,
      name:   p.player.name,
      number: p.player.number,
      pos:    p.player.pos
    }))
  }));
}

function fmtStats(stats) {
  return stats.map(s => ({
    team: { id: s.team.id, name: s.team.name },
    data: (s.statistics || []).reduce((acc, item) => {
      const key = item.type.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      acc[key] = item.value;
      return acc;
    }, {})
  }));
}

function fmtPlayers(players) {
  return players.map(teamData => ({
    team: { id: teamData.team.id, name: teamData.team.name, logo: teamData.team.logo },
    players: (teamData.players || []).map(p => {
      const s = p.statistics?.[0] || {};
      return {
        id:       p.player.id,
        name:     p.player.name,
        photo:    p.player.photo,
        number:   s.games?.number,
        pos:      s.games?.position,
        rating:   s.games?.rating,
        minutes:  s.games?.minutes,
        captain:  s.games?.captain,
        goals: {
          total:    s.goals?.total,
          assists:  s.goals?.assists,
          saves:    s.goals?.saves,
          conceded: s.goals?.conceded
        },
        shots:    { total: s.shots?.total, on: s.shots?.on },
        passes:   { total: s.passes?.total, key: s.passes?.key, accuracy: s.passes?.accuracy },
        tackles:  { total: s.tackles?.total, blocks: s.tackles?.blocks, interceptions: s.tackles?.interceptions },
        duels:    { total: s.duels?.total, won: s.duels?.won },
        dribbles: { attempts: s.dribbles?.attempts, success: s.dribbles?.success },
        fouls:    { drawn: s.fouls?.drawn, committed: s.fouls?.committed },
        cards:    { yellow: s.cards?.yellow, yellowred: s.cards?.yellowred, red: s.cards?.red },
        penalty:  { won: s.penalty?.won, committed: s.penalty?.committed, scored: s.penalty?.scored,
                    missed: s.penalty?.missed, saved: s.penalty?.saved }
      };
    })
  }));
}

// ── route handlers ────────────────────────────────────────────────────────────

async function getByDate(date) {
  const raw = await apiFetch(`/fixtures?league=${WC_LEAGUE}&season=${WC_SEASON}&date=${date}&timezone=Europe/London`);
  return raw.map(fmtFixture);
}

async function getLive() {
  const raw = await apiFetch(`/fixtures?league=${WC_LEAGUE}&season=${WC_SEASON}&live=all`);
  return raw.map(fmtFixture);
}

// Returns ALL finished WC fixtures — consumed by wc-results.js on every page
// Cache reduced to 60s to ensure scores appear promptly after matches end
async function getAllResults() {
  const FT_STATUSES = ['FT', 'AET', 'PEN'];
  const raw = await apiFetch(`/fixtures?league=${WC_LEAGUE}&season=${WC_SEASON}&status=FT-AET-PEN`);
  return raw
    .filter(f => FT_STATUSES.includes(f.fixture.status.short))
    .map(fmtFixture);
}

async function getDetail(id) {
  const [fixtureRes, eventsRes, lineupsRes, statsRes, playersRes] = await Promise.allSettled([
    apiFetch(`/fixtures?id=${id}`),
    apiFetch(`/fixtures/events?fixture=${id}`),
    apiFetch(`/fixtures/lineups?fixture=${id}`),
    apiFetch(`/fixtures/statistics?fixture=${id}`),
    apiFetch(`/fixtures/players?fixture=${id}`)
  ]);

  const fixtureRaw = fixtureRes.status === 'fulfilled' ? fixtureRes.value : [];
  const eventsRaw  = eventsRes.status  === 'fulfilled' ? eventsRes.value  : [];
  const lineupsRaw = lineupsRes.status === 'fulfilled' ? lineupsRes.value : [];
  const statsRaw   = statsRes.status   === 'fulfilled' ? statsRes.value   : [];
  const playersRaw = playersRes.status === 'fulfilled' ? playersRes.value : [];

  const fixture = fixtureRaw[0];
  if (!fixture) return null;

  return {
    fixture:    fmtFixture(fixture),
    events:     fmtEvents(eventsRaw),
    lineups:    fmtLineups(lineupsRaw),
    statistics: fmtStats(statsRaw),
    players:    fmtPlayers(playersRaw)
  };
}

// ── main handler ──────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (!API_KEY) return res.status(500).json({ error: 'API_FOOTBALL_KEY env var not set' });

  const { id, live, date, results } = req.query;

  try {

    // ── GET /api/scores?id=FIXTURE_ID — full match detail
    if (id) {
      res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=30');
      const detail = await getDetail(id);
      if (!detail) return res.status(404).json({ error: 'Match not found' });
      return res.status(200).json(detail);
    }

    // ── GET /api/scores?live=true — live fixtures only
    if (live === 'true') {
      res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=30');
      if (!isTournamentLive()) return res.status(200).json({ matches: [], phase: 'pre-tournament' });
      const matches = await getLive();
      return res.status(200).json({ matches, phase: 'live' });
    }

    // ── GET /api/scores?results=wc — ALL finished fixtures (for wc-results.js)
    // Cache reduced to 60s — scores must appear promptly after FT
    if (results === 'wc') {
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
      const matches = await getAllResults();
      return res.status(200).json({ matches, fetchedAt: new Date().toISOString() });
    }

    // ── GET /api/scores or /api/scores?date=YYYY-MM-DD — fixtures for a date
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
    const targetDate = date || todayUTC();
    const matches = await getByDate(targetDate);
    return res.status(200).json({
      matches,
      date: targetDate,
      phase: isTournamentLive() ? 'tournament' : 'pre-tournament'
    });

  } catch (err) {
    console.error('[scores proxy]', err.message);
    return res.status(500).json({ error: 'Failed to fetch match data', detail: err.message });
  }
}