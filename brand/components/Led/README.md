# Led

A 6px square status light; the only round-free "dot" in the system.

**Variants.** `.led` amber (on, confirmed). `.led-live` pulses to 0.2 opacity every 2.2s (happening now, live data). `.led-off` in `fg-3` (not yet, placeholder). `.caret`: the blinking amber block at the end of a log line.

**Rules.** Always next to a word that says the same thing; colour alone never carries the state (amber on paper is 2.66:1). Square, never a circle. One live LED per region. Reduced motion stops the pulse and blink.
