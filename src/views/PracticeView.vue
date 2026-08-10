<template>
  <div class="practice">
    <h1>{{ translate('practice.title') }}</h1>
    <p class="subtitle">{{ translate('practice.subtitle') }}</p>

    <!-- Блок управления -->
    <div class="practice-controls" v-if="!isFinished">
      <div class="control-group">
        <label>{{ translate('practice.category') }}</label>
        <div class="category-tabs">
          <button
            v-for="cat in categories"
            :key="cat"
            :class="{ active: selectedCategory === cat }"
            @click="selectedCategory = cat"
          >
            {{ cat === 'all' ? 'Все' : cat.toUpperCase() }}
          </button>
        </div>
      </div>

      <div class="control-group">
        <label>{{ translate('practice.difficulty') }}</label>
        <div class="difficulty-stars">
          <span
            v-for="n in 5"
            :key="n"
            class="star"
            :class="{ active: n <= selectedDifficulty }"
            @click="selectedDifficulty = n"
            @mouseenter="hoverDifficulty = n"
            @mouseleave="hoverDifficulty = 0"
          >
            {{ n <= (hoverDifficulty || selectedDifficulty) ? '★' : '☆' }}
          </span>
        </div>
      </div>

      <div class="control-group">
        <label>{{ translate('practice.mode') }}</label>
        <div class="mode-tabs">
          <button :class="{ active: practiceMode === 'simple' }" @click="practiceMode = 'simple'">Простой</button>
          <button :class="{ active: practiceMode === 'olympiad' }" @click="practiceMode = 'olympiad'">Олимпиадный</button>
        </div>
      </div>

      <div class="control-group">
        <label>{{ translate('practice.count') }}</label>
        <div class="count-control">
          <button @click="taskCount = Math.max(1, taskCount - 1)" class="count-btn">−</button>
          <input
            type="number"
            v-model.number="taskCount"
            class="count-input"
            min="1"
            max="100"
            @input="validateCount"
          />
          <button @click="taskCount = Math.min(100, taskCount + 1)" class="count-btn">+</button>
        </div>
      </div>

      <button @click="generateTasks" class="btn-generate">
        {{ translate('practice.generate') }}
      </button>
    </div>

    <!-- Текущая задача -->
    <div v-if="!isFinished && tasks.length > 0" class="task-container">
      <div class="task-progress">
        Задача {{ currentIndex + 1 }} из {{ tasks.length }}
      </div>

      <div class="task-card">
        <div class="task-header">
          <span class="task-category" :class="currentTask.category">{{ currentTask.category.toUpperCase() }}</span>
          <span class="task-difficulty">
            <span v-for="n in 5" :key="n" class="star small">
              {{ n <= (currentTask.difficulty || 1) ? '★' : '☆' }}
            </span>
          </span>
          <span class="task-number">#{{ currentIndex + 1 }}</span>
        </div>
        <h3>{{ currentTask.title }}</h3>
        <p class="task-description">{{ currentTask.description || currentTask.tasks?.[0]?.description || '' }}</p>

        <CodeEditor ref="editorRef" :initialCode="currentTask.starter_code || '# Напишите решение'" @run="handleRun" />
        <ConsoleOutput :output="outputConsole.getOutput(currentIndex)" @clear="outputConsole.clearOutput(currentIndex)" />

        <div class="task-actions">
          <button @click="checkTask" class="btn-check-task">
            <span class="btn-icon">✓</span> {{ translate('practice.check') }}
          </button>
          <button @click="skipTask" class="btn-skip-task">
            <span class="btn-icon">⏭</span> {{ translate('practice.skip') }}
          </button>
        </div>

        <div v-if="taskResults[currentIndex]" class="task-result" :class="taskResults[currentIndex].passed ? 'passed' : 'failed'">
          <span>{{ taskResults[currentIndex].message }}</span>
          <span v-if="taskResults[currentIndex].score !== undefined" class="task-score">Баллы: {{ taskResults[currentIndex].score }}</span>
        </div>
      </div>

      <div class="task-nav">
        <button @click="prevTask" :disabled="currentIndex === 0" class="btn-nav-secondary">
          ← {{ translate('lesson.back') }}
        </button>
        <button @click="nextTask" class="btn-nav-primary">
          {{ currentIndex === tasks.length - 1 ? translate('practice.finish') : translate('practice.next') }} →
        </button>
      </div>
    </div>

    <!-- Итоговый экран -->
    <div v-else-if="isFinished" class="results-container">
      <div class="results-icon">🏆</div>
      <h2>{{ translate('practice.all_done') }}</h2>
      
      <div class="results-stats">
        <div class="stat-item">
          <span class="stat-value" style="color: var(--success);">{{ solvedCount }}</span>
          <span class="stat-label">{{ translate('practice.solved') }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-value" style="color: var(--danger);">{{ skippedCount }}</span>
          <span class="stat-label">{{ translate('practice.skipped') }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-value" style="color: var(--text-primary);">{{ tasks.length }}</span>
          <span class="stat-label">{{ translate('practice.total') }}</span>
        </div>
      </div>

      <div v-if="skippedTasks.length > 0" class="skipped-tasks">
        <h3>{{ translate('practice.skipped_tasks') }}</h3>
        <ul>
          <li v-for="(task, idx) in skippedTasks" :key="idx">
            <span>{{ task.title }}</span>
            <span class="task-category-small" :class="task.category">{{ task.category.toUpperCase() }}</span>
          </li>
        </ul>
      </div>

      <div class="results-actions">
        <button @click="generateTasks" class="btn-retry-skipped">
          <span class="btn-icon">🔄</span> {{ translate('practice.retry_skipped') }}
        </button>
        <button @click="resetAll" class="btn-new-practice">
          <span class="btn-icon">✨</span> {{ translate('practice.new') }}
        </button>
      </div>
    </div>

    <!-- Пустое состояние -->
    <div v-else class="empty-state">
      <div class="empty-icon">✍️</div>
      <p>{{ translate('practice.empty') }}</p>
    </div>

    <!-- Ошибка -->
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { usePython } from '@/composables/usePython'
import { useConsole } from '@/composables/useConsole'
import CodeEditor from '@/components/CodeEditor.vue'
import ConsoleOutput from '@/components/ConsoleOutput.vue'
import practiceCtf from '@/data/practice_ctf.json'
import practiceAi from '@/data/practice_ai.json'
import practiceEge from '@/data/practice_ege.json'
import type { Lesson } from '@/types/lesson'

const { translate } = useLocale()
const { runPython } = usePython()
const outputConsole = useConsole()

const categories = ['all', 'ctf', 'ai', 'ege']
const selectedCategory = ref('all')
const selectedDifficulty = ref(1)
const hoverDifficulty = ref(0)
const practiceMode = ref<'simple' | 'olympiad'>('simple')
const taskCount = ref(1)

const tasks = ref<Lesson[]>([])
const currentIndex = ref(0)
const taskResults = ref<Record<number, { passed: boolean; message: string; score?: number }>>({})
const isFinished = ref(false)
const errorMessage = ref('')
const editorRef = ref<InstanceType<typeof CodeEditor> | null>(null)

const allTasks = computed(() => {
  const map: Record<string, Lesson[]> = {
    ctf: practiceCtf as Lesson[],
    ai: practiceAi as Lesson[],
    ege: practiceEge as Lesson[]
  }
  if (selectedCategory.value === 'all') {
    return [...practiceCtf, ...practiceAi, ...practiceEge] as Lesson[]
  }
  return map[selectedCategory.value] || []
})

const currentTask = computed(() => tasks.value[currentIndex.value] || null)

const solvedCount = computed(() => {
  return Object.values(taskResults.value).filter(r => r.passed).length
})

const skippedCount = computed(() => {
  return tasks.value.length - solvedCount.value
})

const skippedTasks = computed(() => {
  return tasks.value.filter((_, idx) => !taskResults.value[idx]?.passed)
})

const validateCount = () => {
  if (taskCount.value < 1) taskCount.value = 1
  if (taskCount.value > 100) taskCount.value = 100
}

const generateTasks = () => {
  errorMessage.value = ''
  let pool = allTasks.value
  pool = pool.filter(t => (t.difficulty || 1) === selectedDifficulty.value)

  if (pool.length === 0) {
    errorMessage.value = 'Нет задач с выбранной сложностью'
    return
  }

  if (pool.length < taskCount.value) {
    errorMessage.value = translate('practice.not_enough_tasks', { count: pool.length })
    return
  }

  const shuffled = [...pool].sort(() => 0.5 - Math.random())
  tasks.value = shuffled.slice(0, taskCount.value)
  currentIndex.value = 0
  taskResults.value = {}
  isFinished.value = false
  outputConsole.clearAll()
  saveState()
}

const handleRun = async (code: string) => {
  try {
    const result = await runPython(code)
    outputConsole.setOutput(currentIndex.value, result)
  } catch (e) {
    outputConsole.setOutput(currentIndex.value, `❌ Error: ${e}`)
  }
}

const checkTask = async () => {
  const task = currentTask.value
  if (!task) return
  const expected = task.expected_output || ''
  const editor = editorRef.value
  const userCode = editor?.getCode() || ''
  const result = await runPython(userCode)
  const passed = expected ? result.trim() === expected : false

  let score = 0
  if (practiceMode.value === 'olympiad') {
    score = passed ? 10 : 0
  } else {
    score = passed ? 10 : 0
  }

  taskResults.value[currentIndex.value] = {
    passed,
    message: passed ? '✅ Задача решена!' : '❌ Неправильный вывод',
    score
  }
  saveState()
}

const skipTask = () => {
  if (!taskResults.value[currentIndex.value]) {
    taskResults.value[currentIndex.value] = {
      passed: false,
      message: '⏭ Пропущено',
      score: 0
    }
  }
  nextTask()
}

const nextTask = () => {
  if (currentIndex.value < tasks.value.length - 1) {
    currentIndex.value++
    outputConsole.clearOutput(currentIndex.value - 1)
  } else {
    isFinished.value = true
  }
  saveState()
}

const prevTask = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const resetAll = () => {
  tasks.value = []
  currentIndex.value = 0
  taskResults.value = {}
  isFinished.value = false
  outputConsole.clearAll()
  localStorage.removeItem('practice_state')
}

const saveState = () => {
  const state = {
    tasks: tasks.value,
    currentIndex: currentIndex.value,
    taskResults: taskResults.value,
    isFinished: isFinished.value,
    selectedCategory: selectedCategory.value,
    selectedDifficulty: selectedDifficulty.value,
    practiceMode: practiceMode.value,
    taskCount: taskCount.value
  }
  localStorage.setItem('practice_state', JSON.stringify(state))
}

const loadState = () => {
  const saved = localStorage.getItem('practice_state')
  if (saved) {
    try {
      const state = JSON.parse(saved)
      tasks.value = state.tasks || []
      currentIndex.value = state.currentIndex || 0
      taskResults.value = state.taskResults || {}
      isFinished.value = state.isFinished || false
      selectedCategory.value = state.selectedCategory || 'all'
      selectedDifficulty.value = state.selectedDifficulty || 1
      practiceMode.value = state.practiceMode || 'simple'
      taskCount.value = state.taskCount || 1
    } catch (e) {}
  }
}

watch([tasks, currentIndex, taskResults, isFinished, selectedCategory, selectedDifficulty, practiceMode, taskCount], saveState, { deep: true })

loadState()
</script>

<style scoped>
/* ===== ОСНОВНЫЕ СТИЛИ ===== */
.practice {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background: var(--bg-primary);
  overflow: hidden;
}
h1 {
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}
.subtitle {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

/* ===== БЛОК УПРАВЛЕНИЯ ===== */
.practice-controls {
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  margin-bottom: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
  flex-shrink: 0;
}
.control-group {
  flex: 1 1 120px;
  min-width: 80px;
}
.control-group label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 0.3rem;
}

.category-tabs,
.mode-tabs {
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
}
.category-tabs button,
.mode-tabs button {
  padding: 0.25rem 0.6rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-secondary);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.75rem;
}
.category-tabs button.active,
.mode-tabs button.active {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}
.category-tabs button:hover,
.mode-tabs button:hover {
  border-color: var(--accent);
}

.difficulty-stars {
  display: flex;
  gap: 0.2rem;
  cursor: pointer;
}
.difficulty-stars .star {
  font-size: 1.2rem;
  color: var(--text-muted);
  transition: color 0.2s, transform 0.2s;
  user-select: none;
}
.difficulty-stars .star.active {
  color: #f59e0b;
}
.difficulty-stars .star:hover {
  transform: scale(1.2);
}

.count-control {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.count-btn {
  width: 28px;
  height: 28px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.count-btn:hover {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}
.count-input {
  width: 48px;
  padding: 0.2rem 0.3rem;
  text-align: center;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.9rem;
  -webkit-appearance: none;
  -moz-appearance: textfield;
  appearance: none;
}
.count-input::-webkit-inner-spin-button,
.count-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* ===== КНОПКА ГЕНЕРАЦИИ ===== */
.btn-generate {
  padding: 0.5rem 1.5rem;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  white-space: nowrap;
}
.btn-generate:hover {
  filter: brightness(0.9);
  transform: scale(1.02);
}
.btn-generate:active {
  transform: scale(0.98);
}

/* ===== КАРТОЧКА ЗАДАЧИ ===== */
.task-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.task-progress {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}
.task-card {
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  flex: 1;
  overflow-y: auto;
}
.task-header {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
}
.task-category {
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}
.task-category.ctf {
  background: #8b5cf6;
  color: white;
}
.task-category.ege {
  background: #f59e0b;
  color: white;
}
.task-category.ai {
  background: #06b6d4;
  color: white;
}
.task-difficulty {
  font-size: 0.8rem;
  letter-spacing: 1px;
}
.task-difficulty .star {
  color: #f59e0b;
}
.task-difficulty .star.small {
  font-size: 0.7rem;
}
.task-number {
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-left: auto;
}
.task-description {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

/* ===== КНОПКИ ДЕЙСТВИЙ ===== */
.task-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}
.btn-check-task,
.btn-skip-task {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  flex: 1 1 auto;
  min-width: 100px;
  text-align: center;
  font-size: 0.9rem;
}
.btn-check-task {
  background: var(--accent);
  color: white;
}
.btn-check-task:hover {
  filter: brightness(0.9);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
}
.btn-check-task:active {
  transform: translateY(0);
}
.btn-skip-task {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}
.btn-skip-task:hover {
  background: var(--bg-hover);
  transform: translateY(-2px);
}
.btn-skip-task:active {
  transform: translateY(0);
}
.btn-icon {
  font-size: 1.1rem;
}

/* ===== РЕЗУЛЬТАТ ===== */
.task-result {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
}
.task-result.passed {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success);
}
.task-result.failed {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}
.task-score {
  display: block;
  margin-top: 0.25rem;
  font-weight: 600;
}

/* ===== НАВИГАЦИЯ МЕЖДУ ЗАДАЧАМИ ===== */
.task-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  flex-shrink: 0;
}
.btn-nav-secondary,
.btn-nav-primary {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  font-size: 0.9rem;
}
.btn-nav-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}
.btn-nav-secondary:hover:not(:disabled) {
  background: var(--bg-hover);
  transform: translateX(-2px);
}
.btn-nav-secondary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.btn-nav-primary {
  background: var(--accent);
  color: white;
}
.btn-nav-primary:hover {
  filter: brightness(0.9);
  transform: translateX(2px);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
}
.btn-nav-primary:active {
  transform: translateX(0);
}

