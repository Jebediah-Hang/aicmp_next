<template>
  <div class="nav-bar">
    <div class="nav-left">
      <div class="nav-home" @click="toHomePage">
        <div class="home-logo"></div>
      </div>
      <div class="nav-item" @click="toPastPage">{{ $t('desktop.menu.past') }}</div>
      <div class="nav-item" @click="toUpcomePage">{{ $t('desktop.menu.upcoming') }}</div>
      <div class="nav-item">{{ $t('desktop.menu.trend') }}</div>
      <div class="nav-item">{{ $t('desktop.menu.follow') }}</div>
      <div class="nav-item">{{ $t('desktop.menu.resources') }}</div>
      <div class="nav-item">{{ $t('desktop.menu.article') }}</div>
      <div class="nav-item">{{ $t('desktop.menu.vehicle') }}</div>
      <div class="nav-item">{{ $t('desktop.menu.overview') }}</div>
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
      <div class="person-block">
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
import { useLangStore } from '@/stores/lang'

const router = useRouter()

function toHomePage() {
  router.push('/aicmp/desktop/home')
}
function toPastPage() {
  router.push('/aicmp/desktop/past')
}
function toUpcomePage() {
  router.push('/aicmp/desktop/upcoming')
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
        // background-image: url(../../assets/aicmp.png);
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