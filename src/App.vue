<template>
  <RouterView />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterView, useRouter } from 'vue-router'
import { useLangStore, useIsMobileStore } from '@/stores/common'
import { desktopRoutePrefix, mobileRoutePrefix } from '@/config'
import { checkIsMobile } from '@/utils'

const i18n = useI18n()
const { lang } = useLangStore()
i18n.locale.value = lang

const { isMobile, setMobileStatus } = useIsMobileStore()
const currentIsMobile: boolean = checkIsMobile()
const router = useRouter()
if (currentIsMobile && !isMobile) {
  router.replace(`${mobileRoutePrefix}/home`)
}
if (!currentIsMobile && isMobile) {
  router.replace(`${desktopRoutePrefix}/home`)
}
setMobileStatus(currentIsMobile)

</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
