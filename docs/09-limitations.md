# Remaining limitations (incomplete or simulated behaviour)

Everything below was **not** done or is only partly done. Nothing in this list was simulated as passing.

| # | Item | Track | Status |
|---|---|---|---|
| 1 | Appsmith app **not deployed and not shared publicly**; tests ran in the editor preview | low-code | NOT DONE |
| 2 | Appsmith app **JSON export not done**; the only copy of the logic in Git is `low-code/appsmith/SlotChecker.jsobject.js` (the exact script pasted into the app) | low-code | NOT DONE |
| 3 | Appsmith **mobile layout not checked** (no screenshot) | low-code | NOT DONE |
| 4 | Low-code **T6 used 08:30** instead of the shared 08:00 (same rule branch, see `05-test-results.md`) | low-code | DEVIATION |
| 5 | Low-code XSS probe was a partial string `<.b`; a full `<img onerror>` payload was not tried | low-code | PARTIAL |
| 6 | Appsmith runs on a **15-day trial** (Business plan, no card); the app may stop after the trial | low-code | RISK |
| 7 | Bolt.new live demo `smart-campus-11-1q5d.bolt.host` still shows the **baseline** (start + end time). The duration version exists only in `code-based/` | code-based | NOT REPUBLISHED |
| 8 | `npm audit` findings in dev-only vitest 3.2.7 not fixed (needs a breaking upgrade) | code-based | OPEN |
| 9 | In both apps the previous result stays visible after the inputs are cleared, until the next check | both | UX ISSUE |
| 10 | Low-code title text is missing a closing `)`; the table "Download" button is left enabled | low-code | COSMETIC / LOW |
| 11 | No requirement was impossible in Appsmith, but validation order and overlap logic **could not be configured visually** and needed a JS Object | low-code | PLATFORM LIMIT |
