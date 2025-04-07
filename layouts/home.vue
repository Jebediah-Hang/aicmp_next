<template>
  <div class="home">
    <HomeNav />
    <div ref="pageContainer" class="container">
      <NuxtPage @scrollLayoutPage="scrollLayoutPage" />
    </div>
  </div>
</template>

<script setup lang="ts">
const containerElm = useTemplateRef('pageContainer');

function scrollLayoutPage() {
  containerElm.value?.scrollTo({ top: 0 });
}

</script>

<style lang="scss" scoped>
.home {
  width: 100vw;
  height: 100vh;
  .container {
    width: 100%;
    height: calc(100vh - 46px);
    overflow-y: auto;
  }
}
</style>
