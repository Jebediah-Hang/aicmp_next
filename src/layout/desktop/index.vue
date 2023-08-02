<template>
  <div class="nav-bar">
    <div class="nav-item"></div>
  </div>
  <div class="content-main">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style scoped lang="scss">
.nav-bar {
  width: 100%;
  height: 30px;
  background-color: bisque;
  position: fixed;
  top: 0;
  .nav-item {
    width: 100px;
    height: 20px;
    border: #000 solid 1px;
    background-color: antiquewhite;
  }
}
.content-main {
  padding-top: 30px;
}
</style>