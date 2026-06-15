(function(){
  'use strict';
  function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); }
  ready(function(){
    /* GLOBAL SIDEBAR: normal-flow desktop column, sticky, collapsible, closable. */
    var sidebar=document.getElementById('gc-sidebar') || document.getElementById('sidebar') || document.querySelector('aside.sidebar');
    var main=document.getElementById('gc-main') || document.getElementById('gc-page') || document.querySelector('.main') || document.querySelector('main');
    if(sidebar && main){
      document.body.classList.add('gc-flow-shell');
      document.body.classList.remove('gc-sidebar-hidden');

      if(!document.getElementById('gc-sidebar-controlbar')){
        var bar=document.createElement('div');
        bar.id='gc-sidebar-controlbar';
        bar.className='gc-sidebar-controlbar';
        bar.innerHTML='<button type="button" id="gc-sidebar-collapse-btn" aria-label="Collapse or expand sidebar" title="Collapse / expand sidebar">☰</button><button type="button" id="gc-sidebar-close-btn" aria-label="Close sidebar" title="Close sidebar">×</button>';
        sidebar.insertBefore(bar, sidebar.firstChild);
      }

      function showSidebar(){
        document.body.classList.remove('gc-sidebar-hidden');
        sidebar.classList.add('open');
      }
      function hideSidebar(){
        document.body.classList.add('gc-sidebar-hidden');
        document.body.classList.remove('gc-sidebar-collapsed');
        sidebar.classList.remove('open');
      }
      function toggleCollapse(){
        if(document.body.classList.contains('gc-sidebar-hidden')) showSidebar();
        else document.body.classList.toggle('gc-sidebar-collapsed');
      }

      var collapse=document.getElementById('gc-sidebar-collapse-btn');
      var close=document.getElementById('gc-sidebar-close-btn');
      if(collapse) collapse.addEventListener('click', toggleCollapse);
      if(close) close.addEventListener('click', hideSidebar);

      /* Rewire existing hamburger/menu buttons to show/collapse the sidebar rather than opening an old overlay only. */
      var buttons=[];
      ['gc-hamburger'].forEach(function(id){var el=document.getElementById(id); if(el) buttons.push(el);});
      Array.prototype.forEach.call(document.querySelectorAll('.hamb,[onclick*="openSidebar"]'),function(el){ if(buttons.indexOf(el)===-1) buttons.push(el); });
      buttons.forEach(function(btn){
        btn.removeAttribute('onclick');
        btn.setAttribute('aria-label','Open, collapse or expand sidebar');
        btn.addEventListener('click',function(e){e.preventDefault();toggleCollapse();});
      });

      window.openSidebar=showSidebar;
      window.closeSidebar=hideSidebar;
      document.addEventListener('keydown',function(e){ if(e.key==='Escape') hideSidebar(); });
    }

    /* Shared games-left model. Uses WC26.schedule when available; otherwise assumes 104 matches. */
    function getSchedule(){return (window.WC26 && Array.isArray(window.WC26.schedule)) ? window.WC26.schedule : null;}
    function getTotal(){var s=getSchedule(); return s ? s.length : 104;}
    function getPlayed(){
      var s=getSchedule();
      if(!s) return 0;
      return s.filter(function(m){
        var st=String(m.status || m.state || '').toUpperCase();
        return st==='FT' || st==='AET' || st==='PEN' || st==='FINISHED' || st==='FULL TIME';
      }).length;
    }
    function renderCounter(numberEl,labelEl,playedRef){
      var left=Math.max(getTotal()-playedRef.value,0);
      if(numberEl) numberEl.textContent=left;
      if(labelEl) labelEl.textContent=left===1?'1 Game Left':left+' Games Left';
    }

    /* Homepage: hosts + prominent Games Left box next to 3 hosts/stat area. */
    var homeStats=document.querySelector('.gc-stats-row');
    if(homeStats && !document.getElementById('gc-games-left-number')){
      var wrap=document.createElement('div');
      wrap.className='gc-hosts-counter-grid';
      wrap.innerHTML=''
        + '<section class="gc-hosts-panel" aria-label="World Cup host nations">'
        + '<div class="gc-hosts-title">3 Hosts</div>'
        + '<div class="gc-hosts-row"><div class="gc-host-pill">🇺🇸 USA</div><div class="gc-host-pill">🇲🇽 Mexico</div><div class="gc-host-pill">🇨🇦 Canada</div></div>'
        + '</section>'
        + '<section class="gc-games-left-panel" aria-label="Games left to play">'
        + '<div class="gc-games-left-title">Games Left to Play</div>'
        + '<div class="gc-games-left-num" id="gc-games-left-number"></div>'
        + '<div class="gc-games-left-label" id="gc-games-left-label"></div>'
        + '<div class="gc-games-left-note">Updates instantly when a match is marked as played.</div>'
        + '<button class="gc-games-left-test" id="gc-games-left-test" type="button">Test: mark 1 game played</button>'
        + '</section>';
      homeStats.parentNode.insertBefore(wrap, homeStats.nextSibling);
      var playedHome={value:getPlayed()};
      var num=document.getElementById('gc-games-left-number'), lab=document.getElementById('gc-games-left-label');
      renderCounter(num,lab,playedHome);
      var btn=document.getElementById('gc-games-left-test');
      if(btn) btn.addEventListener('click',function(){ if(playedHome.value<getTotal()){playedHome.value++;renderCounter(num,lab,playedHome);} });
    }

    /* World Cup internal pages: add a compact counter near the existing 48/104/16/3 metrics row, without touching group cards. */
    var metrics=document.querySelector('.metrics');
    if(metrics && !document.getElementById('gc-games-left-inline')){
      var inline=document.createElement('section');
      inline.id='gc-games-left-inline';
      inline.className='gc-games-left-inline';
      inline.innerHTML='<div><div class="gc-games-left-title">Games Left to Play</div><div class="gc-games-left-note">Calculated from finished matches in World Cup data.</div></div><div class="gc-games-left-num" id="gc-games-left-inline-number"></div><button class="gc-games-left-test" id="gc-games-left-inline-test" type="button">Test -1</button>';
      metrics.parentNode.insertBefore(inline, metrics.nextSibling);
      var playedInline={value:getPlayed()};
      var n2=document.getElementById('gc-games-left-inline-number');
      renderCounter(n2,null,playedInline);
      var b2=document.getElementById('gc-games-left-inline-test');
      if(b2) b2.addEventListener('click',function(){ if(playedInline.value<getTotal()){playedInline.value++;renderCounter(n2,null,playedInline);} });
    }

    /* Homepage: force real flag images in next-match card after the existing inline script writes emoji/initials. */
    function flagCode(team){
      if(window.WC26 && WC26.flags && WC26.flags[team]) return WC26.flags[team];
      var map={
        'Spain':'es','Cabo Verde':'cv','Cape Verde':'cv','Mexico':'mx','South Africa':'za','Korea Republic':'kr','South Korea':'kr','Czechia':'cz','Czech Republic':'cz','England':'gb-eng','Croatia':'hr','Ghana':'gh','Panama':'pa','France':'fr','Senegal':'sn','Iraq':'iq','Norway':'no','USA':'us','United States':'us','Canada':'ca','Brazil':'br','Argentina':'ar','Portugal':'pt','Germany':'de','Italy':'it','Netherlands':'nl','Belgium':'be','Morocco':'ma','Japan':'jp','Australia':'au','Turkey':'tr','Türkiye':'tr','Ecuador':'ec',"Côte d'Ivoire":'ci','Ivory Coast':'ci'
      };
      return map[team] || 'un';
    }
    function flagUrl(team){return 'https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/'+flagCode(team)+'.svg';}
    function imgHtml(team){return '<img src="'+flagUrl(team)+'" alt="'+team.replace(/"/g,'&quot;')+' flag" loading="lazy">';}
    function applyHomeFlags(){
      var hn=document.getElementById('gc-om-home-name'), an=document.getElementById('gc-om-away-name');
      var hf=document.getElementById('gc-om-home-flag'), af=document.getElementById('gc-om-away-flag');
      if(hn && hf && hn.textContent.trim()) hf.innerHTML=imgHtml(hn.textContent.trim());
      if(an && af && an.textContent.trim()) af.innerHTML=imgHtml(an.textContent.trim());
    }
    applyHomeFlags();
    setTimeout(applyHomeFlags,300);
    setTimeout(applyHomeFlags,1200);
  });
})();
