# Imagery

There are no photographs. Every picture is a procedural scene drawn live as line art: 1px hairlines in the scope's `fg` at a few fixed strengths, one flat `cut` slab, and `amber` only where something is happening (the radar sweep). It reads like an instrument panel and it follows the theme.

## Scenes

| Scene | Where | What |
| --- | --- | --- |
| `radar` | Hero | Range rings, a crosshair and bearing ticks over Berkeley (37.87 N 122.26 W), a `cut` slab, and an amber sweep line with a fading amber wake. Square contacts light up as the sweep passes and carry a square ring while fresh. Live; drifts toward the pointer. |
| `glyph` | Event cards | The edition numeral, huge, over a faint diagonal field with a seeded `cut` slab. Confirmed editions are hatched inside a solid outline, brightest where the light is (tied to scroll); placeholders are a dashed outline only. |
| `globe` | Team cards | A wireframe globe with a seeded tilt, one per person, inside a dotted orbit. |
| `runway` | Closing band | A horizon, rays to the vanishing point and floor rules rushing toward you under the "Let's build / Something at 1 AM" rows. Live. |

## Line strengths

| Strength | Alpha | Use |
| --- | --- | --- |
| Field | 0.09–0.2 | Background structure: diagonal fields, minor rings, crosshairs, far floor rules |
| Structure | 0.25–0.45 | Major rings, ticks, inner meridians, rays |
| Figure | 0.7–1 | The subject: a globe's outline, a numeral's outline, near floor rules, contacts |

Lines are 1px (1.25px for numeral outlines, 1.5px for the sweep). Hover raises every alpha by up to 40% (`gain`).

## How to make one

- `FounderSquare.lineArt(canvas, { scene, seed, text, outline, live })`. The canvas is drawn at device resolution, so lines stay sharp on every screen.
- Put the canvas in a box with `bg-2` (cards) or `bg` (hero, band) behind it; the canvas itself is transparent. Add a mono `canvas-tag` label in a corner ("Radar · Berkeley · live", "Sweep · 37.87 N 122.26 W").
- Mark canvases `aria-hidden`; the text beside them carries the meaning.

## Overlays

- The `cut` slab: one flat parallelogram leaning left, behind the lines. It is the only filled shape in a scene besides amber status marks and square contacts.
- Amber appears in a scene only as a status mark: the radar's sweep, its wake and its centre. Never tint a whole scene.

## Grain

- A fixed fractal-noise layer covers the whole page at `grain-dark` (0.055) in dark and `grain-light` (0.08), inverted, in light. It is texture, not content.

## Don't

- Use photos, stock images, 3D renders, illustrations, gradients or AI-generated art.
- Fill shapes with `fg`, add colours, or draw lines thicker than 1.5px.
- Use curves or rounded caps for UI-like marks inside a scene: contacts and the sweep's centre are square, like the `Led`.
- Put the logo or running text on a scene without a `bg` panel behind it (the closing band knocks each phrase out on its own panel).
