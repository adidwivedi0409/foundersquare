# Founder Square

Static website for Founder Square, a student-run UC Berkeley builder community. Four HTML pages share `assets/site.css` and `assets/site.js`; no build step is required.

- `/`: community homepage, waterfront photograph, upcoming event, About, registration banner.
- `/events`: Agent's After Dark Build Night on November 12, 2026. Future events are announced only when confirmed.
- `/build-night`: event details, registration by email, FAQ, and a Schedule section marked “Coming Soon...”. Event time and venue room are not yet confirmed.
- `/sponsor`: direct sponsorship inquiries to `team@foundersquare.org`. No sponsorship tiers, attendance estimates, or embedded Google Form.

Vercel's `cleanUrls` configuration serves the HTML pages without file extensions.

## Design

The site uses the Founder Square logo exactly as designed: the red mark with "founder square" in Plus Jakarta Sans ExtraBold, outlined in `brand/logos/logo-red.svg`. Its red, `#e42425`, is the only red on the site: logo, buttons, bands and focus rings. Headings are serif on white and pale red surfaces.

The homepage photograph is Francisco Delgado's “Sunrise by the Ferry Building,” used under the [Unsplash License](https://unsplash.com/photos/HdtcZUI3Qvk). Its credit appears in the footer. It depicts San Francisco Bay, not the event venue. Other SF photo galleries have been removed.

## Contact and registration

All email links use `team@foundersquare.org`, including static HTML fallbacks and footer copy-address buttons. Registration opens an email draft; the team confirms attendance and sends venue information by reply. The sponsor page also opens an email draft directly. No backend or Google Forms notification settings are required by the site.

## Details still to announce

- Schedule and event time
- Venue room
- Future event dates
- Social links

## Local preview

Use a static server that resolves extensionless HTML routes, or open the `.html` paths directly with Python's server:

```sh
python3 -m http.server 8000
```

Production deploys from `main` through Vercel. Pull request branches may receive Vercel preview deployments.

The brand system (logo files, tokens, identity, language, motion and imagery guides, component guidelines) is in `brand/`; live previews are in the [Founder Square design system](https://claude.ai/artifact/1Tdh7sFEqkBQz2f3n5RFuE). Site styles are in `assets/site.css`. Local `.taste-skill/` inspection reports are ignored by Git.
