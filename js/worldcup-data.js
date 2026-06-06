/* ============================================================
   GOALCURRENT.LIVE — World Cup 2026 Official Data
   Source: FIFA.com official fixture list — verified June 2026
   All times in BST (British Summer Time)
   code field: internal use only — never display to users
   ============================================================ */

var WC26 = {

  meta: {
    name: 'FIFA World Cup 2026',
    hosts: ['USA', 'Mexico', 'Canada'],
    teams: 48, groups: 12, matches: 104, venues: 16,
    start: '2026-06-11', final: '2026-07-19',
    finalVenue: 'New York/New Jersey Stadium (MetLife Stadium)'
  },

  /* ── 48 TEAMS — verified FIFA.com ── */
  teams: [
    {name:'Algeria',              flag:'🇩🇿', conf:'CAF',      group:'J', rank:28,  code:'ALG'},
    {name:'Argentina',            flag:'🇦🇷', conf:'CONMEBOL', group:'J', rank:3,   code:'ARG'},
    {name:'Australia',            flag:'🇦🇺', conf:'AFC',      group:'D', rank:27,  code:'AUS'},
    {name:'Austria',              flag:'🇦🇹', conf:'UEFA',     group:'J', rank:24,  code:'AUT'},
    {name:'Belgium',              flag:'🇧🇪', conf:'UEFA',     group:'G', rank:9,   code:'BEL'},
    {name:'Bosnia & Herzegovina', flag:'🇧🇦', conf:'UEFA',     group:'B', rank:65,  code:'BIH'},
    {name:'Brazil',               flag:'🇧🇷', conf:'CONMEBOL', group:'C', rank:6,   code:'BRA'},
    {name:'Cape Verde',           flag:'🇨🇻', conf:'CAF',      group:'H', rank:69,  code:'CPV'},
    {name:'Canada',               flag:'🇨🇦', conf:'CONCACAF', group:'B', host:true, code:'CAN'},
    {name:'Colombia',             flag:'🇨🇴', conf:'CONMEBOL', group:'K', rank:13,  code:'COL'},
    {name:'DR Congo',             flag:'🇨🇩', conf:'CAF',      group:'K', rank:46,  code:'COD'},
    {name:'Ivory Coast',          flag:'🇨🇮', conf:'CAF',      group:'E', rank:34,  code:'CIV'},
    {name:'Croatia',              flag:'🇭🇷', conf:'UEFA',     group:'L', rank:11,  code:'CRO'},
    {name:'Curaçao',              flag:'🇨🇼', conf:'CONCACAF', group:'E', rank:82,  code:'CUW'},
    {name:'Czech Republic',       flag:'🇨🇿', conf:'UEFA',     group:'A', rank:41,  code:'CZE'},
    {name:'Ecuador',              flag:'🇪🇨', conf:'CONMEBOL', group:'E', rank:23,  code:'ECU'},
    {name:'Egypt',                flag:'🇪🇬', conf:'CAF',      group:'G', rank:29,  code:'EGY'},
    {name:'England',              flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', conf:'UEFA',     group:'L', rank:4,   code:'ENG'},
    {name:'France',               flag:'🇫🇷', conf:'UEFA',     group:'I', rank:1,   code:'FRA'},
    {name:'Germany',              flag:'🇩🇪', conf:'UEFA',     group:'E', rank:10,  code:'GER'},
    {name:'Ghana',                flag:'🇬🇭', conf:'CAF',      group:'L', rank:74,  code:'GHA'},
    {name:'Haiti',                flag:'🇭🇹', conf:'CONCACAF', group:'C', rank:83,  code:'HAI'},
    {name:'Iran',                 flag:'🇮🇷', conf:'AFC',      group:'G', rank:21,  code:'IRN'},
    {name:'Iraq',                 flag:'🇮🇶', conf:'AFC',      group:'I', rank:57,  code:'IRQ'},
    {name:'Japan',                flag:'🇯🇵', conf:'AFC',      group:'F', rank:18,  code:'JPN'},
    {name:'Jordan',               flag:'🇯🇴', conf:'AFC',      group:'J', rank:63,  code:'JOR'},
    {name:'South Korea',          flag:'🇰🇷', conf:'AFC',      group:'A', rank:25,  code:'KOR'},
    {name:'Mexico',               flag:'🇲🇽', conf:'CONCACAF', group:'A', host:true, code:'MEX'},
    {name:'Morocco',              flag:'🇲🇦', conf:'CAF',      group:'C', rank:8,   code:'MAR'},
    {name:'Netherlands',          flag:'🇳🇱', conf:'UEFA',     group:'F', rank:7,   code:'NED'},
    {name:'New Zealand',          flag:'🇳🇿', conf:'OFC',      group:'G', rank:85,  code:'NZL'},
    {name:'Norway',               flag:'🇳🇴', conf:'UEFA',     group:'I', rank:31,  code:'NOR'},
    {name:'Panama',               flag:'🇵🇦', conf:'CONCACAF', group:'L', rank:33,  code:'PAN'},
    {name:'Paraguay',             flag:'🇵🇾', conf:'CONMEBOL', group:'D', rank:40,  code:'PAR'},
    {name:'Portugal',             flag:'🇵🇹', conf:'UEFA',     group:'K', rank:5,   code:'POR'},
    {name:'Qatar',                flag:'🇶🇦', conf:'AFC',      group:'B', rank:55,  code:'QAT'},
    {name:'Saudi Arabia',         flag:'🇸🇦', conf:'AFC',      group:'H', rank:61,  code:'KSA'},
    {name:'Scotland',             flag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', conf:'UEFA',     group:'C', rank:43,  code:'SCO'},
    {name:'Senegal',              flag:'🇸🇳', conf:'CAF',      group:'I', rank:14,  code:'SEN'},
    {name:'South Africa',         flag:'🇿🇦', conf:'CAF',      group:'A', rank:60,  code:'RSA'},
    {name:'Spain',                flag:'🇪🇸', conf:'UEFA',     group:'H', rank:2,   code:'ESP'},
    {name:'Sweden',               flag:'🇸🇪', conf:'UEFA',     group:'F', rank:38,  code:'SWE'},
    {name:'Switzerland',          flag:'🇨🇭', conf:'UEFA',     group:'B', rank:19,  code:'SUI'},
    {name:'Tunisia',              flag:'🇹🇳', conf:'CAF',      group:'F', rank:44,  code:'TUN'},
    {name:'Turkey',               flag:'🇹🇷', conf:'UEFA',     group:'D', rank:22,  code:'TUR'},
    {name:'Uruguay',              flag:'🇺🇾', conf:'CONMEBOL', group:'H', rank:17,  code:'URU'},
    {name:'USA',                  flag:'🇺🇸', conf:'CONCACAF', group:'D', host:true, code:'USA'},
    {name:'Uzbekistan',           flag:'🇺🇿', conf:'AFC',      group:'K', rank:50,  code:'UZB'},
  ],

  /* ── GROUPS A–L ── */
  groups: {
    A: {teams:[
      {name:'Mexico',        flag:'🇲🇽', confederation:'CONCACAF', host:true},
      {name:'South Africa',  flag:'🇿🇦', confederation:'CAF'},
      {name:'South Korea',   flag:'🇰🇷', confederation:'AFC'},
      {name:'Czech Republic',flag:'🇨🇿', confederation:'UEFA'},
    ]},
    B: {teams:[
      {name:'Canada',               flag:'🇨🇦', confederation:'CONCACAF', host:true},
      {name:'Bosnia & Herzegovina', flag:'🇧🇦', confederation:'UEFA'},
      {name:'Qatar',                flag:'🇶🇦', confederation:'AFC'},
      {name:'Switzerland',          flag:'🇨🇭', confederation:'UEFA'},
    ]},
    C: {teams:[
      {name:'Brazil',   flag:'🇧🇷', confederation:'CONMEBOL'},
      {name:'Morocco',  flag:'🇲🇦', confederation:'CAF'},
      {name:'Haiti',    flag:'🇭🇹', confederation:'CONCACAF'},
      {name:'Scotland', flag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', confederation:'UEFA'},
    ]},
    D: {teams:[
      {name:'USA',       flag:'🇺🇸', confederation:'CONCACAF', host:true},
      {name:'Paraguay',  flag:'🇵🇾', confederation:'CONMEBOL'},
      {name:'Australia', flag:'🇦🇺', confederation:'AFC'},
      {name:'Turkey',    flag:'🇹🇷', confederation:'UEFA'},
    ]},
    E: {teams:[
      {name:'Germany',     flag:'🇩🇪', confederation:'UEFA'},
      {name:'Ivory Coast', flag:'🇨🇮', confederation:'CAF'},
      {name:'Curaçao',     flag:'🇨🇼', confederation:'CONCACAF'},
      {name:'Ecuador',     flag:'🇪🇨', confederation:'CONMEBOL'},
    ]},
    F: {teams:[
      {name:'Netherlands', flag:'🇳🇱', confederation:'UEFA'},
      {name:'Japan',       flag:'🇯🇵', confederation:'AFC'},
      {name:'Sweden',      flag:'🇸🇪', confederation:'UEFA'},
      {name:'Tunisia',     flag:'🇹🇳', confederation:'CAF'},
    ]},
    G: {teams:[
      {name:'Belgium',     flag:'🇧🇪', confederation:'UEFA'},
      {name:'Egypt',       flag:'🇪🇬', confederation:'CAF'},
      {name:'Iran',        flag:'🇮🇷', confederation:'AFC'},
      {name:'New Zealand', flag:'🇳🇿', confederation:'OFC'},
    ]},
    H: {teams:[
      {name:'Spain',        flag:'🇪🇸', confederation:'UEFA'},
      {name:'Cape Verde',   flag:'🇨🇻', confederation:'CAF'},
      {name:'Saudi Arabia', flag:'🇸🇦', confederation:'AFC'},
      {name:'Uruguay',      flag:'🇺🇾', confederation:'CONMEBOL'},
    ]},
    I: {teams:[
      {name:'France',  flag:'🇫🇷', confederation:'UEFA'},
      {name:'Senegal', flag:'🇸🇳', confederation:'CAF'},
      {name:'Iraq',    flag:'🇮🇶', confederation:'AFC'},
      {name:'Norway',  flag:'🇳🇴', confederation:'UEFA'},
    ]},
    J: {teams:[
      {name:'Argentina', flag:'🇦🇷', confederation:'CONMEBOL'},
      {name:'Algeria',   flag:'🇩🇿', confederation:'CAF'},
      {name:'Austria',   flag:'🇦🇹', confederation:'UEFA'},
      {name:'Jordan',    flag:'🇯🇴', confederation:'AFC'},
    ]},
    K: {teams:[
      {name:'Portugal',   flag:'🇵🇹', confederation:'UEFA'},
      {name:'DR Congo',   flag:'🇨🇩', confederation:'CAF'},
      {name:'Uzbekistan', flag:'🇺🇿', confederation:'AFC'},
      {name:'Colombia',   flag:'🇨🇴', confederation:'CONMEBOL'},
    ]},
    L: {teams:[
      {name:'England',  flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', confederation:'UEFA'},
      {name:'Croatia',  flag:'🇭🇷', confederation:'UEFA'},
      {name:'Ghana',    flag:'🇬🇭', confederation:'CAF'},
      {name:'Panama',   flag:'🇵🇦', confederation:'CONCACAF'},
    ]}
  }

};
