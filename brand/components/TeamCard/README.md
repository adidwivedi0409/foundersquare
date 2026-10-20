# TeamCard

A person on the team: a line-art globe thumbnail, amber bar, name and role.

**Parts.** `.thumb` (4:3, a `LineArt` `globe` scene seeded per person, never a photo), `.tbar` 4px amber, `.tname` in `title`, `.trole` as a mono `label` in `fg-2`, an arrow. The whole card is a `.card` link (to email that person) that inverts on hover.

**Open seat.** The last card in the grid is a `PanelLink` in `cell-accent`: "Open seat · Help run the next one".
