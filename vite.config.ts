import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import importToCDN from 'vite-plugin-cdn-import'

import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    importToCDN({
      modules: [
        {
          name: 'vue',
          var: 'Vue',
          path: 'https://unpkg.com/vue@3.3.4/dist/vue.global.prod.js'
        },
        {
          name: 'vue-i18n',
          var: 'VueI18n',
          path: 'https://unpkg.com/vue-i18n@9.3.0-beta.25/dist/vue-i18n.global.prod.js',
        },
        {
          name: 'vue-router',
          var: 'VueRouter',
          path: 'https://unpkg.com/vue-router@4.2.4/dist/vue-router.global.prod.js'
        },
        {
          name: 'pinia',
          var: 'Pinia',
          path: 'https://unpkg.com/pinia@2.1.6/dist/pinia.iife.prod.js'
        }
      ]
    }),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'build_analysis.html'
    })
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
