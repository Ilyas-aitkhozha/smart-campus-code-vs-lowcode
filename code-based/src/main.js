import { checkSlot } from './slotChecker.js';
import { DAY, NOW_ISO, ROOM, createBookings } from './fixtures.js';
import { buildExplainInput, explainAvailability } from './explain.js';

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

const CLASS_BY_KIND = { ok: 'result ok', unavailable: 'result error', validation: 'result warn' };

let lastCheck = null; // { roomLabel, start, end, status, reason }

function addMinutes(hhmm, minutes) {
  const [h, m] = hhmm.split(':').map(Number);
  const total = (h * 60 + m + minutes) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

// UI layer only: read inputs -> checkSlot -> render. All rules live in validation.js / availability.js.
function runCheck() {
  const input = {
    startTime: document.getElementById('start').value,
    durationMinutes: document.getElementById('duration').value,
    blocked: document.getElementById('blocked').checked,
  };
  const out = checkSlot(input, { day: DAY, now: NOW, room: ROOM, bookings: BOOKINGS });

  result.hidden = false;
  explanationEl.hidden = true;
  result.className = CLASS_BY_KIND[out.kind];
  // textContent (not innerHTML): user input is never interpreted as HTML (XSS-safe)
  result.textContent = out.message;
  const code = document.createElement('span');
  code.className = 'result-code';
  code.textContent = `available=${out.available} · reason=${out.reasonCode}`;
  result.appendChild(code);

  // The optional explainer only makes sense for a real availability decision.
  if (out.kind === 'validation') {
    explainSection.hidden = true;
    lastCheck = null;
    return;
  }
  const end = addMinutes(input.startTime, Number(input.durationMinutes));
  lastCheck = {
    roomLabel: ROOM.id,
    start: input.startTime,
    end,
    status: out.available ? 'Available' : 'Unavailable',
    reason: out.reasonCode,
  };
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
