# Smart Campus — room availability (Practice #09 baseline)

Starting point for Practice #09: the repaired `checkAvailability` from Practice #08
(BUG-A and BUG-B fixed) plus a minimal static UI so AC6 can be checked in the preview.

    npm install
    npm run dev     # preview
    npm test        # vitest run — expected: 30 passed (30)

Files:
- `src/availability.js` — pure booking rule (AC1–AC5)
- `src/explain.js` — optional "Explain availability" mock adapter (validate input/output, timeout, fallback)
- `src/main.js`, `index.html`, `src/style.css` — UI (AC6 + explain button + mock-mode select)
- `src/fixtures.js` — shared demo data
- `tests/regression.test.js`, `tests/invalid-input.test.js` — regression and invalid-input tests
- `tests/availability.test.js` — 10 regression tests from Practice #08
- `tests/explain.test.js` — tests for the optional explain feature
