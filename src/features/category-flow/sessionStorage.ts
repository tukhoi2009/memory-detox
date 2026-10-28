import AsyncStorage from '@react-native-async-storage/async-storage'
import type { CategoryFlowPhase, CategoryFlowSession } from './types'

export function createCategoryFlowSessionStorage(flowKey: string) {
  const prefix = `${flowKey}-session`

  function storageKey(userId: string, lessonId: string) {
    return `${prefix}:${userId}:${lessonId}`
  }

  async function load(
    userId: string,
    lessonId: string,
  ): Promise<CategoryFlowSession | null> {
    try {
      const raw = await AsyncStorage.getItem(storageKey(userId, lessonId))
      if (!raw) return null
      return JSON.parse(raw) as CategoryFlowSession
    } catch {
      return null
    }
  }

  async function save(userId: string, session: CategoryFlowSession): Promise<void> {
    await AsyncStorage.setItem(
      storageKey(userId, session.lessonId),
      JSON.stringify({ ...session, updatedAt: new Date().toISOString() }),
    )
  }

  async function clear(userId: string, lessonId: string): Promise<void> {
    await AsyncStorage.removeItem(storageKey(userId, lessonId))
  }

  function createSession(params: {
    lessonId: string
    categoryId: string
    levelNumber: number
    phase?: CategoryFlowPhase
  }): CategoryFlowSession {
    return {
      lessonId: params.lessonId,
      categoryId: params.categoryId,
      levelNumber: params.levelNumber,
      phase: params.phase ?? 'idle',
      readingElapsedMs: 0,
      allowReread: false,
      answerDraft: '',
      chartValues: undefined,
      notesDraft: '',
      updatedAt: new Date().toISOString(),
    }
  }

  async function persistExitWhileReading(
    userId: string,
    session: CategoryFlowSession,
    readingElapsedMs: number,
  ) {
    await save(userId, {
      ...session,
      phase: 'reading',
      readingElapsedMs,
      answerDraft: '',
    })
  }

  async function persistExitAfterReading(
    userId: string,
    session: CategoryFlowSession,
  ) {
    await save(userId, {
      ...session,
      phase: 'locked',
      answerDraft: '',
      chartValues: undefined,
      notesDraft: '',
      allowReread: false,
    })
  }

  async function persistExitWhileAnswering(
    userId: string,
    session: CategoryFlowSession,
  ) {
    await save(userId, {
      ...session,
      phase: 'locked',
      answerDraft: '',
      chartValues: undefined,
      notesDraft: '',
    })
  }

  return {
    load,
    save,
    clear,
    createSession,
    persistExitWhileReading,
    persistExitAfterReading,
    persistExitWhileAnswering,
  }
}
