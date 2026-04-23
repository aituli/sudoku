# 数独 H5 游戏 — 架构说明

## 项目概述
一个基于浏览器的 9×9 数独游戏，支持难度调整（简单/中等/困难），使用 TypeScript + Vite 构建。

## 模块结构与依赖规则

```
src/
├── core/           # 纯逻辑层，零 DOM 依赖
│   ├── solver.ts   # 数独求解器（回溯法 + 约束传播）
│   ├── generator.ts# 数独谜题生成器
│   ├── validator.ts# 数独状态验证
│   └── types.ts    # 共享类型定义
├── ui/             # UI 层，仅依赖 core
│   ├── board.ts    # 棋盘渲染与交互
│   ├── controls.ts # 控制面板（难度、新游戏、计时器）
│   └── theme.ts    # 样式与主题常量
├── main.ts         # 入口文件，组装 core + ui
└── __tests__/      # 单元测试
    ├── solver.test.ts
    ├── generator.test.ts
    └── validator.test.ts
```

### 依赖约束（架构边界）
- `core/` 模块 **绝不可** 导入 `ui/` 中的任何内容
- `core/` 模块 **绝不可** 访问 DOM API（document、window 等）
- `ui/` 可以导入 `core/`
- `__tests__/` 可以导入 `core/`

## 核心算法要求
- 求解器必须基于**回溯法 + 约束传播**
- 生成器必须保证生成的谜题有**唯一解**
- 难度通过**挖去数字的数量和策略**控制：
  - 简单（Easy）：挖去 30-35 个数字，优先保留行列宫内的提示
  - 中等（Medium）：挖去 40-46 个数字
  - 困难（Hard）：挖去 50-55 个数字，允许更复杂的推理

## 数据表示
- 棋盘用 `number[][]`（9×9），0 表示空格
- 坐标用 `{ row: number; col: number }`，均从 0 开始
