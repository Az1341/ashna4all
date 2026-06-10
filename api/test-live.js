// api/test-live.js — GoalCurrent.live
// TEST MODE ONLY — fetches today's international friendly matches
// Used by /live/?test=1 only. Never called by the public live page.
// Remove or disable this file after World Cup 2026 launch.

const API_KEY  = process.env.API_FOOTBALL_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

const reqHeaders = () => ({
  'x-apisports-key': API_KEY,
  'Accept': 'application/json',
});

function todayUTC() {
  return new Date().toISOString().split('T')[0];
}

async function apiFetch(path) {
  const res = await fetch(`${BASE_URL}${path}`, { headers: reqHeaders() });
  if (!res.ok) throw new Error(`api-sports ${res.status} — ${path}`);
  const json = await res.json();
  if (json.errors && Object.keys(json.errors).length)
    throw new Error(JSON.stringify(json.errors));
  return json.response || [];
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'no-store');

  // Safety check — reject if not explicitly test mode
  if (req.query.confirm !== 'testmode') {
    return res.status(403).json({
      error: 'TEST_ONLY',
      message: 'This endpoint is for test mode only. Add ?confirm=testmode to use it.',
    });
  }

  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const today = todayUTC();

  try {
    // Fetch today's live matches across all leagues
    const raw = await apiFetch(`/fixtures?date=${today}&timezone=Europe/London`);

    if (!raw || raw.length === 0) {
      return res.status(200).json({
        matches: [],
        date: today,
        mode: 'test',
        message: 'No matches found today from API-Football.',
      });
    }

    // Map to standard format — same shape as /api/scores response
    const matches = raw.map(f => ({
      id:        f.fixture.id,
      date:      f.fixture.date,
      timestamp: f.fixture.timestamp,
      venue:     f.fixture.venue?.name || '',
      city:      f.fixture.venue?.city || '',
      status: {
        long:    f.fixture.status.long,
        short:   f.fixture.status.short,
        elapsed: f.fixture.status.elapsed,
      },
      league: {
        id:      f.league.id,
        name:    f.league.name,
        country: f.league.country,
        logo:    f.league.logo,
        round:   f.league.round,
      },
      home: {
        id:   f.teams.home.id,
        name: f.teams.home.name,
        logo: f.teams.home.logo,
      },
      away: {
        id:   f.teams.away.id,
        name: f.teams.away.name,
        logo: f.teams.away.logo,
      },
      goals: {
        home: f.goals.home,
        away: f.goals.away,
      },
    }));

    return res.status(200).json({
      matches,
      date: today,
      mode: 'test',
      total: matches.length,
    });

  } catch (err) {
    console.error('[test-live proxy]', err.message);
    return res.status(500).json({
      error: 'Failed to fetch test match data',
      message: err.message,
    });
  }
}
