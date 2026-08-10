import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProgressStore = defineStore('progress', () => {
  const completedLessonIds = ref<string[]>([])
  const solvedTasks = ref<Record<string, boolean>>({})

  const load = () => {
    const stored = localStorage.getItem('ctf_progress')
    if (stored) {
      const data = JSON.parse(stored)
      completedLessonIds.value = data.completedLessonIds || []
      solvedTasks.value = data.solvedTasks || {}
    }
  }

  const save = () => {
    localStorage.setItem('ctf_progress', JSON.stringify({
      completedLessonIds: completedLessonIds.value,
      solvedTasks: solvedTasks.value
    }))
  }

  const completeLesson = (id: string) => {
    if (!completedLessonIds.value.includes(id)) {
      completedLessonIds.value.push(id)
      save()
    }
  }

  const solveTask = (lessonId: string, taskIndex: number) => {
    const key = `${lessonId}_${taskIndex}`
    if (!solvedTasks.value[key]) {
      solvedTasks.value[key] = true
      save()
    }
  }

  const isLessonCompleted = (id: string) => completedLessonIds.value.includes(id)
  const isTaskSolved = (lessonId: string, taskIndex: number) => !!solvedTasks.value[`${lessonId}_${taskIndex}`]

  const totalLessonsCompleted = computed(() => completedLessonIds.value.length)
  const totalTasksSolved = computed(() => Object.keys(solvedTasks.value).length)

  // Экспорт/импорт
  const exportData = () => ({
    completedLessonIds: completedLessonIds.value,
    solvedTasks: solvedTasks.value
  })

  const importData = (data: any) => {
    if (data.completedLessonIds) completedLessonIds.value = data.completedLessonIds
    if (data.solvedTasks) solvedTasks.value = data.solvedTasks
    save()
  }

  return {
    completedLessonIds,
    solvedTasks,
    load,
    save,
    completeLesson,
    solveTask,
    isLessonCompleted,
    isTaskSolved,
    totalLessonsCompleted,
    totalTasksSolved,
    exportData,
    importData
  }
})