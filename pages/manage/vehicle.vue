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
          <el-form-item label="开发商">
            <el-select v-model="searchForm.developers" clearable>
              <el-option
                v-for="(item, inedx) in agencyListDic"
                :key="inedx"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
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
        >
          <template v-if="prop === 'status'" #default="{ row }: { row: Vehicle }">
            <el-tag
              effect="dark"
              disable-transitions
              :type="vehicleStatusTags[row.status]"
            >
              {{ vehicleStatusDict[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
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
  <ManageVehicleEditor
    v-model="editDialog"
    :edit-data="editData"
    @success="getTableData"
  />
</template>

<script setup lang="ts">
import type { TagProps } from 'element-plus';
import type { Vehicle } from '@/types/models/vehicle';
import type { DictCate, DictItem } from '@/types/models/dictionary';

const vehicleStatusTags = ref<Record<number, TagProps['type']>>({
  0: 'warning',
  1: 'primary',
  2: 'info'
});

const agencyListDic = ref<Array<DictItem>>([]);
function getAgencyList() {
  const queryParams: DictCate = {
    category: 'space_agency'
  };
  $request<Array<DictItem>>({
    url: '/api/service/dictionary/dict/list',
    method: 'GET',
    params: queryParams
  }).then(res => {
    const { code, data } = res;
    if (code === 200 && Array.isArray(data)) {
      agencyListDic.value = data;
    }
  });
}

const searchForm = ref<Partial<Vehicle>>({});
function handleSearch() {
  pager.value.currentPage = 1;
  getTableData();
}
function clearSearch() {
  searchForm.value = {};
  pager.value.currentPage = 1;
  getTableData();
}

const tableColumn = ref<ElcomTableColumnConfig<Vehicle>>({
  name: '名称',
  developers: '开发商',
  status: '状态'
});
const pager = ref<ElcomPaginationPager>({
  total: 0,
  pageSize: 10,
  currentPage: 1
});

const tableData = ref<Array<Vehicle>>([]);
function getTableData() {
  const queryParams: ApiPageQuery<Vehicle> = {
    current: pager.value.currentPage,
    size: pager.value.pageSize,
    ...searchForm.value
  };
  $request<ApiPageList<Vehicle>>({
    url: '/api/service/vehicle/page',
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

const selectionList = ref<Array<Vehicle>>([]);
function onSelectionChange(list: Array<Vehicle>) {
  selectionList.value = list;
}

const editData = ref<Vehicle | null>(null);
const editDialog = ref(false);
function handleAdd() {
  editData.value = null;
  editDialog.value = true;
}
function handleEdit(row: Vehicle) {
  editData.value = row;
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
      url: '/api/service/vehicle/delete',
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
  getAgencyList();
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
