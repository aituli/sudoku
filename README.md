# Sudoku

A clean, interactive 9×9 Sudoku puzzle game built for the browser. Built with **TypeScript** and **Vite**, featuring an intelligent hint system, three difficulty levels, and full mobile support.

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white" alt="Vitest" />
</p>

## ✨ Features

- **Three Difficulty Levels** — Easy (30–35 removed cells), Medium (40–46), Hard (50–55)
- **Guaranteed Unique Solution** — Every puzzle is generated with a valid, single solution using backtracking + constraint propagation
- **Smart Hint System** — Explains the solving technique used (Naked Single, Hidden Single in Row/Column/Box)
- **Multiple Input Methods** — Click/tap the numpad, use keyboard digits 1–9, or press Backspace/Delete to erase
- **Real-time Validation** — Incorrect entries are highlighted instantly in red
- **Visual Feedback** — Selected cell, related cells (same row/column/box), and matching numbers are highlighted
- **Mobile-first Responsive Design** — Fully playable on phones and tablets
- **Keyboard Shortcuts** — Full keyboard support for desktop players
- **Clean Architecture** — Strict separation between game logic (`core/`) and UI layer (`ui/`)

## 📸 Screenshots

<p align="center">
  <img src="screenshots/desktop.png" alt="Desktop" width="600" />
  <br/>
  <sub>Desktop view</sub>
</p>

<p align="center">
  <img src="screenshots/mobile.png" alt="Mobile" width="280" />
  <br/>
  <sub>Mobile view</sub>
</p>

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/aituli/sudoku.git
cd shudu

# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Language | TypeScript (ES2020, Strict Mode) |
| Build Tool | Vite |
| Testing | Vitest |
| Linting | ESLint + @typescript-eslint |

## 📁 Project Structure

```
src/
├── core/              # Pure logic layer — zero DOM dependency
│   ├── solver.ts      # Backtracking solver with constraint propagation
│   ├── generator.ts   # Puzzle generator (guarantees unique solutions)
│   ├── validator.ts   # Board state validation & candidate analysis
│   ├── hint.ts        # Solving technique detection & explanation
│   └── types.ts       # Shared type definitions
├── ui/                # UI layer — depends on core only
│   ├── board.ts       # Board rendering & cell interaction
│   ├── controls.ts    # Control panel (difficulty, timer, numpad)
│   └── theme.ts       # Style constants
├── __tests__/         # Unit tests
│   ├── solver.test.ts
│   ├── generator.test.ts
│   ├── validator.test.ts
│   └── hint.test.ts
└── main.ts            # Application entry point
```

### Architecture Rules

- `core/` modules **must never** import from `ui/` or access DOM APIs (`document`, `window`, etc.)
- `ui/` modules **may** import from `core/`
- `__tests__/` can import from `core/`

## 🎮 How to Play

1. Select a cell on the 9×9 grid
2. Enter a number (1–9) using the on-screen numpad or your keyboard
3. Use the **eraser** (🗑️) or **Backspace** to clear a cell
4. Tap the **hint** (💡) button to reveal the correct number with an explanation of the solving technique
5. Click **Restart** to reset the current puzzle, or switch difficulty for a new one
6. Complete the grid to win!

## 🧪 Testing

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run type checking + linting + tests
npm run check
```

## 📦 Build & Deploy

```bash
# Production build
npm run build

# Preview production build locally
npm run preview

# One-command deployment (local preview / GitHub Pages / ZIP)
npm run deploy
```

The `deploy.sh` script provides three options:
1. **Local preview** — Starts a local static server
2. **GitHub Pages** — Pushes the `dist/` folder to the `gh-pages` branch
3. **ZIP package** — Creates a portable ZIP for manual upload (Netlify, Vercel, OSS, etc.)

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Lint source code with ESLint |
| `npm run typecheck` | Type-check without emitting files |
| `npm run check` | Run typecheck + lint + test |
| `npm run deploy` | Interactive deployment script |
| `npm run zip` | Build and package into `shudu.zip` |

## 🧩 Core Algorithms

### Solver
Backtracking search enhanced with constraint propagation (naked singles) for efficient solving.

### Generator
1. Generate a complete, valid Sudoku grid via randomized backtracking
2. Remove cells according to difficulty settings
3. Verify the resulting puzzle has exactly **one unique solution**

### Hint Engine
Analyzes the current board state and detects which solving technique applies to the selected cell:

- **Naked Single** — Only one candidate remains for the cell
- **Hidden Single (Row/Column/Box)** — The number can only be placed in this cell within its row, column, or 3×3 box

## 📝 License

[MIT](LICENSE)

---

<p align="center">🌐 <a href="./README.zh-CN.md">中文版 README</a></p>
