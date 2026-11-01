# EventRow

One event on a `surface` panel: the date as a big serif numeral, the title and facts, and an aside with the link.

**Parts.** `.event-date time` (datetime attribute; `date` numeral with month and "Thursday, 2026" in `small`), `.event-info` (title as an h3 link in `lead`, a one-line summary, a `.secondary` facts line with middle dots), `.event-aside` (who can come, then a `TextLink`). Three columns 150px / 1fr / 270px; on phones the aside moves under the title.
