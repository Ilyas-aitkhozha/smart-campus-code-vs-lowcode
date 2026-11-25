# AI-use reflection

**Tools:** Claude (Anthropic, Claude Code desktop app, model Claude Opus 5.5) for analysis, the code-based implementation, tests, the Appsmith build guide and documentation drafts. Bolt.new for the original project and the live demo. The Appsmith app itself was assembled by hand in the visual editor.

**What was useful.** Before changing anything, the assistant ran the existing 58 tests on the Bolt export and left the Practice #08 booking rule and fixtures untouched, so the comparison was not tilted towards either approach. It wrote the shared contract and the eight test cases first, then split the code into validation, availability and display layers. It also pre-checked the Appsmith JS Object against the same cases in Node. Because of that, the low-code app passed T1–T8 on the first run.

**What was wrong or risky.** The first test run inside the repository folder failed on a long Windows path, and `npx` silently downloaded a different Vitest version (5.1.1 instead of the pinned 3.2.7). The green result looked fine but was not valid evidence, so the run was repeated with `--no-install` in a short folder. The assistant also once listed a DAST input (`-5`) that had never been run; it was removed. `npm audit` reported "critical" findings, but they sit in a dev-only test dependency, so the severity was judged by context, not copied from the tool. In Appsmith, the guide did not say clearly enough that bindings need the **JS** toggle: I typed the table binding into a search box and lost a few minutes.

**What I kept under my control.** The AI had no permission to commit or push. Commits were made only after my approval and under my name. I built and tested the Appsmith app myself, and personal data (e-mail in the workspace name, browser tabs) was blacked out before the screenshots were published.

**What I would improve.** Pin tool versions in scripts, upgrade vitest in a separate reviewed change, connect Appsmith to Git and export the app, and clear the old result whenever an input changes.
