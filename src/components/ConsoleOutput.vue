<template>
  <div class="console-output">
    <div class="console-header">
      <span>{{ translate('compiler.output') }}</span>
      <div class="console-actions">
        <button @click="clear" class="clear-btn" :title="translate('console.clear')">✕</button>
      </div>
    </div>
    <div ref="consoleBody" class="console-body" v-html="formattedOutput"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { parseAnsiToHtml } from '@/utils/ansi'
import { useLocale } from '@/composables/useLocale'

const props = defineProps<{ output: string }>()
const emit = defineEmits<{ (e: 'clear'): void }>()
const { translate } = useLocale()

const consoleBody = ref<HTMLElement | null>(null)

const formattedOutput = computed(() => {
  if (!props.output) return `<span class="placeholder">${translate('compiler.placeholder')}</span>`
  return parseAnsiToHtml(props.output)
})

watch(() => props.output, async () => {
  await nextTick()
  if (consoleBody.value) {
    consoleBody.value.scrollTop = consoleBody.value.scrollHeight
  }
})

const clear = () => emit('clear')
</script>

<style scoped>
.console-output {
  border: 1px solid var(--console-border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--console-bg);
  margin-top: 1rem;
  font-family: 'Courier New', monospace;
  transition: background 0.3s, color 0.3s, border-color 0.3s;
}
.console-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 1rem;
  background: var(--console-header-bg);
  border-bottom: 1px solid var(--console-border);
  color: var(--text-secondary);
  font-weight: 600;
  transition: background 0.3s, color 0.3s, border-color 0.3s;
}
.console-actions button {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.2s;
}
.console-actions button:hover {
  color: var(--danger);
}
.console-body {
  padding: 0.75rem 1rem;
  min-height: 100px;
  max-height: 300px;
  overflow-y: auto;
  font-size: 0.9rem;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--console-text);
  line-height: 1.5;
  transition: color 0.3s;
}
.console-body .placeholder {
  color: var(--text-muted);
  font-style: italic;
}
/* ANSI цвета — для вывода */
.console-body .ansi-red { color: #dc2626; }
.console-body .ansi-green { color: #16a34a; }
.console-body .ansi-yellow { color: #ca8a04; }
.console-body .ansi-blue { color: #2563eb; }
.console-body .ansi-magenta { color: #9333ea; }
.console-body .ansi-cyan { color: #0891b2; }
.console-body .ansi-white { color: #1e293b; }
.console-body .ansi-bold { font-weight: bold; }

/* В тёмной теме ANSI цвета корректируются */
[data-theme="dark"] .console-body .ansi-red { color: #f87171; }
[data-theme="dark"] .console-body .ansi-green { color: #4ade80; }
[data-theme="dark"] .console-body .ansi-yellow { color: #facc15; }
[data-theme="dark"] .console-body .ansi-blue { color: #60a5fa; }
[data-theme="dark"] .console-body .ansi-magenta { color: #c084fc; }
[data-theme="dark"] .console-body .ansi-cyan { color: #22d3ee; }
[data-theme="dark"] .console-body .ansi-white { color: #e2e8f0; }
</style>