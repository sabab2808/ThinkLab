import { useState } from 'react'
import dictionary from 'an-array-of-english-words'

const WORDS = new Set(dictionary.map((word) => word.toUpperCase()))
const SEED_WORDS = [
  'STAR', 'MIND', 'PLAY', 'WORD', 'FIRE', 'LENS', 'PATH', 'FORM', 'TIDE', 'BOLD',
  'CLOUD', 'BRAVE', 'LIGHT', 'STONE', 'QUIET', 'RIVER', 'SHARP', 'TRACE', 'SOUND',
  'THINK', 'CRAFT', 'NERVE', 'MOTION', 'SIGNAL', 'PUZZLE', 'REASON', 'PATTERN',
  'CIPHER', 'BRIDGE', 'WONDER', 'FOCUS', 'INSIGHT', 'CURIOUS', 'DISCOVER', 'CREATE',
]
const LETTERS = 'EEEEEEEEAAAAAAAARRRRRRIIIIIIOTTTTTNNNNNSSSSSLLLCCCDDDPPPMMMGGGBBBFFFHHVVWWYYKJXQZ'
const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1],
]

function randomLetter() {
  return LETTERS[Math.floor(Math.random() * LETTERS.length)]
}

function shuffled(items) {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }
  return result
}

function getRoundSettings(round) {
  return {
    size: Math.min(4 + Math.floor((round - 1) / 3), 8),
    cutoff: 4 + round * 2 + Math.floor(round / 4),
    minLength: Math.min(3 + Math.floor((round - 1) / 4), 6),
  }
}

function makeGrid(round) {
  const { size, minLength } = getRoundSettings(round)
  const grid = Array.from({ length: size }, () => Array.from({ length: size }, randomLetter))
  const candidates = shuffled(SEED_WORDS.filter((word) => word.length >= minLength && word.length <= size + 2))
  const placed = []

  for (const word of candidates.slice(0, 5)) {
    const direction = shuffled(DIRECTIONS)[0]
    const row = Math.floor(Math.random() * size)
    const column = Math.floor(Math.random() * size)
    const endRow = row + direction[0] * (word.length - 1)
    const endColumn = column + direction[1] * (word.length - 1)
    if (endRow < 0 || endRow >= size || endColumn < 0 || endColumn >= size) continue

    const cells = []
    for (let index = 0; index < word.length; index += 1) {
      const currentRow = row + direction[0] * index
      const currentColumn = column + direction[1] * index
      grid[currentRow][currentColumn] = word[index]
      cells.push(`${currentRow}:${currentColumn}`)
    }
    placed.push({ word, cells })
  }

  return { grid, placed }
}

function areAdjacent(first, second) {
  return Math.abs(first.row - second.row) <= 1 && Math.abs(first.column - second.column) <= 1
    && !(first.row === second.row && first.column === second.column)
}

