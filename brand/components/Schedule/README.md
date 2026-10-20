# Schedule

The run sheet: time, what happens, and a status LED per row, with an amber rail scrubbed by scroll.

**Rows.** `.srow`: `num` time (110px column), the item in `value`, `.led` at the end. Upcoming rows are `fg-2`; `.lit` rows (passed by the scroll or the clock) turn `fg` with an amber LED; `.now` gets the `bg-2` well. `.sched-rail` is a 2px amber bar along the left, scaled to progress.

**Times** are local to the event (PST), 12-hour with AM/PM, no leading zero: "6:00 PM", "12:15 AM".
