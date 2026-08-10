<template>
  <div class="custom-select" :class="{ open: isOpen }" ref="dropdownRef">
    <div class="select-trigger" @click="toggleOpen">
      <span class="selected-value">{{ selectedLabel || placeholder }}</span>
      <span class="arrow" :class="{ rotated: isOpen }">▼</span>
    </div>
    <transition name="dropdown">
      <div v-if="isOpen" class="select-dropdown">
        <div
          v-for="option in options"
          :key="option.value"
          class="select-option"
          :class="{ active: modelValue === option.value }"
          @click="selectOption(option)"
        >
          <span class="option-label">{{ option.label }}</span>
          <span v-if="modelValue === option.value" class="check">✓</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  modelValue: string | number
  options: Array<{ value: string | number; label: string }>
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const selectedLabel = computed(() => {
  const found = props.options.find(opt => opt.value === props.modelValue)
  return found?.label || null
})

const toggleOpen = () => {
  isOpen.value = !isOpen.value
}

const selectOption = (option: { value: string | number; label: string }) => {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

// Закрываем при клике вне
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.custom-select {
  position: relative;
  width: 100%;
  max-width: 200px;
  font-size: 0.9rem;
}

.select-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0.8rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  user-select: none;
}
.select-trigger:hover {
  border-color: var(--accent);
}
.custom-select.open .select-trigger {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
}

.selected-value {
  flex: 1;
  color: var(--text-primary);
}

.arrow {
  font-size: 0.7rem;
  color: var(--text-muted);
  transition: transform 0.2s;
  margin-left: 0.5rem;
}
.arrow.rotated {
  transform: rotate(180deg);
}

.select-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  z-index: 100;
  overflow: hidden;
  max-height: 200px;
  overflow-y: auto;
}

.select-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.8rem;
  cursor: pointer;
  transition: background 0.15s;
  color: var(--text-secondary);
}
.select-option:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}
.select-option.active {
  background: var(--accent);
  color: white;
}
.select-option .check {
  color: white;
  font-weight: 600;
}

/* Анимация */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Скрытый скроллбар */
.select-dropdown::-webkit-scrollbar {
  width: 4px;
}
.select-dropdown::-webkit-scrollbar-track {
  background: transparent;
}
.select-dropdown::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

@media (max-width: 768px) {
  .custom-select {
    max-width: 100%;
  }
}
</style>