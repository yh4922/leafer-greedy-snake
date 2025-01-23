<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { GreedySnakeGame } from './index'
import 'leafer-editor'
import '@leafer-in/state'

// 分数
const score = ref(0)
const status = ref(0) // 0 初始化  1开始中  2暂停中   3结束

var game: GreedySnakeGame
onMounted(() => {
    game = new GreedySnakeGame({
        view: 'leafer-view',
        fill: '',
        editor: {},
        gridSize: 16
    })

    game.on('scoreUpdate', (data: any) => {
        score.value = data.score
    })

    game.on('gameOver', () => {
        status.value = 3
    })

    window.addEventListener("keydown", (e) => {
        if (e.code === "Space" && status.value !== 3) {
            if (game.suspend) {
                start()
            } else {
                stop()
            }
        }
    })
})

function start() {
    game!.startGame()
    status.value = 1
}

function stop() {
    game!.stopGame()
    status.value = 2
}

function reStart() {
    game!.reStart()
    status.value = 1
    score.value = 0
}
</script>

<template>
    <div class="page">
        <div class="active-box">
            <div class="score">
                分数：<b>{{ score }}</b>
            </div>
            <div class="btns" v-if="status === 0">
                <button @click="start">开始游戏</button>
            </div>
            <div class="btns" v-else-if="status === 1">
                <button @click="stop" style="background: rgb(245, 124, 37);">暂停游戏</button>
            </div>
            <div class="btns" v-else-if="status === 2">
                <button @click="start">继续游戏</button>
            </div>
            <div class="btns" v-else-if="status === 3">
                <button @click="start">重新开始</button>
            </div>
        </div>
        <div id="leafer-view"></div>
        <div class="alert">
            空格键暂停/继续游戏
        </div>
        <div class="tips">
            <div class="modal" v-if="status === 3">
                <div class="modal-content">
                    <h2>游戏结束</h2>
                    <p>最终得分：<b>{{ score }}</b></p>
                    <button @click="reStart">再玩一次</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.page {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.active-box {
    width: 500px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
}

.active-box .btns button {
    margin-left: 10px;
    height: 30px;
    width: 70px;
    font-size: 12px;
    background: rgb(37, 124, 245);
    color: #fff;
    border-radius: 5px;
    padding: 0;
}

#leafer-view {
    background: #242424;
    width: 500px;
    height: 500px;
}

.alert {
    font-size: 12px;
    color: gray;
}

.tips .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.tips .modal-content {
    background: white;
    padding: 30px;
    border-radius: 10px;
    text-align: center;
}

.tips .modal-content h2 {
    margin: 0 0 20px 0;
    color: #333;
}

.tips .modal-content p {
    margin: 0 0 20px 0;
    font-size: 18px;
    color: #666;
}

.tips .modal-content button {
    height: 36px;
    width: 100px;
    font-size: 14px;
    background: rgb(37, 124, 245);
    color: #fff;
    border-radius: 5px;
    border: none;
    cursor: pointer;
}

.tips .modal-content button:hover {
    background: rgb(28, 100, 242);
}
</style>
