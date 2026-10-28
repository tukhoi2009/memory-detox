import type { CategoryFlowScoreBreakdown } from '@/features/category-flow/types'
import {
  isTextAnswerTooWeak,
  scoreTextRecallAnswer,
} from '@/features/category-flow/scoring'
import type { FocusNoiseLevelContent } from './types'

export function scoreFocusNoiseAnswer(
  answer: string,
  content: FocusNoiseLevelContent,
  readingElapsedMs: number,
  readingTargetMs: number,
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
