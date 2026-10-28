import type { CategoryFlowScoreBreakdown } from './types'

/** Ngưỡng tối thiểu để coi là qua cấp */
export const PASS_SCORE_THRESHOLD = 50

export function isPassingScore(overall: number): boolean {
  return overall >= PASS_SCORE_THRESHOLD
}

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/** Tỷ lệ từ khóa có trong câu trả lời (0–1) */
export function keywordHitRate(answer: string, keywords: string[]): number {
  if (!keywords.length) return 0
  const normalized = normalizeText(answer)
  const hits = keywords.filter((kw) => normalized.includes(normalizeText(kw)))
  return hits.length / keywords.length
}

export function lengthScore(answer: string, targetChars = 100): number {
  return Math.min(1, answer.trim().length / targetChars)
}

export function xpFromOverall(overall: number, maxXp: number): number {
  if (!isPassingScore(overall)) return 0
  return Math.max(5, Math.round((overall / 100) * maxXp))
}

export function buildScoreBreakdown(
  metrics: {
    accuracy: number
    memory: number
    depth: number
    focus: number
  },
  maxXp: number,
): CategoryFlowScoreBreakdown {
  const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)))
  const accuracy = clamp(metrics.accuracy)
  const memory = clamp(metrics.memory)
  const depth = clamp(metrics.depth)
  const focus = clamp(metrics.focus)
  const overall = Math.round((accuracy + memory + depth + focus) / 4)
  return {
    overall,
    accuracy,
    memory,
    depth,
    focus,
    xpEarned: xpFromOverall(overall, maxXp),
  }
}

/** Câu trả lời text: đủ dài + khớp tối thiểu 25% từ khóa */
export function isTextAnswerTooWeak(
  answer: string,
  keywords: string[],
  minLength = 20,
): boolean {
  const trimmed = answer.trim()
  if (trimmed.length < minLength) return true
  if (!keywords.length) return trimmed.length < 40
  return keywordHitRate(trimmed, keywords) < 0.25
}

export function scoreTextRecallAnswer(params: {
  answer: string
  keywords: string[]
  readingElapsedMs: number
  readingTargetMs: number
  maxXp: number
}): CategoryFlowScoreBreakdown {
  const trimmed = params.answer.trim()
  const kw = keywordHitRate(trimmed, params.keywords)
  const len = lengthScore(trimmed, 100)
  const timeRatio = Math.min(1, params.readingElapsedMs / params.readingTargetMs)

  return buildScoreBreakdown(
    {
      accuracy: kw * 100,
      memory: kw * 80 + len * 20,
      depth: kw * 65 + len * 35,
      focus: timeRatio * 55 + kw * 45,
    },
    params.maxXp,
  )
}

export function statColor(value: number): string {
  return value >= PASS_SCORE_THRESHOLD ? '#22C55E' : '#F59E0B'
}

export function overallColor(overall: number): string {
  return isPassingScore(overall) ? '#22C55E' : '#FF5630'
}
