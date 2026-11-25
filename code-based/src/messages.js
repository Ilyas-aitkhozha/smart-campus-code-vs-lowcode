// Practice #13 — visible messages for every reason code in the shared contract.
// Kept apart from the rules so the UI text can change without touching logic.

import { MAX_DURATION_MINUTES } from './availability.js';

export const CONTRACT_MESSAGES = {
  OK: 'Available: the room is free for this time slot.',
  OVERLAP: 'Unavailable: this time overlaps with an existing booking.',
  ROOM_BLOCKED: 'Unavailable: this room is blocked and cannot be booked right now.',
  INVALID_START_TIME: 'Enter a valid start time (HH:MM).',
  INVALID_DURATION: 'Enter the duration as a whole number of minutes.',
  DURATION_TOO_SHORT: 'Duration must be greater than 0 minutes.',
  DURATION_TOO_LONG: `Duration can be at most ${MAX_DURATION_MINUTES} minutes.`,
  IN_THE_PAST: 'This start time is not in the future. Choose a later start time.',
  INVALID_BOOKING_DATA: 'Unavailable: booking data is invalid, so availability cannot be confirmed.',
  UNKNOWN: 'Unavailable: the slot could not be checked.',
};

export function messageFor(reasonCode) {
  return CONTRACT_MESSAGES[reasonCode] ?? CONTRACT_MESSAGES.UNKNOWN;
}
