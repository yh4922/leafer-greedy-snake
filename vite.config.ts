import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/leafer-greedy-snake/',
  // 打包文件夹
  build: {
    outDir: 'docs'
  },
  plugins: [vue()],
})
