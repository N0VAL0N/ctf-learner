<template>
  <svg class="svg-icon" viewBox="0 0 24 24" :width="size" :height="size" :fill="fill">
    <use :href="`/assets/icons/${name}.svg#icon`" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  size?: string | number
  fill?: string
}>()
</script>

<style scoped>
.svg-icon {
  display: inline-block;
  flex-shrink: 0;
  transition: fill 0.2s;
}
</style>