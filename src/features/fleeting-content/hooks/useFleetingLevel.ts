import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  FLEETING_FALLBACK_LEVELS,
  fleetingLevelFromLesson,
} from '@/features/fleeting-content/content'
import type { FleetingLevelContent } from '@/features/fleeting-content/types'
import { CyberSafetyGameService } from '@/services/cyberSafetyGame.service'

export function useFleetingLevel(lessonId: string | undefined) {
  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () =>
      lessonId ? CyberSafetyGameService.getLessonById(lessonId) : null,
    enabled: !!lessonId && !lessonId.startsWith('fc-fallback-'),
  })

  const content: FleetingLevelContent | null = useMemo(() => {
    if (!lessonId) return null

    const fallbackMatch = lessonId.match(/^fc-fallback-(\d+)$/)
    if (fallbackMatch) {
      const num = Number(fallbackMatch[1])
      return (
        FLEETING_FALLBACK_LEVELS.find((l) => l.levelNumber === num) ??
        FLEETING_FALLBACK_LEVELS[0] ??
        null
      )
    }

    if (lesson) {
      return fleetingLevelFromLesson(
        lesson.sort_order ?? 1,
        lesson.title,
        lesson.points_reward ?? 25,
      )
    }

    return null
  }, [lesson, lessonId])

  return { lesson, content, isLoading }
}
