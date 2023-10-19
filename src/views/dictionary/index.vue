<template>
  <div class="dictionary-page">
    <div class="dictionary-table">
      <div class="table-header">字段分类</div>
      <SeriesTable />
    </div>
    <div class="dictionary-table">
      <div class="table-header">字段列表</div>
      <FieldTable />
    </div>
  </div>
</template>

<script setup lang="ts">
import SeriesTable from './components/SeriesTable.vue'
import FieldTable from './components/FieldTable.vue'

</script>

<style scoped lang="scss">
.dictionary-page {
  width: 100%;
  height: 100%;
  display: flex;
  .dictionary-table {
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