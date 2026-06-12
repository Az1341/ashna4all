/* home.js — GoalCurrent.live
   Senior safe build: no duplicate World Cup fixture database.
   World Cup data is read only from window.WC26.
*/
var GC_HOME = (function () {
  'use strict';

  var _league = 'WC';
  var _wcGroupIndex = 0;

  function esc(v){
    return String(v == null ? '' : v).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function todayLocalKey(){
    if(window.GC_DateTime && GC_DateTime.getTodayLocalDateKey) return GC_DateTime.getTodayLocalDateKey();
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
    var d = new Date(utc);
    return d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  }

  function longDate(dateKey){
    var d = new Date(dateKey + 'T12:00:00');
    return d.toLocaleDateString(undefined,{weekday:'long', day:'numeric', month:'long', year:'numeric'});
  }

  function flag(team){
    if(window.WC26 && WC26.flagUrl) return '<img src="'+esc(WC26.flagUrl(team))+'" alt="" style="width:28px;height:20px;object-fit:cover;border-radius:3px;box-shadow:0 1px 3px rgba(0,0,0,.18)">';
    return '🏳️';
  }

  function getGroups(){
    if(!window.WC26 || !WC26.groups) return [];
    return Object.keys(WC26.groups).sort().map(function(k){
      return { name:k, teams:WC26.groups[k] || [] };
    });
  }

  function getSchedule(){
    return (window.WC26 && WC26.schedule) ? WC26.schedule.slice() : [];
  }

  function cardShell(title, body, actionHtml){
    return '<div class="gc-card" style="padding:16px;margin-bottom:14px">' +
      '<div style="font-family:var(--font-head,Arial);font-size:1rem;font-weight:800;color:#003fb8;margin-bottom:10px">'+title+'</div>' +
      body + (actionHtml || '') + '</div>';
  }

  function fixtureRow(m){
    return '<div style="display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center;padding:10px 0;border-bottom:1px solid rgba(37,99,235,.09)">' +
      '<div style="display:flex;align-items:center;gap:8px;justify-content:flex-end;text-align:right;font-weight:700;color:#0f172a">'+esc(m.home)+' '+flag(m.home)+'</div>' +
      '<div style="text-align:center;min-width:96px"><div style="font-family:var(--font-head,Arial);font-size:1rem;font-weight:800;color:#1d4ed8">'+esc(localKickoff(m.utc))+'</div><div style="font-size:.68rem;color:#64748b;font-weight:700">'+esc(m.stage || ('Group '+m.group))+'</div></div>' +
      '<div style="display:flex;align-items:center;gap:8px;text-align:left;font-weight:700;color:#0f172a">'+flag(m.away)+' '+esc(m.away)+'</div>' +
      '<div style="grid-column:1 / -1;font-size:.72rem;color:#64748b;text-align:center">🏟 '+esc(m.venue || '')+' · 📺 '+esc(m.ukBroadcaster || '')+'</div>' +
    '</div>';
  }

  function renderToday(container){
    var key = todayLocalKey();
    var matches = getSchedule().filter(function(m){ return localDateKey(m.utc) === key; })
      .sort(function(a,b){ return new Date(a.utc) - new Date(b.utc); });

    var body = '<div style="font-size:.82rem;color:#64748b;margin-bottom:12px">Verified World Cup fixtures for '+esc(longDate(key))+'.</div>';
    if(matches.length){
      body += matches.map(fixtureRow).join('');
    } else {
      body += '<div style="padding:18px;text-align:center;color:#64748b;background:rgba(255,255,255,.65);border-radius:12px">No World Cup fixtures today.</div>';
    }

    container.innerHTML =
      '<div style="padding:16px">' +
      '<div style="background:linear-gradient(135deg,#001a4d,#003fb8);color:#fff;border-radius:18px;padding:18px;margin-bottom:14px;text-align:center">' +
        '<div style="font-size:.72rem;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.72)">GoalCurrent.live</div>' +
        '<div style="font-family:var(--font-head,Arial);font-size:2rem;font-weight:900;margin-top:4px">FIFA World Cup 2026</div>' +
        '<div style="font-size:.85rem;color:rgba(255,255,255,.72);margin-top:4px">Live scores · Fixtures · Groups · Teams · News</div>' +
      '</div>' +
      cardShell('🏆 Today Fixtures — World Cup 2026', body, '<a href="/worldcup2026/fixtures/" class="gc-btn gc-btn-primary" style="display:inline-block;margin-top:12px;text-decoration:none;text-align:center">View all fixtures →</a>') +
      '</div>';
  }

  function renderWCGroup(container, idx){
    var groups = getGroups();
    if(!groups.length){ container.innerHTML='<div class="gc-card" style="padding:16px">World Cup data not loaded.</div>'; return; }
    _wcGroupIndex = Math.max(0, Math.min(idx || 0, groups.length - 1));
    var g = groups[_wcGroupIndex];
    var matches = getSchedule().filter(function(m){ return String(m.group) === String(g.name); })
      .sort(function(a,b){ return new Date(a.utc) - new Date(b.utc); });

    var teamsHtml = g.teams.map(function(t){
      return '<div style="display:grid;grid-template-columns:36px 1fr 32px 32px 32px 42px;gap:6px;align-items:center;padding:10px 12px;border-top:1px solid rgba(37,99,235,.08);background:rgba(255,255,255,.58)">' +
        '<span>'+flag(t)+'</span><strong>'+esc(t)+'</strong><span style="text-align:center;color:#64748b">0</span><span style="text-align:center;color:#64748b">0</span><span style="text-align:center;color:#64748b">0</span><strong style="text-align:right;color:#2563eb">0</strong></div>';
    }).join('');

    var nav = '<div style="display:flex;justify-content:space-between;align-items:center;margin:0 0 12px">' +
      (_wcGroupIndex>0 ? '<button onclick="GC_HOME._wcNav('+(_wcGroupIndex-1)+')" class="gc-round-tab">← Group '+esc(groups[_wcGroupIndex-1].name)+'</button>' : '<span></span>') +
      '<strong style="color:#003fb8">Group '+esc(g.name)+'</strong>' +
      (_wcGroupIndex<groups.length-1 ? '<button onclick="GC_HOME._wcNav('+(_wcGroupIndex+1)+')" class="gc-round-tab">Group '+esc(groups[_wcGroupIndex+1].name)+' →</button>' : '<span></span>') +
    '</div>';

    container.innerHTML = '<div style="padding:16px">' + nav +
      '<div class="gc-card" style="overflow:hidden;margin-bottom:14px">' +
        '<div style="display:grid;grid-template-columns:36px 1fr 32px 32px 32px 42px;gap:6px;padding:8px 12px;background:#dbeafe;color:#2563eb;font-size:.68rem;font-weight:800;text-transform:uppercase"><span></span><span>Team</span><span style="text-align:center">P</span><span style="text-align:center">W</span><span style="text-align:center">D</span><span style="text-align:right">Pts</span></div>' +
        teamsHtml +
      '</div>' +
      cardShell('📅 Group '+esc(g.name)+' Fixtures', matches.length ? matches.map(fixtureRow).join('') : '<div style="color:#64748b">No fixtures found for this group.</div>') +
      '</div>';
  }

  function renderWC(container){
    renderWCGroup(container, _wcGroupIndex);
  }

  function renderPL(container){
    container.innerHTML = '<div style="padding:16px">' +
      cardShell('🏴 Premier League', '<div style="color:#64748b">Season complete. Use the Premier League section for final table, fixtures and news.</div>', '<a href="/premier-league/" class="gc-btn gc-btn-primary" style="display:inline-block;margin-top:12px;text-decoration:none">Open Premier League →</a>') +
      '</div>';
  }

  function renderUCL(container){
    container.innerHTML = '<div style="padding:16px">' +
      cardShell('⭐ Champions League', '<div style="color:#64748b">Use the Champions League section for fixtures, results and news.</div>', '<a href="/ucl/" class="gc-btn gc-btn-primary" style="display:inline-block;margin-top:12px;text-decoration:none">Open Champions League →</a>') +
      '</div>';
  }

  function render(container){
    if(!container) return;
    if(_league === 'PL') return renderPL(container);
    if(_league === 'UCL') return renderUCL(container);
    if(_league === 'WC') return renderWC(container);
    return renderToday(container);
  }

  function setLeague(t){
    _league = t || 'WC';
  }

  return {
    render: render,
    setLeague: setLeague,
    _wcNav: function(idx){
      var el = document.getElementById('gc-content') || document.getElementById('gc-main') || document.body;
      renderWCGroup(el, idx);
    },
    _viewTeam: function(groupIdx, teamIdx){
      var groups=getGroups();
      var team=groups[groupIdx] && groups[groupIdx].teams[teamIdx];
      if(!team) return;
      var el = document.getElementById('gc-content') || document.getElementById('gc-main') || document.body;
      el.innerHTML='<div style="padding:16px"><button onclick="GC_HOME._wcNav('+groupIdx+')" class="gc-round-tab">← Back to Group '+esc(groups[groupIdx].name)+'</button>'+cardShell(flag(team)+' '+esc(team), '<div style="color:#64748b">Official squad information will be displayed when confirmed.</div>')+'</div>';
    },
    _wcTab: function(btn, tab, idx){
      var el = document.getElementById('gc-content') || document.getElementById('gc-main') || document.body;
      renderWCGroup(el, idx);
    },
    _subscribe: function(){
      var input = document.getElementById('gc-email-input');
      if(!input || !input.value || input.value.indexOf('@') < 0) return;
      window.open('https://6f3982fe.sibforms.com/serve/MUIFAAeE0hUslfMPz6bu9jEdklCxC0j3MKRhPltWSCDC_tVUwEcn-BPO3nLjIw2aSho06qiaVbJQeSm82mDriQMJMGfLswlCCKPLLfx0zUzMswOSlJdOlApYAZWAC_afmaPFWT15_roCfNbtYVtGFlMgKM1HGk_pVspxm85Bu_diOgScU9dhJ5759I1ylWVpHoPZGfmBCXXou9sSrQ==','_blank','noopener');
    }
  };
})();
