import { type Coord, type Difficulty, type GameState, EMPTY } from './core/types';
import { generatePuzzle } from './core/generator';
import { isBoardComplete, isBoardValid, cloneBoard, boardsMatch } from './core/validator';
import { analyzeHint } from './core/hint';
import { createBoardUI } from './ui/board';
import { createControlsUI } from './ui/controls';

function createApp(): void {
  const app = document.getElementById('app');
  if (!app) throw new Error('Missing #app element');

  const boardUI = createBoardUI(app);
  const controlsUI = createControlsUI(app);

  let state: GameState;
  let selected: Coord | null = null;

  function render(): void {
    boardUI.update(state.current, state.puzzle, selected);
  }

  function checkWin(): void {
    if (isBoardComplete(state.current) && isBoardValid(state.current) && boardsMatch(state.current, state.solution)) {
      state.isComplete = true;
      controlsUI.showSuccess();
      selected = null;
      render();
    }
  }

  function startNewGame(difficulty: Difficulty): void {
    const { puzzle, solution } = generatePuzzle(difficulty);
    state = {
      puzzle,
      solution,
      current: cloneBoard(puzzle),
      difficulty,
      isComplete: false,
    };
    selected = null;
    controlsUI.hideSuccess();
    controlsUI.hideHintExplanation();
    controlsUI.setActiveDifficulty(difficulty);
    render();
  }

  boardUI.onCellClick((coord) => {
    if (state.isComplete) return;
    selected = coord;
    render();
  });

  controlsUI.onNumberInput((num) => {
    if (!selected || state.isComplete) return;
    if (state.puzzle[selected.row]![selected.col] !== EMPTY) return;
    state.current[selected.row]![selected.col] = num;
    render();
    checkWin();
  });

  controlsUI.onErase(() => {
    if (!selected || state.isComplete) return;
    if (state.puzzle[selected.row]![selected.col] !== EMPTY) return;
    state.current[selected.row]![selected.col] = EMPTY;
    render();
  });

  controlsUI.onHint(() => {
    if (!selected || state.isComplete) return;
    if (state.puzzle[selected.row]![selected.col] !== EMPTY) return;
    const answer = state.solution[selected.row]![selected.col]!;
    const hint = analyzeHint(state.current, selected.row, selected.col, answer);
    state.current[selected.row]![selected.col] = answer;
    controlsUI.showHintExplanation(hint.technique, hint.explanation);
    render();
    checkWin();
  });

  controlsUI.onRestart(() => {
    startNewGame(state.difficulty);
  });

  controlsUI.onNewGame(startNewGame);

  document.addEventListener('keydown', (e) => {
    if (state.isComplete) return;
    const num = parseInt(e.key, 10);
    if (num >= 1 && num <= 9 && selected) {
      if (state.puzzle[selected.row]![selected.col] !== EMPTY) return;
      state.current[selected.row]![selected.col] = num;
      render();
      checkWin();
    } else if ((e.key === 'Backspace' || e.key === 'Delete') && selected) {
      if (state.puzzle[selected.row]![selected.col] !== EMPTY) return;
      state.current[selected.row]![selected.col] = EMPTY;
      render();
    }
  });

  startNewGame('easy');
}

createApp();
