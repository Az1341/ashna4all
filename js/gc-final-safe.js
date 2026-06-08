(function(){
  'use strict';

  var FLAGS={
    'Mexico':'🇲🇽','South Africa':'🇿🇦','South Korea':'🇰🇷','Czech Republic':'🇨🇿','Czechia':'🇨🇿',
    'Canada':'🇨🇦','Bosnia & Herzegovina':'🇧🇦','Bosnia & Herz.':'🇧🇦','Qatar':'🇶🇦','Switzerland':'🇨🇭',
    'Brazil':'🇧🇷','Morocco':'🇲🇦','Haiti':'🇭🇹','Scotland':'🏴','USA':'🇺🇸','United States':'🇺🇸',
    'Paraguay':'🇵🇾','Australia':'🇦🇺','Turkey':'🇹🇷','Germany':'🇩🇪','Curaçao':'🇨🇼','Curacao':'🇨🇼',
    'Ivory Coast':'🇨🇮','Côte d\'Ivoire':'🇨🇮','Ecuador':'🇪🇨','Netherlands':'🇳🇱','Japan':'🇯🇵',
    'Sweden':'🇸🇪','Tunisia':'🇹🇳','Belgium':'🇧🇪','Egypt':'🇪🇬','Iran':'🇮🇷','New Zealand':'🇳🇿',
    'Spain':'🇪🇸','Cape Verde':'🇨🇻','Saudi Arabia':'🇸🇦','Uruguay':'🇺🇾','France':'🇫🇷','Senegal':'🇸🇳',
    'Iraq':'🇮🇶','Norway':'🇳🇴','Argentina':'🇦🇷','Algeria':'🇩🇿','Austria':'🇦🇹','Jordan':'🇯🇴',
    'Portugal':'🇵🇹','DR Congo':'🇨🇩','Uzbekistan':'🇺🇿','Colombia':'🇨🇴','England':'🏴',
    'Croatia':'🇭🇷','Ghana':'🇬🇭','Panama':'🇵🇦'
  };

  var CODES={
    'MX':'Mexico','ZA':'South Africa','KR':'South Korea','CZ':'Czech Republic',
    'CA':'Canada','BA':'Bosnia & Herzegovina','QA':'Qatar','CH':'Switzerland',
    'BR':'Brazil','MA':'Morocco','HT':'Haiti','SCO':'Scotland','SC':'Scotland',
    'US':'USA','USA':'USA','PY':'Paraguay','AU':'Australia','TR':'Turkey',
    'DE':'Germany','CW':'Curaçao','CI':'Ivory Coast','EC':'Ecuador',
    'NL':'Netherlands','JP':'Japan','SE':'Sweden','TN':'Tunisia',
    'BE':'Belgium','EG':'Egypt','IR':'Iran','NZ':'New Zealand',
    'ES':'Spain','CV':'Cape Verde','SA':'Saudi Arabia','UY':'Uruguay',
    'FR':'France','SN':'Senegal','IQ':'Iraq','NO':'Norway',
    'AR':'Argentina','DZ':'Algeria','AT':'Austria','JO':'Jordan',
    'PT':'Portugal','CD':'DR Congo','UZ':'Uzbekistan','CO':'Colombia',
    'ENG':'England','HR':'Croatia','GH':'Ghana','PA':'Panama'
  };

  function esc(s){
    return String(s).replace(/[&<>'"]/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c];
    });
  }

  function isInsideSidebar(el){
    return !!(el && el.closest('#gc-sidebar,#gcSidebar,#side,.gc-sidebar,.sidebar,.side'));
  }

  function flagFor(name){
    return FLAGS[name]||'';
  }

  function makeFlag(name,big){
    var f=flagFor(name);
    return f?'<span class="gc-safe-flag '+(big?'gc-safe-flag-lg':'')+'" aria-hidden="true">'+f+'</span>':'';
  }

  function normalName(text){
    var t=String(text||'').replace(/\s+/g,' ').trim();
    if(!t)return null;

    t=t.replace(/^[\u{1F1E6}-\u{1F1FF}\u{1F3F4}\u2600-\u27BF]+\s*/u,'').trim();

    var m=t.match(/^([A-Z]{2,3})\s+(.+)$/);
    if(m && CODES[m[1]]) t=m[2].trim();

    if(FLAGS[t]) return t;
    return null;
  }

  function alreadyFlagged(el){
    return !el||el.querySelector('.gc-safe-flag,.flag,img[src*="flagcdn"],img[alt][src*="flags"]');
  }

  function enhanceElement(el,big){
    if(!el || isInsideSidebar(el) || alreadyFlagged(el))return;

    var name=normalName(el.textContent);
    if(!name)return;

    el.innerHTML='<span class="gc-safe-teamline">'+makeFlag(name,big)+'<span>'+esc(name)+'</span></span>';
  }

  function enhanceFlags(){
    if(location.pathname==='/'||location.pathname==='/index.html')return;

    var selectors=[
      '.team-row',
      '.gc-team-row',
      '.wc-match-team span',
      '.gc-match-name',
      '.gc-tbl-name',
      '.gc-team-name',
      '.team-name',
      '.gc-fav-name',
      '.gc-all-card-name',
      '.gc-bracket-name',
      '.fixture-teams strong'
    ];

    document.querySelectorAll(selectors.join(',')).forEach(function(el){
      enhanceElement(el, el.classList.contains('team-name')||el.classList.contains('gc-team-name'));
    });

    document.querySelectorAll('td,li,a,span,div').forEach(function(el){
      if(isInsideSidebar(el))return;
      if(el.children.length>0 || alreadyFlagged(el))return;

      var name=normalName(el.textContent);
      if(!name)return;
      if(el.textContent.trim().length>40)return;

      el.innerHTML='<span class="gc-safe-teamline">'+makeFlag(name,false)+'<span>'+esc(name)+'</span></span>';
    });
  }

  function addNord(){
    if(document.querySelector('.gc-safe-nord,.gc-vpn-bar,.gc-ad-bar,#gc-nordvpn-bar,.nordvpn-banner'))return;

    var d=document.createElement('div');
    d.className='gc-safe-nord';
    d.innerHTML='🔒 <strong>Watching football abroad?</strong> Try NordVPN <a href="https://go.nordvpn.net/aff_c?offer_id=15&aff_id=148347" target="_blank" rel="noopener sponsored">Get NordVPN</a> <small>Affiliate link</small>';

    var f=document.querySelector('footer');
    if(f)f.parentNode.insertBefore(d,f);
    else document.body.appendChild(d);
  }

  function addCookie(){
    if(document.querySelector('#gc-cookie-banner,.cookie-banner,.gc-safe-cookie')||localStorage.getItem('gc_cookies')||localStorage.getItem('gc_cookie_choice'))return;

    var b=document.createElement('div');
    b.className='gc-safe-cookie';
    b.innerHTML='<p>We use cookies to improve your experience. See our <a href="/cookies.html">Cookie Policy</a>.</p><button class="reject" type="button">Decline</button><button class="accept" type="button">Accept</button>';

    document.body.appendChild(b);

    function hide(v){
      localStorage.setItem('gc_cookie_choice',v);
      b.classList.remove('show');
    }

    b.querySelector('.accept').onclick=function(){hide('accepted');};
    b.querySelector('.reject').onclick=function(){hide('declined');};

    if(!localStorage.getItem('gc_cookie_choice')){
      setTimeout(function(){b.classList.add('show');},900);
    }
  }

  function addSubscribe(){
    if(document.querySelector('#gc-sub-overlay,.subscribe-popup,.gc-safe-sub,.gc-sub-overlay'))return;

    var s=document.createElement('div');
    s.className='gc-safe-sub';
    s.innerHTML='<div class="gc-safe-sub-card"><h2>⚽ Stay Ahead of the Game</h2><p>Get World Cup 2026 goals, results and news straight to your inbox.</p><form action="https://6f3982fe.sibforms.com/serve/MUIFAAeE0hUslfMPz6bu9jEdklCxC0j3MKRhPltWSCDC_tVUwEcn-BPO3nLjIw2aSho06qiaVbJQeSm82mDriQMJMGfLswlCCKPLLfx0zUzMswOSlJdOlApYAZWAC_afmaPFWT15_roCfNbtYVtGFlMgKM1HGk_pVspxm85Bu_diOgScU9dhJ5759I1ylWVpHoPZGfmBCXXou9sSrQ==" method="POST" target="_blank"><input type="email" name="EMAIL" required placeholder="Your email address" autocomplete="email"><input type="hidden" name="locale" value="en"><button class="submit" type="submit">Subscribe Free</button></form><button class="close" type="button">Close</button><p style="font-size:12px;color:#64748b;margin-top:8px">Powered by Brevo · unsubscribe any time</p></div>';

    document.body.appendChild(s);

    s.querySelector('.close').onclick=function(){
      sessionStorage.setItem('gc_sub_closed','1');
      s.classList.remove('show');
    };

    s.querySelector('form').addEventListener('submit',function(){
      sessionStorage.setItem('gc_sub_closed','1');
      setTimeout(function(){s.classList.remove('show');},400);
    });

    if(!sessionStorage.getItem('gc_sub_closed')){
      setTimeout(function(){s.classList.add('show');},7000);
    }
  }

  function makeFavRemovable(){
    if(!/\/worldcup2026\/favourites\//.test(location.pathname))return;

    document.querySelectorAll('.gc-fav-card,.team-row.fav-item').forEach(function(card){
      if(card.querySelector('.gc-safe-fav-remove'))return;

      var name=(card.textContent||'').replace('✕','').trim().split('\n')[0].trim();
      if(!name)return;

      var btn=document.createElement('button');
      btn.className='gc-safe-fav-remove';
      btn.type='button';
      btn.textContent='Remove';

      btn.onclick=function(e){
        e.preventDefault();
        e.stopPropagation();

        try{
          var f=JSON.parse(localStorage.getItem('wc26_favourites')||'[]').filter(function(x){
            return x!==name;
          });
          localStorage.setItem('wc26_favourites',JSON.stringify(f));
          card.remove();
        }catch(err){
          card.remove();
        }
      };

      card.appendChild(btn);
    });
  }

  function run(){
    enhanceFlags();
    addNord();
    addCookie();
    addSubscribe();
    makeFavRemovable();
    setTimeout(enhanceFlags,300);
    setTimeout(makeFavRemovable,500);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',run);
  }else{
    run();
  }

})();