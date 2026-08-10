<template>
  <div class="qr-modal-overlay" @click.self="close">
    <div class="qr-modal">
      <h2>{{ title }}</h2>
      <div class="qr-content">
        <div v-if="mode === 'export'" class="qr-export">
          <VueQrcode :value="qrData" :options="{ width: 200, height: 200 }" />
          <p>Отсканируйте QR-код на телефоне, чтобы импортировать прогресс</p>
          <button @click="copyData" class="btn-secondary">Скопировать данные</button>
        </div>
        <div v-else class="qr-import">
          <p>Вставьте данные, полученные с другого устройства:</p>
          <textarea v-model="importData" rows="4" placeholder='{"completedLessonIds":[],"solvedTasks":{}}'></textarea>
          <button @click="importProgress" class="btn-primary">Импортировать</button>
        </div>
      </div>
      <button @click="close" class="btn-close">Закрыть</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VueQrcode from '@chenfengyuan/vue-qrcode'

const props = defineProps<{
  mode: 'export' | 'import'
  qrData?: string
}>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'import', data: any): void
}>()

const importData = ref('')

const title = props.mode === 'export' ? 'Экспорт прогресса' : 'Импорт прогресса'

const close = () => emit('close')
const copyData = () => {
  if (props.qrData) navigator.clipboard?.writeText(props.qrData)
}

const importProgress = () => {
  try {
    const parsed = JSON.parse(importData.value)
    emit('import', parsed)
    close()
  } catch (e) {
    alert('Неверный формат данных')
  }
}
</script>

<style scoped>
.qr-modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.qr-modal {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  border: 1px solid var(--border-color);
}
.qr-modal h2 {
  margin-top: 0;
  color: var(--text-primary);
}
.qr-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.qr-export, .qr-import {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.qr-import textarea {
  width: 100%;
  padding: 0.5rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-family: monospace;
}
.btn-secondary, .btn-primary, .btn-close {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn-primary { background: var(--accent); color: white; }
.btn-secondary { background: var(--bg-tertiary); color: var(--text-primary); }
.btn-close { background: var(--danger); color: white; margin-top: 1rem; }
</style>