// api/pl-standings.js
// GoalCurrent.live — Premier League Standings Proxy
// COMPLETELY SEPARATE from api/scores.js (World Cup 2026)
// API: api-football.com (api-sports.io) v3
// Premier League ID: 39 | Season: 2026 (2026/27)
// Key header: x-rapidapi-key (same FOOTBALL_DATA_KEY env var)
// Do NOT reference any WC26 or UCL variables here.

const PL_LEAGUE_ID = 39;
const PL_SEASON    = 2026;
const API_BASE     = 'https://v3.football.api-sports.io';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const key = process.env.FOOTBALL_DATA_KEY;

  if (!key) {
    return res.status(500).json({
      error: 'CONFIG_ERROR',
      message: 'FOOTBALL_DATA_KEY environment variable is not set in Vercel.',
    });
  }

  const { type = 'standings' } = req.query;

  let endpoint;
  if (type === 'standings') {
    endpoint = `${API_BASE}/standings?league=${PL_LEAGUE_ID}&season=${PL_SEASON}`;
  } else if (type === 'teams') {
    endpoint = `${API_BASE}/teams?league=${PL_LEAGUE_ID}&season=${PL_SEASON}`;
  } else if (type === 'top_scorers') {
    endpoint = `${API_BASE}/players/topscorers?league=${PL_LEAGUE_ID}&season=${PL_SEASON}`;
  } else {
    return res.status(400).json({
      error: 'INVALID_TYPE',
      message: `Unknown type "${type}". Use: standings | teams | top_scorers`,
    });
  }

  try {
    const upstream = await fetch(endpoint, {
      headers: {
        'x-rapidapi-key': key,
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'Accept': 'application/json',
      },
    });

    if (upstream.status === 429) {
      return res.status(429).json({
        error: 'RATE_LIMIT',
        message: 'api-football.com rate limit reached. Please wait and retry.',
        retryAfter: upstream.headers.get('X-RateLimit-Reset') || '60',
      });
    }

    if (upstream.status === 401 || upstream.status === 403) {
      return res.status(403).json({
        error: 'AUTH_ERROR',
        message: 'API key rejected. Please check FOOTBALL_DATA_KEY in Vercel.',
      });
    }

    if (!upstream.ok) {
      const text = await upstream.text();
      return res.status(upstream.status).json({
        error: 'UPSTREAM_ERROR',
        message: `api-football.com returned HTTP ${upstream.status}`,
        detail: text.substring(0, 300),
      });
    }

    const data = await upstream.json();

    // api-football returns errors inside the response body
    if (data.errors && Object.keys(data.errors).length > 0) {
      const errMsg = JSON.stringify(data.errors);
      // Token error
      if (errMsg.includes('token') || errMsg.includes('key') || errMsg.includes('Token')) {
        return res.status(403).json({
          error: 'AUTH_ERROR',
          message: 'API key invalid: ' + errMsg,
        });
      }
      return res.status(400).json({
        error: 'API_ERROR',
        message: errMsg,
      });
    }

    // No standings yet (pre-season)
    if (type === 'standings') {
      const standings = data?.response?.[0]?.league?.standings;
      if (!standings || standings.length === 0 || data.results === 0) {
        return res.status(200).json({
          error: 'SEASON_NOT_AVAILABLE',
          message: 'The 2026/27 Premier League season standings are not yet available. Season starts 22 August 2026.',
          seasonStartDate: '2026-08-22',
          fixturesReleaseDate: '2026-06-19',
        });
      }
    }

    // Success — cache 5 min during season, 1 hr pre-season
    const seasonStarted = new Date() >= new Date('2026-08-22T11:00:00Z');
    const maxAge = seasonStarted ? 300 : 3600;
    res.setHeader('Cache-Control', `public, s-maxage=${maxAge}, stale-while-revalidate=60`);

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: 'FETCH_ERROR',
      message: `Failed to reach api-football.com: ${err.message}`,
    });
  }
}
