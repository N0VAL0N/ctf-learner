<template>
  <div class="lesson-detail" v-if="lesson">
    <button @click="router.back()" class="back-btn">← {{ translate('lesson.back') }}</button>
    <h1>{{ lesson.title }}</h1>
    <span class="category-badge" :class="lesson.category">{{ lesson.category.toUpperCase() }}</span>
    <span class="difficulty-stars">{{ getStars(lesson.difficulty || 1) }}</span>

    <div class="page-indicator">
      <span v-for="(_, idx) in totalPages" :key="idx"
        class="dot" :class="{ active: currentPage === idx }"
        @click="currentPage = idx"
      ></span>
    </div>

    <div class="page-content">
      <!-- Теория -->
      <TheoryPanel
        v-if="currentPage === 0"
        :blocks="theoryBlocks"
        :examples="lesson.examples"
      />

      <!-- Задания (постранично) -->
      <TaskPanel
        v-else-if="currentPage >= 1 && currentPage <= lesson.tasks.length"
        :task="lesson.tasks[currentPage - 1]"
        :taskIndex="currentPage - 1"
        :total="lesson.tasks.length"
        :initialResult="taskResults[currentPage - 1]"
        :initialAnswer="insertAnswers[currentPage - 1]"
        @solved="onTaskSolved"
        @openCompiler="openCompiler"
      />

      <!-- Завершение -->
      <CompletionPanel
        v-else-if="currentPage === totalPages.length - 1"
        @finish="completeLesson"
      />
    </div>

    <CompilerSlider
      v-model:isOpen="isCompilerOpen"
      :initialCode="compilerInitialCode"
    />

    <LessonNavigation
      :current="currentPage"
      :total="totalPages.length"
      :canGoNext="canGoNext"
      @prev="prevPage"
      @next="nextPage"
    />
  </div>
  <div v-else class="not-found">{{ translate('lesson.not_found') }}</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProgressStore } from '@/stores/progress'
import { useLocale } from '@/composables/useLocale'
import lessonsCTF from '@/data/lessons_ctf.json'
import lessonsEGE from '@/data/lessons_ege.json'
import lessonsAI from '@/data/lessons_ai.json'
import { getTopicById } from '@/utils/library'
import type { Lesson, LessonCategory } from '@/types/lesson'
import TheoryPanel from '@/components/TheoryPanel.vue'
import TaskPanel from '@/components/TaskPanel.vue'
import CompletionPanel from '@/components/CompletionPanel.vue'
import CompilerSlider from '@/components/CompilerSlider.vue'
import LessonNavigation from '@/components/LessonNavigation.vue'

const router = useRouter()
const route = useRoute()
const progress = useProgressStore()
const { translate } = useLocale()

const allLessons = [...lessonsCTF, ...lessonsEGE, ...lessonsAI] as Lesson[]
const lesson = ref<Lesson | null>(null)
const currentPage = ref(0)

const taskResults = ref<Record<number, { passed: boolean; message: string }>>({})
const insertAnswers = ref<Record<number, string>>({})
const isCompilerOpen = ref(false)
const compilerInitialCode = ref('# Напишите код здесь')

const theoryBlocks = computed(() => {
  if (!lesson.value) return []
  const refs = lesson.value.theory_refs || []
  const blocks: any[] = []
  for (const ref of refs) {
    const topic = getTopicById(ref)
    if (topic) blocks.push(...topic.theory)
  }
  if (blocks.length === 0 && lesson.value.theory) {
    blocks.push(...lesson.value.theory)
  }
  return blocks
})

const totalPages = computed(() => {
  if (!lesson.value) return [0]
  const pages = [0]
  for (const _ of lesson.value.tasks || []) pages.push(1)
  pages.push(2) // завершение
  return pages
})

const canGoNext = computed(() => {
  if (!lesson.value) return false
  if (currentPage.value === 0) return true
  if (currentPage.value === totalPages.value.length - 1) return false
  const taskIdx = currentPage.value - 1
  const task = lesson.value.tasks?.[taskIdx]
  if (!task) return false
  return !!taskResults.value[taskIdx]?.passed
})

const getStars = (level: number) => '★'.repeat(level) + '☆'.repeat(5 - level)

const nextPage = () => {
  if (currentPage.value < totalPages.value.length - 1 && canGoNext.value) {
    currentPage.value++
  }
}
const prevPage = () => {
  if (currentPage.value > 0) currentPage.value--
}

const onTaskSolved = (_taskIndex: number) => {
  saveState()
}

const openCompiler = () => {
  isCompilerOpen.value = true
  const task = lesson.value?.tasks?.[currentPage.value - 1]
  if (task?.starter_code) compilerInitialCode.value = task.starter_code
}

const completeLesson = () => {
  if (lesson.value) {
    progress.completeLesson(lesson.value.id)
    router.push('/lessons')
  }
}

const saveState = () => {
  if (!lesson.value) return
  const state = {
    currentPage: currentPage.value,
    taskResults: taskResults.value,
    insertAnswers: insertAnswers.value
  }
  localStorage.setItem(`lesson_${lesson.value.id}_state`, JSON.stringify(state))
}

const loadState = () => {
  if (!lesson.value) return
  const saved = localStorage.getItem(`lesson_${lesson.value.id}_state`)
  if (saved) {
    try {
      const state = JSON.parse(saved)
      currentPage.value = state.currentPage || 0
      taskResults.value = state.taskResults || {}
      insertAnswers.value = state.insertAnswers || {}
    } catch (e) {}
  }
}

onMounted(() => {
  const id = route.params.id as string
  const found = allLessons.find((l: any) => l.id === id)
  if (found) {
    lesson.value = { ...found, category: found.category as LessonCategory } as Lesson
    loadState()
  }
  progress.load()
})

watch([currentPage, taskResults, insertAnswers], saveState, { deep: true })
</script>

<style scoped>
.lesson-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background: var(--bg-primary);
  overflow: hidden;
}
.back-btn {
  background: none;
  border: none;
  color: var(--accent);
  cursor: pointer;
  font-size: 1rem;
  align-self: flex-start;
}
h1 {
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}
.category-badge {
  display: inline-block;
  padding: 0.2rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-right: 0.5rem;
}
.category-badge.ctf { background: #8b5cf6; color: white; }
.category-badge.ege { background: #f59e0b; color: white; }
.category-badge.ai { background: #06b6d4; color: white; }
.difficulty-stars {
  color: #f59e0b;
  letter-spacing: 2px;
}
.page-indicator {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
  flex-shrink: 0;
}
.page-indicator .dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: var(--bg-tertiary);
  cursor: pointer;
}
.page-indicator .dot.active {
  background: var(--accent);
}
.page-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}
.page-content::-webkit-scrollbar {
  width: 4px;
}
.page-content::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}
.not-found {
  color: var(--text-secondary);
  padding: 2rem;
  text-align: center;
}
</style>