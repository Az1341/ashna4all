export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  var key = process.env.FOOTBALL_DATA_KEY;
  if(!key) return res.status(200).json({error:'no_key'});

  var date = req.query.date || new Date().toISOString().slice(0,10);
  var matchId = req.query.id || null;
  var url = matchId
    ? 'https://api.football-data.org/v4/matches/'+matchId
    : 'https://api.football-data.org/v4/matches?dateFrom='+date+'&dateTo='+date;

  try {
    var r = await fetch(url, {headers:{'X-Auth-Token':key}});
    var text = await r.text();
    /* Temporary: return raw response so we can see exact error */
    return res.status(200).json({
      http_status: r.status,
      raw: text.slice(0,500)
    });
  } catch(e) {
    return res.status(200).json({error:'fetch_failed', message: e.message});
  }
}
