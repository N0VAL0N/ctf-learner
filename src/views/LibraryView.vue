<template>
  <div class="library">
    <h1>{{ translate('library.title') }}</h1>
    <p class="subtitle">{{ translate('library.subtitle') }}</p>

    <div class="library-filters">
      <div class="search-wrapper">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="translate('library.search_placeholder')"
          class="search-input"
        />
        <button @click="filterModalOpen = true" class="search-btn">
          <SvgIcon name="filter" :size="20" />
        </button>
      </div>
    </div>

    <div class="library-list">
      <div
        v-for="topic in filteredTopics"
        :key="topic.id"
        class="library-item"
        @click="openModal(topic)"
      >
        <div class="item-icon"><SvgIcon :name="topic.category || 'default'" :size="24" /></div>
        <div class="item-content">
          <h3>{{ topic.title }}</h3>
          <p class="item-desc">{{ topic.description }}</p>
          <div class="item-meta">
            <span class="item-tag">{{ topic.category || 'Общее' }}</span>
            <span class="item-stars">{{ getStars(topic.difficulty || 1) }}</span>
          </div>
        </div>
        <div class="item-arrow">→</div>
      </div>
    </div>

    <!-- Фильтры модалка -->
    <div v-if="filterModalOpen" class="modal-overlay" @click.self="filterModalOpen = false">
      <div class="modal-content filter-modal">
        <div class="modal-header">
          <h2>{{ translate('library.filter_title') }}</h2>
          <button @click="filterModalOpen = false" class="modal-close">✕</button>
        </div>
        <div class="modal-body">
          <!-- Категория -->
          <div class="filter-group">
            <label>{{ translate('library.filter_category') }}</label>
            <div class="category-options">
              <button v-for="cat in categories" :key="cat" :class="{ active: tempCategory === cat }" @click="tempCategory = cat">
                {{ cat }}
              </button>
              <button :class="{ active: tempCategory === 'Все' }" @click="tempCategory = 'Все'">Все</button>
            </div>
          </div>

          <!-- Сложность -->
          <div class="filter-group">
            <label>{{ translate('library.filter_difficulty') }}</label>
            <div class="difficulty-stars">
              <span
                v-for="n in 5"
                :key="n"
                class="star"
                :class="{ active: n <= tempDifficulty }"
                @click="tempDifficulty = n"
                @mouseenter="hoverDifficulty = n"
                @mouseleave="hoverDifficulty = 0"
              >
                {{ n <= (hoverDifficulty || tempDifficulty) ? '★' : '☆' }}
              </span>
              <span v-if="tempDifficulty === 0" class="difficulty-label">Любая</span>
              <span v-else class="difficulty-label">{{ tempDifficulty }}</span>
            </div>
          </div>

          <!-- Сортировка -->
          <div class="filter-group">
            <label>{{ translate('library.sort_by') }}</label>
            <div class="sort-options">
              <button :class="{ active: tempSort === 'title_asc' }" @click="tempSort = 'title_asc'">По названию ↑</button>
              <button :class="{ active: tempSort === 'title_desc' }" @click="tempSort = 'title_desc'">По названию ↓</button>
              <button :class="{ active: tempSort === 'difficulty_asc' }" @click="tempSort = 'difficulty_asc'">По сложности ↑</button>
              <button :class="{ active: tempSort === 'difficulty_desc' }" @click="tempSort = 'difficulty_desc'">По сложности ↓</button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="applyFilters" class="btn-primary">Применить</button>
          <button @click="filterModalOpen = false" class="btn-secondary">Отмена</button>
        </div>
      </div>
    </div>

    <!-- Модалка темы с консолью -->
    <div v-if="selectedTopic" class="modal-overlay topic-modal" @click.self="closeModal">
      <div class="modal-content topic-content">
        <div class="modal-header">
          <h2>{{ selectedTopic.title }}</h2>
          <button @click="closeModal" class="modal-close">✕</button>
        </div>
        <div class="modal-body">
          <div v-for="(block, idx) in selectedTopic.theory" :key="idx" class="theory-block">
            <h4 v-if="block.title">{{ block.title }}</h4>
            <p>{{ block.content }}</p>
            <div v-if="block.code" class="code-block">
              <pre><code>{{ block.code }}</code></pre>
              <button @click="runBlock(block, idx)" class="btn-run-block">▶ Запустить</button>
            </div>
            <div v-if="outputConsole.getOutput(idx)" class="console-output">
              <div class="console-header">
                <span>Вывод</span>
                <button @click="outputConsole.clearOutput(idx)" class="console-close">✕</button>
              </div>
              <pre>{{ outputConsole.getOutput(idx) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { usePython } from '@/composables/usePython'
import { useConsole } from '@/composables/useConsole'
import { getAllTopics } from '@/utils/library'
import SvgIcon from '@/components/SvgIcon.vue'
import type { LibraryTopic } from '@/types/lesson'

const { translate } = useLocale()
const { runPython } = usePython()
const outputConsole = useConsole()

const searchQuery = ref('')
const filterModalOpen = ref(false)

const tempCategory = ref('Все')
const tempDifficulty = ref(0)
const hoverDifficulty = ref(0)
const tempSort = ref('title_asc')

const selectedTopic = ref<LibraryTopic | null>(null)

const topics = getAllTopics()
const categories = ['python', 'structures', 'algorithms', 'crypto', 'ctf', 'ai']

const getStars = (level: number) => '★'.repeat(level) + '☆'.repeat(5 - level)

const filteredTopics = computed(() => {
  let result = topics

  if (tempCategory.value !== 'Все') {
    result = result.filter(t => t.category === tempCategory.value)
  }
  if (tempDifficulty.value > 0) {
    result = result.filter(t => (t.difficulty || 1) === tempDifficulty.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.theory.some(b => b.content.toLowerCase().includes(q) || (b.code && b.code.toLowerCase().includes(q)))
    )
  }

  switch (tempSort.value) {
    case 'title_asc': result.sort((a, b) => a.title.localeCompare(b.title)); break
    case 'title_desc': result.sort((a, b) => b.title.localeCompare(a.title)); break
    case 'difficulty_asc': result.sort((a, b) => (a.difficulty || 1) - (b.difficulty || 1)); break
    case 'difficulty_desc': result.sort((a, b) => (b.difficulty || 1) - (a.difficulty || 1)); break
  }
  return result
})

const applyFilters = () => {
  filterModalOpen.value = false
}

const openModal = (topic: LibraryTopic) => {
  selectedTopic.value = topic
  outputConsole.clearAll()
}

const closeModal = () => {
  selectedTopic.value = null
  outputConsole.clearAll()
}

const runBlock = async (block: any, idx: number) => {
  if (!block.code) return
  try {
    const result = await runPython(block.code)
    outputConsole.setOutput(idx, `--- ${block.title || 'Пример'} ---\n${result}`) 
  } catch (e) {
    outputConsole.setOutput(idx, `--- ${block.title || 'Пример'} ---\n❌ Error: ${e}`)
  }
}
</script>

<style scoped>
/* Все стили остаются теми же, что и раньше, они уже были в LibraryView */
.library { height: 100%; display: flex; flex-direction: column; padding: 1.5rem; background: var(--bg-primary); overflow: hidden; }
h1 { margin-bottom: 0.25rem; color: var(--text-primary); }
.subtitle { color: var(--text-secondary); margin-bottom: 1.5rem; }
.library-filters { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; flex-shrink: 0; align-items: center; }
.search-wrapper { flex: 1 1 250px; display: flex; gap: 0.3rem; align-items: center; }
.search-input { flex: 1; padding: 0.6rem 1rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-secondary); color: var(--text-primary); font-size: 1rem; }
.search-btn { background: none; border: none; cursor: pointer; color: var(--text-secondary); padding: 0.3rem; transition: color 0.2s; display: flex; align-items: center; justify-content: center; }
.search-btn:hover { color: var(--accent); }
.library-list { flex: 1; overflow-y: auto; padding-right: 4px; display: flex; flex-direction: column; gap: 0.5rem; }
.library-list::-webkit-scrollbar { width: 4px; }
.library-list::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 4px; }
.library-item { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1rem; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); cursor: pointer; transition: all 0.2s; width: 85%; }
.library-item:hover { border-color: var(--accent); transform: translateX(4px); }
.item-icon { display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.item-content { flex: 1; display: flex; flex-direction: column; gap: 0.15rem; overflow: hidden; }
.item-content h3 { color: var(--text-primary); font-size: 0.95rem; margin: 0; }
.item-desc { color: var(--text-muted); font-size: 0.75rem; margin: 0; }
.item-meta { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
.item-tag { font-size: 0.6rem; padding: 0.1rem 0.5rem; border-radius: 10px; background: var(--bg-tertiary); color: var(--text-muted); align-self: flex-start; }
.item-stars { font-size: 0.7rem; color: #f59e0b; letter-spacing: 0.5px; }
.item-arrow { color: var(--text-muted); font-size: 1.2rem; flex-shrink: 0; }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: var(--bg-secondary); border-radius: 12px; padding: 1.5rem; max-width: 500px; width: 90%; max-height: 85vh; overflow-y: auto; border: 1px solid var(--border-color); }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.modal-header h2 { color: var(--text-primary); margin: 0; }
.modal-close { background: none; border: none; color: var(--text-muted); font-size: 1.5rem; cursor: pointer; }
.modal-close:hover { color: var(--danger); }
.filter-group { margin-bottom: 1rem; }
.filter-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--text-primary); }
.category-options, .sort-options { display: flex; flex-wrap: wrap; gap: 0.3rem; }
.category-options button, .sort-options button { padding: 0.25rem 0.6rem; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-secondary); border-radius: 12px; cursor: pointer; transition: all 0.2s; font-size: 0.75rem; }
.category-options button.active, .sort-options button.active { background: var(--accent); color: white; border-color: var(--accent); }
.difficulty-stars { display: flex; gap: 0.2rem; align-items: center; cursor: pointer; }
.difficulty-stars .star { font-size: 1.2rem; color: var(--text-muted); transition: color 0.2s; user-select: none; }
.difficulty-stars .star.active { color: #f59e0b; }
.difficulty-stars .star:hover { transform: scale(1.2); }
.difficulty-label { margin-left: 0.5rem; font-size: 0.8rem; color: var(--text-muted); }
.modal-footer { display: flex; gap: 0.5rem; justify-content: flex-end; }
.btn-primary, .btn-secondary { padding: 0.3rem 0.8rem; border: none; border-radius: 6px; cursor: pointer; font-size: 0.8rem; }
.btn-primary { background: var(--accent); color: white; }
.btn-secondary { background: var(--bg-tertiary); color: var(--text-primary); }
.topic-modal .modal-content { max-width: 700px; }
.topic-content .modal-body { display: flex; flex-direction: column; gap: 1rem; }
.theory-block { padding-bottom: 1rem; border-bottom: 1px solid var(--border-color); }
.theory-block:last-child { border-bottom: none; }
.code-block { background: var(--bg-primary); padding: 0.75rem; border-radius: 6px; overflow-x: auto; position: relative; }
.code-block pre { margin: 0; font-family: 'Courier New', monospace; font-size: 0.85rem; color: var(--text-primary); }
.btn-run-block { margin-top: 0.5rem; padding: 0.2rem 0.6rem; background: var(--accent); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.7rem; }
.btn-run-block:hover { filter: brightness(0.9); }
.console-output { margin-top: 0.5rem; border: 1px solid var(--border-color); border-radius: 6px; overflow: hidden; background: var(--console-bg, #0d0d1a); }
.console-output .console-header { display: flex; justify-content: space-between; padding: 0.2rem 0.6rem; background: var(--console-header-bg, #1a1a2e); border-bottom: 1px solid var(--border-color); color: var(--text-muted); font-size: 0.7rem; }
.console-output .console-close { background: none; border: none; color: var(--text-muted); cursor: pointer; }
.console-output .console-close:hover { color: var(--danger); }
.console-output pre { margin: 0; padding: 0.3rem 0.6rem; font-family: 'Courier New', monospace; font-size: 0.75rem; color: var(--console-text, #c9d1d9); white-space: pre-wrap; max-height: 150px; overflow-y: auto; }
</style>