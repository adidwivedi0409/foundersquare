# Motion

Almost nothing moves. What does is slow and small, and everything stops under `prefers-reduced-motion`.

| Move | Spec | Where |
| --- | --- | --- |
| Drift | The hero photograph scales from 1.01 to 1.06 and rises 5px over 24s, ease-in-out, alternating | Hero photo only |
| Arrive | Text and panels fade from 40% opacity and rise 24px as they scroll into view (scroll-driven, about 0.7s of scroll) | Section text, event rows, bands, FAQ items |
| Lift | Buttons rise 3px and drop to 90% opacity on hover over 0.2s; settle 1px on press | Buttons |
| Underline | Links underline on hover, offset 5px | Text links, nav |
| Smooth scroll | Anchor links scroll smoothly | In-page links |

## Rules

- No load sequences, parallax, scroll pinning, counters or animated illustrations.
- Motion never hides content: arriving text starts at 40% opacity, never 0.
- Reduced motion turns off every animation and transition and scroll smoothing.
