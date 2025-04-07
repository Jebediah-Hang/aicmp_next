<template>
  <el-dialog
    width="700"
    :title="isEdit ? '编辑' : '新增'"
    v-model="dialogStatus"
  >
    <el-form
      class="edit-form"
      label-suffix=":"
      label-width="100"
      :model="formDatas"
    >
      <el-form-item label="名称">
        <el-input v-model="formDatas.name" />
      </el-form-item>
      <el-form-item label="载荷">
        <el-input v-model="formDatas.payload" />
      </el-form-item>
      <el-form-item label="目标轨道">
        <el-select v-model="formDatas.targetOrbit" filterable>
          <el-option
            v-for="(item, index) in orbitListDic"
            :key="index"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="客户">
        <el-select v-model="formDatas.customer" filterable allow-create>
          <el-option
            v-for="(item, index) in agencyListDic"
            :key="index"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务状态">
        <el-radio-group v-model="formDatas.status">
          <el-radio
            v-for="(label, value) in missionStatusDict"
            :key="value"
            :value="Number(value)"
            :label="label"
          />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="发射载具">
        <el-select v-model="formDatas.vehicleId" filterable>
          <el-option
            v-for="(item, index) in vehicleListDic"
            :key="index"
            :value="item.id"
            :label="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发射场">
        <el-select v-model="formDatas.launchSite" filterable>
          <el-option
            v-for="(item, index) in siteListDic"
            :key="index"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务时间">
        <el-date-picker
          v-model="formDatas.launchTime"
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="详细信息">
        <el-input type="textarea" v-model="formDatas.description" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="formDatas.remarks" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash-es';
import type { Mission } from '@/types/models/mission';
import type { VehicleItem } from '@/types/models/vehicle';
import type { DictItem, DictCate } from '@/types/models/dictionary';

const dialogStatus = defineModel({ required: true, default: false });
const props = defineProps<{
  editData: Mission | null;
}>();
const emits = defineEmits<{
  success: [];
}>();

const isEdit = computed(() => Boolean(props.editData));

watch(dialogStatus, (val) => {
  if (val) {
    getOrbitList();
    getAgencyList();
    getSiteList();
    getVehicleList();
    if (isEdit.value) {
      formDatas.value = cloneDeep(<Mission>props.editData);
    }
  } else {
    formDatas.value = {};
  }
});

const formDatas = ref<Partial<Mission>>({});

const orbitListDic = ref<Array<DictItem>>([]);
function getOrbitList() {
  const queryParams: DictCate = {
    category: 'target_orbit'
  };
  $request<Array<DictItem>>({
    url: '/api/service/dictionary/dict/list',
    method: 'GET',
    params: queryParams
  }).then(res => {
    const { code, data } = res;
    if (code === 200 && Array.isArray(data)) {
      orbitListDic.value = data;
    }
  });
}

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

const siteListDic = ref<Array<DictItem>>([]);
function getSiteList() {
  const queryParams: DictCate = {
    category: 'launch_site'
  };
  $request<Array<DictItem>>({
    url: '/api/service/dictionary/dict/list',
    method: 'GET',
    params: queryParams
  }).then(res => {
    const { code, data } = res;
    if (code === 200 && Array.isArray(data)) {
      siteListDic.value = data;
    }
  });
}

const vehicleListDic = ref<Array<VehicleItem>>([]);
function getVehicleList() {
  $request<Array<VehicleItem>>({
    url: '/api/service/vehicle/list',
    method: 'GET'
  }).then(res => {
    const { code, data } = res;
    if (code === 200 && Array.isArray(data)) {
      vehicleListDic.value = data;
    }
  });
}

function handleConfirm() {
  $request({
    url: '/api/service/mission/save',
    method: 'POST',
    body: formDatas.value
  }).then(res => {
    if (res.code === 200) {
      ElMessage.success('操作成功');
      emits('success');
      handleClose();
    }
  });
}
function handleClose() {
  dialogStatus.value = false;
}
</script>

<style lang="scss" scoped>
.edit-form {
  :deep(.el-date-editor) {
    width: 100%;
  }
}
</style>
