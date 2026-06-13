/**
 * api/videos.js — GoalCurrent.live
 * ════════════════════════════════════════════════════════════════
 * Vercel serverless function — GET /api/videos
 *
 * Fetches the latest FIFA World Cup 2026 match-preview videos
 * from the official FIFA YouTube channel using YouTube Data API v3.
 *
 * SETUP (one-time):
 *   1. Go to console.cloud.google.com → APIs → YouTube Data API v3 → Enable
 *   2. Create an API key (restrict to your domain + YouTube Data API v3)
 *   3. Add env var YOUTUBE_API_KEY in Vercel dashboard → Settings → Environment Variables
 *
 * Response: JSON array of up to 4 video objects:
 *   { videoId, title, description, publishedAt, thumbnail }
 *
 * Caching: s-maxage=3600 (1 hour at Vercel CDN edge) — YouTube API quota safe.
 * ════════════════════════════════════════════════════════════════
 */

const YT_KEY        = process.env.YOUTUBE_API_KEY;
const YT_BASE       = 'https://www.googleapis.com/youtube/v3';

/* FIFA's official YouTube channel ID — verified */
const FIFA_CHANNEL  = 'UCpcTrCXblq78GZrTUTLWeBw';

/* Search terms — ordered by priority */
const SEARCH_QUERIES = [
  'FIFA World Cup 2026 match preview',
  'FIFA World Cup 2026 preview',
  'World Cup 2026 preview'
];

const MAX_RESULTS = 4;

async function ytFetch(path) {
  const url = `${YT_BASE}${path}`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`YouTube API ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

/**
 * Search FIFA channel for latest WC2026 match previews.
 * Returns array of { videoId, title, description, publishedAt, thumbnail }
 */
async function fetchLatestPreviews() {
  if (!YT_KEY) throw new Error('YOUTUBE_API_KEY env var not set');

  /* Search FIFA channel for WC2026 match previews, newest first */
  const query    = encodeURIComponent(SEARCH_QUERIES[0]);
  const channelQ = encodeURIComponent(FIFA_CHANNEL);

  const searchUrl =
    `/search?part=snippet&channelId=${channelQ}` +
    `&q=${query}` +
    `&type=video&order=date` +
    `&maxResults=${MAX_RESULTS * 2}` + /* fetch extra to filter */
    `&key=${YT_KEY}`;

  const searchData = await ytFetch(searchUrl);
  const items      = searchData.items || [];

  if (!items.length) {
    /* Fallback: search without channel restriction */
    const fallbackUrl =
      `/search?part=snippet` +
      `&q=${encodeURIComponent(SEARCH_QUERIES[1])}` +
      `&type=video&order=date` +
      `&maxResults=${MAX_RESULTS}` +
      `&key=${YT_KEY}`;
    const fallbackData = await ytFetch(fallbackUrl);
    return formatItems(fallbackData.items || []);
  }

  return formatItems(items).slice(0, MAX_RESULTS);
}

function formatItems(items) {
  return items
    .filter(function(item) {
      /* Only include videos — skip playlists/channels */
      return item.id && (item.id.videoId || typeof item.id === 'string');
    })
    .map(function(item) {
      const videoId   = item.id.videoId || item.id;
      const snippet   = item.snippet || {};
      const thumbs    = snippet.thumbnails || {};
      /* Prefer maxres → high → medium */
      const thumbnail =
        (thumbs.maxres  && thumbs.maxres.url)  ||
        (thumbs.high    && thumbs.high.url)    ||
        (thumbs.medium  && thumbs.medium.url)  ||
        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

      return {
        videoId,
        title:       snippet.title       || '',
        description: snippet.description || '',
        publishedAt: snippet.publishedAt || '',
        thumbnail,
        channelTitle: snippet.channelTitle || 'FIFA',
        url: `https://www.youtube.com/watch?v=${videoId}`
      };
    });
}

export default async function handler(req, res) {
  /* CORS — same as other api/ routes in this project */
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  /* Cache 1 hour at Vercel CDN — YouTube Data API v3 free quota is 10,000 units/day
     Each search costs 100 units. 1h cache = max 240 calls/day = 24,000 units.
     Set to 1h to stay within free quota even with high traffic. */
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=300');

  if (!YT_KEY) {
    return res.status(500).json({
      error: 'YOUTUBE_API_KEY not configured',
      setup: 'Add YOUTUBE_API_KEY to Vercel Environment Variables'
    });
  }

  try {
    const videos = await fetchLatestPreviews();
    return res.status(200).json({
      videos,
      fetchedAt: new Date().toISOString(),
      count: videos.length
    });
  } catch (err) {
    console.error('[api/videos]', err.message);
    return res.status(500).json({
      error: 'Failed to fetch videos',
      detail: err.message
    });
  }
}
