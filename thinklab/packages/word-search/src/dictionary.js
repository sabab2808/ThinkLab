import words from './wordlist.json' with { type: 'json' }

// ~193k lowercase English words, 3-10 letters (see scripts/buildDictionary.js
// for how this was generated and why). This is the actual vocabulary of
// the game — there's no separate "words to find" list; any straight-line
// sequence of letters that's a real word in this set scores points.
const WORD_SET = new Set(words)

export function isValidWord(word) {
  return matchWord(word) !== null
}

export function matchWord(word) {
  const normalized = word.toLowerCase()
  if (WORD_SET.has(normalized)) return normalized

  const reversed = [...normalized].reverse().join('')
  return WORD_SET.has(reversed) ? reversed : null
}

export function dictionarySize() {
  return WORD_SET.size
}
