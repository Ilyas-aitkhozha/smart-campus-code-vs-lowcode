# Task 07 — Security review (Lecture #12)

Scope: only our own two apps. No third-party service was scanned. All runtime checks were safe manual inputs.

| # | Check | Code-based | Low-code (Appsmith) |
|---|---|---|---|
| 1 | **Input validation (SQL/command injection)** | No database or queries. A strict regex `^([01]\d\|2[0-3]):[0-5]\d$` and an integer check 1–120 run before use | No datasource or queries. The same regex and integer check run in the JS Object `SlotChecker` |
| 2 | **Output handling (XSS)** | Results rendered with `textContent`, never `innerHTML`. Messages come from a fixed map and never echo input. `<script>alert(1)</script>` → `INVALID_START_TIME` (automated test) | Messages come from a fixed map and never echo input. `<.b` → `INVALID_START_TIME`, nothing rendered as HTML. A full `<img onerror>` payload was not tried |
| 3 | **Permissions / public sharing** | Static, read-only site; no admin or edit surface | Editor access only for the owner account; no other users invited. The app was **not** made public and not deployed |
| 4 | **Secrets** | `grep` for key/token/secret/password in `code-based/src`, `index.html`, `package.json`: nothing found. The explain feature is a mock with no API key | No API keys, connectors or datasources were created, so no secrets are stored in the app |
| 5 | **Connectors / data sources** | None | None. Bookings are a constant list in the JS Object |
| 6 | **Personal data** | None; fictional room and bookings only | None in the app. Appsmith names the workspace after the account e-mail, and screenshots also showed personal browser tabs. Both areas were blacked out in the published screenshots (sensitive-data exposure, Lecture #12) |
| 7 | **Data exposure** | Bookings are visible by design (fictional) | The table **Download** button is enabled, so any viewer could export the table. Harmless with fictional data; it should be turned off for real data |
| 8 | **SCA (dependencies)** | `npm audit`: 3 findings (1 moderate, 2 critical) in **dev-only** `vitest@3.2.7` → `@vitest/mocker`, `tinypool`. They are not in the shipped `dist/` bundle. The fix is an upgrade to vitest 5 (breaking change), recorded as an action. See `evidence/07-npm-audit.txt` | Platform-managed: Appsmith patches its runtime and widgets. We cannot see, audit or pin these components. The responsibility moves to the vendor; we only control the app config and the JS Object |
| 9 | **SAST (code review)** | Manual review of `validation.js`, `slotChecker.js`, `main.js`: no `eval`, no `innerHTML` (grep verified) | Manual review of the JS Object: no `eval`, no network calls, a read-only loop over the bookings. Widget internals cannot be reviewed |
| 10 | **DAST (running app)** | Browser runs: `0`, `121`, past time (screenshots T4–T6). Automated: empty start, `abc`, `30.5`, empty duration, script-like text. Every case gave a clear message, no crash, no false Available | Preview runs T4–T6 and the HTML-like input: every case gave a clear message, no crash, no false Available |
| 11 | **AI agent least privilege** | The AI assistant worked in a local copy and had no commit or push rights. Commits were made only after the author approved | The AI assistant had no access to the Appsmith account. The author built the app by hand from the guide |

## Findings and actions
| Finding | Where | Severity | Action |
|---|---|---|---|
| Vulnerable dev dependency (vitest 3.x chain) | code-based | medium in practice (dev-only, local) | Upgrade to vitest ≥ 5 in a separate change, then rerun all tests |
| Table **Download** enabled | low-code | low (fictional data) | Turn off "Allow download" on `tblBookings` |
| Vendor-managed runtime, not auditable | low-code | informational | Accept a vendor patch policy and review Appsmith release notes, or self-host to pin versions |
| Trial-based hosting | low-code | availability risk | Do not rely on the trial for anything that must stay online |
