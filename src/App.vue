<template>
  <RouterView />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterView, useRouter } from 'vue-router'
import { useLangStore, useIsMobileStore } from '@/stores/common'
import { RouterConfig } from '@/config'
import { checkIsMobile } from '@/utils'

const i18n = useI18n()
const { lang } = useLangStore()
i18n.locale.value = lang

const { RoutePathPrefixDesktop, RoutePathPrefixMobile } = RouterConfig
const { isMobile, setMobileStatus } = useIsMobileStore()
const currentIsMobile: boolean = checkIsMobile()
const router = useRouter()
if (currentIsMobile && !isMobile) {
  router.replace(`${RoutePathPrefixMobile}/home`)
}
if (!currentIsMobile && isMobile) {
  router.replace(`${RoutePathPrefixDesktop}/home`)
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
