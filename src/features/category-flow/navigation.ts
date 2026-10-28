import { router } from 'expo-router'
import type { CategoryFlowSession } from './types'

export type CategoryFlowRoutes = {
  base: string
  ready: string
  reading: string
  locked: string
  answering: string
  levels: string
}

export function createCategoryFlowNavigation(routes: CategoryFlowRoutes) {
  const paramsFromSession = (session: CategoryFlowSession, categoryId: string) => ({
    categoryId,
    lessonId: session.lessonId,
    levelNumber: String(session.levelNumber),
  })

  return {
    resume(session: CategoryFlowSession, categoryId: string) {
      const params = paramsFromSession(session, categoryId)
      switch (session.phase) {
        case 'reading':
          router.push({ pathname: routes.reading as never, params })
          break
        case 'read_complete':
        case 'locked':
          router.push({ pathname: routes.locked as never, params })
          break
        case 'answering':
          router.push({ pathname: routes.answering as never, params })
          break
        default:
          router.push({ pathname: routes.ready as never, params })
      }
    },
    goLevels(categoryId: string) {
      router.replace({
        pathname: routes.levels as never,
        params: { categoryId },
      })
    },
  }
}
