# Founder Square brand

The design language for [foundersquare.org](https://foundersquare.org). Browse it with live component previews in the [Founder Square design system](https://claude.ai/artifact/1Tdh7sFEqkBQz2f3n5RFuE).

| File | What |
| --- | --- |
| [identity.md](identity.md) | Name, logo, lockups, events, sponsors |
| [voice.md](voice.md) | How we write |
| [motion.md](motion.md) | How things move |
| [imagery.md](imagery.md) | Line-art scenes, grain |
| [tokens.json](tokens.json) / [tokens.css](tokens.css) | Colour, type, spacing, radius, stroke tokens |
| [components/](components/) | Stylesheet, behaviours and guidelines for each component |
| [logos/](logos/), [icons/](icons/) | SVG files |

Founder Square is a student-run community of builders and founders at UC Berkeley; its first event is Build Night, a one-night build-a-thon. The brand looks like the board in a departures hall at 1 AM: a dark grid of panels, hairline rules, mono status labels, one amber light that means "on", and pictures drawn in hairlines like an instrument panel. Everything on it is a fact, and anything that is not confirmed yet says so.

Read [Identity](identity.md) for the name and logo, [Language](voice.md) for how we write, [Motion](motion.md) and [Imagery](imagery.md) for how things move and what pictures are.

## Five rules

1. **The grid is the structure.** Content lives in panels on a `.grid` whose 1px gap shows `rule` through. No cards, shadows or rounded corners; no margins between panels.
2. **One light.** `amber` is a status light: LEDs, the caret, progress rules, the featured bar, and one accent panel or button per view. Never a background wash, never a gradient, never decoration.
3. **Two inks.** Every surface is `bg` with `fg` on it. Hierarchy comes from `fg-2` and `fg-3`, size and the mono/sans switch, not from more colours.
4. **Facts, labelled.** Every cell is a label and a value. Unconfirmed things carry a `Badge` ("Placeholder", "Form link TBD") or `[brackets]` until they are real.
5. **Numbers are the ornament.** Edition numbers, section numbers, countdowns and times are set big and tabular, and they roll; they replace icons and illustrations.

## Colour

- Dark is the default theme; light is the visitor's choice. Both are complete. Design dark first, then check light.
- Paint every panel with `bg` and its text with `fg`. Use `ink` and `bone` only through `c0`/`c1`/`bg`/`fg`.
- Secondary text (labels, blurbs, nav, metadata) is `fg-2`. Tertiary (numbers in lists, separators, footnotes) is `fg-3`, and only on `bg`.
- Lines are `rule`; button outlines are `rule-2`. Wells (card canvas grounds, the current schedule row, hover on FAQ rows) are `bg-2`.
- An accent panel is `amber` with `amber-ink` text and `amber-label` mono labels. Never white or `bone` on amber.
- The sponsor section is `.scheme-paper`: it flips the scope so `bg` is the figure colour (paper in dark mode). Components inside follow automatically.
- Selection highlight is `amber` with `amber-ink`.
- The focus ring is a 2px solid `fg` outline inset by 3px on every element (`amber-ink` on amber panels), so it reads on every ground.

## Type

- Two families: Instrument Sans (`display`, `body`) and DM Mono (`mono`), both from Google Fonts. Instrument Sans is variable; display sizes use weight 450, UI labels 500.
- Display styles (`wordmark`, `display`, `big`, `display-md`, `title`, `display-sm`) are tight: −0.03em to −0.045em, leading 0.86–1. They are fluid clamps on the site; the token is the largest step.
- Running text is `copy` (max 62ch) after a `lead` (max 34ch). Base text is `body`, 16px/1.3.
- Mono is for machine-voice: `label` (12px, uppercase, 500) for eyebrows, tags and metadata; `num` (tabular) for times; `badge` for placeholders.
- Section labels read "01 — About": number, em dash, name. Headlines are sentence case. Only the wordmark is all caps in sans.
- Use `font-variant-numeric: tabular-nums` wherever digits line up or change.

## Layout and spacing

- Sections are a 5 : 7 split: a sticky `SectionHead` beside a scrolling body with a 1px left rule. Under 900px they stack.
- Pad cells with `s3` (16px); separate groups inside a cell with `s4`; give section bodies `s5`–`s6`. Side gutters are max(16px, safe area).
- Inside a cell, the label sits top-left and the value bottom-left (`justify-content: space-between`).
- The header is 61px (`header-h`): 60px cells plus the rule. Buttons, schedule rows and menu rows share that height.
- Grids step down: four columns, then two under 900px, then one under 640px.

## Shape

- Square: `radius-none` everywhere. The theme toggle is the only exception (`radius-pill`, `radius-round`).
- Lines: `stroke-rule` (1px) for structure, `stroke-rail` (2px) for scrubbed progress and the focus ring, `stroke-bar` (4px) for the bars on tier and team cards.
- No shadows, no gradients in the UI, no blur. Depth comes from the panel grid and the `bg-2` well.
- A faint fractal grain sits over the whole page (`grain-dark`, `grain-light`).

## States

- Hover on a panel link or card inverts it: `bg` becomes the figure colour and text the ground (inside paper it flips back).
- Hover on a button wipes `fg` up from the bottom over 0.45s and slides a new arrow in from the left.
- Nav links go from `fg-2` to `fg` with a 1px amber underline drawing in from the left; the current section keeps it.
- Touch devices get the same changes on press, faster (0.08–0.12s), with no grey tap flash.
- Disabled is not a state we use; something that is not ready is a placeholder with a `Badge`.

## Iconography

- Two glyphs only, drawn at 16×16 with a 1.4px stroke in `currentColor`: the arrow (`#i-arrow`) and the external arrow (`#i-ext`). They live in one inline SVG sprite; `icons/` has standalone copies.
- Every link and button ends with the arrow, paired so one slides out as the next slides in.
- Status is the square `Led`, never a coloured circle or an icon. The FAQ toggle is a mono "+".
- No emoji, no icon library, no illustrations. Where another site would use an icon, use a number or a label.

## Components

`components/bundle.css` is the stylesheet and `components/bundle.js` is a small vanilla script (`window.FounderSquare`): the line-art renderer, rolling digits and the FAQ accordion. No framework; markup is plain HTML with the classes each component's guidelines name.
