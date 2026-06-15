
(function(){
  'use strict';
  function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); }
  ready(function(){
    var sidebar=document.getElementById('gc-sidebar');
    var main=document.getElementById('gc-main')||document.getElementById('gc-page')||document.querySelector('main')||document.body;
    if(sidebar&&main){
      document.body.classList.add('gc-flow-shell');
      var oldHb=document.getElementById('gc-hamburger');
      var oldClose=document.getElementById('gc-sidebar-close');
      function replace(el){ if(!el) return null; var n=el.cloneNode(true); el.parentNode.replaceChild(n,el); return n; }
      var hb=replace(oldHb), close=replace(oldClose);
      function showSidebar(){document.body.classList.remove('gc-sidebar-hidden');}
      function hideSidebar(){document.body.classList.add('gc-sidebar-hidden');document.body.classList.remove('gc-sidebar-collapsed');}
      function toggleCollapse(){ if(document.body.classList.contains('gc-sidebar-hidden')) showSidebar(); else document.body.classList.toggle('gc-sidebar-collapsed'); }
      if(hb){hb.setAttribute('aria-label','Collapse or expand sidebar');hb.setAttribute('title','Collapse / expand sidebar');hb.addEventListener('click',toggleCollapse);}
      if(close){close.setAttribute('aria-label','Close sidebar');close.setAttribute('title','Close sidebar');close.addEventListener('click',hideSidebar);}
      document.addEventListener('keydown',function(e){ if(e.key==='Escape') hideSidebar(); });
    }

    /* Homepage: hosts + dynamic games-left counter */
    var statsRow=document.querySelector('.gc-stats-row');
    if(statsRow && !document.getElementById('gc-games-left-number')){
      var wrap=document.createElement('div');
      wrap.className='gc-hosts-counter-grid';
      wrap.innerHTML=''
        + '<section class="gc-hosts-panel" aria-label="World Cup hosts">'
        + '<div class="gc-hosts-title">3 Hosts</div>'
        + '<div class="gc-hosts-row"><div class="gc-host-pill">🇺🇸 USA</div><div class="gc-host-pill">🇲🇽 Mexico</div><div class="gc-host-pill">🇨🇦 Canada</div></div>'
        + '</section>'
        + '<section class="gc-games-left-panel" aria-label="Games left to play">'
        + '<div class="gc-games-left-title">Games Left to Play</div>'
        + '<div class="gc-games-left-num" id="gc-games-left-number">104</div>'
        + '<div class="gc-games-left-label" id="gc-games-left-label">104 Games Left</div>'
        + '<div class="gc-games-left-note">Updates instantly when a match is marked as played.</div>'
        + '<button class="gc-games-left-test" id="gc-games-left-test" type="button">Test: mark 1 game played</button>'
        + '</section>';
      statsRow.parentNode.insertBefore(wrap, statsRow.nextSibling);
      var total=(window.WC26&&Array.isArray(WC26.schedule))?WC26.schedule.length:104;
      function playedCount(){
        if(!(window.WC26&&Array.isArray(WC26.schedule))) return 0;
        return WC26.schedule.filter(function(m){return ['FT','AET','PEN'].indexOf(m.status)!==-1;}).length;
      }
      var played=playedCount();
      var number=document.getElementById('gc-games-left-number'), label=document.getElementById('gc-games-left-label');
      function update(){var left=Math.max(total-played,0); number.textContent=left; label.textContent=left===1?'1 Game Left':left+' Games Left';}
      var btn=document.getElementById('gc-games-left-test');
      if(btn) btn.addEventListener('click',function(){ if(played<total){played++;update();} });
      update();
    }

    /* Homepage: force flag images in hero match card instead of letter fallback */
    function flagCode(team){return (window.WC26&&WC26.flags&&WC26.flags[team])?WC26.flags[team]:'un';}
    function flagUrl(team){return 'https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/'+flagCode(team)+'.svg';}
    function applyFlagImgs(){
      var hn=document.getElementById('gc-om-home-name'), an=document.getElementById('gc-om-away-name');
      var hf=document.getElementById('gc-om-home-flag'), af=document.getElementById('gc-om-away-flag');
      if(hn&&hf&&hn.textContent.trim()) hf.innerHTML='<img src="'+flagUrl(hn.textContent.trim())+'" alt="'+hn.textContent.trim()+' flag" loading="lazy">';
      if(an&&af&&an.textContent.trim()) af.innerHTML='<img src="'+flagUrl(an.textContent.trim())+'" alt="'+an.textContent.trim()+' flag" loading="lazy">';
    }
    applyFlagImgs(); setInterval(applyFlagImgs,1000);

    /* Groups index: present all groups as real cards, not only buttons */
    var groupsNav=document.querySelector('main .gc-group-nav');
    if(groupsNav && !document.getElementById('gc-groups-overview-grid')){
      var groups={
        A:['Mexico','South Africa','Korea Republic','Czechia'],
        B:['Canada','Bosnia & Herzegovina','Qatar','Switzerland'],
        C:['Brazil','Morocco','Haiti','Scotland'],
        D:['USA','Paraguay','Australia','Turkey'],
        E:['Germany','Curaçao','Ivory Coast','Ecuador'],
        F:['Netherlands','Japan','Tunisia','New Zealand'],
        G:['Belgium','Egypt','Iran','New Caledonia'],
        H:['Spain','Cabo Verde','Saudi Arabia','Uruguay'],
        I:['France','Senegal','Iraq','Norway'],
        J:['Argentina','Algeria','Austria','Jordan'],
        K:['Portugal','DR Congo','Uzbekistan','Colombia'],
        L:['England','Croatia','Ghana','Panama']
      };
      if(window.WC26&&WC26.groups) groups=WC26.groups;
      var grid=document.createElement('section');
      grid.id='gc-groups-overview-grid';
      grid.className='gc-groups-overview-grid';
      grid.setAttribute('aria-label','All World Cup 2026 groups');
      var letters='ABCDEFGHIJKL'.split('');
      grid.innerHTML=letters.map(function(g){
        var teams=groups[g]||[];
        return '<article class="gc-group-overview-card"><h2>Group '+g+'</h2><div class="gc-group-overview-teams">'
          + teams.map(function(t){return '<div class="gc-group-overview-team"><img src="'+flagUrl(t)+'" alt="'+t+' flag" loading="lazy"><span>'+t+'</span></div>';}).join('')
          + '</div><div class="gc-group-overview-actions"><a href="/worldcup2026/groups/group-'+g.toLowerCase()+'/">Open Group '+g+'</a><a href="/worldcup2026/fixtures/">Fixtures</a></div></article>';
      }).join('');
      var actions=groupsNav.nextElementSibling;
      if(actions) actions.parentNode.insertBefore(grid, actions.nextSibling); else groupsNav.parentNode.appendChild(grid);
    }
  });
})();
