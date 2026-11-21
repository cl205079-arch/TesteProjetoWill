import { resolve } from 'node:path'
import { defineConfig } from 'electron-vite'

// Entradas padrao: src/main/index.ts, src/preload/index.ts e src/renderer.
// O preload usa formato cjs para funcionar com sandbox habilitado.
export default defineConfig({
  main: {},
  renderer: {
    root: resolve(__dirname, 'src/renderer')
  },
  preload: {
    build: {
      lib: {
        entry: resolve(__dirname, 'src/preload/index.ts'),
        formats: ['cjs']
      }
    }
  }
})
