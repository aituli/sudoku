export type Cell = number; // 0 = empty, 1-9 = filled
export type Board = Cell[][];
export type Coord = { row: number; col: number };

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  readonly label: string;
  readonly removals: readonly [min: number, max: number];
}

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy:   { label: '简单', removals: [30, 35] },
  medium: { label: '中等', removals: [40, 46] },
  hard:   { label: '困难', removals: [50, 55] },
} as const;

export const BOARD_SIZE = 9;
export const BOX_SIZE = 3;
export const EMPTY = 0;

export interface GameState {
  puzzle: Board;
  solution: Board;
  current: Board;
  difficulty: Difficulty;
  isComplete: boolean;
}
