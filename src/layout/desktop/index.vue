<template>
  <div class="nav-bar">
    <div class="nav-left">
      <div class="nav-home" @click="toHomePage">
        <div class="home-logo"></div>
      </div>
      <div class="nav-item" @click="toMissionPage">
        {{ $t('desktop.menu.mission') }}
      </div>
      <div class="nav-item" @click="toTrendPage">
        {{ $t('desktop.menu.trend') }}
      </div>
      <div class="nav-item" @click="toArticlePage">
        {{ $t('desktop.menu.article') }}
      </div>
      <div class="nav-item" @click="toResourcePage">
        {{ $t('desktop.menu.resource') }}
      </div>
      <div class="nav-item" @click="toVehiclePage">
        {{ $t('desktop.menu.vehicle') }}
      </div>
      <div class="nav-item" @click="toStatisticPage">
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
      <div class="person-block" @click="toMinePage">
        <i class="fa fa-user-circle-o"></i>
      </div>
    </div>
  </div>
  <div ref="mainView" class="content-main">
    <div class="content-block">
      <RouterView />
    </div>
  </div>
  <div
    v-if="scrollDistent >= 300"
    class="scroll-top"
    @click="scrollToTop"
  >
    <el-tooltip placement="top" :content="$t('desktop.main.top')">
      <i class="fa fa-rocket"></i>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useScroll } from '@vueuse/core'
import { useLangStore } from '@/stores/common'
import { RouterConfig } from '@/config'

const mainView = ref<HTMLElement | null>(null)
const { y: scrollDistent } = useScroll(mainView)
function scrollToTop() {
  mainView.value?.scrollTo(0, 0)
}

const { RoutePathPrefixDesktop } = RouterConfig
const router = useRouter()

function toHomePage() {
  router.replace(`${RoutePathPrefixDesktop}/home`)
}

function toMissionPage() {
  router.replace(`${RoutePathPrefixDesktop}/mission`)
}
function toTrendPage() {
  router.replace(`${RoutePathPrefixDesktop}/trend`)
}
function toArticlePage() {
  router.replace(`${RoutePathPrefixDesktop}/article`)
}
function toResourcePage() {
  router.replace(`${RoutePathPrefixDesktop}/resource`)
}
function toVehiclePage() {
  router.replace(`${RoutePathPrefixDesktop}/vehicle`)
}
function toStatisticPage() {
  router.replace(`${RoutePathPrefixDesktop}/statistic`)
}

function toMinePage() {
  router.replace(`${RoutePathPrefixDesktop}/mine`)
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
    width: 1200px;
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
  box-shadow: 0 0 6px #888;
  position: absolute;
  bottom: 100px;
  right: 40px;
  &:hover {
    > i {
      color: var(--el-color-primary);
    }
  }
}
</style>