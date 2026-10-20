# Motion

Motion makes the page feel like a board being updated: panels drop into place, numbers roll, text is printed. It always ends at rest with everything readable, and it stops entirely under `prefers-reduced-motion`.

## Curves and timing

| Name | Value | Use |
| --- | --- | --- |
| ease-out | `cubic-bezier(.16,1,.3,1)` | Things arriving: nav underline, reveals |
| ease-io | `cubic-bezier(.76,0,.24,1)` | Things that change state: button wipe, toggle, FAQ "+" |
| power4.out | GSAP | Line and word reveals, the load timeline |
| power3.inOut | GSAP | Rolling digits, accordion height |
| linear | | Scroll-scrubbed progress, the ticker |

Durations: 0.2–0.35s for colour, 0.45s for the button wipe, 0.6s for a digit roll, 0.8–1.1s for reveals, 1.6s for the hero wordmark. Staggers are 0.02–0.08s.

## The moves

- **Load.** Header cells drop from above (0.8s, 0.05s stagger); the wordmark's letters rise out of their masks (1.6s, 0.08s stagger); the lead's words follow; the countdown starts rolling. Nothing waits more than 3s to be visible.
- **Line reveal.** Headings and paragraphs marked `.reveal-lines` / `.reveal-words` are split into masked lines or words that rise 110% into place when they enter the viewport (1.1s / 0.9s).
- **Curtain.** Panel-grid cells wipe in from the top with `clip-path` (1s, 0.07s stagger), then their amber bars scale across.
- **Roll.** Digits are vertical strips of 0–9 that move in 1em steps: the header index, the countdown, stats.
- **Scramble.** Mono labels resolve from random glyphs (`-_/\|<>[]{}=+*#%&`) to their text in about 0.5s when they enter, keeping their width.
- **Print.** Log lines type out with the amber caret at the end.
- **Scrub.** The header's 1px progress rule, the schedule's 2px rail and the events progress rule follow scroll position.
- **Pin.** On desktop the events strip pins and scrolls sideways as you scroll down; each card's hatched numeral is lit by a sweep tied to its position.
- **Ticker.** 70px per second, pauses on hover and focus.
- **Magnetic.** Accent buttons lean toward the pointer and spring back.
- **Smooth scroll.** Lenis, with anchor jumps that land below the sticky header.

## Rules

- Animate `transform`, `opacity` and `clip-path` only.
- Hidden states are applied by script right before a tween, never by static CSS, so the page is complete without JS.
- One orchestrated moment per view; don't stack reveals on things already moving.
- Reduced motion: no ticker, pulse, caret blink, scramble, roll or pin; transitions are instant; line-art canvases render one still frame; the events strip becomes a normal horizontal scroller.
