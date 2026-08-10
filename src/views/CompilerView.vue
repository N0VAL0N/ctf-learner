<template>
  <div class="compiler">
    <h1>{{ translate('compiler.title') }}</h1>
    <div v-if="isLoading" class="loading-indicator">{{ translate('compiler.loading') }}</div>
    <div class="editor-wrapper">
      <CodeEditor ref="editorRef" :initialCode="initialCode" @run="handleRun" />
    </div>
    <ConsoleOutput :output="output" @clear="output = ''" />
    <div class="status error" v-if="error">❌ {{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import CodeEditor from '@/components/CodeEditor.vue'
import ConsoleOutput from '@/components/ConsoleOutput.vue'
import { usePython } from '@/composables/usePython'
import { useProgressStore } from '@/stores/progress'
import { useLocale } from '@/composables/useLocale'
import lessonsCTF from '@/data/lessons_ctf.json'
import lessonsEGE from '@/data/lessons_ege.json'
import lessonsAI from '@/data/lessons_ai.json'
import type { Lesson } from '@/types/lesson'

const route = useRoute()
const { runPython, isLoading, error, init } = usePython()
const progress = useProgressStore()
const { translate } = useLocale()
const output = ref('')
const editorRef = ref<InstanceType<typeof CodeEditor> | null>(null)
const initialCode = ref('# Напишите код здесь\nprint("Hello, CTF!")')

const allLessons = [...lessonsCTF, ...lessonsEGE, ...lessonsAI] as Lesson[]

onMounted(() => {
  const code = route.query.code as string
  if (code) initialCode.value = code
  init()
})

const handleRun = async (code: string) => {
  output.value = '⏳ Executing...'
  try {
    const result = await runPython(code)
    output.value = result

    const lessonId = route.query.lessonId as string
    const taskIndex = route.query.taskIndex as string
    if (lessonId && taskIndex) {
      const lesson = allLessons.find((l: Lesson) => l.id === lessonId)
      const task = lesson?.tasks[parseInt(taskIndex)]
      if (task?.expected_output && result.trim() === task.expected_output) {
        progress.solveTask(lessonId, parseInt(taskIndex))
        output.value += '\n\n✅ Task solved!'
      }
    }
  } catch (e) {
    output.value = `❌ Error: ${e}`
  }
}
</script>

<style scoped>
.compiler {
  height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 1000px;
  margin: 0 auto;
  padding: 1.5rem;
  background: var(--bg-primary);
}
h1 {
  margin-bottom: 2rem;
  color: var(--text-primary);
  flex-shrink: 0;
}
.editor-wrapper {
  flex: 1;
  min-height: 0;
  margin-bottom: 1rem;
}
.loading-indicator {
  background: var(--bg-secondary);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  color: var(--text-secondary);
  border-left: 4px solid var(--accent);
}
.status.error {
  color: var(--danger);
  margin-top: 0.5rem;
}
</style>