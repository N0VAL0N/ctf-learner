export type LessonCategory = 'ctf' | 'ege' | 'ai' | 'python' | 'structures' | 'algorithms' | 'crypto'

export interface TheoryBlock {
  title?: string
  content: string
  code?: string
}

export interface ExampleBlock {
  title: string
  code: string
}

export interface Task {
  description: string
  expected_output?: string
  time_limit?: number
  memory_limit?: number
  code?: string
  solution?: string
  difficulty?: 1 | 2 | 3 | 4 | 5
  type?: 'code_insert' | 'full_code'
  code_snippet?: string
  correct_answer?: string
  hint?: string
  starter_code?: string
}

export interface Lesson {
  id: string
  category: LessonCategory
  title: string
  theory?: TheoryBlock[]
  theory_refs?: string[]
  tasks: Task[]
  examples?: ExampleBlock[]
  description?: string
  code?: string
  expected_output?: string
  difficulty?: 1 | 2 | 3 | 4 | 5
  starter_code?: string
  time_limit?: number
  memory_limit?: number
}

export interface LibraryTopic {
  id: string
  title: string
  description: string
  category?: string
  difficulty?: 1 | 2 | 3 | 4 | 5   // <-- добавляем difficulty
  theory: TheoryBlock[]
}

export interface LibraryData {
  topics: LibraryTopic[]
}