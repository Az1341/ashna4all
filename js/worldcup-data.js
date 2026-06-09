/**
 * GoalCurrent.live — FIFA World Cup 2026
 * SINGLE SOURCE OF TRUTH — all group, team, fixture and standing data lives here.
 * Every page on the site reads ONLY from window.WC26.
 * To update any team or fixture, edit ONLY this file.
 *
 * Source: FIFA Official Draw, December 2025
 *         Fixtures: FIFA.com / BBC Sport verified BST times
 * Last updated: 2026-06-07
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     FLAG CODES  (flagcdn.com ISO alpha-2)
     Centralised here so pages never hard-code codes
  ───────────────────────────────────────────── */
  var FLAG = {
    'Mexico':              'mx',
    'South Africa':        'za',
    'Korea Republic':         'kr',
    'Czechia':      'cz',
    'Canada':              'ca',
    'Bosnia & Herzegovina':'ba',
    'Qatar':               'qa',
    'Switzerland':         'ch',
    'Brazil':              'br',
    'Morocco':             'ma',
    'Haiti':               'ht',
    'Scotland':            'gb-sct',
    'USA':       'us',
    'Paraguay':            'py',
    'Australia':           'au',
    'Türkiye':              'tr',
    'Germany':             'de',
    'Curaçao':             'cw',
    "Côte d'Ivoire":       'ci',
    'Ecuador':             'ec',
    'Netherlands':         'nl',
    'Japan':               'jp',
    'Sweden':              'se',
    'Tunisia':             'tn',
    'Belgium':             'be',
    'Egypt':               'eg',
    'IR Iran':                'ir',
    'New Zealand':         'nz',
    'Spain':               'es',
    'Cabo Verde':          'cv',
    'Saudi Arabia':        'sa',
    'Uruguay':             'uy',
    'France':              'fr',
    'Senegal':             'sn',
    'Iraq':                'iq',
    'Norway':              'no',
    'Argentina':           'ar',
    'Algeria':             'dz',
    'Austria':             'at',
    'Jordan':              'jo',
    'Portugal':            'pt',
    'Congo DR':            'cd',
    'Uzbekistan':          'uz',
    'Colombia':            'co',
    'England':             'gb-eng',
    'Croatia':             'hr',
    'Ghana':               'gh',
    'Panama':              'pa'
  };

  /* ─────────────────────────────────────────────
     GROUPS  — 12 groups × 4 teams
     Source: FIFA Official Draw, December 2025
  ───────────────────────────────────────────── */
  var GROUPS = {
    A: ['Mexico', 'South Africa', 'Korea Republic', 'Czechia'],
    B: ['Canada', 'Bosnia & Herzegovina', 'Qatar', 'Switzerland'],
    C: ['Brazil', 'Morocco', 'Haiti', 'Scotland'],
    D: ['USA', 'Paraguay', 'Australia', 'Türkiye'],
    E: ['Germany', 'Curaçao', "Côte d'Ivoire", 'Ecuador'],
    F: ['Netherlands', 'Japan', 'Sweden', 'Tunisia'],
    G: ['Belgium', 'Egypt', 'IR Iran', 'New Zealand'],
    H: ['Spain', 'Cabo Verde', 'Saudi Arabia', 'Uruguay'],
    I: ['France', 'Senegal', 'Iraq', 'Norway'],
    J: ['Argentina', 'Algeria', 'Austria', 'Jordan'],
    K: ['Portugal', 'Congo DR', 'Uzbekistan', 'Colombia'],
    L: ['England', 'Croatia', 'Ghana', 'Panama']
  };

  /* ─────────────────────────────────────────────
     FIXTURES — all 72 group stage matches
     Times: BST (Europe/London)
     Source: FIFA.com / BBC Sport official schedule
     Format: { id, group, home, away, date, bst, venue, ukBroadcaster }
  ───────────────────────────────────────────── */
    var FIXTURES = [
    {id:1  ,group:'A',home:'Mexico',away:'South Africa',date:'2026-06-11',bst:'20:00',venue:'Estadio Azteca, Mexico City',ukBroadcaster:'ITV'},
    {id:2  ,group:'A',home:'Korea Republic',away:'Czechia',date:'2026-06-12',bst:'03:00',venue:'Estadio Akron, Guadalajara',ukBroadcaster:'BBC'},
    {id:3  ,group:'B',home:'Canada',away:'Bosnia & Herzegovina',date:'2026-06-12',bst:'20:00',venue:'BMO Field, Toronto',ukBroadcaster:'BBC'},
    {id:4  ,group:'D',home:'USA',away:'Paraguay',date:'2026-06-13',bst:'02:00',venue:'Rose Bowl, Los Angeles',ukBroadcaster:'BBC'},
    {id:5  ,group:'B',home:'Qatar',away:'Switzerland',date:'2026-06-13',bst:'20:00',venue:'Levi\'s Stadium, San Francisco Bay Area',ukBroadcaster:'ITV'},
    {id:6  ,group:'C',home:'Brazil',away:'Morocco',date:'2026-06-13',bst:'23:00',venue:'MetLife Stadium, New York/New Jersey',ukBroadcaster:'ITV'},
    {id:7  ,group:'C',home:'Haiti',away:'Scotland',date:'2026-06-14',bst:'02:00',venue:'Gillette Stadium, Boston',ukBroadcaster:'BBC'},
    {id:8  ,group:'D',home:'Australia',away:'Türkiye',date:'2026-06-14',bst:'05:00',venue:'BC Place, Vancouver',ukBroadcaster:'ITV'},
    {id:9  ,group:'E',home:'Germany',away:'Curaçao',date:'2026-06-14',bst:'18:00',venue:'NRG Stadium, Houston',ukBroadcaster:'BBC'},
    {id:10 ,group:'F',home:'Netherlands',away:'Japan',date:'2026-06-14',bst:'21:00',venue:'AT&T Stadium, Dallas',ukBroadcaster:'ITV'},
    {id:11 ,group:'E',home:'Côte d\'Ivoire',away:'Ecuador',date:'2026-06-15',bst:'00:00',venue:'Lincoln Financial Field, Philadelphia',ukBroadcaster:'ITV'},
    {id:12 ,group:'F',home:'Sweden',away:'Tunisia',date:'2026-06-15',bst:'03:00',venue:'Estadio BBVA, Monterrey',ukBroadcaster:'BBC'},
    {id:13 ,group:'H',home:'Spain',away:'Cabo Verde',date:'2026-06-15',bst:'17:00',venue:'Mercedes-Benz Stadium, Atlanta',ukBroadcaster:'ITV'},
    {id:14 ,group:'G',home:'Belgium',away:'Egypt',date:'2026-06-15',bst:'20:00',venue:'Lumen Field, Seattle',ukBroadcaster:'BBC'},
    {id:15 ,group:'G',home:'IR Iran',away:'New Zealand',date:'2026-06-15',bst:'21:00',venue:'Rose Bowl, Los Angeles',ukBroadcaster:'ITV'},
    {id:16 ,group:'H',home:'Saudi Arabia',away:'Uruguay',date:'2026-06-15',bst:'23:00',venue:'Hard Rock Stadium, Miami',ukBroadcaster:'BBC'},
    {id:17 ,group:'I',home:'France',away:'Senegal',date:'2026-06-16',bst:'20:00',venue:'MetLife Stadium, New York/New Jersey',ukBroadcaster:'BBC'},
    {id:18 ,group:'I',home:'Iraq',away:'Norway',date:'2026-06-16',bst:'23:00',venue:'Gillette Stadium, Boston',ukBroadcaster:'ITV'},
    {id:19 ,group:'J',home:'Argentina',away:'Algeria',date:'2026-06-17',bst:'02:00',venue:'Arrowhead Stadium, Kansas City',ukBroadcaster:'ITV'},
    {id:20 ,group:'J',home:'Austria',away:'Jordan',date:'2026-06-17',bst:'05:00',venue:'Levi\'s Stadium, San Francisco Bay Area',ukBroadcaster:'BBC'},
    {id:21 ,group:'K',home:'Portugal',away:'Congo DR',date:'2026-06-17',bst:'18:00',venue:'NRG Stadium, Houston',ukBroadcaster:'BBC'},
    {id:22 ,group:'L',home:'England',away:'Croatia',date:'2026-06-17',bst:'21:00',venue:'AT&T Stadium, Dallas',ukBroadcaster:'ITV'},
    {id:23 ,group:'L',home:'Ghana',away:'Panama',date:'2026-06-18',bst:'00:00',venue:'BMO Field, Toronto',ukBroadcaster:'BBC'},
    {id:24 ,group:'K',home:'Uzbekistan',away:'Colombia',date:'2026-06-18',bst:'03:00',venue:'Estadio Azteca, Mexico City',ukBroadcaster:'ITV'},
    {id:25 ,group:'A',home:'Czechia',away:'South Africa',date:'2026-06-18',bst:'17:00',venue:'Mercedes-Benz Stadium, Atlanta',ukBroadcaster:'ITV'},
    {id:26 ,group:'B',home:'Switzerland',away:'Bosnia & Herzegovina',date:'2026-06-18',bst:'20:00',venue:'Rose Bowl, Los Angeles',ukBroadcaster:'BBC'},
    {id:27 ,group:'B',home:'Canada',away:'Qatar',date:'2026-06-18',bst:'23:00',venue:'BC Place, Vancouver',ukBroadcaster:'ITV'},
    {id:28 ,group:'A',home:'Mexico',away:'Korea Republic',date:'2026-06-19',bst:'02:00',venue:'Estadio Akron, Guadalajara',ukBroadcaster:'BBC'},
    {id:29 ,group:'D',home:'USA',away:'Australia',date:'2026-06-19',bst:'20:00',venue:'Lumen Field, Seattle',ukBroadcaster:'ITV'},
    {id:30 ,group:'C',home:'Scotland',away:'Morocco',date:'2026-06-19',bst:'23:00',venue:'Gillette Stadium, Boston',ukBroadcaster:'BBC'},
    {id:31 ,group:'C',home:'Brazil',away:'Haiti',date:'2026-06-20',bst:'01:30',venue:'Lincoln Financial Field, Philadelphia',ukBroadcaster:'ITV'},
    {id:32 ,group:'D',home:'Türkiye',away:'Paraguay',date:'2026-06-20',bst:'04:00',venue:'Levi\'s Stadium, San Francisco Bay Area',ukBroadcaster:'BBC'},
    {id:33 ,group:'F',home:'Netherlands',away:'Sweden',date:'2026-06-20',bst:'18:00',venue:'NRG Stadium, Houston',ukBroadcaster:'BBC'},
    {id:34 ,group:'E',home:'Germany',away:'Côte d\'Ivoire',date:'2026-06-20',bst:'21:00',venue:'BMO Field, Toronto',ukBroadcaster:'ITV'},
    {id:35 ,group:'E',home:'Ecuador',away:'Curaçao',date:'2026-06-21',bst:'01:00',venue:'Arrowhead Stadium, Kansas City',ukBroadcaster:'BBC'},
    {id:36 ,group:'F',home:'Tunisia',away:'Japan',date:'2026-06-21',bst:'05:00',venue:'Estadio BBVA, Monterrey',ukBroadcaster:'ITV'},
    {id:37 ,group:'H',home:'Spain',away:'Saudi Arabia',date:'2026-06-21',bst:'17:00',venue:'Mercedes-Benz Stadium, Atlanta',ukBroadcaster:'ITV'},
    {id:38 ,group:'G',home:'Belgium',away:'IR Iran',date:'2026-06-21',bst:'20:00',venue:'Rose Bowl, Los Angeles',ukBroadcaster:'BBC'},
    {id:39 ,group:'H',home:'Uruguay',away:'Cabo Verde',date:'2026-06-21',bst:'23:00',venue:'Hard Rock Stadium, Miami',ukBroadcaster:'BBC'},
    {id:40 ,group:'G',home:'New Zealand',away:'Egypt',date:'2026-06-22',bst:'02:00',venue:'BC Place, Vancouver',ukBroadcaster:'ITV'},
    {id:41 ,group:'J',home:'Argentina',away:'Austria',date:'2026-06-22',bst:'18:00',venue:'AT&T Stadium, Dallas',ukBroadcaster:'ITV'},
    {id:42 ,group:'I',home:'France',away:'Iraq',date:'2026-06-22',bst:'22:00',venue:'Lincoln Financial Field, Philadelphia',ukBroadcaster:'BBC'},
    {id:43 ,group:'I',home:'Norway',away:'Senegal',date:'2026-06-23',bst:'01:00',venue:'MetLife Stadium, New York/New Jersey',ukBroadcaster:'ITV'},
    {id:44 ,group:'J',home:'Jordan',away:'Algeria',date:'2026-06-23',bst:'04:00',venue:'Levi\'s Stadium, San Francisco Bay Area',ukBroadcaster:'BBC'},
    {id:45 ,group:'K',home:'Portugal',away:'Uzbekistan',date:'2026-06-23',bst:'18:00',venue:'NRG Stadium, Houston',ukBroadcaster:'BBC'},
    {id:46 ,group:'L',home:'England',away:'Ghana',date:'2026-06-23',bst:'21:00',venue:'Gillette Stadium, Boston',ukBroadcaster:'ITV'},
    {id:47 ,group:'L',home:'Panama',away:'Croatia',date:'2026-06-24',bst:'00:00',venue:'BMO Field, Toronto',ukBroadcaster:'BBC'},
    {id:48 ,group:'K',home:'Colombia',away:'Congo DR',date:'2026-06-24',bst:'03:00',venue:'Estadio Akron, Guadalajara',ukBroadcaster:'ITV'},
    {id:49 ,group:'B',home:'Switzerland',away:'Canada',date:'2026-06-24',bst:'20:00',venue:'BC Place, Vancouver',ukBroadcaster:'BBC'},
    {id:50 ,group:'B',home:'Bosnia & Herzegovina',away:'Qatar',date:'2026-06-24',bst:'20:00',venue:'Lumen Field, Seattle',ukBroadcaster:'ITV'},
    {id:51 ,group:'C',home:'Scotland',away:'Brazil',date:'2026-06-24',bst:'23:00',venue:'Hard Rock Stadium, Miami',ukBroadcaster:'BBC'},
    {id:52 ,group:'C',home:'Morocco',away:'Haiti',date:'2026-06-24',bst:'23:00',venue:'Mercedes-Benz Stadium, Atlanta',ukBroadcaster:'ITV'},
    {id:53 ,group:'A',home:'Czechia',away:'Mexico',date:'2026-06-25',bst:'02:00',venue:'Estadio Azteca, Mexico City',ukBroadcaster:'BBC'},
    {id:54 ,group:'A',home:'South Africa',away:'Korea Republic',date:'2026-06-25',bst:'02:00',venue:'Estadio BBVA, Monterrey',ukBroadcaster:'ITV'},
    {id:55 ,group:'E',home:'Curaçao',away:'Côte d\'Ivoire',date:'2026-06-25',bst:'21:00',venue:'Lincoln Financial Field, Philadelphia',ukBroadcaster:'ITV'},
    {id:56 ,group:'E',home:'Ecuador',away:'Germany',date:'2026-06-25',bst:'21:00',venue:'MetLife Stadium, New York/New Jersey',ukBroadcaster:'BBC'},
    {id:57 ,group:'F',home:'Japan',away:'Sweden',date:'2026-06-26',bst:'00:00',venue:'AT&T Stadium, Dallas',ukBroadcaster:'BBC'},
    {id:58 ,group:'F',home:'Tunisia',away:'Netherlands',date:'2026-06-26',bst:'00:00',venue:'Arrowhead Stadium, Kansas City',ukBroadcaster:'ITV'},
    {id:59 ,group:'D',home:'Türkiye',away:'USA',date:'2026-06-26',bst:'03:00',venue:'Rose Bowl, Los Angeles',ukBroadcaster:'BBC'},
    {id:60 ,group:'D',home:'Paraguay',away:'Australia',date:'2026-06-26',bst:'03:00',venue:'Levi\'s Stadium, San Francisco Bay Area',ukBroadcaster:'ITV'},
    {id:61 ,group:'I',home:'Norway',away:'France',date:'2026-06-26',bst:'20:00',venue:'Gillette Stadium, Boston',ukBroadcaster:'BBC'},
    {id:62 ,group:'I',home:'Senegal',away:'Iraq',date:'2026-06-26',bst:'20:00',venue:'BMO Field, Toronto',ukBroadcaster:'ITV'},
    {id:63 ,group:'H',home:'Cabo Verde',away:'Saudi Arabia',date:'2026-06-27',bst:'01:00',venue:'NRG Stadium, Houston',ukBroadcaster:'ITV'},
    {id:64 ,group:'H',home:'Uruguay',away:'Spain',date:'2026-06-27',bst:'01:00',venue:'Estadio Akron, Guadalajara',ukBroadcaster:'BBC'},
    {id:65 ,group:'G',home:'Egypt',away:'IR Iran',date:'2026-06-27',bst:'04:00',venue:'Lumen Field, Seattle',ukBroadcaster:'BBC'},
    {id:66 ,group:'G',home:'New Zealand',away:'Belgium',date:'2026-06-27',bst:'04:00',venue:'BC Place, Vancouver',ukBroadcaster:'ITV'},
    {id:67 ,group:'L',home:'Panama',away:'England',date:'2026-06-27',bst:'22:00',venue:'MetLife Stadium, New York/New Jersey',ukBroadcaster:'BBC'},
    {id:68 ,group:'L',home:'Croatia',away:'Ghana',date:'2026-06-27',bst:'22:00',venue:'Lincoln Financial Field, Philadelphia',ukBroadcaster:'ITV'},
    {id:69 ,group:'K',home:'Colombia',away:'Portugal',date:'2026-06-28',bst:'00:30',venue:'Hard Rock Stadium, Miami',ukBroadcaster:'BBC'},
    {id:70 ,group:'K',home:'Congo DR',away:'Uzbekistan',date:'2026-06-28',bst:'00:30',venue:'Mercedes-Benz Stadium, Atlanta',ukBroadcaster:'ITV'},
    {id:71 ,group:'J',home:'Algeria',away:'Austria',date:'2026-06-28',bst:'03:00',venue:'Arrowhead Stadium, Kansas City',ukBroadcaster:'ITV'},
    {id:72 ,group:'J',home:'Jordan',away:'Argentina',date:'2026-06-28',bst:'03:00',venue:'AT&T Stadium, Dallas',ukBroadcaster:'BBC'}
  ];

  /* ─────────────────────────────────────────────
     STANDINGS — initialised at 0, updated live
     Pages read from WC26.standings[group][teamName]
  ───────────────────────────────────────────── */
  function buildStandings() {
    var s = {};
    Object.keys(GROUPS).forEach(function (g) {
      s[g] = {};
      GROUPS[g].forEach(function (team) {
        s[g][team] = { p:0, w:0, d:0, l:0, gf:0, ga:0, gd:0, pts:0 };
      });
    });
    return s;
  }

  /* ─────────────────────────────────────────────
     VALIDATION
  ───────────────────────────────────────────── */
  function validate() {
    var errors = [];
    var allTeams = [];
    var groupKeys = Object.keys(GROUPS);

    /* 12 groups */
    if (groupKeys.length !== 12) {
      errors.push('Expected 12 groups, found ' + groupKeys.length);
    }

    groupKeys.forEach(function (g) {
      var teams = GROUPS[g];
      /* Each group has exactly 4 teams */
      if (teams.length !== 4) {
        errors.push('Group ' + g + ' has ' + teams.length + ' teams (expected 4)');
      }
      /* All teams have a known flag code */
      teams.forEach(function (team) {
        if (!FLAG[team]) {
          errors.push('Group ' + g + ': no flag code for "' + team + '"');
        }
        allTeams.push(team);
      });
    });

    /* No duplicate teams across groups */
    var seen = {};
    allTeams.forEach(function (team) {
      if (seen[team]) {
        errors.push('Duplicate team across groups: "' + team + '"');
      }
      seen[team] = true;
    });

    /* Exactly 48 teams */
    var unique = Object.keys(seen).length;
    if (unique !== 48) {
      errors.push('Expected 48 unique teams, found ' + unique);
    }

    /* 72 group stage fixtures */
    if (FIXTURES.length !== 72) {
      errors.push('Expected 72 group stage fixtures, found ' + FIXTURES.length);
    }

    /* Every fixture references valid teams */
    FIXTURES.forEach(function (f) {
      if (!FLAG[f.home]) errors.push('Fixture id ' + f.id + ': unknown home team "' + f.home + '"');
      if (!FLAG[f.away]) errors.push('Fixture id ' + f.id + ': unknown away team "' + f.away + '"');
      if (!GROUPS[f.group]) errors.push('Fixture id ' + f.id + ': unknown group "' + f.group + '"');
    });

    if (errors.length > 0) {
      errors.forEach(function (e) { console.error('[WC26 DATA ERROR] ' + e); });
      return false;
    }
    console.info('[WC26] Data validated OK — 48 teams, 12 groups, 72 fixtures.');
    return true;
  }

  /* ─────────────────────────────────────────────
     HELPER — get flag img tag for a team name
  ───────────────────────────────────────────── */
  function flagImg(teamName, size) {
    size = size || 'w40';
    var code = FLAG[teamName] || 'un';
    return '<img src="https://flagcdn.com/' + size + '/' + code + '.png" '
         + 'alt="' + teamName + '" '
         + 'style="height:' + (size === 'w20' ? '14' : '24') + 'px;border-radius:2px;vertical-align:middle;margin-right:6px">';
  }

  /* ─────────────────────────────────────────────
     TV CHANNELS — auto-detected by timezone
  ───────────────────────────────────────────── */
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

  function isLive(dateStr, bst) {
    var now  = new Date();
    var kick = new Date(dateStr + 'T' + bst + ':00');
    var end  = new Date(kick.getTime() + 110 * 60000);
    return now >= kick && now <= end;
  }

  /* ─────────────────────────────────────────────
     PUBLISH
  ───────────────────────────────────────────── */
  window.WC26 = {
    lastUpdated : '2026-06-07',
    source      : 'FIFA Official Draw (December 2025) + FIFA.com fixture schedule',
    groups      : GROUPS,
    fixtures    : FIXTURES,
    standings   : buildStandings(),
    flags       : FLAG,
    tv          : TV_CHANNELS,
    getUserTV   : getUserTV,
    isLive      : isLive,
    flagImg     : flagImg,
    validate    : validate
  };

  /* Run validation immediately on load */
  validate();

}());
