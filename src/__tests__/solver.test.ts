import { describe, it, expect } from 'vitest';
import { solveCopy, hasUniqueSolution } from '../core/solver';
import { isBoardValid, isBoardComplete, cloneBoard } from '../core/validator';
import { EMPTY } from '../core/types';

const KNOWN_PUZZLE = [
  [5,3,0,0,7,0,0,0,0],
  [6,0,0,1,9,5,0,0,0],
  [0,9,8,0,0,0,0,6,0],
  [8,0,0,0,6,0,0,0,3],
  [4,0,0,8,0,3,0,0,1],
  [7,0,0,0,2,0,0,0,6],
  [0,6,0,0,0,0,2,8,0],
  [0,0,0,4,1,9,0,0,5],
  [0,0,0,0,8,0,0,7,9],
];

const KNOWN_SOLUTION = [
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

describe('solve', () => {
  it('正确求解已知谜题', () => {
    const result = solveCopy(KNOWN_PUZZLE);
    expect(result).not.toBeNull();
    expect(result).toEqual(KNOWN_SOLUTION);
  });

  it('求解结果是完整且合法的', () => {
    const result = solveCopy(KNOWN_PUZZLE);
    expect(result).not.toBeNull();
    expect(isBoardComplete(result!)).toBe(true);
    expect(isBoardValid(result!)).toBe(true);
  });

  it('无解谜题返回 null', () => {
    const impossible = cloneBoard(KNOWN_PUZZLE);
    impossible[0]![2] = 6; // conflict with row
    const result = solveCopy(impossible);
    expect(result).toBeNull();
  });
});

describe('hasUniqueSolution', () => {
  it('已知谜题有唯一解', () => {
    expect(hasUniqueSolution(KNOWN_PUZZLE)).toBe(true);
  });

  it('空棋盘有多个解', () => {
    const empty = Array.from({ length: 9 }, () => Array(9).fill(EMPTY));
    expect(hasUniqueSolution(empty)).toBe(false);
  });
});
