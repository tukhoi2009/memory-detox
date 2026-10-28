import type { CategoryFlowScoreBreakdown } from '@/features/category-flow/types'
import { buildScoreBreakdown } from '@/features/category-flow/scoring'
import type { SalesChartData } from './types'

export function scoreChartRebuild(
  placed: (number | null)[],
  chart: SalesChartData,
  notes: string,
  readingElapsedMs: number,
  readingTargetMs: number,
  maxXp: number,
): CategoryFlowScoreBreakdown {
  const target = chart.values
  let matched = 0
  for (let i = 0; i < target.length; i++) {
    if (placed[i] === target[i]) matched++
  }

  const barAccuracy = target.length ? matched / target.length : 0
  const timeRatio = Math.min(1, readingElapsedMs / readingTargetMs)
  const notesLen = notes.trim().length
  const notesBonus =
    barAccuracy >= 0.5 && notesLen >= 15
      ? Math.min(1, notesLen / 40)
      : notesLen >= 8 && barAccuracy >= 0.33
        ? 0.35
        : 0

  return buildScoreBreakdown(
    {
      accuracy: barAccuracy * 100,
      memory: barAccuracy * 100,
      depth: barAccuracy * 70 + notesBonus * 30,
      focus: timeRatio * 100,
    },
    maxXp,
  )
}

export function isChartIncomplete(placed: (number | null)[]): boolean {
  return placed.some((v) => v == null)
}

/** Biểu đồ sai quá nhiều — gợi ý xem lại */
export function isChartAnswerTooWeak(
  placed: (number | null)[],
  chart: SalesChartData,
): boolean {
  if (isChartIncomplete(placed)) return true
  let matched = 0
  for (let i = 0; i < chart.values.length; i++) {
    if (placed[i] === chart.values[i]) matched++
  }
  const rate = chart.values.length ? matched / chart.values.length : 0
  return rate < 0.25
}
