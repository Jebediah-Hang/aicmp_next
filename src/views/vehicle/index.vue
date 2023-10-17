<template>
  <div class="vehicle-page">
    <div class="vehicle-table">
      <div class="table-header">系列分类</div>
      <SeriesTable />
    </div>
    <div class="vehicle-table">
      <div class="table-header">型号列表</div>
      <ModelTable />
    </div>
  </div>
</template>

<script setup lang="ts">
import SeriesTable from './components/SeriesTable.vue'
import ModelTable from './components/ModelTable.vue'

</script>

<style scoped lang="scss">
.vehicle-page {
  width: 100%;
  height: 100%;
  display: flex;
  .vehicle-table {
    padding: 10px;
    width: 50%;
    height: 100%;
    .table-header {
      margin-bottom: 10px;
      padding: 0 20px;
      font-size: 14px;
    }
  }
}
</style>