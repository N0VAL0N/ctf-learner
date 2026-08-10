// utils/library.ts
import libraryData from '@/data/library.json'
import type { LibraryTopic } from '@/types/lesson'

// Приводим импортированный JSON к правильному типу
const typedLibrary = libraryData as { topics: LibraryTopic[] }

export function getTopicById(id: string): LibraryTopic | undefined {
  return typedLibrary.topics.find(t => t.id === id)
}

export function getAllTopics(): LibraryTopic[] {
  return typedLibrary.topics
}