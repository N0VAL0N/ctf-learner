// composables/useToast.ts
import { ref } from 'vue'

const toastMessage = ref('')
const toastType = ref<'info' | 'error' | 'success'>('info')
const visible = ref(false)
let timeout: ReturnType<typeof setTimeout> | null = null

export function useToast() {
  const show = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
    toastMessage.value = message
    toastType.value = type
    visible.value = true
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      visible.value = false
    }, 3000)
  }

  const hide = () => {
    visible.value = false
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  return {
    toastMessage,
    toastType,
    visible,
    show,
    hide
  }
}