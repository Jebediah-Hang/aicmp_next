<template>
  <div class="nav-bar">
    <div class="nav-left">
      <div class="nav-home" @click="toPage('home')">
        <div class="home-logo"></div>
      </div>
      <div class="nav-item" @click="toPage('mission')">
        {{ $t('desktop.menu.mission') }}
      </div>
      <div class="nav-item" @click="toPage('trend')">
        {{ $t('desktop.menu.trend') }}
      </div>
      <div class="nav-item" @click="toPage('article')">
        {{ $t('desktop.menu.article') }}
      </div>
      <div class="nav-item" @click="toPage('resource')">
        {{ $t('desktop.menu.resource') }}
      </div>
      <div class="nav-item" @click="toPage('vehicle')">
        {{ $t('desktop.menu.vehicle') }}
      </div>
      <div class="nav-item" @click="toPage('statistic')">
        {{ $t('desktop.menu.statistic') }}
      </div>
    </div>
    <div class="nav-right">
      <div class="lang-block">
        <el-dropdown @command="setLanguage">
          <i class="fa fa-language"></i>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="en">English</el-dropdown-item>
              <el-dropdown-item command="zh">中文</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="person-block" @click="toPage('personal')">
        <i class="fa fa-user-circle-o"></i>
      </div>
    </div>
  </div>
  <div ref="mainView" class="content-main">
    <div
      class="content-block"
      :style="{ width: isHomePage ? '100%' : '1200px' }"
    >
      <RouterView />
    </div>
  </div>
  <transition name="el-fade-in-linear">
    <div
      v-if="scrollDistent >= 300"
      class="scroll-top"
      @click="scrollToTop"
    >
      <el-tooltip placement="top" :content="$t('desktop.main.top')">
        <i class="fa fa-rocket"></i>
      </el-tooltip>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useScroll } from '@vueuse/core'
import { useLangStore } from '@/stores/common'
import { RouterConfig } from '@/config'

const { RouteNamePrefixDesktop } = RouterConfig
const route = useRoute()
const isHomePage = computed<boolean>(() => {
  return route.name === `${RouteNamePrefixDesktop}Home`
})

const mainView = ref<HTMLElement | null>(null)
const { y: scrollDistent } = useScroll(mainView)
function scrollToTop() {
  const scrollTime: number = Math.floor(Math.log(scrollDistent.value)) * 100
  if (scrollTime > 0) {
    const totalSteps: number = scrollTime / 20
    const scrollPerStep: number = scrollDistent.value / totalSteps
    const scrollTimer = setInterval(() => {
      if (scrollDistent.value > 0) {
        mainView.value?.scroll(0, scrollDistent.value - scrollPerStep)
      } else {
        clearInterval(scrollTimer)
      }
    }, 20)
  } else {
    mainView.value?.scrollTo(0, 0)
  }
}

const { RoutePathPrefixDesktop } = RouterConfig
const router = useRouter()
function toPage(page: string) {
  router.replace(`${RoutePathPrefixDesktop}/${page}`)
}

const i18n = useI18n()
const { setLang } = useLangStore()
function setLanguage(locale: string) {
  i18n.locale.value = locale
  setLang(locale)
}

</script>

<style scoped lang="scss">
.nav-bar {
  width: 100%;
  height: 64px;
  color: #fff;
  user-select: none;
  background-color: #111;
  box-shadow: 0 0 6px #888;
  display: flex;
  justify-content: space-between;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  position: absolute;
  top: 0;
  .nav-left {
    height: 100%;
    display: flex;
    .nav-home {
      cursor: pointer;
      width: 200px;
      height: 100%;
      padding: 12px 0;
      .home-logo {
        width: 200px;
        height: 40px;
        background-image: url(../../assets/aicmp.png);
        background-size: cover;
        background-position: left;
        background-repeat: no-repeat;
      }
    }
    .nav-item {
      cursor: pointer;
      width: 100px;
      height: 100%;
      line-height: 64px;
      text-align: center;
    }
  }
  .nav-right {
    height: 100%;
    display: flex;
    .lang-block {
      width: 64px;
      height: 100%;
      padding: 18px;
      i {
        color: #fff;
        font-size: 28px;
        &:focus-visible {
          outline: none;
        }
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
    .person-block {
      width: 64px;
      height: 100%;
      padding: 18px;
      > i {
        cursor: pointer;
        font-size: 28px;
      }
    }
  }
}
.content-main {
  margin-top: 64px;
  height: calc(100vh - 64px);
  width: 100%;
  overflow: auto;
  .content-block {
    margin: 0 auto;
  }
}
.scroll-top {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: #aaa solid 1px;
  box-shadow: 0 0 6px #888;
  position: absolute;
  bottom: 60px;
  right: 40px;
  &:hover {
    > i {
      color: var(--el-color-primary);
    }
  }
}
</style>