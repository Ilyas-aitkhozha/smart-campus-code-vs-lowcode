# Remaining limitations (incomplete or simulated behaviour)

Status of every gap found during the work. DONE/RESOLVED rows were closed after the first submission draft and are kept for traceability. Nothing in this list was simulated as passing.

| # | Item | Track | Status |
|---|---|---|---|
| 1 | Appsmith app deployed and public; T1–T8 re-run on the published URL: 8/8 | low-code | DONE |
| 2 | JSON export in `low-code/appsmith/export/smart-campus-lowcode.json` (checked: no e-mails, tokens or datasources). It was taken **before** Deploy, so its `publishedPage` is empty; the editor page with all 7 widgets is complete | low-code | DONE |
| 3 | Appsmith **mobile layout broken** at 375 px (truncated labels, overlapping button) because of the fixed layout. AC6 is only partly met on mobile | low-code | OPEN DEFECT |
| 4 | Preview T6 used 08:30; the deployed re-run used the exact 08:00 | low-code | RESOLVED |
| 5 | The full `<img src=x onerror=alert(1)>` payload was tested on the deployed app and rejected | low-code | DONE |
| 6 | Appsmith runs on a **15-day trial** (Business plan, no card); the app may stop after the trial | low-code | RISK |
| 7 | Bolt.new live demo `smart-campus-11-1q5d.bolt.host` still shows the **baseline** (start + end time). The duration version exists only in `code-based/` | code-based | NOT REPUBLISHED |
| 8 | `npm audit` findings in dev-only vitest 3.2.7 not fixed (needs a breaking upgrade) | code-based | OPEN |
| 9 | In both apps the previous result stays visible after the inputs are cleared, until the next check | both | UX ISSUE |
| 10 | Low-code title text is missing a closing `)`; the table "Download" button is left enabled | low-code | COSMETIC / LOW |
| 11 | No requirement was impossible in Appsmith, but validation order and overlap logic **could not be configured visually** and needed a JS Object | low-code | PLATFORM LIMIT |
