<template>
  <el-config-provider :locale="elementConfigLocale">
    <RouterView />
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { RouterView, useRouter } from 'vue-router'
import { useLangStore, useIsMobileStore } from '@/stores/common'
import { RouterConfig } from '@/config'
import { checkIsMobile } from '@/utils'

const i18n = useI18n()
const { lang } = storeToRefs(useLangStore())
i18n.locale.value = lang.value

const elementConfigLocale = computed(() => {
  if (lang.value === 'zh') {
    return window.ElementPlusLocaleZhCn
  } else {
    return window.ElementPlusLocaleEn
  }
})

const { RoutePathPrefixDesktop, RoutePathPrefixMobile } = RouterConfig
const { isMobile, setMobileStatus } = useIsMobileStore()
const currentIsMobile: boolean = checkIsMobile()
const router = useRouter()
if (currentIsMobile !== isMobile) {
  if (currentIsMobile) {
    router.replace(`${RoutePathPrefixMobile}/home`)
  } else {
    router.replace(`${RoutePathPrefixDesktop}/home`)
  }
}
setMobileStatus(currentIsMobile)

</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
/* scrollbar */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: transparent;
}
::-webkit-scrollbar-track-piece {
  background-color: transparent;
}
::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: rgba(128, 128, 128, 1);
}
</style>