/* ===== ИТОГОВЫЙ ЭКРАН ===== */
.results-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow-y: auto;
}
.results-icon {
  font-size: 4rem;
  margin-bottom: 0.5rem;
}
.results-container h2 {
  color: var(--text-primary);
  margin-bottom: 2rem;
}

.results-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}
.stat-item {
  text-align: center;
}
.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  display: block;
}
.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.skipped-tasks {
  width: 100%;
  max-width: 500px;
  margin-bottom: 2rem;
}
.skipped-tasks h3 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  text-align: center;
}
.skipped-tasks ul {
  list-style: none;
  padding: 0;
}
.skipped-tasks li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.8rem;
  background: var(--bg-primary);
  border-radius: 6px;
  margin-bottom: 0.3rem;
  color: var(--text-secondary);
  border-left: 3px solid var(--danger);
}
.task-category-small {
  font-size: 0.6rem;
  padding: 0.1rem 0.5rem;
  border-radius: 10px;
  background: var(--bg-tertiary);
  color: var(--text-muted);
}
.task-category-small.ctf {
  background: #8b5cf6;
  color: white;
}
.task-category-small.ege {
  background: #f59e0b;
  color: white;
}
.task-category-small.ai {
  background: #06b6d4;
  color: white;
}

.results-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}
.btn-retry-skipped,
.btn-new-practice {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  font-size: 0.95rem;
}
.btn-retry-skipped {
  background: var(--accent);
  color: white;
}
.btn-retry-skipped:hover {
  filter: brightness(0.9);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
}
.btn-new-practice {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}
.btn-new-practice:hover {
  background: var(--bg-hover);
  transform: translateY(-2px);
}

/* ===== ПУСТОЕ СОСТОЯНИЕ ===== */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}
.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

/* ===== ОШИБКА ===== */
.error-message {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
  border-radius: 6px;
  border: 1px solid rgba(239, 68, 68, 0.2);
  text-align: center;
}
</style>