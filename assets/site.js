// Every outside link in one place. Leave a value empty and the matching
// buttons stay hidden (the email fallbacks show instead).
const LINKS = {
  luma: 'https://luma.com/x63yuq1r',   // Agents After Dark Build Night, Mon Nov 16 2026
  partiful: '',       // the Partiful event page
  lumaCalendar: '',   // the Founder Square calendar on Luma
  instagram: '',
  x: '',
  linkedin: '',
};

(() => {
  'use strict';
  document.querySelectorAll('.section h2,.section p,.event-row,.event-row h3,.event-date,.event-info p,.event-aside,.band-inner h2,.band-inner p,.footer-top,.page-head h1,.page-head p,.sponsorship article,.sponsorship h2,.sponsorship h3,.sponsorship p,.contact-grid h2,.contact-grid>div p,.contact-grid label,.schedule li,.questions details').forEach(el => el.classList.add('reveal'));

})();
document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('team@foundersquare.org');
      button.textContent = 'Copied';
      setTimeout(() => { button.textContent = 'Copy address'; }, 1600);
    } catch {
      button.textContent = 'team@foundersquare.org';
    }
  });
});

// Fill in the LINKS above; anything without a URL stays hidden.
(() => {
  'use strict';
  let anySocial = false, anyEvent = false;
  document.querySelectorAll('[data-link]').forEach(a => {
    const url = LINKS[a.dataset.link];
    if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.hidden = false; }
    else (a.closest('li') || a).remove();
    if (url && ['instagram', 'x', 'linkedin', 'lumaCalendar'].includes(a.dataset.link)) anySocial = true;
    if (url && ['luma', 'partiful'].includes(a.dataset.link)) anyEvent = true;
  });
  document.querySelectorAll('[data-socials-fallback]').forEach(p => { if (anySocial) p.remove(); });
  document.querySelectorAll('[data-when-links]').forEach(p => { if (!anyEvent) p.remove(); });
  document.querySelectorAll('[data-when-no-links]').forEach(p => { if (anyEvent) p.remove(); });
  // with a platform link in place the email button becomes the quiet alternative
  if (anyEvent) document.querySelectorAll('[data-link-fallback]').forEach(a => { if (a.dataset.linkFallback === 'hide') a.remove(); else a.className = 'text-link'; });
})();

// The sponsor contact form posts to /api/contact; if that fails, it falls back to email.
(() => {
  'use strict';
  const form = document.getElementById('contactForm');
  if (!form) return;
  const status = document.getElementById('form-status');
  const button = form.querySelector('button[type=submit]');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    data.interests = fd.getAll('interests');
    if (!data.name.trim() || !(data.company || '').trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      status.className = 'form-status err'; status.textContent = 'Please add your name, your company and a working email.'; return;
    }
    button.disabled = true; status.className = 'form-status'; status.textContent = 'Sending…';
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const out = await r.json().catch(() => ({}));
      if (r.ok && out.ok) {
        form.reset(); status.className = 'form-status ok';
        status.textContent = 'Got it. The whole team has your request and will reply from team@foundersquare.org within a few days.';
      } else throw new Error(out.error || 'Could not send');
    } catch (err) {
      const body = encodeURIComponent(`Name: ${data.name}${data.role ? ', ' + data.role : ''}\nCompany: ${data.company}\nWebsite: ${data.url || ''}\nEmail: ${data.email}\nEvent: ${data.event || ''}\nCould bring: ${data.interests.join(', ')}\nBudget: ${data.budget || ''}\n\n${data.message}`);
      status.className = 'form-status err';
      status.innerHTML = `${err.message.replace(/</g, '&lt;')} <a class="inline-link" href="mailto:team@foundersquare.org?subject=Founder%20Square%20sponsorship&body=${body}">Send it by email instead ↗</a>`;
    } finally { button.disabled = false; }
  });
})();

// The Square: scroll progress through the pinned stage drives the zoom.
(() => {
  'use strict';
  const stage = document.querySelector('.sq-stage'), pin = document.querySelector('.sq-pin'), sq = document.querySelector('.sq');
  if (!stage || !pin || !sq) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  let ticking = false;
  function update() {
    ticking = false;
    const rect = stage.getBoundingClientRect();
    const total = stage.offsetHeight - innerHeight;
    const p = clamp(-rect.top / total, 0, 1);
    const side = sq.offsetWidth || 1;
    const cover = Math.hypot(innerWidth, innerHeight) / side * 1.04;   // enough to hide every corner
    const zoom = ease(clamp(p / 0.72, 0, 1));
    const scale = 1 + (cover - 1) * zoom;
    const front = 1 - clamp(p / 0.3, 0, 1);
    const inside = clamp((p - 0.5) / 0.3, 0, 1);
    pin.style.setProperty('--p', p.toFixed(4));
    pin.style.setProperty('--sq-scale', scale.toFixed(3));
    pin.style.setProperty('--front', front.toFixed(3));
    pin.style.setProperty('--inside', inside.toFixed(3));
    pin.style.setProperty('--inside-events', inside > 0.6 ? 'auto' : 'none');
  }
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  update();
})();
