import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  SCROLL_HABIT_FALLBACK_LEVELS,
  levelContentFromLesson,
} from '@/features/scroll-habit/content'
import type { ScrollHabitLevelContent } from '@/features/scroll-habit/types'
import { CyberSafetyGameService } from '@/services/cyberSafetyGame.service'

export function useScrollHabitLevel(lessonId: string | undefined) {
  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () =>
      lessonId ? CyberSafetyGameService.getLessonById(lessonId) : null,
    enabled: !!lessonId,
  })

  const content: ScrollHabitLevelContent | null = useMemo(() => {
    if (!lessonId) return null

    const fallbackMatch = lessonId.match(/^sh-fallback-(\d+)$/)
    if (fallbackMatch) {
      const num = Number(fallbackMatch[1])
      return (
        SCROLL_HABIT_FALLBACK_LEVELS.find((l) => l.levelNumber === num) ??
        SCROLL_HABIT_FALLBACK_LEVELS[0] ??
        null
      )
    }

    if (lesson) {
      return levelContentFromLesson(
        lesson.sort_order ?? 1,
        lesson.title,
        lesson.content,
        lesson.hint,
        lesson.points_reward ?? 25,
      )
    }

    return null
  }, [lesson, lessonId])

  return { lesson, content, isLoading }
}
