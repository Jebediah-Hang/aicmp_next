import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import i18n from './lang'

const pinia = createPinia()
pinia.use(
  createPersistedState({
    key: id => `aicmp_next_${id}`,
    storage: sessionStorage,
    auto: true
  })
)

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.use(i18n)

app.mount('#app')
