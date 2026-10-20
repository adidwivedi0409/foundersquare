# Tier

A sponsorship tier card: amber bar, head, name, price line and a list with square amber bullets.

**Parts.** `.bar` (4px, bleeds to the card edges: `rule-2` on ordinary tiers, `amber` only on the `.featured` one), `.t-head` mono labels, `.t-name` in `title`, `.t-price` in `small`/`fg-2`, a `ul` above a 1px rule with 6px amber squares as bullets. `.featured` also lifts the head stat to `fg`.

**Lives in** the sponsor section, which is `.scheme-paper`: the paper ground in dark mode, the ink ground in light. Three tiers in a row; prices are real or marked with a `Badge`.
