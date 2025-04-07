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
      <el-form-item label="ID">
        <el-input v-model="formDatas.cosparId" />
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="formDatas.name" />
      </el-form-item>
      <el-form-item label="标记色">
        <div class="color-form-item">
          <el-input v-model="formDatas.color" />
          <el-color-picker v-model="formDatas.color" />
        </div>
      </el-form-item>
      <el-form-item label="TLE-1">
        <el-input v-model="formDatas.tleLine1" />
      </el-form-item>
      <el-form-item label="TLE-2">
        <el-input v-model="formDatas.tleLine2" />
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
import type { Satellite } from '@/types/models/satellite';

const dialogStatus = defineModel({ required: true, default: false });
const props = defineProps<{
  editData: Satellite | null;
}>();
const emits = defineEmits<{
  success: [];
}>();

const isEdit = computed(() => Boolean(props.editData));

watch(dialogStatus, (val) => {
  if (val) {
    if (isEdit.value) {
      formDatas.value = cloneDeep(<Satellite>props.editData);
    }
  } else {
    formDatas.value = {};
  }
});

const formDatas = ref<Partial<Satellite>>({});

function handleConfirm() {
  $request({
    url: '/api/service/satellite/save',
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
.color-form-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .el-input {
    width: calc(100% - 40px);
  }
}
</style>
