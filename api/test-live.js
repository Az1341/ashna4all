// api/test-live.js — GoalCurrent.live
// TEST MODE ONLY — fetches today's matches involving WC 2026 nations only
// Used by /live/?test=1 only. Never called by the public live page.
// Remove or disable after World Cup 2026 launch.

const API_KEY  = process.env.API_FOOTBALL_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

// All 48 FIFA World Cup 2026 qualified nations
const WC_NATIONS = new Set([
  'Bolivia', // Added for test mode — not a WC nation but playing Algeria tonight
  'Mexico','South Africa','South Korea','Czech Republic','Canada',
  'Bosnia and Herzegovina','USA','United States','Paraguay','Qatar',
  'Switzerland','Brazil','Morocco','Haiti','Scotland','Germany',
  "Côte d'Ivoire","Ivory Coast",'Ecuador','Netherlands','Japan',
  'Sweden','Tunisia','Belgium','Egypt','Iran','IR Iran','New Zealand',
  'Spain','Cape Verde','Saudi Arabia','Uruguay','France','Senegal',
  'Iraq','Norway','Argentina','Algeria','Austria','Jordan','Portugal',
  'DR Congo','Uzbekistan','Colombia','England','Croatia','Ghana','Panama',
  'South Korea','Korea Republic','Czechia','Curaçao','Türkiye','Turkey',
  'Bosnia & Herzegovina','Bosnia & Herz.'
]);

function isWCNation(name) {
  if (!name) return false;
  if (WC_NATIONS.has(name)) return true;
  // Partial match for alternate spellings
  const lower = name.toLowerCase();
  for (const n of WC_NATIONS) {
    if (n.toLowerCase() === lower) return true;
  }
  return false;
}

function todayUTC() {
  return new Date().toISOString().split('T')[0];
}

async function apiFetch(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'x-apisports-key': API_KEY, 'Accept': 'application/json' }
  });
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
    const raw = await apiFetch(`/fixtures?date=${today}&timezone=Europe/London`);

    if (!raw || raw.length === 0) {
      return res.status(200).json({
        matches: [], date: today, mode: 'test', total: 0,
        message: 'No matches today from API-Football.',
      });
    }

    // Filter: both teams must be WC 2026 nations
    const filtered = raw.filter(f => {
      const home = f.teams?.home?.name || '';
      const away = f.teams?.away?.name || '';
      return isWCNation(home) && isWCNation(away);
    });

    const matches = filtered.map(f => ({
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
        round:   f.league.round,
      },
      home: { id: f.teams.home.id, name: f.teams.home.name, logo: f.teams.home.logo },
      away: { id: f.teams.away.id, name: f.teams.away.name, logo: f.teams.away.logo },
      goals: { home: f.goals.home, away: f.goals.away },
    }));

    return res.status(200).json({
      matches,
      date: today,
      mode: 'test',
      total: matches.length,
      filtered_from: raw.length,
      message: `Showing ${matches.length} WC nation matches from ${raw.length} total today.`,
    });

  } catch (err) {
    console.error('[test-live proxy]', err.message);
    return res.status(500).json({
      error: 'Failed to fetch test match data',
      message: err.message,
    });
  }
}
