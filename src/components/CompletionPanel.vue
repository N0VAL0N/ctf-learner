<template>
  <div class="completion-section">
    <h2>🎉 {{ translate('lesson.completed_title') }}</h2>
    <p>{{ translate('lesson.completed_message') }}</p>
    <button @click="$emit('finish')" class="btn-success">{{ translate('lesson.finish') }}</button>
  </div>
</template>

<script setup lang="ts">
import { useLocale } from '@/composables/useLocale'
const { translate } = useLocale()
defineEmits<{ (e: 'finish'): void }>()
</script>

<style scoped>
.completion-section {
  text-align: center;
  padding: 2rem;
}
.completion-section h2 {
  color: var(--text-primary);
}
.btn-success {
  padding: 0.6rem 1.5rem;
  background: var(--success);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.btn-success:hover {
  filter: brightness(0.9);
}
</style>