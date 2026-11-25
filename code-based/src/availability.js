// Smart Campus — room availability (Practice #08, FIXED version)
// Fixes:
//   BUG-A: overlap check uses strict < and >, so bookings that only TOUCH at endpoints are allowed
//   BUG-B: sorting a COPY of the array, so the caller's bookings are not changed

export const MAX_DURATION_MINUTES = 120;

/**
 * Checks whether a room can be booked for [start, end).
 * @param {{start: string, end: string}} request  ISO date-time strings
 * @param {{id: string, blocked: boolean}} room
 * @param {Array<{id: string, roomId: string, start: string, end: string}>} bookings
 * @param {Date} now  fixed "current time" (injected so tests are deterministic)
 * @returns {{status: 'Available'|'Unavailable', reason: string}}
 */
export function checkAvailability(request, room, bookings, now) {
  const start = new Date(request.start);
  const end = new Date(request.end);

  // Guard: invalid request timestamps make every NaN comparison false, so
  // without this the function would fall through to Available.
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { status: 'Unavailable', reason: 'INVALID_TIME' };
  }

  // AC1: start must be before end, and not in the past
  if (start >= end) return { status: 'Unavailable', reason: 'START_NOT_BEFORE_END' };
  if (start < now) return { status: 'Unavailable', reason: 'IN_THE_PAST' };

  // AC2: maximum duration 120 minutes
  const minutes = (end - start) / 60000;
  if (minutes > MAX_DURATION_MINUTES) return { status: 'Unavailable', reason: 'TOO_LONG' };

  // AC3: blocked room
  if (room.blocked) return { status: 'Unavailable', reason: 'ROOM_BLOCKED' };

  // FIX BUG-B: [...bookings] makes a copy, so the original array is not reordered
  const sorted = [...bookings].sort((a, b) => new Date(a.start) - new Date(b.start));

  // AC4: overlap check
  for (const b of sorted) {
    if (b.roomId !== room.id) continue;
    const bStart = new Date(b.start);
    const bEnd = new Date(b.end);
    // Guard: an invalid booking record for this room makes the overlap
    // comparison silently false; reject rather than risk a false Available.
    if (Number.isNaN(bStart.getTime()) || Number.isNaN(bEnd.getTime())) {
      return { status: 'Unavailable', reason: 'INVALID_BOOKING_DATA' };
    }
    // FIX BUG-A: strict < and > — "10:00-11:00" and "11:00-12:00" do NOT conflict
    if (start < bEnd && end > bStart) {
      return { status: 'Unavailable', reason: 'OVERLAP' };
    }
  }

  // AC5
  return { status: 'Available', reason: 'OK' };
}
