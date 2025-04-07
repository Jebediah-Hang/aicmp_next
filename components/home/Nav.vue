<template>
  <div class="nav">
    <div class="home-logo" @click="toMenu('/home')">
      <div class="logo-img"></div>
    </div>
    <div
      v-for="(menu, index) in menuList"
      :key="index"
      :class="{'menu-item': true, 'menu-active': currentPagePath === menu.path}"
      @click="toMenu(menu.path)"
    >
      {{ menu.name }}
    </div>
  </div>
</template>

<script setup lang="ts">

const menuList = ref([
  { name: '未来任务', path: '/home/mission-upcome' },
  { name: '历史任务', path: '/home/mission-past' },
  { name: '轨道视角', path: '/home/satellite-earth' },
  { name: '地面轨迹', path: '/home/satellite-map' },
]);

const router = useRouter();

const currentPagePath = computed(() => router.currentRoute.value.fullPath);

function toMenu(path: string) {
  router.push(path);
}

</script>

<style lang="scss" scoped>
.nav {
  padding: 0 20px;
  width: 100%;
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #333;
  user-select: none;
  .home-logo {
    width: 40px;
    height: 40px;
    padding: 4px;
    margin-right: 6px;
    cursor: pointer;
    .logo-img {
      width: 32px;
      height: 32px;
      background-image: url('/public/images/aicmp.svg');
      background-repeat: no-repeat;
      background-size: contain;
    }
  }
  .menu-item {
    margin-left: 10px;
    padding: 0 8px;
    height: 34px;
    color: #888;
    font-size: 16px;
    line-height: 34px;
    border-radius: 2px;
    cursor: pointer;
    &.menu-active {
      color: #ccc;
      background-color: #666;
    }
  }
}
</style>