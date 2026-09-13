# Cube engine — what's real, what's validated, what's not

This is the most experimental part of THINKLAB. Read this before trusting
any claim about it elsewhere in the docs.

## What's fully tested and reliable

- **The physical model** (`geometry.js`, `cube.js`): cubies as 3D
  positions + sticker normals, moves as 90° rotations. 22 tests cover
  rotation properties, every move's identity (4x = original) and inverse,
  a known order-6 commutator, and scramble/undo round-trips. This is the
  part I'm confident in without reservation.
- **Facelet round-trip** (`facelets.js`): reconstructing cube state from
  54 sticker colors, and the reverse. Tested by generating random
  scrambles, reading off facelets, reconstructing, and confirming the
  reconstruction is pixel-for-pixel identical — 20+ random trials, always
  exact.
- **First-layer solving** (cross + corners, in `solver/f2l.js`): searches
  the move graph (iterative deepening, with real pruning) for each piece
  one at a time, requiring previously-placed pieces to stay put. Reliable
  in testing.

## What's best-effort and honestly incomplete

- **Middle-layer edges**: also in `solver/f2l.js`, but measurably harder
  for blind search — it must preserve 8 already-placed pieces while
  finding a 9th. In testing this frequently doesn't complete within its
  time budget. When it doesn't, `solveF2L` returns `{ complete: false,
  stage: 'middle-edges', moves, cube }` — whatever progress it made, not
  a crash or a lie about completion.
- **Last layer** (`solver/lastLayer.js`): I tried the standard approach —
  a small library of named algorithms (2-look OLL/PLL) applied with a
  U-face-adjustment search. Several of the algorithms I recalled (an edge
  orientation algorithm, T-perm, Y-perm) turned out to disturb the
  already-solved first two layers when run through *this* engine's exact
  move convention — meaning my recollection had an error somewhere I
  didn't have a way to pin down without a reference implementation to
  diff against. Rather than ship an algorithm I couldn't verify, this
  phase only composes the ones I *did* confirm preserve F2L: Sune,
  Anti-Sune, and a U-perm. That's a real subgroup of the last-layer
  group, not all of it, so it solves a meaningful fraction of cases and
  not others. It's wrapped in a hard try-budget so it can never hang —
  it returns `{ solved: false, ... }` honestly when it can't find a path.

## Why this shape

Blind full-search over all 18 moves is provably correct (it's just
search) but its performance is unpredictable — some phases resolve in
milliseconds, others can take tens of seconds or fail an exhaustive
search entirely. Named algorithms are fast and deterministic but only as
correct as my memory of them, which I can't verify against a physical
cube. Given that, every phase in this engine was built with an explicit
test proving what it claims — the F2L tests measure real success rates
rather than asserting 100%, and the last-layer tests only claim
"provably correct for the subgroup it covers," not "solves everything."

## What a stronger version would need

- A real move-pruning table (precomputed, not runtime heuristics) to make
  middle-edge insertion fast and reliable — the standard technique here
  is a two-phase algorithm (à la Kociemba) with lookup tables, which is a
  meaningfully larger undertaking than what's here.
- A verified reference for the missing OLL/PLL algorithms — ideally
  cross-checked against an existing, trusted cube library rather than
  reconstructed from memory.
- 2×2 and 4×4+ support — genuinely different algorithms (2×2 reduces to
  corners-only; 4×4+ needs reduction + parity handling), not extensions
  of the 3×3 engine. Not started.

## The camera-scanning protocol

Capture order is Front, Right, Back, Left (spin around the vertical axis,
keeping the same face up throughout), then Up, then Down. Each photo is
sampled as a 3×3 grid; the resulting 54 raw colors are classified against
the 6 photos' own center swatches (see `apps/web/src/utils/colorScan.js`).

I have no physical cube or camera in the environment this was built in,
so unlike the engine above, **this protocol has not been tested against
a real camera and a real cube** — it's implemented carefully and
reasoned through, but the manual review-and-correct grid in the app
exists specifically because I can't vouch for the capture accuracy the
way I can vouch for the solver's math.
