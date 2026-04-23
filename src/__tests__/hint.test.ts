import { describe, it, expect } from 'vitest';
import { analyzeHint } from '../core/hint';
import { cloneBoard } from '../core/validator';
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

describe('analyzeHint', () => {
  it('检测唯一候选数（Naked Single）', () => {
    const board = cloneBoard(VALID_BOARD);
    board[0]![0] = EMPTY;
    const hint = analyzeHint(board, 0, 0, 5);
    expect(hint.answer).toBe(5);
    expect(hint.technique).toContain('唯一候选数');
    expect(hint.explanation).toContain('5');
  });

  it('检测行唯一位置（Hidden Single in Row）', () => {
    const board = cloneBoard(VALID_BOARD);
    board[0]![0] = EMPTY;
    board[0]![1] = EMPTY;

    const hint = analyzeHint(board, 0, 0, 5);
    expect(hint.answer).toBe(5);
    expect(hint.explanation.length).toBeGreaterThan(10);
  });

  it('始终返回正确的答案值', () => {
    const board = cloneBoard(VALID_BOARD);
    board[4]![4] = EMPTY;
    const hint = analyzeHint(board, 4, 4, 5);
    expect(hint.answer).toBe(5);
    expect(hint.coord).toEqual({ row: 4, col: 4 });
  });

  it('多个空格时也能给出解释', () => {
    const board = cloneBoard(VALID_BOARD);
    board[0]![0] = EMPTY;
    board[0]![1] = EMPTY;
    board[1]![0] = EMPTY;
    board[1]![1] = EMPTY;
    const hint = analyzeHint(board, 0, 0, 5);
    expect(hint.answer).toBe(5);
    expect(hint.technique).toBeTruthy();
    expect(hint.explanation).toBeTruthy();
  });
});
