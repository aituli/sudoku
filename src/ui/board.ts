import { type Board, type Coord, BOARD_SIZE, BOX_SIZE, EMPTY } from '../core/types';
import { isValidPlacement } from '../core/validator';

export interface BoardUI {
  container: HTMLElement;
  update(current: Board, puzzle: Board, selected: Coord | null): void;
  onCellClick(handler: (coord: Coord) => void): void;
}

export function createBoardUI(parent: HTMLElement): BoardUI {
  const container = document.createElement('div');
  container.className = 'sudoku-board';

  const cells: HTMLElement[][] = [];
  let clickHandler: ((coord: Coord) => void) | null = null;

  for (let r = 0; r < BOARD_SIZE; r++) {
    const rowCells: HTMLElement[] = [];
    for (let c = 0; c < BOARD_SIZE; c++) {
      const cell = document.createElement('div');
      cell.className = 'sudoku-cell';
      cell.dataset['row'] = String(r);
      cell.dataset['col'] = String(c);

      const rightBorder = (c + 1) % BOX_SIZE === 0 && c < BOARD_SIZE - 1;
      const bottomBorder = (r + 1) % BOX_SIZE === 0 && r < BOARD_SIZE - 1;
      if (rightBorder) cell.classList.add('box-right');
      if (bottomBorder) cell.classList.add('box-bottom');

      cell.addEventListener('click', () => {
        if (clickHandler) clickHandler({ row: r, col: c });
      });

      container.appendChild(cell);
      rowCells.push(cell);
    }
    cells.push(rowCells);
  }

  parent.appendChild(container);

  function update(current: Board, puzzle: Board, selected: Coord | null): void {
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const cell = cells[r]![c]!;
        const val = current[r]![c]!;
        const isGiven = puzzle[r]![c] !== EMPTY;

        cell.textContent = val !== EMPTY ? String(val) : '';
        cell.classList.remove('given', 'user', 'error', 'selected', 'related', 'highlight');

        if (isGiven) {
          cell.classList.add('given');
        } else if (val !== EMPTY) {
          cell.classList.add('user');
          if (!isValidPlacement(current, r, c, val)) {
            cell.classList.add('error');
          }
        }

        if (selected) {
          if (r === selected.row && c === selected.col) {
            cell.classList.add('selected');
          } else if (r === selected.row || c === selected.col) {
            cell.classList.add('related');
          } else {
            const sameBox =
              Math.floor(r / BOX_SIZE) === Math.floor(selected.row / BOX_SIZE) &&
              Math.floor(c / BOX_SIZE) === Math.floor(selected.col / BOX_SIZE);
            if (sameBox) cell.classList.add('related');
          }

          const selectedVal = current[selected.row]![selected.col]!;
          if (selectedVal !== EMPTY && val === selectedVal) {
            cell.classList.add('highlight');
          }
        }
      }
    }
  }

  return {
    container,
    update,
    onCellClick(handler: (coord: Coord) => void): void { clickHandler = handler; },
  };
}
