/* Backward compatibility: the single WC26 fixture source is /js/worldcup-data.js. */
(function(){
  'use strict';
  window.WC26_OFFICIAL_FIXTURES = (window.WC26 && Array.isArray(window.WC26.schedule)) ? window.WC26.schedule : (window.WC26_OFFICIAL_FIXTURES || []);
}());
