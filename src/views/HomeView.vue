<template>
  <div class="home">
    <h1>{{ translate('home.welcome') }}</h1>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{{ progress.totalLessonsCompleted }}</div>
        <div class="stat-label">{{ translate('home.lessons_completed') }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ progress.totalTasksSolved }}</div>
        <div class="stat-label">{{ translate('home.tasks_solved') }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ totalLinesOfCode }}</div>
        <div class="stat-label">{{ translate('home.lines_of_code') }}</div>
      </div>
    </div>
    <div class="progress-section">
      <h2>{{ translate('home.progress') }}</h2>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: percent + '%' }"></div>
      </div>
      <span>{{ percent }}%</span>
    </div>
    <div class="quick-actions">
      <router-link to="/lessons" class="btn-primary">{{ translate('home.go_to_lessons') }}</router-link>
      <router-link to="/practice" class="btn-secondary">{{ translate('home.go_to_practice') }}</router-link>
      <router-link to="/compiler" class="btn-secondary">{{ translate('home.open_compiler') }}</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useProgressStore } from '@/stores/progress'
import { useLocale } from '@/composables/useLocale'
import lessonsCTF from '@/data/lessons_ctf.json'
import lessonsEGE from '@/data/lessons_ege.json'
import lessonsAI from '@/data/lessons_ai.json'
import type { Lesson } from '@/types/lesson'

const progress = useProgressStore()
const { translate } = useLocale()

const allLessons = [...lessonsCTF, ...lessonsEGE, ...lessonsAI] as Lesson[]
const totalLessons = allLessons.length

const totalLinesOfCode = computed(() => {
  let lines = 0
  for (const lesson of allLessons) {
    // Считаем строки в задачах
    for (const task of lesson.tasks || []) {
      if (task.code) lines += task.code.split('\n').length
      if (task.starter_code) lines += task.starter_code.split('\n').length
      if (task.code_snippet) lines += task.code_snippet.split('\n').length
    }
    // Считаем строки в примерах (теперь это объекты с полем code)
    for (const example of lesson.examples || []) {
      if (example.code) lines += example.code.split('\n').length
    }
    // Считаем строки в теории
    for (const block of lesson.theory || []) {
      if (block.code) lines += block.code.split('\n').length
    }
  }
  return lines
})

const percent = computed(() => {
  if (totalLessons === 0) return 0
  return Math.round((progress.totalLessonsCompleted / totalLessons) * 100)
})

onMounted(() => {
  progress.load()
})
</script>

<style scoped>
.home {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
  background: var(--bg-primary);
}
h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: var(--text-primary);
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}
.stat-card {
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  border: 1px solid var(--border-color);
}
.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--accent);
}
.stat-label {
  color: var(--text-secondary);
  margin-top: 0.5rem;
}
.progress-section {
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  margin-bottom: 2rem;
}
.progress-section h2 {
  margin-top: 0;
  font-size: 1.2rem;
  color: var(--text-primary);
}
.progress-bar {
  height: 10px;
  background: var(--bg-tertiary);
  border-radius: 5px;
  overflow: hidden;
  margin: 0.5rem 0;
}
.progress-fill {
  height: 100%;
  background: var(--accent);
  transition: width 0.5s;
}
.quick-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
.btn-primary,
.btn-secondary {
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
  display: inline-block;
  flex: 0 1 auto;
}
.btn-primary {
  background: var(--accent);
  color: white;
}
.btn-primary:hover {
  filter: brightness(1.1);
}
.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}
.btn-secondary:hover {
  background: var(--bg-hover);
}
</style>