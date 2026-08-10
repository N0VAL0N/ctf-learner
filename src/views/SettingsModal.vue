<template>
  <div class="settings-modal-overlay" @click.self="close">
    <div class="settings-modal">
      <div class="modal-header">
        <h2>{{ translate('settings.title') }}</h2>
        <button @click="close" class="modal-close">✕</button>
      </div>
      <div class="modal-body">
        <!-- Общие настройки -->
        <div class="settings-section">
          <h3>{{ translate('settings.general') }}</h3>

          <div class="setting-group">
            <label>{{ translate('settings.language') }}</label>
            <div class="language-toggle">
              <button @click="setLocale('ru')" :class="{ active: settings.locale === 'ru' }">
                {{ translate('settings.language_ru') }}
              </button>
              <button @click="setLocale('en')" :class="{ active: settings.locale === 'en' }">
                {{ translate('settings.language_en') }}
              </button>
            </div>
          </div>

          <div class="setting-group">
            <label>{{ translate('settings.theme') }}</label>
            <div class="theme-toggle">
              <button @click="setTheme('dark')" :class="{ active: settings.theme === 'dark' }">
                <SvgIcon name="moon" :size="16" /> {{ translate('settings.theme_dark') }}
              </button>
              <button @click="setTheme('light')" :class="{ active: settings.theme === 'light' }">
                <SvgIcon name="sun" :size="16" /> {{ translate('settings.theme_light') }}
              </button>
            </div>
          </div>

          <div class="setting-group">
            <label>{{ translate('settings.global_font', { size: settings.globalFontSize }) }}</label>
            <input type="range" min="12" max="30" step="1" v-model.number="settings.globalFontSize" />
            <p class="hint">{{ translate('settings.global_font_hint') }}</p>
          </div>
        </div>

        <!-- Настройки компилятора -->
        <div class="settings-section">
          <h3>{{ translate('settings.compiler') }}</h3>

          <div class="setting-group">
            <label>{{ translate('settings.editor_font', { size: settings.editorFontSize }) }}</label>
            <input type="range" min="10" max="24" step="1" v-model.number="settings.editorFontSize" />
            <p class="hint">{{ translate('settings.editor_font_hint') }}</p>
          </div>

          <div class="setting-group">
            <label>
              <input type="checkbox" v-model="settings.showLineNumbers" />
              {{ translate('settings.line_numbers') }}
            </label>
            <p class="hint">{{ translate('settings.line_numbers_hint') }}</p>
          </div>

          <div class="setting-group">
            <label>
              <input type="checkbox" v-model="settings.minimap" />
              {{ translate('settings.minimap') }}
            </label>
            <p class="hint">{{ translate('settings.minimap_hint') }}</p>
          </div>

          <div class="setting-group">
            <label>
              <input type="checkbox" v-model="settings.bracketPairColorization" />
              {{ translate('settings.bracket_pairs') }}
            </label>
            <p class="hint">{{ translate('settings.bracket_pairs_hint') }}</p>
          </div>

          <div class="setting-group">
            <label>
              <input type="checkbox" v-model="settings.errorHighlighting" />
              {{ translate('settings.error_highlight') }}
            </label>
            <p class="hint">{{ translate('settings.error_highlight_hint') }}</p>
          </div>

          <div class="setting-group">
            <label>{{ translate('settings.render_whitespace') }}</label>
            <CustomSelect
              v-model="settings.renderWhitespace"
              :options="whitespaceOptions"
            />
            <p class="hint">{{ translate('settings.render_whitespace_hint') }}</p>
          </div>
        </div>

        <!-- Действия -->
        <div class="settings-section actions-section">
          <h3>Actions</h3>
          <div class="setting-group">
            <button @click="resetProgress" class="btn-danger">
              <SvgIcon name="trash" :size="16" /> {{ translate('settings.reset_progress') }}
            </button>
          </div>
          <div class="setting-group">
            <button @click="openQRModal('export')" class="btn-primary">
              <SvgIcon name="export" :size="16" /> {{ translate('settings.export') }}
            </button>
            <button @click="openQRModal('import')" class="btn-secondary">
              <SvgIcon name="import" :size="16" /> {{ translate('settings.import') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- QR Модалка внутри -->
    <QRModal
      v-if="qrModalOpen"
      :mode="qrMode"
      :qrData="qrData"
      @close="qrModalOpen = false"
      @import="handleImport"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useProgressStore } from '@/stores/progress'
import { useLocale } from '@/composables/useLocale'
import QRModal from '@/components/QRModal.vue'
import CustomSelect from '@/components/CustomSelect.vue'
import SvgIcon from '@/components/SvgIcon.vue'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const settings = useSettingsStore()
const progress = useProgressStore()
const { translate } = useLocale()
const qrModalOpen = ref(false)
const qrMode = ref<'export' | 'import'>('export')
const qrData = ref('')

const whitespaceOptions = [
  { value: 'none', label: 'None' },
  { value: 'selection', label: 'Selection' },
  { value: 'all', label: 'All' }
]

const close = () => emit('close')

const setTheme = (theme: 'dark' | 'light') => {
  settings.theme = theme
  settings.applyTheme()
}

const setLocale = (locale: 'ru' | 'en') => {
  settings.locale = locale
}

const resetProgress = () => {
  if (confirm(translate('settings.reset_progress'))) {
    localStorage.removeItem('ctf_progress')
    progress.load()
  }
}

const openQRModal = (mode: 'export' | 'import') => {
  qrMode.value = mode
  if (mode === 'export') {
    qrData.value = JSON.stringify(progress.exportData())
  }
  qrModalOpen.value = true
}

const handleImport = (data: any) => {
  progress.importData(data)
  alert('Progress imported successfully!')
}
</script>

<style scoped>
/* ===== ОВЕРЛЕЙ ===== */
.settings-modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* ===== МОДАЛКА ===== */
.settings-modal {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 600px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  border: 1px solid var(--border-color);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.modal-header h2 {
  color: var(--text-primary);
  margin: 0;
}
.modal-close {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.5rem;
  cursor: pointer;
}
.modal-close:hover { color: var(--danger); }

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.settings-section {
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}
.settings-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}
.settings-section h3 {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.setting-group {
  margin-bottom: 1rem;
}
.setting-group:last-child {
  margin-bottom: 0;
}
.setting-group label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.language-toggle, .theme-toggle {
  display: flex;
  gap: 0.5rem;
}
.language-toggle button, .theme-toggle button {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.8rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-secondary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85rem;
}
.language-toggle button.active, .theme-toggle button.active {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}

input[type="range"] { width: 100%; }
input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; }

.actions-section .setting-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.btn-danger, .btn-primary, .btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
}
.btn-danger { background: var(--danger); color: white; }
.btn-primary { background: var(--accent); color: white; }
.btn-secondary { background: var(--bg-tertiary); color: var(--text-primary); }
</style>