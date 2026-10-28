import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  SUSTAINABLE_MEMORY_FALLBACK_LEVELS,
  sustainableLevelFromLesson,
} from '@/features/sustainable-memory/content'
import type { SustainableMemoryLevelContent } from '@/features/sustainable-memory/types'
import { CyberSafetyGameService } from '@/services/cyberSafetyGame.service'

export function useSustainableMemoryLevel(lessonId: string | undefined) {
  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () =>
      lessonId ? CyberSafetyGameService.getLessonById(lessonId) : null,
    enabled: !!lessonId && !lessonId.startsWith('sm-fallback-'),
  })

  const content: SustainableMemoryLevelContent | null = useMemo(() => {
    if (!lessonId) return null

    const fallbackMatch = lessonId.match(/^sm-fallback-(\d+)$/)
    if (fallbackMatch) {
      const num = Number(fallbackMatch[1])
      return (
        SUSTAINABLE_MEMORY_FALLBACK_LEVELS.find((l) => l.levelNumber === num) ??
        SUSTAINABLE_MEMORY_FALLBACK_LEVELS[0] ??
        null
      )
    }

    if (lesson) {
      return sustainableLevelFromLesson(
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
