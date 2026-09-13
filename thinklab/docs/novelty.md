# Novelty roadmap

Everything here follows from one decision: **make verification visible**
instead of hiding it behind a spinner. Every feature below is downstream of
the fact that we log structured events with sequence numbers, not just
final scores.

## Foundation (built now)

These two are foundational because ghost mode, algorithm races, and skill
fingerprints all need them:

- **Event log per session** — every move recorded as `{ sequenceNo, type,
  data, timestamp }`, client-side today, server-side once `/sessions`
  is real. Same shape either way, so nothing downstream has to change.
- **Replay scrubber** — reconstructs the board at any point in the event
  log by re-running `applyMove` from the start. Works because game-engine
  functions are pure. One component, reusable across every game.
- **Verification moment** — instead of a spinner after "finish," the UI
  visibly replays the event log and stamps the result, turning the trust
  mechanism into the payoff instead of hiding it.

## Interface

- [x] Scrubbable replays (this pass)
- [x] Verification-as-spectacle animation (this pass)
- [x] **Camera scanning across all three games** — Tic-Tac-Toe (mark
      detection via darkness/shape heuristics), Maze Lab (wall detection
      via darkness sampling, with a tap-to-correct edge editor), and
      Rubik's Cube (color classification via each face's own center as
      reference). All three follow the same pattern: photo → heuristic
      classification → mandatory human review/correction → then the
      existing solving logic (minimax, BFS/DFS/Dijkstra/A*, or the cube
      solver) takes over unchanged. None of this needed a trained model —
      see docs/cube-engine.md and the utils/*Scan.js files for exactly
      what the heuristics are and their honest limitations.
- [ ] Command-palette navigation (⌘K) instead of a conventional nav bar
- [ ] Live proof ticker — scrolling feed of recently verified results
      (landing page gets a stub version now; real once sessions are real)

## Functionality

- [x] **Algorithm races** — BFS/DFS/Dijkstra/A* solving the same maze side
      by side as a spectator race (`components/AlgorithmRace.jsx`). Each
      algorithm's real `visitedOrder` is revealed on a shared timer, so
      the visual difference between them (DFS wandering vs. BFS/Dijkstra/
      A* converging) is the actual algorithm behavior, not a simulation
      of it.
- [ ] **Ghost mode** — play against a replay of your own past best run.
      Needs: stored event logs per user (have the shape already — same
      `GameEvent` collection Tic-Tac-Toe and Maze both use), a "ghost
      player" that advances through a past log on a timer while you play
      live.
- [ ] **Skill fingerprint** — radar chart of play style (speed vs.
      accuracy, aggression vs. caution) computed from event timestamps
      and move choices. Needs enough verified sessions per user to be
      meaningful — worth revisiting once ratings have real usage.
- [ ] **Proof chains** — combo achievements for solving multiple game
      types in one sitting, surfaced on the public profile.

## Design

- [x] Lab-console token system (dark ink, verified-teal, live-amber,
      monospace for data) — already in `index.css`
- [x] Verification stamp motif — rotated, ink-stamp-style "VERIFIED"
      treatment instead of a generic badge
- [ ] Proof pages as certificate/ticket-stub layouts instead of social
      cards
- [ ] Grid-paper / lab-notebook texture as a background treatment,
      used sparingly (this is the kind of thing that's easy to overdo —
      one place only, probably the proof page)

## Sequencing

Ghost mode and skill fingerprints both need real usage data to be worth
building (a ghost of one session, or a fingerprint from one data point,
isn't much of a feature). Ordering stays close to the original build
order, with these layered in once their prerequisite exists:

```
Tic-Tac-Toe (events + scrubber + verification moment) ✅
  → Server verification (real persistence) ✅
  → Maze Lab + algorithms package ✅
    → Algorithm races ✅
  → Ratings ✅
    → Leaderboard ✅
    → Ghost mode (needs persisted logs — have them, not built yet)
    → Skill fingerprint (needs real ratings usage first)
```
