# Smart Campus — code-based vs. low-code

AI-Driven Software Engineering, Practice #13 (Lesson 12: compare code-based and low-code solutions).
Author: **Aitkhozha Ilyas, 24B031612**.

The same small feature, a room-availability check for one fictional campus room, is built in two ways and compared with evidence:

| Track | Where | Live |
|---|---|---|
| Code-based | `code-based/` (Vite + JavaScript, from the Bolt.new project) | Bolt.new: https://smart-campus-11-1q5d.bolt.host (baseline version; the duration version is in `code-based/`, see limitations) |
| Low-code | Appsmith Cloud (15-day trial), guide and script in `low-code/appsmith/` | not deployed (tested in editor preview, see limitations) |

## Result in one line
Both apps pass **8/8** shared tests. Code-based: ~6 min (reused engine + AI), Git-versioned, free. Appsmith: ~30 min by hand, logic still needed a JS Object, trial-based hosting. **Recommendation: code-based.**

## Contents
| Task | Document | Evidence |
|---|---|---|
| 01 Freeze the baseline | [docs/01-baseline.md](docs/01-baseline.md) | `evidence/01-baseline-tests.txt`, `screenshots/code-based/00-baseline-live-demo.jpg` |
| 02 Common contract | [docs/02-shared-contract.md](docs/02-shared-contract.md) | — |
| 03 Code-based solution | [docs/03-code-based.md](docs/03-code-based.md) | `evidence/03-*`, `evidence/05-*`, `screenshots/code-based/` |
| 04 Low-code solution | [low-code/appsmith/BUILD-GUIDE.md](low-code/appsmith/BUILD-GUIDE.md) | `evidence/04-appsmith-script-precheck.txt`, `screenshots/low-code/` |
| 05 Identical tests T1–T8 | [docs/05-test-results.md](docs/05-test-results.md) | screenshots of both apps |
| 06 Effort + comparison matrix | [docs/06-comparison-matrix.md](docs/06-comparison-matrix.md) | timestamps in evidence files |
| 07 Security review | [docs/07-security-checklist.md](docs/07-security-checklist.md) | `evidence/07-npm-audit.txt` |
| AI-use reflection | [docs/08-ai-reflection.md](docs/08-ai-reflection.md) | — |
| Remaining limitations | [docs/09-limitations.md](docs/09-limitations.md) | — |
| **Full report (Word)** | [report/Practice13_Report_Aitkhozha_Ilyas.docx](report/Practice13_Report_Aitkhozha_Ilyas.docx) | source: `report/REPORT.md` |

## Labels
- ✅ measured / observed result
- ⚠️ / NOT DONE: listed in `docs/09-limitations.md`, never filled with guessed values
- Anything simulated or not supported in the low-code app is marked **SIMULATED** or **NOT SUPPORTED** in the docs.

## Quick start (code-based)
```
cd code-based
npm ci
npm test
npm run dev
```

## AI tools used
- Claude (Anthropic, Claude Code desktop, model Claude Opus 5.5): analysis, code-based implementation, tests, documentation drafts
- Bolt.new: original project and live demo
- Appsmith Cloud: low-code track (no AI features used)
