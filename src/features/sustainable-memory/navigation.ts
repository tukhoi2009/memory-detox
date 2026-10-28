import { router } from 'expo-router'
import type { CategoryFlowSession } from '@/features/category-flow/types'

const LEVELS = '/sustainable-memory/levels'

function paramsFromSession(session: CategoryFlowSession, categoryId: string) {
  return {
    categoryId,
    lessonId: session.lessonId,
    levelNumber: String(session.levelNumber),
  }
}

/** Figma: reading → cooldown (củng cố) → answer */
export const sustainableMemoryNavigation = {
  resume(session: CategoryFlowSession, categoryId: string) {
    const params = paramsFromSession(session, categoryId)
    switch (session.phase) {
      case 'reading':
        router.push({ pathname: '/sustainable-memory/reading' as never, params })
        break
      case 'cooldown':
        router.push({ pathname: '/sustainable-memory/cooldown' as never, params })
        break
      case 'answering':
        router.push({ pathname: '/sustainable-memory/answer' as never, params })
        break
      default:
        router.push({ pathname: '/sustainable-memory/ready' as never, params })
    }
  },
  goLevels(categoryId: string) {
    router.replace({ pathname: LEVELS as never, params: { categoryId } })
  },
}
