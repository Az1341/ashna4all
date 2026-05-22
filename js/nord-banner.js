/* ============================================================
   NordVPN Campaign Banner — 27 May to 29 July 2026
   Automatically replaces the NordVPN bar with new banners
   ============================================================ */
(function() {

  var AFFILIATE_URL = 'https://go.nordvpn.net/aff_c?offer_id=15&aff_id=148347&url_id=902';

  var BANNERS = {
    mobile:  '/ads/affiliate-global-next-generation-antivirus-campaign-en-uk-320x50.png',
    tablet:  '/ads/affiliate-global-next-generation-antivirus-campaign-en-uk-320x100.png',
    desktop: '/ads/affiliate-global-next-generation-antivirus-campaign-en-uk-728x90-1.png'
  };

  function getBanner() {
    var w = window.innerWidth;
    if (w >= 768) return BANNERS.desktop;
    if (w >= 400) return BANNERS.tablet;
    return BANNERS.mobile;
  }

  function injectStyle() {
    var s = document.createElement('style');
    s.textContent = [
      '#gc-nordvpn-bar{padding:0!important;background:transparent!important;border:none!important;box-shadow:none!important;display:block!important;gap:0!important}',
      '#gc-nord-img-wrap{display:block;text-align:center;background:#0a0a1a;padding:6px 0;text-decoration:none}',
      '#gc-nord-img-wrap img{max-width:100%;height:auto;display:inline-block;vertical-align:middle}',
      '#gc-nord-label{text-align:center;font-size:9px;color:#475569;background:#0a0a1a;padding:2px 0;font-family:Verdana,sans-serif}'
    ].join('');
    document.head.appendChild(s);
  }

  function buildBanner(bar) {
    injectStyle();

    bar.innerHTML =
      '<a id="gc-nord-img-wrap" href="' + AFFILIATE_URL + '" target="_blank" rel="noopener sponsored">' +
        '<img src="' + getBanner() + '" alt="NordVPN — Get 75% off + 3 months extra" ' +
             'onerror="document.getElementById(\'gc-nordvpn-bar\').innerHTML=\'<div style=&quot;display:flex;align-items:center;justify-content:center;gap:12px;background:rgba(11,31,58,0.93);padding:10px 20px&quot;><span style=&quot;color:#fff;font-size:12px;font-family:Verdana,sans-serif&quot;>🔒 NordVPN — 75% off + 3 months FREE</span><a href=\\\'' + AFFILIATE_URL + '\\\' target=&quot;_blank&quot; style=&quot;background:#1dbf73;color:#fff;padding:7px 16px;border-radius:8px;font-size:12px;font-weight:700;text-decoration:none;font-family:Verdana,sans-serif&quot;>Get the Deal</a></div>\'">' +
      '</a>' +
      '<div id="gc-nord-label">#AD · Paid partnership with NordVPN</div>';
  }

  function init() {
    var bar = document.getElementById('gc-nordvpn-bar');
    if (bar) {
      buildBanner(bar);
    } else {
      var ob = new MutationObserver(function() {
        var b = document.getElementById('gc-nordvpn-bar');
        if (b) { ob.disconnect(); buildBanner(b); }
      });
      ob.observe(document.body, { childList: true, subtree: true });
      setTimeout(function(){ ob.disconnect(); }, 10000);
    }

    /* Update banner on resize */
    window.addEventListener('resize', function() {
      var img = document.querySelector('#gc-nord-img-wrap img');
      if (img) img.src = getBanner();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();