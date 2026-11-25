# Smart Campus — room availability (code-based track, Practice #13)

The code-based version of the shared contract (`../docs/02-shared-contract.md`):
start time + duration + blocked flag → `{ available, reasonCode, message }`.

    npm ci
    npm test        # vitest run — expected: 73 passed (73)
    npm run dev     # preview
    npm run build   # static files in dist/

Files:
- `src/validation.js` — input validation (HH:MM, duration 1–120, start in the future)
- `src/availability.js` — booking rule from Practice #08 (unchanged): blocked, overlap, no mutation
- `src/slotChecker.js` — shared-contract entry point used by the UI and tests
- `src/messages.js` — visible message per reason code
- `src/main.js`, `index.html`, `src/style.css` — UI (desktop + 375 px)
- `src/explain.js` — optional "Explain availability" mock from Practice #11
- `src/fixtures.js` — shared fictional data (room R-101, now 2026-10-28 09:00, B1, B2)
- `tests/contract-t1-t8.test.js` — Practice #13 tests T1–T8 plus boundary checks
- `tests/availability.test.js`, `tests/regression.test.js`, `tests/invalid-input.test.js`, `tests/explain.test.js` — earlier tests, all still passing
