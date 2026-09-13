# Verification architecture

Rule zero: **never let the client submit a score directly.** A client can only
submit a sequence of *events*. The server decides what happened.

```
Browser → Authenticated Session → Event Stream → Backend Validation
        → Deterministic Replay → Scoring → Result → Proof
```

This is implemented, not just described — see `apps/api/src/services/verification.service.js`.

## Flow

1. `POST /api/sessions` creates a `GameSession` document. The server owns
   the session id (a MongoDB ObjectId) and any challenge config — the
   client never invents these.
2. As the user plays, the client posts events to
   `POST /api/sessions/:id/events`. Each event gets a `sequenceNo`; the
   `(session, sequenceNo)` pair has a unique index on `GameEvent`, so a
   duplicate or replayed sequence number is a write-time error, not
   something caught after the fact.
3. `POST /api/sessions/:id/finish` calls `verifySession()`, which:
   - loads every `GameEvent` for the session, sorted by `sequenceNo`,
   - reconstructs the board using the *same pure functions* the client
     uses (`@thinklab/game-engine`) — that package has zero UI/network
     dependencies specifically so it can run identically on both sides,
   - rejects the session if replay hits an illegal move or never reaches
     a terminal state,
   - writes an authoritative `Result` — `score`, `timeMs`, `moves` are all
     computed from the replay, never taken from the request body,
   - issues a `Proof` document with a public proof id if verified.
4. Suspicious patterns belong in `Report` documents for moderation, not
   silent rejection — false positives should be reviewable. (Not built yet.)

## Why this shapes the code

- `game-engine` and `algorithms` packages must stay pure functions of
  `(state, action) -> newState`. No `Date.now()`, no randomness without an
  explicit seed, no DOM. That's what makes server-side replay possible at
  all.
- The API never trusts `score`, `time_ms`, `moves`, or `verified_status` in
  a request body — those fields only get written by
  `verification.service.js`, and only from a replay.
- Each game gets one verifier function registered in
  `verification.service.js`'s `verifiers` map. Adding Maze or Rubik's Cube
  later means adding a function there — the session/event/result plumbing
  around it doesn't change.

