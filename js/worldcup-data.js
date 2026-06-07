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
    'South Korea':         'kr',
    'Czech Republic':      'cz',
    'Canada':              'ca',
    'Bosnia & Herzegovina':'ba',
    'Qatar':               'qa',
    'Switzerland':         'ch',
    'Brazil':              'br',
    'Morocco':             'ma',
    'Haiti':               'ht',
    'Scotland':            'gb-sct',
    'United States':       'us',
    'Paraguay':            'py',
    'Australia':           'au',
    'Turkey':              'tr',
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
    'Iran':                'ir',
    'New Zealand':         'nz',
    'Spain':               'es',
    'Cape Verde':          'cv',
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
    'DR Congo':            'cd',
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
    A: ['Mexico', 'South Africa', 'South Korea', 'Czech Republic'],
    B: ['Canada', 'Bosnia & Herzegovina', 'Qatar', 'Switzerland'],
    C: ['Brazil', 'Morocco', 'Haiti', 'Scotland'],
    D: ['United States', 'Paraguay', 'Australia', 'Turkey'],
    E: ['Germany', 'Curaçao', "Côte d'Ivoire", 'Ecuador'],
    F: ['Netherlands', 'Japan', 'Sweden', 'Tunisia'],
    G: ['Belgium', 'Egypt', 'Iran', 'New Zealand'],
    H: ['Spain', 'Cape Verde', 'Saudi Arabia', 'Uruguay'],
    I: ['France', 'Senegal', 'Iraq', 'Norway'],
    J: ['Argentina', 'Algeria', 'Austria', 'Jordan'],
    K: ['Portugal', 'DR Congo', 'Uzbekistan', 'Colombia'],
    L: ['England', 'Croatia', 'Ghana', 'Panama']
  };

  /* ─────────────────────────────────────────────
     FIXTURES — all 72 group stage matches
     Times: BST (Europe/London)
     Source: FIFA.com / BBC Sport official schedule
     Format: { id, group, home, away, date, bst, venue, ukBroadcaster }
  ───────────────────────────────────────────── */
  var FIXTURES = [
    /* ── GROUP A ── */
    {id:1,  group:'A', home:'Mexico',        away:'South Africa',   date:'2026-06-11', bst:'20:00', venue:'Estadio Azteca, Mexico City',    ukBroadcaster:'ITV'},
    {id:2,  group:'A', home:'South Korea',   away:'Czech Republic', date:'2026-06-11', bst:'23:00', venue:'Estadio Akron, Guadalajara',      ukBroadcaster:'BBC'},
    {id:3,  group:'A', home:'Czech Republic',away:'South Africa',   date:'2026-06-18', bst:'17:00', venue:'Mercedes-Benz Stadium, Atlanta',  ukBroadcaster:'ITV'},
    {id:4,  group:'A', home:'Mexico',        away:'South Korea',    date:'2026-06-18', bst:'23:00', venue:'Estadio Akron, Guadalajara',      ukBroadcaster:'BBC'},
    {id:5,  group:'A', home:'Czech Republic',away:'Mexico',         date:'2026-06-24', bst:'23:00', venue:'Estadio Azteca, Mexico City',    ukBroadcaster:'BBC'},
    {id:6,  group:'A', home:'South Africa',  away:'South Korea',    date:'2026-06-24', bst:'23:00', venue:'Estadio BBVA, Monterrey',         ukBroadcaster:'ITV'},

    /* ── GROUP B ── */
    {id:7,  group:'B', home:'Canada',              away:'Bosnia & Herzegovina', date:'2026-06-12', bst:'20:00', venue:'BMO Field, Toronto',             ukBroadcaster:'BBC'},
    {id:8,  group:'B', home:'Qatar',               away:'Switzerland',          date:'2026-06-13', bst:'20:00', venue:'Levi\'s Stadium, Santa Clara',   ukBroadcaster:'ITV'},
    {id:9,  group:'B', home:'Canada',              away:'Qatar',                date:'2026-06-18', bst:'23:00', venue:'BC Place, Vancouver',            ukBroadcaster:'ITV'},
    {id:10, group:'B', home:'Switzerland',         away:'Bosnia & Herzegovina', date:'2026-06-18', bst:'20:00', venue:'SoFi Stadium, Inglewood',        ukBroadcaster:'BBC'},
    {id:11, group:'B', home:'Canada',              away:'Switzerland',          date:'2026-06-24', bst:'20:00', venue:'BC Place, Vancouver',            ukBroadcaster:'BBC'},
    {id:12, group:'B', home:'Bosnia & Herzegovina',away:'Qatar',               date:'2026-06-24', bst:'20:00', venue:'Arrowhead Stadium, Kansas City',  ukBroadcaster:'ITV'},

    /* ── GROUP C ── */
    {id:13, group:'C', home:'Brazil',  away:'Morocco',  date:'2026-06-13', bst:'23:00', venue:'MetLife Stadium, East Rutherford', ukBroadcaster:'ITV'},
    {id:14, group:'C', home:'Haiti',   away:'Scotland', date:'2026-06-14', bst:'02:00', venue:'Gillette Stadium, Foxborough',     ukBroadcaster:'BBC'},
    {id:15, group:'C', home:'Brazil',  away:'Scotland', date:'2026-06-19', bst:'20:00', venue:'TBC',                             ukBroadcaster:'BBC'},
    {id:16, group:'C', home:'Morocco', away:'Haiti',    date:'2026-06-19', bst:'20:00', venue:'TBC',                             ukBroadcaster:'ITV'},
    {id:17, group:'C', home:'Brazil',  away:'Haiti',    date:'2026-06-25', bst:'20:00', venue:'TBC',                             ukBroadcaster:'ITV'},
    {id:18, group:'C', home:'Morocco', away:'Scotland', date:'2026-06-25', bst:'20:00', venue:'TBC',                             ukBroadcaster:'BBC'},

    /* ── GROUP D ── */
    {id:19, group:'D', home:'United States', away:'Paraguay',   date:'2026-06-12', bst:'21:00', venue:'SoFi Stadium, Inglewood',  ukBroadcaster:'BBC'},
    {id:20, group:'D', home:'Australia',     away:'Turkey',     date:'2026-06-13', bst:'02:00', venue:'BC Place, Vancouver',      ukBroadcaster:'ITV'},
    {id:21, group:'D', home:'United States', away:'Australia',  date:'2026-06-19', bst:'20:00', venue:'TBC',                     ukBroadcaster:'ITV'},
    {id:22, group:'D', home:'Paraguay',      away:'Turkey',     date:'2026-06-19', bst:'20:00', venue:'TBC',                     ukBroadcaster:'BBC'},
    {id:23, group:'D', home:'United States', away:'Turkey',     date:'2026-06-25', bst:'20:00', venue:'TBC',                     ukBroadcaster:'BBC'},
    {id:24, group:'D', home:'Australia',     away:'Paraguay',   date:'2026-06-25', bst:'20:00', venue:'TBC',                     ukBroadcaster:'ITV'},

    /* ── GROUP E ── */
    {id:25, group:'E', home:'Germany',       away:'Curaçao',       date:'2026-06-14', bst:'20:00', venue:'TBC', ukBroadcaster:'BBC'},
    {id:26, group:'E', home:"Côte d'Ivoire", away:'Ecuador',       date:'2026-06-14', bst:'20:00', venue:'TBC', ukBroadcaster:'ITV'},
    {id:27, group:'E', home:'Germany',       away:"Côte d'Ivoire", date:'2026-06-20', bst:'20:00', venue:'TBC', ukBroadcaster:'ITV'},
    {id:28, group:'E', home:'Ecuador',       away:'Curaçao',       date:'2026-06-20', bst:'20:00', venue:'TBC', ukBroadcaster:'BBC'},
    {id:29, group:'E', home:'Germany',       away:'Ecuador',       date:'2026-06-26', bst:'20:00', venue:'TBC', ukBroadcaster:'BBC'},
    {id:30, group:'E', home:"Côte d'Ivoire", away:'Curaçao',       date:'2026-06-26', bst:'20:00', venue:'TBC', ukBroadcaster:'ITV'},

    /* ── GROUP F ── */
    {id:31, group:'F', home:'Netherlands', away:'Japan',   date:'2026-06-14', bst:'23:00', venue:'TBC', ukBroadcaster:'ITV'},
    {id:32, group:'F', home:'Sweden',      away:'Tunisia', date:'2026-06-15', bst:'02:00', venue:'TBC', ukBroadcaster:'BBC'},
    {id:33, group:'F', home:'Netherlands', away:'Sweden',  date:'2026-06-20', bst:'23:00', venue:'TBC', ukBroadcaster:'BBC'},
    {id:34, group:'F', home:'Japan',       away:'Tunisia', date:'2026-06-21', bst:'02:00', venue:'TBC', ukBroadcaster:'ITV'},
    {id:35, group:'F', home:'Netherlands', away:'Tunisia', date:'2026-06-26', bst:'23:00', venue:'TBC', ukBroadcaster:'ITV'},
    {id:36, group:'F', home:'Japan',       away:'Sweden',  date:'2026-06-26', bst:'23:00', venue:'TBC', ukBroadcaster:'BBC'},

    /* ── GROUP G ── */
    {id:37, group:'G', home:'Belgium',     away:'Egypt',       date:'2026-06-15', bst:'20:00', venue:'TBC', ukBroadcaster:'BBC'},
    {id:38, group:'G', home:'Iran',        away:'New Zealand', date:'2026-06-15', bst:'23:00', venue:'TBC', ukBroadcaster:'ITV'},
    {id:39, group:'G', home:'Belgium',     away:'Iran',        date:'2026-06-21', bst:'20:00', venue:'TBC', ukBroadcaster:'ITV'},
    {id:40, group:'G', home:'Egypt',       away:'New Zealand', date:'2026-06-21', bst:'23:00', venue:'TBC', ukBroadcaster:'BBC'},
    {id:41, group:'G', home:'Belgium',     away:'New Zealand', date:'2026-06-27', bst:'20:00', venue:'TBC', ukBroadcaster:'BBC'},
    {id:42, group:'G', home:'Egypt',       away:'Iran',        date:'2026-06-27', bst:'20:00', venue:'TBC', ukBroadcaster:'ITV'},

    /* ── GROUP H ── */
    {id:43, group:'H', home:'Spain',        away:'Cape Verde',   date:'2026-06-15', bst:'17:00', venue:'TBC', ukBroadcaster:'BBC'},
    {id:44, group:'H', home:'Saudi Arabia', away:'Uruguay',      date:'2026-06-16', bst:'02:00', venue:'TBC', ukBroadcaster:'ITV'},
    {id:45, group:'H', home:'Spain',        away:'Saudi Arabia', date:'2026-06-21', bst:'17:00', venue:'TBC', ukBroadcaster:'ITV'},
    {id:46, group:'H', home:'Cape Verde',   away:'Uruguay',      date:'2026-06-21', bst:'20:00', venue:'TBC', ukBroadcaster:'BBC'},
    {id:47, group:'H', home:'Spain',        away:'Uruguay',      date:'2026-06-26', bst:'20:00', venue:'TBC', ukBroadcaster:'BBC'},
    {id:48, group:'H', home:'Cape Verde',   away:'Saudi Arabia', date:'2026-06-26', bst:'20:00', venue:'TBC', ukBroadcaster:'ITV'},

    /* ── GROUP I ── */
    {id:49, group:'I', home:'France',  away:'Senegal', date:'2026-06-16', bst:'20:00', venue:'TBC',                         ukBroadcaster:'BBC'},
    {id:50, group:'I', home:'Iraq',    away:'Norway',  date:'2026-06-16', bst:'23:00', venue:'Gillette Stadium, Foxborough', ukBroadcaster:'ITV'},
    {id:51, group:'I', home:'France',  away:'Iraq',    date:'2026-06-22', bst:'20:00', venue:'TBC',                         ukBroadcaster:'ITV'},
    {id:52, group:'I', home:'Senegal', away:'Norway',  date:'2026-06-22', bst:'20:00', venue:'TBC',                         ukBroadcaster:'BBC'},
    {id:53, group:'I', home:'France',  away:'Norway',  date:'2026-06-27', bst:'20:00', venue:'TBC',                         ukBroadcaster:'BBC'},
    {id:54, group:'I', home:'Senegal', away:'Iraq',    date:'2026-06-27', bst:'20:00', venue:'TBC',                         ukBroadcaster:'ITV'},

    /* ── GROUP J ── */
    {id:55, group:'J', home:'Argentina', away:'Algeria',  date:'2026-06-17', bst:'02:00', venue:'Arrowhead Stadium, Kansas City', ukBroadcaster:'BBC'},
    {id:56, group:'J', home:'Austria',   away:'Jordan',   date:'2026-06-17', bst:'05:00', venue:'Levi\'s Stadium, Santa Clara',  ukBroadcaster:'ITV'},
    {id:57, group:'J', home:'Argentina', away:'Austria',  date:'2026-06-22', bst:'20:00', venue:'TBC',                           ukBroadcaster:'ITV'},
    {id:58, group:'J', home:'Algeria',   away:'Jordan',   date:'2026-06-22', bst:'20:00', venue:'TBC',                           ukBroadcaster:'BBC'},
    {id:59, group:'J', home:'Argentina', away:'Jordan',   date:'2026-06-27', bst:'20:00', venue:'TBC',                           ukBroadcaster:'BBC'},
    {id:60, group:'J', home:'Algeria',   away:'Austria',  date:'2026-06-27', bst:'20:00', venue:'TBC',                           ukBroadcaster:'ITV'},

    /* ── GROUP K ── */
    {id:61, group:'K', home:'Portugal',   away:'DR Congo',   date:'2026-06-15', bst:'20:00', venue:'NRG Stadium, Houston',     ukBroadcaster:'BBC'},
    {id:62, group:'K', home:'Uzbekistan', away:'Colombia',   date:'2026-06-16', bst:'02:00', venue:'Estadio Azteca, Mexico City', ukBroadcaster:'ITV'},
    {id:63, group:'K', home:'Portugal',   away:'Colombia',   date:'2026-06-21', bst:'20:00', venue:'TBC',                      ukBroadcaster:'ITV'},
    {id:64, group:'K', home:'Uzbekistan', away:'DR Congo',   date:'2026-06-21', bst:'20:00', venue:'TBC',                      ukBroadcaster:'BBC'},
    {id:65, group:'K', home:'Portugal',   away:'Uzbekistan', date:'2026-06-27', bst:'20:00', venue:'TBC',                      ukBroadcaster:'BBC'},
    {id:66, group:'K', home:'DR Congo',   away:'Colombia',   date:'2026-06-27', bst:'20:00', venue:'TBC',                      ukBroadcaster:'ITV'},

    /* ── GROUP L ── */
    {id:67, group:'L', home:'England', away:'Croatia', date:'2026-06-17', bst:'20:00', venue:'AT&T Stadium, Dallas',  ukBroadcaster:'ITV'},
    {id:68, group:'L', home:'Ghana',   away:'Panama',  date:'2026-06-17', bst:'23:00', venue:'BMO Field, Toronto',    ukBroadcaster:'BBC'},
    {id:69, group:'L', home:'England', away:'Ghana',   date:'2026-06-22', bst:'20:00', venue:'TBC',                   ukBroadcaster:'BBC'},
    {id:70, group:'L', home:'Croatia', away:'Panama',  date:'2026-06-22', bst:'20:00', venue:'TBC',                   ukBroadcaster:'ITV'},
    {id:71, group:'L', home:'England', away:'Panama',  date:'2026-06-28', bst:'20:00', venue:'TBC',                   ukBroadcaster:'ITV'},
    {id:72, group:'L', home:'Croatia', away:'Ghana',   date:'2026-06-28', bst:'20:00', venue:'TBC',                   ukBroadcaster:'BBC'}
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
