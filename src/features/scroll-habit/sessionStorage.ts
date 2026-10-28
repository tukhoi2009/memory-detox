import AsyncStorage from '@react-native-async-storage/async-storage'
import type { ScrollHabitPhase, ScrollHabitSession } from './types'

const PREFIX = 'scroll-habit-session'

function storageKey(userId: string, lessonId: string) {
  return `${PREFIX}:${userId}:${lessonId}`
}

export async function loadScrollHabitSession(
  userId: string,
  lessonId: string,
): Promise<ScrollHabitSession | null> {
  try {
    const raw = await AsyncStorage.getItem(storageKey(userId, lessonId))
    if (!raw) return null
    return JSON.parse(raw) as ScrollHabitSession
  } catch {
    return null
  }
}

export async function saveScrollHabitSession(
  userId: string,
  session: ScrollHabitSession,
): Promise<void> {
  await AsyncStorage.setItem(
    storageKey(userId, session.lessonId),
    JSON.stringify({ ...session, updatedAt: new Date().toISOString() }),
  )
}

export async function clearScrollHabitSession(
  userId: string,
  lessonId: string,
): Promise<void> {
  await AsyncStorage.removeItem(storageKey(userId, lessonId))
}

export function createSession(params: {
  lessonId: string
  categoryId: string
  levelNumber: number
  phase?: ScrollHabitPhase
}): ScrollHabitSession {
  return {
    lessonId: params.lessonId,
    categoryId: params.categoryId,
    levelNumber: params.levelNumber,
    phase: params.phase ?? 'idle',
    readingElapsedMs: 0,
    allowReread: false,
    answerDraft: '',
    updatedAt: new Date().toISOString(),
  }
}

/** Thoát khi đang đọc — lưu thời gian + vị trí phase */
export async function persistExitWhileReading(
  userId: string,
  session: ScrollHabitSession,
  readingElapsedMs: number,
) {
  await saveScrollHabitSession(userId, {
    ...session,
    phase: 'reading',
    readingElapsedMs,
    answerDraft: '',
  })
}

/** Thoát sau khi đọc xong — bắt buộc trả lời khi quay lại */
export async function persistExitAfterReading(
  userId: string,
  session: ScrollHabitSession,
) {
  await saveScrollHabitSession(userId, {
    ...session,
    phase: 'locked',
    readingElapsedMs: session.readingElapsedMs,
    answerDraft: '',
    allowReread: false,
  })
}

/** Thoát khi đang trả lời — reset câu trả lời */
export async function persistExitWhileAnswering(
  userId: string,
  session: ScrollHabitSession,
) {
  await saveScrollHabitSession(userId, {
    ...session,
    phase: 'locked',
    answerDraft: '',
  })
}
