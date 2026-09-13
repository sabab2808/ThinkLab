import { useState } from 'react'
import { Link } from 'react-router-dom'
import { checkWinner, bestMove, PLAYER_X, PLAYER_O } from '@thinklab/game-engine'
import BoardCapture from '../../components/BoardCapture.jsx'
import MarkReviewGrid from '../../components/MarkReviewGrid.jsx'
import Board from '../../components/Board.jsx'

function toBoardValue(cell) {
  return cell === 'empty' ? null : cell
}

export default function TicTacToeScan() {
  const [cells, setCells] = useState(null) // array of 9: null | 'X' | 'O'
  const [captured, setCaptured] = useState(false)

  function handleCapture(rawCells) {
    setCells(rawCells.map(toBoardValue))
    setCaptured(true)
  }

  function handleCorrect(index, newValue) {
    setCells((prev) => prev.map((c, i) => (i === index ? newValue : c)))
  }

  function retake() {
    setCells(null)
    setCaptured(false)
  }

  const xCount = cells?.filter((c) => c === PLAYER_X).length ?? 0
  const oCount = cells?.filter((c) => c === PLAYER_O).length ?? 0
  const validCounts = Math.abs(xCount - oCount) <= 1 && oCount <= xCount
  const winner = cells ? checkWinner(cells) : null
  const nextPlayer = xCount === oCount ? PLAYER_X : PLAYER_O
  const suggestion = cells && validCounts && !winner ? bestMove(cells, nextPlayer) : -1

  return (
    <main className="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="font-mono text-xs text-text-muted">strategy · scan</p>
      <h1 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">Scan a board</h1>
      <p className="mt-2 text-sm text-text-muted sm:text-base">
        Photograph a physical Tic-Tac-Toe board and get the best next move.
      </p>

      {!captured && (
        <div className="mt-6">
          <BoardCapture onCapture={handleCapture} />
        </div>
      )}

      {captured && cells && (
        <div className="mt-6">
          <p className="text-sm text-text-muted">
            Tap any cell to correct a misread mark before analyzing.
          </p>
          <div className="mt-4">
            <MarkReviewGrid cells={cells} onChange={handleCorrect} />
          </div>

          {!validCounts && (
            <p className="mt-4 font-mono text-xs text-danger">
              That mark count isn't a legal Tic-Tac-Toe position (X: {xCount}, O: {oCount}).
              Fix any misread cells above.
            </p>
          )}

          {validCounts && (
            <div className="mt-8 border-t border-hairline pt-6">
              {winner ? (
                <p className="font-mono text-sm text-verified">
                  {winner === 'draw' ? 'Game over — draw.' : `Game over — ${winner} wins.`}
                </p>
              ) : (
                <>
                  <p className="font-mono text-sm text-text-muted">{nextPlayer} to move.</p>
                  <div className="mt-4">
                    <Board
                      cells={cells.map((c, i) => (i === suggestion ? '★' : c))}
                    />
                  </div>
                  <p className="mt-3 font-mono text-xs text-verified">
                    ★ best move for {nextPlayer}: cell {suggestion + 1}
                  </p>
                </>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={retake}
            className="mt-8 border border-hairline px-4 py-2 text-sm hover:border-verified"
          >
            Retake photo
          </button>
        </div>
      )}

      <p className="mt-10 text-xs text-text-muted">
        Mark detection is a simple contrast/shape heuristic, not a trained model — it works
        best with clearly drawn or printed marks in good light. Always double-check the
        review grid before trusting the suggestion.{' '}
        <Link to="/games/tic-tac-toe" className="text-verified hover:underline">
          Play instead
        </Link>
      </p>
    </main>
  )
}
