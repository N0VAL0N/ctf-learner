<template>
  <!-- Полностью свёрнутое состояние - только фиолетовая полоска -->
  <div v-if="isFullyCollapsed" class="compiler-tab" @click="expandCompiler">
    <div class="compiler-tab-icon">☰</div>
    <div class="compiler-tab-label">Компилятор</div>
  </div>

  <!-- Развёрнутое состояние -->
  <div v-else class="compiler-slider" :class="{ open: isOpen }" :style="{ width: width + 'px' }">
    <div class="compiler-handle" @mousedown="startDrag" @touchstart="startDrag">
      <span>☰</span>
    </div>
    <div class="compiler-content">
      <div class="compiler-header">
        <h3>Компилятор</h3>
        <button @click="collapseCompiler" class="btn-collapse" title="Свернуть компилятор">
          <span class="collapse-icon">◀</span>
        </button>
      </div>
      <CodeEditor :initialCode="initialCode" @run="onRun" />
      <ConsoleOutput :output="outputConsole.getOutput('compiler')" @clear="outputConsole.clearOutput('compiler')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useConsole } from '@/composables/useConsole'
import { usePython } from '@/composables/usePython'
import CodeEditor from './CodeEditor.vue'
import ConsoleOutput from './ConsoleOutput.vue'

const props = defineProps<{
  isOpen: boolean
  initialCode?: string
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
}>()

const outputConsole = useConsole()
const { runPython } = usePython()
const width = ref(400)
const isDragging = ref(false)
const dragStartX = ref(0)

// Состояние полного сворачивания
const isFullyCollapsed = ref(false)

const onRun = async (code: string) => {
  try {
    const result = await runPython(code)
    outputConsole.setOutput('compiler', result)
  } catch (e) {
    outputConsole.setOutput('compiler', `❌ Error: ${e}`)
  }
}

// Развернуть компилятор из свёрнутого состояния
const expandCompiler = () => {
  isFullyCollapsed.value = false
  emit('update:isOpen', true)
}

// Полностью свернуть компилятор
const collapseCompiler = () => {
  isFullyCollapsed.value = true
  emit('update:isOpen', false)
}

const startDrag = (e: MouseEvent | TouchEvent) => {
  isDragging.value = true
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  dragStartX.value = clientX
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchmove', onDrag)
  document.addEventListener('touchend', stopDrag)
}

const onDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const delta = clientX - dragStartX.value
  width.value = Math.min(Math.max(300, width.value - delta), 600)
  dragStartX.value = clientX
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', stopDrag)
}

// Если isOpen становится false, но компилятор не свёрнут полностью -
// значит его закрыли через внешний триггер, сворачиваем полностью
watch(() => props.isOpen, (newVal) => {
  if (!newVal && !isFullyCollapsed.value) {
    isFullyCollapsed.value = true
  }
})
</script>

<style scoped>
/* ===== СВЁРНУТОЕ СОСТОЯНИЕ ===== */
.compiler-tab {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  background: var(--accent);
  color: white;
  border-radius: 8px 0 0 8px;
  cursor: pointer;
  padding: 12px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  z-index: 99;
  box-shadow: -2px 0 10px rgba(124, 58, 237, 0.3);
}
.compiler-tab:hover {
  width: 48px;
  box-shadow: -4px 0 20px rgba(124, 58, 237, 0.5);
}
.compiler-tab-icon {
  font-size: 1.2rem;
  font-weight: 700;
}
.compiler-tab-label {
  writing-mode: vertical-rl;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 2px;
}
.compiler-tab:hover .compiler-tab-label {
  letter-spacing: 3px;
}

/* ===== РАЗВЁРНУТОЕ СОСТОЯНИЕ ===== */
.compiler-slider {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 0;
  background: var(--bg-secondary);
  border-left: 1px solid var(--border-color);
  transition: width 0.3s ease;
  z-index: 100;
  overflow: hidden;
  display: flex;
}
.compiler-slider.open {
  width: v-bind(width + 'px');
}
.compiler-handle {
  width: 24px;
  height: 100%;
  background: var(--accent);
  cursor: ew-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
  font-size: 1.2rem;
  user-select: none;
}
.compiler-handle:hover {
  filter: brightness(0.9);
}
.compiler-content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.compiler-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.compiler-header h3 {
  margin: 0;
  color: var(--text-primary);
}
.btn-collapse {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
  font-size: 1rem;
}
.btn-collapse:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}
.collapse-icon {
  display: inline-block;
  transition: transform 0.2s;
}
.btn-collapse:hover .collapse-icon {
  transform: translateX(-2px);
}
</style>