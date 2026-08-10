<template>
  <div class="theory-section">
    <div v-for="(block, idx) in blocks" :key="idx" class="theory-block">
      <h3 v-if="block.title">{{ block.title }}</h3>
      <p>{{ block.content }}</p>
      <div v-if="block.code" class="code-block-wrapper">
        <div class="code-block">
          <pre><code>{{ block.code }}</code></pre>
        </div>
        <button @click="onRun(block.code, idx)" class="btn-run-block">▶ Запустить</button>
        
        <div v-if="outputConsole.getOutput(idx)" class="console-wrapper">
          <div class="console-header">
            <span>Вывод</span>
            <div class="console-actions">
              <button @click="toggleConsole(idx)" class="console-toggle-btn">
                {{ isConsoleCollapsed(idx) ? '▼' : '▲' }}
              </button>
              <button @click="outputConsole.clearOutput(idx)" class="console-close">✕</button>
            </div>
          </div>
          <div v-show="!isConsoleCollapsed(idx)" class="console-body">
            <pre>{{ outputConsole.getOutput(idx) }}</pre>
          </div>
          <div v-show="isConsoleCollapsed(idx)" class="console-collapsed-bar" @click="toggleConsole(idx)">
            <span class="console-collapsed-icon">▶</span>
            <span class="console-collapsed-text">Вывод скрыт (нажмите, чтобы развернуть)</span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="examples && examples.length" class="examples-section">
      <h3>Примеры</h3>
      <div v-for="(ex, idx) in examples" :key="idx" class="example-block">
        <h4>{{ ex.title }}</h4>
        <div class="code-block-wrapper">
          <div class="code-block"><pre><code>{{ ex.code }}</code></pre></div>
          <button @click="onRun(ex.code, `example_${idx}`)" class="btn-run-block">▶ Запустить</button>
          
          <div v-if="outputConsole.getOutput(`example_${idx}`)" class="console-wrapper">
            <div class="console-header">
              <span>Вывод</span>
              <div class="console-actions">
                <button @click="toggleConsole(`example_${idx}`)" class="console-toggle-btn">
                  {{ isConsoleCollapsed(`example_${idx}`) ? '▼' : '▲' }}
                </button>
                <button @click="outputConsole.clearOutput(`example_${idx}`)" class="console-close">✕</button>
              </div>
            </div>
            <div v-show="!isConsoleCollapsed(`example_${idx}`)" class="console-body">
              <pre>{{ outputConsole.getOutput(`example_${idx}`) }}</pre>
            </div>
            <div v-show="isConsoleCollapsed(`example_${idx}`)" class="console-collapsed-bar" @click="toggleConsole(`example_${idx}`)">
              <span class="console-collapsed-icon">▶</span>
              <span class="console-collapsed-text">Вывод скрыт (нажмите, чтобы развернуть)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { TheoryBlock, ExampleBlock } from '@/types/lesson'
import { useConsole } from '@/composables/useConsole'
import { usePython } from '@/composables/usePython'

defineProps<{
  blocks: TheoryBlock[]
  examples?: ExampleBlock[]
}>()

const outputConsole = useConsole()
const { runPython } = usePython()

const collapsedConsoles = reactive<Record<string | number, boolean>>({})

const isConsoleCollapsed = (key: string | number) => {
  return collapsedConsoles[key] !== undefined ? collapsedConsoles[key] : false
}

const toggleConsole = (key: string | number) => {
  collapsedConsoles[key] = !collapsedConsoles[key]
}

const onRun = async (code: string, key: string | number) => {
  try {
    const result = await runPython(code)
    outputConsole.setOutput(key, result)
    collapsedConsoles[key] = false
  } catch (e) {
    outputConsole.setOutput(key, `❌ Error: ${e}`)
    collapsedConsoles[key] = false
  }
}
</script>

<style scoped>
.theory-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.theory-block {
  margin-bottom: 0.5rem;
}
.theory-block h3 {
  color: var(--text-primary);
  margin-bottom: 0.3rem;
}
.theory-block p {
  color: var(--text-secondary);
  line-height: 1.6;
}
.examples-section {
  margin-top: 1rem;
}
.example-block {
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border-left: 3px solid var(--accent);
}
.code-block-wrapper {
  margin-top: 0.5rem;
}
.code-block {
  background: var(--bg-primary);
  padding: 0.75rem;
  border-radius: 6px;
  overflow-x: auto;
}
.code-block pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  color: var(--text-primary);
}
.btn-run-block {
  margin-top: 0.3rem;
  padding: 0.2rem 0.6rem;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.7rem;
}
.btn-run-block:hover {
  filter: brightness(0.9);
}

/* ===== КОНСОЛЬ С ВОЗМОЖНОСТЬЮ СВОРАЧИВАНИЯ ===== */
.console-wrapper {
  margin-top: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  overflow: hidden;
  background: var(--console-bg, #0d0d1a);
}
.console-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.2rem 0.6rem;
  background: var(--console-header-bg, #1a1a2e);
  border-bottom: 1px solid var(--border-color);
  color: var(--text-muted);
  font-size: 0.7rem;
}
.console-actions {
  display: flex;
  gap: 0.3rem;
  align-items: center;
}
.console-toggle-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0 0.2rem;
  font-size: 0.7rem;
  transition: color 0.2s, transform 0.2s;
}
.console-toggle-btn:hover {
  color: var(--accent);
}
.console-close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 0.8rem;
  padding: 0 0.2rem;
  transition: color 0.2s;
}
.console-close:hover {
  color: var(--danger);
}
.console-body {
  padding: 0.3rem 0.6rem;
}
.console-body pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: var(--console-text, #c9d1d9);
  white-space: pre-wrap;
  max-height: 150px;
  overflow-y: auto;
}

/* ===== СВЁРНУТАЯ КОНСОЛЬ (фиолетовая полоска) ===== */
.console-collapsed-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0.6rem;
  background: var(--console-header-bg, #1a1a2e);
  border-left: 3px solid var(--accent);
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}
.console-collapsed-bar:hover {
  background: var(--bg-hover);
  border-left-color: #7c3aed;
}
.console-collapsed-bar:hover .console-collapsed-icon {
  transform: translateX(2px);
}
.console-collapsed-icon {
  color: var(--accent);
  font-size: 0.8rem;
  transition: transform 0.2s;
}
.console-collapsed-text {
  color: var(--text-muted);
  font-size: 0.75rem;
  font-style: italic;
}
</style>