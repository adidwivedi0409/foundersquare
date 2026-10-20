# Button

A 61px-tall rectangle with a label and a sliding arrow; the fill wipes up from the bottom on hover.

**Markup.** `<a class="btn">` (or `<button>`) containing `<span class="btn-bg"></span>`, the label, and the arrow pair `<span class="arr">` (two `#i-arrow` uses; the first slides out, the second in). The consumer supplies the label and the href.

**Variants.** Default: `bg` with a `rule-2` outline, fills with `fg`. `.btn-accent`: `amber` with `amber-ink` text, at most one per view, for the thing the page is for (Register, Sponsor us). `.btn-hero`: a full panel cell, 96px tall, 24px label bottom-left and a mono `.btn-sub` eyebrow top-left. `.btn-wide`: fills its container.

**Rules.** Square corners. Verb-first label, two or three words, sentence case ("Sponsor us", "Get notified", "Back to top"). Always the arrow; `#i-ext` for links that leave the site. Min width 200px. In the header the button is a panel cell with no outline. Hover and keyboard focus look the same; on touch the wipe plays on press.
