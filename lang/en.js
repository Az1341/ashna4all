/**
 * GoalCurrent.live — Language File
 * Language : English (default)
 * Code     : en
 * Direction: ltr
 * Version  : 1.0
 *
 * STRUCTURE RULES:
 * - Keys never change. Only values are translated per language.
 * - All new pages and competitions read from these same keys.
 * - If a key is missing in another language file, English is used as fallback.
 */

window.GC_LANG = {

  meta: {
    code : 'en',
    name : 'English',   // Always native name — never translated
    dir  : 'ltr',
    flag : '🇬🇧',
    locale: 'en_GB'     // Used for og:locale meta tag
  },

  // ── NAVIGATION ────────────────────────────────────────────────────────────
  nav: {
    home           : 'Home',
    liveScores     : 'Live Scores',
    todayFixtures  : 'Today Fixtures',
    latestNews     : 'Latest News',
    fixtures       : 'Fixtures',
    standings      : 'Standings',
    teams          : 'Teams',
    news           : 'News',
    results        : 'Results',
    overview       : 'Overview',
    groups         : 'Groups',
    bracket        : 'Bracket',
    venues         : 'Venues',
    table          : 'Table',
    myTeams        : 'My Teams',
    mainMenu       : 'Main Menu',
    competitions   : 'Competitions',
    worldCup       : 'World Cup 2026',
    premierLeague  : 'Premier League',
    championsLeague: 'Champions League',
    countdown      : 'Countdown'
  },

  // ── LIVE SCORES ───────────────────────────────────────────────────────────
  live: {
    liveNow       : 'Live Now',
    finishedToday : 'Finished Today',
    upcoming      : 'Upcoming',
    noMatches     : 'No matches today',
    loading       : 'Loading scores…',
    failed        : 'Failed to load',
    halfTime      : 'HT',
    halfTimeFull  : 'Half Time',
    fullTime      : 'FT',
    fullTimeFull  : 'Full Time',
    extraTime     : 'ET',
    penaltyShootout: 'Pens',
    matchStats    : 'Match Stats',
    awaitingScore : 'Awaiting Score',
    postponed     : 'Postponed',
    cancelled     : 'Cancelled',
    abandoned     : 'Abandoned',
    tbd           : 'TBD',
    kickOff       : 'Kick-off',
    minute        : 'min'
  },

  // ── FIXTURES ──────────────────────────────────────────────────────────────
  fixtures: {
    groupStage   : 'Group Stage',
    roundOf16    : 'Round of 16',
    quarterFinal : 'Quarter-Final',
    semiFinal    : 'Semi-Final',
    thirdPlace   : 'Third Place',
    final        : 'Final',
    kickOff      : 'Kick-off',
    venue        : 'Venue',
    broadcaster  : 'Watch on',
    noFixtures   : 'No fixtures available',
    allFixtures  : 'View all 104 fixtures',
    filter       : 'Filter',
    allGroups    : 'All Groups'
  },

  // ── STANDINGS ─────────────────────────────────────────────────────────────
  standings: {
    pos         : 'Pos',
    team        : 'Team',
    played      : 'P',
    won         : 'W',
    drawn       : 'D',
    lost        : 'L',
    goalsFor    : 'GF',
    goalsAgainst: 'GA',
    goalDiff    : 'GD',
    points      : 'Pts',
    form        : 'Form',
    qualified   : 'Qualified',
    eliminated  : 'Eliminated',
    title       : 'Standings',
    groupTitle  : 'Group'
  },

  // ── COUNTDOWN ─────────────────────────────────────────────────────────────
  countdown: {
    days          : 'Days',
    hours         : 'Hours',
    minutes       : 'Minutes',
    seconds       : 'Seconds',
    untilKickoff  : 'Until World Cup 2026',
    tournamentLive: 'Tournament is Live!',
    nextMatch     : 'Next match in',
    opens         : 'Opens',
    hosts         : 'Hosts',
    teams         : 'Teams',
    matches       : 'Matches',
    venues        : 'Venues',
    daysLeft      : 'Days Left'
  },

  // ── BUTTONS ───────────────────────────────────────────────────────────────
  buttons: {
    viewMatch      : 'View Match',
    predict        : 'Predict Score',
    addFavourite   : 'Add to Favourites',
    removeFavourite: 'Remove',
    readMore       : 'Read More',
    subscribe      : 'Subscribe',
    accept         : 'Accept',
    reject         : 'Reject',
    close          : 'Close ✕',
    viewAll        : 'View All',
    backToTop      : 'Back to Top',
    share          : 'Share',
    copyLink       : 'Copy Link',
    wcHub          : 'WC2026 Hub →'
  },

  // ── NEWS ──────────────────────────────────────────────────────────────────
  news: {
    breaking   : 'Breaking',
    latest     : 'Latest News',
    by         : 'By GoalCurrent',
    noNews     : 'No news available',
    loadMore   : 'Load More',
    published  : 'Published',
    updated    : 'Updated',
    relatedNews: 'Related News'
  },

  // ── COOKIE BANNER ────────────────────────────────────────────────────────
  cookie: {
    message  : 'We use cookies to personalise content and analyse traffic.',
    learnMore: 'Cookie Policy',
    accept   : 'Accept ✓',
    reject   : 'Decline'
  },

  // ── SUBSCRIBE POPUP ──────────────────────────────────────────────────────
  subscribe: {
    title      : '⚽ Stay Ahead of the Game',
    subtitle   : 'Get World Cup 2026 goals, results & news straight to your inbox. No spam, ever.',
    placeholder: 'Enter your email',
    button     : 'Subscribe Free ✉️',
    noThanks   : '✕',
    footer     : 'Unsubscribe any time · Powered by Brevo'
  },

  // ── MY TEAMS / FAVOURITES ─────────────────────────────────────────────────
  favourites: {
    myTeams      : 'My Teams',
    addTeam      : 'Add Team',
    removeTeam   : 'Remove',
    noFavourites : 'No favourite teams yet',
    tapToAdd     : 'Tap ★ on any team to add',
    yourFavourites: 'Your Favourites'
  },

  // ── VENUES ───────────────────────────────────────────────────────────────
  venues: {
    capacity : 'Capacity',
    city     : 'City',
    country  : 'Host Country',
    stadium  : 'Stadium',
    surface  : 'Surface',
    opened   : 'Opened',
    grass    : 'Natural Grass',
    turf     : 'Artificial Turf'
  },

  // ── TEAMS ─────────────────────────────────────────────────────────────────
  teams: {
    squad      : 'Squad',
    coach      : 'Coach',
    group      : 'Group',
    ranking    : 'FIFA Ranking',
    titles     : 'World Cup Titles',
    allTeams   : 'All Teams',
    searchTeam : 'Search team…'
  },

  // ── BRACKET ──────────────────────────────────────────────────────────────
  bracket: {
    winner    : 'Winner',
    tbd       : 'TBD',
    groupWinner: 'Group Winner',
    runnerUp  : 'Runner-Up',
    title     : 'Knockout Bracket'
  },

  // ── ERRORS / LOADING ─────────────────────────────────────────────────────
  errors: {
    loading  : 'Loading…',
    failed   : 'Failed to load data.',
    noData   : 'No data available.',
    tryAgain : 'Please try again.',
    offline  : 'You appear to be offline.',
    apiError : 'Data temporarily unavailable.'
  },

  // ── LANGUAGE SELECTOR ─────────────────────────────────────────────────────
  langSelector: {
    label    : 'Language',
    ariaLabel: 'Select language'
  },

  // ── SEO — Per-page titles and descriptions ───────────────────────────────
  // pageKey must match the data-gc-page attribute set on <html> element

  // ── HOMEPAGE SPECIFIC ─────────────────────────────────────────────────────
  gc: {
    headerSub         : 'Live Scores · World Cup 2026 · News',
    liveMatchCentre   : 'Live Match Centre',
    upcomingMatches   : 'UPCOMING MATCHES — WORLD CUP 2026',
    openingCeremonies : 'World Cup 2026 Opening Ceremonies'
  },

  seo: {
    pages: {
      home: {
        title: 'GoalCurrent.live — FIFA World Cup 2026 | Live Scores, News & Teams',
        desc : 'GoalCurrent.live — your home for FIFA World Cup 2026 live scores, fixtures, groups, teams, standings and countdown.'
      },
      live: {
        title: 'Live Scores | World Cup 2026 | GoalCurrent.live',
        desc : 'World Cup 2026 live scores updated in real time. Goals, match events and results from every game.'
      },
      wc26Overview: {
        title: 'World Cup 2026 Overview | GoalCurrent.live',
        desc : 'Everything you need for FIFA World Cup 2026 — groups, fixtures, teams, standings and more.'
      },
      wc26Fixtures: {
        title: 'World Cup 2026 Fixtures | Full Schedule | GoalCurrent.live',
        desc : 'Full FIFA World Cup 2026 fixture schedule. All 104 matches with dates, times and venues.'
      },
      wc26Groups: {
        title: 'World Cup 2026 Groups | GoalCurrent.live',
        desc : 'All 12 groups for FIFA World Cup 2026. Group tables, fixtures and qualified teams.'
      },
      wc26Standings: {
        title: 'World Cup 2026 Standings | GoalCurrent.live',
        desc : 'FIFA World Cup 2026 group standings and league tables updated live.'
      },
      wc26Bracket: {
        title: 'World Cup 2026 Knockout Bracket | GoalCurrent.live',
        desc : 'FIFA World Cup 2026 knockout bracket from Round of 16 to the Final.'
      },
      wc26Venues: {
        title: 'World Cup 2026 Venues & Stadiums | GoalCurrent.live',
        desc : 'All 16 FIFA World Cup 2026 venues and host stadiums across USA, Canada and Mexico.'
      },
      wc26Teams: {
        title: 'World Cup 2026 Teams | GoalCurrent.live',
        desc : 'All 48 teams at FIFA World Cup 2026. Squads, groups and team information.'
      },
      wc26News: {
        title: 'World Cup 2026 News | GoalCurrent.live',
        desc : 'Latest FIFA World Cup 2026 news, match reports and team updates.'
      },
      plOverview: {
        title: 'Premier League 2025/26 | GoalCurrent.live',
        desc : 'Premier League 2025/26 season overview — table, fixtures, results and news.'
      },
      plTable: {
        title: 'Premier League Table 2025/26 | GoalCurrent.live',
        desc : 'Premier League 2025/26 final league table with all 20 clubs.'
      },
      plFixtures: {
        title: 'Premier League Fixtures | GoalCurrent.live',
        desc : 'Premier League 2025/26 fixtures and match schedule.'
      },
      plResults: {
        title: 'Premier League Results | GoalCurrent.live',
        desc : 'Premier League 2025/26 match results and scores.'
      },
      plNews: {
        title: 'Premier League News | GoalCurrent.live',
        desc : 'Latest Premier League news, transfers and match reports.'
      },
      plTeams: {
        title: 'Premier League Teams | GoalCurrent.live',
        desc : 'All 20 Premier League clubs for the 2025/26 season.'
      },
      uclOverview: {
        title: 'Champions League | GoalCurrent.live',
        desc : 'UEFA Champions League fixtures, results, teams and news.'
      },
      uclFixtures: {
        title: 'Champions League Fixtures | GoalCurrent.live',
        desc : 'UEFA Champions League match schedule and fixture list.'
      },
      uclResults: {
        title: 'Champions League Results | GoalCurrent.live',
        desc : 'UEFA Champions League match results and scores.'
      },
      uclTeams: {
        title: 'Champions League Teams | GoalCurrent.live',
        desc : 'UEFA Champions League participating clubs.'
      },
      uclNews: {
        title: 'Champions League News | GoalCurrent.live',
        desc : 'Latest UEFA Champions League news and match reports.'
      },
      news: {
        title: 'Football News | GoalCurrent.live',
        desc : 'Latest football news covering World Cup 2026, Premier League and Champions League.'
      },
      countdown: {
        title: 'World Cup 2026 Countdown | GoalCurrent.live',
        desc : 'Countdown to FIFA World Cup 2026 — USA, Canada & Mexico, 11 June 2026.'
      },
      privacy: {
        title: 'Privacy Policy | GoalCurrent.live',
        desc : 'Privacy Policy for GoalCurrent.live.'
      },
      terms: {
        title: 'Terms & Conditions | GoalCurrent.live',
        desc : 'Terms and Conditions for GoalCurrent.live.'
      },
      cookies: {
        title: 'Cookie Policy | GoalCurrent.live',
        desc : 'Cookie Policy for GoalCurrent.live.'
      },
      about: {
        title: 'About | GoalCurrent.live',
        desc : 'About GoalCurrent.live — independent football fan website.'
      },
      contact: {
        title: 'Contact | GoalCurrent.live',
        desc : 'Contact GoalCurrent.live.'
      }
    }
  }

}; // end window.GC_LANG
