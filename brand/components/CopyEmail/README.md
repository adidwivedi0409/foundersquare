# CopyEmail

The address as a link with a small "Copy address" button under it, in the footer.

**Behaviour.** `FounderSquare.copyButtons(root, address)` wires every `[data-copy]` button: it copies the address and reads "Copied" for 1.6s; if the clipboard is refused it shows the address so it can be selected. `black-raised` fill, red on hover.
