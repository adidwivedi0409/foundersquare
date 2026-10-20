# Faq

Numbered accordion rows; one answer open at a time, a mono "+" that turns to "×".

**Markup.** `.faq > .q > button` (number `label` in `fg-3`, the question in `question`, `.plus`) and `.a > div > .a-in > p` in `fg-2`. `FounderSquare.faq(root)` wires it; `aria-expanded` mirrors the state and closed answers leave the accessibility tree. Without script every answer shows.

**Copy.** Questions in the student's words ("Do I need a team?"), answers in one to three plain sentences.
