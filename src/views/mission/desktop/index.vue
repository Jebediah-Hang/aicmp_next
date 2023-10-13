<template>
  <TabHorizontal v-model="tabActive" :tab-list="tabList" />
  <MissionUpcome v-if="tabActive === 'upcome'" />
  <MissionPast v-if="tabActive === 'past'" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { type ITabItem } from '@/components/desktop/TabHorizontal.vue'
import TabHorizontal from '@/components/desktop/TabHorizontal.vue'
import MissionUpcome from './components/MissionUpcome.vue'
import MissionPast from './components/MissionPast.vue'

const tabList = ref<ITabItem[]>([
  {
    label: 'desktop.mission.upcome',
    value: 'upcome'
  },
  {
    label: 'desktop.mission.past',
    value: 'past'
  }
])

const tabActive = ref<string>('upcome')

</script>

<style scoped lang="scss">
</style>