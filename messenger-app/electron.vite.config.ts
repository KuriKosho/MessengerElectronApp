import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@/lib': resolve('src/main/lib'),
        '@shared': resolve('src/shared')
      }
    },
    define: {
      global: 'window'
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    assetsInclude: ['src/renderer/  **'],
    resolve: {
      alias: {
        '@': resolve('src/renderer/src'),
        '@renderer': resolve('src/renderer/src'),
        '@shared': resolve('src/shared'),
        '@/hooks': resolve('src/renderer/src/hooks'),
        '@/components': resolve('src/renderer/src/components'),
        '@/assets': resolve('src/renderer/src/assets'),
        '@/stores': resolve('src/renderer/src/stores'),
        '@/utils': resolve('src/renderer/src/utils'),
        '@/mocks': resolve('src/renderer/src/mocks')
      }
    },
    plugins: [react()]
  }
})
