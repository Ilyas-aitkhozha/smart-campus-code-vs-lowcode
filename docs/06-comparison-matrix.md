# Task 06 — Engineering effort and comparison matrix

## Measured effort
Low-code times come from the system clock visible in full-screen screenshots (`screenshots/low-code/`).
Code-based times come from the Vitest "Start at" timestamps and the session log.

| Phase | Code-based | Low-code (Appsmith) | Evidence |
|---|---|---|---|
| Setup | ~1 min (unzip, `npm install`, baseline run 19:12:25 on 24.11) | **8 min** (19:01 → 19:09: sign-up, org creation loop, plan screen, editor open) | `00-setup-start-1901`, `02-org-loop-1907`, `03-editor-open-1909` |
| Implementation | ~2 min (new layers written, tests green 19:14:57) | **14 min** (19:09 → 19:27 minus debugging) | `04-jsobject-…-1912`, `07-widgets-done-1927` |
| Debugging | ~1 min (`npm ci` failed on a long Windows path; rerun in a short folder) | **≤ 4 min** (table data typed into the datasource search box instead of a JS binding; fixed by 19:20) | `05-debug-table-binding-mistake`, `06-table-bound-1920` |
| Testing | ~2 min (Vitest + 7 manual browser runs + mobile) | **~3 min** (19:29 → 19:31, 7 manual runs + 1 extra) | `T1…T7`, `X1` |
| **Total** | **~6 min** | **~30 min** (19:01 → 19:31) | |

**Read these numbers with care.** The code-based track reused an existing rule engine and tests, and an AI assistant wrote the new code.
The low-code track was built by hand in a new tool, with a written guide and a script that had been pre-checked against the same rules.
So the difference measures "reuse existing code + AI" vs. "learn a new platform", not code vs. low-code in general.

## Comparison matrix
| Criterion | Code-based | Low-code (Appsmith) |
|---|---|---|
| Functional tests | **8 / 8** (automated + manual) | **8 / 8** (manual: preview + deployed re-run) |
| Build and repair time | **~6 min** | **~30 min** |
| Unresolved defects | 0 functional; stale result after clearing inputs (UX) | 0 functional; **mobile layout broken at 375 px** (AC6 partial); stale result (UX); title missing `)` (cosmetic) |
| Customization | Full control of UI, messages, colours and breakpoints; any rule can be expressed and unit-tested | Fast visual layout, but non-trivial logic (overlap, validation order) still needed a JS Object. Widget-level validation shows its own tooltip, so it was not used, to keep one shared message set |
| Security controls | Validation in code, `textContent` only, 15 automated invalid-input tests, `npm audit` (SCA) | Same validation in a JS Object; platform renders text; table **Download** button left enabled; platform runtime not auditable by us |
| Versioning / portability | Plain files in Git, line-level diffs, runs anywhere with Node; `vite build` gives static files | App lives on Appsmith Cloud. A JSON export (one large file with layout coordinates) is in Git, but it only re-imports into Appsmith. "Connect Git" exists but was not used |
| Ongoing cost | Free (static hosting / Bolt publish) | Cloud sign-up showed only paid plans (Business $15/user/month, Enterprise). Used a **15-day free trial, no card**. The app may stop working after the trial |

## Review, export and version control
| | Code-based | Low-code |
|---|---|---|
| Review | Line-by-line Git diff; tests run before acceptance | Visual inspection of each widget; no diff of widget changes was used |
| Export | Source files + `npm run build` | Platform JSON export (`export/smart-campus-lowcode.json`) + the script file kept by hand |
| Version control | Git history in this repository | Not connected (Git connect available but not set up) |

## Measured vs. impressions
- **Measured:** test counts, timestamps from the clock in screenshots, audit output, the plan/paywall screen.
- **Impressions (author):** the Appsmith canvas was quick for layout once widgets were named, but the property panel hides where bindings go: the table data mistake. Code was easier to reason about for the overlap and validation order.

## Recommendation
For this feature, choose **code-based** as the primary solution. It is 8/8 with automated regression tests, it is versioned in Git with real diffs, it costs nothing, and it is portable.
Appsmith also reached 8/8, but only by placing the core rules in a JavaScript object anyway, so low-code saved layout work, not logic work. Even that layout broke on mobile. It also adds a trial-based cost risk and weaker version control unless Git sync is set up.
Low-code is reasonable for a quick internal prototype or admin screen, provided Git sync is connected and plan costs are approved.
