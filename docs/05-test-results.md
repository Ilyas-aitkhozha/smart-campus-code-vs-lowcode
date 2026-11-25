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

## Re-run on the deployed, public Appsmith app
After Deploy, all cases were repeated on the **published URL** without signing in:
https://ilyas-smart-campus.appsmith.com/app/smart-campus-lowcode/page1-6b06ebfd92ce383e8540cbc4?environment=production
(2026-11-25 ≈19:44; the AI assistant ran them in its browser; screenshots in `screenshots/low-code/deployed/`).

| Test | Input | Observed on the deployed app |
|---|---|---|
| T1 | 12:00, 60, off | ✅ Available `OK` |
| T2 | 10:30, 60, off | ✅ `OVERLAP` |
| T3 | 12:00, 60, on | ✅ `ROOM_BLOCKED` |
| T4 | 12:00, 0 | ✅ `DURATION_TOO_SHORT` |
| T5 | 12:00, 121 | ✅ `DURATION_TOO_LONG` |
| T6 | **08:00**, 30 (exact shared input) | ✅ `IN_THE_PAST` |
| T7 | 11:00, 60 | ✅ Available `OK` |
| T8 | — | ✅ the table shows B1 and B2 unchanged in every screenshot |
| **Total** | | **8 / 8** |

## Extra runtime checks (DAST perspective)
| Check | Code-based | Low-code |
|---|---|---|
| HTML/script-like start time | `<script>alert(1)</script>` → `INVALID_START_TIME`, not echoed (automated test) | Preview: `<.b` → `INVALID_START_TIME` (`X1-html-like-input-1931.png`). Deployed: `<img src=x onerror=alert(1)>` → `INVALID_START_TIME`, no alert, and the DOM check found 0 injected `<img src="x">` elements (`deployed/D-X2-img-onerror-payload.jpg`) |
| Mobile width | ✅ 375 px, no horizontal scroll (`mobile-375px.jpg`) | ❌ **defect** at 375 px: no horizontal scroll, but labels are truncated ("Star…", "Duration …"), the switch label wraps letter by letter, and the button overlaps it. The app uses the fixed layout (`appPositioning: FIXED` in the export) (`deployed/D-mobile-375px-broken-layout.jpg`) |

## Notes
1. **T6 input deviation (preview run).** The author typed 08:30 instead of 08:00. The deployed re-run used the exact 08:00 and passed.
2. **XSS input.** The preview run used a partial string `<.b`. The full `<img src=x onerror=alert(1)>` payload was tested on the deployed app and was rejected.
3. **Observation in both apps.** When the inputs are cleared, the previous result stays visible until the button is pressed again (`X0-stale-result-after-clearing-1931.png`). This is not a T1–T8 failure. It is a UX weakness and is listed in the limitations.
4. Low-code tests ran twice: in the editor preview (by the author) and on the deployed public app (see above).
