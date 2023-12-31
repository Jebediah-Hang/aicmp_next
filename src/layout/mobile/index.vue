<template>
  <div
    class="main-header"
    :style="{ height: `${!isHomePage && isShowHeader ? 40 : 0}px`}"
  >
    <div class="person-block" @click="toPage('personal')">
      <i class="fa fa-user-circle-o"></i>
    </div>
    <div class="home-logo"></div>
    <div class="lang-block">
      <el-dropdown trigger="click" @command="setLanguage">
        <i class="fa fa-language"></i>
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
    <div class="nav-item" @click="toPage('home')">
      <i class="fa fa-home"></i>
      <div>{{ $t('mobile.menu.home') }}</div>
    </div>
    <div class="nav-item" @click="toPage('mission')">
      <i class="fa fa-rocket"></i>
      <div>{{ $t('mobile.menu.mission') }}</div>
    </div>
    <div class="nav-item" @click="toPage('trend')">
      <i class="fa fa-compass"></i>
      <div>{{ $t('mobile.menu.trend') }}</div>
    </div>
    <div class="nav-item" @click="toPage('resource')">
      <i class="fa fa-cubes"></i>
      <div>{{ $t('mobile.menu.resource') }}</div>
    </div>
    <div class="nav-item" @click="toPage('article')">
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
import { useLangStore } from '@/stores/common'
import { RouterConfig } from '@/config'

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

const { RoutePathPrefixMobile, RouteNamePrefixMobile } = RouterConfig
const route = useRoute()
const isHomePage = computed<boolean>(() => {
  return route.name === `${RouteNamePrefixMobile}Home`
})

const router = useRouter()
function toPage(page: string) {
  router.replace(`${RoutePathPrefixMobile}/${page}`)
}

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
  .home-logo {
    width: 150px;
    height: 30px;
    align-self: center;
    background-image: url(../../assets/aicmp.png);
    background-size: cover;
    background-position: left;
    background-repeat: no-repeat;
  }
  .lang-block {
    width: 50px;
    height: 100%;
    padding: 9px 14px;
    i {
      color: #666;
      font-size: 22px;
    }
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
  user-select: none;
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