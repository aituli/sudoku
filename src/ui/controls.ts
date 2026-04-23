import { type Difficulty, DIFFICULTY_CONFIGS } from '../core/types';

export interface ControlsUI {
  container: HTMLElement;
  onNewGame(handler: (difficulty: Difficulty) => void): void;
  onNumberInput(handler: (num: number) => void): void;
  onErase(handler: () => void): void;
  onHint(handler: () => void): void;
  onRestart(handler: () => void): void;
  showSuccess(): void;
  hideSuccess(): void;
  showHintExplanation(technique: string, explanation: string): void;
  hideHintExplanation(): void;
  setActiveDifficulty(difficulty: Difficulty): void;
}

export function createControlsUI(parent: HTMLElement): ControlsUI {
  const container = document.createElement('div');
  container.className = 'controls';

  const topBar = document.createElement('div');
  topBar.className = 'top-bar';

  const difficultyBar = document.createElement('div');
  difficultyBar.className = 'difficulty-bar';

  const successMsg = document.createElement('div');
  successMsg.className = 'success-message';
  successMsg.textContent = '🎉 恭喜完成！';
  successMsg.style.display = 'none';

  const hintPanel = document.createElement('div');
  hintPanel.className = 'hint-panel';
  hintPanel.style.display = 'none';

  const hintHeader = document.createElement('div');
  hintHeader.className = 'hint-header';

  const hintTechnique = document.createElement('span');
  hintTechnique.className = 'hint-technique';

  const hintClose = document.createElement('button');
  hintClose.className = 'btn hint-close';
  hintClose.textContent = '✕';
  hintClose.addEventListener('click', () => {
    hintPanel.style.display = 'none';
  });

  hintHeader.appendChild(hintTechnique);
  hintHeader.appendChild(hintClose);

  const hintBody = document.createElement('div');
  hintBody.className = 'hint-body';

  hintPanel.appendChild(hintHeader);
  hintPanel.appendChild(hintBody);

  let newGameHandler: ((d: Difficulty) => void) | null = null;
  let numberHandler: ((n: number) => void) | null = null;
  let eraseHandler: (() => void) | null = null;
  let hintHandler: (() => void) | null = null;
  let restartHandler: (() => void) | null = null;

  const diffButtons: Record<string, HTMLButtonElement> = {};
  for (const [key, config] of Object.entries(DIFFICULTY_CONFIGS)) {
    const btn = document.createElement('button');
    btn.className = 'btn btn-difficulty';
    btn.textContent = config.label;
    btn.addEventListener('click', () => {
      if (newGameHandler) newGameHandler(key as Difficulty);
    });
    difficultyBar.appendChild(btn);
    diffButtons[key] = btn;
  }

  const restartBtn = document.createElement('button');
  restartBtn.className = 'btn btn-action btn-restart';
  restartBtn.textContent = '🔄 新开一局';
  restartBtn.addEventListener('click', () => {
    if (restartHandler) restartHandler();
  });

  topBar.appendChild(difficultyBar);
  topBar.appendChild(restartBtn);
  container.appendChild(topBar);
  container.appendChild(hintPanel);
  container.appendChild(successMsg);

  const numPad = document.createElement('div');
  numPad.className = 'numpad';
  for (let n = 1; n <= 9; n++) {
    const btn = document.createElement('button');
    btn.className = 'btn btn-num';
    btn.textContent = String(n);
    btn.addEventListener('click', () => {
      if (numberHandler) numberHandler(n);
    });
    numPad.appendChild(btn);
  }

  const eraseBtn = document.createElement('button');
  eraseBtn.className = 'btn btn-erase';
  eraseBtn.textContent = '⌫';
  eraseBtn.addEventListener('click', () => {
    if (eraseHandler) eraseHandler();
  });
  numPad.appendChild(eraseBtn);

  const hintBtn = document.createElement('button');
  hintBtn.className = 'btn btn-hint';
  hintBtn.textContent = '💡';
  hintBtn.addEventListener('click', () => {
    if (hintHandler) hintHandler();
  });
  numPad.appendChild(hintBtn);

  container.appendChild(numPad);
  parent.appendChild(container);

  return {
    container,
    onNewGame(handler: (difficulty: Difficulty) => void): void { newGameHandler = handler; },
    onNumberInput(handler: (num: number) => void): void { numberHandler = handler; },
    onErase(handler: () => void): void { eraseHandler = handler; },
    onHint(handler: () => void): void { hintHandler = handler; },
    onRestart(handler: () => void): void { restartHandler = handler; },
    showSuccess(): void { successMsg.style.display = 'flex'; hintPanel.style.display = 'none'; },
    hideSuccess(): void { successMsg.style.display = 'none'; },
    showHintExplanation(technique: string, explanation: string): void {
      hintTechnique.textContent = technique;
      hintBody.textContent = '';
      const lines = explanation.split('\n');
      for (const line of lines) {
        const p = document.createElement('p');
        p.textContent = line;
        hintBody.appendChild(p);
      }
      hintPanel.style.display = 'block';
    },
    hideHintExplanation(): void { hintPanel.style.display = 'none'; },
    setActiveDifficulty(difficulty: Difficulty): void {
      for (const [key, btn] of Object.entries(diffButtons)) {
        btn.classList.toggle('active', key === difficulty);
      }
    },
  };
}
