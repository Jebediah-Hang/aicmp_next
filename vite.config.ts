import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          const suffix = assetInfo.name?.split('.').at(-1)?.toLowerCase()
          if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(<string>suffix)) {
            return 'img/[name].[hash].[ext]'
          } else {
            return '[ext]/[name].[hash].[ext]'
          }
        }
      }
    }
  },
  plugins: [
    vue()
  ],
  server: {
    host: '0.0.0.0'
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
