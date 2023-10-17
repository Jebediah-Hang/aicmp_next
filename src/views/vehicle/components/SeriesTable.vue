<template>
  <avue-crud
    :data="data"
    :option="option"
    :table-loading="loading"
    v-model:page="page"
    v-model:search="search"
    @selection-change="selectionChange"
    @search-change="searchChange"
    @search-reset="searchReset"
    @refresh-change="onLoad"
    @on-load="onLoad"
  >
  </avue-crud>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const data = ref<Array<any>>([])
const selectionList = ref<Array<any>>([])
const loading = ref(false)
const search = ref({})
const page = ref({
  total: 100,
  pageSize: 10,
  currentPage: 1,
  pagerCount: 5,
  layout: 'total, prev, pager, next'
})
const option = ref({
  addBtn: false,
  // delBtn: false,
  // editBtn: false,
  // viewBtn: false,
  tip: false,
  selection: true,
  index: true,
  indexLabel: '序号',
  indexWidth: 60,
  searchSpan: 12,
  searchMenuSpan: 12,
  searchMenuPosition: 'right',
  column: [
    {
      label: '名称',
      prop: 'name',
      search: true
    }
  ]
})
function searchChange(form: any, done: Function) {
  page.value.currentPage = 1
  onLoad()
  done()
}
function searchReset() {
  page.value.currentPage = 1
  onLoad()
}
function selectionChange(list: Array<any>) {
  selectionList.value = list
  console.log(selectionList.value)
}
function onLoad() {
  console.log('On Load !! ', page.value, search.value)
  data.value = [{ id: '111', name: 'aaa' }, { id: '222', name: 'bbb' }]
}

</script>

<style scoped lang="scss">
</style>