/* ============================================================
   GOALCURRENT.LIVE — World Cup 2026 Official Data
   Source: FIFA.com (verified June 2026)
   48 teams · 12 groups · Groups A–L
   ============================================================ */

var WC26 = {

  meta: {
    name: 'FIFA World Cup 2026',
    hosts: ['USA','Mexico','Canada'],
    teams: 48,
    groups: 12,
    matches: 104,
    venues: 16,
    start: '2026-06-11',
    final: '2026-07-19',
    finalVenue: 'MetLife Stadium, New Jersey'
  },

  /* ── ALL 48 TEAMS — alphabetical with FIFA data ── */
  teams: [
    {name:'Algeria', code:'ALG', flag:'🇩🇿', conf:'CAF',      group:'J', rank:28,  participations:4},
    {name:'Argentina',           flag:'🇦🇷', conf:'CONMEBOL', group:'J', rank:3,   participations:18},
    {name:'Australia',           flag:'🇦🇺', conf:'AFC',      group:'D', rank:27,  participations:6},
    {name:'Austria', code:'AUT', flag:'🇦🇹', conf:'UEFA',     group:'J', rank:24,  participations:7},
    {name:'Belgium', code:'BEL', flag:'🇧🇪', conf:'UEFA',     group:'G', rank:9,   participations:13},
    {name:'Bosnia & Herzegovina',flag:'🇧🇦', conf:'UEFA',     group:'B', rank:65,  participations:1},
    {name:'Brazil', code:'BRA', flag:'🇧🇷', conf:'CONMEBOL', group:'C', rank:6,   participations:22},
    {name:'Cape Verde', code:'CPV', flag:'🇨🇻', conf:'CAF',      group:'H', rank:69,  participations:0},
    {name:'Canada', code:'CAN', flag:'🇨🇦', conf:'CONCACAF', group:'B', rank:null, participations:1, host:true},
    {name:'Colombia', code:'COL', flag:'🇨🇴', conf:'CONMEBOL', group:'K', rank:13,  participations:6},
    {name:'DR Congo', code:'COD', flag:'🇨🇩', conf:'CAF',      group:'K', rank:46,  participations:1},
    {name:'Ivory Coast', code:'CIV', flag:'🇨🇮', conf:'CAF',      group:'E', rank:34,  participations:3},
    {name:'Croatia', code:'CRO', flag:'🇭🇷', conf:'UEFA',     group:'L', rank:11,  participations:6},
    {name:'Curaçao', code:'CUW', flag:'🇨🇼', conf:'CONCACAF', group:'E', rank:82,  participations:0},
    {name:'Czech Republic', code:'CZE', flag:'🇨🇿', conf:'UEFA',     group:'A', rank:41,  participations:9},
    {name:'Ecuador', code:'ECU', flag:'🇪🇨', conf:'CONMEBOL', group:'E', rank:23,  participations:4},
    {name:'Egypt', code:'EGY', flag:'🇪🇬', conf:'CAF',      group:'G', rank:29,  participations:3},
    {name:'England', code:'ENG', flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', conf:'UEFA',     group:'L', rank:4,   participations:16},
    {name:'France', code:'FRA', flag:'🇫🇷', conf:'UEFA',     group:'I', rank:1,   participations:16},
    {name:'Germany', code:'GER', flag:'🇩🇪', conf:'UEFA',     group:'E', rank:10,  participations:20},
    {name:'Ghana', code:'GHA', flag:'🇬🇭', conf:'CAF',      group:'L', rank:74,  participations:4},
    {name:'Haiti', code:'HAI', flag:'🇭🇹', conf:'CONCACAF', group:'C', rank:83,  participations:1},
    {name:'Iran', code:'IRN', flag:'🇮🇷', conf:'AFC',      group:'G', rank:21,  participations:6},
    {name:'Iraq', code:'IRQ', flag:'🇮🇶', conf:'AFC',      group:'I', rank:57,  participations:1},
    {name:'Japan', code:'JPN', flag:'🇯🇵', conf:'AFC',      group:'F', rank:18,  participations:7},
    {name:'Jordan', code:'JOR', flag:'🇯🇴', conf:'AFC',      group:'J', rank:63,  participations:0},
    {name:'South Korea', code:'KOR', flag:'🇰🇷', conf:'AFC',      group:'A', rank:25,  participations:10},
    {name:'Mexico', code:'MEX', flag:'🇲🇽', conf:'CONCACAF', group:'A', rank:null, participations:17, host:true},
    {name:'Morocco', code:'MAR', flag:'🇲🇦', conf:'CAF',      group:'C', rank:8,   participations:6},
    {name:'Netherlands',         flag:'🇳🇱', conf:'UEFA',     group:'F', rank:7,   participations:10},
    {name:'New Zealand',         flag:'🇳🇿', conf:'OFC',      group:'G', rank:85,  participations:2},
    {name:'Norway', code:'NOR', flag:'🇳🇴', conf:'UEFA',     group:'I', rank:31,  participations:3},
    {name:'Panama', code:'PAN', flag:'🇵🇦', conf:'CONCACAF', group:'L', rank:33,  participations:1},
    {name:'Paraguay', code:'PAR', flag:'🇵🇾', conf:'CONMEBOL', group:'D', rank:40,  participations:8},
    {name:'Portugal', code:'POR', flag:'🇵🇹', conf:'UEFA',     group:'K', rank:5,   participations:8},
    {name:'Qatar', code:'QAT', flag:'🇶🇦', conf:'AFC',      group:'B', rank:55,  participations:1},
    {name:'Saudi Arabia',        flag:'🇸🇦', conf:'AFC',      group:'H', rank:61,  participations:6},
    {name:'Scotland',            flag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', conf:'UEFA',     group:'C', rank:43,  participations:7},
    {name:'Senegal', code:'SEN', flag:'🇸🇳', conf:'CAF',      group:'I', rank:14,  participations:3},
    {name:'South Africa',        flag:'🇿🇦', conf:'CAF',      group:'A', rank:60,  participations:3},
    {name:'Spain', code:'ESP', flag:'🇪🇸', conf:'UEFA',     group:'H', rank:2,   participations:16},
    {name:'Sweden', code:'SWE', flag:'🇸🇪', conf:'UEFA',     group:'F', rank:38,  participations:12},
    {name:'Switzerland', code:'SUI', flag:'🇨🇭', conf:'UEFA',     group:'B', rank:19,  participations:12},
    {name:'Tunisia', code:'TUN', flag:'🇹🇳', conf:'CAF',      group:'F', rank:44,  participations:6},
    {name:'Turkey', code:'TUR', flag:'🇹🇷', conf:'UEFA',     group:'D', rank:22,  participations:2},
    {name:'Uruguay', code:'URU', flag:'🇺🇾', conf:'CONMEBOL', group:'H', rank:17,  participations:14},
    {name:'USA', code:'USA', flag:'🇺🇸', conf:'CONCACAF', group:'D', rank:null, participations:11, host:true},
    {name:'Uzbekistan',          flag:'🇺🇿', conf:'AFC',      group:'K', rank:50,  participations:0},
  ],

  /* ── GROUPS A–L — Source: FIFA.com ── */
  groups: {
    A: {
      teams: [
        {name:'Mexico', code:'MEX', flag:'🇲🇽', confederation:'CONCACAF', host:true},
        {name:'South Africa', code:'RSA', flag:'🇿🇦', confederation:'CAF'},
        {name:'South Korea', code:'KOR', flag:'🇰🇷', confederation:'AFC'},
        {name:'Czech Republic', code:'CZE', flag:'🇨🇿', confederation:'UEFA'},
      ]
    },
    B: {
      teams: [
        {name:'Canada', code:'CAN', flag:'🇨🇦', confederation:'CONCACAF', host:true},
        {name:'Bosnia & Herzegovina', code:'BIH', flag:'🇧🇦', confederation:'UEFA'},
        {name:'Qatar', code:'QAT', flag:'🇶🇦', confederation:'AFC'},
        {name:'Switzerland', code:'SUI', flag:'🇨🇭', confederation:'UEFA'},
      ]
    },
    C: {
      teams: [
        {name:'Brazil', code:'BRA', flag:'🇧🇷', confederation:'CONMEBOL'},
        {name:'Morocco', code:'MAR', flag:'🇲🇦', confederation:'CAF'},
        {name:'Haiti', code:'HAI', flag:'🇭🇹', confederation:'CONCACAF'},
        {name:'Scotland', code:'SCO', flag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', confederation:'UEFA'},
      ]
    },
    D: {
      teams: [
        {name:'USA', code:'USA', flag:'🇺🇸', confederation:'CONCACAF', host:true},
        {name:'Paraguay', code:'PAR', flag:'🇵🇾', confederation:'CONMEBOL'},
        {name:'Australia', code:'AUS', flag:'🇦🇺', confederation:'AFC'},
        {name:'Turkey', code:'TUR', flag:'🇹🇷', confederation:'UEFA'},
      ]
    },
    E: {
      teams: [
        {name:'Germany', code:'GER', flag:'🇩🇪', confederation:'UEFA'},
        {name:'Ivory Coast', code:'CIV', flag:'🇨🇮', confederation:'CAF'},
        {name:'Curaçao', code:'CUW', flag:'🇨🇼', confederation:'CONCACAF'},
        {name:'Ecuador', code:'ECU', flag:'🇪🇨', confederation:'CONMEBOL'},
      ]
    },
    F: {
      teams: [
        {name:'Netherlands', code:'NED', flag:'🇳🇱', confederation:'UEFA'},
        {name:'Japan', code:'JPN', flag:'🇯🇵', confederation:'AFC'},
        {name:'Sweden', code:'SWE', flag:'🇸🇪', confederation:'UEFA'},
        {name:'Tunisia', code:'TUN', flag:'🇹🇳', confederation:'CAF'},
      ]
    },
    G: {
      teams: [
        {name:'Belgium', code:'BEL', flag:'🇧🇪', confederation:'UEFA'},
        {name:'Egypt', code:'EGY', flag:'🇪🇬', confederation:'CAF'},
        {name:'Iran', code:'IRN', flag:'🇮🇷', confederation:'AFC'},
        {name:'New Zealand', code:'NZL', flag:'🇳🇿', confederation:'OFC'},
      ]
    },
    H: {
      teams: [
        {name:'Spain', code:'ESP', flag:'🇪🇸', confederation:'UEFA'},
        {name:'Cape Verde', code:'CPV', flag:'🇨🇻', confederation:'CAF'},
        {name:'Saudi Arabia', code:'KSA', flag:'🇸🇦', confederation:'AFC'},
        {name:'Uruguay', code:'URU', flag:'🇺🇾', confederation:'CONMEBOL'},
      ]
    },
    I: {
      teams: [
        {name:'France', code:'FRA', flag:'🇫🇷', confederation:'UEFA'},
        {name:'Senegal', code:'SEN', flag:'🇸🇳', confederation:'CAF'},
        {name:'Iraq', code:'IRQ', flag:'🇮🇶', confederation:'AFC'},
        {name:'Norway', code:'NOR', flag:'🇳🇴', confederation:'UEFA'},
      ]
    },
    J: {
      teams: [
        {name:'Argentina', code:'ARG', flag:'🇦🇷', confederation:'CONMEBOL'},
        {name:'Algeria', code:'ALG', flag:'🇩🇿', confederation:'CAF'},
        {name:'Austria', code:'AUT', flag:'🇦🇹', confederation:'UEFA'},
        {name:'Jordan', code:'JOR', flag:'🇯🇴', confederation:'AFC'},
      ]
    },
    K: {
      teams: [
        {name:'Portugal', code:'POR', flag:'🇵🇹', confederation:'UEFA'},
        {name:'DR Congo', code:'COD', flag:'🇨🇩', confederation:'CAF'},
        {name:'Uzbekistan', code:'UZB', flag:'🇺🇿', confederation:'AFC'},
        {name:'Colombia', code:'COL', flag:'🇨🇴', confederation:'CONMEBOL'},
      ]
    },
    L: {
      teams: [
        {name:'England', code:'ENG', flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', confederation:'UEFA'},
        {name:'Croatia', code:'CRO', flag:'🇭🇷', confederation:'UEFA'},
        {name:'Ghana', code:'GHA', flag:'🇬🇭', confederation:'CAF'},
        {name:'Panama', code:'PAN', flag:'🇵🇦', confederation:'CONCACAF'},
      ]
    }
  }
};
