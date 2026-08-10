// composables/useConsole.ts
import { reactive } from 'vue'

export type ConsoleOutput = {
  [key: string | number]: string
}

export function useConsole() {
  const outputs = reactive<ConsoleOutput>({})

  const setOutput = (key: string | number, text: string) => {
    outputs[key] = text
  }

  const clearOutput = (key: string | number) => {
    delete outputs[key]
  }

  const clearAll = () => {
    Object.keys(outputs).forEach(k => delete outputs[k])
  }

  const getOutput = (key: string | number) => outputs[key] || ''

  return {
    outputs,
    setOutput,
    clearOutput,
    clearAll,
    getOutput
  }
}