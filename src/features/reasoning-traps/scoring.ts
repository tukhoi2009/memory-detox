import type { CategoryFlowScoreBreakdown } from '@/features/category-flow/types'
import { buildScoreBreakdown } from '@/features/category-flow/scoring'

export function scoreReasoningAnswer(
  isCorrect: boolean,
  maxXp: number,
): CategoryFlowScoreBreakdown {
  if (isCorrect) {
    return buildScoreBreakdown(
      {
        accuracy: 92,
        memory: 85,
        depth: 88,
        focus: 80,
      },
      maxXp,
    )
  }

  return buildScoreBreakdown(
    {
      accuracy: 8,
      memory: 15,
      depth: 12,
      focus: 35,
    },
    maxXp,
  )
}
