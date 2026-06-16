/**
 * GoalCurrent.live — Editorial feature article interactions
 * Lightbox gallery, share buttons, copy link
 */
(function () {
  'use strict';

  var lightbox = document.getElementById('feaLightbox');
  if (!lightbox) return;

  var lightboxImg = lightbox.querySelector('.fea-lightbox-img');
  var lightboxCap = lightbox.querySelector('.fea-lightbox-cap');
  var closeBtn = lightbox.querySelector('.fea-lightbox-close');
  var prevBtn = lightbox.querySelector('.fea-lightbox-prev');
  var nextBtn = lightbox.querySelector('.fea-lightbox-next');

  var triggers = document.querySelectorAll('[data-gallery-index]');
  var gallery = [];
  var currentIndex = 0;
  var lastFocus = null;

  triggers.forEach(function (btn) {
    var img = btn.querySelector('img');
    if (!img) return;
    gallery.push({
      src: img.currentSrc || img.src,
      alt: img.alt || '',
      caption: btn.getAttribute('data-caption') || '',
      index: parseInt(btn.getAttribute('data-gallery-index'), 10) || 0
    });
    btn.addEventListener('click', function () {
      var idx = parseInt(btn.getAttribute('data-gallery-index'), 10) || 0;
      var pos = 0;
      for (var i = 0; i < gallery.length; i++) {
        if (gallery[i].index === idx) {
          pos = i;
          break;
        }
      }
      openLightbox(pos);
    });
  });

  gallery.sort(function (a, b) {
    return a.index - b.index;
  });

  function openLightbox(index) {
    if (!gallery[index]) return;
    lastFocus = document.activeElement;
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function updateLightbox() {
    var item = gallery[currentIndex];
    if (!item) return;
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    var counter = (currentIndex + 1) + ' / ' + gallery.length;
    lightboxCap.innerHTML =
      '<span class="fea-lightbox-counter">' + counter + '</span>' +
      (item.caption ? item.caption : item.alt);
    prevBtn.style.visibility = gallery.length > 1 ? 'visible' : 'hidden';
    nextBtn.style.visibility = gallery.length > 1 ? 'visible' : 'hidden';
  }

  function goPrev() {
    if (gallery.length < 2) return;
    currentIndex = (currentIndex - 1 + gallery.length) % gallery.length;
    updateLightbox();
  }

  function goNext() {
    if (gallery.length < 2) return;
    currentIndex = (currentIndex + 1) % gallery.length;
    updateLightbox();
  }

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', goPrev);
  nextBtn.addEventListener('click', goNext);

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goPrev();
    if (e.key === 'ArrowRight') goNext();
  });

  /* Share */
  var pageUrl = window.location.href;
  var pageTitle = document.querySelector('meta[property="og:title"]');
  var shareTitle = pageTitle ? pageTitle.getAttribute('content') : document.title;

  var fbBtn = document.getElementById('feaShareFacebook');
  if (fbBtn) {
    fbBtn.href =
      'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(pageUrl);
    fbBtn.setAttribute('target', '_blank');
    fbBtn.setAttribute('rel', 'noopener noreferrer');
  }

  var xBtn = document.getElementById('feaShareX');
  if (xBtn) {
    xBtn.href =
      'https://twitter.com/intent/tweet?url=' +
      encodeURIComponent(pageUrl) +
      '&text=' +
      encodeURIComponent(shareTitle);
    xBtn.setAttribute('target', '_blank');
    xBtn.setAttribute('rel', 'noopener noreferrer');
  }

  var waBtn = document.getElementById('feaShareWhatsApp');
  if (waBtn) {
    waBtn.href =
      'https://wa.me/?text=' +
      encodeURIComponent(shareTitle + ' ' + pageUrl);
    waBtn.setAttribute('target', '_blank');
    waBtn.setAttribute('rel', 'noopener noreferrer');
  }

  var copyBtn = document.getElementById('feaShareCopy');
  var copyMsg = document.getElementById('feaShareCopyMsg');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var done = function () {
        copyBtn.classList.add('is-copied');
        copyBtn.textContent = '✓ Link copied';
        if (copyMsg) {
          copyMsg.hidden = false;
          copyMsg.textContent = 'Link copied to clipboard.';
        }
        setTimeout(function () {
          copyBtn.classList.remove('is-copied');
          copyBtn.textContent = '🔗 Copy link';
          if (copyMsg) copyMsg.hidden = true;
        }, 2800);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(pageUrl).then(done).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }
    });
  }

  function fallbackCopy() {
    var ta = document.createElement('textarea');
    ta.value = pageUrl;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      copyBtn.classList.add('is-copied');
      copyBtn.textContent = '✓ Link copied';
    } catch (err) {
      /* silent */
    }
    document.body.removeChild(ta);
  }
})();
