import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'fs'

// Копируем Monaco Editor в public, чтобы workers работали локально
const monacoPath = path.resolve(__dirname, 'node_modules/monaco-editor/esm/vs')
const targetPath = path.resolve(__dirname, 'public/monaco-editor')

if (existsSync(monacoPath) && !existsSync(targetPath)) {
  mkdirSync(targetPath, { recursive: true })
  const copyRecursive = (src: string, dest: string) => {
    const entries = readdirSync(src, { withFileTypes: true })
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name)
      const destPath = path.join(dest, entry.name)
      if (entry.isDirectory()) {
        mkdirSync(destPath, { recursive: true })
        copyRecursive(srcPath, destPath)
      } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.css'))) {
        copyFileSync(srcPath, destPath)
      }
    }
  }
  copyRecursive(monacoPath, targetPath)
  console.log('✅ Monaco Editor скопирован в public/monaco-editor')
}

export default defineConfig({
  plugins: [vue()],
  base: '/ctf-learner/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173
  }
})