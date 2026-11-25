# AGENTS.md — Smart Campus room availability

## Project
Smart Campus room availability checker. One room (R-101), fictional bookings,
fixed "current time" 2026-10-28 09:00. The app only decides Available / Unavailable.
User story: As a student, I want to check a room's availability so I can choose a valid booking time.

## Structure
- `src/availability.js` — pure booking rule `checkAvailability(request, room, bookings, now)` (authoritative; not edited by the explain feature)
- `src/fixtures.js` — shared demo data: room, fixed time, fictional bookings (used by UI and tests)
- `src/explain.js` — optional "Explain availability" mock adapter: buildExplainInput, validateExplainInput, SYSTEM_PROMPT, mockLlm, validateExplanation, explainAvailability; never calls a real API and never mutates bookings
- `src/main.js` — UI logic (form, messages) + explain button wiring
- `index.html`, `src/style.css` — page markup and responsive styles (incl. explain button, mock-mode select, explanation panel)
- `tests/availability.test.js` — Vitest tests T01–T10 (from Practice #08)
- `tests/regression.test.js` — regression tests AC1–AC5
- `tests/invalid-input.test.js` — invalid date input must return Unavailable
- `tests/explain.test.js` — tests for the optional explain feature (happy paths, failures, injection, no mutation)

## Acceptance criteria (must stay true)
- AC1: reject start >= end and requests in the past.
- AC2: reject durations longer than 120 minutes (exactly 120 is allowed).
- AC3: reject a blocked room.
- AC4: reject overlaps; allow bookings that only touch at endpoints (10:00–11:00 and 11:00–12:00 do not conflict).
- AC5: return Available / Unavailable without changing (mutating) booking data.
- AC6: keep clear feedback messages on desktop and mobile widths.

## Constraints
- No backend, login, database or saved booking creation.
- No secrets, API keys, tokens, or credentials of any kind in code or config.
- No external deployments: do not publish, push, or deploy the app or its build output.
- Do not change the UI layout, texts or styles unless the task says so.
- Do not change the fixture data values (room, bookings, fixed time).

## Engineering rules
- Prefer pure functions and minimal changes; one problem per change.
- Use at most 2 design patterns, and only with a written reason (problem -> pattern -> benefit).
- Do not add Singleton, Factory, Strategy or class hierarchies without a concrete need.
- Do not add new dependencies.

## Commands
- Install: `npm install`
- Preview: `npm run dev`
- Tests: `npm test` (runs `vitest run`)
- Build check: `npm run build`. There is no lint or type-check script; do not add one without approval.

## Verification
- Run the full test suite (`npm test`) before proposing acceptance; all tests must pass.
- Add focused regression tests for any rule change; never weaken or delete existing assertions.
- Report: changed files, rationale, exact test command and its output (passed / failed counts).
- If you could not run something, say so. Do not claim tests passed without real output.

## Agent boundaries
- Work only in a duplicated project or a separate branch; never edit the original Practice #09 project.
- Read-only review first; apply changes only after explicit human approval of the diff.
- Do not refactor or change files outside the approved scope.
