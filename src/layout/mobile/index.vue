<template>
  <div
    class="main-header"
    :style="{ height: `${!isHomePage && isShowHeader ? 40 : 0}px`}"
  >
    <div class="person-block">
      <i class="fa fa-user-circle-o"></i>
    </div>
    <div class="lang-block">
      <el-dropdown trigger="click" @command="setLanguage">
        <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" width="22px" height="22px">
          <path fill="#666" d="m18.5 10l4.4 11h-2.155l-1.201-3h-4.09l-1.199 3h-2.154L16.5 10h2zM10 2v2h6v2h-1.968a18.222 18.222 0 0 1-3.62 6.301a14.864 14.864 0 0 0 2.336 1.707l-.751 1.878A17.015 17.015 0 0 1 9 13.725a16.676 16.676 0 0 1-6.201 3.548l-.536-1.929a14.7 14.7 0 0 0 5.327-3.042A18.078 18.078 0 0 1 4.767 8h2.24A16.032 16.032 0 0 0 9 10.877a16.165 16.165 0 0 0 2.91-4.876L2 6V4h6V2h2zm7.5 10.885L16.253 16h2.492L17.5 12.885z"></path>
        </svg>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="en">English</el-dropdown-item>
            <el-dropdown-item command="zh">中文</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <div
    ref="mainView"
    class="content-main"
    :style="{
      height: `calc(100vh - ${!isHomePage && isShowHeader ? 100 : 60}px)`,
      backgroundColor: isHomePage ? 'rgba(0, 0, 0, .9)' : ''
    }"
  >
    <RouterView />
  </div>
  <div class="nav-bar" :class="isHomePage ? 'dark' : 'light'">
    <div
      class="nav-item"
      @click="toHomePage"
    >
      <i class="fa fa-home"></i>
      <div>{{ $t('mobile.menu.home') }}</div>
    </div>
    <div
      class="nav-item"
      @click="toMissionPage"
    >
      <i class="fa fa-rocket"></i>
      <div>{{ $t('mobile.menu.mission') }}</div>
    </div>
    <div
      class="nav-item"
      @click="toTrendPage"
    >
      <i class="fa fa-compass"></i>
      <div>{{ $t('mobile.menu.trend') }}</div>
    </div>
    <div
      class="nav-item"
      @click="toResourcePage"
    >
      <i class="fa fa-cubes"></i>
      <div>{{ $t('mobile.menu.resources') }}</div>
    </div>
    <div
      class="nav-item"
      @click="toArticlePage"
    >
      <i class="fa fa-book"></i>
      <div>{{ $t('mobile.menu.article') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch, computed } from 'vue'
import { RouterView, useRouter, useRoute } from 'vue-router'
import { useScroll } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { useLangStore } from '@/stores/lang'

const mainView = ref<HTMLElement | null>(null)
const { directions } = useScroll(mainView)
const { top: mainViewScrollToTop, bottom: mainViewScrollToBottom } = toRefs(directions)
const isShowHeader = ref<boolean>(true)
watch(mainViewScrollToTop, (val) => {
  if (val) {
    isShowHeader.value = true
  }
})
watch(mainViewScrollToBottom, (val) => {
  if (val) {
    isShowHeader.value = false
  }
})

const route = useRoute()
const isHomePage = computed<boolean>(() => {
  return route.name === 'M_Home'
})

const router = useRouter()
function toHomePage() {
  router.replace('/aicmp/mobile/home')
}
function toMissionPage() {
  router.replace('/aicmp/mobile/mission')
}
function toTrendPage() {}
function toResourcePage() {}
function toArticlePage() {}

const i18n = useI18n()
const { setLang } = useLangStore()

function setLanguage(locale: string) {
  i18n.locale.value = locale
  setLang(locale)
}

</script>

<style scoped lang="scss">
.main-header {
  width: 100%;
  overflow: hidden;
  border-bottom: rgba(0, 0, 0, 0.2) solid 1px;
  transition: all linear .2s;
  display: flex;
  justify-content: space-between;
  .person-block {
    width: 50px;
    height: 100%;
    padding: 9px 14px;
    > i {
      color: #666;
      font-size: 22px;
    }
  }
  .lang-block {
    width: 50px;
    height: 100%;
    padding: 9px 14px;
    :deep(.el-dropdown) {
      &:focus-visible {
        outline: none;
      }
      .el-only-child__content:focus-visible {
        outline: none;
      }
    }
  }
}
.content-main {
  width: 100%;
  overflow: auto;
  padding-bottom: 6px;
  transition: all linear .2s;
}
.nav-bar {
  width: 100%;
  height: 60px;
  box-shadow: 0 0 6px #888;
  border-top: rgba(0, 0, 0, 0.2) solid 1px;
  position: fixed;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
  transition: all linear .2s;
  .nav-item {
    width: calc((100% - 40px) / 5);
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    > i {
      font-size: 20px;
    }
    > div {
      font-size: 12px;
      padding-top: 6px;
      font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    }
  }
}
.light {
  color: #111;
  background-color: #fff;
}
.dark {
  color: #fff;
  background-color: #111;
}
</style>