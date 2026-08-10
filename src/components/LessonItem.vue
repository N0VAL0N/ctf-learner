<template>
  <div 
    class="lesson-item" 
    :class="{ 
      completed: completed, 
      locked: locked,
      current: current 
    }"
    @click="!locked && $emit('click')"
  >
    <!-- ===== ЛЕВАЯ ЧАСТЬ: номер + название ===== -->
    <div class="lesson-left">
      <span class="lesson-number">{{ number }}</span>
      <span class="lesson-title">{{ title }}</span>
    </div>
    
    <!-- ===== ПРАВАЯ ЧАСТЬ: звёзды + статус ===== -->
    <div class="lesson-right">
      <span class="lesson-stars">{{ stars }}</span>
      <span v-if="completed" class="lesson-status completed">✅</span>
      <span v-else-if="locked" class="lesson-status locked">🔒</span>
      <span v-else class="lesson-status available">→</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  number: number
  title: string
  difficulty: number
  completed?: boolean
  locked?: boolean
  current?: boolean
}>()

const stars = computed(() => {
  const full = '★'.repeat(Math.min(props.difficulty, 5))
  const empty = '☆'.repeat(Math.max(0, 5 - props.difficulty))
  return full + empty
})
</script>

<style scoped>
/* ===== ОСНОВНОЙ БЛОК ===== */
.lesson-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s;
  background: var(--bg-secondary);
  border-radius: 4px;
  margin-bottom: 2px;
}
.lesson-item:hover:not(.locked) {
  background: var(--bg-hover);
  transform: translateX(4px);
}

/* ===== СОСТОЯНИЯ ===== */
.lesson-item.completed {
  border-left: 3px solid var(--success);
}
.lesson-item.locked {
  opacity: 0.6;
  cursor: not-allowed;
}
.lesson-item.current {
  border-left: 3px solid var(--accent);
  background: var(--bg-tertiary);
}

/* ===== ЛЕВАЯ ЧАСТЬ ===== */
.lesson-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.lesson-number {
  font-weight: 600;
  color: var(--text-secondary);
  min-width: 24px;
}
.lesson-title {
  color: var(--text-primary);
}

/* ===== ПРАВАЯ ЧАСТЬ ===== */
.lesson-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.lesson-stars {
  color: #f59e0b;
  letter-spacing: 1px;
}
.lesson-status {
  font-size: 1rem;
}
.lesson-status.completed { color: var(--success); }
.lesson-status.locked { color: var(--text-muted); }
.lesson-status.available { color: var(--accent); }
</style>