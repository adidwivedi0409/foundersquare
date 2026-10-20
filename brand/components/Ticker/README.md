# Ticker

A 45px departures-board marquee of mono facts between 1px rules.

**Markup.** `.marquee > .track > ul.set` twice (the second `aria-hidden`), each `li` a label with a `<b>` value in `fg`. Speed is set so the set moves 70px per second (`--dur`). It pauses on hover and focus; reduced motion stops it and wraps the items.

**Content.** Short facts with an LED each: "Doors 6:00 PM", "Demos 12:15 AM", "Seats 150", "Cost $0". Unsold or open slots get `.led-off` ("Track A Unsold").
