import { router } from 'expo-router'
import {
  isFleetingContentCategory,
  isFocusNoiseCategory,
  isReasoningTrapsCategory,
  isScrollHabitCategory,
  isSustainableMemoryCategory,
} from '@/constants/categories'

export function navigateToCategory(categoryId: string, slug?: string | null) {
  if (isScrollHabitCategory(slug)) {
    router.push({
      pathname: '/scroll-habit/levels',
      params: { categoryId },
    })
    return
  }

  if (isFleetingContentCategory(slug)) {
    router.push({
      pathname: '/fleeting-content/levels',
      params: { categoryId },
    })
    return
  }

  if (isReasoningTrapsCategory(slug)) {
    router.push({
      pathname: '/reasoning-traps/levels',
      params: { categoryId },
    })
    return
  }

  if (isFocusNoiseCategory(slug)) {
    router.push({
      pathname: '/focus-noise/levels',
      params: { categoryId },
    })
    return
  }

  if (isSustainableMemoryCategory(slug)) {
    router.push({
      pathname: '/sustainable-memory/levels',
      params: { categoryId },
    })
    return
  }

  router.push({
    pathname: '/category-lessons',
    params: { categoryId },
  })
}
