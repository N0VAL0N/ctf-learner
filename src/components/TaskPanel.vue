<template>
  <div class="task-card">
    <h3>{{ translate('lesson.task') }} {{ taskIndex + 1 }} / {{ total }}</h3>
    <p class="task-desc">{{ task.description }}</p>

    <!-- code_insert -->
    <div v-if="task.type === 'code_insert'" class="code-insert">
      <p>Вставьте правильный код вместо <code>???</code>:</p>
      <div class="code-block"><pre><code>{{ task.code_snippet }}</code></pre></div>
      <input v-model="answer" :placeholder="translate('lesson.insert_code')" class="insert-input" />
      <button @click="checkInsert" class="btn-check">Проверить</button>
      <div v-if="result" class="task-result" :class="result.passed ? 'passed' : 'failed'">
        {{ result.message }}
        <span v-if="!result.passed && task.hint">Подсказка: {{ task.hint }}</span>
      </div>
    </div>

    <!-- full_code -->
    <div v-else-if="task.type === 'full_code'" class="full-code">
      <p>Напишите полное решение:</p>
      <div class="editor-wrapper">
        <CodeEditor ref="editorRef" :initialCode="task.starter_code || '# Напишите код'" @run="onRun" />
        <ConsoleOutput :output="outputConsole.getOutput(taskIndex)" @clear="outputConsole.clearOutput(taskIndex)" />
      </div>
      <button @click="checkFullCode" class="btn-check">Проверить</button>
      <div v-if="result" class="task-result" :class="result.passed ? 'passed' : 'failed'">
        {{ result.message }}
        <span v-if="!result.passed && task.expected_output">Ожидалось: {{ task.expected_output }}</span>
      </div>
      <button @click="$emit('openCompiler')" class="btn-compiler">💻 Открыть компилятор</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Task } from '@/types/lesson'
import { useLocale } from '@/composables/useLocale'
import { usePython } from '@/composables/usePython'
import { useConsole } from '@/composables/useConsole'
import CodeEditor from './CodeEditor.vue'
import ConsoleOutput from './ConsoleOutput.vue'

const props = defineProps<{
  task: Task
  taskIndex: number
  total: number
  initialResult?: { passed: boolean; message: string } | null
  initialAnswer?: string
}>()

const emit = defineEmits<{
  (e: 'solved', taskIndex: number): void
  (e: 'openCompiler'): void
}>()

const { translate } = useLocale()
const { runPython } = usePython()
const outputConsole = useConsole()
const editorRef = ref<InstanceType<typeof CodeEditor> | null>(null)
const answer = ref(props.initialAnswer || '')
const result = ref<{ passed: boolean; message: string } | null>(props.initialResult || null)

const checkInsert = () => {
  if (props.task.type !== 'code_insert') return
  const isCorrect = answer.value.trim() === props.task.correct_answer
  result.value = {
    passed: isCorrect,
    message: isCorrect ? '✅ Верно!' : '❌ Неправильно'
  }
  if (isCorrect) emit('solved', props.taskIndex)
}

const checkFullCode = async () => {
  if (props.task.type !== 'full_code') return
  const code = editorRef.value?.getCode() || ''
  const output = await runPython(code)
  outputConsole.setOutput(props.taskIndex, output)
  const expected = props.task.expected_output || ''
  const isCorrect = output.trim() === expected
  result.value = {
    passed: isCorrect,
    message: isCorrect ? '✅ Задача решена!' : '❌ Неправильный вывод'
  }
  if (isCorrect) emit('solved', props.taskIndex)
}

const onRun = async (code: string) => {
  try {
    const output = await runPython(code)
    outputConsole.setOutput(props.taskIndex, output)
  } catch (e) {
    outputConsole.setOutput(props.taskIndex, `❌ Error: ${e}`)
  }
}

watch(answer, (_val) => { /* можно сохранять состояние */ })
</script>

<style scoped>
.task-card {
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}
.task-desc {
  color: var(--text-secondary);
}
.code-insert input {
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-primary);
}
.btn-check {
  padding: 0.4rem 1rem;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn-check:hover {
  filter: brightness(0.9);
}
.task-result {
  margin-top: 0.5rem;
  padding: 0.5rem;
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
.btn-compiler {
  padding: 0.4rem 1rem;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 0.5rem;
}
.btn-compiler:hover {
  filter: brightness(0.9);
}
.editor-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>