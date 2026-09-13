# THINKLAB

> Play. Prove. Improve.

A competitive problem-solving platform. Users play games and puzzles, the
server validates results, ratings update, and qualifying achievements get a
public, verifiable Proof ID.

## Structure

```
apps/
  web/            React + Tailwind frontend (Vite)
  api/            Express API + MongoDB (Mongoose)
    src/
      config/       env validation, DB connection
      models/       one Mongoose schema per file
      controllers/  thin request handlers — validate, call a service, respond
      services/     business logic (verification, proof issuance)
      routes/       just wiring — no logic lives here
      middleware/   asyncHandler, 404, centralized error handler
      validators/   request body validation, separated from controllers
      utils/        logger, AppError
    scripts/
      seed.js       populates the game catalog
packages/
  game-engine/    Pure, framework-free game logic (Tic-Tac-Toe, minimax)
                  — imported by BOTH the frontend and the API, so
                    client and server run identical rules.
  algorithms/     Maze generator (seeded, deterministic) + BFS/DFS/
                  Dijkstra/A* — same dual-import pattern as game-engine.
  shared/         Types/constants shared across apps
docs/             Architecture notes (see docs/verification.md, docs/data-model.md, docs/novelty.md)
```

## Getting started

```bash
npm install
npm run dev:web   # http://localhost:5173
```

The API needs a running MongoDB instance:

```bash
cp apps/api/.env.example apps/api/.env   # point MONGODB_URI at your DB
npm run seed --workspace=apps/api        # populate the game catalog
npm run dev:api                          # http://localhost:4000
```

## Current status

- **Auth is real, end to end.** `POST /api/auth/register` and `/login`
  hash with bcrypt and issue a JWT; `requireAuth` middleware protects
  session-creation routes. The React side has a full `AuthContext`,
  `/login` and `/register` pages, a `ProtectedRoute` guard on
  `/dashboard`, and the Nav reflects real signed-in state.
- **Two games, both with real server-side verification**: Tic-Tac-Toe
  (`services/verifiers/ticTacToe.verifier.js`) and Maze Lab
  (`services/verifiers/maze.verifier.js`). The maze verifier regenerates
  the maze from the session's stored seed and replays move-by-move —
  a teleport or wall-clip is rejected exactly like an illegal Tic-Tac-Toe
  move would be.
- **Maze Lab has two modes**: an **algorithm race** (BFS/DFS/Dijkstra/A*
  solving the same maze side by side, `components/AlgorithmRace.jsx`) and
  a manual **play-it-yourself** mode using the same event-log → verify →
  replay-scrubber pattern as Tic-Tac-Toe.
- **Ratings are real**: `services/rating.service.js` updates a per-category
  rating after every verified session (`services/ratingDelta.js` holds the
  per-game formula — documented there as a placeholder until real
  matchmaking exists). `/dashboard` shows your own ratings; `/leaderboard`
  shows category rankings.
- **`minimax()` is done and tested** (`packages/game-engine`) — 11/11
  tests passing, including a self-play test that confirms it never loses,
  with depth-aware scoring so it prefers a faster win and a slower loss.
- **`packages/algorithms` is fully tested** — 11/11 tests, including a
  check that A* never explores more nodes than BFS thanks to its
  heuristic, and that every generated maze is guaranteed solvable.

Not run against a live MongoDB in this environment — verified via syntax
checks, a standalone unit test of the maze verifier's replay logic against
both a legitimate and a cheating event log, and smoke tests of the Express
app confirming validation, auth, and error handling all run correctly
before ever touching the DB. Point `MONGODB_URI` at a real instance and run
`npm run seed --workspace=apps/api` to take it further.

Build order (from the project plan): Auth ✅ → Profile → Game Engine Contract ✅
→ Tic-Tac-Toe ✅ → Server Verification ✅ → Ratings ✅ → Leaderboard ✅ → Maze ✅ →
Achievements/Proof (proofs ✅, achievement milestones not yet) → Rubik →
Adaptive Difficulty → Camera Scan → AI Coach → Arena.
