import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import importToCDN from 'vite-plugin-cdn-import'
// import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: asset => {
          const suffix = asset.name?.split('.').at(-1)?.toLowerCase()
          if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(<string>suffix)) {
            return 'img/[name].[hash].[ext]'
          } else {
            return '[ext]/[name].[hash].[ext]'
          }
        }
      }
    }
  },
  plugins: [
    vue(),
    importToCDN({
      modules: [
        {
          name: 'vue',
          var: 'Vue',
          path: 'https://cdn.bootcdn.net/ajax/libs/vue/3.3.4/vue.global.prod.min.js'
        },
        {
          name: 'vue-demi',
          var: 'VueDemi',
          path: 'https://cdn.bootcdn.net/ajax/libs/vue-demi/0.14.5/index.iife.min.js'
        },
        {
          name: 'vue-i18n',
          var: 'VueI18n',
          path: 'https://cdn.bootcdn.net/ajax/libs/vue-i18n/9.3.0-beta.25/vue-i18n.global.prod.min.js',
        },
        {
          name: 'vue-router',
          var: 'VueRouter',
          path: 'https://cdn.bootcdn.net/ajax/libs/vue-router/4.2.4/vue-router.global.prod.min.js'
        },
        {
          name: 'element-plus',
          var: 'ElementPlus',
          path: 'https://cdn.bootcdn.net/ajax/libs/element-plus/2.3.8/index.full.min.js',
          css: 'https://cdn.bootcdn.net/ajax/libs/element-plus/2.3.8/index.min.css'
        },
        {
          name: 'pinia',
          var: 'Pinia',
          path: 'https://cdn.bootcdn.net/ajax/libs/pinia/2.1.6/pinia.iife.prod.min.js'
        }
      ]
    })
    // visualizer({
    //   open: true,
    //   gzipSize: true,
    //   brotliSize: true,
    //   filename: 'build_analysis.html'
    // })
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
