# 贪吃蛇小游戏

这是一个基于 LeaferJS 的贪吃蛇小游戏。你可以通过键盘上的方向键来控制蛇的移动，并通过空格键来暂停或继续游戏。

## 功能

- 使用方向键控制蛇的移动
- 空格键暂停/继续游戏
- 实时更新分数
- 游戏结束时显示最终得分
- 重新开始游戏

## 安装

1. 克隆仓库到本地：

   ```bash
   git clone <仓库地址>
   ```

2. 进入项目目录并安装依赖：
   ```bash
   cd <项目目录>
   npm install
   ```

## 使用

1. 启动项目：

   ```bash
   npm run dev
   ```

2. 打开浏览器并访问 `http://localhost:3000`，开始游戏。

## 代码结构

- `src/components/GreedySnakeGame/index.vue`：贪吃蛇游戏的主要组件，包含游戏逻辑和界面。
- `src/components/GreedySnakeGame/index.ts`：贪吃蛇游戏的核心逻辑，包括蛇的移动、食物生成等。
- `src/App.vue`：应用的入口组件，加载贪吃蛇游戏组件。

## 依赖

- [Vue 3](https://vuejs.org/)
- [LeaferJS](https://leaferjs.com/)

## 截图

![游戏截图](./screenshots/game.png)

## 贡献

欢迎提交 issue 和 pull request 来改进这个项目。

## 许可证

本项目基于 MIT 许可证开源。
