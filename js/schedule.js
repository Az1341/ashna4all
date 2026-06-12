/* schedule.js — GoalCurrent.live
   Single-source schedule renderer.
   World Cup fixtures are read only from window.WC26.schedule.
*/
var GC_SCHEDULE = (function () {
  'use strict';

  var _league  = 'WC';
  var _date    = null;
  var _wcRound = 'group';
  var _wcDate  = null;

  var WC_ROUNDS = [
    {id:'group', label:'Group Stage', from:'2026-06-11', to:'2026-06-28'},
    {id:'r32',   label:'Round of 32', from:'2026-06-28', to:'2026-07-04'},
    {id:'r16',   label:'Round of 16', from:'2026-07-04', to:'2026-07-07'},
    {id:'qf',    label:'Quarter-finals', from:'2026-07-09', to:'2026-07-12'},
    {id:'sf',    label:'Semi-finals', from:'2026-07-14', to:'2026-07-15'},
    {id:'final', label:'Finals', from:'2026-07-18', to:'2026-07-19'}
  ];

  function esc(v){
    return String(v == null ? '' : v).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function todayLocalKey(){
    if(window.GC_DateTime && GC_DateTime.getTodayLocalDateKey) return GC_DateTime.getTodayLocalDateKey();
    if(window.GC_API && GC_API.today) return GC_API.today();
    var d = new Date();
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }

  function localDateKey(utc){
    if(window.GC_DateTime && GC_DateTime.getLocalDateKey) return GC_DateTime.getLocalDateKey(utc);
    var d = new Date(utc);
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }

  function localKickoff(utc){
    if(window.GC_DateTime && GC_DateTime.formatMatchCardTime) return GC_DateTime.formatMatchCardTime(utc);
    if(window.GC_API && GC_API.formatKickoff) return GC_API.formatKickoff(utc);
    var d = new Date(utc);
    return d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  }

  function longDate(iso){
    var d = new Date(iso + 'T12:00:00');
    if(isNaN(d.getTime())) return iso;
    if(iso === todayLocalKey()) return 'Today — ' + d.toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long'});
    return d.toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  }

  function flag(team){
    if(window.WC26 && WC26.flagUrl) return '<img src="'+esc(WC26.flagUrl(team))+'" alt="" class="gc-team-logo" style="width:26px;height:18px;object-fit:cover;border-radius:3px">';
    return '';
  }

  function schedule(){
    return (window.WC26 && WC26.schedule) ? WC26.schedule.slice() : [];
  }

  function stageOf(m){
    return m.stage || (m.group && m.group !== '—' ? 'Group Stage' : '');
  }

  function roundForStage(stage){
    stage = String(stage || '').toLowerCase();
    if(stage.indexOf('group') !== -1) return 'group';
    if(stage.indexOf('32') !== -1) return 'r32';
    if(stage.indexOf('16') !== -1) return 'r16';
    if(stage.indexOf('quarter') !== -1) return 'qf';
    if(stage.indexOf('semi') !== -1) return 'sf';
    if(stage.indexOf('final') !== -1 || stage.indexOf('third') !== -1) return 'final';
    return 'group';
  }

  function allLocalDatesForRound(roundId){
    var dates = {};
    schedule().forEach(function(m){
      if(roundForStage(stageOf(m)) === roundId) dates[localDateKey(m.utc)] = true;
    });
    return Object.keys(dates).sort();
  }

  function matchCard(m){
    var status = new Date(m.utc) > new Date() ? 'UPCOMING' : 'UPCOMING';
    var statusClass = new Date(m.utc) > new Date() ? 'upcoming' : 'live';
    return '<div class="gc-match-row">' +
      '<div class="gc-col-status"><span class="gc-status-pill '+statusClass+'">'+status+'</span></div>' +
      '<div class="gc-col-home">'+esc(m.home)+'</div>' +
      '<div class="gc-col-score" dir="ltr"><span class="gc-ko-time">'+esc(localKickoff(m.utc))+'</span></div>' +
      '<div class="gc-col-away">'+esc(m.away)+'</div>' +
      '<div class="gc-col-meta" dir="ltr">'+esc(stageOf(m))+'<br>'+esc(m.venue || '')+'</div>' +
    '</div>';
  }

  function buildDateButton(iso, selected, click){
    var d = new Date(iso + 'T12:00:00');
    var day = d.toLocaleDateString(undefined,{weekday:'short'});
    var num = d.getDate();
    var mon = d.toLocaleDateString(undefined,{month:'short'});
    return '<button class="gc-date-btn'+(selected?' gc-date-selected':'')+'" onclick="'+click.replace('{iso}', iso)+'">' +
      '<span>'+esc(day)+'</span><strong>'+esc(num)+'</strong><small>'+esc(mon)+'</small></button>';
  }

  function renderWC(container){
    if(!container) return;
    if(!_wcDate) _wcDate = todayLocalKey();

    var tabs = WC_ROUNDS.map(function(r){
      return '<button class="gc-round-tab'+(r.id===_wcRound?' active':'')+'" onclick="GC_SCHEDULE._wcRoundPick(\''+r.id+'\')">'+esc(r.label)+'</button>';
    }).join('');

    container.innerHTML =
      '<div style="padding:16px">' +
        '<div class="gc-section-title">🏆 FIFA World Cup 2026 Fixtures</div>' +
        '<div style="display:flex;gap:8px;overflow-x:auto;margin-bottom:12px">'+tabs+'</div>' +
        '<div id="gc-wc-datebar"></div>' +
        '<div class="gc-match-card" style="margin-top:12px"><div class="gc-match-head"><span id="gc-wc-date-title"></span><span class="gc-match-updated">Local time</span></div><div id="gc-wc-match-list"></div></div>' +
      '</div>';

    buildWCDateBar();
    loadWCDay();
  }

  function buildWCDateBar(){
    var el = document.getElementById('gc-wc-datebar');
    if(!el) return;
    var dates = allLocalDatesForRound(_wcRound);
    if(!dates.length){ el.innerHTML=''; return; }
    if(dates.indexOf(_wcDate) === -1) {
      var today = todayLocalKey();
      _wcDate = dates.indexOf(today) !== -1 ? today : dates[0];
    }
    el.innerHTML = '<div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:8px">' +
      dates.map(function(iso){ return buildDateButton(iso, iso === _wcDate, 'GC_SCHEDULE._wcDayPick(\'{iso}\')'); }).join('') +
      '</div>';
  }

  function loadWCDay(){
    var title = document.getElementById('gc-wc-date-title');
    var list = document.getElementById('gc-wc-match-list');
    if(!list) return;
    var matches = schedule().filter(function(m){
      return roundForStage(stageOf(m)) === _wcRound && localDateKey(m.utc) === _wcDate;
    }).sort(function(a,b){ return new Date(a.utc) - new Date(b.utc); });

    if(title) title.textContent = longDate(_wcDate) + ' — ' + matches.length + ' ' + (matches.length === 1 ? 'match' : 'matches');

    if(!matches.length){
      list.innerHTML = '<div style="padding:20px;text-align:center;color:#64748b">No World Cup fixtures on this local date.</div>';
      return;
    }
    list.innerHTML = matches.map(matchCard).join('');
  }

  function renderPL(container){
    container.innerHTML = '<div style="padding:16px"><div class="gc-section-title">🏴 Premier League</div><div class="gc-card" style="padding:16px;color:#64748b">Premier League data is handled by the Premier League pages.</div></div>';
  }

  function renderUCL(container){
    container.innerHTML = '<div style="padding:16px"><div class="gc-section-title">⭐ Champions League</div><div class="gc-card" style="padding:16px;color:#64748b">Champions League data is handled by the Champions League pages.</div></div>';
  }

  function renderAll(container){
    renderWC(container);
  }

  function render(container){
    if(!_date) _date = todayLocalKey();
    if(_league === 'WC') return renderWC(container);
    if(_league === 'PL') return renderPL(container);
    if(_league === 'UCL') return renderUCL(container);
    return renderAll(container);
  }

  function setLeague(t){
    _league = t || 'WC';
  }

  return {
    render: render,
    setLeague: setLeague,
    _pick: function(iso){ _date = iso; },
    _wcDayPick: function(iso){ _wcDate = iso; buildWCDateBar(); loadWCDay(); },
    _wcRoundPick: function(id){
      _wcRound = id;
      _wcDate = null;
      buildWCDateBar();
      loadWCDay();
    }
  };
})();
