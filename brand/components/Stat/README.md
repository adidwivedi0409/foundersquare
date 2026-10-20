# Stat

A big tabular numeral that rolls into place, with a mono label above.

**Markup.** A cell in a `.stats` grid: `label` on top, `<span class="big" data-value="150">` at the bottom; `FounderSquare.rollNumber(el)` builds the digit strips and sets `role="img"` with the value as its label.

**Rules.** Only real numbers people care about (editions, seats, cost). "$0" is a real stat. No filler metrics; no more than four in a row.
