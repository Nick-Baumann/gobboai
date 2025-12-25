---
summary: "Command queue design that serializes auto-reply command execution"
read_when:
  - Changing auto-reply execution or concurrency
---
# Command Queue (2025-11-25)

We now serialize command-based auto-replies (WhatsApp Web listener) through a tiny in-process queue to prevent multiple commands from running at once, while allowing safe parallelism across sessions.

## Why
- Some auto-reply commands are expensive (LLM calls) and can collide when multiple inbound messages arrive close together.
- Serializing avoids competing for terminal/stdin, keeps logs readable, and reduces the chance of rate limits from upstream tools.

## How it works
- `src/process/command-queue.ts` holds a lane-aware FIFO queue and drains each lane synchronously.
- `runEmbeddedPiAgent` enqueues by **session key** (lane `session:<key>`) to guarantee only one active run per session.
- Each session run is then queued into a **global lane** (`main` by default) so overall parallelism is capped by `agent.maxConcurrent`.
- When verbose logging is enabled, queued commands emit a short notice if they waited more than ~2s before starting.
- Typing indicators (`onReplyStart`) still fire immediately on enqueue so user experience is unchanged while we wait our turn.

## Scope and guarantees
- Applies only to config-driven command replies; plain text replies are unaffected.
- Default lane (`main`) is process-wide for inbound + main heartbeats; set `agent.maxConcurrent` to allow multiple sessions in parallel.
- Additional lanes may exist (e.g. `cron`) so background jobs can run in parallel without blocking inbound replies.
- Per-session lanes guarantee that only one agent run touches a given session at a time.
- No external dependencies or background worker threads; pure TypeScript + promises.

## Troubleshooting
- If commands seem stuck, enable verbose logs and look for “queued for …ms” lines to confirm the queue is draining.
- `enqueueCommand` exposes a lightweight `getQueueSize()` helper if you need to surface queue depth in future diagnostics.
