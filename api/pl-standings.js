// api/pl-standings.js
// GoalCurrent.live — Premier League Standings Proxy
// COMPLETELY SEPARATE from api/scores.js (World Cup 2026)
// Competition: PL | Season: 2026 (2026/27) | football-data.org v4
// Do NOT import or reference any WC26 or UCL variables here.

const PL_COMPETITION_CODE = 'PL';
const PL_SEASON           = 2026;          // football-data uses start-year
const API_BASE            = 'https://api.football-data.org/v4';

export default async function handler(req, res) {
  // CORS — allow only GoalCurrent.live in production
  res.setHeader('Access-Control-Allow-Origin', 'https://www.goalcurrent.live');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const key = process.env.FOOTBALL_DATA_KEY;

  // --- Error: missing API key ---
  if (!key) {
    return res.status(500).json({
      error: 'CONFIG_ERROR',
      message: 'FOOTBALL_DATA_KEY environment variable is not set in Vercel.',
      competition: PL_COMPETITION_CODE,
      season: PL_SEASON,
    });
  }

  const { type = 'standings' } = req.query;
  // type: standings | teams | top_scorers

  let endpoint;
  if (type === 'standings') {
    endpoint = `${API_BASE}/competitions/${PL_COMPETITION_CODE}/standings?season=${PL_SEASON}`;
  } else if (type === 'teams') {
    endpoint = `${API_BASE}/competitions/${PL_COMPETITION_CODE}/teams?season=${PL_SEASON}`;
  } else if (type === 'top_scorers') {
    endpoint = `${API_BASE}/competitions/${PL_COMPETITION_CODE}/scorers?season=${PL_SEASON}`;
  } else {
    return res.status(400).json({
      error: 'INVALID_TYPE',
      message: `Unknown type "${type}". Use: standings | teams | top_scorers`,
    });
  }

  try {
    const upstream = await fetch(endpoint, {
      headers: {
        'X-Auth-Token': key,
        'Accept': 'application/json',
      },
    });

    // --- Error: API rate limit ---
    if (upstream.status === 429) {
      return res.status(429).json({
        error: 'RATE_LIMIT',
        message: 'football-data.org rate limit reached. Free tier: 10 req/min. Please wait and retry.',
        competition: PL_COMPETITION_CODE,
        season: PL_SEASON,
        retryAfter: upstream.headers.get('X-RequestCounter-Reset') || '60',
      });
    }

    // --- Error: season not available yet ---
    if (upstream.status === 404) {
      return res.status(404).json({
        error: 'SEASON_NOT_AVAILABLE',
        message: `The 2026/27 Premier League season data is not yet available from football-data.org. Season starts 22 August 2026. Fixtures release 19 June 2026.`,
        competition: PL_COMPETITION_CODE,
        season: PL_SEASON,
        seasonStartDate: '2026-08-22',
        fixturesReleaseDate: '2026-06-19',
      });
    }

    // --- Error: league not found / auth failure ---
    if (upstream.status === 403) {
      return res.status(403).json({
        error: 'AUTH_ERROR',
        message: 'API key rejected or plan does not cover this competition.',
        competition: PL_COMPETITION_CODE,
        season: PL_SEASON,
      });
    }

    if (!upstream.ok) {
      const text = await upstream.text();
      return res.status(upstream.status).json({
        error: 'UPSTREAM_ERROR',
        message: `football-data.org returned HTTP ${upstream.status}`,
        detail: text.substring(0, 300),
        competition: PL_COMPETITION_CODE,
        season: PL_SEASON,
      });
    }

    const data = await upstream.json();

    // --- Validate: no standings returned ---
    if (type === 'standings') {
      const tables = data?.standings;
      if (!tables || tables.length === 0) {
        return res.status(200).json({
          error: 'NO_STANDINGS',
          message: 'The API returned an empty standings table. The 2026/27 season may not have started yet.',
          competition: PL_COMPETITION_CODE,
          season: PL_SEASON,
          raw: data,
        });
      }
    }

    // --- Success: cache for 5 min during season, 1 hr pre-season ---
    const seasonStarted = new Date() >= new Date('2026-08-22T11:00:00Z');
    const maxAge = seasonStarted ? 300 : 3600;
    res.setHeader('Cache-Control', `public, s-maxage=${maxAge}, stale-while-revalidate=60`);
    res.setHeader('X-PL-Season', `${PL_SEASON}/${PL_SEASON + 1}`);
    res.setHeader('X-Competition', PL_COMPETITION_CODE);

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: 'FETCH_ERROR',
      message: `Failed to reach football-data.org: ${err.message}`,
      competition: PL_COMPETITION_CODE,
      season: PL_SEASON,
    });
  }
}
