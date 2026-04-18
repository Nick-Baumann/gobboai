# The Loop

Milton runs an infinite four-stage cycle. Every iteration produces a new
candidate, gates it against the reigning champion, and promotes only if the
candidate clears a 55% win-rate threshold.

1. Self-play
2. Training
3. Arena
4. Deployment

See the README for the high-level diagram. Each stage is described in detail in
its own document under `docs/`.

## Cadence

A typical iteration completes in roughly 70 minutes on a Mac Mini M4. The
orchestrator persists progress between stages so a kill-and-restart picks up
cleanly.

| Stage | Wall time |
|-------|-----------|
| Self-play | 28 min |
| Training | 14 min |
| Arena | 26 min |
| Deployment | <1 sec |

## Failure modes

If a stage crashes, the orchestrator records the failure and retries up to 3
times before halting. Halts surface to the dashboard as a red event card.
