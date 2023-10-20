<template>
  <div>PAST MISSION</div>
  <el-date-picker
    v-model="selectedTime"
    type="datetime"
  />
  <el-pagination
    :total="100"
    :page-size="10"
    :current-page="1"
    :page-sizes="[10, 20, 30, 50, 100]"
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedTime = ref<any>()

function handleSizeChange() {}
function handleCurrentChange() {}
</script>

<style scoped lang="scss">
</style>