import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import Avue from '@smallwei/avue'
import '@smallwei/avue/lib/index.css'

import App from './App.vue'
import router from './router'
import '@/assets/style/index.scss'

const pinia = createPinia()
pinia.use(
  createPersistedState({
    key: id => `aicmp_management_${id}`,
    storage: sessionStorage,
    auto: true
  })
)

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(
  ElementPlus,
  { locale: zhCn }
)
app.use(Avue)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
