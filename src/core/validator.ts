import { type Board, BOARD_SIZE, BOX_SIZE, EMPTY } from './types';

export function isValidPlacement(board: Board, row: number, col: number, num: number): boolean {
  for (let c = 0; c < BOARD_SIZE; c++) {
    if (c !== col && board[row]![c] === num) return false;
  }

  for (let r = 0; r < BOARD_SIZE; r++) {
    if (r !== row && board[r]![col] === num) return false;
  }

  const boxRowStart = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxColStart = Math.floor(col / BOX_SIZE) * BOX_SIZE;
  for (let r = boxRowStart; r < boxRowStart + BOX_SIZE; r++) {
    for (let c = boxColStart; c < boxColStart + BOX_SIZE; c++) {
      if (r !== row && c !== col && board[r]![c] === num) return false;
    }
  }

  return true;
}

export function getCandidates(board: Board, row: number, col: number): number[] {
  const candidates: number[] = [];
  for (let num = 1; num <= BOARD_SIZE; num++) {
    if (isValidPlacement(board, row, col, num)) {
      candidates.push(num);
    }
  }
  return candidates;
}

export function isBoardComplete(board: Board): boolean {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r]![c] === EMPTY) return false;
    }
  }
  return true;
}

export function isBoardValid(board: Board): boolean {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const val = board[r]![c]!;
      if (val === EMPTY) continue;
      if (val < 1 || val > 9) return false;
      if (!isValidPlacement(board, r, c, val)) return false;
    }
  }
  return true;
}

export function boardsMatch(a: Board, b: Board): boolean {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (a[r]![c] !== b[r]![c]) return false;
    }
  }
  return true;
}

export function cloneBoard(board: Board): Board {
  return board.map(row => [...row]);
}
