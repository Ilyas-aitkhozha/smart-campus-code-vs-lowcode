// Practice #13 — input validation layer (shared contract, step 1 of 3).
// Pure function: no DOM access and no booking data. Returns the first rule
// that fails, so the same input always yields the same reason code.

import { MAX_DURATION_MINUTES } from './availability.js';

const HH_MM = /^([01]\d|2[0-3]):[0-5]\d$/;

/**
 * @param {{ startTime: string, durationMinutes: number|string }} input
 *        startTime as "HH:MM" on the demo day; durationMinutes as typed by the user
 * @param {string} day  demo day, "YYYY-MM-DD"
 * @param {Date} now    fixed current time
 * @returns {{ ok: true, start: Date, end: Date, durationMinutes: number }
 *          | { ok: false, reasonCode: string }}
 */
export function validateSlotInput(input, day, now) {
  const startTime = typeof input?.startTime === 'string' ? input.startTime.trim() : '';
  if (!HH_MM.test(startTime)) return { ok: false, reasonCode: 'INVALID_START_TIME' };

  const raw = input?.durationMinutes;
  const durationMinutes = typeof raw === 'string' && raw.trim() !== '' ? Number(raw) : raw;
  if (typeof durationMinutes !== 'number' || !Number.isInteger(durationMinutes)) {
    return { ok: false, reasonCode: 'INVALID_DURATION' };
  }
  // AC2: duration must be greater than zero and at most 120 minutes
  if (durationMinutes <= 0) return { ok: false, reasonCode: 'DURATION_TOO_SHORT' };
  if (durationMinutes > MAX_DURATION_MINUTES) return { ok: false, reasonCode: 'DURATION_TOO_LONG' };

  const start = new Date(`${day}T${startTime}:00`);
  // AC1: start time must be in the future (strictly after "now")
  if (start <= now) return { ok: false, reasonCode: 'IN_THE_PAST' };

  const end = new Date(start.getTime() + durationMinutes * 60000);
  return { ok: true, start, end, durationMinutes };
}
