import { App, Group, Rect, Box, IAppConfig, IAppInputData, IRectInputData, IGroupInputData, IPointData } from 'leafer-ui'

// 移动方向
type Direction = "right" | "left" | "up" | "down"

// 蛇
class Snake extends Group {
    // 游戏实例
    game: GreedySnakeGame
    bodys: number[][]
    bodyRects: Rect[]
    constructor(game: GreedySnakeGame, data?: IGroupInputData) {
        super(data)
        this.game = game
        // 初始化蛇的位置
        this.bodyRects = []
        this.bodys = [
            [0, 4], // 蛇头
            [0, 3],
            [0, 2],
            [0, 1],
        ]

        // 初始化绘制
        this.draw(true)
    }
    /**
     * 绘制
     */
    draw(init: boolean = false) {
        if (this.game.suspend && !init) {
            setTimeout(() => {
                this.draw()
            }, 100)
            return
        }


        this.forward()
        this.removeAll() // 清空当前蛇身子
        this.bodyRects = []

        // 通过this.bodys生成平滑的蛇身路径
        for (let i = 0; i < this.bodys.length; i++) {
            let rect = new Rect({
                x: this.bodys[i][1] * this.game.gridSize,
                y: this.bodys[i][0] * this.game.gridSize,
                width: this.game.gridSize,
                height: this.game.gridSize,
                fill: "red",
            })
            this.add(rect)
            this.bodyRects.push(rect)
        }

        setTimeout(() => {
            this.draw()
        }, this.game.speed)
    }
    /**
     * 前进
    */
    forward() {
        // 蛇头拷贝一下
        let head = [...this.bodys[0]]

        // 上传
        let d = this.game.direction
        if (d === "right") {
            head[1]++
        } else if (d === "left") {
            head[1]--
        } else if (d === "up") {
            head[0]--
        } else if (d === "down") {
            head[0]++
        }

        // 判断头部是否超出边界
        if (head[0] < 0 || head[0] >= this.game.rows || head[1] < 0 || head[1] >= this.game.cols) {
            // 游戏结束
            this.game.emit("gameOver", { score: this.game.score })
            throw new Error("游戏结束")
        }

        // 如果没有吃到食物则去掉尾巴 TODO: 需要判断是否吃到食物
        let food = this.game.foodList[0]
        if (!food || head[0] !== food.row || head[1] !== food.col) {
            this.bodys.pop()
        } else {
            // 更新分数
            this.game.score++
            this.game.emit("scoreUpdate", { score: this.game.score })

            // 移除食物并生成新的食物
            food.remove()
            this.game.foodList.pop()
            this.game.generateFood()
        }

        // 判断头部是否撞到自己
        if (this.bodys.some(body => body[0] === head[0] && body[1] === head[1])) {
            // 游戏结束
            this.game.emit("gameOver", { score: this.game.score })
            throw new Error("游戏结束")
        }

        // 添加到头部
        this.bodys.unshift(head)
    }
    get head() {
        return this.bodys[0]
    }
}

// 网格
class Grid extends Group {
    /** 行数 */
    items: GridItem[][]
    /** 贪吃蛇游戏 */
    game: GreedySnakeGame
    constructor(game: GreedySnakeGame, data?: IGroupInputData) {
        super(data)
        this.game = game

        // 
        this.items = []
        for (let i = 0; i < this.game.rows; i++) { // 行
            this.items.push([])
            for (let j = 0; j < this.game.cols; j++) { // 列
                let item = new GridItem(i, j, {
                    x: j * this.game.gridSize,
                    y: i * this.game.gridSize,
                    width: this.game.gridSize,
                    height: this.game.gridSize,
                    stroke: '#000',
                    strokeWidth: 1,
                    fill: "#242424"
                })
                this.add(item)
                this.items[i].push(item)
            }
        }
    }
}

class GridItem extends Box {
    row: number
    col: number
    center: IPointData
    constructor(row: number, col: number, data?: IRectInputData) {
        super(data)
        // 行列
        this.row = row
        this.col = col

        // 计算中心点
        this.center = {
            x: this.x! + this.width! / 2,
            y: this.y! + this.height! / 2
        }

        // 点击背景方块
        this.on('click', () => {
            // this.scaleOf({ x: 0, y: 0 }, 0.5, 1)
            // this.scaleOf({ x: 0, y: 0 }, 1, 1.5)
            // this.scaleOf({ x: this.width!, y: this.height! }, 1, 0.5)
            // this.scaleOf({ x: this.width!, y: this.height! }, 0.5, 1)
        })
    }
}

