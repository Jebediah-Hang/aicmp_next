<template>
  <div class="nav-bar">
    <div class="nav-left">
      <div class="nav-home" @click="toHomePage">
        <div class="home-logo"></div>
      </div>
      <div
        class="nav-item"
        @click="toPastPage"
      >
        {{ $t('desktop.menu.past') }}
      </div>
      <div
        class="nav-item"
        @click="toUpcomePage"
      >
        {{ $t('desktop.menu.upcoming') }}
      </div>
      <div
        class="nav-item"
        @click="toTrendPage"
      >
        {{ $t('desktop.menu.trend') }}
      </div>
      <div
        @click="toFollowPage"
        class="nav-item"
      >
        {{ $t('desktop.menu.follow') }}
      </div>
      <div
        class="nav-item"
        @click="toArticlePage"
      >
        {{ $t('desktop.menu.article') }}
      </div>
      <div
        class="nav-item"
        @click="toResourcesPage"
      >
        {{ $t('desktop.menu.resources') }}
      </div>
      <div
        class="nav-item"
        @click="toVehiclePage"
      >
        {{ $t('desktop.menu.vehicle') }}
      </div>
      <div
        class="nav-item"
        @click="toOverviewPage"
      >
        {{ $t('desktop.menu.overview') }}
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
      <div
        class="person-block"
        @click="toMinePage"
      >
        <i class="fa fa-user-circle-o"></i>
      </div>
    </div>
  </div>
  <div class="content-main">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLangStore } from '@/stores/common'
import { desktopRoutePrefix } from '@/config'

const router = useRouter()

function toHomePage() {
  router.replace(`${desktopRoutePrefix}/home`)
}
function toPastPage() {
  router.replace(`${desktopRoutePrefix}/past`)
}
function toUpcomePage() {
  router.replace(`${desktopRoutePrefix}/upcoming`)
}
function toTrendPage() {
  router.replace(`${desktopRoutePrefix}/trend`)
}
function toFollowPage() {
  router.replace(`${desktopRoutePrefix}/follow`)
}
function toArticlePage() {
  router.replace(`${desktopRoutePrefix}/article`)
}
function toResourcesPage() {
  router.replace(`${desktopRoutePrefix}/resources`)
}
function toVehiclePage() {
  router.replace(`${desktopRoutePrefix}/vehicle`)
}
function toOverviewPage() {
  router.replace(`${desktopRoutePrefix}/overview`)
}
function toMinePage() {
  router.replace(`${desktopRoutePrefix}/mine`)
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
  position: fixed;
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
  padding-top: 64px;
}
</style>