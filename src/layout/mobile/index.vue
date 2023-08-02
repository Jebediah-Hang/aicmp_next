<template>
  <div class="content-main" @scroll="contentScroll">
    <RouterView />
  </div>
  <div class="nav-bar light">
    <div class="nav-item">
      <i class="fa fa-home"></i>
      <div>HOME</div>
    </div>
    <div class="nav-item">
      <i class="fa fa-rocket"></i>
      <div>MISSION</div>
    </div>
    <div class="nav-item">
      <i class="fa fa-compass"></i>
      <div>TREND</div>
    </div>
    <div class="nav-item">
      <i class="fa fa-cubes"></i>
      <div>RESOURCE</div>
    </div>
    <div class="nav-item">
      <i class="fa fa-book"></i>
      <div>ARTICLE</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'

function contentScroll(e: any) {
  console.log(e)
}
</script>

<style scoped lang="scss">
.content-main {
  padding-bottom: 70px;
}
.nav-bar {
  width: 100%;
  height: 60px;
  border-top: rgba(0, 0, 0, 0.2) solid 1px;
  position: fixed;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
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