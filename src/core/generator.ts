import {
  type Board, type Difficulty,
  BOARD_SIZE, BOX_SIZE, EMPTY, DIFFICULTY_CONFIGS,
} from './types';
import { solve, hasUniqueSolution } from './solver';
import { cloneBoard } from './validator';

function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(EMPTY) as number[]);
}

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

/**
 * Generates a fully solved board by filling the diagonal boxes first
 * (they are independent), then solving the rest.
 */
function generateFullBoard(): Board {
  const board = createEmptyBoard();

  for (let box = 0; box < BOX_SIZE; box++) {
    const nums = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const startRow = box * BOX_SIZE;
    const startCol = box * BOX_SIZE;
    let idx = 0;
    for (let r = 0; r < BOX_SIZE; r++) {
      for (let c = 0; c < BOX_SIZE; c++) {
        board[startRow + r]![startCol + c] = nums[idx++]!;
      }
    }
  }

  const solved = solve(board);
  if (!solved) throw new Error('Failed to generate a valid board');
  return solved;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Creates a puzzle by removing cells from a complete board,
 * ensuring unique solvability at each step.
 */
function digHoles(solution: Board, difficulty: Difficulty): Board {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const target = randomInt(config.removals[0], config.removals[1]);
  const puzzle = cloneBoard(solution);

  const positions = shuffleArray(
    Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, i) => ({
      row: Math.floor(i / BOARD_SIZE),
      col: i % BOARD_SIZE,
    }))
  );

  let removed = 0;
  for (const pos of positions) {
    if (removed >= target) break;
    const backup = puzzle[pos.row]![pos.col]!;
    puzzle[pos.row]![pos.col] = EMPTY;

    if (hasUniqueSolution(puzzle)) {
      removed++;
    } else {
      puzzle[pos.row]![pos.col] = backup;
    }
  }

  return puzzle;
}

export interface GeneratedPuzzle {
  puzzle: Board;
  solution: Board;
}

export function generatePuzzle(difficulty: Difficulty): GeneratedPuzzle {
  const solution = generateFullBoard();
  const puzzle = digHoles(solution, difficulty);
  return { puzzle, solution };
}
