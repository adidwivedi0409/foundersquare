/* @ds-bundle: {"format":4,"namespace":"FounderSquare","components":[{"name":"Logo"},{"name":"Button"},{"name":"PanelLink"},{"name":"CopyEmail"},{"name":"Led"},{"name":"Badge"},{"name":"Header"},{"name":"ThemeToggle"},{"name":"StatusBoard"},{"name":"Ticker"},{"name":"Stat"},{"name":"Schedule"},{"name":"EventCard"},{"name":"Tier"},{"name":"TeamCard"},{"name":"Faq"},{"name":"CtaBand"},{"name":"PanelGrid"},{"name":"SectionHead"},{"name":"LineArt"}]} */
/* Founder Square behaviours, vanilla (no React): the line-art renderer that
   draws every image on the site, rolling digits, and the FAQ accordion.
   Ported from foundersquare.org; GSAP-free so it runs anywhere. */
(function () {
  'use strict';
  var REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- colour from a token, via a probe (resolves alias chains) ---------- */
  function tokenRGB(el, name) {
    var p = document.createElement('i');
    p.style.cssText = 'position:absolute;width:0;height:0;color:var(' + name + ')';
    el.appendChild(p);
    var m = getComputedStyle(p).color.match(/[\d.]+/g) || [128, 128, 128];
    p.remove();
    return [+m[0], +m[1], +m[2]];
  }
  function css(c) { return 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')'; }
  /* ---------- line art: procedural scenes in 1px hairlines of the scope's fg ---------- */
  function sRand(seed) { var s = (seed * 9301 + 49297) % 233280; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
  /* --- scene helpers --- */
  function A(st, a) { return Math.max(0, Math.min(1, a * st.gain)); }
  function line(g, x1, y1, x2, y2) { g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); }
  function slab(g, st, a, w, h) {   // the flat cut-out wedge, leaning left
    g.globalAlpha = A(st, 1); g.fillStyle = st.cut;
    g.beginPath(); g.moveTo(w * a, 0); g.lineTo(w * (a + 0.06), 0); g.lineTo(w * (a - 0.34), h); g.lineTo(w * (a - 0.4), h); g.closePath(); g.fill();
  }

  /* --- scenes --- */
  function radar(g, w, h, t, st) {
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

  function runway(g, w, h, t, st) {
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
  function glyph(g, w, h, t, st) {
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

  function globe(g, w, h, t, st) {
    var rnd = sRand(31 + st.seed), i;
    rnd(); rnd();   // same seeded tilt per person as the site
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

  var SCENES = { radar: radar, glyph: glyph, globe: globe, runway: runway };

  function lineArt(canvas, opts) {
    opts = opts || {};
    var scene = SCENES[opts.scene || canvas.dataset.scene] || globe;
    var st = { seed: +(opts.seed || canvas.dataset.seed || 0), text: opts.text || canvas.dataset.text || '', outline: !!(opts.outline || canvas.dataset.outline), p: opts.p == null ? 0.5 : opts.p, live: opts.live != null ? opts.live : canvas.dataset.live === '1', gain: opts.gain == null ? 1 : opts.gain, mx: 0.5, my: 0.5, dpr: 1, w: 0, h: 0 };
    var ctx = canvas.getContext('2d');
    function size() {
      st.dpr = Math.min(window.devicePixelRatio || 1, 2);
      st.w = canvas.clientWidth || 300; st.h = canvas.clientHeight || 150;
      canvas.width = Math.round(st.w * st.dpr); canvas.height = Math.round(st.h * st.dpr);
    }
    function colors() { var p = canvas.parentNode; st.fg = css(tokenRGB(p, '--fg')); st.accent = css(tokenRGB(p, '--amber')); st.cut = css(tokenRGB(p, '--cut')); }
    function render(t) {
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(st.dpr, 0, 0, st.dpr, 0, 0); ctx.globalAlpha = 1; ctx.setLineDash([]); ctx.lineWidth = 1;
      scene(ctx, st.w, st.h, t, st); ctx.globalAlpha = 1;
    }
    size(); colors();
    var last = 0;
    function loop(now) { if (now - last > 33) { last = now; render(now); } requestAnimationFrame(loop); }
    if (st.live && !REDUCED) requestAnimationFrame(loop); else render(4000);
    if ('ResizeObserver' in window) new ResizeObserver(function () { size(); if (!st.live || REDUCED) render(4000); }).observe(canvas);
    new MutationObserver(function () { colors(); if (!st.live || REDUCED) render(4000); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return { render: render, recolor: colors, state: st };
  }

  /* ---------- rolling digits: each digit is a strip of 0-9 moved by 1em steps ---------- */
  function roller(el, template) {
    var digits = [];
    el.textContent = '';
    for (var i = 0; i < template.length; i++) {
      var ch = template.charAt(i);
      if (/\d/.test(ch)) {
        var d = document.createElement('span'); d.className = 'digit';
        var s = document.createElement('span'); s.className = 'strip';
        s.innerHTML = '0123456789'.split('').map(function (n) { return '<span>' + n + '</span>'; }).join('');
        d.appendChild(s); el.appendChild(d); digits.push(s);
      } else { var sep = document.createElement('span'); sep.className = 'sep'; sep.textContent = ch; el.appendChild(sep); }
    }
    return { set: function (str) { var k = 0; for (var i = 0; i < str.length; i++) { if (/\d/.test(str.charAt(i))) digits[k++].style.transform = 'translateY(' + (-str.charAt(i)) + 'em)'; } } };
  }
  function rollNumber(el) {
    var text = el.dataset.value || el.textContent.trim();
    el.setAttribute('role', 'img'); el.setAttribute('aria-label', text);
    var r = roller(el, text.replace(/\d/g, '0'));
    el.querySelectorAll('.digit,.sep').forEach(function (n) { n.setAttribute('aria-hidden', 'true'); });
    el.classList.add('rollnum');
    setTimeout(function () { r.set(text); }, REDUCED ? 0 : 150);
    return r;
  }

  /* ---------- FAQ: one open at a time ---------- */
  function faq(root) {
    root.querySelectorAll('.q > button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var q = btn.parentNode, open = !q.classList.contains('open');
        root.querySelectorAll('.q.open').forEach(function (o) { o.classList.remove('open'); o.firstElementChild.setAttribute('aria-expanded', 'false'); });
        if (open) { q.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
      });
    });
  }

  window.FounderSquare = { lineArt: lineArt, scenes: SCENES, roller: roller, rollNumber: rollNumber, faq: faq, tokenRGB: tokenRGB };
})();
