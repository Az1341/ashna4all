export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  var key = process.env.FOOTBALL_DATA_KEY;
  if(!key) return res.status(200).json({error:'unavailable'});
  var date = req.query.date || new Date().toISOString().slice(0,10);
  var matchId = req.query.id || null;
  var url = matchId
    ? 'https://api.football-data.org/v4/matches/'+matchId
    : 'https://api.football-data.org/v4/matches?dateFrom='+date+'&dateTo='+date;
  try {
    var r = await fetch(url, {headers:{'X-Auth-Token':key}});
    var data = await r.json();
    res.setHeader('Cache-Control','s-maxage=30,stale-while-revalidate');
    return res.status(200).json(data);
  } catch(e) {
    return res.status(200).json({error:'unavailable'});
  }
}