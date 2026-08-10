<template>
  <div class="filter-overlay" @click.self="close">
    <div class="filter-modal">
      <div class="modal-header">
        <h3>{{ translate('library.filter_title') }}</h3>
        <button @click="close" class="modal-close">✕</button>
      </div>
      <div class="modal-body">
        <div class="filter-group">
          <label>{{ translate('library.filter_category') }}</label>
          <div class="category-options">
            <button v-for="cat in categories" :key="cat" :class="{ active: tempCategory === cat }" @click="tempCategory = cat">
              {{ cat }}
            </button>
            <button :class="{ active: tempCategory === 'Все' }" @click="tempCategory = 'Все'">Все</button>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button @click="apply" class="btn-primary">Применить</button>
        <button @click="close" class="btn-secondary">Отмена</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLocale } from '@/composables/useLocale'

const { translate } = useLocale()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'apply', filters: any): void
}>()

const categories = ['python', 'structures', 'algorithms', 'crypto', 'ctf', 'ai']
const tempCategory = ref('Все')

const apply = () => {
  emit('apply', { category: tempCategory.value })
  emit('close')
}
const close = () => emit('close')
</script>

<style scoped>
.filter-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.filter-modal {
  background: var(--bg-secondary); border-radius: 12px; padding: 1.5rem;
  max-width: 400px; width: 90%;
  border: 1px solid var(--border-color);
}
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.modal-header h3 { color: var(--text-primary); margin: 0; }
.modal-close { background: none; border: none; color: var(--text-muted); font-size: 1.5rem; cursor: pointer; }
.modal-close:hover { color: var(--danger); }
.modal-body { margin-bottom: 1rem; }
.filter-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--text-primary); }
.category-options { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.category-options button {
  padding: 0.3rem 0.8rem; border: 1px solid var(--border-color);
  background: var(--bg-primary); color: var(--text-secondary);
  border-radius: 20px; cursor: pointer; transition: all 0.2s;
}
.category-options button.active { background: var(--accent); color: white; border-color: var(--accent); }
.modal-footer { display: flex; gap: 0.5rem; justify-content: flex-end; }
.btn-primary, .btn-secondary {
  padding: 0.4rem 1rem; border: none; border-radius: 6px; cursor: pointer;
}
.btn-primary { background: var(--accent); color: white; }
.btn-secondary { background: var(--bg-tertiary); color: var(--text-primary); }
</style>