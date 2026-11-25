# Task 04 — Low-code solution in Appsmith (build guide)

Platform: Appsmith Cloud, free plan (https://app.appsmith.com). No subscription and no datasource are needed.
Bookings are a constant list in a JS Object. The app does not use a database, login, connector or API key.

> ⏱ Measure time separately for **setup**, **implementation**, **debugging** and **testing** (Task 06).

## 1. Setup
1. Sign in to Appsmith Cloud and create a new workspace application named `Smart Campus — low-code`.
2. Open the app. You land on the empty canvas of `Page1`.

## 2. Widgets (drag from the left Widgets panel)
> Lesson learned while building: any `{{ … }}` binding must go into the field **after pressing the small `JS` toggle** next to the property name (e.g. Table data, onClick). Typing it into the dropdown search does nothing.
> The button was finally wired with onClick → JS → `{{SlotChecker.check()}}`, and the result text with `{{SlotChecker.result.message + "  (reason=" + SlotChecker.result.reasonCode + ")"}}` in a single Text widget.

| Widget | Name (rename it!) | Properties |
|---|---|---|
| Text | `txtTitle` | Text: `Smart Campus — Room R-101 (low-code)` |
| Text | `txtNow` | Text: `Current time (fixed for the demo): 2026-10-28, 09:00` |
| Table | `tblBookings` | Table data: `{{SlotChecker.bookings}}`. Turn off "Allow adding a row", inline editing and the "Download" button. |
| Input | `inpStart` | Data type: Text. Label: `Start time (HH:MM)`. Placeholder: `12:00` |
| Input | `inpDuration` | Data type: **Number**. Label: `Duration (minutes)`. Default value: `60` |
| Switch | `swBlocked` | Label: `Room is blocked (maintenance)`. Default: off |
| Button | `btnCheck` | Label: `Check availability`. onClick → Execute a JS function → `SlotChecker.check` |
| Text | `txtResult` | Text: `{{SlotChecker.result.message}}` |
| Text | `txtCode` | Text: `{{"available=" + SlotChecker.result.available + " · reason=" + SlotChecker.result.reasonCode}}` |

Optional, no code: `txtResult` → Style → Text color →
`{{SlotChecker.result.available ? "#17643a" : "#9b1c1c"}}`

**Leave Min/Max/Regex/Required unset on the inputs.** Otherwise Appsmith blocks the button before the check runs, and T4/T5 would show the widget's own tooltip instead of the shared message. Record in the report if you try that variant.

## 3. Logic (the only script)
1. Left panel → **JS** → `+` → New JS Object → rename it to `SlotChecker`.
2. Replace its content with `SlotChecker.jsobject.js` from this folder and save.
3. Click `btnCheck` once in preview to make sure the result text changes.

## 4. Responsive check
Switch the canvas to **Mobile** (the device icon at the top) and confirm the widgets stack and stay readable. Take a screenshot.

## 5. Tests T1–T8
Press **Preview** (top right). For each case, type the values, press the button and take a screenshot:

| Test | Start | Duration | Blocked | Expected text |
|---|---|---|---|---|
| T1 | 12:00 | 60 | off | Available … reason=OK |
| T2 | 10:30 | 60 | off | Unavailable: overlaps … reason=OVERLAP |
| T3 | 12:00 | 60 | **on** | Unavailable: blocked … reason=ROOM_BLOCKED |
| T4 | 12:00 | 0 | off | Duration must be greater than 0 … DURATION_TOO_SHORT |
| T5 | 12:00 | 121 | off | Duration can be at most 120 … DURATION_TOO_LONG |
| T6 | 08:00 | 30 | off | not in the future … IN_THE_PAST |
| T7 | 11:00 | 60 | off | Available … reason=OK |
| T8 | — | — | — | the table still shows B1 10:00–11:00 and B2 14:00–15:00 |

Also try these DAST-style inputs: `<b>x</b>` and `<img src=x onerror=alert(1)>` as start time.
Expected result: "Enter a valid start time (HH:MM)", no bold text and no alert.

## 6. Publish, sharing and export
1. **Deploy** (top right).
2. Share → "Make application public" **on**, so the teacher can open the link. Do not invite anyone as an editor.
3. Copy the deployed URL into the report.
4. App menu (⋯ next to the app name on the home page) → **Export** → save the `.json` file as `low-code/appsmith/export/smart-campus-lowcode.json`.
   Before committing, check that it contains no tokens or e-mails. The AI assistant will check it too.
