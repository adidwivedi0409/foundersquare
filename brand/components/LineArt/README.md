# LineArt

Every image on the site is a procedural scene drawn live in 1px hairlines of the scope's `fg`, with a flat `cut` slab and amber only for status marks: no photos.

**Use.** `<canvas data-scene="radar|glyph|globe|runway">` inside a sized box (`.art-frame`, `bg-2` behind it on cards), then `FounderSquare.lineArt(canvas, opts)`. Options: `seed`, `text` (glyph), `outline` (glyph, dashed for placeholders), `live` (animate), `gain` (scales every line's alpha; hover uses up to 1.4). The canvas is transparent and redraws when the theme changes.

**Scenes.** `radar`: the hero, rings, ticks and square contacts with an amber sweep and wake, live. `glyph`: an edition numeral, hatched inside a solid outline (confirmed) or dashed (placeholder), lit by scroll. `globe`: team thumbnails, seeded wireframe globes. `runway`: the CTA band, a horizon and floor rules rushing toward you, live.

**Rules.** Lines only, at three strengths (field, structure, figure; see Imagery). Canvases are `aria-hidden`; meaning lives in the text beside them. Reduced motion renders one still frame.
