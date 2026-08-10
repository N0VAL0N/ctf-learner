<template>
  <div class="lesson-nav">
    <button @click="$emit('prev')" :disabled="current === 0" class="btn-secondary">
      ← {{ translate('lesson.back') }}
    </button>
    <span>{{ current + 1 }} / {{ total }}</span>
    <button @click="$emit('next')" :disabled="!canGoNext" class="btn-primary">
      {{ translate('lesson.next') }} →
    </button>
  </div>
</template>

<script setup lang="ts">
import { useLocale } from '@/composables/useLocale'
const { translate } = useLocale()

defineProps<{
  current: number
  total: number
  canGoNext: boolean
}>()

defineEmits<{
  (e: 'prev'): void
  (e: 'next'): void
}>()
</script>

<style scoped>
.lesson-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  flex-shrink: 0;
}
.lesson-nav .btn-secondary,
.lesson-nav .btn-primary {
  padding: 0.4rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.lesson-nav .btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}
.lesson-nav .btn-secondary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.lesson-nav .btn-primary {
  background: var(--accent);
  color: white;
}
.lesson-nav .btn-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.lesson-nav span {
  color: var(--text-secondary);
}
</style>