# Task 03 — Code-based solution

Folder: `code-based/` (Vite + vanilla JavaScript, reused from the Bolt.new project).

## Structure (validation → availability → display)
| Layer | File | Responsibility |
|---|---|---|
| Validation | `src/validation.js` | `validateSlotInput()`: HH:MM format, integer duration 1–120, start strictly after now |
| Availability | `src/availability.js` | `checkAvailability()`: **unchanged** rule from Practice #08 (blocked, overlap, no mutation) |
| Contract | `src/slotChecker.js` | `checkSlot()` → `{ available, reasonCode, message, kind }` |
| Messages | `src/messages.js` | one visible message per reason code |
| UI | `src/main.js`, `index.html`, `src/style.css` | reads inputs, calls `checkSlot`, renders with `textContent` |
| Tests | `tests/contract-t1-t8.test.js` | T1–T8 plus 7 boundary/invalid-input checks |

## Changes vs. baseline
- The UI input "End time" was replaced by "Duration (minutes)", as the Practice #13 contract requires.
- A new validation layer returns validation reason codes. Duration 0 now gives `DURATION_TOO_SHORT` instead of the indirect `START_NOT_BEFORE_END`.
- The result shows the message and `available=… · reason=…`, so the output contract is visible.
- Validation errors use a yellow banner, Unavailable a red one, Available a green one.
- The optional "Explain availability" mock from Practice #11 was kept. It appears only after a real decision, not after a validation error.

## Evidence
- `evidence/05-code-based-tests.txt`: `npm test` → **73 passed (73)**, 5 files (58 old + 15 new)
- `evidence/05-code-based-T1-T8-verbose.txt`: per-test list for T1–T8
- `evidence/03-code-based-build.txt`: `vite build` succeeded
- `screenshots/code-based/T1…T7-*.jpg`: running app, desktop
- `screenshots/code-based/mobile-375px.jpg`: 375 px width. Fields stack vertically and `scrollWidth == innerWidth == 375`, so there is no horizontal scroll.

## Run
```
cd code-based
npm ci
npm test
npm run dev
```
