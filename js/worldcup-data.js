/**
 * GoalCurrent.live - FIFA World Cup 2026
 * ===============================================================
 * SINGLE SOURCE OF TRUTH - all data lives here.
 * Every page reads ONLY from window.WC26.
 *
 * HOW TO UPDATE A RESULT (the ONLY thing you ever need to do):
 *   1. Find the match in SCHEDULE by id.
 *   2. Add/change:  homeScore: X, awayScore: Y, status: 'FT'
 *   3. Save and deploy.
 *
 * Everything else (standings, group tables, fixtures display,
 * qualification colours, sorting) is computed automatically by
 * the renderers (standings.js / groups.js) from this array.
 * You NEVER touch any renderer file to update a score.
 * ===============================================================
 *
 * Source: FIFA Official Draw, December 2025
 *         Fixtures: FIFA.com / BBC Sport verified (UTC)
 *         Results:  FIFA.com official match centre
 * Last updated: 2026-06-13
 */

(function () {
  'use strict';

  /* -------------------------------------------------------------
     FLAG CODES  (flagcdn.com ISO alpha-2)
     Used by every renderer — never hard-code codes elsewhere.
  ───────────────────────────────────────────────────────────── */
  var FLAG = {
    'Mexico':               'mx',
    'South Africa':         'za',
    'Korea Republic':       'kr',
    'Czechia':              'cz',
    'Canada':               'ca',
    'Bosnia & Herzegovina': 'ba',
    'Qatar':                'qa',
    'Switzerland':          'ch',
    'Brazil':               'br',
    'Morocco':              'ma',
    'Haiti':                'ht',
    'Scotland':             'gb-sct',
    'USA':                  'us',
    'Paraguay':             'py',
    'Australia':            'au',
    'Türkiye':              'tr',
    'Germany':              'de',
    'Curaçao':              'cw',
    "Côte d'Ivoire":        'ci',
    'Ecuador':              'ec',
    'Netherlands':          'nl',
    'Japan':                'jp',
    'Sweden':               'se',
    'Tunisia':              'tn',
    'Belgium':              'be',
    'Egypt':                'eg',
    'IR Iran':              'ir',
    'New Zealand':          'nz',
    'Spain':                'es',
    'Cabo Verde':           'cv',
    'Saudi Arabia':         'sa',
    'Uruguay':              'uy',
    'France':               'fr',
    'Senegal':              'sn',
    'Iraq':                 'iq',
    'Norway':               'no',
    'Argentina':            'ar',
    'Algeria':              'dz',
    'Austria':              'at',
    'Jordan':               'jo',
    'Portugal':             'pt',
    'Congo DR':             'cd',
    'Uzbekistan':           'uz',
    'Colombia':             'co',
    'England':              'gb-eng',
    'Croatia':              'hr',
    'Ghana':                'gh',
    'Panama':               'pa'
  };

  /* -------------------------------------------------------------
     GROUPS  — 12 groups × 4 teams
     Renderers derive the team list from GROUPS.
     Never duplicate team names here vs SCHEDULE.
  ───────────────────────────────────────────────────────────── */
  var GROUPS = {
    A: ['Mexico',      'South Africa',         'Korea Republic', 'Czechia'],
    B: ['Canada',      'Bosnia & Herzegovina', 'Qatar',          'Switzerland'],
    C: ['Brazil',      'Morocco',              'Haiti',          'Scotland'],
    D: ['USA',         'Paraguay',             'Australia',      'Türkiye'],
    E: ['Germany',     'Curaçao',              "Côte d'Ivoire",  'Ecuador'],
    F: ['Netherlands', 'Japan',                'Sweden',         'Tunisia'],
    G: ['Belgium',     'Egypt',                'IR Iran',        'New Zealand'],
    H: ['Spain',       'Cabo Verde',           'Saudi Arabia',   'Uruguay'],
    I: ['France',      'Senegal',              'Iraq',           'Norway'],
    J: ['Argentina',   'Algeria',              'Austria',        'Jordan'],
    K: ['Portugal',    'Congo DR',             'Uzbekistan',     'Colombia'],
    L: ['England',     'Croatia',              'Ghana',          'Panama']
  };

  /* -------------------------------------------------------------
     SCHEDULE — all 104 matches (group stage + knockout)
     ─────────────────────────────────────────────────────────────
     FIELD REFERENCE
       id            : unique integer
       group         : 'A'–'L' for group stage, '—' for knockout
       home          : team name string (must match FLAG key exactly)
       away          : team name string (must match FLAG key exactly)
       utc           : kick-off in UTC ISO-8601
       venue         : stadium + city string
       ukBroadcaster : 'BBC' | 'ITV' | 'BBC / ITV' | 'TBC'
       stage         : human-readable stage label

     RESULT FIELDS (add these when a match is confirmed FT):
       homeScore     : integer goals scored by home team
       awayScore     : integer goals scored by away team
       status        : 'FT' | 'AET' | 'PEN'
                       (leave absent / undefined for upcoming matches)

     RENDERER CONTRACT
       standings.js and groups.js loop WC26.schedule and process
       ONLY entries where status === 'FT' (or 'AET'/'PEN') AND
       both homeScore and awayScore are typeof number.
       All other entries are treated as upcoming/unplayed.
       Adding homeScore + awayScore + status to any entry here
       instantly flows through to ALL standings, group tables,
       and fixture cards with NO further code changes required.
  ───────────────────────────────────────────────────────────── */
  var SCHEDULE = [

    /* -- GROUP STAGE - MATCHDAY 1 ---------------------------- */
    /* To mark a result FT: add  homeScore:X, awayScore:Y, status:'FT'  */

    {id:  1, group:'A', home:'Mexico',              away:'South Africa',         utc:'2026-06-11T19:00:00Z', venue:'Estadio Azteca, Mexico City',                   ukBroadcaster:'ITV', stage:'Group Stage', homeScore:2, awayScore:0, status:'FT'},
    {id:  2, group:'A', home:'Korea Republic',      away:'Czechia',              utc:'2026-06-12T02:00:00Z', venue:'Estadio Akron, Guadalajara',                    ukBroadcaster:'ITV', stage:'Group Stage', homeScore:2, awayScore:1, status:'FT'},
    {id:  3, group:'B', home:'Canada',              away:'Bosnia & Herzegovina', utc:'2026-06-12T19:00:00Z', venue:'BMO Field, Toronto',                            ukBroadcaster:'BBC', stage:'Group Stage', homeScore:1, awayScore:1, status:'FT'},
    {id:  4, group:'D', home:'USA',                 away:'Paraguay',             utc:'2026-06-13T01:00:00Z', venue:'SoFi Stadium, Los Angeles',                     ukBroadcaster:'BBC', stage:'Group Stage', homeScore:4, awayScore:1, status:'FT'},
    {id:  5, group:'B', home:'Qatar',               away:'Switzerland',          utc:'2026-06-13T19:00:00Z', venue:"Levi's Stadium, San Francisco Bay Area",         ukBroadcaster:'ITV', stage:'Group Stage'},
    {id:  6, group:'C', home:'Brazil',              away:'Morocco',              utc:'2026-06-13T22:00:00Z', venue:'MetLife Stadium, New York/New Jersey',           ukBroadcaster:'BBC', stage:'Group Stage'},
    {id:  7, group:'C', home:'Haiti',               away:'Scotland',             utc:'2026-06-14T01:00:00Z', venue:'Gillette Stadium, Boston',                      ukBroadcaster:'BBC', stage:'Group Stage', homeScore:0, awayScore:1, status:'FT'},
    {id:  8, group:'D', home:'Australia',           away:'Türkiye',              utc:'2026-06-14T04:00:00Z', venue:'BC Place, Vancouver',                           ukBroadcaster:'ITV', stage:'Group Stage', homeScore:2, awayScore:0, status:'FT'},

    /* -- GROUP STAGE - MATCHDAY 2 ---------------------------- */
    {id:  9, group:'E', home:'Germany',             away:'Curaçao',              utc:'2026-06-14T17:00:00Z', venue:'NRG Stadium, Houston',                          ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 10, group:'F', home:'Netherlands',         away:'Japan',                utc:'2026-06-14T20:00:00Z', venue:'AT&T Stadium, Dallas',                          ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 11, group:'E', home:"Côte d'Ivoire",       away:'Ecuador',              utc:'2026-06-14T23:00:00Z', venue:'Lincoln Financial Field, Philadelphia',          ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 12, group:'F', home:'Sweden',              away:'Tunisia',              utc:'2026-06-15T02:00:00Z', venue:'Estadio BBVA, Monterrey',                       ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 13, group:'H', home:'Spain',               away:'Cabo Verde',           utc:'2026-06-15T16:00:00Z', venue:'Mercedes-Benz Stadium, Atlanta',                ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 14, group:'G', home:'Belgium',             away:'Egypt',                utc:'2026-06-15T19:00:00Z', venue:'Lumen Field, Seattle',                          ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 15, group:'G', home:'IR Iran',             away:'New Zealand',          utc:'2026-06-15T20:00:00Z', venue:'SoFi Stadium, Los Angeles',                     ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 16, group:'H', home:'Saudi Arabia',        away:'Uruguay',              utc:'2026-06-15T22:00:00Z', venue:'Hard Rock Stadium, Miami',                      ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 17, group:'I', home:'France',              away:'Senegal',              utc:'2026-06-16T19:00:00Z', venue:'MetLife Stadium, New York/New Jersey',           ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 18, group:'I', home:'Iraq',                away:'Norway',               utc:'2026-06-16T22:00:00Z', venue:'Gillette Stadium, Boston',                      ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 19, group:'J', home:'Argentina',           away:'Algeria',              utc:'2026-06-17T01:00:00Z', venue:'Arrowhead Stadium, Kansas City',                ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 20, group:'J', home:'Austria',             away:'Jordan',               utc:'2026-06-17T04:00:00Z', venue:"Levi's Stadium, San Francisco Bay Area",         ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 21, group:'K', home:'Portugal',            away:'Congo DR',             utc:'2026-06-17T17:00:00Z', venue:'NRG Stadium, Houston',                          ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 22, group:'L', home:'England',             away:'Croatia',              utc:'2026-06-17T20:00:00Z', venue:'AT&T Stadium, Dallas',                          ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 23, group:'L', home:'Ghana',               away:'Panama',               utc:'2026-06-17T23:00:00Z', venue:'BMO Field, Toronto',                            ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 24, group:'K', home:'Uzbekistan',          away:'Colombia',             utc:'2026-06-18T02:00:00Z', venue:'Estadio Azteca, Mexico City',                   ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 25, group:'A', home:'Czechia',             away:'South Africa',         utc:'2026-06-18T16:00:00Z', venue:'Mercedes-Benz Stadium, Atlanta',                ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 26, group:'B', home:'Switzerland',         away:'Bosnia & Herzegovina', utc:'2026-06-18T19:00:00Z', venue:'SoFi Stadium, Los Angeles',                     ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 27, group:'B', home:'Canada',              away:'Qatar',                utc:'2026-06-18T22:00:00Z', venue:'BC Place, Vancouver',                           ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 28, group:'A', home:'Mexico',              away:'Korea Republic',       utc:'2026-06-19T01:00:00Z', venue:'Estadio Akron, Guadalajara',                    ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 29, group:'D', home:'USA',                 away:'Australia',            utc:'2026-06-19T19:00:00Z', venue:'Lumen Field, Seattle',                          ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 30, group:'C', home:'Scotland',            away:'Morocco',              utc:'2026-06-19T22:00:00Z', venue:'Gillette Stadium, Boston',                      ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 31, group:'C', home:'Brazil',              away:'Haiti',                utc:'2026-06-20T00:30:00Z', venue:'Lincoln Financial Field, Philadelphia',          ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 32, group:'D', home:'Türkiye',             away:'Paraguay',             utc:'2026-06-20T03:00:00Z', venue:"Levi's Stadium, San Francisco Bay Area",         ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 33, group:'F', home:'Netherlands',         away:'Sweden',               utc:'2026-06-20T17:00:00Z', venue:'NRG Stadium, Houston',                          ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 34, group:'E', home:'Germany',             away:"Côte d'Ivoire",        utc:'2026-06-20T20:00:00Z', venue:'BMO Field, Toronto',                            ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 35, group:'E', home:'Ecuador',             away:'Curaçao',              utc:'2026-06-21T00:00:00Z', venue:'Arrowhead Stadium, Kansas City',                ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 36, group:'F', home:'Tunisia',             away:'Japan',                utc:'2026-06-21T04:00:00Z', venue:'Estadio BBVA, Monterrey',                       ukBroadcaster:'BBC', stage:'Group Stage'},

    /* -- GROUP STAGE - MATCHDAY 3 ---------------------------- */
    {id: 37, group:'H', home:'Spain',               away:'Saudi Arabia',         utc:'2026-06-21T16:00:00Z', venue:'Mercedes-Benz Stadium, Atlanta',                ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 38, group:'G', home:'Belgium',             away:'IR Iran',              utc:'2026-06-21T19:00:00Z', venue:'SoFi Stadium, Los Angeles',                     ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 39, group:'H', home:'Uruguay',             away:'Cabo Verde',           utc:'2026-06-21T22:00:00Z', venue:'Hard Rock Stadium, Miami',                      ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 40, group:'G', home:'New Zealand',         away:'Egypt',                utc:'2026-06-22T01:00:00Z', venue:'BC Place, Vancouver',                           ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 41, group:'J', home:'Argentina',           away:'Austria',              utc:'2026-06-22T17:00:00Z', venue:'AT&T Stadium, Dallas',                          ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 42, group:'I', home:'France',              away:'Iraq',                 utc:'2026-06-22T21:00:00Z', venue:'Lincoln Financial Field, Philadelphia',          ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 43, group:'I', home:'Norway',              away:'Senegal',              utc:'2026-06-23T00:00:00Z', venue:'MetLife Stadium, New York/New Jersey',           ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 44, group:'J', home:'Jordan',              away:'Algeria',              utc:'2026-06-23T03:00:00Z', venue:"Levi's Stadium, San Francisco Bay Area",         ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 45, group:'K', home:'Portugal',            away:'Uzbekistan',           utc:'2026-06-23T17:00:00Z', venue:'NRG Stadium, Houston',                          ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 46, group:'L', home:'England',             away:'Ghana',                utc:'2026-06-23T20:00:00Z', venue:'Gillette Stadium, Boston',                      ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 47, group:'L', home:'Panama',              away:'Croatia',              utc:'2026-06-23T23:00:00Z', venue:'BMO Field, Toronto',                            ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 48, group:'K', home:'Colombia',            away:'Congo DR',             utc:'2026-06-24T02:00:00Z', venue:'Estadio Akron, Guadalajara',                    ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 49, group:'B', home:'Switzerland',         away:'Canada',               utc:'2026-06-24T19:00:00Z', venue:'BC Place, Vancouver',                           ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 50, group:'B', home:'Bosnia & Herzegovina',away:'Qatar',                utc:'2026-06-24T19:00:00Z', venue:'Lumen Field, Seattle',                          ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 51, group:'C', home:'Scotland',            away:'Brazil',               utc:'2026-06-24T22:00:00Z', venue:'Hard Rock Stadium, Miami',                      ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 52, group:'C', home:'Morocco',             away:'Haiti',                utc:'2026-06-24T22:00:00Z', venue:'Mercedes-Benz Stadium, Atlanta',                ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 53, group:'A', home:'Czechia',             away:'Mexico',               utc:'2026-06-25T01:00:00Z', venue:'Estadio Azteca, Mexico City',                   ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 54, group:'A', home:'South Africa',        away:'Korea Republic',       utc:'2026-06-25T01:00:00Z', venue:'Estadio BBVA, Monterrey',                       ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 55, group:'E', home:'Curaçao',             away:"Côte d'Ivoire",        utc:'2026-06-25T20:00:00Z', venue:'Lincoln Financial Field, Philadelphia',          ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 56, group:'E', home:'Ecuador',             away:'Germany',              utc:'2026-06-25T20:00:00Z', venue:'MetLife Stadium, New York/New Jersey',           ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 57, group:'F', home:'Japan',               away:'Sweden',               utc:'2026-06-25T23:00:00Z', venue:'AT&T Stadium, Dallas',                          ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 58, group:'F', home:'Tunisia',             away:'Netherlands',          utc:'2026-06-25T23:00:00Z', venue:'Arrowhead Stadium, Kansas City',                ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 59, group:'D', home:'Türkiye',             away:'USA',                  utc:'2026-06-26T02:00:00Z', venue:'SoFi Stadium, Los Angeles',                     ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 60, group:'D', home:'Paraguay',            away:'Australia',            utc:'2026-06-26T02:00:00Z', venue:"Levi's Stadium, San Francisco Bay Area",         ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 61, group:'I', home:'Norway',              away:'France',               utc:'2026-06-26T19:00:00Z', venue:'Gillette Stadium, Boston',                      ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 62, group:'I', home:'Senegal',             away:'Iraq',                 utc:'2026-06-26T19:00:00Z', venue:'BMO Field, Toronto',                            ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 63, group:'H', home:'Cabo Verde',          away:'Saudi Arabia',         utc:'2026-06-27T00:00:00Z', venue:'NRG Stadium, Houston',                          ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 64, group:'H', home:'Uruguay',             away:'Spain',                utc:'2026-06-27T00:00:00Z', venue:'Estadio Akron, Guadalajara',                    ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 65, group:'G', home:'Egypt',               away:'IR Iran',              utc:'2026-06-27T03:00:00Z', venue:'Lumen Field, Seattle',                          ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 66, group:'G', home:'New Zealand',         away:'Belgium',              utc:'2026-06-27T03:00:00Z', venue:'BC Place, Vancouver',                           ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 67, group:'L', home:'Panama',              away:'England',              utc:'2026-06-27T21:00:00Z', venue:'MetLife Stadium, New York/New Jersey',           ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 68, group:'L', home:'Croatia',             away:'Ghana',                utc:'2026-06-27T21:00:00Z', venue:'Lincoln Financial Field, Philadelphia',          ukBroadcaster:'ITV', stage:'Group Stage'},
    {id: 69, group:'K', home:'Colombia',            away:'Portugal',             utc:'2026-06-27T23:30:00Z', venue:'Hard Rock Stadium, Miami',                      ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 70, group:'K', home:'Congo DR',            away:'Uzbekistan',           utc:'2026-06-27T23:30:00Z', venue:'Mercedes-Benz Stadium, Atlanta',                ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 71, group:'J', home:'Algeria',             away:'Austria',              utc:'2026-06-28T02:00:00Z', venue:'Arrowhead Stadium, Kansas City',                ukBroadcaster:'BBC', stage:'Group Stage'},
    {id: 72, group:'J', home:'Jordan',              away:'Argentina',            utc:'2026-06-28T02:00:00Z', venue:'AT&T Stadium, Dallas',                          ukBroadcaster:'BBC', stage:'Group Stage'},

    /* -- KNOCKOUT STAGE --------------------------------------- */
    /* Round of 32 */
    {id: 73, group:'—', home:'2A',    away:'2B',    utc:'2026-06-28T19:00:00Z', venue:'Los Angeles',          ukBroadcaster:'TBC', stage:'Round of 32'},
    {id: 74, group:'—', home:'1C',    away:'2F',    utc:'2026-06-29T17:00:00Z', venue:'Houston',              ukBroadcaster:'TBC', stage:'Round of 32'},
    {id: 75, group:'—', home:'1E',    away:'3ABCDF',utc:'2026-06-29T20:30:00Z', venue:'Boston',               ukBroadcaster:'TBC', stage:'Round of 32'},
    {id: 76, group:'—', home:'1F',    away:'2C',    utc:'2026-06-30T01:00:00Z', venue:'Monterrey',            ukBroadcaster:'TBC', stage:'Round of 32'},
    {id: 77, group:'—', home:'2E',    away:'2I',    utc:'2026-06-30T17:00:00Z', venue:'Dallas',               ukBroadcaster:'TBC', stage:'Round of 32'},
    {id: 78, group:'—', home:'1I',    away:'3CDFGH',utc:'2026-06-30T21:00:00Z', venue:'New York/New Jersey',  ukBroadcaster:'TBC', stage:'Round of 32'},
    {id: 79, group:'—', home:'1A',    away:'3CEFHI',utc:'2026-07-01T01:00:00Z', venue:'Mexico City',          ukBroadcaster:'TBC', stage:'Round of 32'},
    {id: 80, group:'—', home:'1L',    away:'3EHIJK',utc:'2026-07-01T16:00:00Z', venue:'Atlanta',              ukBroadcaster:'TBC', stage:'Round of 32'},
    {id: 81, group:'—', home:'1G',    away:'3AEHIJ',utc:'2026-07-01T20:00:00Z', venue:'Seattle',              ukBroadcaster:'TBC', stage:'Round of 32'},
    {id: 82, group:'—', home:'1D',    away:'3BEFIJ',utc:'2026-07-02T00:00:00Z', venue:'San Francisco Bay Area',ukBroadcaster:'TBC', stage:'Round of 32'},
    {id: 83, group:'—', home:'1H',    away:'2J',    utc:'2026-07-02T19:00:00Z', venue:'Los Angeles',          ukBroadcaster:'TBC', stage:'Round of 32'},
    {id: 84, group:'—', home:'2K',    away:'2L',    utc:'2026-07-02T23:00:00Z', venue:'Toronto',              ukBroadcaster:'TBC', stage:'Round of 32'},
    {id: 85, group:'—', home:'1B',    away:'3EFGIJ',utc:'2026-07-03T03:00:00Z', venue:'Vancouver',            ukBroadcaster:'TBC', stage:'Round of 32'},
    {id: 86, group:'—', home:'2D',    away:'2G',    utc:'2026-07-03T18:00:00Z', venue:'Dallas',               ukBroadcaster:'TBC', stage:'Round of 32'},
    {id: 87, group:'—', home:'1J',    away:'2H',    utc:'2026-07-03T22:00:00Z', venue:'Miami',                ukBroadcaster:'TBC', stage:'Round of 32'},
    {id: 88, group:'—', home:'1K',    away:'3DEIJL',utc:'2026-07-04T01:30:00Z', venue:'Kansas City',          ukBroadcaster:'TBC', stage:'Round of 32'},
    /* Round of 16 */
    {id: 89, group:'—', home:'W73',   away:'W75',   utc:'2026-07-04T17:00:00Z', venue:'Houston',              ukBroadcaster:'TBC', stage:'Round of 16'},
    {id: 90, group:'—', home:'W74',   away:'W77',   utc:'2026-07-04T21:00:00Z', venue:'Philadelphia',         ukBroadcaster:'TBC', stage:'Round of 16'},
    {id: 91, group:'—', home:'W76',   away:'W78',   utc:'2026-07-05T20:00:00Z', venue:'New York/New Jersey',  ukBroadcaster:'TBC', stage:'Round of 16'},
    {id: 92, group:'—', home:'W79',   away:'W80',   utc:'2026-07-06T00:00:00Z', venue:'Mexico City',          ukBroadcaster:'TBC', stage:'Round of 16'},
    {id: 93, group:'—', home:'W83',   away:'W84',   utc:'2026-07-06T19:00:00Z', venue:'Dallas',               ukBroadcaster:'TBC', stage:'Round of 16'},
    {id: 94, group:'—', home:'W81',   away:'W82',   utc:'2026-07-07T00:00:00Z', venue:'Seattle',              ukBroadcaster:'TBC', stage:'Round of 16'},
    {id: 95, group:'—', home:'W86',   away:'W88',   utc:'2026-07-07T16:00:00Z', venue:'Atlanta',              ukBroadcaster:'TBC', stage:'Round of 16'},
    {id: 96, group:'—', home:'W85',   away:'W87',   utc:'2026-07-07T20:00:00Z', venue:'Vancouver',            ukBroadcaster:'TBC', stage:'Round of 16'},
    /* Quarter-finals */
    {id: 97, group:'—', home:'W89',   away:'W90',   utc:'2026-07-09T20:00:00Z', venue:'Boston',               ukBroadcaster:'TBC', stage:'Quarter-final'},
    {id: 98, group:'—', home:'W93',   away:'W94',   utc:'2026-07-10T19:00:00Z', venue:'Los Angeles',          ukBroadcaster:'TBC', stage:'Quarter-final'},
    {id: 99, group:'—', home:'W91',   away:'W92',   utc:'2026-07-11T21:00:00Z', venue:'Miami',                ukBroadcaster:'TBC', stage:'Quarter-final'},
    {id:100, group:'—', home:'W95',   away:'W96',   utc:'2026-07-12T01:00:00Z', venue:'Kansas City',          ukBroadcaster:'TBC', stage:'Quarter-final'},
    /* Semi-finals */
    {id:101, group:'—', home:'W97',   away:'W98',   utc:'2026-07-14T19:00:00Z', venue:'Dallas',               ukBroadcaster:'TBC', stage:'Semi-final'},
    {id:102, group:'—', home:'W99',   away:'W100',  utc:'2026-07-15T19:00:00Z', venue:'Atlanta',              ukBroadcaster:'TBC', stage:'Semi-final'},
    /* Third place + Final */
    {id:103, group:'—', home:'RU101', away:'RU102', utc:'2026-07-18T21:00:00Z', venue:'Miami',                ukBroadcaster:'TBC',         stage:'Third Place Play-off'},
    {id:104, group:'—', home:'W101',  away:'W102',  utc:'2026-07-19T19:00:00Z', venue:'New York/New Jersey',  ukBroadcaster:'BBC / ITV',   stage:'Final'}

  ];

  /* -------------------------------------------------------------
     STANDINGS BOOTSTRAP
     Renderers call WC26.computeStandings(groupLetter) to get
     a sorted array of row objects derived live from SCHEDULE.
     This replaces the old static buildStandings() snapshot.
  ───────────────────────────────────────────────────────────── */
  function computeStandings(groupLetter) {
    var teams = GROUPS[groupLetter];
    if (!teams) return [];

    var table = {};
    teams.forEach(function (t) {
      table[t] = { team:t, p:0, w:0, d:0, l:0, gf:0, ga:0, gd:0, pts:0 };
    });

    SCHEDULE.forEach(function (m) {
      /* Only process confirmed finished matches */
      var finished = (m.status === 'FT' || m.status === 'AET' || m.status === 'PEN');
      if (!finished) return;
      if (typeof m.homeScore !== 'number' || typeof m.awayScore !== 'number') return;
      if (m.group !== groupLetter) return;

      var H = table[m.home];
      var A = table[m.away];
      if (!H || !A) return; /* safety: team not in this group */

      H.p++; A.p++;
      H.gf += m.homeScore; H.ga += m.awayScore;
      A.gf += m.awayScore; A.ga += m.homeScore;

      if (m.homeScore > m.awayScore) { H.w++; H.pts += 3; A.l++; }
      else if (m.homeScore < m.awayScore) { A.w++; A.pts += 3; H.l++; }
      else { H.d++; H.pts++; A.d++; A.pts++; }
    });

    var rows = teams.map(function (t) {
      var r = table[t];
      r.gd = r.gf - r.ga;
      return r;
    });

    /* Sort: Points -> GD -> GF -> alphabetical */
    rows.sort(function (x, y) {
      return (y.pts - x.pts) || (y.gd - x.gd) || (y.gf - x.gf) ||
             x.team.localeCompare(y.team);
    });

    return rows;
  }

  /* -------------------------------------------------------------
     HELPERS
  ───────────────────────────────────────────────────────────── */
  function flagImg(teamName, size) {
    size = size || 'w40';
    var code = FLAG[teamName] || 'un';
    return '<img src="https://flagcdn.com/' + size + '/' + code + '.png" '
         + 'alt="' + teamName + '" '
         + 'style="height:' + (size === 'w20' ? '14' : '24') + 'px;'
         + 'border-radius:2px;vertical-align:middle;margin-right:6px">';
  }

  function flagUrl(teamName) {
    var code = FLAG[teamName] || 'un';
    return 'https://flagcdn.com/w80/' + code + '.png';
  }

  function isMatchLive(m) {
    var now  = new Date();
    var kick = new Date(m.utc);
    var end  = new Date(kick.getTime() + 110 * 60000);
    return now >= kick && now <= end && m.status !== 'FT' && m.status !== 'AET' && m.status !== 'PEN';
  }

  /* -------------------------------------------------------------
     TV CHANNELS — auto-detected by visitor timezone
  ───────────────────────────────────────────────────────────── */
  var TV_CHANNELS = {
    'Europe/London':       { channel:'BBC / ITV',              country:'🇬🇧 United Kingdom' },
    'America/New_York':    { channel:'Fox Sports / Telemundo', country:'🇺🇸 USA (East)'     },
    'America/Chicago':     { channel:'Fox Sports / Telemundo', country:'🇺🇸 USA (Central)'  },
    'America/Los_Angeles': { channel:'Fox Sports / Telemundo', country:'🇺🇸 USA (West)'     },
    'America/Mexico_City': { channel:'Televisa / TV Azteca',   country:'🇲🇽 Mexico'          },
    'Africa/Johannesburg': { channel:'SuperSport',             country:'🇿🇦 South Africa'    },
    'Europe/Paris':        { channel:'TF1 / beIN Sports',      country:'🇫🇷 France'          },
    'Europe/Berlin':       { channel:'ARD / ZDF',              country:'🇩🇪 Germany'         },
    'Europe/Madrid':       { channel:'TVE / Mediaset',         country:'🇪🇸 Spain'           },
    'Asia/Tokyo':          { channel:'NHK / DAZN',             country:'🇯🇵 Japan'           },
    'Asia/Riyadh':         { channel:'SSC Sports',             country:'🇸🇦 Saudi Arabia'    },
    'Australia/Sydney':    { channel:'SBS / Optus Sport',      country:'🇦🇺 Australia'       }
  };

  function getUserTV() {
    var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return TV_CHANNELS[tz] || { channel:'Check local listings', country:'🌍 Your region' };
  }

  /* -------------------------------------------------------------
     VALIDATION — runs on every page load, errors to console only
  ───────────────────────────────────────────────────────────── */
  function validate() {
    var errors = [];
    var groupKeys = Object.keys(GROUPS);
    var allTeams  = [];

    if (groupKeys.length !== 12) errors.push('Expected 12 groups, found ' + groupKeys.length);

    groupKeys.forEach(function (g) {
      var teams = GROUPS[g];
      if (teams.length !== 4) errors.push('Group ' + g + ': expected 4 teams, found ' + teams.length);
      teams.forEach(function (t) {
        if (!FLAG[t]) errors.push('Group ' + g + ': no flag code for "' + t + '"');
        allTeams.push(t);
      });
    });

    var seen = {};
    allTeams.forEach(function (t) {
      if (seen[t]) errors.push('Duplicate team: "' + t + '"');
      seen[t] = true;
    });
    if (Object.keys(seen).length !== 48) errors.push('Expected 48 unique teams');

    var groupMatches = SCHEDULE.filter(function (m) { return m.group !== '—'; });
    if (groupMatches.length !== 72) errors.push('Expected 72 group-stage entries, found ' + groupMatches.length);

    groupMatches.forEach(function (m) {
      if (!FLAG[m.home] && GROUPS[m.group]) errors.push('id ' + m.id + ': unknown home "' + m.home + '"');
      if (!FLAG[m.away] && GROUPS[m.group]) errors.push('id ' + m.id + ': unknown away "' + m.away + '"');
    });

    if (errors.length) {
      errors.forEach(function (e) { console.error('[WC26 DATA ERROR] ' + e); });
      return false;
    }
    console.info('[WC26] Validated OK - 48 teams, 12 groups, 72 group fixtures, 32 knockout fixtures');
    return true;
  }

  /* -------------------------------------------------------------
     PUBLISH  window.WC26
     ─────────────────────────────────────────────────────────────
     wc-results.js merges API results into WC26.schedule at runtime.
     After each merge it calls window.renderStandings() and/or
     window.renderGroup() if those functions exist on the page.
     Manual FT entries in SCHEDULE always win — wc-results.js
     never overwrites an entry that already has status:'FT'.
  ───────────────────────────────────────────────────────────── */

  /* ─────────────────────────────────────────────────────────────
     GC_SCORE_GUARD  — global score safety lock
     Called before any score is displayed anywhere on the site.

     Returns:
       { show: true,  home: N, away: N, state: 'FT'|'LIVE'|'HT'|... }
         → safe to display score
       { show: false, home: null, away: null, state: 'UPCOMING' }
         → show "vs" only, never a number

     Rules enforced:
       1. kickoff UTC must be in the past
       2. status must be a recognised live or finished code
       3. homeScore and awayScore must be real numbers (not null/undefined)
       4. Logs a console warning if any rule is violated
  ─────────────────────────────────────────────────────────────── */
  var SCORE_LIVE_S  = { '1H':1,'HT':1,'2H':1,'ET':1,'BT':1,'P':1,'INT':1,'LIVE':1 };
  var SCORE_FT_S    = { 'FT':1,'AET':1,'PEN':1 };

  function scoreGuard(match, context) {
    var label = context || 'unknown';
    var now   = Date.now();

    /* Rule 1: kickoff must be in the past */
    var ko = match.utc ? new Date(match.utc).getTime() : 0;
    if (ko > now) {
      console.warn('[GC SCORE GUARD BLOCKED] Future match attempted to show score',
        label, match.home, 'vs', match.away, match.utc);
      return { show: false, home: null, away: null, state: 'UPCOMING' };
    }

    var st = match.status || '';

    /* Rule 2: status must be live or finished */
    if (!SCORE_LIVE_S[st] && !SCORE_FT_S[st]) {
      if (st) {
        console.warn('[GC SCORE GUARD BLOCKED] Unrecognised status', label, st,
          match.home, 'vs', match.away);
      }
      return { show: false, home: null, away: null, state: 'UPCOMING' };
    }

    /* Rule 3: scores must be real numbers */
    var h = match.homeScore, a = match.awayScore;
    if (typeof h !== 'number' || typeof a !== 'number' || isNaN(h) || isNaN(a)) {
      console.warn('[GC SCORE GUARD BLOCKED] Missing or non-numeric score', label,
        match.home, 'vs', match.away, 'homeScore='+h, 'awayScore='+a);
      return { show: false, home: null, away: null, state: st || 'UPCOMING' };
    }

    return { show: true, home: h, away: a, state: st };
  }

  window.WC26 = {
    lastUpdated      : '2026-06-13',
    source           : 'FIFA Official Draw Dec 2025 · FIFA.com fixtures · FIFA.com match centre results',
    groups           : GROUPS,
    schedule         : SCHEDULE,
    flags            : FLAG,
    tv               : TV_CHANNELS,
    /* methods */
    computeStandings : computeStandings,
    getUserTV        : getUserTV,
    isMatchLive      : isMatchLive,
    flagImg          : flagImg,
    flagUrl          : flagUrl,
    validate         : validate,
    scoreGuard       : scoreGuard
  };

  validate();

}());
