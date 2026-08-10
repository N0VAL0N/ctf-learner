import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Locale } from '@/locales'

export type Theme = 'dark' | 'light'

export const useSettingsStore = defineStore('settings', () => {
  // === Состояние ===
  const theme = ref<Theme>('dark')
  const globalFontSize = ref(16)
  const editorFontSize = ref(14)
  const showLineNumbers = ref(true)
  const minimap = ref(false)
  const locale = ref<Locale>('ru')
  
  // === Новые настройки компилятора ===
  const bracketPairColorization = ref(true)   // подсветка скобок
  const errorHighlighting = ref(true)         // подсветка ошибок (включена всегда, но оставляем на будущее)
  const renderWhitespace = ref<'none' | 'selection' | 'all'>('selection') // отображение пробелов

  // === Загрузка из localStorage ===
  const load = () => {
    const stored = localStorage.getItem('ctf_settings')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        theme.value = data.theme || 'dark'
        globalFontSize.value = data.globalFontSize ?? 16
        editorFontSize.value = data.editorFontSize ?? 14
        showLineNumbers.value = data.showLineNumbers ?? true
        minimap.value = data.minimap ?? false
        locale.value = data.locale || 'ru'
        bracketPairColorization.value = data.bracketPairColorization ?? true
        errorHighlighting.value = data.errorHighlighting ?? true
        renderWhitespace.value = data.renderWhitespace || 'selection'
      } catch (e) {
        console.warn('Failed to load settings:', e)
      }
    }
  }

  // === Сохранение в localStorage ===
  const save = () => {
    localStorage.setItem('ctf_settings', JSON.stringify({
      theme: theme.value,
      globalFontSize: globalFontSize.value,
      editorFontSize: editorFontSize.value,
      showLineNumbers: showLineNumbers.value,
      minimap: minimap.value,
      locale: locale.value,
      bracketPairColorization: bracketPairColorization.value,
      errorHighlighting: errorHighlighting.value,
      renderWhitespace: renderWhitespace.value
    }))
  }

  // === Применение темы ===
  const applyTheme = () => {
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  // === Применение глобального размера шрифта ===
  const applyFontSize = () => {
    document.documentElement.style.fontSize = globalFontSize.value + 'px'
  }

  // === Следим за изменениями ===
  watch(
    [theme, globalFontSize, editorFontSize, showLineNumbers, minimap, locale, bracketPairColorization, errorHighlighting, renderWhitespace],
    () => {
      save()
      applyTheme()
      applyFontSize()
    }
  )

  // === Инициализация ===
  load()
  applyTheme()
  applyFontSize()

  return {
    // состояние
    theme,
    globalFontSize,
    editorFontSize,
    showLineNumbers,
    minimap,
    locale,
    bracketPairColorization,
    errorHighlighting,
    renderWhitespace,
    // методы
    load,
    save,
    applyTheme,
    applyFontSize
  }
})