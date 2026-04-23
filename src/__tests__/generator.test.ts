import { describe, it, expect } from 'vitest';
import { generatePuzzle } from '../core/generator';
import { isBoardValid, isBoardComplete } from '../core/validator';
import { hasUniqueSolution } from '../core/solver';
import { EMPTY, type Difficulty, BOARD_SIZE, DIFFICULTY_CONFIGS } from '../core/types';

function countEmpty(board: number[][]): number {
  let count = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell === EMPTY) count++;
    }
  }
  return count;
}

describe.each<Difficulty>(['easy', 'medium', 'hard'])('generatePuzzle(%s)', (difficulty) => {
  it('生成的完整解是合法且完整的', () => {
    const { solution } = generatePuzzle(difficulty);
    expect(isBoardComplete(solution)).toBe(true);
    expect(isBoardValid(solution)).toBe(true);
  });

  it('生成的谜题有唯一解', () => {
    const { puzzle } = generatePuzzle(difficulty);
    expect(hasUniqueSolution(puzzle)).toBe(true);
  });

  it('挖去的空格数量在难度范围内', () => {
    const { puzzle } = generatePuzzle(difficulty);
    const empties = countEmpty(puzzle);
    const [min, max] = DIFFICULTY_CONFIGS[difficulty].removals;
    expect(empties).toBeGreaterThanOrEqual(min);
    expect(empties).toBeLessThanOrEqual(max);
  });

  it('谜题是 9x9 的二维数组', () => {
    const { puzzle } = generatePuzzle(difficulty);
    expect(puzzle.length).toBe(BOARD_SIZE);
    for (const row of puzzle) {
      expect(row.length).toBe(BOARD_SIZE);
    }
  });
});
