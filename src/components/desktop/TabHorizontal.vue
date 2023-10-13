<template>
  <div class="horizontal-tab-block">
    <div
      v-for="(item, index) in tabList"
      :key="index"
      :class="['tab-item', item.value === tabActive ? 'tab-actived' : '']"
      @click="tabClicked(item.value)"
    >
      {{ $t(`${item.label}`) }}
    </div>
  </div>
</template>

<script setup lang="ts">
export interface ITabItem {
  label: string,
  value: string | number
}
interface IProps {
  modelValue?: string | number,
  tabList: Array<ITabItem>
}

import { ref, computed } from 'vue'
import { checkIsNull } from '@/utils'

const props = withDefaults(defineProps<IProps>(), {
  modelValue: '',
  tabList: () => []
})
const emits = defineEmits<{
  'update:modelValue': [value: string | number],
  tabChange: [value: string | number]
}>()

const initActive = computed<string | number>(() => {
  if (!checkIsNull(props.modelValue)) {
    return props.modelValue
  } else {
    if (!checkIsNull(props.tabList[0].value)) {
      return props.tabList[0].value
    } else {
      return ''
    }
  }
})
const tabActive = ref<string | number>(initActive.value)

function tabClicked(tabValue: string | number) {
  tabActive.value = tabValue
  emits('update:modelValue', tabValue)
  emits('tabChange', tabValue)
}

</script>

<style scoped lang="scss">
.horizontal-tab-block {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  border-bottom: #ccc solid 1px;
  user-select: none;
  .tab-item {
    width: 100px;
    height: 40px;
    font-size: 14px;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
    &.tab-actived {
      position: relative;
      color: var(--el-color-primary);
      border-bottom: var(--el-color-primary) solid 2px;
    }
  }
}
</style>