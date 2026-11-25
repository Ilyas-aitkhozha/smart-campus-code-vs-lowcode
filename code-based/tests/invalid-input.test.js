import { describe, it, expect, beforeEach } from 'vitest';
import { checkAvailability } from '../src/availability.js';
import { NOW_ISO, ROOM, createBookings } from '../src/fixtures.js';

const NOW = new Date(NOW_ISO);

let bookings;

beforeEach(() => {
  bookings = createBookings();
});

describe('Invalid input — request timestamps', () => {
  it('rejects a garbage start time', () => {
    const r = checkAvailability({ start: 'garbage', end: '2026-10-28T10:30:00' }, ROOM, bookings, NOW);
    expect(r.status).toBe('Unavailable');
    expect(r.reason).toBe('INVALID_TIME');
  });

  it('rejects a garbage end time', () => {
    const r = checkAvailability({ start: '2026-10-28T10:30:00', end: 'garbage' }, ROOM, bookings, NOW);
    expect(r.status).toBe('Unavailable');
    expect(r.reason).toBe('INVALID_TIME');
  });

  it('rejects empty string timestamps', () => {
    const r = checkAvailability({ start: '', end: '' }, ROOM, bookings, NOW);
    expect(r.status).toBe('Unavailable');
    expect(r.reason).toBe('INVALID_TIME');
  });
});

describe('Invalid input — booking data', () => {
  it('rejects when a booking of this room has an invalid start', () => {
    const corrupted = [
      ...bookings,
      { id: 'X1', roomId: 'R-101', start: 'garbage', end: '2026-10-28T16:00:00' },
    ];
    const r = checkAvailability({ start: '2026-10-28T16:00:00', end: '2026-10-28T17:00:00' }, ROOM, corrupted, NOW);
    expect(r.status).toBe('Unavailable');
    expect(r.reason).toBe('INVALID_BOOKING_DATA');
  });
});

describe('Invalid input — control', () => {
  it('still reports Available/OK for a valid touching slot (11:00-12:00)', () => {
    const r = checkAvailability({ start: '2026-10-28T11:00:00', end: '2026-10-28T12:00:00' }, ROOM, bookings, NOW);
    expect(r.status).toBe('Available');
    expect(r.reason).toBe('OK');
  });
});
