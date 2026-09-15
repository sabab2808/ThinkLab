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
  cube-engine/    Rubik's Cube 3D model, facelet<->cube conversion, and
                  solver (see docs/cube-engine.md for honest coverage).
  word-search/    10x10 grid generator, line-selection logic, and a
                  ~190k-word dictionary (isValidWord) — same dual-import,
                  seeded-generation pattern as maze and cube.
  shared/         Types/constants shared across apps
docs/             Architecture notes (see docs/verification.md, docs/data-model.md, docs/novelty.md, docs/cube-engine.md, docs/deployment.md)
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
- **Three games, all with real server-side verification**: Tic-Tac-Toe
  (`services/verifiers/ticTacToe.verifier.js`), Maze Lab
  (`services/verifiers/maze.verifier.js`), and Word Search
  (`services/verifiers/wordSearch.verifier.js`). The maze verifier regenerates
  the maze from the session's stored seed and replays move-by-move —
  a teleport or wall-clip is rejected exactly like an illegal Tic-Tac-Toe
  move would be. The Word Search verifier regenerates the level's letter
  grid from the stored seed and independently re-validates every word
  selection against its own dictionary — the client's own "this word is
  valid" claim is never trusted.
- **Word Search has unlimited procedurally-generated levels**
  (`packages/word-search`): a seeded 10x10 letter grid, a ~190k-word
  dictionary, length-based scoring, and a difficulty curve where each
  level shortens the time limit and skews the letter distribution away
  from common English frequency toward uniform — genuinely harder to
  find real words in, not just a bigger number on screen.
- **Maze Lab has two modes**: an **algorithm race** (BFS/DFS/Dijkstra/A*
  solving the same maze side by side, `components/AlgorithmRace.jsx`) and
  a manual **play-it-yourself** mode using the same event-log → verify →
  replay-scrubber pattern as Tic-Tac-Toe.
- **Ratings are real**: `services/rating.service.js` updates a per-category
  rating after every verified session (`services/ratingDelta.js` holds the
  per-game formula — documented there as a placeholder until real
  matchmaking exists). `/dashboard` shows your own ratings; `/leaderboard`
  shows category rankings.
- **`minimax()` is done and tested** (`packages/game-engine`) — 15/15
  tests passing, including a self-play test that confirms it never loses,
  with depth-aware scoring so it prefers a faster win and a slower loss.
- **`packages/algorithms` is fully tested** — 11/11 tests, including a
  check that A* never explores more nodes than BFS thanks to its
  heuristic, and that every generated maze is guaranteed solvable.
- **`packages/word-search` is fully tested** — 26/26 tests, including
  all 8 selection directions, dictionary validation, and a check that
  the level-progression formulas never plateau (genuinely unlimited
  levels, not a fixed table with a ceiling).

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
