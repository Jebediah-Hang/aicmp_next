<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLangStore } from '@/stores/lang'

const i18n = useI18n()
const { lang } = useLangStore()
i18n.locale.value = lang
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
