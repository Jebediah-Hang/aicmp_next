<template>
  <div class="nav-bar">
    <div class="nav-left">
      <div class="nav-home" @click="toHomePage">
        <div class="home-logo"></div>
      </div>
      <div class="nav-item" @click="toPastPage">PAST</div>
      <div class="nav-item" @click="toUpcomePage">UPCOMING</div>
      <div class="nav-item">TREND</div>
      <div class="nav-item">FOLLOW</div>
      <div class="nav-item">RESOURCES</div>
      <div class="nav-item">ARTICLE</div>
      <div class="nav-item">VEHICLE</div>
      <div class="nav-item">OVERVIEW</div>
    </div>
    <div class="nav-right">
      <div class="lang-block">
        <el-dropdown>
          <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" width="28px" height="28px">
            <path fill="#fff" d="m18.5 10l4.4 11h-2.155l-1.201-3h-4.09l-1.199 3h-2.154L16.5 10h2zM10 2v2h6v2h-1.968a18.222 18.222 0 0 1-3.62 6.301a14.864 14.864 0 0 0 2.336 1.707l-.751 1.878A17.015 17.015 0 0 1 9 13.725a16.676 16.676 0 0 1-6.201 3.548l-.536-1.929a14.7 14.7 0 0 0 5.327-3.042A18.078 18.078 0 0 1 4.767 8h2.24A16.032 16.032 0 0 0 9 10.877a16.165 16.165 0 0 0 2.91-4.876L2 6V4h6V2h2zm7.5 10.885L16.253 16h2.492L17.5 12.885z"></path>
          </svg>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>English</el-dropdown-item>
              <el-dropdown-item>中文</el-dropdown-item>
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

const avatarUrl = ''

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