<template>
  <div class="content-main">
    <RouterView />
  </div>
  <div class="nav-bar">
    <div class="nav-item"></div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style scoped lang="scss">
.content-main {
  padding-bottom: 30px;
}
.nav-bar {
  width: 100%;
  height: 30px;
  background-color: bisque;
  position: fixed;
  bottom: 0;
  .nav-item {
    width: 100px;
    height: 20px;
    border: #000 solid 1px;
    background-color: antiquewhite;
  }
}
</style>