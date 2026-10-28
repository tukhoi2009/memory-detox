export type CategoryFlowPhase =
  | 'idle'
  | 'reading'
  | 'read_complete'
  | 'locked'
  | 'cooldown'
  | 'answering'
  | 'completed'

export type CategoryFlowSession = {
  lessonId: string
  categoryId: string
  levelNumber: number
  phase: CategoryFlowPhase
  readingElapsedMs: number
  allowReread: boolean
  answerDraft: string
  chartValues?: (number | null)[]
  notesDraft?: string
  /** ISO — màn chờ củng cố (Ghi nhớ bền vững) */
  cooldownEndsAt?: string
  updatedAt: string
}

export type CategoryFlowScoreBreakdown = {
  overall: number
  accuracy: number
  memory: number
  depth: number
  focus: number
  xpEarned: number
}
