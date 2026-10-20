# Header

A sticky row of panel cells separated by 1px rules: brand, nav, section index, theme toggle, accent CTA.

**Cells.** `.hdr-brand`: the mark (18px) and "Founder Square" in `brand`. `.hdr-nav`: section links in `fg-2`; the current one in `fg` with a 1px amber underline. `.hdr-idx`: "01 / 07 — About" in `num`, the digits roll as you scroll. `.hdr-theme`: `ThemeToggle`. `.hdr-cta`: the one accent `Button`. `.hprogress`: a 1px amber rule along the bottom scaled to scroll progress.

**Responsive.** Below 1280px the index drops its name; below 1100px nav, toggle and CTA move into a full-screen menu behind a two-line burger; below 560px the index shows digits only.
