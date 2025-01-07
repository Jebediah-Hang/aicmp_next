// https://nuxt.com/docs/api/configuration/nuxt-config
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
  }
})
