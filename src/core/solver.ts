import { type Board, BOARD_SIZE, EMPTY } from './types';
import { getCandidates, cloneBoard } from './validator';

/**
 * Finds the empty cell with fewest candidates (MRV heuristic)
 * to minimize backtracking branches.
 */
function findBestEmpty(board: Board): { row: number; col: number; candidates: number[] } | null {
  let best: { row: number; col: number; candidates: number[] } | null = null;

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r]![c] !== EMPTY) continue;
      const candidates = getCandidates(board, r, c);
      if (candidates.length === 0) return { row: r, col: c, candidates: [] };
      if (!best || candidates.length < best.candidates.length) {
        best = { row: r, col: c, candidates };
      }
    }
  }
  return best;
}

export function solve(board: Board): Board | null {
  const cell = findBestEmpty(board);
  if (!cell) return board;
  if (cell.candidates.length === 0) return null;

  for (const num of cell.candidates) {
    board[cell.row]![cell.col] = num;
    const result = solve(board);
    if (result) return result;
    board[cell.row]![cell.col] = EMPTY;
  }
  return null;
}

/**
 * Counts solutions up to `limit`. Used to verify uniqueness.
 */
export function countSolutions(board: Board, limit: number = 2): number {
  const cell = findBestEmpty(board);
  if (!cell) return 1;
  if (cell.candidates.length === 0) return 0;

  let count = 0;
  for (const num of cell.candidates) {
    board[cell.row]![cell.col] = num;
    count += countSolutions(board, limit - count);
    board[cell.row]![cell.col] = EMPTY;
    if (count >= limit) break;
  }
  return count;
}

export function solveCopy(board: Board): Board | null {
  return solve(cloneBoard(board));
}

export function hasUniqueSolution(board: Board): boolean {
  return countSolutions(cloneBoard(board), 2) === 1;
}
