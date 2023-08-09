import { createI18n } from 'vue-i18n'

import enLocale from './locale/en'
import zhLocale from './locale/zh'

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'en',
  messages: {
    en: enLocale,
    zh: zhLocale
  }
})

export default i18n