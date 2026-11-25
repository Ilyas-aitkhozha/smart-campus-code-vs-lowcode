// Practice #13 — shared-contract entry point used by the UI and by tests T1–T8.
//   1. validateSlotInput   (validation.js)   -> validation errors
//   2. checkAvailability   (availability.js) -> availability decision (unchanged rule from Practice #08)
//   3. messageFor          (messages.js)     -> visible message
// Output: { available: boolean, reasonCode: string, message: string, kind }

import { checkAvailability } from './availability.js';
import { validateSlotInput } from './validation.js';
import { messageFor } from './messages.js';

/**
 * @param {{ startTime: string, durationMinutes: number|string, blocked: boolean }} input
 * @param {{ day: string, now: Date, room: {id: string}, bookings: Array }} context
 */
export function checkSlot(input, { day, now, room, bookings }) {
  const v = validateSlotInput(input, day, now);
  if (!v.ok) {
    return { available: false, reasonCode: v.reasonCode, message: messageFor(v.reasonCode), kind: 'validation' };
  }

  const request = { start: toLocalIso(v.start), end: toLocalIso(v.end) };
  const { status, reason } = checkAvailability(request, { ...room, blocked: Boolean(input.blocked) }, bookings, now);
  const available = status === 'Available';
  return { available, reasonCode: reason, message: messageFor(reason), kind: available ? 'ok' : 'unavailable' };
}

const pad = (n) => String(n).padStart(2, '0');

// Local "YYYY-MM-DDTHH:MM:SS" (same format as the fixtures, no timezone shift)
export function toLocalIso(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
}
