# StatusBoard

The hero's departures-board row: a panel grid of label/value cells with a live countdown and a log.

**Cells.** `.bcell`: `label` in `fg-2` on top, `.val` (the `value` style) at the bottom, `led` where a state applies. `.bcell.cd`: the countdown, d : h : m : s, in `title` with rolling digits and `fg-3` separators; it reads "Live. Building." during the event and "Edition 01 wrapped" after. `.bcell.log`: mono uppercase lines with timestamps in brackets, the last line in `fg` with the amber caret.

**Rules.** Facts only, one per cell. Placeholders carry a `Badge`. Every figure is real or marked.
