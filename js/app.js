/* app.js - disabled on homepage */
if(document.querySelector('.ucl-hero')||document.querySelector('.wc-card')||document.querySelector('.ucl-card')){
  window.GC={go:function(){},draw:function(){},init:function(){},getType:function(){return'ALL'},setLeague:function(){}};
  window.GC_HOME={render:function(){},setLeague:function(){}};
} else {
  document.addEventListener('DOMContentLoaded',function(){
    document.querySelectorAll('[data-page="home"]').forEach(function(btn){
      btn.addEventListener('click',function(e){
        e.preventDefault();
        window.location.href='/';
      });
    });
  });
}