interface GameConfig extends IAppConfig {
    /** 单个网格的大小 */
    gridSize?: number
    /** 速度 移动一个网格需要的时间 */
    speed?: number
}

// 
class Food extends Rect {
    row: number
    col: number
    constructor(row: number, col: number, data?: IRectInputData) {
        super(data)
        this.row = row
        this.col = col
    }
}

// 贪吃蛇游戏
class GreedySnakeGame extends App {
    /** 暂停 */
    suspend: boolean
    /** 分数 */
    score: number
    /** 网格 */
    grid: Grid
    /** 网格大小 */
    gridSize: number
    /** 行数 */
    rows: number
    /** 列数 */
    cols: number
    /** 蛇 */
    snake: Snake
    /** 速度 移动一个网格需要的时间 */
    speed: number
    /** 方向 */
    direction: Direction
    /** 食物列表 */
    foodList: Food[]
    /** 初始化贪吃蛇 */
    constructor(userConfig?: GameConfig, data?: IAppInputData) {
        super(userConfig, data)
        // 暂停 初始化时停止
        this.suspend = true
        // 网格大小
        this.gridSize = userConfig?.gridSize || 20
        // 移动一个网格的时间 500毫秒
        this.speed = userConfig?.speed || 100
        // 列数 = 宽度
        this.cols = Math.floor(this.width! / this.gridSize)
        // 行数 = 高度
        this.rows = Math.floor(this.height! / this.gridSize)

        // 初始方向  direction
        this.direction = "right"
        this.score = 0

        // 绘制网格
        let gameBox: IGroupInputData = {
            x: (this.width! - (this.cols * this.gridSize)) / 2,
            y: (this.height! - (this.rows * this.gridSize)) / 2,
            width: this.cols * this.gridSize,
            height: this.rows * this.gridSize,
        }
        this.grid = new Grid(this, gameBox)
        this.tree.add(this.grid) // 添加到画布

        // 初始化食物列表
        this.foodList = []

        // 绘制蛇
        this.snake = new Snake(this, gameBox)
        this.tree.add(this.snake) // 添加到画布

        this.generateFood()

        // @ts-ignore
        window.game = this

        // 监听 限制不能反向
        window.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight" && this.direction !== "left") {
                this.direction = "right"
            } else if (e.key === "ArrowLeft" && this.direction !== "right") {
                this.direction = "left"
            } else if (e.key === "ArrowUp" && this.direction !== "down") {
                this.direction = "up"
            } else if (e.key === "ArrowDown" && this.direction !== "up") {
                this.direction = "down"
            }
        })
    }
    generateFood(): any {
        let position = [
            Math.floor(Math.random() * this.rows),
            Math.floor(Math.random() * this.cols),
        ]

        // 验证是否在蛇身上 在则重新生成
        if (this.snake.bodys.some(body => body[0] === position[0] && body[1] === position[1])) {
            return this.generateFood()
        }

        // 生成食物
        let gridItem = this.grid.items[position[0]][position[1]]
        let food = new Food(position[0], position[1], {
            x: gridItem.x,
            y: gridItem.y,
            width: gridItem.width!,
            height: gridItem.height!,
            fill: "green",
        })
        this.foodList.push(food)
        this.grid.add(food)
    }
    /**
     * 重新开始
     */
    reStart() {
        // 开始状态
        this.suspend = false
        // 重置方向
        this.direction = "right"
        // 重置分数
        this.score = 0
        // 移除食物
        if (this.foodList[0]) {
            this.foodList[0].remove()
            this.foodList.pop()
        }
        // 移除蛇
        this.snake.removeAll()
        this.snake.remove()

        // 绘制网格
        let gameBox: IGroupInputData = {
            x: (this.width! - (this.cols * this.gridSize)) / 2,
            y: (this.height! - (this.rows * this.gridSize)) / 2,
            width: this.cols * this.gridSize,
            height: this.rows * this.gridSize,
        }

        // 绘制蛇
        this.snake = new Snake(this, gameBox)
        this.tree.add(this.snake) // 添加到画布
        // 生成食物
        this.generateFood()
    }
    /**
     * 开始游戏
     */
    startGame() {
        this.suspend = false
    }
    /**
     * 暂停游戏
     */
    stopGame() {
        this.suspend = true
    }
}


// 导出type
export type {
    Direction
}

export {
    GreedySnakeGame,
    Snake,
    Grid
}