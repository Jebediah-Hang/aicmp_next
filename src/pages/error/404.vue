<template>
  <div class="err-page">
    <div class="err-block">
      <div class="err-image"></div>
      <div class="err-text">
        <div class="err-code">404</div>
        <div class="err-desc">页面不见了</div>
        <el-button @click="goBackHome">回到首页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
function goBackHome() {
  router.replace('/')
}
</script>

<style scoped lang="scss">
.err-page {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .err-block {
    width: 700px;
    height: 320px;
    display: flex;
    .err-image {
      width: 400px;
      height: 320px;
      margin-right: 100px;
      background-image: url(../../assets/404.svg);
      background-size: contain;
    }
    .err-text {
      color: #888;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: space-around;
      .err-code {
        font-size: 60px;
      }
      .err-desc {
        font-size: 24px;
      }
    }
  }
}
</style>