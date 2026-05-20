/* myteams.js — My Teams page: pick teams, get notifications */
var GC_MYTEAMS = (function () {

  var STORAGE_KEY = 'gc_my_teams';
  var NOTIF_KEY   = 'gc_notif_prefs';

  /* ── All teams ─────────────────────────────────────── */
  var PL_TEAMS = [
    {id:'arsenal',     name:'Arsenal',          logo:'https://resources.premierleague.com/premierleague/badges/50/t3.png'},
    {id:'aston_villa', name:'Aston Villa',       logo:'https://resources.premierleague.com/premierleague/badges/50/t7.png'},
    {id:'bournemouth', name:'Bournemouth',        logo:'https://resources.premierleague.com/premierleague/badges/50/t91.png'},
    {id:'brentford',   name:'Brentford',          logo:'https://resources.premierleague.com/premierleague/badges/50/t94.png'},
    {id:'brighton',    name:'Brighton',           logo:'https://resources.premierleague.com/premierleague/badges/50/t36.png'},
    {id:'chelsea',     name:'Chelsea',            logo:'https://resources.premierleague.com/premierleague/badges/50/t8.png'},
    {id:'crystal',     name:'Crystal Palace',     logo:'https://resources.premierleague.com/premierleague/badges/50/t31.png'},
    {id:'everton',     name:'Everton',            logo:'https://resources.premierleague.com/premierleague/badges/50/t11.png'},
    {id:'fulham',      name:'Fulham',             logo:'https://resources.premierleague.com/premierleague/badges/50/t54.png'},
    {id:'ipswich',     name:'Ipswich Town',       logo:'https://resources.premierleague.com/premierleague/badges/50/t40.png'},
    {id:'leicester',   name:'Leicester City',     logo:'https://resources.premierleague.com/premierleague/badges/50/t13.png'},
    {id:'liverpool',   name:'Liverpool',          logo:'https://resources.premierleague.com/premierleague/badges/50/t14.png'},
    {id:'mancity',     name:'Man City',           logo:'https://resources.premierleague.com/premierleague/badges/50/t43.png'},
    {id:'manutd',      name:'Man United',         logo:'https://resources.premierleague.com/premierleague/badges/50/t1.png'},
    {id:'newcastle',   name:'Newcastle',          logo:'https://resources.premierleague.com/premierleague/badges/50/t4.png'},
    {id:'nforest',     name:"Nott'm Forest",      logo:'https://resources.premierleague.com/premierleague/badges/50/t17.png'},
    {id:'southampton', name:'Southampton',        logo:'https://resources.premierleague.com/premierleague/badges/50/t20.png'},
    {id:'spurs',       name:'Tottenham',          logo:'https://resources.premierleague.com/premierleague/badges/50/t6.png'},
    {id:'westham',     name:'West Ham',           logo:'https://resources.premierleague.com/premierleague/badges/50/t21.png'},
    {id:'wolves',      name:'Wolves',             logo:'https://resources.premierleague.com/premierleague/badges/50/t39.png'}
  ];

  var WC_TEAMS = [
    {id:'eng',  name:'England',     logo:'https://media.api-sports.io/flags/gb-eng.svg'},
    {id:'fra',  name:'France',      logo:'https://media.api-sports.io/flags/fr.svg'},
    {id:'bra',  name:'Brazil',      logo:'https://media.api-sports.io/flags/br.svg'},
    {id:'arg',  name:'Argentina',   logo:'https://media.api-sports.io/flags/ar.svg'},
    {id:'esp',  name:'Spain',       logo:'https://media.api-sports.io/flags/es.svg'},
    {id:'ger',  name:'Germany',     logo:'https://media.api-sports.io/flags/de.svg'},
    {id:'por',  name:'Portugal',    logo:'https://media.api-sports.io/flags/pt.svg'},
    {id:'ned',  name:'Netherlands', logo:'https://media.api-sports.io/flags/nl.svg'},
    {id:'bel',  name:'Belgium',     logo:'https://media.api-sports.io/flags/be.svg'},
    {id:'ita',  name:'Italy',       logo:'https://media.api-sports.io/flags/it.svg'},
    {id:'usa',  name:'USA',         logo:'https://media.api-sports.io/flags/us.svg'},
    {id:'mex',  name:'Mexico',      logo:'https://media.api-sports.io/flags/mx.svg'},
    {id:'can',  name:'Canada',      logo:'https://media.api-sports.io/flags/ca.svg'},
    {id:'iri',  name:'IR Iran',     logo:'https://media.api-sports.io/flags/ir.svg'},
    {id:'jpn',  name:'Japan',       logo:'https://media.api-sports.io/flags/jp.svg'},
    {id:'kor',  name:'South Korea', logo:'https://media.api-sports.io/flags/kr.svg'},
    {id:'mor',  name:'Morocco',     logo:'https://media.api-sports.io/flags/ma.svg'},
    {id:'sen',  name:'Senegal',     logo:'https://media.api-sports.io/flags/sn.svg'},
    {id:'aus',  name:'Australia',   logo:'https://media.api-sports.io/flags/au.svg'},
    {id:'cro',  name:'Croatia',     logo:'https://media.api-sports.io/flags/hr.svg'},
    {id:'uru',  name:'Uruguay',     logo:'https://media.api-sports.io/flags/uy.svg'},
    {id:'col',  name:'Colombia',    logo:'https://media.api-sports.io/flags/co.svg'},
    {id:'den',  name:'Denmark',     logo:'https://media.api-sports.io/flags/dk.svg'},
    {id:'sui',  name:'Switzerland', logo:'https://media.api-sports.io/flags/ch.svg'}
  ];

  var NOTIF_OPTIONS = [
    { id:'goal',    label:'⚽ Goal Scored',      desc:'Alert when your team scores' },
    { id:'red',     label:'🟥 Red Card',         desc:'Alert on red card' },
    { id:'ft',      label:'🏁 Full Time Result', desc:'Final score when match ends' },
    { id:'kickoff', label:'⏰ Kickoff Reminder', desc:'5 min before match starts' }
  ];

  /* ── Storage helpers ───────────────────────────────── */
  function loadTeams() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch(e) { return []; }
  }
  function saveTeams(arr) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); } catch(e) {}
  }
  function loadNotifPrefs() {
    try { return JSON.parse(localStorage.getItem(NOTIF_KEY) || '{"goal":true,"red":true,"ft":true,"kickoff":false}'); }
    catch(e) { return {goal:true,red:true,ft:true,kickoff:false}; }
  }
  function saveNotifPrefs(prefs) {
    try { localStorage.setItem(NOTIF_KEY, JSON.stringify(prefs)); } catch(e) {}
  }

  /* ── Render ────────────────────────────────────────── */
  function render(container) {
    var selected = loadTeams();
    var prefs    = loadNotifPrefs();
    container.innerHTML = buildHTML(selected, prefs);
    bindEvents(container, selected, prefs);
  }

  function buildHTML(selected, prefs) {
    var html = '<div style="padding-top:16px">';

    /* Hero */
    html += '<div class="gc-hero-banner-wrap" style="height:140px;margin-bottom:18px">' +
      '<img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=900&q=80" alt="My Teams" style="width:100%;height:100%;object-fit:cover">' +
      '<div class="gc-hero-banner-overlay">' +
        '<div class="gc-hero-banner-title">⭐ My Teams</div>' +
        '<div class="gc-hero-banner-sub">Choose your teams and get instant notifications</div>' +
      '</div></div>';

    /* Selected chips */
    html += '<div class="gc-card">';
    html += '<div class="gc-section-title">⭐ Your Selected Teams</div>';
    if (selected.length === 0) {
      html += '<div class="gc-empty" style="padding:16px 0">No teams selected yet — pick below!</div>';
    } else {
      html += '<div class="gc-selected-chips" id="gc-chips">';
      selected.forEach(function(id) {
        var team = findTeam(id);
        if (!team) return;
        html += '<div class="gc-chip" data-id="' + id + '">' +
          '<img src="' + esc(team.logo) + '" alt="" onerror="this.style.display=\'none\'">' +
          esc(team.name) +
          '<span class="gc-chip-remove" onclick="GC_MYTEAMS._remove(\'' + id + '\')">×</span>' +
        '</div>';
      });
      html += '</div>';
    }
    html += '</div>';

    /* PL Teams grid */
    html += '<div class="gc-card">';
    html += '<div class="gc-myteams-section-title">🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League Teams</div>';
    html += '<div class="gc-team-grid">';
    PL_TEAMS.forEach(function(t) {
      var isSel = selected.indexOf(t.id) > -1;
      html += teamTile(t, isSel);
    });
    html += '</div></div>';

    /* WC Teams grid */
    html += '<div class="gc-card">';
    html += '<div class="gc-myteams-section-title">🏆 World Cup 2026 Nations</div>';
    html += '<div class="gc-team-grid">';
    WC_TEAMS.forEach(function(t) {
      var isSel = selected.indexOf(t.id) > -1;
      html += teamTile(t, isSel);
    });
    html += '</div></div>';

    /* Notification preferences */
    html += '<div class="gc-card">';
    html += '<div class="gc-notif-title">🔔 Notification Preferences</div>';
    html += '<div class="gc-notif-options">';
    NOTIF_OPTIONS.forEach(function(opt) {
      html += '<div class="gc-notif-opt">' +
        '<div><div class="gc-notif-opt-label">' + opt.label + '</div>' +
        '<div class="gc-notif-opt-desc">' + opt.desc + '</div></div>' +
        '<label class="gc-toggle">' +
          '<input type="checkbox" id="gc-notif-' + opt.id + '"' + (prefs[opt.id]?' checked':'') +
          ' onchange="GC_MYTEAMS._toggleNotif(\'' + opt.id + '\', this.checked)">' +
          '<span class="gc-toggle-slider"></span>' +
        '</label>' +
      '</div>';
    });
    html += '</div>';

    html += '<div style="margin-top:16px;text-align:center">' +
      '<button class="gc-btn gc-btn-primary" onclick="GC_MYTEAMS._enablePush()">🔔 Enable Push Notifications</button>' +
    '</div>';
    html += '</div>';

    html += '</div>';
    return html;
  }

  function teamTile(t, isSel) {
    return '<div class="gc-team-tile' + (isSel?' selected':'') + '" ' +
      'onclick="GC_MYTEAMS._toggle(\'' + t.id + '\')" id="gc-tile-' + t.id + '">' +
      '<img class="gc-tile-logo" src="' + esc(t.logo) + '" alt="' + esc(t.name) + '" ' +
      'onerror="this.src=\'data:image/svg+xml,<svg xmlns=\\\'http://www.w3.org/2000/svg\\\' viewBox=\\\'0 0 40 40\\\'><text y=\\\'30\\\' font-size=\\\'28\\\'>⚽</text></svg>\'">' +
      '<div class="gc-tile-name">' + esc(t.name) + '</div>' +
    '</div>';
  }

  /* ── Event handlers ────────────────────────────────── */
  function bindEvents(container, selected, prefs) {
    // already handled via inline onclick
  }

  function findTeam(id) {
    return PL_TEAMS.concat(WC_TEAMS).find(function(t){ return t.id === id; });
  }

  /* ── Public toggle / remove ────────────────────────── */
  function toggle(id) {
    var selected = loadTeams();
    var idx = selected.indexOf(id);
    if (idx > -1) { selected.splice(idx,1); }
    else          { selected.push(id); }
    saveTeams(selected);

    /* update tile UI */
    var tile = document.getElementById('gc-tile-' + id);
    if (tile) tile.classList.toggle('selected', selected.indexOf(id) > -1);

    /* update chips */
    rebuildChips(selected);
  }

  function remove(id) {
    var selected = loadTeams();
    var idx = selected.indexOf(id);
    if (idx > -1) selected.splice(idx,1);
    saveTeams(selected);
    var tile = document.getElementById('gc-tile-' + id);
    if (tile) tile.classList.remove('selected');
    rebuildChips(selected);
  }

  function rebuildChips(selected) {
    var chips = document.getElementById('gc-chips');
    if (!chips) return;
    if (selected.length === 0) {
      chips.innerHTML = '<div class="gc-empty" style="padding:8px 0">No teams selected yet — pick below!</div>';
      return;
    }
    var html = '';
    selected.forEach(function(id) {
      var team = findTeam(id);
      if (!team) return;
      html += '<div class="gc-chip" data-id="' + id + '">' +
        '<img src="' + esc(team.logo) + '" alt="" onerror="this.style.display=\'none\'">' +
        esc(team.name) +
        '<span class="gc-chip-remove" onclick="GC_MYTEAMS._remove(\'' + id + '\')">×</span>' +
      '</div>';
    });
    chips.innerHTML = html;
  }

  function toggleNotif(id, val) {
    var prefs = loadNotifPrefs();
    prefs[id] = val;
    saveNotifPrefs(prefs);
  }

  function enablePush() {
    if (window.OneSignal) {
      try {
        OneSignal.User.PushSubscription.optIn();
        alert('✅ Push notifications enabled! You will receive alerts for your selected teams.');
      } catch(e) {
        alert('Please allow notifications in your browser settings.');
      }
    } else {
      alert('Push notifications are loading. Please try again in a moment.');
    }
  }

  /* ── Check if a match involves my teams ────────────── */
  function isMyMatch(match) {
    var selected = loadTeams();
    if (!selected.length) return false;
    return selected.some(function(id) {
      var team = findTeam(id);
      if (!team) return false;
      var name = team.name.toLowerCase();
      return (match.homeTeam||'').toLowerCase().indexOf(name) > -1 ||
             (match.awayTeam||'').toLowerCase().indexOf(name) > -1;
    });
  }

  function getNotifPrefs() { return loadNotifPrefs(); }

  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return {
    render        : render,
    _toggle       : toggle,
    _remove       : remove,
    _toggleNotif  : toggleNotif,
    _enablePush   : enablePush,
    isMyMatch     : isMyMatch,
    getNotifPrefs : getNotifPrefs
  };
})();
