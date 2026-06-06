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
    {name:'Algeria',             flag:'🇩🇿', conf:'CAF',      group:'J', rank:28,  participations:4},
    {name:'Argentina',           flag:'🇦🇷', conf:'CONMEBOL', group:'J', rank:3,   participations:18},
    {name:'Australia',           flag:'🇦🇺', conf:'AFC',      group:'D', rank:27,  participations:6},
    {name:'Austria',             flag:'🇦🇹', conf:'UEFA',     group:'J', rank:24,  participations:7},
    {name:'Belgium',             flag:'🇧🇪', conf:'UEFA',     group:'G', rank:9,   participations:13},
    {name:'Bosnia & Herzegovina',flag:'🇧🇦', conf:'UEFA',     group:'B', rank:65,  participations:1},
    {name:'Brazil',              flag:'🇧🇷', conf:'CONMEBOL', group:'C', rank:6,   participations:22},
    {name:'Cape Verde',          flag:'🇨🇻', conf:'CAF',      group:'H', rank:69,  participations:0},
    {name:'Canada',              flag:'🇨🇦', conf:'CONCACAF', group:'B', rank:null, participations:1, host:true},
    {name:'Colombia',            flag:'🇨🇴', conf:'CONMEBOL', group:'K', rank:13,  participations:6},
    {name:'DR Congo',            flag:'🇨🇩', conf:'CAF',      group:'K', rank:46,  participations:1},
    {name:"Ivory Coast",       flag:'🇨🇮', conf:'CAF',      group:'E', rank:34,  participations:3},
    {name:'Croatia',             flag:'🇭🇷', conf:'UEFA',     group:'L', rank:11,  participations:6},
    {name:'Curaçao',             flag:'🇨🇼', conf:'CONCACAF', group:'E', rank:82,  participations:0},
    {name:'Czech Republic',             flag:'🇨🇿', conf:'UEFA',     group:'A', rank:41,  participations:9},
    {name:'Ecuador',             flag:'🇪🇨', conf:'CONMEBOL', group:'E', rank:23,  participations:4},
    {name:'Egypt',               flag:'🇪🇬', conf:'CAF',      group:'G', rank:29,  participations:3},
    {name:'England',             flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', conf:'UEFA',     group:'L', rank:4,   participations:16},
    {name:'France',              flag:'🇫🇷', conf:'UEFA',     group:'I', rank:1,   participations:16},
    {name:'Germany',             flag:'🇩🇪', conf:'UEFA',     group:'E', rank:10,  participations:20},
    {name:'Ghana',               flag:'🇬🇭', conf:'CAF',      group:'L', rank:74,  participations:4},
    {name:'Haiti',               flag:'🇭🇹', conf:'CONCACAF', group:'C', rank:83,  participations:1},
    {name:'Iran',                flag:'🇮🇷', conf:'AFC',      group:'G', rank:21,  participations:6},
    {name:'Iraq',                flag:'🇮🇶', conf:'AFC',      group:'I', rank:57,  participations:1},
    {name:'Japan',               flag:'🇯🇵', conf:'AFC',      group:'F', rank:18,  participations:7},
    {name:'Jordan',              flag:'🇯🇴', conf:'AFC',      group:'J', rank:63,  participations:0},
    {name:'South Korea',         flag:'🇰🇷', conf:'AFC',      group:'A', rank:25,  participations:10},
    {name:'Mexico',              flag:'🇲🇽', conf:'CONCACAF', group:'A', rank:null, participations:17, host:true},
    {name:'Morocco',             flag:'🇲🇦', conf:'CAF',      group:'C', rank:8,   participations:6},
    {name:'Netherlands',         flag:'🇳🇱', conf:'UEFA',     group:'F', rank:7,   participations:10},
    {name:'New Zealand',         flag:'🇳🇿', conf:'OFC',      group:'G', rank:85,  participations:2},
    {name:'Norway',              flag:'🇳🇴', conf:'UEFA',     group:'I', rank:31,  participations:3},
    {name:'Panama',              flag:'🇵🇦', conf:'CONCACAF', group:'L', rank:33,  participations:1},
    {name:'Paraguay',            flag:'🇵🇾', conf:'CONMEBOL', group:'D', rank:40,  participations:8},
    {name:'Portugal',            flag:'🇵🇹', conf:'UEFA',     group:'K', rank:5,   participations:8},
    {name:'Qatar',               flag:'🇶🇦', conf:'AFC',      group:'B', rank:55,  participations:1},
    {name:'Saudi Arabia',        flag:'🇸🇦', conf:'AFC',      group:'H', rank:61,  participations:6},
    {name:'Scotland',            flag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', conf:'UEFA',     group:'C', rank:43,  participations:7},
    {name:'Senegal',             flag:'🇸🇳', conf:'CAF',      group:'I', rank:14,  participations:3},
    {name:'South Africa',        flag:'🇿🇦', conf:'CAF',      group:'A', rank:60,  participations:3},
    {name:'Spain',               flag:'🇪🇸', conf:'UEFA',     group:'H', rank:2,   participations:16},
    {name:'Sweden',              flag:'🇸🇪', conf:'UEFA',     group:'F', rank:38,  participations:12},
    {name:'Switzerland',         flag:'🇨🇭', conf:'UEFA',     group:'B', rank:19,  participations:12},
    {name:'Tunisia',             flag:'🇹🇳', conf:'CAF',      group:'F', rank:44,  participations:6},
    {name:'Turkey',             flag:'🇹🇷', conf:'UEFA',     group:'D', rank:22,  participations:2},
    {name:'Uruguay',             flag:'🇺🇾', conf:'CONMEBOL', group:'H', rank:17,  participations:14},
    {name:'USA',                 flag:'🇺🇸', conf:'CONCACAF', group:'D', rank:null, participations:11, host:true},
    {name:'Uzbekistan',          flag:'🇺🇿', conf:'AFC',      group:'K', rank:50,  participations:0},
  ],

  /* ── GROUPS A–L — Source: FIFA.com ── */
  groups: {
    A: {
      teams: [
        {name:'Mexico',       flag:'🇲🇽', confederation:'CONCACAF', host:true},
        {name:'South Africa', flag:'🇿🇦', confederation:'CAF'},
        {name:'South Korea',  flag:'🇰🇷', confederation:'AFC'},
        {name:'Czech Republic',      flag:'🇨🇿', confederation:'UEFA'},
      ]
    },
    B: {
      teams: [
        {name:'Canada',               flag:'🇨🇦', confederation:'CONCACAF', host:true},
        {name:'Bosnia & Herzegovina', flag:'🇧🇦', confederation:'UEFA'},
        {name:'Qatar',                flag:'🇶🇦', confederation:'AFC'},
        {name:'Switzerland',          flag:'🇨🇭', confederation:'UEFA'},
      ]
    },
    C: {
      teams: [
        {name:'Brazil',   flag:'🇧🇷', confederation:'CONMEBOL'},
        {name:'Morocco',  flag:'🇲🇦', confederation:'CAF'},
        {name:'Haiti',    flag:'🇭🇹', confederation:'CONCACAF'},
        {name:'Scotland', flag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', confederation:'UEFA'},
      ]
    },
    D: {
      teams: [
        {name:'USA',       flag:'🇺🇸', confederation:'CONCACAF', host:true},
        {name:'Paraguay',  flag:'🇵🇾', confederation:'CONMEBOL'},
        {name:'Australia', flag:'🇦🇺', confederation:'AFC'},
        {name:'Turkey',   flag:'🇹🇷', confederation:'UEFA'},
      ]
    },
    E: {
      teams: [
        {name:'Germany',        flag:'🇩🇪', confederation:'UEFA'},
        {name:"Ivory Coast",  flag:'🇨🇮', confederation:'CAF'},
        {name:'Curaçao',        flag:'🇨🇼', confederation:'CONCACAF'},
        {name:'Ecuador',        flag:'🇪🇨', confederation:'CONMEBOL'},
      ]
    },
    F: {
      teams: [
        {name:'Netherlands', flag:'🇳🇱', confederation:'UEFA'},
        {name:'Japan',       flag:'🇯🇵', confederation:'AFC'},
        {name:'Sweden',      flag:'🇸🇪', confederation:'UEFA'},
        {name:'Tunisia',     flag:'🇹🇳', confederation:'CAF'},
      ]
    },
    G: {
      teams: [
        {name:'Belgium',     flag:'🇧🇪', confederation:'UEFA'},
        {name:'Egypt',       flag:'🇪🇬', confederation:'CAF'},
        {name:'Iran',        flag:'🇮🇷', confederation:'AFC'},
        {name:'New Zealand', flag:'🇳🇿', confederation:'OFC'},
      ]
    },
    H: {
      teams: [
        {name:'Spain',        flag:'🇪🇸', confederation:'UEFA'},
        {name:'Cape Verde',   flag:'🇨🇻', confederation:'CAF'},
        {name:'Saudi Arabia', flag:'🇸🇦', confederation:'AFC'},
        {name:'Uruguay',      flag:'🇺🇾', confederation:'CONMEBOL'},
      ]
    },
    I: {
      teams: [
        {name:'France',   flag:'🇫🇷', confederation:'UEFA'},
        {name:'Senegal',  flag:'🇸🇳', confederation:'CAF'},
        {name:'Iraq',     flag:'🇮🇶', confederation:'AFC'},
        {name:'Norway',   flag:'🇳🇴', confederation:'UEFA'},
      ]
    },
    J: {
      teams: [
        {name:'Argentina', flag:'🇦🇷', confederation:'CONMEBOL'},
        {name:'Algeria',   flag:'🇩🇿', confederation:'CAF'},
        {name:'Austria',   flag:'🇦🇹', confederation:'UEFA'},
        {name:'Jordan',    flag:'🇯🇴', confederation:'AFC'},
      ]
    },
    K: {
      teams: [
        {name:'Portugal',   flag:'🇵🇹', confederation:'UEFA'},
        {name:'DR Congo',   flag:'🇨🇩', confederation:'CAF'},
        {name:'Uzbekistan', flag:'🇺🇿', confederation:'AFC'},
        {name:'Colombia',   flag:'🇨🇴', confederation:'CONMEBOL'},
      ]
    },
    L: {
      teams: [
        {name:'England',  flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', confederation:'UEFA'},
        {name:'Croatia',  flag:'🇭🇷', confederation:'UEFA'},
        {name:'Ghana',    flag:'🇬🇭', confederation:'CAF'},
        {name:'Panama',   flag:'🇵🇦', confederation:'CONCACAF'},
      ]
    }
  }
};
