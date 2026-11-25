// Appsmith JS Object "SlotChecker" — paste into: Queries/JS → + New JS Object → rename to SlotChecker.
// It is the only script in the low-code app. Widgets, layout, the bookings table and the
// input constraints are configured visually (see BUILD-GUIDE.md).
// Same fixtures and same rule order as docs/02-shared-contract.md.
export default {
  NOW: '2026-10-28T09:00',
  DAY: '2026-10-28',
  MAX_DURATION: 120,
  // Fictional bookings — must stay unchanged (T8)
  bookings: [
    { id: 'B1', roomId: 'R-101', start: '10:00', end: '11:00' },
    { id: 'B2', roomId: 'R-101', start: '14:00', end: '15:00' },
  ],
  result: { available: false, reasonCode: '', message: 'Choose a start time and a duration, then press Check availability.' },

  toMinutes(hhmm) {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  },

  messages: {
    OK: 'Available: the room is free for this time slot.',
    OVERLAP: 'Unavailable: this time overlaps with an existing booking.',
    ROOM_BLOCKED: 'Unavailable: this room is blocked and cannot be booked right now.',
    INVALID_START_TIME: 'Enter a valid start time (HH:MM).',
    INVALID_DURATION: 'Enter the duration as a whole number of minutes.',
    DURATION_TOO_SHORT: 'Duration must be greater than 0 minutes.',
    DURATION_TOO_LONG: 'Duration can be at most 120 minutes.',
    IN_THE_PAST: 'This start time is not in the future. Choose a later start time.',
  },

  decide(startTime, durationRaw, blocked) {
    const start = String(startTime ?? '').trim();
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(start)) return 'INVALID_START_TIME';
    const duration = durationRaw === '' || durationRaw === null || durationRaw === undefined ? NaN : Number(durationRaw);
    if (!Number.isInteger(duration)) return 'INVALID_DURATION';
    if (duration <= 0) return 'DURATION_TOO_SHORT';
    if (duration > this.MAX_DURATION) return 'DURATION_TOO_LONG';
    const s = this.toMinutes(start);
    if (s <= this.toMinutes(this.NOW.slice(11, 16))) return 'IN_THE_PAST';
    if (blocked === true) return 'ROOM_BLOCKED';
    const e = s + duration;
    // read-only loop over the bookings: nothing is sorted, pushed or assigned (T8)
    for (const b of this.bookings) {
      if (b.roomId !== 'R-101') continue;
      if (s < this.toMinutes(b.end) && e > this.toMinutes(b.start)) return 'OVERLAP';
    }
    return 'OK';
  },

  check() {
    const reasonCode = this.decide(inpStart.text, inpDuration.text, swBlocked.isSwitchedOn);
    this.result = { available: reasonCode === 'OK', reasonCode, message: this.messages[reasonCode] };
    return this.result;
  },
};
