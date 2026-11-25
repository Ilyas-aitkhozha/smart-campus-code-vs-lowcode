// Practice #13 — Task 05: the eight shared test cases T1–T8.
// The same inputs are run manually in the Appsmith (low-code) app; see docs/test-cases.md.
import { describe, it, expect, beforeEach } from 'vitest';
import { checkSlot } from '../src/slotChecker.js';
import { DAY, NOW_ISO, ROOM, createBookings } from '../src/fixtures.js';

const NOW = new Date(NOW_ISO); // 2026-10-28 09:00; bookings B1 10:00–11:00, B2 14:00–15:00

let bookings;
const run = (startTime, durationMinutes, blocked = false) =>
  checkSlot({ startTime, durationMinutes, blocked }, { day: DAY, now: NOW, room: ROOM, bookings });

beforeEach(() => {
  bookings = createBookings();
});

describe('Shared contract T1–T8', () => {
  it('T1 valid free interval 12:00 + 60 -> Available', () => {
    const r = run('12:00', 60);
    expect(r).toMatchObject({ available: true, reasonCode: 'OK', kind: 'ok' });
    expect(r.message).toMatch(/^Available/);
  });

  it('T2 overlap 10:30 + 60 with B1 10:00–11:00 -> Unavailable', () => {
    expect(run('10:30', 60)).toMatchObject({ available: false, reasonCode: 'OVERLAP', kind: 'unavailable' });
  });

  it('T3 blocked room 12:00 + 60 -> Unavailable', () => {
    expect(run('12:00', 60, true)).toMatchObject({ available: false, reasonCode: 'ROOM_BLOCKED', kind: 'unavailable' });
  });

  it('T4 duration = 0 -> validation error', () => {
    expect(run('12:00', 0)).toMatchObject({ available: false, reasonCode: 'DURATION_TOO_SHORT', kind: 'validation' });
  });

  it('T5 duration = 121 -> validation error', () => {
    expect(run('12:00', 121)).toMatchObject({ available: false, reasonCode: 'DURATION_TOO_LONG', kind: 'validation' });
  });

  it('T6 past start time 08:00 + 30 -> validation error', () => {
    expect(run('08:00', 30)).toMatchObject({ available: false, reasonCode: 'IN_THE_PAST', kind: 'validation' });
  });

  it('T7 adjacent 11:00 + 60 (touches B1 end) -> Available', () => {
    expect(run('11:00', 60)).toMatchObject({ available: true, reasonCode: 'OK' });
  });

  it('T8 booking data unchanged after running T1–T7', () => {
    const snapshot = structuredClone(bookings);
    run('12:00', 60);
    run('10:30', 60);
    run('12:00', 60, true);
    run('12:00', 0);
    run('12:00', 121);
    run('08:00', 30);
    run('11:00', 60);
    expect(bookings).toEqual(snapshot);
  });
});

describe('Boundary and invalid-input checks (extra)', () => {
  it('duration = 120 is allowed', () => {
    expect(run('16:00', 120).available).toBe(true);
  });
  it('start exactly at "now" (09:00) is not in the future', () => {
    expect(run('09:00', 30).reasonCode).toBe('IN_THE_PAST');
  });
  it('slot ending exactly when B2 starts (13:00 + 60) is Available', () => {
    expect(run('13:00', 60).available).toBe(true);
  });
  it('empty start time -> INVALID_START_TIME', () => {
    expect(run('', 60).reasonCode).toBe('INVALID_START_TIME');
  });
  it('non-numeric / fractional duration -> INVALID_DURATION', () => {
    expect(run('12:00', 'abc').reasonCode).toBe('INVALID_DURATION');
    expect(run('12:00', 30.5).reasonCode).toBe('INVALID_DURATION');
    expect(run('12:00', '').reasonCode).toBe('INVALID_DURATION');
  });
  it('script-like text in start time is rejected as invalid, never echoed', () => {
    const r = run('<script>alert(1)</script>', 60);
    expect(r.reasonCode).toBe('INVALID_START_TIME');
    expect(r.message).not.toContain('<script>');
  });
  it('duration typed as a string ("60") is accepted like a number', () => {
    expect(run('12:00', '60')).toMatchObject({ available: true, reasonCode: 'OK' });
  });
});
