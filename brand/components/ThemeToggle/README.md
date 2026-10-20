# ThemeToggle

A 40×20 outlined pill with a 12px dot: the only rounded shapes in the system.

**Behaviour.** Dark is the default. The choice is stored per visitor (`bn-theme`) and set as `data-theme` on `<html>` before first paint; with no choice and no script, the OS preference decides. `aria-pressed` is true in light mode. The colour change eases over 0.35s.
