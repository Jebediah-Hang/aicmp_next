<template>
  <div class="login-page">
    <svg
      class="page-bg"
      viewBox="0 0 1440 320"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#0099FF"
        fill-opacity="1"
        d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      />
    </svg>
    <div class="login-card">
      <div class="login-title">登 录</div>
      <el-input
        v-model="username"
        class="login-input"
        placeholder="手机号/邮箱"
      >
        <template #prefix>
          <el-icon><User /></el-icon>
        </template>
      </el-input>
      <el-input
        v-model="password"
        class="login-input"
        placeholder="密码"
        type="password"
        show-password
      >
        <template #prefix>
          <el-icon><Key /></el-icon>
        </template>
      </el-input>
      <el-button
        round
        color="#0066ff"
        class="login-btn"
        @click="handleLogin"
      >
        登 录
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref<string>('')
const password = ref<string>('')

const router = useRouter()
function handleLogin() {
  router.replace('/management')
}

</script>

<style scoped lang="scss">
.login-page {
  width: 100%;
  height: 100vh;
  position: relative;
  background-color: #F0F6F6;
  display: flex;
  align-items: center;
  justify-content: center;
  .page-bg {
    position: absolute;
    width: 100%;
    z-index: 0;
    bottom: 0;
  }
  .login-card {
    width: 500px;
    height: 380px;
    padding: 30px;
    text-align: center;
    border-radius: 30px;
    margin-bottom: 100px;
    background-color: #FFF;
    box-shadow: 0 0 1px #3399ff;
    position: absolute;
    z-index: 1;
    .login-title {
      margin-bottom: 80px;
      font-size: 28px;
      user-select: none;
      text-transform: uppercase;
      text-shadow: 1px 1px 1px rgba(16, 16, 16, 0.1), 1px 2px 1px rgba(16, 16, 16, 0.1), 1px 3px 1px rgba(16, 16, 16, 0.1), 1px 4px 1px rgba(16, 16, 16, 0.1), 1px 5px 1px rgba(16, 16, 16, 0.1), 1px 6px 1px rgba(16, 16, 16, 0.1), 1px 7px 1px rgba(16, 16, 16, 0.1), 1px 8px 1px rgba(16, 16, 16, 0.1);
    }
    .login-input {
      padding: 0 30px;
      margin-bottom: 30px;
    }
    .login-btn {
      width: 100px;
      margin-top: 20px;
    }
  }
}
</style>