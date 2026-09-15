// One-time build step (not run at app runtime). Filters the ~275k-word
// source dictionary down to something appropriate for a 10x10 grid:
// lowercase alphabetic words of 3-10 letters. Any word found by the
// player through a straight line of adjacent cells is checked against
// this set — there's no fixed list of "words to find," so the dictionary
// IS the game's vocabulary.
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import words from 'an-array-of-english-words/index.json' with { type: 'json' }

const __dirname = dirname(fileURLToPath(import.meta.url))

const filtered = [...new Set(
  words
    .filter((w) => /^[a-z]{3,10}$/.test(w))
)].sort()

const outPath = join(__dirname, '../src/wordlist.json')
writeFileSync(outPath, JSON.stringify(filtered))

console.log(`Filtered ${words.length} -> ${filtered.length} words`)
console.log(`Written to ${outPath}`)
