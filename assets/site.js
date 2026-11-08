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
  if (anyEvent) document.querySelectorAll('[data-link-fallback]').forEach(a => { a.className = 'text-link'; });
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
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.name.trim() || !data.message.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      status.className = 'form-status err'; status.textContent = 'Please add your name, a working email and a message.'; return;
    }
    button.disabled = true; status.className = 'form-status'; status.textContent = 'Sending…';
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const out = await r.json().catch(() => ({}));
      if (r.ok && out.ok) {
        form.reset(); status.className = 'form-status ok';
        status.textContent = 'Got it. The team has your message and will reply from team@foundersquare.org.';
      } else throw new Error(out.error || 'Could not send');
    } catch (err) {
      const body = encodeURIComponent(`Name: ${data.name}\nCompany: ${data.company}\nEmail: ${data.email}\nInterested in: ${data.interest}\n\n${data.message}`);
      status.className = 'form-status err';
      status.innerHTML = `${err.message.replace(/</g, '&lt;')} <a class="inline-link" href="mailto:team@foundersquare.org?subject=Founder%20Square%20sponsorship&body=${body}">Send it by email instead ↗</a>`;
    } finally { button.disabled = false; }
  });
})();
