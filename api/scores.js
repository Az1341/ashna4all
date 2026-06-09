export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  /* Debug — show ALL env var keys so we can see exact name */
  var allKeys = Object.keys(process.env);
  var footballKeys = allKeys.filter(k => 
    k.toLowerCase().includes('foot') || 
    k.toLowerCase().includes('data') ||
    k.toLowerCase().includes('key') ||
    k.toLowerCase().includes('api') ||
    k.toLowerCase().includes('token')
  );

  var key = process.env.FOOTBALL_DATA_KEY;

  if(!key){
    return res.status(200).json({
      error: 'No API key configured',
      hint: 'Check env var name — showing all key-related vars:',
      footballRelated: footballKeys,
      totalEnvVars: allKeys.length
    });
  }

  var date = req.query.date || new Date().toISOString().slice(0,10);
  var matchId = req.query.id || null;
  var url = matchId
    ? 'https://api.football-data.org/v4/matches/'+matchId
    : 'https://api.football-data.org/v4/matches?dateFrom='+date+'&dateTo='+date;

  try {
    var r = await fetch(url, { headers: { 'X-Auth-Token': key } });
    var data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
    return res.status(200).json(data);
  } catch(e) {
    return res.status(500).json({error: e.message});
  }
}
