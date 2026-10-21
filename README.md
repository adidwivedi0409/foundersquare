# Founder Square

Site for Founder Square and Build Night at UC Berkeley, live at [foundersquare.org](https://foundersquare.org).

Four static pages, one stylesheet, one small script. No build step, no animation libraries.

## Pages

| URL | File | Who it is for |
| --- | --- | --- |
| `/` | `index.html` | Everyone. One line, two buttons (students → events, startups → sponsor), the next event, who we are. |
| `/events` | `events.html` | Students. Upcoming events, with Build Night 01 first. |
| `/build-night` | `build-night.html` | Build Night 01: tracks, run sheet, what to bring, FAQ, register. |
| `/sponsor` | `sponsor.html` | Startups. Tiers, why sponsor, and the interest form. |

Vercel's `cleanUrls` serves `events.html` at `/events`, so links across the site are written without the `.html` suffix.

## Look

Red, white and black. `assets/site.css` holds the handful of colour tokens at the top (`--red`, `--ink`, `--cream`) and everything else. The palm trees in the hero and footer are one file, `assets/palms.svg`, used as a CSS mask so the same silhouette can be red on the home page and dark grey in the footer. The only motion is hover states, the FAQ opening, and the countdown ticking.

## Shared assets

- `assets/site.css`: the whole stylesheet.
- `assets/site.js`: the contact address (`CONTACT`), the mobile menu, the copy-address buttons and the countdown to doors.
- `assets/palms.svg`: the palm-tree silhouette.

## Sponsor interest form

The form on `/sponsor` is a Google Form owned by Adi's Gmail account, which is also where the response notifications go. Short link: <https://forms.gle/mi3dWKbafs6CBR6r9>. To route notifications to another inbox, share the form with that address as an editor, then turn on "Get email notifications for new responses" from that account (Responses tab, three-dot menu).

To point the page at a different form, change the two URLs in `sponsor.html`: the iframe `src` (which ends in `?embedded=true`) and the "Open it in a new tab" link right under it.

## Contact address

Set once as `CONTACT` at the top of `assets/site.js`. It rewrites every `mailto:`, the copy buttons and the footer address on load. The same address is written into the HTML as a fallback, so change it there too (search for the address) when the org gets its own inbox.

## Placeholders

Everything still to fill in is marked in the HTML with a `PLACEHOLDER` comment and, where visitors can see it, a chip in plain words:

- On `/build-night`: the venue room, the registration form (`#register` takes registrations by email until a form exists), and the three sponsor tracks ("Open slot").
- On `/events`: the mailing list, and every event after Build Night 01 ("Tentative").
- In the footer: the social links.

## Brand

The logo, tokens, components and the identity, language, motion and imagery guides in [`brand/`](brand/) describe the earlier dark, line-art direction. The site now uses the simpler red-and-white look described above; the brand folder is kept for the logo mark and as reference until it is updated.

## Local preview

```bash
npx serve .
```

`serve` resolves the clean URLs the same way Vercel does. `python3 -m http.server` works too, but you will have to type the `.html` suffixes yourself.

## Deploys

Pushes to `main` deploy to production on Vercel; other branches get preview URLs.
