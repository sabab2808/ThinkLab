# Data model (MongoDB)

Ten collections, defined as Mongoose schemas in `apps/api/src/models/`.
One file per collection — see that folder rather than treating this as the
source of truth; this doc explains *why* they're shaped this way.

| Collection      | Purpose                                             | Key fields |
|-----------------|------------------------------------------------------|------------|
| `users`         | Accounts                                              | `username`, `email`, `passwordHash` (never returned by default), `verified` |
| `games`         | Catalog of playable modules                           | `slug` (e.g. `tic-tac-toe`), `category`, `active` |
| `challenges`    | A configured instance of a game                       | `game` ref, `difficulty`, `config` (Mixed — seed, board size, etc.) |
| `gamesessions`  | A server-owned play session                           | `user` ref, `game` ref, `status`, `startedAt`/`endedAt` |
| `gameevents`    | The append-only event log a session is replayed from  | `session` ref, `sequenceNo`, `eventType`, `eventData` (Mixed) |
| `results`       | The authoritative outcome of a verified/rejected session | `session` ref (unique), `score`, `timeMs`, `moves`, `verifiedStatus` |
| `ratings`       | Per-category skill rating                             | `user` ref, `category`, `rating`, `gamesPlayed` |
| `achievements`  | Earned milestones                                     | `user` ref, `type`, `result` ref |
| `proofs`        | Public verification record                            | `result` ref (unique), `proofId` (unique, public), `publicStatus` |
| `reports`       | Moderation queue                                      | `session` ref, `reportedUser` ref, `reason`, `status` |

## Design notes

- **`gameevents` is a separate collection, not an embedded array.** A
  session can accumulate many events; embedding them in the session
  document risks hitting MongoDB's 16MB document size limit for long or
  adversarial sessions, and makes the append-only, indexed-by-sequence
  access pattern (`GameEvent.find({ session }).sort({ sequenceNo: 1 })`)
  awkward. Referencing keeps writes cheap and the replay query simple.
- **The `(session, sequenceNo)` unique index on `gameevents`** is what
  actually enforces "no duplicate or replayed sequence numbers" — it's a
  database constraint, not application logic that could be bypassed.
- **`config` and `eventData` are `Mixed`.** Challenge config and event
  payloads genuinely differ per game (a maze seed looks nothing like a
  tic-tac-toe move). Schema-per-game-type would mean a new Mongoose
  discriminator for every module; `Mixed` plus validation in each game's
  verifier (see `docs/verification.md`) is the simpler tradeoff while
  there are only two or three games.
- **`passwordHash` has `select: false`.** It's excluded from every query
  by default; a controller has to explicitly opt in with
  `.select('+passwordHash')` to see it, which makes it much harder to
  accidentally leak a hash in an API response.
- **`challenges` for maze sessions are generated per-session, not reused.**
  `services/challenge.service.js` creates a fresh `Challenge` with a
  random seed every time a maze session starts. The seed is the only
  thing that has to round-trip to the client and back — the client
  renders the maze from it, and `services/verifiers/maze.verifier.js`
  regenerates the identical maze from the same seed to verify the
  session, so the maze layout itself is never transmitted or trusted.
- **`ratings` deltas are currently a placeholder formula**
  (`services/ratingDelta.js`), not real Elo. There's no tracked opponent
  yet — Tic-Tac-Toe sessions are one authenticated user playing both
  sides — so this rewards a verified result rather than modeling
  head-to-head skill. Real matchmaking would change this file without
  touching the `Rating` schema or `rating.service.js`.

## Seeding

`apps/api/scripts/seed.js` populates the `games` collection. Run it with
`npm run seed --workspace=apps/api` after connecting to a real MongoDB
instance.
