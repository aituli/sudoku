import { describe, it, expect } from 'vitest';
import {
  isValidPlacement, getCandidates, isBoardComplete,
  isBoardValid, cloneBoard, boardsMatch,
} from '../core/validator';
import { EMPTY } from '../core/types';

const VALID_BOARD = [
  [5,3,4,6,7,8,9,1,2],
  [6,7,2,1,9,5,3,4,8],
  [1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],
  [4,2,6,8,5,3,7,9,1],
  [7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],
  [2,8,7,4,1,9,6,3,5],
  [3,4,5,2,8,6,1,7,9],
];

describe('isValidPlacement', () => {
  it('在空棋盘上任何数字都合法', () => {
    const empty = Array.from({ length: 9 }, () => Array(9).fill(EMPTY));
    expect(isValidPlacement(empty, 0, 0, 5)).toBe(true);
  });

  it('同行有重复数字时返回 false', () => {
    const board = cloneBoard(VALID_BOARD);
    board[0]![0] = EMPTY;
    expect(isValidPlacement(board, 0, 0, 3)).toBe(false); // 3 already in row
  });

  it('同列有重复数字时返回 false', () => {
    const board = cloneBoard(VALID_BOARD);
    board[0]![0] = EMPTY;
    expect(isValidPlacement(board, 0, 0, 6)).toBe(false); // 6 in col 0
  });

  it('同宫有重复数字时返回 false', () => {
    const board = cloneBoard(VALID_BOARD);
    board[0]![0] = EMPTY;
    expect(isValidPlacement(board, 0, 0, 7)).toBe(false); // 7 in box
  });

  it('合法位置返回 true', () => {
    const board = cloneBoard(VALID_BOARD);
    board[0]![0] = EMPTY;
    expect(isValidPlacement(board, 0, 0, 5)).toBe(true);
  });
});

describe('getCandidates', () => {
  it('已完成棋盘的空格返回唯一候选', () => {
    const board = cloneBoard(VALID_BOARD);
    board[0]![0] = EMPTY;
    expect(getCandidates(board, 0, 0)).toEqual([5]);
  });
});

describe('isBoardComplete', () => {
  it('完整棋盘返回 true', () => {
    expect(isBoardComplete(VALID_BOARD)).toBe(true);
  });

  it('含空格棋盘返回 false', () => {
    const board = cloneBoard(VALID_BOARD);
    board[4]![4] = EMPTY;
    expect(isBoardComplete(board)).toBe(false);
  });
});

describe('isBoardValid', () => {
  it('合法棋盘返回 true', () => {
    expect(isBoardValid(VALID_BOARD)).toBe(true);
  });

  it('含重复数字的棋盘返回 false', () => {
    const board = cloneBoard(VALID_BOARD);
    board[0]![0] = board[0]![1]!; // duplicate in row
    expect(isBoardValid(board)).toBe(false);
  });
});

describe('boardsMatch', () => {
  it('相同棋盘返回 true', () => {
    expect(boardsMatch(VALID_BOARD, cloneBoard(VALID_BOARD))).toBe(true);
  });

  it('不同棋盘返回 false', () => {
    const other = cloneBoard(VALID_BOARD);
    other[0]![0] = 0;
    expect(boardsMatch(VALID_BOARD, other)).toBe(false);
  });
});
