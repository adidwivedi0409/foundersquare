/* Founder Square: the little bit of script the site needs. No animation libraries. */
(function () {
  'use strict';
  var CONTACT = 'adityadwivedi0409@gmail.com';   // one address, used everywhere
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* every mailto, address and copy button uses CONTACT */
  $$('a[href^="mailto:"]').forEach(function (a) {
    a.setAttribute('href', a.getAttribute('href').replace(/^mailto:[^?]*/, 'mailto:' + CONTACT));
  });
  $$('[data-email]').forEach(function (el) { el.textContent = CONTACT; });
  $$('[data-copy]').forEach(function (b) {
    var label = b.textContent;
    b.addEventListener('click', function () {
      function done() { b.textContent = 'Copied'; setTimeout(function () { b.textContent = label; }, 1400); }
      function fallback() { window.prompt('Copy the address', CONTACT); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(CONTACT).then(done, fallback);
      else fallback();
    });
  });

  /* mobile menu */
  var burger = $('.burger'), nav = $('#nav');
  function closeMenu() { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) nav.querySelector('a').focus();
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); burger.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !e.target.closest('.hdr')) closeMenu();
    });
  }

  /* countdown to doors (Build Night 01, Sat Nov 14 2026, 6 PM Pacific) */
  var DOORS = new Date('2026-11-14T18:00:00-08:00').getTime();
  var WRAP = DOORS + 8 * 3600 * 1000;
  var cd = $('#countdown');
  if (cd) {
    var u = { d: $('[data-cd="d"]', cd), h: $('[data-cd="h"]', cd), m: $('[data-cd="m"]', cd), s: $('[data-cd="s"]', cd) };
    var state = $('#boardState');
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var tick = function () {
      var now = Date.now(), left = DOORS - now;
      if (left <= 0) {
        Object.keys(u).forEach(function (k) { if (u[k]) u[k].textContent = '00'; });
        if (state) state.textContent = now < WRAP ? 'Doors are open' : 'That was Build Night 01';
        return;
      }
      var s = Math.floor(left / 1000);
      var d = Math.floor(s / 86400); s -= d * 86400;
      var h = Math.floor(s / 3600); s -= h * 3600;
      var m = Math.floor(s / 60); s -= m * 60;
      if (u.d) u.d.textContent = pad(d);
      if (u.h) u.h.textContent = pad(h);
      if (u.m) u.m.textContent = pad(m);
      if (u.s) u.s.textContent = pad(s);
    };
    tick();
    setInterval(tick, 1000);
  }
})();
