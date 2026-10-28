import { router } from 'expo-router'
import type { ScrollHabitPhase, ScrollHabitSession } from './types'

const BASE = '/scroll-habit'

export function navigateScrollHabitResume(
  session: ScrollHabitSession,
  categoryId: string,
) {
  const params = {
    categoryId,
    lessonId: session.lessonId,
    levelNumber: String(session.levelNumber),
  }

  switch (session.phase) {
    case 'reading':
      router.push({ pathname: `${BASE}/reading`, params })
      break
    case 'read_complete':
    case 'locked':
      router.push({ pathname: `${BASE}/locked`, params })
      break
    case 'answering':
      router.push({ pathname: `${BASE}/answer`, params })
      break
    default:
      router.push({
        pathname: `${BASE}/ready`,
        params,
      })
  }
}

export function navigateScrollHabitLevels(categoryId: string) {
  router.replace({
    pathname: `${BASE}/levels`,
    params: { categoryId },
  })
}

export function phaseAfterReading(): ScrollHabitPhase {
  return 'locked'
}
