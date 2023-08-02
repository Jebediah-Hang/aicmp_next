<template>
  <div class="content-main" @scroll="contentScroll">
    <RouterView />
  </div>
  <div class="nav-bar">
    <div class="nav-item">
      <i class="fa fa-home"></i>
    </div>
    <div class="nav-item">
      <i class="fa fa-rocket"></i>
    </div>
    <div class="nav-item">
      <i class="fa fa-compass"></i>
    </div>
    <div class="nav-item">
      <i class="fa fa-cubes"></i>
    </div>
    <div class="nav-item">
      <i class="fa fa-file-text-o"></i>
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
  padding-bottom: 50px;
}
.nav-bar {
  width: 100%;
  height: 40px;
  background-color: #fff;
  border-top: rgba(0, 0, 0, 0.2) solid 1px;
  position: fixed;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .nav-item {
    width: calc((100% - 40px) / 5);
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    > i {
      color: #888;
      font-size: 26px;
    }
  }
}
</style>