<template>
  <div class="code-editor-wrapper">
    <div class="editor-header">
      <span class="lang">Python</span>
      <div class="actions">
        <button @click="runCode" :disabled="isRunning" class="btn-run" :title="translate('compiler.run_hint')">
          <span class="icon">▶</span> {{ translate('compiler.run') }}
        </button>
        <button @click="clearCode" class="btn-clear" :title="translate('compiler.clear_hint')">
          <span class="icon">✕</span> {{ translate('compiler.clear') }}
        </button>
        <button @click="copyCode" class="btn-copy" :title="translate('compiler.copy_hint')">
          <span class="icon">📋</span> {{ translate('compiler.copy') }}
        </button>
      </div>
    </div>
    <div ref="editorContainer" class="editor-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as monaco from 'monaco-editor'
import { useSettingsStore } from '@/stores/settings'
import { useLocale } from '@/composables/useLocale'

// @ts-ignore
self.MonacoEnvironment = {
  getWorkerUrl: function (_moduleId: string, label: string) {
    const base = '/monaco-editor/'
    if (label === 'json') return `${base}language/json/json.worker.js`
    if (label === 'css' || label === 'scss' || label === 'less') return `${base}language/css/css.worker.js`
    if (label === 'html' || label === 'handlebars' || label === 'razor') return `${base}language/html/html.worker.js`
    if (label === 'typescript' || label === 'javascript') return `${base}language/typescript/ts.worker.js`
    return `${base}editor/editor.worker.js`
  }
}

const props = defineProps<{
  initialCode?: string
  readOnly?: boolean
}>()

const emit = defineEmits<{
  (e: 'run', code: string): void
}>()

const settings = useSettingsStore()
const { translate } = useLocale()
const editorContainer = ref<HTMLElement | null>(null)
let editor: monaco.editor.IStandaloneCodeEditor | null = null
const isRunning = ref(false)

const applySettings = () => {
  if (!editor) return
  editor.updateOptions({
    fontSize: settings.editorFontSize,
    lineNumbers: settings.showLineNumbers ? 'on' : 'off',
    minimap: { enabled: settings.minimap },
    bracketPairColorization: { enabled: settings.bracketPairColorization },
    renderWhitespace: settings.renderWhitespace,
    automaticLayout: true,
    scrollbar: { vertical: 'visible', horizontal: 'visible' }
  })
  monaco.editor.setTheme(settings.theme === 'dark' ? 'vs-dark' : 'vs')
}

onMounted(async () => {
  await nextTick()
  if (!editorContainer.value) return

  editor = monaco.editor.create(editorContainer.value, {
    value: props.initialCode || '# Напишите код здесь\nprint("Hello, CTF!")',
    language: 'python',
    theme: settings.theme === 'dark' ? 'vs-dark' : 'vs',
    automaticLayout: true,
    fontSize: settings.editorFontSize,
    lineNumbers: settings.showLineNumbers ? 'on' : 'off',
    minimap: { enabled: settings.minimap },
    bracketPairColorization: { enabled: settings.bracketPairColorization },
    renderWhitespace: settings.renderWhitespace,
    readOnly: props.readOnly || false,
    scrollbar: { vertical: 'visible', horizontal: 'visible' }
  })

  applySettings()

  watch(
    [
      () => settings.editorFontSize,
      () => settings.showLineNumbers,
      () => settings.minimap,
      () => settings.theme,
      () => settings.bracketPairColorization,
      () => settings.renderWhitespace
    ],
    () => applySettings()
  )
})

onBeforeUnmount(() => {
  editor?.dispose()
})

const getCode = () => editor?.getValue() || ''
const setCode = (code: string) => { if (editor) editor.setValue(code) }

const runCode = () => {
  isRunning.value = true
  const code = getCode()
  emit('run', code)
  setTimeout(() => { isRunning.value = false }, 100)
}

const clearCode = () => { if (editor) editor.setValue('') }
const copyCode = () => {
  const code = getCode()
  navigator.clipboard?.writeText(code)
}

defineExpose({ getCode, setCode })
</script>

<style scoped>
.code-editor-wrapper {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-secondary);
  margin-bottom: 1.5rem;
  transition: border-color 0.3s, background 0.3s;
}
.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 1.2rem;
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-color);
  flex-wrap: wrap;
  gap: 0.5rem;
  transition: background 0.3s, border-color 0.3s;
}
.lang {
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.9rem;
}
.actions {
  display: flex;
  gap: 0.5rem;
}
.actions button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0.3rem 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
  background: var(--bg-primary);
  color: var(--text-primary);
}
.actions button:hover {
  transform: scale(1.02);
}
.actions button .icon {
  font-size: 0.9rem;
}
.btn-run {
  background: var(--accent);
  color: white;
}
.btn-run:hover {
  filter: brightness(0.9);
}
.btn-run:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-clear:hover {
  color: var(--danger);
}
.btn-copy:hover {
  color: var(--accent);
}
.editor-container {
  height: 400px;
  width: 100%;
}
@media (max-width: 768px) {
  .editor-header { flex-direction: column; align-items: stretch; }
  .actions { justify-content: flex-start; flex-wrap: wrap; }
  .editor-container { height: 300px; }
}
</style>