# PanelGrid

The structural primitive: cells on a `rule`-coloured grid with a 1px gap, so every divider is the same hairline.

**Markup.** `.grid` with any `grid-template-columns`; each child paints its own `bg`. `.cell-accent` makes one cell amber. Edge cells take the safe-area gutters (`gl`, `gr`) instead of `s3`.

**Rules.** No cards with shadows or radii, no margins between panels: the rule is the gap. Cells hold one fact or one action. Content aligns to the cell's top-left and bottom-left (label on top, value at the bottom). Under 900px grids drop to two columns, under 640px to one.
