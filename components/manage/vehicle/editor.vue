<template>
  <el-dialog
    width="700"
    :title="isEdit ? '编辑' : '新增'"
    v-model="dialogStatus"
  >
    <el-form
      label-suffix=":"
      label-width="100"
      :model="formDatas"
    >
      <el-form-item label="名称">
        <el-input v-model="formDatas.name" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="formDatas.status">
          <el-radio
            v-for="(label, value) in vehicleStatusDict"
            :key="value"
            :value="Number(value)"
            :label="label"
          />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="开发商">
        <el-select v-model="formDatas.developers">
          <el-option
            v-for="(item, index) in agencyListDic"
            :key="index"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="图片">
        <el-select v-model="formDatas.photoId">
          <el-option
            v-for="(item, index) in photoListDic"
            :key="index"
            :value="item.id"
            :label="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="高度(m)">
        <el-input v-model="formDatas.height" />
      </el-form-item>
      <el-form-item label="直径(m)">
        <el-input v-model="formDatas.diameter" />
      </el-form-item>
      <el-form-item label="重量(t)">
        <el-input v-model="formDatas.weight" />
      </el-form-item>
      <el-form-item label="推力(kN)">
        <el-input v-model="formDatas.thrust" />
      </el-form-item>
      <el-form-item label="LEO载荷(kg)">
        <el-input v-model="formDatas.leoPayload" />
      </el-form-item>
      <el-form-item label="GTO载荷(kg)">
        <el-input v-model="formDatas.gtoPayload" />
      </el-form-item>
      <el-form-item label="详细信息">
        <el-input type="textarea" v-model="formDatas.description" />
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
import type { Vehicle } from '@/types/models/vehicle';
import type { PictureItem } from '@/types/models/picture';
import type { DictItem, DictCate } from '@/types/models/dictionary';

const dialogStatus = defineModel({ required: true, default: false });
const props = defineProps<{
  editData: Vehicle | null;
}>();
const emits = defineEmits<{
  success: [];
}>();

const isEdit = computed(() => Boolean(props.editData));

watch(dialogStatus, (val) => {
  if (val) {
    getAgencyList();
    getPhotoList();
    if (isEdit.value) {
      formDatas.value = cloneDeep(<Vehicle>props.editData);
    }
  } else {
    formDatas.value = {};
  }
});

const formDatas = ref<Partial<Vehicle>>({});

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

const photoListDic = ref<Array<PictureItem>>([]);
function getPhotoList() {
  $request<Array<PictureItem>>({
    url: '/api/service/picture/list',
    method: 'GET'
  }).then(res => {
    const { code, data } = res;
    if (code === 200 && Array.isArray(data)) {
      photoListDic.value = data;
    }
  });
}

function handleConfirm() {
  $request({
    url: '/api/service/vehicle/save',
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
</style>
