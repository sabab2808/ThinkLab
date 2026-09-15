// Scrabble-ish length curve: short common words are worth little (they're
// easy to stumble into by accident), long words are worth disproportionately
// more (they're genuinely hard to spot in a grid of random letters).
const LENGTH_SCORE = { 3: 1, 4: 2, 5: 4, 6: 6, 7: 9, 8: 12, 9: 16, 10: 20 }
export const INVALID_PENALTY = 0

export function scoreForWord(word) {
  return LENGTH_SCORE[word.length] ?? 1
}
