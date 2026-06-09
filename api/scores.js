export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');

  var key     = process.env.FOOTBALL_DATA_KEY;
  var date    = req.query.date || new Date().toISOString().slice(0,10);
  var matchId = req.query.id   || null;

  /* ── MATCH DETAIL (for cards + scorers) ── */
  if(matchId && key){
    try {
      var r = await fetch(
        'https://api.football-data.org/v4/matches/'+matchId,
        {headers:{'X-Auth-Token':key}}
      );
      return res.status(200).json(await r.json());
    } catch(e){
      return res.status(200).json({error:'unavailable'});
    }
  }

  /* ── WC MATCHES (11 June onwards) ── */
  if(key && date >= '2026-06-11'){
    try {
      var r2 = await fetch(
        'https://api.football-data.org/v4/competitions/WC/matches?dateFrom='+date+'&dateTo='+date,
        {headers:{'X-Auth-Token':key}}
      );
      var wc = await r2.json();
      if(wc.matches && wc.matches.length > 0){
        return res.status(200).json(wc);
      }
    } catch(e){}
  }

  /* ── PRE-TOURNAMENT FRIENDLIES (before 11 June) ──
     Use TheSportsDB — free, no key, covers international friendlies
     Runs server-side so no CORS issue                              */
  if(date < '2026-06-11'){
    try {
      var r3 = await fetch(
        'https://www.thesportsdb.com/api/v1/json/123/eventsday.php?d='+date+'&s=Soccer'
      );
      var tsdb = await r3.json();
      var events = (tsdb.events || []);

      /* Filter to WC nations only — no women's or irrelevant matches */
      var WC_NATIONS = [
        'mexico','south africa','korea republic','czechia','czech republic',
        'canada','bosnia','qatar','switzerland','brazil','morocco','haiti',
        'scotland','usa','united states','paraguay','australia','turkey','türkiye',
        'germany','ivory coast','cote d\'ivoire','ecuador','curacao','curaçao',
        'netherlands','japan','sweden','tunisia','belgium','egypt','iran',
        'new zealand','spain','cape verde','cabo verde','saudi arabia','uruguay',
        'france','senegal','iraq','norway','argentina','algeria','austria',
        'jordan','portugal','dr congo','congo dr','uzbekistan','colombia',
        'england','croatia','ghana','panama','iceland','nigeria','costa rica',
        'venezuela','india','chile','peru'
      ];

      var filtered = events.filter(function(ev){
        var h = (ev.strHomeTeam||'').toLowerCase();
        var a = (ev.strAwayTeam||'').toLowerCase();
        /* Skip women's matches */
        if(h.includes('women')||a.includes('women')||
           h.includes('ladies')||a.includes('ladies')||
           h.includes('w)')||a.includes('w)')) return false;
        /* Must involve at least one WC nation */
        var hWC = WC_NATIONS.some(function(n){return h.includes(n);});
        var aWC = WC_NATIONS.some(function(n){return a.includes(n);});
        return hWC || aWC;
      });

      /* Format to match football-data.org structure */
      var matches = filtered.map(function(ev){
        var hs = ev.intHomeScore;
        var as = ev.intAwayScore;
        var st = (ev.strStatus||'').toUpperCase();
        var status = 'TIMED';
        if(st === 'FT' || st === 'MATCH FINISHED' || st === 'AET') status = 'FINISHED';
        else if(st === 'HT' || st === 'HALF TIME') status = 'PAUSED';
        else if(st === 'NS' || st === '' || st === 'NOT STARTED') status = 'TIMED';
        else if(!isNaN(parseInt(st))) status = 'IN_PLAY';

        return {
          id:       ev.idEvent,
          status:   status,
          minute:   !isNaN(parseInt(st)) ? parseInt(st) : null,
          homeTeam: {name: ev.strHomeTeam || ''},
          awayTeam: {name: ev.strAwayTeam || ''},
          score: {
            fullTime: {
              home: (hs !== null && hs !== '') ? parseInt(hs) : null,
              away: (as !== null && as !== '') ? parseInt(as) : null
            },
            halfTime: {home: null, away: null}
          }
        };
      });

      return res.status(200).json({matches: matches, source: 'tsdb'});
    } catch(e){
      return res.status(200).json({error:'unavailable'});
    }
  }

  return res.status(200).json({matches:[], error:'unavailable'});
}
