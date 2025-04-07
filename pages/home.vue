<template>
  <NuxtPage @scrollParentPage="scrollLayoutPage" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'home'
});

const emits = defineEmits<{
  scrollLayoutPage: [];
}>();

function scrollLayoutPage() {
  emits('scrollLayoutPage');
}
</script>
