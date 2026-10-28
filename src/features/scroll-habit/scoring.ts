import type { ScrollHabitLevelContent, ScrollHabitScoreBreakdown } from './types'
import {
  isTextAnswerTooWeak,
  scoreTextRecallAnswer,
} from '@/features/category-flow/scoring'

export function scoreScrollHabitAnswer(
  answer: string,
  content: ScrollHabitLevelContent,
  readingElapsedMs: number,
  readingTargetMs: number,
): ScrollHabitScoreBreakdown {
  return scoreTextRecallAnswer({
    answer,
    keywords: content.keywords,
    readingElapsedMs,
    readingTargetMs,
    maxXp: content.maxXp,
  })
}

export function isAnswerTooWeak(
  answer: string,
  keywords: string[] = [],
): boolean {
  return isTextAnswerTooWeak(answer, keywords, 20)
}
