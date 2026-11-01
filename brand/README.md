# Founder Square brand

The brand system for [foundersquare.org](https://foundersquare.org). Browse it with live component previews in the [Founder Square design system](https://claude.ai/artifact/1Tdh7sFEqkBQz2f3n5RFuE).

| File | What |
| --- | --- |
| [identity.md](identity.md) | Name, logo, colours of the logo, events, sponsors |
| [voice.md](voice.md) | How we write |
| [motion.md](motion.md) | What moves, and how little |
| [imagery.md](imagery.md) | The Bay photograph and how to add photos |
| [tokens.json](tokens.json) / [tokens.css](tokens.css) | Colour, type, spacing, radius, stroke and opacity tokens |
| [components/](components/) | Guidelines per component; `bundle.css` mirrors `assets/site.css` |
| [logos/](logos/) | The outlined logo files |

Founder Square is a student-run community at UC Berkeley that brings people together to build, find collaborators and show their work. Its first event is Agent's After Dark Build Night, Thursday, November 12, 2026. The brand is warm and plain: a red square logo, serif headlines on white and pale red, one photograph of the Bay, and nothing that moves unless you ask it to.

Read [Identity](identity.md) for the name and logo, [Language](voice.md) for how we write, [Motion](motion.md) and [Imagery](imagery.md) for how things move and what pictures are.

## Five rules

1. **The logo is red.** The mark and "founder square" in `red`, always the supplied files. Nothing else on a page competes with it.
2. **One red.** `red` is the logo, every button and the focus ring. There is no second red, no pink accent and no red text.
3. **Serif to say it, sans to explain it.** Headings, statements and dates are Newsreader; everything you read to act is DM Sans.
4. **Plain panels.** Blocks are set apart by `surface` or `black` fills and generous space, never by borders, shadows or rounded corners.
5. **Only what's confirmed.** If a time, room or sponsor isn't confirmed, the page says "coming soon" or "shared with registrants". No placeholders dressed as facts.

## Colour

- The page is `bg` with `ink` text. Pale red panels are `surface`; the footer and the register band are `black`.
- Secondary text is `muted` on `bg` or `surface`. On black, body text is `on-black` and fine print is `on-black-muted`.
- `red` fills buttons and draws the focus ring. White on red is 4.59:1; red is never body text.
- There is no dark theme.

## Type

- Newsreader 400 for `display-hero`, `page-title`, `heading`, `date` and `lead`, with tight tracking (−0.02em to −0.065em) and leading near 1.
- DM Sans for `body` (17px/1.6), `button-label` (500), `small`, `fine` and `footer-heading` (600).
- Headlines are sentence case. The only all-lowercase words are the logo's.
- Keep running text near 65 characters: about columns cap at 720px, statements at 660px.

## Layout and spacing

- Content sits inside `margin` (up to 64px) with a 1480px maximum width.
- Sections have `section` (130px) above and below. Two-column sections split 1 : 1.35 with `column-gap` between.
- Panels are padded `gap-lg` (40px). Stack to one column under 600px.
- The header is `header-h` (100px): logo left, three text links right.

## Shape

- `radius-none` everywhere. No shadows, no borders on panels, no gradients.
- Fields have a 1px `muted` border on white. Focus is a 3px solid `red` outline.

## States

- Links underline on hover with a 5px offset; the current page's nav link stays underlined.
- Buttons lift 3px and drop to 90% opacity on hover, settle 1px on press.
- The footer copy button turns red on hover and reads "Copied" for 1.6s.

## Iconography

- No icon set. Links and buttons that go somewhere end with "↗" in the label text.
- The red mark is the only graphic. No emoji, no illustrations.

## Components

Markup is plain HTML; the classes in each component's guidelines come from `components/bundle.css`, which mirrors the site's [`assets/site.css`](../assets/site.css). The only script is the copy-address button.
