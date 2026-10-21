# Founder Square

Site for Founder Square and Build Night at UC Berkeley, live at [foundersquare.org](https://foundersquare.org).

Static pages, no build step. Vendored [GSAP](https://gsap.com) 3.13 (ScrollTrigger, SplitText) and [Lenis](https://lenis.darkroom.engineering) in `vendor/`.

## Pages

| URL | File | Who it is for |
| --- | --- | --- |
| `/` | `index.html` | Everyone. One line, two doors (students → events, startups → sponsor), the next event, who we are. |
| `/events` | `events.html` | Students. Upcoming events, with Build Night 01 first. |
| `/build-night` | `build-night.html` | Build Night 01: the night, tracks, run sheet, what to bring, FAQ, register. |
| `/sponsor` | `sponsor.html` | Startups. Tiers, why sponsor, and the interest form. |

Vercel's `cleanUrls` serves `events.html` at `/events`, so links across the site are written without the `.html` suffix.

## Shared assets

- `assets/site.css`: tokens, header, hero, panels, footer, motion safety.
- `assets/pages.css`: layout for the multi-page site (page heads, the next-event row, the events grid, the form embed).
- `assets/boot.js`: runs in `<head>`. Theme from `localStorage`, the `.js` class, and parking of deep links until the page has laid out.
- `assets/site.js`: everything else. Lenis, GSAP timelines, line-art canvases, countdown, menu, FAQ, copy buttons.

## Sponsor interest form

The form on `/sponsor` is a Google Form owned by Adi's Google account, with email notifications on for new responses. Short link: <https://forms.gle/mi3dWKbafs6CBR6r9>.

To point the page at a different form, change the two URLs in `sponsor.html`: the iframe `src` (which ends in `?embedded=true`) and the "Open the form in a new tab" link right under it.

## Placeholders

The contact address is Adi's Gmail, set once as `CONTACT` at the top of `assets/site.js`: it rewrites every `mailto:`, the copy buttons and the footer address on load, so change it there (and in the HTML fallbacks) when the org gets its own inbox.

Everything still to fill in is badged on the page ("TBD"):

- On `/build-night`: the venue room and the registration form link (`#register`).
- On `/events`: the mailing list link, and every event after Build Night 01 is a placeholder.
- In the footer: the social link.

## Brand

The logo, tokens, components and the identity, language, motion and imagery guides live in [`brand/`](brand/). Live previews: [Founder Square design system](https://claude.ai/artifact/1Tdh7sFEqkBQz2f3n5RFuE).

## Local preview

```bash
npx serve .
```

`serve` resolves the clean URLs the same way Vercel does. `python3 -m http.server` works too, but you will have to type the `.html` suffixes yourself.

## Deploys

Pushes to `main` deploy to production on Vercel; other branches get preview URLs.
