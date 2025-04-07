<template>
  <el-dialog
    width="500"
    :title="isView ? '查看' : isEdit ? '编辑' : '新增'"
    v-model="dialogStatus"
  >
    <el-form
      label-suffix=":"
      label-width="60"
      :model="formDatas"
    >
      <el-form-item label="名称">
        <el-input v-model="formDatas.name" :readonly="isView" />
      </el-form-item>
      <el-form-item label="图片" class="file-form-item">
        <el-upload
          v-show="!isEdit"
          ref="uploader"
          action=""
          :limit="1"
          :multiple="false"
          :auto-upload="false"
          :on-change="onFileChange"
          :on-remove="onFileRemove"
        >
          <el-button type="primary">上传</el-button>
        </el-upload>
        <el-image
          v-show="formDatas.content"
          fit="scale-down"
          :src="formDatas.content"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div v-show="!isView">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash-es';
import type { UploadFile } from 'element-plus';
import type { Picture } from '@/types/models/picture';

const dialogStatus = defineModel({ required: true, default: false });
const props = defineProps<{
  isView: boolean;
  editData: Picture | null;
}>();
const emits = defineEmits<{
  success: [];
}>();

const isView = computed(() => props.isView);
const isEdit = computed(() => Boolean(props.editData));

watch(dialogStatus, (val) => {
  if (val) {
    if (isEdit.value) {
      formDatas.value = cloneDeep(<Picture>props.editData);
      $request<string>({
        url: '/api/service/picture/content',
        method: 'GET',
        params: {
          id: formDatas.value.id
        }
      }).then(res => {
        const { data } = res;
        formDatas.value.content = data;
      });
    }
  } else {
    formDatas.value = {};
    uploader.value?.clearFiles();
  }
});

const formDatas = ref<Partial<Picture>>({});

const uploader = useTemplateRef('uploader');
function onFileChange(file: UploadFile) {
  if (!formDatas.value.name) {
    formDatas.value.name = file.name;
  }
  readFileAsBase64(<File>file.raw).then(result => {
    formDatas.value.content = result;
  });
}
function onFileRemove() {
  formDatas.value.content = '';
}

function handleConfirm() {
  $request({
    url: '/api/service/picture/save',
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
.file-form-item {
  :deep(.el-form-item__content) {
    > div {
      width: 100%;
    }
    .el-image {
      width: 100%;
      height: 260px;
      background-size: 20px 20px;
      background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
      background-image:
        linear-gradient(45deg, #ccc 25%, transparent 25%),
        linear-gradient(-45deg, #ccc 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #ccc 75%),
        linear-gradient(-45deg, transparent 75%, #ccc 75%);
    }
  }
}
</style>
