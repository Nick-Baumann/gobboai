// Lightweight in-memory queue for human-readable system events that should be
// prefixed to the next main-session prompt/heartbeat. We intentionally avoid
// persistence to keep events ephemeral.

type SystemEvent = { text: string; ts: number };

const MAX_EVENTS = 20;
const queue: SystemEvent[] = [];
let lastText: string | null = null;

export function enqueueSystemEvent(text: string) {
  const cleaned = text.trim();
  if (!cleaned) return;
  if (lastText === cleaned) return; // skip consecutive duplicates
  lastText = cleaned;
  queue.push({ text: cleaned, ts: Date.now() });
  if (queue.length > MAX_EVENTS) queue.shift();
}

export function drainSystemEvents(): string[] {
  const out = queue.map((e) => e.text);
  queue.length = 0;
  lastText = null;
  return out;
}

export function peekSystemEvents(): string[] {
  return queue.map((e) => e.text);
}

export function hasSystemEvents() {
  return queue.length > 0;
}
