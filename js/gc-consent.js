(function () {
  'use strict';

  if (localStorage.getItem('gc_consent')) return;

  var banner = document.createElement('div');
  banner.id = 'gc-consent-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Cookie consent');
  banner.style.cssText =
    'position:fixed;bottom:0;left:0;right:0;z-index:99999;' +
    'background:#1a1a1a;color:#fff;padding:14px 20px;' +
    'display:flex;align-items:center;justify-content:space-between;' +
    'flex-wrap:wrap;gap:12px;font-family:Verdana,Geneva,sans-serif;font-size:13px;' +
    'box-shadow:0 -4px 24px rgba(0,0,0,0.4);';

  var copy = document.createElement('p');
  copy.style.cssText = 'margin:0;flex:1;min-width:220px;line-height:1.5;color:#fff;';
  copy.innerHTML =
    'We use cookies to improve your experience and show personalised content. ' +
    'See our <a href="/cookies.html" style="color:#fff;text-decoration:underline">Cookie Policy</a> for details.';

  var btns = document.createElement('div');
  btns.style.cssText = 'display:flex;gap:8px;flex-shrink:0;';

  var declineBtn = document.createElement('button');
  declineBtn.type = 'button';
  declineBtn.textContent = 'Decline';
  declineBtn.style.cssText =
    'background:transparent;color:#ccc;border:1px solid #666;' +
    'padding:8px 18px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;';
  declineBtn.addEventListener('click', function () {
    localStorage.setItem('gc_consent', 'declined');
    banner.remove();
  });

  var acceptBtn = document.createElement('button');
  acceptBtn.type = 'button';
  acceptBtn.textContent = 'Accept';
  acceptBtn.style.cssText =
    'background:#7B0D1E;color:#fff;border:none;' +
    'padding:8px 18px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;';
  acceptBtn.addEventListener('click', function () {
    localStorage.setItem('gc_consent', 'accepted');
    banner.remove();
  });

  btns.appendChild(declineBtn);
  btns.appendChild(acceptBtn);
  banner.appendChild(copy);
  banner.appendChild(btns);

  function mount() {
    document.body.appendChild(banner);
  }

  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
