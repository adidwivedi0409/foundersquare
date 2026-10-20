# SectionHead

Every section is a 5 : 7 split: a sticky head cell (numbered label, big title, footer label) beside a scrolling body.

**Parts.** `.sec-head`: `label` "01 — About", the title in `display` (sized to the column, 24cqw max), a foot with a mono label and a `Button`. `.sec-body`: a 1px left rule, `lead` first, then `copy` paragraphs, optionally a `.manifesto` list numbered in mono `fg-3`.

**Numbering** is real: sections are numbered in page order and the header index matches (00 is the hero). Under 900px the head stacks above the body and stops sticking.
