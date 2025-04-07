import { visualizer } from 'rollup-plugin-visualizer';
import type { PoolOptions } from 'mysql2/promise';
import type { SecretRuntimeConfig } from '@/types/models/common';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: {
    enabled: false
  },
  devServer: {
    // host: '0.0.0.0'
  },
  modules: [
    '@element-plus/nuxt'
  ],
  elementPlus: {
    defaultLocale: 'zh-cn'
  },
  nitro: {
    sourceMap: false
  },
  runtimeConfig: {
    databaseConfig: <PoolOptions>{
      host: process.env.NUXT_DB_HOST,
      user: process.env.NUXT_DB_USER,
      password: process.env.NUXT_DB_PASSWORD,
      database: process.env.NUXT_DB_DATABASE
    },
    secretConfig: <SecretRuntimeConfig>{
      jwtSignKey: process.env.NUXT_JWT_SIGN_KEY
    }
  },
  hooks: {
    'vite:extendConfig': (config, { isClient }) => {
      if (isClient) {
        config.plugins = config.plugins || [];
        config.plugins.push(
          visualizer({
            filename: './build_analysis.html',
            open: false,
            gzipSize: true,
            brotliSize: true
          })
        );
      }
    }
  },
  app: {
    head: {
      title: 'Aerospace Flight Next'
    }
  }
});
