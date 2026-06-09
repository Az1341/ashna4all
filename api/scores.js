export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  var date = req.query.date || new Date().toISOString().slice(0,10);
  var matchId = req.query.id || null;

  var key = process.env.FOOTBALL_DATA_KEY;

  if(!key){
    return res.status(500).json({error:'No API key configured', env: Object.keys(process.env).filter(k=>k.includes('FOOT')||k.includes('KEY')||k.includes('API'))});
  }

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
