/**
 * gc-datetime.js — GoalCurrent.live
 * Timezone-aware time formatting + regional broadcaster lookup
 * Version: 1.0
 *
 * USAGE:
 *   <script src="/js/gc-datetime.js"></script>
 *
 *   formatLocalKickoff("2026-06-11T19:00:00Z")
 *   → "20:00 BST"  (UK visitor)
 *   → "15:00 EDT"  (Toronto visitor)
 *   → "12:00 PDT"  (LA visitor)
 *
 *   formatKickoffFull("2026-06-11T19:00:00Z")
 *   → "15:00 EDT  ·  UK: 20:00 BST"  (Toronto visitor)
 *   → "20:00 BST"                      (UK visitor)
 *
 *   getBroadcasters()
 *   → { primary: "TSN / CTV", secondary: "UK: BBC / ITV" }  (Canada)
 *   → { primary: "BBC / ITV", secondary: null }              (UK)
 */

(function(global) {
  'use strict';

  // ── INTERNAL UTILITIES ────────────────────────────────────────────────────

  function pad(n) { return String(n).padStart(2, '0'); }

  /**
   * Format a UTC ISO date string to local time.
   * Returns "HH:MM TZ" e.g. "20:00 BST" or "15:00 EDT"
   */
  function formatLocalKickoff(utcIso) {
    var d = new Date(utcIso);
    if (isNaN(d.getTime())) return '—';

    // Get local time components
    var localHH  = pad(d.getHours());
    var localMM  = pad(d.getMinutes());

    // Get abbreviated timezone name
    var tzName = getLocalTZAbbr(d);

    return localHH + ':' + localMM + ' ' + tzName;
  }

  /**
   * Format a UTC ISO date string to UK time (BST/GMT).
   * Always shows UK time regardless of visitor location.
   */
  function formatUKKickoff(utcIso) {
    var d = new Date(utcIso);
    if (isNaN(d.getTime())) return '—';

    // UK time = UTC+1 in summer (BST), UTC+0 in winter (GMT)
    var ukOffset = isUKSummer(d) ? 1 : 0;
    var ukD = new Date(d.getTime() + ukOffset * 3600000);
    var ukTZ = ukOffset === 1 ? 'BST' : 'GMT';

    return pad(ukD.getUTCHours()) + ':' + pad(ukD.getUTCMinutes()) + ' ' + ukTZ;
  }

  /**
   * Full kickoff string:
   * - UK visitors: "20:00 BST"
   * - Others: "15:00 EDT  ·  UK: 20:00 BST"
   */
  function formatKickoffFull(utcIso) {
    var local = formatLocalKickoff(utcIso);
    var uk    = formatUKKickoff(utcIso);

    // If visitor is in UK timezone, just show UK time
    if (isVisitorInUK()) {
      return local; // same as UK time
    }
    return local + '  ·  UK: ' + uk;
  }

  /**
   * Kickoff label for match cards.
   * Compact: "15:00 EDT" with UK time tooltip.
   */
  function formatMatchCardTime(utcIso) {
    if (!utcIso) return '—';
    var local = formatLocalKickoff(utcIso);
    var isUK  = isVisitorInUK();
    if (isUK) return local;
    return local;
  }

  // ── TIMEZONE DETECTION ────────────────────────────────────────────────────

  function getVisitorTZ() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    } catch(e) {
      return 'UTC';
    }
  }

  function isVisitorInUK() {
    var tz = getVisitorTZ();
    return tz === 'Europe/London' || tz === 'Europe/Dublin';
  }

  function isUKSummer(date) {
    // UK BST: last Sunday March → last Sunday October
    var d = date || new Date();
    var jan = new Date(d.getFullYear(), 0, 1);
    var jul = new Date(d.getFullYear(), 6, 1);
    // If UK offset differs from UTC in summer months
    var janOffset = jan.getTimezoneOffset();
    var julOffset = jul.getTimezoneOffset();
    var stdOffset = Math.max(janOffset, julOffset);
    // Check if London is UTC+1 right now
    var londonFormatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      hour: 'numeric', hour12: false
    });
    var utcFormatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'UTC',
      hour: 'numeric', hour12: false
    });
    try {
      var londonH = parseInt(londonFormatter.format(d));
      var utcH    = parseInt(utcFormatter.format(d));
      return londonH !== utcH; // true if BST (UTC+1)
    } catch(e) {
      // Fallback: assume BST for June-September
      var m = d.getMonth();
      return m >= 2 && m <= 9;
    }
  }

  /**
   * Get abbreviated timezone name for a given date.
   * Uses Intl.DateTimeFormat with timeZoneName: 'short'
   * Returns "BST", "EDT", "PDT", "CST", "GST", etc.
   */
  function getLocalTZAbbr(date) {
    try {
      var parts = Intl.DateTimeFormat('en-US', {
        timeZoneName: 'short',
        hour: 'numeric'
      }).formatToParts(date);
      var tzPart = parts.find(function(p) { return p.type === 'timeZoneName'; });
      var raw = tzPart ? tzPart.value : '';

      /* Normalise generic offsets to readable abbreviations.
         Some browsers return "GMT+1" instead of "BST", etc.
         We map the common ones visitors will see. */
      var ABBR_MAP = {
        'GMT+1':  'BST',   /* UK summer */
        'GMT+2':  'CEST',  /* Central Europe summer */
        'GMT+3':  'MSK',   /* Moscow / Arabia */
        'GMT+4':  'GST',   /* Gulf */
        'GMT+5':  'PKT',   /* Pakistan */
        'GMT+5:30':'IST',  /* India */
        'GMT+5:45':'NPT',  /* Nepal */
        'GMT+6':  'BST',   /* Bangladesh (BST) */
        'GMT+7':  'WIB',   /* West Indonesia */
        'GMT+8':  'CST',   /* China */
        'GMT+9':  'JST',   /* Japan */
        'GMT+10': 'AEST',  /* Eastern Australia */
        'GMT+11': 'AEDT',  /* Eastern Australia DST */
        'GMT+12': 'NZST',  /* New Zealand */
        'GMT-3':  'BRT',   /* Brazil */
        'GMT-3:30':'NST',  /* Newfoundland */
        'GMT-4':  'EDT',   /* Eastern Daylight */
        'GMT-5':  'CDT',   /* Central Daylight / EST */
        'GMT-6':  'MDT',   /* Mountain Daylight / CST */
        'GMT-7':  'PDT',   /* Pacific Daylight / MST */
        'GMT-8':  'PST',   /* Pacific Standard */
        'GMT-9':  'AKDT',  /* Alaska */
        'GMT-10': 'HST',   /* Hawaii */
        'GMT+3:30':'IRST'  /* Iran */
      };

      return ABBR_MAP[raw] || raw;
    } catch(e) {
      return '';
    }
  }

  // ── COUNTRY/REGION DETECTION ──────────────────────────────────────────────

  // Timezone → country code mapping
  var TZ_COUNTRY = {
    // UK & Ireland
    'Europe/London':       'GB',
    'Europe/Dublin':       'GB',
    // Canada
    'America/Toronto':     'CA',
    'America/Vancouver':   'CA',
    'America/Edmonton':    'CA',
    'America/Calgary':     'CA',
    'America/Winnipeg':    'CA',
    'America/Halifax':     'CA',
    'America/St_Johns':    'CA',
    'America/Regina':      'CA',
    // USA
    'America/New_York':    'US',
    'America/Chicago':     'US',
    'America/Denver':      'US',
    'America/Los_Angeles': 'US',
    'America/Phoenix':     'US',
    'America/Anchorage':   'US',
    'Pacific/Honolulu':    'US',
    'America/Detroit':     'US',
    'America/Indiana/Indianapolis': 'US',
    // Mexico
    'America/Mexico_City': 'MX',
    'America/Tijuana':     'MX',
    'America/Monterrey':   'MX',
    'America/Cancun':      'MX',
    // Europe
    'Europe/Paris':        'FR',
    'Europe/Berlin':       'DE',
    'Europe/Madrid':       'ES',
    'Europe/Rome':         'IT',
    'Europe/Amsterdam':    'NL',
    'Europe/Brussels':     'BE',
    'Europe/Zurich':       'CH',
    'Europe/Vienna':       'AT',
    'Europe/Warsaw':       'PL',
    'Europe/Stockholm':    'SE',
    'Europe/Oslo':         'NO',
    'Europe/Copenhagen':   'DK',
    'Europe/Lisbon':       'PT',
    'Europe/Athens':       'GR',
    'Europe/Istanbul':     'TR',
    // Middle East
    'Asia/Dubai':          'AE',
    'Asia/Riyadh':         'SA',
    'Asia/Kuwait':         'KW',
    'Asia/Qatar':          'QA',
    'Asia/Bahrain':        'BH',
    'Asia/Tehran':         'IR',
    'Asia/Baghdad':        'IQ',
    'Asia/Beirut':         'LB',
    'Asia/Amman':          'JO',
    // Asia
    'Asia/Tehran':         'IR',
    'Asia/Kabul':          'AF',
    'Asia/Karachi':        'PK',
    'Asia/Kolkata':        'IN',
    'Asia/Dhaka':          'BD',
    'Asia/Bangkok':        'TH',
    'Asia/Singapore':      'SG',
    'Asia/Kuala_Lumpur':   'MY',
    'Asia/Jakarta':        'ID',
    'Asia/Tokyo':          'JP',
    'Asia/Seoul':          'KR',
    'Asia/Shanghai':       'CN',
    'Asia/Hong_Kong':      'HK',
    // Australia
    'Australia/Sydney':    'AU',
    'Australia/Melbourne': 'AU',
    'Australia/Brisbane':  'AU',
    'Australia/Perth':     'AU',
    'Australia/Adelaide':  'AU',
    // South America
    'America/Sao_Paulo':   'BR',
    'America/Buenos_Aires':'AR',
    'America/Bogota':      'CO',
    'America/Lima':        'PE',
    'America/Santiago':    'CL',
    // Africa
    'Africa/Cairo':        'EG',
    'Africa/Lagos':        'NG',
    'Africa/Johannesburg': 'ZA',
    'Africa/Nairobi':      'KE',
    'Africa/Casablanca':   'MA'
  };

  function getVisitorCountry() {
    var tz = getVisitorTZ();
    return TZ_COUNTRY[tz] || null;
  }

  // ── BROADCASTER LOOKUP ────────────────────────────────────────────────────

  /**
   * Broadcaster data for FIFA World Cup 2026.
   * Format: { primary, secondary (optional) }
   * primary: what to show prominently
   * secondary: UK time reference for non-UK visitors
   */
  var BROADCASTERS = {
    'GB': { primary: 'BBC / ITV',                    note: null },
    'US': { primary: 'Fox / FS1 / Telemundo / Peacock', note: 'UK: BBC/ITV' },
    'CA': { primary: 'TSN / CTV / RDS',              note: 'UK: BBC/ITV' },
    'MX': { primary: 'Televisa / TV Azteca / TUDN / ViX', note: 'UK: BBC/ITV' },
    'FR': { primary: 'TF1 / M6 / beIN Sports',       note: 'UK: BBC/ITV' },
    'DE': { primary: 'ARD / ZDF / MagentaTV',         note: 'UK: BBC/ITV' },
    'ES': { primary: 'RTVE / TVE1 / Cuatro',          note: 'UK: BBC/ITV' },
    'IT': { primary: 'RAI / Mediaset',                note: 'UK: BBC/ITV' },
    'NL': { primary: 'NOS / Ziggo Sport',             note: 'UK: BBC/ITV' },
    'PT': { primary: 'RTP / Sport TV',                note: 'UK: BBC/ITV' },
    'BE': { primary: 'RTBF / VTM / Sporza',           note: 'UK: BBC/ITV' },
    'AT': { primary: 'ORF',                           note: 'UK: BBC/ITV' },
    'CH': { primary: 'SRF / RTS',                     note: 'UK: BBC/ITV' },
    'SE': { primary: 'SVT / TV4',                     note: 'UK: BBC/ITV' },
    'NO': { primary: 'NRK / TV 2',                    note: 'UK: BBC/ITV' },
    'DK': { primary: 'DR / TV 2',                     note: 'UK: BBC/ITV' },
    'TR': { primary: 'TRT / beIN Sports',             note: 'UK: BBC/ITV' },
    'AE': { primary: 'beIN Sports',                   note: 'UK: BBC/ITV' },
    'SA': { primary: 'Saudi Sports / beIN Sports',    note: 'UK: BBC/ITV' },
    'QA': { primary: 'beIN Sports',                   note: 'UK: BBC/ITV' },
    'IR': { primary: 'IRIB / فوتبال',                 note: 'UK: BBC/ITV' },
    'IQ': { primary: 'Al-Iraqiya / beIN Sports',      note: 'UK: BBC/ITV' },
    'KW': { primary: 'Kuwait TV / beIN Sports',       note: 'UK: BBC/ITV' },
    'BH': { primary: 'BTV / beIN Sports',             note: 'UK: BBC/ITV' },
    'JO': { primary: 'JRTV / beIN Sports',            note: 'UK: BBC/ITV' },
    'LB': { primary: 'LBCI / beIN Sports',            note: 'UK: BBC/ITV' },
    'EG': { primary: 'ERT / beIN Sports',             note: 'UK: BBC/ITV' },
    'MA': { primary: 'SNRT / beIN Sports',            note: 'UK: BBC/ITV' },
    'NG': { primary: 'NTA / SuperSport',              note: 'UK: BBC/ITV' },
    'ZA': { primary: 'SABC / SuperSport',             note: 'UK: BBC/ITV' },
    'BR': { primary: 'Globo / SporTV / CazéTV',       note: 'UK: BBC/ITV' },
    'AR': { primary: 'TyC Sports / Canal 7 / TV Pública', note: 'UK: BBC/ITV' },
    'CO': { primary: 'Caracol / RCN / Win Sports',    note: 'UK: BBC/ITV' },
    'AU': { primary: 'SBS / Optus Sport',             note: 'UK: BBC/ITV' },
    'JP': { primary: 'NHK / Fuji TV / ABEMA',         note: 'UK: BBC/ITV' },
    'KR': { primary: 'KBS / MBC / SBS',               note: 'UK: BBC/ITV' },
    'CN': { primary: 'CCTV5 / iQIYI',                 note: 'UK: BBC/ITV' },
    'IN': { primary: 'JioTV / Sports18 / Doordarshan', note: 'UK: BBC/ITV' },
    'SG': { primary: 'Mediacorp / Hub Premier',       note: 'UK: BBC/ITV' }
  };

  /**
   * Get broadcaster info for visitor's country.
   * Returns { primary, note } or fallback.
   */
  function getBroadcasters(overrideCountry) {
    var country = overrideCountry || getVisitorCountry() || 'GB';
    var info = BROADCASTERS[country];
    if (!info) {
      return {
        primary: 'Check local broadcaster',
        note: 'UK: BBC / ITV'
      };
    }
    return info;
  }

  /**
   * Build the TV display string for a match card.
   * Returns HTML string.
   */
  function buildTVDisplay(overrideCountry) {
    var info = getBroadcasters(overrideCountry);
    if (!info || !info.primary) return '';
    return '📺 ' + info.primary;
  }

  // ── DATE DISPLAY UTILITIES ────────────────────────────────────────────────

  var DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun',
                'Jul','Aug','Sep','Oct','Nov','Dec'];

  /**
   * Format date portion: "Thu 11 Jun"
   * Uses local timezone of visitor.
   */
  function formatLocalDate(utcIso) {
    var d = new Date(utcIso);
    if (isNaN(d.getTime())) return '—';
    return DAYS[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()];
  }

  /**
   * Format: "Thu 11 Jun · 15:00 EDT"
   */
  function formatLocalDateTime(utcIso) {
    return formatLocalDate(utcIso) + ' · ' + formatLocalKickoff(utcIso);
  }

  /**
   * Return today's date string in visitor's LOCAL timezone: "YYYY-MM-DD"
   * Used for filtering "today's matches" correctly per visitor location.
   */
  function todayLocal() {
    var d = new Date();
    return d.getFullYear() + '-'
      + String(d.getMonth() + 1).padStart(2, '0') + '-'
      + String(d.getDate()).padStart(2, '0');
  }

  /**
   * Return date N days from now in visitor's LOCAL timezone: "YYYY-MM-DD"
   */
  function localDatePlusN(n) {
    var d = new Date();
    d.setDate(d.getDate() + n);
    return d.getFullYear() + '-'
      + String(d.getMonth() + 1).padStart(2, '0') + '-'
      + String(d.getDate()).padStart(2, '0');
  }

  /**
   * Convert any UTC ISO string to local "YYYY-MM-DD"
   * Used to check if a match falls on a particular local date.
   */
  function utcToLocalDate(utcIso) {
    var d = new Date(utcIso);
    if (isNaN(d.getTime())) return '';
    return d.getFullYear() + '-'
      + String(d.getMonth() + 1).padStart(2, '0') + '-'
      + String(d.getDate()).padStart(2, '0');
  }

  // ── REGION SELECTOR ───────────────────────────────────────────────────────

  var _userCountryOverride = null;

  function setRegion(countryCode) {
    _userCountryOverride = countryCode;
    try {
      localStorage.setItem('gc_region', countryCode);
    } catch(e) {}
    // Dispatch event so pages can re-render
    try {
      document.dispatchEvent(new CustomEvent('gc:regionChanged', {
        detail: { country: countryCode }
      }));
    } catch(e) {}
  }

  function getRegion() {
    if (_userCountryOverride) return _userCountryOverride;
    try {
      var saved = localStorage.getItem('gc_region');
      if (saved) return saved;
    } catch(e) {}
    return getVisitorCountry();
  }

  // ── PUBLIC API ────────────────────────────────────────────────────────────

  var GC_DateTime = {
    // Time formatting
    formatLocalKickoff:  formatLocalKickoff,
    formatUKKickoff:     formatUKKickoff,
    formatKickoffFull:   formatKickoffFull,
    formatMatchCardTime: formatMatchCardTime,
    formatLocalDate:     formatLocalDate,
    formatLocalDateTime: formatLocalDateTime,

    // Timezone/country
    getVisitorTZ:      getVisitorTZ,
    getVisitorCountry: getVisitorCountry,
    isVisitorInUK:     isVisitorInUK,

    // Broadcasters
    getBroadcasters: getBroadcasters,
    buildTVDisplay:  buildTVDisplay,

    // Region override
    setRegion: setRegion,
    getRegion: getRegion,

    // Date helpers
    todayLocal:      todayLocal,
    localDatePlusN:  localDatePlusN,
    utcToLocalDate:  utcToLocalDate,

    // Internal data (for testing)
    _TZ_COUNTRY:   TZ_COUNTRY,
    _BROADCASTERS: BROADCASTERS
  };

  global.GC_DateTime = GC_DateTime;

})(window);
