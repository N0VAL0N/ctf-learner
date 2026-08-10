<template>
  <div class="lesson-card" @click="$emit('click')">
    <div class="card-header">
      <span class="type-badge" :class="lesson.category">{{ lesson.category.toUpperCase() }}</span>
      <span v-if="completed" class="completed-badge">✅ {{ translate('lesson.completed') }}</span>
    </div>
    <h3>{{ lesson.title }}</h3>
    <p class="description">{{ getDescription() }}</p>
    <div class="card-footer">
      <span>{{ translate('lesson.tasks') }}: {{ lesson.tasks?.length || 0 }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Lesson } from '@/types/lesson'
import { useLocale } from '@/composables/useLocale'

const props = defineProps<{
  lesson: Lesson
  completed?: boolean
}>()

defineEmits<{
  (e: 'click'): void
}>()

const { translate } = useLocale()

const getDescription = () => {
  const firstBlock = props.lesson.theory?.[0]
  return firstBlock?.content?.slice(0, 100) || 'Без описания'
}
</script>

<style scoped>
.lesson-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.lesson-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  border-color: var(--accent);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.type-badge {
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}
.type-badge.ctf { background: #8b5cf6; color: white; }
.type-badge.ai { background: #06b6d4; color: white; }
.type-badge.ege { background: #f59e0b; color: white; }
.completed-badge {
  font-size: 0.7rem;
  color: var(--success);
}
h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-primary);
}
.description {
  color: var(--text-secondary);
  font-size: 0.9rem;
  flex: 1;
  margin: 0;
}
.card-footer {
  display: flex;
  justify-content: flex-end;
  font-size: 0.8rem;
  color: var(--text-muted);
  border-top: 1px solid var(--border-color);
  padding-top: 0.5rem;
}
</style>