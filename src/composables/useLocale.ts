import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { t, type Locale } from '@/locales'

export function useLocale() {
  const settings = useSettingsStore()

  const locale = computed(() => settings.locale)

  const translate = (key: string, params?: Record<string, string | number>) => {
    return t(key, locale.value as Locale, params)
  }

  return { locale, translate }
}