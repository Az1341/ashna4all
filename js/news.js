// api/news.js — GoalCurrent.live
// Fetches BBC Sport + ESPN RSS feeds server-side
// Returns clean JSON — never exposes raw RSS to browser
// Falls back gracefully if either source fails

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');

  const WC_KEYWORDS = [
    'world cup','mundial','wc2026','wc 2026','fifa 2026',
    'squad','injury','lineup','line-up','preview','group stage',
    'knockout','penalty','golden boot','hat-trick','transfer',
    'england','france','brazil','argentina','germany','spain',
    'portugal','mexico','usa','canada','morocco','nigeria',
    'messi','ronaldo','mbappe','vinicius','bellingham','kane',
    'saka','salah','neymar','lewandowski','de bruyne'
  ];

  function isRelevant(text) {
    const low = (text || '').toLowerCase();
    return WC_KEYWORDS.some(k => low.includes(k));
  }

  function tagFromText(text) {
    const low = (text || '').toLowerCase();
    if (low.includes('injur') || low.includes('fitness') || low.includes('doubt') || low.includes('ruled out')) return 'INJURY';
    if (low.includes('squad') || low.includes('named') || low.includes('call-up') || low.includes('callup')) return 'SQUAD';
    if (low.includes('preview') || low.includes('prediction') || low.includes('preview')) return 'PREVIEW';
    if (low.includes('result') || low.includes('win') || low.includes('beat') || low.includes('score') || low.includes('goal')) return 'RESULT';
    if (low.includes('breaking') || low.includes('confirm') || low.includes('official')) return 'BREAKING';
    if (low.includes('transfer') || low.includes('sign') || low.includes('deal')) return 'TRANSFER';
    return 'NEWS';
  }

  function parseRSS(xml) {
    const items = [];
    const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
    itemMatches.forEach(item => {
      const title   = (item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/) || [])[1] || '';
      const link    = (item.match(/<link>(.*?)<\/link>/) || item.match(/<guid>(.*?)<\/guid>/) || [])[1] || '';
      const desc    = (item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || item.match(/<description>(.*?)<\/description>/) || [])[1] || '';
      const pubDate = (item.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1] || '';
      const imgMatch = item.match(/<media:thumbnail[^>]+url="([^"]+)"/) ||
                       item.match(/<media:content[^>]+url="([^"]+)"/) ||
                       item.match(/<enclosure[^>]+url="([^"]+)"/);
      const img = imgMatch ? imgMatch[1] : '';

      const cleanTitle = title.replace(/<[^>]+>/g, '').trim();
      const cleanDesc  = desc.replace(/<[^>]+>/g, '').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").trim();
      const cleanLink  = link.replace(/<[^>]+>/g, '').trim();

      if (cleanTitle && cleanLink && (isRelevant(cleanTitle) || isRelevant(cleanDesc))) {
        items.push({
          title:   cleanTitle,
          link:    cleanLink,
          excerpt: cleanDesc.slice(0, 180) + (cleanDesc.length > 180 ? '…' : ''),
          date:    pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
          image:   img,
          tag:     tagFromText(cleanTitle + ' ' + cleanDesc)
        });
      }
    });
    return items;
  }

  async function fetchFeed(url) {
    try {
      const r = await fetch(url, {
        headers: { 'User-Agent': 'GoalCurrent/1.0 RSS Reader' },
        signal: AbortSignal.timeout(5000)
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.text();
    } catch (e) {
      console.warn(`Feed fetch failed: ${url}`, e.message);
      return null;
    }
  }

  try {
    const [bbcXml, espnXml] = await Promise.allSettled([
      fetchFeed('https://feeds.bbci.co.uk/sport/football/rss.xml'),
      fetchFeed('https://www.espn.com/espn/rss/soccer/news')
    ]);

    let articles = [];
    const sources = [];

    if (bbcXml.status === 'fulfilled' && bbcXml.value) {
      const bbcItems = parseRSS(bbcXml.value).map(a => ({ ...a, source: 'BBC Sport' }));
      articles = articles.concat(bbcItems);
      sources.push('BBC Sport');
    }

    if (espnXml.status === 'fulfilled' && espnXml.value) {
      const espnItems = parseRSS(espnXml.value).map(a => ({ ...a, source: 'ESPN' }));
      articles = articles.concat(espnItems);
      sources.push('ESPN');
    }

    // Deduplicate by title similarity
    const seen = new Set();
    articles = articles.filter(a => {
      const key = a.title.toLowerCase().slice(0, 40);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Sort newest first
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Cap at 20
    articles = articles.slice(0, 20);

    return res.status(200).json({
      articles,
      sources,
      count: articles.length,
      fetched: new Date().toISOString()
    });

  } catch (err) {
    console.error('News proxy error:', err.message);
    return res.status(500).json({ articles: [], sources: [], error: 'Failed to fetch news' });
  }
}
