import { describe, it, expect, beforeEach } from 'vitest';
import { checkAvailability } from '../src/availability.js';
import { NOW_ISO, ROOM, createBookings } from '../src/fixtures.js';

// Fixed clock: 28 Oct 2026, 09:00 — shared with the UI so tests are deterministic.
const NOW = new Date(NOW_ISO);

// AC1 — start must be strictly before end and must not lie in the past.
// AC2 — a booking may last at most 120 minutes; exactly 120 is allowed.
// AC3 — a blocked room can never be booked.
// AC4 — overlapping slots are rejected; slots that only touch at an endpoint are allowed.
// AC5 — the function must not mutate the bookings passed in.
// AC6 — clear feedback messages are a UI concern; here we assert the rule returns
//       a status and a human-readable reason code the UI can map to a message.

let bookings;

beforeEach(() => {
  bookings = createBookings();
});

describe('AC1 — valid time range', () => {
  it('rejects a start time in the past', () => {
    const r = checkAvailability(
      { start: '2026-10-28T08:00:00', end: '2026-10-28T08:30:00' },
      ROOM,
      bookings,
      NOW,
    );
    expect(r.status).toBe('Unavailable');
    expect(r.reason).toBe('IN_THE_PAST');
  });

  it('rejects a reversed interval (start >= end)', () => {
    const r = checkAvailability(
      { start: '2026-10-28T12:00:00', end: '2026-10-28T11:00:00' },
      ROOM,
      bookings,
      NOW,
    );
    expect(r.status).toBe('Unavailable');
    expect(r.reason).toBe('START_NOT_BEFORE_END');
  });

  it('rejects an equal start and end (start == end)', () => {
    const r = checkAvailability(
      { start: '2026-10-28T12:00:00', end: '2026-10-28T12:00:00' },
      ROOM,
      bookings,
      NOW,
    );
    expect(r.status).toBe('Unavailable');
    expect(r.reason).toBe('START_NOT_BEFORE_END');
  });
});

describe('AC2 — maximum duration 120 minutes', () => {
  it('rejects a 121-minute booking', () => {
    const r = checkAvailability(
      { start: '2026-10-28T16:00:00', end: '2026-10-28T18:01:00' },
      ROOM,
      bookings,
      NOW,
    );
    expect(r.status).toBe('Unavailable');
    expect(r.reason).toBe('TOO_LONG');
  });

  it('allows a booking of exactly 120 minutes', () => {
    const r = checkAvailability(
      { start: '2026-10-28T16:00:00', end: '2026-10-28T18:00:00' },
      ROOM,
      bookings,
      NOW,
    );
    expect(r.status).toBe('Available');
    expect(r.reason).toBe('OK');
  });
});

describe('AC3 — blocked room', () => {
  it('rejects an otherwise valid slot when the room is blocked', () => {
    const r = checkAvailability(
      { start: '2026-10-28T16:00:00', end: '2026-10-28T17:00:00' },
      { id: 'R-101', blocked: true },
      bookings,
      NOW,
    );
    expect(r.status).toBe('Unavailable');
    expect(r.reason).toBe('ROOM_BLOCKED');
  });
});

describe('AC4 — overlaps and touching endpoints', () => {
  it('rejects a slot that overlaps an existing booking', () => {
    const r = checkAvailability(
      { start: '2026-10-28T10:30:00', end: '2026-10-28T11:30:00' },
      ROOM,
      bookings,
      NOW,
    );
    expect(r.status).toBe('Unavailable');
    expect(r.reason).toBe('OVERLAP');
  });

  it('allows a booking that starts exactly when another ends (touching at start)', () => {
    const r = checkAvailability(
      { start: '2026-10-28T11:00:00', end: '2026-10-28T12:00:00' },
      ROOM,
      bookings,
      NOW,
    );
    expect(r.status).toBe('Available');
    expect(r.reason).toBe('OK');
  });

  it('allows a booking that ends exactly when another starts (touching at end)', () => {
    const r = checkAvailability(
      { start: '2026-10-28T13:00:00', end: '2026-10-28T14:00:00' },
      ROOM,
      bookings,
      NOW,
    );
    expect(r.status).toBe('Available');
    expect(r.reason).toBe('OK');
  });

  it('ignores bookings that belong to a different room', () => {
    const r = checkAvailability(
      { start: '2026-10-28T10:00:00', end: '2026-10-28T11:00:00' },
      { id: 'R-202', blocked: false },
      bookings,
      NOW,
    );
    expect(r.status).toBe('Available');
    expect(r.reason).toBe('OK');
  });
});

describe('AC5 — no mutation of booking data', () => {
  it('leaves the bookings array and its objects unchanged after a call', () => {
    const snapshot = structuredClone(bookings);
    checkAvailability(
      { start: '2026-10-28T16:00:00', end: '2026-10-28T17:00:00' },
      ROOM,
      bookings,
      NOW,
    );
    expect(bookings).toEqual(snapshot);
  });

  it('leaves the bookings array unchanged even when an overlap is found', () => {
    const snapshot = structuredClone(bookings);
    checkAvailability(
      { start: '2026-10-28T10:30:00', end: '2026-10-28T11:30:00' },
      ROOM,
      bookings,
      NOW,
    );
    expect(bookings).toEqual(snapshot);
  });
});

describe('Fixtures — unchanged values', () => {
  it('exposes the fixed current time and room from src/fixtures.js', () => {
    expect(NOW_ISO).toBe('2026-10-28T09:00:00');
    expect(ROOM).toEqual({ id: 'R-101', blocked: false });
  });

  it('returns the same two bookings with the expected values', () => {
    const fresh = createBookings();
    expect(fresh).toEqual([
      { id: 'B2', roomId: 'R-101', start: '2026-10-28T14:00:00', end: '2026-10-28T15:00:00' },
      { id: 'B1', roomId: 'R-101', start: '2026-10-28T10:00:00', end: '2026-10-28T11:00:00' },
    ]);
  });

  it('returns independent copies so callers cannot affect each other', () => {
    const a = createBookings();
    const b = createBookings();
    a[0].id = 'CHANGED';
    expect(b[0].id).toBe('B2');
  });
});
