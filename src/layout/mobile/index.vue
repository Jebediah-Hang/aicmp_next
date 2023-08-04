<template>
  <div
    class="main-header"
    :style="{ height: `${!isHomePage && isShowHeader ? 40 : 0}px`}"
  >
    {{ isShowHeader }}
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
      <div>HOME</div>
    </div>
    <div
      class="nav-item"
      @click="toMissionPage"
    >
      <i class="fa fa-rocket"></i>
      <div>MISSION</div>
    </div>
    <div
      class="nav-item"
      @click="toTrendPage"
    >
      <i class="fa fa-compass"></i>
      <div>TREND</div>
    </div>
    <div
      class="nav-item"
      @click="toResourcePage"
    >
      <i class="fa fa-cubes"></i>
      <div>RESOURCE</div>
    </div>
    <div
      class="nav-item"
      @click="toArticlePage"
    >
      <i class="fa fa-book"></i>
      <div>ARTICLE</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch, computed } from 'vue'
import { RouterView, useRouter, useRoute } from 'vue-router'
import { useScroll } from '@vueuse/core'

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
</script>

<style scoped lang="scss">
.main-header {
  width: 100%;
  overflow: hidden;
  border-bottom: rgba(0, 0, 0, 0.2) solid 1px;
  transition: all linear .2s;
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