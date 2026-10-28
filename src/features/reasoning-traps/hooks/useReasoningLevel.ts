import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  REASONING_FALLBACK_LEVELS,
} from '@/features/reasoning-traps/content'
import type { ReasoningLevelContent } from '@/features/reasoning-traps/types'
import { CyberSafetyGameService } from '@/services/cyberSafetyGame.service'

const LABELS = ['A', 'B', 'C', 'D', 'E', 'F']

function contentFromLessonAndQuiz(
  sortOrder: number,
  title: string,
  passage: string,
  question: string,
  options: string[],
  correctIndex: number,
  pointsReward: number,
): ReasoningLevelContent {
  return {
    levelNumber: sortOrder || 1,
    title: title || `Cấp độ ${sortOrder}`,
    passage: passage || '',
    question,
    options: options.map((text, i) => ({
      label: LABELS[i] ?? String(i + 1),
      text,
    })),
    correctIndex,
    maxXp: pointsReward > 0 ? pointsReward * 4 : 100,
  }
}

export function useReasoningLevel(lessonId: string | undefined) {
  const { data: lesson, isLoading: lessonLoading } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () =>
      lessonId ? CyberSafetyGameService.getLessonById(lessonId) : null,
    enabled: !!lessonId && !lessonId.startsWith('rt-fallback-'),
  })

  const { data: quizzes = [], isLoading: quizLoading } = useQuery({
    queryKey: ['quizzes', lessonId],
    queryFn: () =>
      lessonId ? CyberSafetyGameService.getQuizzesByLesson(lessonId) : [],
    enabled: !!lessonId && !lessonId.startsWith('rt-fallback-'),
  })

  const content: ReasoningLevelContent | null = useMemo(() => {
    if (!lessonId) return null

    const fallbackMatch = lessonId.match(/^rt-fallback-(\d+)$/)
    if (fallbackMatch) {
      const num = Number(fallbackMatch[1])
      return (
        REASONING_FALLBACK_LEVELS.find((l) => l.levelNumber === num) ??
        REASONING_FALLBACK_LEVELS[0] ??
        null
      )
    }

    if (lesson && quizzes.length > 0) {
      const q = quizzes[0]
      return contentFromLessonAndQuiz(
        lesson.sort_order ?? 1,
        lesson.title,
        lesson.content,
        q.question,
        q.options,
        q.correct_index,
        lesson.points_reward ?? 25,
      )
    }

    if (lesson) {
      return contentFromLessonAndQuiz(
        lesson.sort_order ?? 1,
        lesson.title,
        lesson.content,
        'Chọn đáp án đúng nhất.',
        ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'],
        0,
        lesson.points_reward ?? 25,
      )
    }

    return null
  }, [lesson, lessonId, quizzes])

  return {
    content,
    isLoading: lessonLoading || quizLoading,
  }
}
