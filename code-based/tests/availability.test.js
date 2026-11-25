import { describe, it, expect, beforeEach } from 'vitest';
import { checkAvailability } from '../src/availability.js';
import { NOW_ISO, ROOM, createBookings } from '../src/fixtures.js';

// Fixed clock: 28 Oct 2026, 09:00 (no real "now" => deterministic tests)
const NOW = new Date(NOW_ISO);

let bookings; // fresh fixture before every test

beforeEach(() => {
  bookings = createBookings();
});

describe('AC1 — valid time range', () => {
  it('T01 rejects start >= end', () => {
    const r = checkAvailability({ start: '2026-10-28T12:00:00', end: '2026-10-28T12:00:00' }, ROOM, bookings, NOW);
    expect(r.status).toBe('Unavailable');
  });
  it('T02 rejects requests in the past', () => {
    const r = checkAvailability({ start: '2026-10-28T08:00:00', end: '2026-10-28T08:30:00' }, ROOM, bookings, NOW);
    expect(r.status).toBe('Unavailable');
  });
});

describe('AC2 — max duration 120 min', () => {
  it('T03 allows exactly 120 minutes', () => {
    const r = checkAvailability({ start: '2026-10-28T16:00:00', end: '2026-10-28T18:00:00' }, ROOM, bookings, NOW);
    expect(r.status).toBe('Available');
  });
  it('T04 rejects 121 minutes', () => {
    const r = checkAvailability({ start: '2026-10-28T16:00:00', end: '2026-10-28T18:01:00' }, ROOM, bookings, NOW);
    expect(r.status).toBe('Unavailable');
  });
});

describe('AC3 — blocked room', () => {
  it('T05 rejects a blocked room', () => {
    const r = checkAvailability({ start: '2026-10-28T16:00:00', end: '2026-10-28T17:00:00' }, { id: 'R-101', blocked: true }, bookings, NOW);
    expect(r.status).toBe('Unavailable');
  });
});

describe('AC4 — overlaps', () => {
  it('T06 rejects a real overlap', () => {
    const r = checkAvailability({ start: '2026-10-28T10:30:00', end: '2026-10-28T11:30:00' }, ROOM, bookings, NOW);
    expect(r.status).toBe('Unavailable');
  });
  it('T07 (BUG-A) allows a booking that starts exactly when another ends', () => {
    const r = checkAvailability({ start: '2026-10-28T11:00:00', end: '2026-10-28T12:00:00' }, ROOM, bookings, NOW);
    expect(r.status).toBe('Available');
  });
  it('T08 (BUG-A) allows a booking that ends exactly when another starts', () => {
    const r = checkAvailability({ start: '2026-10-28T13:00:00', end: '2026-10-28T14:00:00' }, ROOM, bookings, NOW);
    expect(r.status).toBe('Available');
  });
  it('T09 ignores bookings of other rooms', () => {
    const r = checkAvailability({ start: '2026-10-28T10:00:00', end: '2026-10-28T11:00:00' }, { id: 'R-202', blocked: false }, bookings, NOW);
    expect(r.status).toBe('Available');
  });
});

describe('AC5 — no mutation of booking data', () => {
  it('T10 (BUG-B) does not change the original bookings array', () => {
    const snapshot = structuredClone(bookings);
    checkAvailability({ start: '2026-10-28T16:00:00', end: '2026-10-28T17:00:00' }, ROOM, bookings, NOW);
    expect(bookings).toEqual(snapshot);
  });
});
