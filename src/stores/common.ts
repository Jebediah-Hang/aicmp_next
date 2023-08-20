import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLangStore = defineStore('lang', () => {
  const lang = ref<string>('en')
  function setLang(locale: string) {
    lang.value = locale
  }

  return { lang, setLang }
})

export const useIsMobileStore = defineStore('isMobile', () => {
  const isMobile = ref<boolean>(false)
  function setMobileStatus(status: boolean) {
    isMobile.value = status
  }

  return { isMobile, setMobileStatus}
})