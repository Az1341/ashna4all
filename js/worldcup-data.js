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


/* ─────────────────────────────────────────────
   WC26_SCHEDULE — shared authoritative 104-match schedule
   Source: extracted from the verified fixtures page so every page reads one schedule.
   Times are stored as UK/BST display times and converted to UTC/local by page helpers.
───────────────────────────────────────────── */
(function () {
  'use strict';
  var SCHEDULE = {'2026-06-11':[{n:1,h:'Mexico',a:'South Africa',t:'20:00',v:'Mexico City',g:'A',s:'Group Stage',uk:'ITV',stad:'Estadio Azteca'}],'2026-06-12':[{n:2,h:'South Korea',a:'Czech Republic',t:'03:00',v:'Guadalajara',g:'A',s:'Group Stage',uk:'BBC',stad:'Estadio Akron'},{n:3,h:'Canada',a:'Bosnia & Herz.',t:'20:00',v:'Toronto',g:'B',s:'Group Stage',uk:'ITV',stad:'BMO Field'}],'2026-06-13':[{n:4,h:'USA',a:'Paraguay',t:'02:00',v:'Los Angeles',g:'D',s:'Group Stage',uk:'BBC',stad:'Rose Bowl'},{n:5,h:'Qatar',a:'Switzerland',t:'20:00',v:'San Francisco Bay Area',g:'B',s:'Group Stage',uk:'BBC',stad:"Levi's Stadium"},{n:6,h:'Brazil',a:'Morocco',t:'23:00',v:'New York/New Jersey',g:'C',s:'Group Stage',uk:'ITV',stad:'MetLife Stadium'}],'2026-06-14':[{n:7,h:'Haiti',a:'Scotland',t:'02:00',v:'Boston',g:'C',s:'Group Stage',uk:'BBC',stad:'Gillette Stadium'},{n:8,h:'Australia',a:'Turkey',t:'05:00',v:'Vancouver',g:'D',s:'Group Stage',uk:'ITV',stad:'BC Place'},{n:9,h:'Germany',a:'Curaçao',t:'18:00',v:'Houston',g:'E',s:'Group Stage',uk:'BBC',stad:'NRG Stadium'},{n:10,h:'Netherlands',a:'Japan',t:'21:00',v:'Dallas',g:'F',s:'Group Stage',uk:'ITV',stad:'AT&T Stadium'}],'2026-06-15':[{n:11,h:"Côte d'Ivoire",a:'Ecuador',t:'00:00',v:'Philadelphia',g:'E',s:'Group Stage',uk:'BBC',stad:'Lincoln Financial Field'},{n:12,h:'Sweden',a:'Tunisia',t:'03:00',v:'Monterrey',g:'F',s:'Group Stage',uk:'ITV',stad:'Estadio BBVA'},{n:13,h:'Spain',a:'Cape Verde',t:'17:00',v:'Atlanta',g:'H',s:'Group Stage',uk:'ITV',stad:'Mercedes-Benz Stadium'},{n:14,h:'Belgium',a:'Egypt',t:'20:00',v:'Seattle',g:'G',s:'Group Stage',uk:'BBC',stad:'Lumen Field'},{n:15,h:'Iran',a:'New Zealand',t:'21:00',v:'Los Angeles',g:'G',s:'Group Stage',uk:'ITV',stad:'Rose Bowl'},{n:16,h:'Saudi Arabia',a:'Uruguay',t:'23:00',v:'Miami',g:'H',s:'Group Stage',uk:'BBC',stad:'Hard Rock Stadium'}],'2026-06-16':[{n:17,h:'France',a:'Senegal',t:'20:00',v:'New York/New Jersey',g:'I',s:'Group Stage',uk:'BBC',stad:'MetLife Stadium'},{n:18,h:'Iraq',a:'Norway',t:'23:00',v:'Boston',g:'I',s:'Group Stage',uk:'ITV',stad:'Gillette Stadium'}],'2026-06-17':[{n:19,h:'Argentina',a:'Algeria',t:'02:00',v:'Kansas City',g:'J',s:'Group Stage',uk:'BBC',stad:'Arrowhead Stadium'},{n:20,h:'Austria',a:'Jordan',t:'05:00',v:'San Francisco Bay Area',g:'J',s:'Group Stage',uk:'ITV',stad:"Levi's Stadium"},{n:21,h:'Portugal',a:'DR Congo',t:'18:00',v:'Houston',g:'K',s:'Group Stage',uk:'ITV',stad:'NRG Stadium'},{n:22,h:'England',a:'Croatia',t:'21:00',v:'Dallas',g:'L',s:'Group Stage',uk:'BBC',stad:'AT&T Stadium'}],'2026-06-18':[{n:23,h:'Ghana',a:'Panama',t:'00:00',v:'Toronto',g:'L',s:'Group Stage',uk:'BBC',stad:'BMO Field'},{n:24,h:'Uzbekistan',a:'Colombia',t:'03:00',v:'Mexico City',g:'K',s:'Group Stage',uk:'ITV',stad:'Estadio Azteca'},{n:25,h:'Czech Republic',a:'South Africa',t:'17:00',v:'Atlanta',g:'A',s:'Group Stage',uk:'BBC',stad:'Mercedes-Benz Stadium'},{n:26,h:'Switzerland',a:'Bosnia & Herz.',t:'20:00',v:'Los Angeles',g:'B',s:'Group Stage',uk:'ITV',stad:'Rose Bowl'},{n:27,h:'Canada',a:'Qatar',t:'23:00',v:'Vancouver',g:'B',s:'Group Stage',uk:'ITV',stad:'BC Place'}],'2026-06-19':[{n:28,h:'Mexico',a:'South Korea',t:'02:00',v:'Guadalajara',g:'A',s:'Group Stage',uk:'BBC',stad:'Estadio Akron'},{n:29,h:'USA',a:'Australia',t:'20:00',v:'Seattle',g:'D',s:'Group Stage',uk:'ITV',stad:'Lumen Field'},{n:30,h:'Scotland',a:'Morocco',t:'23:00',v:'Boston',g:'C',s:'Group Stage',uk:'BBC',stad:'Gillette Stadium'}],'2026-06-20':[{n:31,h:'Brazil',a:'Haiti',t:'01:30',v:'Philadelphia',g:'C',s:'Group Stage',uk:'ITV',stad:'Lincoln Financial Field'},{n:32,h:'Turkey',a:'Paraguay',t:'04:00',v:'San Francisco Bay Area',g:'D',s:'Group Stage',uk:'BBC',stad:"Levi's Stadium"},{n:33,h:'Netherlands',a:'Sweden',t:'18:00',v:'Houston',g:'F',s:'Group Stage',uk:'BBC',stad:'NRG Stadium'},{n:34,h:'Germany',a:"Côte d'Ivoire",t:'21:00',v:'Toronto',g:'E',s:'Group Stage',uk:'ITV',stad:'BMO Field'}],'2026-06-21':[{n:35,h:'Ecuador',a:'Curaçao',t:'01:00',v:'Kansas City',g:'E',s:'Group Stage',uk:'BBC',stad:'Arrowhead Stadium'},{n:36,h:'Tunisia',a:'Japan',t:'05:00',v:'Monterrey',g:'F',s:'Group Stage',uk:'ITV',stad:'Estadio BBVA'},{n:37,h:'Spain',a:'Saudi Arabia',t:'17:00',v:'Atlanta',g:'H',s:'Group Stage',uk:'BBC',stad:'Mercedes-Benz Stadium'},{n:38,h:'Belgium',a:'Iran',t:'20:00',v:'Los Angeles',g:'G',s:'Group Stage',uk:'ITV',stad:'Rose Bowl'},{n:39,h:'Uruguay',a:'Cape Verde',t:'23:00',v:'Miami',g:'H',s:'Group Stage',uk:'BBC',stad:'Hard Rock Stadium'}],'2026-06-22':[{n:40,h:'New Zealand',a:'Egypt',t:'02:00',v:'Vancouver',g:'G',s:'Group Stage',uk:'ITV',stad:'BC Place'},{n:41,h:'Argentina',a:'Austria',t:'18:00',v:'Dallas',g:'J',s:'Group Stage',uk:'BBC',stad:'AT&T Stadium'},{n:42,h:'France',a:'Iraq',t:'22:00',v:'Philadelphia',g:'I',s:'Group Stage',uk:'ITV',stad:'Lincoln Financial Field'}],'2026-06-23':[{n:43,h:'Norway',a:'Senegal',t:'01:00',v:'New York/New Jersey',g:'I',s:'Group Stage',uk:'ITV',stad:'MetLife Stadium'},{n:44,h:'Jordan',a:'Algeria',t:'04:00',v:'San Francisco Bay Area',g:'J',s:'Group Stage',uk:'BBC',stad:"Levi's Stadium"},{n:45,h:'Portugal',a:'Uzbekistan',t:'18:00',v:'Houston',g:'K',s:'Group Stage',uk:'ITV',stad:'NRG Stadium'},{n:46,h:'England',a:'Ghana',t:'21:00',v:'Boston',g:'L',s:'Group Stage',uk:'BBC',stad:'Gillette Stadium'}],'2026-06-24':[{n:47,h:'Panama',a:'Croatia',t:'00:00',v:'Toronto',g:'L',s:'Group Stage',uk:'ITV',stad:'BMO Field'},{n:48,h:'Colombia',a:'DR Congo',t:'03:00',v:'Guadalajara',g:'K',s:'Group Stage',uk:'BBC',stad:'Estadio Akron'},{n:49,h:'Switzerland',a:'Canada',t:'20:00',v:'Vancouver',g:'B',s:'Group Stage',uk:'BBC',stad:'BC Place'},{n:50,h:'Bosnia & Herz.',a:'Qatar',t:'20:00',v:'Seattle',g:'B',s:'Group Stage',uk:'ITV',stad:'Lumen Field'},{n:51,h:'Scotland',a:'Brazil',t:'23:00',v:'Miami',g:'C',s:'Group Stage',uk:'BBC',stad:'Hard Rock Stadium'},{n:52,h:'Morocco',a:'Haiti',t:'23:00',v:'Atlanta',g:'C',s:'Group Stage',uk:'ITV',stad:'Mercedes-Benz Stadium'}],'2026-06-25':[{n:53,h:'Czech Republic',a:'Mexico',t:'02:00',v:'Mexico City',g:'A',s:'Group Stage',uk:'BBC',stad:'Estadio Azteca'},{n:54,h:'South Africa',a:'South Korea',t:'02:00',v:'Monterrey',g:'A',s:'Group Stage',uk:'ITV',stad:'Estadio BBVA'},{n:55,h:'Curaçao',a:"Côte d'Ivoire",t:'21:00',v:'Philadelphia',g:'E',s:'Group Stage',uk:'ITV',stad:'Lincoln Financial Field'},{n:56,h:'Ecuador',a:'Germany',t:'21:00',v:'New York/New Jersey',g:'E',s:'Group Stage',uk:'BBC',stad:'MetLife Stadium'}],'2026-06-26':[{n:57,h:'Japan',a:'Sweden',t:'00:00',v:'Dallas',g:'F',s:'Group Stage',uk:'ITV',stad:'AT&T Stadium'},{n:58,h:'Tunisia',a:'Netherlands',t:'00:00',v:'Kansas City',g:'F',s:'Group Stage',uk:'BBC',stad:'Arrowhead Stadium'},{n:59,h:'Turkey',a:'USA',t:'03:00',v:'Los Angeles',g:'D',s:'Group Stage',uk:'ITV',stad:'Rose Bowl'},{n:60,h:'Paraguay',a:'Australia',t:'03:00',v:'San Francisco Bay Area',g:'D',s:'Group Stage',uk:'BBC',stad:"Levi's Stadium"},{n:61,h:'Norway',a:'France',t:'20:00',v:'Boston',g:'I',s:'Group Stage',uk:'BBC',stad:'Gillette Stadium'},{n:62,h:'Senegal',a:'Iraq',t:'20:00',v:'Toronto',g:'I',s:'Group Stage',uk:'ITV',stad:'BMO Field'}],'2026-06-27':[{n:63,h:'Cape Verde',a:'Saudi Arabia',t:'01:00',v:'Houston',g:'H',s:'Group Stage',uk:'BBC',stad:'NRG Stadium'},{n:64,h:'Uruguay',a:'Spain',t:'01:00',v:'Guadalajara',g:'H',s:'Group Stage',uk:'ITV',stad:'Estadio Akron'},{n:65,h:'Egypt',a:'Iran',t:'04:00',v:'Seattle',g:'G',s:'Group Stage',uk:'BBC',stad:'Lumen Field'},{n:66,h:'New Zealand',a:'Belgium',t:'04:00',v:'Vancouver',g:'G',s:'Group Stage',uk:'ITV',stad:'BC Place'},{n:67,h:'Panama',a:'England',t:'22:00',v:'New York/New Jersey',g:'L',s:'Group Stage',uk:'ITV',stad:'MetLife Stadium'},{n:68,h:'Croatia',a:'Ghana',t:'22:00',v:'Philadelphia',g:'L',s:'Group Stage',uk:'BBC',stad:'Lincoln Financial Field'}],'2026-06-28':[{n:69,h:'Colombia',a:'Portugal',t:'00:30',v:'Miami',g:'K',s:'Group Stage',uk:'ITV',stad:'Hard Rock Stadium'},{n:70,h:'DR Congo',a:'Uzbekistan',t:'00:30',v:'Atlanta',g:'K',s:'Group Stage',uk:'BBC',stad:'Mercedes-Benz Stadium'},{n:71,h:'Algeria',a:'Austria',t:'03:00',v:'Kansas City',g:'J',s:'Group Stage',uk:'BBC',stad:'Arrowhead Stadium'},{n:72,h:'Jordan',a:'Argentina',t:'03:00',v:'Dallas',g:'J',s:'Group Stage',uk:'ITV',stad:'AT&T Stadium'},{n:73,h:'2A',a:'2B',t:'20:00',v:'Los Angeles',g:'—',s:'Round of 32',uk:'BBC',stad:'Rose Bowl'}],'2026-06-29':[{n:74,h:'1C',a:'2F',t:'18:00',v:'Houston',g:'—',s:'Round of 32',uk:'BBC',stad:'NRG Stadium'},{n:75,h:'1E',a:'3ABCDF',t:'21:30',v:'Boston',g:'—',s:'Round of 32',uk:'BBC',stad:'Gillette Stadium'}],'2026-06-30':[{n:76,h:'1F',a:'2C',t:'02:00',v:'Monterrey',g:'—',s:'Round of 32',uk:'BBC',stad:'Estadio BBVA'},{n:77,h:'2E',a:'2I',t:'18:00',v:'Dallas',g:'—',s:'Round of 32',uk:'BBC',stad:'AT&T Stadium'},{n:78,h:'1I',a:'3CDFGH',t:'22:00',v:'New York/New Jersey',g:'—',s:'Round of 32',uk:'BBC',stad:'MetLife Stadium'}],'2026-07-01':[{n:79,h:'1A',a:'3CEFHI',t:'02:00',v:'Mexico City',g:'—',s:'Round of 32',uk:'BBC',stad:'Estadio Azteca'},{n:80,h:'1L',a:'3EHIJK',t:'17:00',v:'Atlanta',g:'—',s:'Round of 32',uk:'BBC',stad:'Mercedes-Benz Stadium'},{n:81,h:'1G',a:'3AEHIJ',t:'21:00',v:'Seattle',g:'—',s:'Round of 32',uk:'BBC',stad:'Lumen Field'}],'2026-07-02':[{n:82,h:'1D',a:'3BEFIJ',t:'01:00',v:'San Francisco Bay Area',g:'—',s:'Round of 32',uk:'BBC',stad:"Levi's Stadium"},{n:83,h:'1H',a:'2J',t:'20:00',v:'Los Angeles',g:'—',s:'Round of 32',uk:'BBC',stad:'Rose Bowl'}],'2026-07-03':[{n:84,h:'2K',a:'2L',t:'00:00',v:'Toronto',g:'—',s:'Round of 32',uk:'BBC',stad:'BMO Field'},{n:85,h:'1B',a:'3EFGIJ',t:'04:00',v:'Vancouver',g:'—',s:'Round of 32',uk:'BBC',stad:'BC Place'},{n:86,h:'2D',a:'2G',t:'19:00',v:'Dallas',g:'—',s:'Round of 32',uk:'BBC',stad:'AT&T Stadium'},{n:87,h:'1J',a:'2H',t:'23:00',v:'Miami',g:'—',s:'Round of 32',uk:'BBC',stad:'Hard Rock Stadium'}],'2026-07-04':[{n:88,h:'1K',a:'3DEIJL',t:'02:30',v:'Kansas City',g:'—',s:'Round of 32',uk:'BBC',stad:'Arrowhead Stadium'},{n:89,h:'W73',a:'W75',t:'18:00',v:'Houston',g:'—',s:'Round of 16',uk:'BBC',stad:'NRG Stadium'},{n:90,h:'W74',a:'W77',t:'22:00',v:'Philadelphia',g:'—',s:'Round of 16',uk:'BBC',stad:'Lincoln Financial Field'}],'2026-07-05':[{n:91,h:'W76',a:'W78',t:'21:00',v:'New York/New Jersey',g:'—',s:'Round of 16',uk:'BBC',stad:'MetLife Stadium'}],'2026-07-06':[{n:92,h:'W79',a:'W80',t:'01:00',v:'Mexico City',g:'—',s:'Round of 16',uk:'BBC',stad:'Estadio Azteca'},{n:93,h:'W83',a:'W84',t:'20:00',v:'Dallas',g:'—',s:'Round of 16',uk:'BBC',stad:'AT&T Stadium'}],'2026-07-07':[{n:94,h:'W81',a:'W82',t:'01:00',v:'Seattle',g:'—',s:'Round of 16',uk:'BBC',stad:'Lumen Field'},{n:95,h:'W86',a:'W88',t:'17:00',v:'Atlanta',g:'—',s:'Round of 16',uk:'BBC',stad:'Mercedes-Benz Stadium'},{n:96,h:'W85',a:'W87',t:'21:00',v:'Vancouver',g:'—',s:'Round of 16',uk:'BBC',stad:'BC Place'}],'2026-07-09':[{n:97,h:'W89',a:'W90',t:'21:00',v:'Boston',g:'—',s:'Quarter-final',uk:'BBC',stad:'Gillette Stadium'}],'2026-07-10':[{n:98,h:'W93',a:'W94',t:'20:00',v:'Los Angeles',g:'—',s:'Quarter-final',uk:'BBC',stad:'Rose Bowl'}],'2026-07-11':[{n:99,h:'W91',a:'W92',t:'22:00',v:'Miami',g:'—',s:'Quarter-final',uk:'BBC',stad:'Hard Rock Stadium'}],'2026-07-12':[{n:100,h:'W95',a:'W96',t:'02:00',v:'Kansas City',g:'—',s:'Quarter-final',uk:'BBC',stad:'Arrowhead Stadium'}],'2026-07-14':[{n:101,h:'W97',a:'W98',t:'20:00',v:'Dallas',g:'—',s:'Semi-final',uk:'BBC',stad:'AT&T Stadium'}],'2026-07-15':[{n:102,h:'W99',a:'W100',t:'20:00',v:'Atlanta',g:'—',s:'Semi-final',uk:'BBC',stad:'Mercedes-Benz Stadium'}],'2026-07-18':[{n:103,h:'RU101',a:'RU102',t:'22:00',v:'Miami',g:'—',s:'Third Place Play-off',uk:'BBC',stad:'Hard Rock Stadium'}],'2026-07-19':[{n:104,h:'W101',a:'W102',t:'20:00',v:'New York/New Jersey',g:'—',s:'Final',uk:'BBC',stad:'MetLife Stadium'}]};

  function pad(n) { return String(n).padStart(2, '0'); }
  function bstToUtcIso(dateStr, timeStr) {
    var parts = String(timeStr || '00:00').split(':');
    var h = parseInt(parts[0], 10) || 0;
    var m = parseInt(parts[1], 10) || 0;
    var utc = new Date(dateStr + 'T00:00:00Z');
    utc.setUTCHours(h - 1, m, 0, 0); // June/July UK schedule is BST = UTC+1
    return utc.toISOString().replace('.000Z', 'Z');
  }
  function flattenSchedule() {
    var out = [];
    Object.keys(SCHEDULE).sort().forEach(function (date) {
      (SCHEDULE[date] || []).forEach(function (m) {
        out.push(Object.assign({}, m, {
          date: date,
          dt: bstToUtcIso(date, m.t),
          id: m.n,
          home: m.h,
          away: m.a,
          group: m.g,
          stage: m.s,
          venue: m.stad ? (m.stad + ', ' + m.v) : m.v,
          ukBroadcaster: m.uk
        }));
      });
    });
    return out;
  }

  window.WC26_SCHEDULE = SCHEDULE;
  window.WC26_MATCHES = flattenSchedule();
  if (window.WC26) {
    window.WC26.schedule = SCHEDULE;
    window.WC26.allMatches = window.WC26_MATCHES;
  }
}());
