import { ref } from 'vue'
import { loadPyodide, type PyodideInterface } from 'pyodide'

export function usePython() {
  const pyodide = ref<PyodideInterface | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const init = async () => {
    if (pyodide.value) return
    isLoading.value = true
    error.value = null
    try {
      pyodide.value = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/'
      })
    } catch (e) {
      error.value = String(e)
    } finally {
      isLoading.value = false
    }
  }

  const runPython = async (code: string): Promise<string> => {
    if (!pyodide.value) {
      await init()
    }
    try {
      const py = pyodide.value!
      py.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
      `)
      await py.runPythonAsync(code)
      const result = py.runPython('sys.stdout.getvalue()')
      return String(result) || 'Код выполнен (нет вывода)'
    } catch (e) {
      return `Ошибка: ${e}`
    }
  }

  return { pyodide, isLoading, error, init, runPython }
}