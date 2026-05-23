/* NordVPN Campaign Banner — 27 May to 29 July 2026 */
(function() {
  var VPN_URL  = 'https://go.nordvpn.net/aff_c?offer_id=15&aff_id=148347&url_id=902';
  var PASS_URL = 'https://go.nordpass.io/aff_c?offer_id=488&aff_id=148347&url_id=9356';
  /* Image paths — uploaded to GitHub root */
  var IMG_MOBILE  = '/affiliate-global-next-generation-antivirus-campaign-en-uk-320x50.png';
  var IMG_TABLET  = '/affiliate-global-next-generation-antivirus-campaign-en-uk-320x100.png';
  var IMG_DESKTOP = '/affiliate-global-next-generation-antivirus-campaign-en-uk-728x90-1.png';

  /* ✅ AFFILIATE NOTICE — shown under all versions of the banner */
  var AFFILIATE_NOTICE =
    '<div style="text-align:center;font-size:9px;color:#475569;background:#0a0a1a;padding:2px 0 3px;font-family:Verdana,sans-serif">' +
      '#AD · Paid partnership with NordVPN · ' +
      '<a href="/disclaimer" style="color:#475569;text-decoration:underline">Affiliate link</a>' +
      ' — we may earn a commission if you purchase through our link, at no extra cost to you.' +
    '</div>';

  function getImg() {
    return window.innerWidth >= 768 ? IMG_DESKTOP :
           window.innerWidth >= 400 ? IMG_TABLET  : IMG_MOBILE;
  }

  function fallbackBar() {
    return '<div style="display:flex;align-items:center;justify-content:center;gap:10px;background:rgba(11,31,58,0.95);padding:10px 16px;flex-wrap:wrap">' +
      '<span style="color:#fff;font-size:12px;font-family:Verdana,sans-serif;font-weight:600">🔒 NordVPN — 75% off + 3 months FREE · Next-Gen Antivirus included</span>' +
      '<a href="' + VPN_URL + '" target="_blank" rel="noopener sponsored" style="background:#1dbf73;color:#fff;padding:7px 14px;border-radius:8px;font-size:12px;font-weight:700;text-decoration:none;font-family:Verdana,sans-serif;white-space:nowrap">Get the Deal →</a>' +
      '<a href="' + PASS_URL + '" target="_blank" rel="noopener sponsored" style="background:#0066cc;color:#fff;padding:7px 14px;border-radius:8px;font-size:12px;font-weight:700;text-decoration:none;font-family:Verdana,sans-serif;white-space:nowrap">NordPass</a>' +
    '</div>' +
    /* ✅ AFFILIATE NOTICE added here — fallback bar version */
    AFFILIATE_NOTICE;
  }

  function buildBanner(bar) {
    bar.style.cssText = 'position:fixed;bottom:var(--nav-h,64px);left:var(--sb-w,240px);right:0;width:auto;z-index:150;display:block;padding:0;background:transparent;border:none;box-shadow:none;gap:0';
    var img = new Image();
    img.onload = function() {
      /* Image loaded successfully — show banner image */
      bar.innerHTML =
        '<a href="' + VPN_URL + '" target="_blank" rel="noopener sponsored" style="display:block;text-align:center;background:#0a0a1a;padding:6px 0;line-height:0">' +
          '<img src="' + getImg() + '" alt="NordVPN 75% off + 3 months extra" style="max-width:100%;height:auto;display:inline-block;vertical-align:middle">' +
        '</a>' +
        /* ✅ AFFILIATE NOTICE added here — image banner version */
        AFFILIATE_NOTICE;
    };
    img.onerror = function() {
      /* Image failed — show styled text fallback */
      bar.innerHTML = fallbackBar();
    };
    img.src = getImg();
    /* Update on resize */
    window.addEventListener('resize', function() {
      var imgEl = bar.querySelector('img');
      if (imgEl) imgEl.src = getImg();
    });
  }

  /* Fix bottom position on desktop */
  var style = document.createElement('style');
  style.textContent = '@media(min-width:769px){#gc-nordvpn-bar{bottom:0!important;left:var(--sb-w,240px)!important;right:0!important;width:auto!important}}@media(max-width:768px){#gc-nordvpn-bar{left:0!important;width:100%!important}}';
  document.head.appendChild(style);

  function init() {
    var bar = document.getElementById('gc-nordvpn-bar');
    if (bar) {
      buildBanner(bar);
    } else {
      var ob = new MutationObserver(function() {
        var b = document.getElementById('gc-nordvpn-bar');
        if (b) { ob.disconnect(); buildBanner(b); }
      });
      ob.observe(document.body, { childList:true, subtree:true });
      setTimeout(function(){ ob.disconnect(); }, 10000);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
