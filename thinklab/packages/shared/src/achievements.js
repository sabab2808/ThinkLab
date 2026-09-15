/**
 * Every achievement type the engine can award (apps/api/src/services/
 * achievements/) plus how to display it (apps/web). Adding a new
 * achievement means adding one entry here and one rule file on the API
 * side — nowhere else needs to know the label or description.
 */
export const ACHIEVEMENT_METADATA = {
  first_solve: {
    label: 'First Solve',
    description: 'Completed your first verified challenge.',
  },
  speed_demon: {
    label: 'Speed Demon',
    description: 'Beat a category speed threshold.',
  },
  perfect_strategy: {
    label: 'Perfect Strategy',
    description: 'Achieved an optimal result — fastest possible win, or a maze solved with 100% efficiency.',
  },
  top_10_percent: {
    label: 'Top 10%',
    description: 'Ranked in the top 10% of a category leaderboard.',
  },
  top_1_percent: {
    label: 'Top 1%',
    description: 'Ranked in the top 1% of a category leaderboard.',
  },
  algorithm_master: {
    label: 'Algorithm Master',
    description: 'Completed 5 verified Maze Lab sessions.',
  },
  puzzle_master: {
    label: 'Puzzle Master',
    description: 'Completed 5 verified Tic-Tac-Toe sessions.',
  },
  consistency: {
    label: 'Consistency',
    description: 'Completed 10 verified sessions across all categories.',
  },
  wordsmith: {
    label: 'Wordsmith',
    description: 'Completed 5 verified Word Search rounds.',
  },
  vocabulary_virtuoso: {
    label: 'Vocabulary Virtuoso',
    description: 'Reached level 10 in Word Search.',
  },
}
