import { checkAvailability } from './availability.js';
import { DAY, NOW_ISO, ROOM, createBookings } from './fixtures.js';
import { REASON_MESSAGES, buildExplainInput, explainAvailability } from './explain.js';

// Demo data: one room, fictional bookings, fixed "current time" (shared with tests)
const NOW = new Date(NOW_ISO);
const BOOKINGS = createBookings();

const time = (iso) => iso.slice(11, 16);

document.getElementById('room-id').textContent = ROOM.id;
document.getElementById('now-label').textContent = `${DAY}, ${time(NOW_ISO)}`;

const list = document.getElementById('booking-list');
for (const b of BOOKINGS) {
  const li = document.createElement('li');
  li.textContent = `${time(b.start)}–${time(b.end)} (${b.id})`;
  list.appendChild(li);
}

const form = document.getElementById('check-form');
const result = document.getElementById('result');
const explainSection = document.getElementById('explain-section');
const explainBtn = document.getElementById('explain-btn');
const explanationEl = document.getElementById('explanation');
const mockModeEl = document.getElementById('mock-mode');

let lastCheck = null; // { roomLabel, start, end, status, reason }

function runCheck() {
  const startValue = document.getElementById('start').value;
  const endValue = document.getElementById('end').value;
  const blocked = document.getElementById('blocked').checked;

  result.hidden = false;
  explanationEl.hidden = true;
  explainSection.hidden = true;
  if (!startValue || !endValue) {
    result.className = 'result error';
    result.textContent = 'Enter both a start time and an end time.';
    lastCheck = null;
    return;
  }

  const request = { start: `${DAY}T${startValue}:00`, end: `${DAY}T${endValue}:00` };
  const { status, reason } = checkAvailability(request, { ...ROOM, blocked }, BOOKINGS, NOW);

  result.className = status === 'Available' ? 'result ok' : 'result error';
  result.textContent = `${status}: ${REASON_MESSAGES[reason] ?? reason}`;

  lastCheck = { roomLabel: ROOM.id, start: startValue, end: endValue, status, reason };
  explainSection.hidden = false;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  runCheck();
});

explainBtn.addEventListener('click', async () => {
  if (!lastCheck) return;
  explainBtn.disabled = true;
  const { roomLabel, start, end, status, reason } = lastCheck;
  const input = buildExplainInput(roomLabel, start, end, { status, reason });
  const { explanation, source } = await explainAvailability(input, {
    mode: mockModeEl.value,
    timeoutMs: 2000,
  });
  // The status must never change: keep the existing result text untouched.
  explanationEl.hidden = false;
  const label = source === 'llm' ? 'AI explanation (mock)' : 'Standard explanation (fallback)';
  explanationEl.textContent = `${label}: ${explanation}`;
  explainBtn.disabled = false;
});
