import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLangStore = defineStore('lang', () => {
  const lang = ref<string>('en')
  function setLang(locale: string) {
    lang.value = locale
  }

  return { lang, setLang }
})