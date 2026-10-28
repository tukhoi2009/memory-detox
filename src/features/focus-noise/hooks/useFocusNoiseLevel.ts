import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  FOCUS_NOISE_FALLBACK_LEVELS,
  focusLevelFromLesson,
} from '@/features/focus-noise/content'
import type { FocusNoiseLevelContent } from '@/features/focus-noise/types'
import { CyberSafetyGameService } from '@/services/cyberSafetyGame.service'

export function useFocusNoiseLevel(lessonId: string | undefined) {
  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () =>
      lessonId ? CyberSafetyGameService.getLessonById(lessonId) : null,
    enabled: !!lessonId && !lessonId.startsWith('fn-fallback-'),
  })

  const content: FocusNoiseLevelContent | null = useMemo(() => {
    if (!lessonId) return null

    const fallbackMatch = lessonId.match(/^fn-fallback-(\d+)$/)
    if (fallbackMatch) {
      const num = Number(fallbackMatch[1])
      return (
        FOCUS_NOISE_FALLBACK_LEVELS.find((l) => l.levelNumber === num) ??
        FOCUS_NOISE_FALLBACK_LEVELS[0] ??
        null
      )
    }

    if (lesson) {
      return focusLevelFromLesson(
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
