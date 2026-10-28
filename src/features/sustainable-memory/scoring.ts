import type { CategoryFlowScoreBreakdown } from '@/features/category-flow/types'
import {
  isTextAnswerTooWeak,
  scoreTextRecallAnswer,
} from '@/features/category-flow/scoring'
import type { SustainableMemoryLevelContent } from './types'

export function scoreSustainableMemoryAnswer(
  answer: string,
  content: SustainableMemoryLevelContent,
  readingElapsedMs = 45_000,
  readingTargetMs = 45_000,
): CategoryFlowScoreBreakdown {
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