export default function WordSudoku() {
  const [round, setRound] = useState(1)
  const [puzzle, setPuzzle] = useState(() => makeGrid(1))
  const [selected, setSelected] = useState([])
  const [foundWords, setFoundWords] = useState([])
  const [roundScore, setRoundScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [misses, setMisses] = useState(0)
  const [roundWon, setRoundWon] = useState(false)
  const [message, setMessage] = useState('Trace a word through neighboring letters.')

  const settings = getRoundSettings(round)
  const currentWord = selected.map(({ row, column }) => puzzle.grid[row][column]).join('')

  function beginRound(nextRound) {
    setRound(nextRound)
    setPuzzle(makeGrid(nextRound))
    setSelected([])
    setFoundWords([])
    setRoundScore(0)
    setMisses(0)
    setRoundWon(false)
    setMessage('Trace a word through neighboring letters.')
  }

  function selectCell(row, column) {
    if (roundWon) return
    const cell = { row, column }
    const existingIndex = selected.findIndex((item) => item.row === row && item.column === column)
    if (existingIndex >= 0) {
      if (existingIndex === selected.length - 1) setSelected((cells) => cells.slice(0, -1))
      return
    }
    if (selected.length > 0 && !areAdjacent(selected[selected.length - 1], cell)) {
      setMessage('Stay connected. Each letter must touch the last one.')
      return
    }
    setSelected((cells) => [...cells, cell])
    setMessage('Keep tracing, then submit when the word is ready.')
  }

  function submitWord() {
    if (currentWord.length < settings.minLength || roundWon) return
    if (foundWords.includes(currentWord)) {
      setMessage('Already claimed. Find another word in the grid.')
      return
    }
    if (!WORDS.has(currentWord)) {
      setMisses((count) => count + 1)
      setMessage('Not in the dictionary. Try another path.')
      return
    }

    const nextScore = roundScore + 1
    setFoundWords((words) => [...words, currentWord])
    setRoundScore(nextScore)
    setTotalScore((score) => score + 1)
    setSelected([])
    if (nextScore >= settings.cutoff) {
      setRoundWon(true)
      setMessage('Cutoff reached. You own this round.')
    } else {
      setMessage(`${currentWord} counts. Keep hunting.`)
    }
  }

  function shuffleGrid() {
    setPuzzle(makeGrid(round))
    setSelected([])
    setFoundWords([])
    setRoundScore(0)
    setMisses(0)
    setRoundWon(false)
    setMessage('New grid, same cutoff. Find your way through.')
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-verified">WORD HUNT · ENDLESS ROUNDS</p>
          <h1 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">Word Forge</h1>
          <p className="mt-2 max-w-xl text-sm text-text-muted sm:text-base">
            Trace connected letters to make real words. Every word scores one point.
            Hit the cutoff to win the round, then face a tougher grid.
          </p>
        </div>
        <div className="border border-hairline px-3 py-2 text-right">
          <p className="font-mono text-[10px] text-text-muted">ROUND</p>
          <p className="font-display text-xl text-verified">{round}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1fr)_17rem]">
        <section>
          <div className="flex flex-wrap items-end justify-between gap-4 border-y border-hairline py-5">
            <div>
              <p className="font-mono text-xs text-text-muted">ROUND {round} · {settings.size} x {settings.size} GRID</p>
              <p className="mt-1 text-sm text-text-muted">Tap neighboring cells in sequence. Diagonals count.</p>
            </div>
            <p className="font-mono text-xs text-live">{roundScore} / {settings.cutoff} points</p>
          </div>

          <div className="mx-auto mt-8 grid aspect-square w-full max-w-[30rem] gap-1 border-2 border-text bg-hairline p-1" style={{ gridTemplateColumns: `repeat(${settings.size}, minmax(0, 1fr))` }}>
            {puzzle.grid.map((row, rowIndex) => row.map((letter, columnIndex) => {
              const selectedIndex = selected.findIndex((cell) => cell.row === rowIndex && cell.column === columnIndex)
              const isSelected = selectedIndex >= 0
              return (
                <button
                  key={`${rowIndex}-${columnIndex}`}
                  type="button"
                  onClick={() => selectCell(rowIndex, columnIndex)}
                  className={'relative flex aspect-square items-center justify-center bg-ink font-display text-xl transition-colors sm:text-3xl ' + (isSelected ? 'bg-verified/20 text-verified ring-1 ring-inset ring-verified' : 'text-text hover:bg-surface-raised')}
                >
                  {letter}
                  {isSelected && <span className="absolute right-1 top-1 font-mono text-[9px] text-verified">{selectedIndex + 1}</span>}
                </button>
              )
            }))}
          </div>

          <div className="mt-5 flex min-h-14 items-center justify-center border border-verified/50 bg-verified/5 px-4">
            <span className="font-display text-xl tracking-[0.2em] text-verified">{currentWord || 'TRACE A WORD'}</span>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={() => setSelected((cells) => cells.slice(0, -1))} disabled={selected.length === 0 || roundWon} className="border border-hairline px-3 py-2 font-mono text-xs text-text-muted hover:border-text disabled:opacity-30">BACKSPACE</button>
            <button type="button" onClick={() => setSelected([])} disabled={selected.length === 0 || roundWon} className="border border-hairline px-3 py-2 font-mono text-xs text-text-muted hover:border-text disabled:opacity-30">CLEAR</button>
            <button type="button" onClick={submitWord} disabled={currentWord.length < settings.minLength || roundWon} className="border border-verified px-4 py-2 font-mono text-xs text-verified hover:bg-verified/10 disabled:opacity-30">CLAIM WORD</button>
          </div>
          <p className="mt-4 text-center font-mono text-xs text-text-muted">{message}</p>
        </section>

        <aside className="border-t border-hairline pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <div className="grid grid-cols-2 gap-3">
            <div><p className="font-mono text-xs text-text-muted">TOTAL</p><p className="mt-1 font-display text-2xl text-verified">{totalScore}</p></div>
            <div><p className="font-mono text-xs text-text-muted">MISSES</p><p className="mt-1 font-display text-2xl text-live">{misses}</p></div>
          </div>

          <div className="mt-8">
            <p className="font-mono text-xs text-text-muted">WORDS THIS ROUND</p>
            <div className="mt-3 flex min-h-16 flex-wrap content-start gap-2">
              {foundWords.length > 0 ? foundWords.map((word) => <span key={word} className="border border-verified px-2 py-1 font-mono text-xs text-verified">{word}</span>) : <p className="text-sm text-text-muted">No claims yet.</p>}
            </div>
          </div>

          {roundWon ? (
            <div className="mt-8 border border-verified p-4">
              <p className="font-mono text-xs text-verified">ROUND WON</p>
              <p className="mt-2 text-sm text-text-muted">The next grid will be larger and the cutoff will climb.</p>
              <button type="button" onClick={() => beginRound(round + 1)} className="mt-4 border border-verified px-4 py-2 text-sm text-verified hover:bg-verified/10">Enter round {round + 1}</button>
            </div>
          ) : (
            <button type="button" onClick={shuffleGrid} className="mt-8 border border-hairline px-4 py-2 text-sm hover:border-verified">New grid</button>
          )}
        </aside>
      </div>

      <section className="mt-12 border-t border-hairline pt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-mono text-xs text-text-muted">THE CLIMB NEVER ENDS</p>
          <p className="font-mono text-xs text-text-muted">minimum word length: {settings.minLength}</p>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <div className="border border-verified p-3"><p className="font-mono text-xs text-text-muted">NOW</p><p className="mt-1 font-display">Round {round}</p><p className="mt-1 text-xs text-text-muted">{settings.size} x {settings.size} grid</p></div>
          <div className="border border-hairline p-3"><p className="font-mono text-xs text-text-muted">NEXT</p><p className="mt-1 font-display">Round {round + 1}</p><p className="mt-1 text-xs text-text-muted">cutoff: {getRoundSettings(round + 1).cutoff} points</p></div>
          <div className="border border-hairline p-3"><p className="font-mono text-xs text-text-muted">RULE</p><p className="mt-1 font-display">One word, one point</p><p className="mt-1 text-xs text-text-muted">Dictionary checked</p></div>
        </div>
      </section>
    </main>
  )
}