<template>
  <div class="main-layout">
    <div class="menu-block">
      <el-menu router :default-active="route.path">
        <el-menu-item
          v-for="(item, index) in MenuList"
          :key="index"
          :index="item.path"
        >
          <el-icon>
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="content-block">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { MenuList } from '@/router/index'

const route = useRoute()

</script>

<style scoped lang="scss">
.main-layout {
  width: 100%;
  height: 100%;
  display: flex;
  .menu-block {
    width: 180px;
    height: 100vh;
    :deep(.el-menu) {
      height: 100%;
    }
  }
  .content-block {
    width: calc(100% - 180px);
    height: 100vh;
    overflow: auto;
  }
}
</style>