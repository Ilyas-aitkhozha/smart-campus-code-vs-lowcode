# Task 01 — Frozen baseline

| Item | Value |
|---|---|
| Source | Bolt.new export `project-bolt-sb1-tt4jygux.zip` (Smart Campus checker, Practice #09–#11 line) |
| Package | `smart-campus-practice09` v1.0.0 |
| Toolchain | Node v24.13.1, npm 11.8.0, Vite 6.4.5, Vitest 3.2.7 |
| Live demo (baseline) | https://smart-campus-11-1q5d.bolt.host |
| Fixed "now" | 2026-10-28 09:00 |
| Room | R-101, `blocked: false` by default |
| Fictional bookings | B1 10:00–11:00, B2 14:00–15:00 (R-101) |
| Baseline UI inputs | start time + **end time** + blocked checkbox |
| Existing checks | `npm test` → **58 passed (58)**, 4 test files. See `evidence/01-baseline-tests.txt` |
| Baseline screenshot | `screenshots/code-based/00-baseline-live-demo.jpg` |

## Expected behaviour (baseline rule `checkAvailability`)
- `start >= end` → `START_NOT_BEFORE_END`; `start < now` → `IN_THE_PAST`
- more than 120 minutes → `TOO_LONG` (exactly 120 is allowed)
- blocked room → `ROOM_BLOCKED`
- overlap with a booking of the same room → `OVERLAP`. Touching intervals are allowed (strict `<` / `>`).
- the bookings array is never mutated (a copy is sorted)

## Freeze rule
`src/availability.js` and `src/fixtures.js` were **not modified** in Practice #13, so the booking rules were not tuned to favour either approach.
The low-code app uses the same fixture values (copied by hand, see `low-code/appsmith/`).
