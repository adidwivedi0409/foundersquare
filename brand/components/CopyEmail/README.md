# CopyEmail

The address as selectable mono text with a "Copy" control under it.

**Markup.** `<span class="email" data-email>` (selects whole on click) and `<button class="copy-btn" data-copy>`. On success the button reads "Copied" for 1.6s; if the clipboard is refused, select the address instead.

**Rules.** Always show the address itself; a mailto link is a convenience that may do nothing. Until the real inbox exists it is a placeholder: wrap it with a `Badge`.
