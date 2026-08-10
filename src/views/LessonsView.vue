<template>
  <div class="lessons">
    <!-- ===== ЗАГОЛОВОК ===== -->
    <h1>{{ translate('lessons.title') }}</h1>
    
    <!-- ===== ВКЛАДКИ КАТЕГОРИЙ ===== -->
    <div class="category-tabs">
      <button 
        v-for="cat in categories" 
        :key="cat"
        :class="{ active: currentCategory === cat }"
        @click="currentCategory = cat"
      >
        {{ cat.toUpperCase() }}
      </button>
    </div>

    <!-- ===== ПОИСК ===== -->
    <SearchBar v-model="searchQuery" />
    
    <!-- ===== ЛИНЕЙНЫЙ СПИСОК УРОКОВ ===== -->
    <div class="lessons-list">
      <LessonItem
        v-for="(lesson, idx) in displayedLessons"
        :key="lesson.id"
        :number="idx + 1"
        :title="lesson.title"
        :difficulty="lesson.difficulty || 1"
        :completed="progress.isLessonCompleted(lesson.id)"
        :locked="!isLessonUnlocked(lesson.id)"
        :current="currentLessonId === lesson.id"
        @click="goToLesson(lesson.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProgressStore } from '@/stores/progress'
import { useLocale } from '@/composables/useLocale'
import lessonsCTF from '@/data/lessons_ctf.json'
import lessonsEGE from '@/data/lessons_ege.json'
import lessonsAI from '@/data/lessons_ai.json'
import type { Lesson } from '@/types/lesson'
import LessonItem from '@/components/LessonItem.vue'
import SearchBar from '@/components/SearchBar.vue'

const router = useRouter()
const progress = useProgressStore()
const { translate } = useLocale()

const searchQuery = ref('')
const currentLessonId = ref('')

const categories = ['ctf', 'ege', 'ai'] as const
type Category = typeof categories[number]
const currentCategory = ref<Category>('ctf')

const lessonsMap: Record<Category, Lesson[]> = {
  ctf: lessonsCTF as Lesson[],
  ege: lessonsEGE as Lesson[],
  ai: lessonsAI as Lesson[]
}

const currentLessons = computed(() => lessonsMap[currentCategory.value] || [])

const filteredLessons = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return currentLessons.value.filter(l => 
    l.title.toLowerCase().includes(q)
  )
})

const displayedLessons = computed(() => filteredLessons.value)

const isLessonUnlocked = (lessonId: string) => {
  const index = filteredLessons.value.findIndex(l => l.id === lessonId)
  if (index === 0) return true
  const prevLesson = filteredLessons.value[index - 1]
  if (!prevLesson) return true
  return progress.isLessonCompleted(prevLesson.id)
}

const goToLesson = (id: string) => {
  if (isLessonUnlocked(id)) {
    currentLessonId.value = id
    router.push(`/lesson/${id}`)
  }
}

onMounted(() => {
  progress.load()
})
</script>

<style scoped>
/* ===== ОСНОВНОЙ КОНТЕЙНЕР ===== */
.lessons {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background: var(--bg-primary);
  overflow: hidden;
}
h1 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

/* ===== ВКЛАДКИ КАТЕГОРИЙ ===== */
.category-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-shrink: 0;
}
.category-tabs button {
  padding: 0.3rem 1rem;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 600;
  font-size: 0.8rem;
}
.category-tabs button.active {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}

/* ===== ЛИНЕЙНЫЙ СПИСОК ===== */
.lessons-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.lessons-list::-webkit-scrollbar {
  width: 4px;
}
.lessons-list::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}
</style>