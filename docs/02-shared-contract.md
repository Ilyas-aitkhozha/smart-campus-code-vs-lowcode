# Task 02 — Shared requirement / acceptance-criteria sheet

This one sheet applies to **both** solutions (code-based and Appsmith low-code).

## User story
As a student, I want to choose a future start time and a duration for campus room R-101,
so that I immediately see whether the room is Available or Unavailable and why.

## Acceptance criteria
| ID | Criterion |
|---|---|
| AC1 | Start time must be in the future (strictly after the fixed "now", 2026-10-28 09:00). |
| AC2 | Duration must be greater than zero and at most 120 minutes (whole minutes). |
| AC3 | A slot that overlaps an existing booking is Unavailable. A slot that only touches a booking (e.g. 11:00 after 10:00–11:00) is allowed. |
| AC4 | A blocked room is Unavailable. |
| AC5 | A clear decision is displayed, and existing bookings are never changed. |
| AC6 | Invalid input gets understandable feedback (no crash, no silent "Available"). |

## Inputs
| Input | Type | Notes |
|---|---|---|
| `startTime` | `HH:MM` on 2026-10-28 | 00:00–23:59 |
| `durationMinutes` | integer | 1–120 is valid |
| `blocked` | boolean | room status (maintenance) |
| `bookings` | fixed fictional list | B1 R-101 10:00–11:00, B2 R-101 14:00–15:00 |
| `now` | fixed | 2026-10-28 09:00 |

## Outputs
| Output | Type | Example |
|---|---|---|
| `available` | boolean | `false` |
| `reasonCode` | string | `OVERLAP` |
| `message` | visible text | `Unavailable: this time overlaps with an existing booking.` |

## Reason codes (evaluation order)
| # | reasonCode | Kind | Visible message |
|---|---|---|---|
| 1 | `INVALID_START_TIME` | validation | Enter a valid start time (HH:MM). |
| 2 | `INVALID_DURATION` | validation | Enter the duration as a whole number of minutes. |
| 3 | `DURATION_TOO_SHORT` | validation | Duration must be greater than 0 minutes. |
| 4 | `DURATION_TOO_LONG` | validation | Duration can be at most 120 minutes. |
| 5 | `IN_THE_PAST` | validation | This start time is not in the future. Choose a later start time. |
| 6 | `ROOM_BLOCKED` | decision | Unavailable: this room is blocked and cannot be booked right now. |
| 7 | `OVERLAP` | decision | Unavailable: this time overlaps with an existing booking. |
| 8 | `OK` | decision | Available: the room is free for this time slot. |

Overlap rule: `start < booking.end AND end > booking.start`, where `end = start + duration`.

## Common test inputs (prepared before implementation)
| Test | startTime | duration | blocked | Expected |
|---|---|---|---|---|
| T1 | 12:00 | 60 | no | Available, `OK` |
| T2 | 10:30 | 60 | no | Unavailable, `OVERLAP` (B1) |
| T3 | 12:00 | 60 | yes | Unavailable, `ROOM_BLOCKED` |
| T4 | 12:00 | 0 | no | validation error, `DURATION_TOO_SHORT` |
| T5 | 12:00 | 121 | no | validation error, `DURATION_TOO_LONG` |
| T6 | 08:00 | 30 | no | validation error, `IN_THE_PAST` |
| T7 | 11:00 | 60 | no | Available, `OK` (touches B1, no overlap) |
| T8 | after T1–T7 | — | — | bookings list still B1 10:00–11:00, B2 14:00–15:00 |
