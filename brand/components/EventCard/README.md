# EventCard

One edition in the events strip: meta row, the edition numeral in line art, title, blurb and a link.

**Parts.** `.ev-top`: mono `label`s (edition, date) and a `stat` with an LED ("Confirmed" or "Placeholder"). `.ev-art`: a `LineArt` canvas with the `glyph` scene showing the edition code ("01", "S1"); hatched for confirmed, a dashed outline (`data-outline`) for placeholders. `.ev-title` in `title`, `.ev-blurb` in `small`/`fg-2`, `.ev-link` with a 1px rule above.

**Layout.** 540px wide on desktop in a horizontal strip pinned while you scroll; a swipe strip with snap points under 900px.
