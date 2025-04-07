<template>
  <div class="manage-page">
    <div class="table">
      <div class="table-search">
        <el-form
          label-width="100"
          :inline="true"
          :model="searchForm"
          @submit.prevent="handleSearch"
        >
          <el-form-item label="名称">
            <el-input v-model="searchForm.name" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="clearSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-menu">
        <el-button @click="handleAdd">添加</el-button>
        <el-button :disabled="!selectionList.length" @click="batchDelete">删除</el-button>
        <el-button @click="getTableData">刷新</el-button>
      </div>
      <el-table
        :data="tableData"
        @selection-change="onSelectionChange"
      >
        <el-table-column type="selection" width="60" />
        <el-table-column
          v-for="(label, prop) in tableColumn"
          :prop="prop"
          :label="label"
        ></el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">查看</el-button>
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <ElcomPagination
        v-model="pager"
        @change="getTableData"
      />
    </div>
  </div>
  <ManagePictureEditor
    v-model="editDialog"
    :is-view="viewDialog"
    :edit-data="editData"
    @success="getTableData"
  />
</template>

<script setup lang="ts">
import type { Picture } from '@/types/models/picture';

const searchForm = ref<Partial<Picture>>({});
function handleSearch() {
  pager.value.currentPage = 1;
  getTableData();
}
function clearSearch() {
  searchForm.value = {};
  pager.value.currentPage = 1;
  getTableData();
}

const tableColumn = ref<ElcomTableColumnConfig<Picture>>({
  name: '名称'
});
const pager = ref<ElcomPaginationPager>({
  total: 0,
  pageSize: 10,
  currentPage: 1
});

const tableData = ref<Array<Picture>>([]);
function getTableData() {
  const queryParams: ApiPageQuery<Picture> = {
    current: pager.value.currentPage,
    size: pager.value.pageSize,
    ...searchForm.value
  };
  $request<ApiPageList<Picture>>({
    url: '/api/service/picture/page',
    method: 'GET',
    params: queryParams
  }).then(res => {
    const { code, data } = res;
    if (code === 200 && data) {
      tableData.value = data.list;
      pager.value.total = data.total;
    }
  })
}

const selectionList = ref<Array<Picture>>([]);
function onSelectionChange(list: Array<Picture>) {
  selectionList.value = list;
}

const editData = ref<Picture | null>(null);
const viewDialog = ref(false);
const editDialog = ref(false);
function handleAdd() {
  editData.value = null;
  viewDialog.value = false;
  editDialog.value = true;
}
function handleEdit(row: Picture) {
  editData.value = row;
  viewDialog.value = false;
  editDialog.value = true;
}
function handleView(row: Picture) {
  editData.value = row;
  viewDialog.value = true;
  editDialog.value = true;
}

function batchDelete() {
  const ids = selectionList.value.map(item => item.id);
  handleDelete(ids.join(','));
}
function handleDelete(ids: string) {
  ElMessageBox.confirm('确定删除？', '提示', {
    type: 'warning',
    cancelButtonText: '取消',
    confirmButtonText: '确定'
  }).then(() => {
    $request({
      url: '/api/service/picture/delete',
      method: 'GET',
      params: { ids }
    }).then(res => {
      if (res.code === 200) {
        ElMessage.success('操作成功');
        getTableData();
      }
    });
  }).catch(() => {});
}

onMounted(() => {
  getTableData();
})
</script>

<style lang="scss" scoped>
.manage-page {
  padding: 10px;
  width: 100%;
  min-height: 100%;
  border-radius: 4px;
  background-color: #fff;
  .table {
    width: 100%;
    .table-search {
      width: 100%;
      :deep(.el-form--inline) {
        > .el-form-item {
          width: calc(100% / 3);
          margin-right: 0;
          &:last-of-type {
            width: calc((100% / 3) * 2);
            .el-form-item__content {
              justify-content: flex-end;
            }
          }
        }
      }
    }
    .table-menu {
      width: 100%;
      margin-bottom: 10px;
    }
  }
}
</style>
