<template>
  <div class="pager-box">
    <div class="left">
      <div v-show="pager.total && pager.currentPage !== 1">
        <el-button color="#306edd" @click="firstPage">
          <el-icon><el-icon-d-arrow-left /></el-icon>
          第一页
        </el-button>
        <el-button color="#306edd" @click="prevPage">
          <el-icon><el-icon-arrow-left /></el-icon>
          上一页
        </el-button>
      </div>
    </div>
    <div class="right">
      <div v-show="pager.total && pager.currentPage !== lastPageNum">
        <el-button color="#306edd" @click="nextPage">
          下一页
          <el-icon><el-icon-arrow-right /></el-icon>
        </el-button>
        <el-button color="#306edd" @click="lastPage">
          最后一页
          <el-icon><el-icon-d-arrow-right /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const pager = defineModel<ElcomPaginationPager>({
  required: true,
  default: () => ({
    total: 0,
    pageSize: 18,
    currentPage: 1
  })
});

const emits = defineEmits<{
  change: [pager: ElcomPaginationPager];
}>();

const lastPageNum = computed(() => Math.ceil(pager.value.total / pager.value.pageSize));

function prevPage() {
  pager.value.currentPage -= 1;
  emits('change', pager.value);
}
function firstPage() {
  pager.value.currentPage = 1;
  emits('change', pager.value);
}

function nextPage() {
  pager.value.currentPage += 1;
  emits('change', pager.value);
}
function lastPage() {
  pager.value.currentPage = lastPageNum.value;
  emits('change', pager.value);
}

</script>

<style lang="scss" scoped>
.pager-box {
  padding: 0 10px;
  width: 100%;
  height: 60px;
  min-width: 400px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  .el-button {
    padding: 9px 8px;
    height: 30px;
    font-size: 12px;
  }
  .left {
    .el-icon {
      margin-right: 4px;
    }
  }
  .right {
    .el-icon {
      margin-left: 4px;
    }
  }
}
</style>
