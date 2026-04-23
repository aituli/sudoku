import { type Board, type Coord, BOARD_SIZE, BOX_SIZE, EMPTY } from './types';
import { getCandidates } from './validator';

export interface HintResult {
  coord: Coord;
  answer: number;
  technique: string;
  explanation: string;
}

function coordLabel(row: number, col: number): string {
  return `第${row + 1}行第${col + 1}列`;
}

function boxIndex(row: number, col: number): number {
  return Math.floor(row / BOX_SIZE) * BOX_SIZE + Math.floor(col / BOX_SIZE) + 1;
}

/**
 * Naked Single: the cell has exactly one candidate.
 */
function detectNakedSingle(board: Board, row: number, col: number, answer: number): HintResult | null {
  const cands = getCandidates(board, row, col);
  if (cands.length !== 1) return null;

  const elimRow = describeEliminations(board, row, col, 'row');
  const elimCol = describeEliminations(board, row, col, 'col');
  const elimBox = describeEliminations(board, row, col, 'box');

  const parts = [elimRow, elimCol, elimBox].filter(Boolean);
  const detail = parts.length > 0
    ? parts.join('；') + `。排除后只剩 ${answer}，所以答案是 ${answer}`
    : `该格只有 ${answer} 一个候选数`;

  return {
    coord: { row, col },
    answer,
    technique: '唯一候选数（Naked Single）',
    explanation:
      `📍 ${coordLabel(row, col)}：\n` +
      `🔍 技巧：唯一候选数\n` +
      `💡 ${detail}。`,
  };
}

function describeEliminations(board: Board, row: number, col: number, scope: 'row' | 'col' | 'box'): string {
  const nums: number[] = [];

  if (scope === 'row') {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const v = board[row]![c]!;
      if (c !== col && v !== EMPTY) nums.push(v);
    }
    if (nums.length === 0) return '';
    return `第${row + 1}行已有 [${nums.sort((a, b) => a - b).join(',')}]`;
  }

  if (scope === 'col') {
    for (let r = 0; r < BOARD_SIZE; r++) {
      const v = board[r]![col]!;
      if (r !== row && v !== EMPTY) nums.push(v);
    }
    if (nums.length === 0) return '';
    return `第${col + 1}列已有 [${nums.sort((a, b) => a - b).join(',')}]`;
  }

  const br = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const bc = Math.floor(col / BOX_SIZE) * BOX_SIZE;
  for (let r = br; r < br + BOX_SIZE; r++) {
    for (let c = bc; c < bc + BOX_SIZE; c++) {
      const v = board[r]![c]!;
      if ((r !== row || c !== col) && v !== EMPTY) nums.push(v);
    }
  }
  if (nums.length === 0) return '';
  return `第${boxIndex(row, col)}宫已有 [${nums.sort((a, b) => a - b).join(',')}]`;
}

/**
 * Hidden Single in Row: the answer can only appear in this cell within its row.
 */
function detectHiddenSingleRow(board: Board, row: number, col: number, answer: number): HintResult | null {
  const otherPositions: number[] = [];
  for (let c = 0; c < BOARD_SIZE; c++) {
    if (c === col) continue;
    if (board[row]![c] !== EMPTY) continue;
    if (getCandidates(board, row, c).includes(answer)) {
      otherPositions.push(c);
    }
  }
  if (otherPositions.length > 0) return null;

  return {
    coord: { row, col },
    answer,
    technique: '行唯一位置（Hidden Single in Row）',
    explanation:
      `📍 ${coordLabel(row, col)}：\n` +
      `🔍 技巧：行唯一位置\n` +
      `💡 在第${row + 1}行中，数字 ${answer} 只能放在这一个空格。` +
      `其他空格因行、列或宫内冲突都无法放置 ${answer}，所以答案是 ${answer}。`,
  };
}

/**
 * Hidden Single in Column: the answer can only appear in this cell within its column.
 */
function detectHiddenSingleCol(board: Board, row: number, col: number, answer: number): HintResult | null {
  for (let r = 0; r < BOARD_SIZE; r++) {
    if (r === row) continue;
    if (board[r]![col] !== EMPTY) continue;
    if (getCandidates(board, r, col).includes(answer)) return null;
  }

  return {
    coord: { row, col },
    answer,
    technique: '列唯一位置（Hidden Single in Column）',
    explanation:
      `📍 ${coordLabel(row, col)}：\n` +
      `🔍 技巧：列唯一位置\n` +
      `💡 在第${col + 1}列中，数字 ${answer} 只能放在这一个空格。` +
      `其他空格因行、列或宫内冲突都无法放置 ${answer}，所以答案是 ${answer}。`,
  };
}

/**
 * Hidden Single in Box: the answer can only appear in this cell within its 3x3 box.
 */
function detectHiddenSingleBox(board: Board, row: number, col: number, answer: number): HintResult | null {
  const br = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const bc = Math.floor(col / BOX_SIZE) * BOX_SIZE;

  for (let r = br; r < br + BOX_SIZE; r++) {
    for (let c = bc; c < bc + BOX_SIZE; c++) {
      if (r === row && c === col) continue;
      if (board[r]![c] !== EMPTY) continue;
      if (getCandidates(board, r, c).includes(answer)) return null;
    }
  }

  return {
    coord: { row, col },
    answer,
    technique: '宫唯一位置（Hidden Single in Box）',
    explanation:
      `📍 ${coordLabel(row, col)}：\n` +
      `🔍 技巧：宫唯一位置\n` +
      `💡 在第${boxIndex(row, col)}宫中，数字 ${answer} 只能放在这一个空格。` +
      `宫内其他空格因行或列的冲突都无法放置 ${answer}，所以答案是 ${answer}。`,
  };
}

function buildFallbackHint(board: Board, row: number, col: number, answer: number): HintResult {
  const cands = getCandidates(board, row, col);

  return {
    coord: { row, col },
    answer,
    technique: '候选数排除',
    explanation:
      `📍 ${coordLabel(row, col)}：\n` +
      `🔍 技巧：候选数排除\n` +
      `💡 该格的候选数为 [${cands.join(',')}]。` +
      `通过更深层的逻辑推理（如数对排除、区块排除等），可以确定答案是 ${answer}。`,
  };
}

/**
 * Analyze the solving technique for a specific cell.
 * Tries techniques from simplest to most complex.
 */
export function analyzeHint(board: Board, row: number, col: number, answer: number): HintResult {
  return detectNakedSingle(board, row, col, answer)
    ?? detectHiddenSingleRow(board, row, col, answer)
    ?? detectHiddenSingleCol(board, row, col, answer)
    ?? detectHiddenSingleBox(board, row, col, answer)
    ?? buildFallbackHint(board, row, col, answer);
}
