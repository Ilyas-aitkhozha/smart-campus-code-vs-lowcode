# Task 05 — Identical tests T1–T8

Fixed now: 2026-10-28 09:00. Bookings: B1 10:00–11:00, B2 14:00–15:00.
- **Code-based:** Vitest (`evidence/05-code-based-T1-T8-verbose.txt`) **and** manual runs in the browser (`screenshots/code-based/`).
- **Low-code:** manual runs in the Appsmith editor preview on 2026-11-25, 19:29–19:31 (`screenshots/low-code/T*.png`; the clock is visible in each screenshot).

| Test | Input (start, duration, blocked) | Expected | Code-based observed | Low-code observed |
|---|---|---|---|---|
| T1 | 12:00, 60, no | Available / OK | ✅ Available, `OK` | ✅ "Available: the room is free…" `OK` |
| T2 | 10:30, 60, no | Unavailable / OVERLAP | ✅ Unavailable, `OVERLAP` | ✅ "Unavailable: this time overlaps…" `OVERLAP` |
| T3 | 12:00, 60, yes | Unavailable / ROOM_BLOCKED | ✅ Unavailable, `ROOM_BLOCKED` | ✅ "Unavailable: this room is blocked…" `ROOM_BLOCKED` |
| T4 | 12:00, 0, no | validation / DURATION_TOO_SHORT | ✅ `DURATION_TOO_SHORT` | ✅ "Duration must be greater than 0 minutes." |
| T5 | 12:00, 121, no | validation / DURATION_TOO_LONG | ✅ `DURATION_TOO_LONG` | ✅ "Duration can be at most 120 minutes." |
| T6 | 08:00, 30, no | validation / IN_THE_PAST | ✅ `IN_THE_PAST` | ✅ `IN_THE_PAST`. Run with **08:30** instead of 08:00, see note 1 |
| T7 | 11:00, 60, no | Available / OK (touching) | ✅ Available, `OK` | ✅ "Available…" `OK` |
| T8 | after T1–T7 | bookings unchanged | ✅ `toEqual(snapshot)` + UI list unchanged | ✅ the table shows B1 10:00–11:00 and B2 14:00–15:00 in every screenshot T1–T7 |
| **Total** | | | **8 / 8** | **8 / 8** |

## Extra runtime checks (DAST perspective)
| Check | Code-based | Low-code |
|---|---|---|
| HTML/script-like start time | `<script>alert(1)</script>` → `INVALID_START_TIME`, not echoed (automated test) | `<.b` → "Enter a valid start time (HH:MM)." `INVALID_START_TIME`, nothing rendered as HTML (`X1-html-like-input-1931.png`), see note 2 |
| Mobile width | ✅ 375 px, no horizontal scroll (`mobile-375px.jpg`) | ⚠️ **not checked**: no mobile screenshot was taken |

## Notes
1. **T6 input deviation (low-code).** The shared input was 08:00; 08:30 was typed. Both values lie before the fixed now (09:00) and hit the same rule branch (`s <= now`), so the result is comparable. Even so, the low-code T6 input did not match the sheet exactly.
2. **Partial XSS input (low-code).** The planned payload was `<b>x</b>`, but `<.b` was typed. It still shows that an HTML-like string is rejected by validation and never echoed. A full `<img src=x onerror=…>` payload was **not** tried in Appsmith.
3. **Observation in both apps.** When the inputs are cleared, the previous result stays visible until the button is pressed again (`X0-stale-result-after-clearing-1931.png`). This is not a T1–T8 failure. It is a UX weakness and is listed in the limitations.
4. Low-code tests ran in the **editor preview**, not in a deployed app.
