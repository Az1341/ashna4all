# AGENTS.md

## Cursor Cloud specific instructions

### What this is
`goalcurrent.live` — a static, build-less football website (FIFA World Cup 2026, Premier League, UEFA Champions League). Plain HTML/CSS/vanilla JS plus Vercel serverless functions in `api/`. There is **no package manager, lockfile, build step, or lint/test tooling** in the repo.

### Running the site (development)
Serve the repo root as static files and open the printed URL:

```
python3 -m http.server 3000   # then visit http://localhost:3000
```

`python3` is preinstalled; this needs no dependency install. `vercel.json` only defines `/match` rewrites, and the plain static server serves `/match/` via its directory `index.html`, so the rewrite is not required for local dev.

### Data sources (important, non-obvious)
- **World Cup 2026 content renders fully offline.** All fixtures/groups/standings/teams data is embedded in `js/worldcup-data.js` (`window.WC26`) — no API key or network needed. Good target for smoke tests (e.g. `/worldcup2026/fixtures/`, `/worldcup2026/teams/`, favourites persist to `localStorage`).
- **Client fallback chain** in `js/api.js` (`GC_API`) fetches directly from the browser: ESPN → TheSportsDB → API-Football. ESPN needs no key (used by e.g. `premier-league/table/`).

### Serverless `/api/*` functions
`api/*.js` are Vercel Node functions and are **NOT** executed by the plain static server. The home page widgets that call `/api/scores` and `/api/videos` will not populate under `python3 -m http.server` (bundled World Cup data still renders fine). To run the functions locally use `vercel dev` (requires the Vercel CLI + a logged-in account) plus secrets:
- `API_FOOTBALL_KEY` — required by `api/scores.js`, `api/test-live.js` (return HTTP 500 if missing).
- `FOOTBALL_DATA_KEY` — required by `api/pl-standings.js`.
- `YOUTUBE_API_KEY` — optional, used by `api/videos.js`.

`api/news.js` needs no key (fetches BBC/ESPN RSS) but still requires a Node runtime (`vercel dev`).
