// Shared demo fixtures for Smart Campus — single source of truth for the
// room, fixed "current time" and fictional bookings used by the UI and tests.

export const DAY = '2026-10-28';
export const NOW_ISO = '2026-10-28T09:00:00';
export const ROOM = { id: 'R-101', blocked: false };

const BASE_BOOKINGS = [
  { id: 'B2', roomId: 'R-101', start: '2026-10-28T14:00:00', end: '2026-10-28T15:00:00' },
  { id: 'B1', roomId: 'R-101', start: '2026-10-28T10:00:00', end: '2026-10-28T11:00:00' },
];

export function createBookings() {
  return BASE_BOOKINGS.map((b) => ({ ...b }));
}
