/* Founder Square site behaviours (shared by every page): Lenis + GSAP scroll clock, line-art scenes, countdown, reveals, menu, FAQ. Every feature guards on its elements existing. */

(function () {
  'use strict';

  /* =====================================================================
     A. SETUP + HELPERS
     ===================================================================== */
  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof gsap !== 'undefined';
  var pad = function (n) { return String(n).padStart(2, '0'); };
  // bottom edge of the stuck header in viewport coordinates (includes any safe-area inset)
  var headerH = function () { var h = $('#hdr'); return h ? Math.max(61, Math.round(h.getBoundingClientRect().bottom)) : 61; };
  // One failing feature must never blank the page: each block runs in its own try.
  function safe(name, fn) { try { return fn(); } catch (e) { if (window.console) console.error('[build night] ' + name, e); } }
  var introDone = false;
  var revealTweens = [];      // every scroll-gated reveal tween; the guard can play them
  var guardTick = null;       // assigned by the motion context; un-hides anything in view

  // Safety: the hero, header cells and ticker are hidden by .js until the load
  // timeline lifts them; whatever happens they are visible within 3s.
  function showShell() { $$('.hero, .hdr > .hcell, .marquee, .page-head .rise').forEach(function (el) { el.style.visibility = 'visible'; }); }
  setTimeout(showShell, 3000);
  // Deep links are handled after init (see the end of init): the head script
  // removed the hash so the browser does not jump early; we start at the top,
  // the hero sequence plays, and the page glides to the section.
  try { history.scrollRestoration = 'manual'; } catch (e) {}

  /* --- contact address: ONE place to change it. PLACEHOLDER until launch. --- */
  var CONTACT = 'sponsors@foundersquare.example';
  $$('a[href^="mailto:"]').forEach(function (a) { a.setAttribute('href', a.getAttribute('href').replace(/^mailto:[^?]*/, 'mailto:' + CONTACT)); });
  $$('[data-email]').forEach(function (el) { el.textContent = CONTACT; });
  $$('[data-copy]').forEach(function (b) {
    var label = b.textContent;
    var select = function () { var el = b.parentElement.querySelector('[data-email]'); if (!el) return; var r = document.createRange(); r.selectNodeContents(el); var s = getSelection(); s.removeAllRanges(); s.addRange(r); };
    b.addEventListener('click', function () {
      var done = function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = label; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(CONTACT).then(done, select); else select();
    });
  });

  // No GSAP (blocked CDN, offline): drop the .js class so the no-JS layout applies
  // (FAQ open, menu hidden, events as a native scroller) instead of a half-dead page.
  if (!hasGsap) { root.classList.remove('js'); showShell(); return; }
  gsap.registerPlugin(ScrollTrigger, SplitText);
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsap.ticker.lagSmoothing(0);
  var mm = gsap.matchMedia();

  /* =====================================================================
     B. LENIS (single scroll clock) + ANCHOR NAVIGATION
     ===================================================================== */
  var lenis = null;
  var vel = 0;
  if (!REDUCED && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ autoRaf: false, lerp: 0.1, smoothWheel: true, wheelMultiplier: 1, anchors: false });
    lenis.on('scroll', ScrollTrigger.update);
    lenis.on('scroll', function (e) { vel = e.velocity; });
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
  }
  var eventsPin = null; // ScrollTrigger of the pinned events section (set later)

  function scrollToHash(hash) {
    var id = hash.replace('#', '');
    var el = document.getElementById(id);
    if (!el) return false;
    var y;
    if (id === 'top') y = 0;
    else if (eventsPin && eventsPin.trigger === el) y = eventsPin.start;
    else y = el.getBoundingClientRect().top + window.scrollY - headerH() + 1;
    y = Math.max(0, y);
    if (lenis) {
      lenis.resize();   // re-measure first: pin spacers can grow the page after Lenis last looked
      lenis.scrollTo(y, { duration: 1.2, easing: function (x) { return 1 - Math.pow(1 - x, 4); } });
    } else window.scrollTo(0, y);
    setTimeout(function () { if (guardTick) guardTick(); }, 1300);   // whatever we landed on, show it
    return true;
  }
  function refreshAll() { ScrollTrigger.refresh(); if (lenis) lenis.resize(); }
  $$('a[data-anchor]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) !== '#') return;
      if (menuOpen) toggleMenu(false);
      if (scrollToHash(href)) { e.preventDefault(); try { history.replaceState(null, '', href); } catch (err) {} }
    });
  });

  /* =====================================================================
     C. THEME TOGGLE (owner of the colour tokens)
     ===================================================================== */
  var dithers = [];
  var toggles = $$('.toggle');
  var themeIsDark = function () { return root.dataset.theme !== 'light'; };
  function setTheme(t, persist) {
    root.classList.add('theming');
    root.dataset.theme = t;
    toggles.forEach(function (b) { b.setAttribute('aria-pressed', String(t === 'light')); });
    if (persist) { try { localStorage.setItem('bn-theme', t); } catch (e) {} }
    dithers.forEach(function (d) { d.colors(); d.dirty = true; });
    setTimeout(function () { root.classList.remove('theming'); }, 420);
  }
  toggles.forEach(function (b) {
    b.setAttribute('aria-pressed', String(!themeIsDark()));
    b.addEventListener('click', function () { setTheme(themeIsDark() ? 'light' : 'dark', true); });
  });
  // Anything else that flips data-theme (a host page, devtools) resyncs the toggles and canvases.
  if ('MutationObserver' in window) {
    new MutationObserver(function () {
      toggles.forEach(function (b) { b.setAttribute('aria-pressed', String(!themeIsDark())); });
      dithers.forEach(function (d) { d.colors(); d.dirty = true; });
    }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  }

  /* =====================================================================
     D. LINE ART (procedural scenes, no photos)
     Every picture is drawn live in 1px hairlines of the scope's --fg, with
     --cut for the flat slab and --amber only for status marks (the sweep).
     The canvas is transparent: the cell's own ground shows through. `gain`
     scales every alpha (hover brightens, the hero fades in from 0).
     ===================================================================== */
  function sRand(seed) {
    var s = (seed * 9301 + 49297) % 233280;
    return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  }
  var MOBILE = matchMedia('(max-width: 899px)').matches;

  function makeDither(canvas, scene, opts) {
    opts = opts || {};
    var st = {
      canvas: canvas, scene: scene,
      fps: opts.fps || (MOBILE ? 24 : 30),
      live: !!opts.live, gain: opts.gain == null ? 1 : opts.gain,
      mx: 0.5, my: 0.5, p: 0.5, outline: !!opts.outline, seed: opts.seed || 0, text: opts.text || '',
      t: 0, acc: 0, dirty: true, visible: false, w: 0, h: 0, dpr: 1, fg: '#ece8df', accent: '#ffb000', cut: '#3a3a3c'
    };
    var ctx = canvas.getContext('2d');
    st.resize = function () {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      st.w = canvas.clientWidth || 2; st.h = canvas.clientHeight || 2; st.dpr = dpr;
      canvas.width = Math.round(st.w * dpr); canvas.height = Math.round(st.h * dpr);
      st.dirty = true;
    };
    st.colors = function () {
      var cs = getComputedStyle(canvas);
      st.fg = (cs.getPropertyValue('--fg') || '#ece8df').trim();
      st.accent = (cs.getPropertyValue('--amber') || '#ffb000').trim();
      st.cut = (cs.getPropertyValue('--cut') || '#3a3a3c').trim();
    };
    st.render = function () {
      if (!st.w || !st.h) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
      ctx.globalAlpha = 1; ctx.setLineDash([]); ctx.lineWidth = 1;
      scene(ctx, st.w, st.h, st.t, st);
      ctx.globalAlpha = 1;
    };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) { st.visible = entries[0].isIntersecting; }, { rootMargin: '12%' }).observe(canvas);
    } else st.visible = true;
    st.resize(); st.colors();
    if ('ResizeObserver' in window) {
      new ResizeObserver(function () { if (canvas.clientWidth !== st.w || canvas.clientHeight !== st.h) st.resize(); }).observe(canvas);
    }
    dithers.push(st);
    return st;
  }

  // One loop for every canvas. Live ones render at their fps cap, static ones
  // only when dirty and never above 30fps.
  gsap.ticker.add(function (t, dt) {
    if (document.hidden) return;
    for (var i = 0; i < dithers.length; i++) {
      var d = dithers[i];
      if (!d.visible) continue;
      d.acc += dt;
      if (!d.live && !d.dirty) continue;
      if (d.acc < 1000 / (d.live ? d.fps : 30)) continue;
      d.acc = 0; d.t = t * 1000; d.dirty = false; d.render();
    }
  });

  /* --- scene helpers --- */
  function A(st, a) { return Math.max(0, Math.min(1, a * st.gain)); }
  function line(g, x1, y1, x2, y2) { g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); }
  function slab(g, st, a, w, h) {   // the flat cut-out wedge, leaning left
    g.globalAlpha = A(st, 1); g.fillStyle = st.cut;
    g.beginPath(); g.moveTo(w * a, 0); g.lineTo(w * (a + 0.06), 0); g.lineTo(w * (a - 0.34), h); g.lineTo(w * (a - 0.4), h); g.closePath(); g.fill();
  }

  /* --- scenes --- */
  function radarScene(g, w, h, t, st) {
    var cx = w * (0.56 + (st.mx - 0.5) * 0.12), cy = h * (0.5 + (st.my - 0.5) * 0.12);
    var R = Math.max(w, h) * 0.6, a = (t * 0.00065) % (Math.PI * 2), i;
    slab(g, st, 0.875 + (st.mx - 0.5) * 0.06, w, h);
    g.strokeStyle = st.fg; g.lineWidth = 1;
    // range rings, alternate ones stronger, and the crosshair
    for (i = 1; i <= 6; i++) { g.globalAlpha = A(st, i % 2 ? 0.16 : 0.3); g.beginPath(); g.arc(cx, cy, R * i / 6, 0, Math.PI * 2); g.stroke(); }
    g.globalAlpha = A(st, 0.2);
    line(g, cx - R, cy, cx + R, cy); line(g, cx, cy - R, cx, cy + R);
    // bearing ticks on the fourth ring: every 5 degrees, long every 30
    var rt = R * 4 / 6;
    for (i = 0; i < 72; i++) {
      var ang = i * Math.PI / 36, long = i % 6 === 0, c = Math.cos(ang), s = Math.sin(ang);
      g.globalAlpha = A(st, long ? 0.55 : 0.3);
      line(g, cx + c * rt, cy + s * rt, cx + c * (rt + (long ? 14 : 6)), cy + s * (rt + (long ? 14 : 6)));
    }
    // the sweep: a fading amber wedge behind a solid amber line
    g.fillStyle = st.accent;
    for (var k = 0; k < 36; k++) {
      var a0 = a - (k + 1) * 0.022, a1 = a - k * 0.022, f = 1 - k / 36;
      g.globalAlpha = A(st, f * f * 0.16);
      g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, R, a0, a1, false); g.closePath(); g.fill();
    }
    g.globalAlpha = A(st, 1); g.strokeStyle = st.accent; g.lineWidth = 1.5;
    line(g, cx, cy, cx + Math.cos(a) * R, cy + Math.sin(a) * R);
    g.fillStyle = st.accent; g.fillRect(cx - 3, cy - 3, 6, 6);
    // contacts: square, lit as the sweep passes, with a ring while fresh
    var rnd = sRand(7 + st.seed); g.lineWidth = 1;
    for (var b = 0; b < 16; b++) {
      var br = R * (0.12 + rnd() * 0.82), ba = rnd() * Math.PI * 2;
      var d = (a - ba) % (Math.PI * 2); if (d < 0) d += Math.PI * 2;
      var lum = Math.max(0, 1 - d / 2.4);
      var bx = cx + Math.cos(ba) * br, by = cy + Math.sin(ba) * br;
      g.globalAlpha = A(st, 0.15 + lum * 0.85); g.fillStyle = st.fg; g.fillRect(bx - 2, by - 2, 4, 4);
      if (lum > 0.75) { g.globalAlpha = A(st, (lum - 0.75) * 3); g.strokeStyle = st.fg; g.strokeRect(bx - 7, by - 7, 14, 14); }
    }
  }

  function runwayScene(g, w, h, t, st) {
    var hz = h * 0.4, cx = w * 0.5, i;
    g.strokeStyle = st.fg; g.lineWidth = 1;
    // sky: rules thinning toward the top
    for (i = 1; i <= 6; i++) { var sy = hz - (h * 0.32) * Math.pow(i / 6, 1.6); g.globalAlpha = A(st, 0.22 * (1 - i / 7)); line(g, 0, sy, w, sy); }
    g.globalAlpha = A(st, 0.6); line(g, 0, hz, w, hz);
    // floor: rays to the vanishing point and rules rushing toward you
    g.globalAlpha = A(st, 0.24);
    for (i = -12; i <= 12; i++) line(g, cx + i * w * 0.04, hz, cx + i * w * 0.42, h);
    var ph = (t * 0.00022) % 1;
    for (var j = 0; j < 14; j++) {
      var z = ((j / 14) + ph) % 1, y = hz + (h - hz) * z * z;
      g.globalAlpha = A(st, 0.08 + z * 0.62); line(g, 0, y, w, y);
    }
  }

  // Event cards: the edition numeral as line art. Confirmed editions are
  // hatched inside a solid outline; placeholders are a dashed outline only.
  // The hatching is brightest where the light (st.p, driven by scroll) is.
  function glyphScene(g, w, h, t, st) {
    var rnd = sRand(11 + st.seed), p = st.p, rot = -0.7 + rnd() * 0.6, i;
    var lx = w * (0.12 + p * 0.76);
    slab(g, st, 0.58 + sRand(17 + st.seed)() * 0.28, w, h);
    // faint diagonal field
    g.save(); g.translate(w / 2, h / 2); g.rotate(rot);
    g.strokeStyle = st.fg; g.lineWidth = 1; g.globalAlpha = A(st, 0.09);
    var span = Math.hypot(w, h);
    for (i = -span; i < span; i += 16) line(g, -span, i, span, i);
    g.restore();
    var size = Math.floor(h * 0.95), gx = w * 0.5 + (0.5 - p) * w * 0.14, gy = h * 0.56;
    g.font = '500 ' + size + 'px "Instrument Sans", Arial, sans-serif';
    g.textBaseline = 'middle'; g.textAlign = 'center';
    if (!st.outline) {
      // hatch clipped to the glyph through an offscreen layer
      var off = st._off || (st._off = document.createElement('canvas')), o = off.getContext('2d');
      off.width = g.canvas.width; off.height = g.canvas.height;
      o.setTransform(st.dpr, 0, 0, st.dpr, 0, 0); o.strokeStyle = st.fg; o.lineWidth = 1;
      for (var x = -h; x < w + h; x += 5) {
        var near = Math.exp(-Math.pow((x - lx) / (w * 0.35), 2));
        o.globalAlpha = A(st, 0.3 + near * 0.7);
        o.beginPath(); o.moveTo(x, 0); o.lineTo(x - h * 0.6, h); o.stroke();
      }
      o.globalAlpha = 1; o.globalCompositeOperation = 'destination-in';
      o.font = g.font; o.textBaseline = 'middle'; o.textAlign = 'center'; o.fillText(st.text, gx, gy);
      o.globalCompositeOperation = 'source-over';
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.drawImage(off, 0, 0); g.restore();
      g.globalAlpha = A(st, 0.95); g.lineWidth = 1.25; g.strokeStyle = st.fg; g.strokeText(st.text, gx, gy);
    } else {
      g.globalAlpha = A(st, 0.75); g.lineWidth = 1.25; g.strokeStyle = st.fg; g.setLineDash([7, 6]);
      g.strokeText(st.text, gx, gy); g.setLineDash([]);
    }
    // the light itself: one vertical hairline
    g.globalAlpha = A(st, 0.25); g.lineWidth = 1; line(g, lx, 0, lx, h);
  }

  function globeScene(g, w, h, t, st) {
    var rnd = sRand(31 + st.seed), i;
    rnd(); rnd();   // same seeded tilt per person as before
    var cx = w * 0.5, cy = h * 0.52, r = Math.min(w, h) * 0.36, tilt = -0.4 + rnd() * 0.8;
    g.strokeStyle = st.fg; g.lineWidth = 1;
    g.globalAlpha = A(st, 0.18); g.setLineDash([2, 4]);
    g.beginPath(); g.arc(cx, cy, r * 1.18, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
    g.save(); g.translate(cx, cy); g.rotate(tilt);
    g.globalAlpha = A(st, 0.9); g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.stroke();
    g.globalAlpha = A(st, 0.45);
    for (i = 1; i < 6; i++) { var k = Math.cos(i * Math.PI / 6); g.beginPath(); g.ellipse(0, 0, Math.max(0.5, r * Math.abs(k)), r, 0, 0, Math.PI * 2); g.stroke(); }
    for (var j = 1; j < 5; j++) { var la = j * Math.PI / 5 - Math.PI / 2; var yy = r * Math.sin(la), rr = r * Math.cos(la); g.beginPath(); g.ellipse(0, yy, rr, rr * 0.28, 0, 0, Math.PI * 2); g.stroke(); }
    g.globalAlpha = A(st, 0.7); line(g, 0, -r * 1.12, 0, r * 1.12);
    g.restore();
    g.globalAlpha = A(st, 1); g.fillStyle = st.fg; g.fillRect(cx - 2, cy - 2, 4, 4);
  }

  var SCENES = { radar: radarScene, runway: runwayScene, glyph: glyphScene, globe: globeScene };

  /* =====================================================================
     E. CLOCKS: countdown to doors (rolling digits) + Berkeley time
     ===================================================================== */
  var DOORS = new Date('2026-11-14T18:00:00-08:00');
  var WRAP = new Date('2026-11-15T02:00:00-08:00');

  function makeRoller(el, template) {
    var digits = [];
    el.textContent = '';
    for (var i = 0; i < template.length; i++) {
      var ch = template.charAt(i);
      if (/\d/.test(ch)) {
        var d = document.createElement('span'); d.className = 'digit';
        var s = document.createElement('span'); s.className = 'strip';
        s.innerHTML = '01234567890'.split('').map(function (n) { return '<span>' + n + '</span>'; }).join('');   // trailing 0: 9 rolls forward into 0
        d.appendChild(s); el.appendChild(d); digits.push({ strip: s, val: 0 });
      } else {
        var sep = document.createElement('span'); sep.className = 'sep'; sep.textContent = ch; el.appendChild(sep);
      }
    }
    return {
      set: function (str, animate) {
        var k = 0;
        for (var i = 0; i < str.length; i++) {
          var ch = str.charAt(i);
          if (!/\d/.test(ch)) continue;
          var d = digits[k++]; if (!d) break;
          var v = +ch; if (d.val === v) continue;
          var was = d.val; d.val = v;
          if (animate && !REDUCED && was === 9 && v === 0) {
            gsap.fromTo(d.strip, { y: '-9em' }, { y: '-10em', duration: 0.6, ease: 'power3.inOut', overwrite: true, onComplete: function () { gsap.set(d.strip, { y: 0 }); } });
          } else if (animate && !REDUCED) gsap.to(d.strip, { y: (-v) + 'em', duration: 0.6, ease: 'power3.inOut', overwrite: true });
          else gsap.set(d.strip, { y: (-v) + 'em' });
        }
      }
    };
  }
  var cdEl = $('#countdown'), cdDigits = $('#cdDigits'), stateEl = $('#boardState');
  var roller = cdDigits ? makeRoller(cdDigits, '00:00:00:00') : null;
  var firstTick = true;
  function tickCountdown() {
    if (!roller) return;
    var now = Date.now(), str, state, s, d, hh, mm2, ss;
    if (now < DOORS) {
      s = Math.floor((DOORS - now) / 1000);
      d = Math.min(99, Math.floor(s / 86400)); hh = Math.floor(s % 86400 / 3600); mm2 = Math.floor(s % 3600 / 60); ss = s % 60;
      str = pad(d) + ':' + pad(hh) + ':' + pad(mm2) + ':' + pad(ss); state = 'T-minus to doors';
    } else if (now < WRAP) {
      s = Math.floor((now - DOORS) / 1000);
      hh = Math.floor(s / 3600); mm2 = Math.floor(s % 3600 / 60); ss = s % 60;
      str = '00:' + pad(hh) + ':' + pad(mm2) + ':' + pad(ss); state = 'Live. Building.';
    } else { str = '00:00:00:00'; state = 'Edition 01 wrapped'; }
    roller.set(str, !firstTick);
    firstTick = false;
    cdEl.setAttribute('aria-label', 'Countdown ' + str);
    if (stateEl.textContent !== state) stateEl.textContent = state;
  }

  var clockEl = $('.clock[data-tz]');
  var fmtTime = null, fmtParts = null;
  if (clockEl) {
    try {
      fmtTime = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: clockEl.dataset.tz, timeZoneName: 'short' });
      fmtParts = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23', timeZone: clockEl.dataset.tz });
    } catch (e) { fmtTime = null; }
  }
  function tickClock() {
    if (!clockEl || !fmtTime) return;
    var now = new Date(), tEl = clockEl.querySelector('time');
    tEl.textContent = fmtTime.format(now).toUpperCase();
    tEl.dateTime = now.toISOString();
    var p = {};
    fmtParts.formatToParts(now).forEach(function (x) { p[x.type] = +x.value; });
    gsap.set(clockEl.querySelector('.h'), { rotation: (p.hour % 12) * 30 + p.minute * 0.5, transformOrigin: '22px 22px' });
    gsap.set(clockEl.querySelector('.m'), { rotation: p.minute * 6 + p.second * 0.1, transformOrigin: '22px 22px' });
  }
  function tickAll() { tickCountdown(); tickClock(); }
  tickAll();
  var clockId = setInterval(tickAll, 1000);
  document.addEventListener('visibilitychange', function () {
    clearInterval(clockId);
    if (!document.hidden) { tickAll(); clockId = setInterval(tickAll, 1000); }
  });

  /* =====================================================================
     F. SCRAMBLE / DECODE for mono labels
     ===================================================================== */
  var GLYPHS = '-_/\\|<>[]{}=+*#%&';
  function scramble(el, to, dur) {
    to = to || el.dataset.text || el.textContent;
    el.dataset.text = to;
    if (REDUCED) { el.textContent = to; return; }
    dur = dur || 520;
    var len = to.length, t0 = performance.now();
    el.setAttribute('aria-label', to);
    el.style.width = el.offsetWidth + 'px';
    (function frame(now) {
      var p = Math.min(1, (now - t0) / dur), out = '';
      for (var i = 0; i < len; i++) {
        var ch = to.charAt(i);
        out += p >= (i / len) + 0.15 ? ch : (ch === ' ' ? ' ' : GLYPHS.charAt((Math.random() * GLYPHS.length) | 0));
      }
      el.textContent = out;
      if (p < 1) requestAnimationFrame(frame); else { el.textContent = to; el.style.width = ''; }
    })(t0);
  }
  // Labels with child spans are scrambled per-span so the layout holds.
  function scrambleLabel(el, i) {
    var parts = el.children.length ? $$('span', el).filter(function (s) { return !s.children.length; }) : [el];
    parts.forEach(function (p, k) { setTimeout(function () { scramble(p); }, (i || 0) * 60 + k * 90); });
  }

  /* =====================================================================
     G. ROLLING DIGIT COUNTERS (stats)
     ===================================================================== */
  function rollNumber(el, spins) {
    spins = spins == null ? 1 : spins;
    var text = el.dataset.value; el.textContent = ''; el.setAttribute('role', 'img'); el.setAttribute('aria-label', text);
    var strips = [];
    for (var i = 0; i < text.length; i++) {
      var ch = text.charAt(i);
      var s = document.createElement('span'); s.setAttribute('aria-hidden', 'true');
      if (!/\d/.test(ch)) { s.textContent = ch; el.appendChild(s); continue; }
      s.className = 'digit';
      var strip = document.createElement('span'); strip.className = 'strip';
      var seq = '0123456789'.repeat(spins + 1).split('');
      strip.innerHTML = seq.map(function (n) { return '<span>' + n + '</span>'; }).join('');
      s.appendChild(strip); el.appendChild(s);
      strips.push({ strip: strip, target: spins * 10 + (+ch) });
    }
    if (REDUCED) { strips.forEach(function (s) { gsap.set(s.strip, { y: (-s.target) + 'em' }); }); return; }
    gsap.to(strips.map(function (s) { return s.strip; }), {
      y: function (i) { return (-strips[i].target) + 'em'; },
      duration: 1.6, ease: 'power4.out', stagger: 0.08,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  }

  /* =====================================================================
     H. MARQUEE sizing (constant px/s regardless of content width)
     ===================================================================== */
  function sizeMarquees() {
    $$('.marquee').forEach(function (m) {
      var set = m.querySelector('.set'); if (!set) return;
      m.querySelector('.track').style.setProperty('--dur', (set.offsetWidth / 70) + 's');
    });
  }

  /* =====================================================================
     I. FAQ ACCORDION (GSAP height, exclusive)
     ===================================================================== */
  $$('.faq .q').forEach(function (q) {
    var btn = q.querySelector('button'), a = q.querySelector('.a');
    // .closing keeps the answer visible (and in the a11y tree) only while it collapses
    var close = function (o, dur) {
      o.classList.remove('open'); o.classList.add('closing');
      o.querySelector('button').setAttribute('aria-expanded', 'false');
      gsap.to(o.querySelector('.a'), { height: 0, duration: REDUCED ? 0 : dur, ease: 'power3.inOut', overwrite: true, onComplete: function () { o.classList.remove('closing'); refreshAll(); } });
    };
    btn.addEventListener('click', function () {
      var open = !q.classList.contains('open');
      $$('.faq .q.open').forEach(function (o) { if (o !== q) close(o, 0.45); });
      if (!open) { close(q, 0.5); return; }
      q.classList.add('open'); btn.setAttribute('aria-expanded', 'true');
      gsap.to(a, { height: 'auto', duration: REDUCED ? 0 : 0.5, ease: 'power3.inOut', overwrite: true, onComplete: function () { gsap.set(a, { height: 'auto' }); refreshAll(); } });   // auto, not a frozen px value
      if (!REDUCED) gsap.fromTo(q.querySelectorAll('.a-in p'), { yPercent: 20, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.1 });
    });
  });

  /* =====================================================================
     J. MOBILE MENU (full-screen panel grid)
     ===================================================================== */
  var menu = $('#menu'), burger = $('.burger'), main = $('#main');
  var menuOpen = false;
  var menuTl = gsap.timeline({ paused: true, defaults: { ease: 'power4.inOut' } })
    .to(menu, { clipPath: 'inset(0 0 0% 0)', duration: REDUCED ? 0 : 0.6 })
    .from('.mrow', { yPercent: 30, opacity: 0, duration: REDUCED ? 0 : 0.5, stagger: 0.05, ease: 'power3.out' }, '-=0.3')   // opacity, so rows stay focusable
    .to('.burger .l1', { y: 3.75, rotate: 45, duration: 0.3 }, 0)
    .to('.burger .l2', { y: -3.75, rotate: -45, duration: 0.3 }, 0);
  menuTl.eventCallback('onReverseComplete', function () { menu.style.visibility = ''; });
  // everything that is not the header or the menu goes inert while the menu is open
  var backdrop = $$('body > :not(#hdr):not(#menu):not(.skip):not(svg)');
  function toggleMenu(force) {
    menuOpen = force == null ? !menuOpen : force;
    burger.setAttribute('aria-expanded', String(menuOpen));
    burger.setAttribute('aria-label', menuOpen ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!menuOpen));
    if (menuOpen) menu.removeAttribute('inert'); else menu.setAttribute('inert', '');
    backdrop.forEach(function (el) { if (menuOpen) el.setAttribute('inert', ''); else el.removeAttribute('inert'); });
    if (menuOpen) {
      menu.style.visibility = 'visible';   // synchronous, so focus() below lands on a visible element
      if (lenis) lenis.stop(); else document.body.style.overflow = 'hidden';
      menuTl.play();
      var first = menu.querySelector('a'); if (first) first.focus({ preventScroll: true });
    } else { menuTl.reverse(); if (lenis) lenis.start(); else document.body.style.overflow = ''; }
  }
  // Tab past the last row wraps back to the burger instead of escaping behind the panel
  menu.addEventListener('focusout', function (e) { if (menuOpen && e.relatedTarget && !menu.contains(e.relatedTarget) && !burger.contains(e.relatedTarget)) burger.focus(); });
  burger.addEventListener('click', function () { toggleMenu(); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && menuOpen) { toggleMenu(false); burger.focus(); } });
  mm.add('(min-width: 1100px)', function () { if (menuOpen) toggleMenu(false); });

  /* =====================================================================
     K. INIT (after fonts, capped at 1.5s): canvases -> splits -> pin ->
        scrub -> batches -> hero timeline -> refresh
     ===================================================================== */
  var fontsReady = Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(function (r) { setTimeout(r, 1500); })]);
  fontsReady.then(init).catch(function (err) { console.error(err); showShell(); });

  var heroDither = null, bandDither = null;
  // the radar sits behind the wordmark on phones, so it runs dimmer there
  var heroGainMax = function () { return matchMedia('(max-width: 899px)').matches ? 0.72 : 1; };

  function ditherFor(canvas) {
    for (var i = 0; i < dithers.length; i++) if (dithers[i].canvas === canvas) return dithers[i];
    return null;
  }

  function init() {
    /* --- canvases --- */
    safe('canvases', function () {
      $$('canvas.dither').forEach(function (c) {
        var scene = SCENES[c.dataset.scene] || globeScene;
        var d = makeDither(c, scene, { live: c.dataset.live === '1', seed: +(c.dataset.seed || 0), text: c.dataset.text || '', gain: 1, outline: !!c.closest('[data-status="placeholder"]') });
        if (c.id === 'heroCanvas') { heroDither = d; d.gain = REDUCED ? heroGainMax() : 0; }
        if (c.id === 'bandCanvas') bandDither = d;
      });
      sizeMarquees();
    });

    /* --- stats counters --- */
    safe('counters', function () { $$('.rollnum').forEach(function (el) { rollNumber(el, 1); }); });

    /* --- header: section index + progress rule (pin-aware: the Events
           trigger grows by the pin distance so the index tracks the pin) --- */
    safe('index', function () {
    var sections = $$('section[data-name], footer[data-name]');
    var strip = $('#idxStrip'), idxName = $('#idxName'), idxTotal = $('#idxTotal');
    if (!strip || !sections.length) { gsap.to('.hprogress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: REDUCED ? false : 0.3 } }); return; }   // pages without a section index still get the progress rule
    // the hero is 00 so the index matches the section labels (01 About ... 07 Contact)
    strip.innerHTML = sections.map(function (s, i) { return '<span>' + pad(i) + '</span>'; }).join('');
    if (idxTotal) idxTotal.textContent = pad(sections.length - 1);
    var navLinks = $$('.hdr-nav a');
    var currentIdx = -1;
    sections.forEach(function (sec, i) {
      ScrollTrigger.create({
        trigger: sec, start: 'top 50%',
        end: function () { return '+=' + (sec.offsetHeight + (sec.id === 'events' && eventsPin ? (eventsPin.end - eventsPin.start) : 0)); },
        invalidateOnRefresh: true,
        onToggle: function (self) {
          if (!self.isActive || currentIdx === i) return;
          currentIdx = i;
          gsap.to(strip, { y: (-i) + 'em', duration: REDUCED ? 0 : 0.6, ease: 'power3.inOut', overwrite: true });
          scramble(idxName, sec.dataset.name, 400);
          navLinks.forEach(function (a) { if (a.getAttribute('href') === '#' + sec.id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
        }
      });
    });
    gsap.to('.hprogress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: REDUCED ? false : 0.3 } });
    });

    /* --- schedule run sheet: scrubbed rail + lit rows + "now reading" --- */
    safe('schedule', function () {
    var sched = $('.sched');
    if (sched) {
      gsap.to('.sched-rail', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: sched, start: 'top 60%', end: 'bottom 60%', scrub: REDUCED ? false : 0.4 } });
      var nowEl = $('#schedNow');
      $$('.srow', sched).forEach(function (row) {
        ScrollTrigger.create({
          trigger: row, start: 'top 60%', end: 'bottom 60%',
          toggleClass: { targets: row, className: 'now' },
          onEnter: function () { row.classList.add('lit'); if (nowEl) nowEl.textContent = row.dataset.now; },
          onEnterBack: function () { if (nowEl) nowEl.textContent = row.dataset.now; },
          onLeaveBack: function () { row.classList.remove('lit'); }
        });
      });
    }
    });

    /* --- motion context: everything below respects reduced motion --- */
    safe('motion', function () { mm.add('(prefers-reduced-motion: no-preference)', function () {
      // Reveal guard: every hidden-until-scrolled element is tracked here, and a
      // slow interval un-hides anything already inside the viewport whose trigger
      // never fired (throttled background tabs, odd anchor jumps). Nothing can
      // stay invisible at rest.
      var pendingCells = [], pendingRows = [];
      var inView = function (el) { var r = el.getBoundingClientRect(); return r.top < innerHeight * 0.98 && r.bottom > 0 && r.left < innerWidth * 0.98 && r.right > 0; };

      /* line + word reveals (SplitText 3.13, masks, re-split on resize). A re-split
         after the reveal leaves the text visible; before it, the old tween is pruned. */
      var splitReveal = function (el, targets, dur, stagger) {
        if (el._revealed) return null;
        revealTweens = revealTweens.filter(function (x) { return x._el !== el; });
        var t = gsap.from(targets, { yPercent: 110, duration: dur, ease: 'power4.out', stagger: stagger, onComplete: function () { el._revealed = true; }, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
        t._el = el; revealTweens.push(t); return t;
      };
      $$('.reveal-lines').forEach(function (el) {
        SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'line', autoSplit: true, onSplit: function (self) { return splitReveal(el, self.lines, 1.1, 0.07); } });
      });
      $$('.reveal-words').forEach(function (el) {
        SplitText.create(el, { type: 'words', mask: 'words', wordsClass: 'w', onSplit: function (self) { return splitReveal(el, self.words, 0.9, 0.03); } });
      });

      /* panel grids: curtain wipe per cell, 60ms stagger (one batched trigger per grid) */
      var revealCells = function (els) {
        els = els.filter(function (c) { var i = pendingCells.indexOf(c); if (i < 0) return false; pendingCells.splice(i, 1); return true; });
        if (!els.length) return;
        gsap.to(els, { clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'power4.inOut', stagger: 0.07, clearProps: 'clipPath' });
        var b = [];
        els.forEach(function (c) { b = b.concat($$('.tbar, .bar', c)); });
        if (b.length) gsap.to(b, { scaleX: 1, duration: 0.9, ease: 'power3.out', stagger: 0.07, delay: 0.5, clearProps: 'transform' });
      };
      $$('.grid-reveal').forEach(function (grid) {
        var cells = Array.prototype.slice.call(grid.children);
        gsap.set(cells, { clipPath: 'inset(0 0 100% 0)' });
        pendingCells = pendingCells.concat(cells);
        var bars = $$('.tbar, .tier .bar', grid);
        if (bars.length) gsap.set(bars, { scaleX: 0 });
        ScrollTrigger.batch(cells, { start: 'top 90%', once: true, onEnter: revealCells });
      });

      /* schedule rows + FAQ rows: rise in */
      var revealRows = function (els) {
        els = els.filter(function (c) { var i = pendingRows.indexOf(c); if (i < 0) return false; pendingRows.splice(i, 1); return true; });
        if (els.length) gsap.to(els, { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out', stagger: 0.06, clearProps: 'transform,opacity' });
      };
      ['.srow', '.faq .q'].forEach(function (sel) {
        var els = $$(sel); if (!els.length) return;
        gsap.set(els, { y: 24, opacity: 0 });   // opacity, not visibility: rows stay focusable
        pendingRows = pendingRows.concat(els);
        ScrollTrigger.batch(els, { start: 'top 92%', once: true, onEnter: revealRows });
      });

      guardTick = function () {
        if (document.hidden) return;
        revealCells(pendingCells.filter(inView));
        revealRows(pendingRows.filter(inView));
        revealTweens.forEach(function (t) {
          var st = t.scrollTrigger;
          if (st && t.progress() === 0 && !t.isActive() && st.trigger && inView(st.trigger)) t.play();
        });
      };
      var guard = setInterval(guardTick, 1200);

      /* mono labels decode on entry */
      ScrollTrigger.batch('[data-scramble]', { start: 'top 94%', once: true, onEnter: function (els) { els.forEach(scrambleLabel); } });

      /* event cards laid out as a normal grid (the Events page): the numeral's
         light sweeps with the page scroll instead of a pinned strip */
      $$('.ev-grid .ev').forEach(function (ev) {
        var d = ditherFor(ev.querySelector('canvas.dither'));
        if (d) gsap.fromTo(d, { p: 0 }, { p: 1, ease: 'none', onUpdate: function () { d.dirty = true; }, scrollTrigger: { trigger: ev, start: 'top bottom', end: 'bottom top', scrub: true } });
      });

      /* CTA band rows: opposite directions, speed follows scroll velocity */
      var rows = $$('.row .track').map(function (track, i) {
        var dur = Math.max(10, track.offsetWidth / 2 / 90);
        return i % 2
          ? gsap.fromTo(track, { xPercent: -50 }, { xPercent: 0, ease: 'none', duration: dur, repeat: -1 })
          : gsap.to(track, { xPercent: -50, ease: 'none', duration: dur, repeat: -1 });
      });
      ScrollTrigger.create({ trigger: '.cta-band', start: 'top bottom', end: 'bottom top', onToggle: function (s) { rows.forEach(function (r) { s.isActive ? r.play() : r.pause(); }); } });
      rows.forEach(function (r) { r.pause(); });
      // keyboard users can stop the moving rows by focusing the band
      var bandEl = $('.cta-band');
      if (bandEl) {
        bandEl.addEventListener('focusin', function () { rows.forEach(function (r) { r.pause(); }); });
        bandEl.addEventListener('focusout', function () { rows.forEach(function (r) { r.play(); }); });
      }

      /* one ticker callback for velocity-driven effects (marquee speed, heading
         skew, and the hero radar dimming at speed, like the reference) */
      var skewEls = $$('.display-skew');
      var skewTo = skewEls.length ? gsap.quickTo(skewEls, 'skewY', { duration: 0.4, ease: 'power3' }) : null;
      var gainTo = heroDither ? gsap.quickTo(heroDither, 'gain', { duration: 0.5, ease: 'power2.out', onUpdate: function () { heroDither.dirty = true; } }) : null;
      var lastGain = -1;
      var lastTarget = 1, lastSkew = 0;
      var tick = function () {
        var target = gsap.utils.clamp(0.6, 4, 1 + Math.abs(vel) / 25);
        if (Math.abs(target - lastTarget) > 0.001 || Math.abs(rows[0] ? rows[0].timeScale() - target : 0) > 0.001) {
          lastTarget = target;
          rows.forEach(function (r) { r.timeScale(r.timeScale() + (target - r.timeScale()) * 0.08); });
        }
        var sk = gsap.utils.clamp(-3, 3, vel * 0.06);
        if (skewTo && Math.abs(sk - lastSkew) > 0.01) { lastSkew = sk; skewTo(sk); }
        if (gainTo && introDone && heroDither.visible) {
          var gmax = heroGainMax();
          var gn = gsap.utils.clamp(0.45, gmax, gmax - Math.abs(vel) / 90);
          if (Math.abs(gn - lastGain) > 0.005) { lastGain = gn; gainTo(gn); }
        }
      };
      if (lenis) gsap.ticker.add(tick);
      return function () { gsap.ticker.remove(tick); clearInterval(guard); guardTick = null; };
    }); });

    /* --- pinned horizontal events timeline (desktop only) --- */
    safe('timeline', function () { mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', function () {
      var sec = $('#events'), track = $('.track-h'), wrap = $('.ev-wrap');
      if (!sec || !track || !wrap) return;   // no pinned strip on this page
      root.classList.add('ev-pinned');   // CSS clips the strip only while this context owns it
      wrap.scrollLeft = 0;
      var dist = function () { return Math.max(0, track.scrollWidth - wrap.clientWidth); };
      var tween = gsap.to(track, {
        x: function () { return -dist(); }, ease: 'none',
        scrollTrigger: {
          trigger: sec, pin: true, scrub: 0.8, invalidateOnRefresh: true, refreshPriority: 1,
          start: function () { return 'top ' + headerH() + 'px'; },
          end: function () { return '+=' + dist(); },
          // arriving exactly at the pin start (anchor click) never moves the container
          // tween, so its card triggers would not evaluate; the guard shows what is in view
          onToggle: function (s) { if (s.isActive && guardTick) setTimeout(guardTick, 80); }
        }
      });
      eventsPin = tween.scrollTrigger;
      gsap.to('.ev-progress', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: sec, start: function () { return 'top ' + headerH() + 'px'; }, end: function () { return '+=' + dist(); }, scrub: 0.8, invalidateOnRefresh: true } });
      var evTweens = [];
      $$('.ev').forEach(function (ev) {
        // cards on the first screen reveal when the section arrives; the rest as they scrub in
        var firstScreen = ev.offsetLeft < wrap.clientWidth * 0.9;
        var t = gsap.from($$('.ev-rv', ev), { y: 30, opacity: 0, stagger: 0.06, duration: 0.8, ease: 'power4.out', clearProps: 'transform,opacity',
          scrollTrigger: firstScreen ? { trigger: sec, start: 'top 75%', once: true } : { trigger: ev, containerAnimation: tween, start: 'left 90%', once: true } });
        evTweens.push(t); revealTweens.push(t);
        // the numeral's light sweeps across as the card crosses the viewport
        var d = ditherFor(ev.querySelector('canvas.dither'));
        if (d) gsap.fromTo(d, { p: 0 }, { p: 1, ease: 'none', onUpdate: function () { d.dirty = true; }, scrollTrigger: { trigger: ev, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
      });
      // Keyboard: focusing a link in an off-screen card would make the browser
      // scroll the clipped wrapper and desync the transform. Instead, undo
      // that and jump the page to the pin position that shows the card.
      // Mouse clicks also focus links, so pointer-initiated focus is ignored.
      var lastPointer = 0;
      var onPointer = function () { lastPointer = performance.now(); };
      var unscroll = function () { sec.scrollLeft = 0; wrap.scrollLeft = 0; sec.scrollTop = 0; };
      var onFocus = function (e) {
        if (performance.now() - lastPointer < 400) { unscroll(); return; }
        var card = e.target.closest('.ev'); if (!card || !eventsPin) return;
        unscroll(); requestAnimationFrame(unscroll);   // the browser may apply its own scroll after focusin
        var y = eventsPin.start + gsap.utils.clamp(0, dist(), card.offsetLeft - 40);
        if (lenis) lenis.scrollTo(y, { immediate: true }); else window.scrollTo(0, y);
      };
      wrap.addEventListener('pointerdown', onPointer, true);
      wrap.addEventListener('focusin', onFocus);
      return function () {
        root.classList.remove('ev-pinned');
        eventsPin = null; wrap.removeEventListener('focusin', onFocus); wrap.removeEventListener('pointerdown', onPointer, true);
        revealTweens = revealTweens.filter(function (t) { return evTweens.indexOf(t) < 0; });
      };
    });
    /* --- phone / tablet: native swipe strip. The swipe drives the progress rule,
           the light sweep on each numeral and the card reveals, so the section
           feels like the desktop pin without hijacking touch scrolling. --- */
    mm.add('(max-width: 899px)', function () {
      var wrap = $('.ev-wrap'), hint = $('.ev-hint-scroll'), prog = $('.ev-progress');
      if (!wrap) return;
      if (hint) hint.textContent = 'Swipe →';
      var raf = 0;
      var onScroll = function () {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = 0;
          var max = wrap.scrollWidth - wrap.clientWidth;
          if (prog) gsap.set(prog, { scaleX: max > 0 ? wrap.scrollLeft / max : 0 });
        });
      };
      wrap.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      var evT = [];
      if (!REDUCED) $$('.ev').forEach(function (ev, i) {
        var d = ditherFor(ev.querySelector('canvas.dither'));
        if (d) gsap.fromTo(d, { p: 0 }, { p: 1, ease: 'none', onUpdate: function () { d.dirty = true; }, scrollTrigger: { scroller: wrap, horizontal: true, trigger: ev, start: 'left right', end: 'right left', scrub: true } });
        var t = gsap.from($$('.ev-rv', ev), { y: 24, opacity: 0, stagger: 0.05, duration: 0.7, ease: 'power4.out', clearProps: 'transform,opacity',
          scrollTrigger: i === 0 ? { trigger: ev, start: 'top 85%', once: true } : { scroller: wrap, horizontal: true, trigger: ev, start: 'left 92%', once: true } });
        evT.push(t); revealTweens.push(t);
      });
      return function () {
        wrap.removeEventListener('scroll', onScroll);
        if (hint) hint.textContent = 'Scroll to move →';
        revealTweens = revealTweens.filter(function (t) { return evT.indexOf(t) < 0; });
      };
    }); });

    /* --- touch devices: the radar drifts slowly since no pointer moves it --- */
    safe('drift', function () { mm.add('(hover: none) and (prefers-reduced-motion: no-preference)', function () {
      if (!heroDither) return;
      var drift = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } })
        .to(heroDither, { mx: 0.64, my: 0.42, duration: 7 })
        .to(heroDither, { mx: 0.4, my: 0.58, duration: 9 });
      return function () { drift.kill(); heroDither.mx = 0.5; heroDither.my = 0.5; };
    }); });

    /* --- pointer-fine only: magnetic CTAs, canvas hover, card decode --- */
    safe('pointer', function () { mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', function () {
      var ac = new AbortController(), sig = { signal: ac.signal };
      $$('.magnetic').forEach(function (btn) {
        var xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3' });
        var yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3' });
        var r = null;
        btn.addEventListener('pointerenter', function () { r = btn.getBoundingClientRect(); }, sig);
        btn.addEventListener('pointermove', function (e) { if (!r) return; xTo((e.clientX - (r.left + r.width / 2)) * 0.25); yTo((e.clientY - (r.top + r.height / 2)) * 0.25); }, sig);
        btn.addEventListener('pointerleave', function () { r = null; gsap.to(btn, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.35)' }); }, sig);
      });
      // hero radar follows the cursor
      if (heroDither) {
        var panel = heroDither.canvas.parentElement, pr = null;
        var mxTo = gsap.quickTo(heroDither, 'mx', { duration: 0.8, ease: 'power3' });
        var myTo = gsap.quickTo(heroDither, 'my', { duration: 0.8, ease: 'power3' });
        panel.addEventListener('pointerenter', function () { pr = panel.getBoundingClientRect(); }, sig);
        panel.addEventListener('pointermove', function (e) { if (!pr) return; mxTo((e.clientX - pr.left) / pr.width); myTo((e.clientY - pr.top) / pr.height); }, sig);
        panel.addEventListener('pointerleave', function () { pr = null; mxTo(0.5); myTo(0.5); }, sig);
      }
      // cards: line art brightens and recolours on hover; mono label decodes
      dithers.forEach(function (d) {
        if (d.live) return;
        var card = d.canvas.closest('.card'); if (!card) return;
        var gTo = gsap.quickTo(d, 'gain', { duration: 0.5, ease: 'power2.out', onUpdate: function () { d.dirty = true; } });
        card.addEventListener('pointerenter', function () { d.colors(); gTo(1.35); var l = card.querySelector('.label'); if (l) scrambleLabel(l, 0); }, sig);
        card.addEventListener('pointerleave', function () { gTo(1); setTimeout(function () { d.colors(); d.dirty = true; }, 260); }, sig);
      });
      // the runway brightens on hover
      if (bandDither) {
        var band = bandDither.canvas.parentElement;
        var bTo = gsap.quickTo(bandDither, 'gain', { duration: 0.6, ease: 'power2.out' });
        band.addEventListener('pointerenter', function () { bTo(1.4); }, sig);
        band.addEventListener('pointerleave', function () { bTo(1); }, sig);
      }
      return function () { ac.abort(); };
    }); });

    /* --- hero load sequence: the board assembles along the grid --- */
    safe('hero', function () {
    var hdr = $('#hdr'); if (hdr) hdr.classList.add('loading');
    var tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1 } });
    tl.set(['.hero', '.hdr > .hcell', '.marquee'], { visibility: 'visible' })
      .from('.hdr > .hcell', { yPercent: -100, duration: 0.8, stagger: 0.05 }, 0);
    if (!$('.hero')) {
      // inner pages: header drops in, the page head's lines rise, the rest is scroll-driven
      var ph = $$('.page-head .rise');
      if (ph.length) tl.set(ph, { visibility: 'visible' }, 0).from(ph, { yPercent: 40, opacity: 0, duration: 0.9, stagger: 0.08, clearProps: 'transform,opacity' }, 0.3);
      tl.add(function () { if (hdr) hdr.classList.remove('loading'); introDone = true; refreshAll(); }, 0.9);
      if (REDUCED) tl.progress(1);
      return;
    }
    tl.fromTo('.hero-grid > .hcell', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power4.inOut', stagger: 0.08, clearProps: 'clipPath' }, 0.1)
      .from('.wordmark .char', { yPercent: 115, duration: 1.2, stagger: 0.035 }, 0.5)
      .from('.hero-title .label', { autoAlpha: 0, y: 8, duration: 0.6, stagger: 0.1 }, 0.9);
    // introDone flips when the gain ramp ends, so the velocity dimmer never fights it
    if (heroDither) tl.to(heroDither, { gain: heroGainMax(), duration: 1.8, ease: 'power2.out', onUpdate: function () { heroDither.dirty = true; }, onComplete: function () { introDone = true; } }, 0.6);
    else introDone = true;
    var heroLead = $('.hero-lead');
    if (heroLead && !REDUCED) {
      var hs = SplitText.create(heroLead, { type: 'words', mask: 'words' });
      tl.from(hs.words, { yPercent: 110, duration: 0.9, stagger: 0.02 }, 0.9);
    }
    tl.from('.hero-copy .label', { autoAlpha: 0, duration: 0.6 }, 1.3)
      .from('.hero-cta .btn', { autoAlpha: 0, y: 12, duration: 0.6, stagger: 0.08 }, 1.2);
    if ($('.board > .bcell')) tl.from('.board > .bcell', { yPercent: 100, duration: 0.9, stagger: 0.06 }, 0.9);
    if ($('.marquee')) tl.from('.marquee', { autoAlpha: 0, duration: 0.8 }, 1.6);
    tl.add(function () {
        $$('.board [data-print]').forEach(function (el, i) { setTimeout(function () { scramble(el, null, 600); }, i * 180); });
        if (hdr) hdr.classList.remove('loading');
        refreshAll();
      }, 1.5);
    if (REDUCED) tl.progress(1);
    });

    refreshAll();
    // deep links: the head script parked the hash in window.__deepHash; land on it
    // once the hero has settled and positions (pin spacer included) are final.
    var deep = window.__deepHash;
    if (deep && document.getElementById(deep.slice(1))) {
      setTimeout(function () {
        refreshAll(); scrollToHash(deep);
        try { history.replaceState(null, '', deep); } catch (e) {}
      }, REDUCED ? 200 : 1700);
    }
  }

  /* =====================================================================
     L. RESIZE: width changes only (iOS URL bar is height-only)
     ===================================================================== */
  var lastW = innerWidth, rTimer = null;
  addEventListener('resize', function () {
    clearTimeout(rTimer);
    rTimer = setTimeout(function () {
      if (innerWidth === lastW) return;
      lastW = innerWidth;
      MOBILE = matchMedia('(max-width: 899px)').matches;
      dithers.forEach(function (d) { d.fps = MOBILE ? 18 : 24; d.resize(); });
      sizeMarquees();
      refreshAll();
    }, 150);
  });
})();
