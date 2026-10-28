export type ScrollHabitPhase =
  | 'idle'
  | 'reading'
  | 'read_complete'
  | 'locked'
  | 'answering'
  | 'completed'

export type ScrollHabitSession = {
  lessonId: string
  categoryId: string
  levelNumber: number
  phase: ScrollHabitPhase
  /** Thời gian đã đọc (ms), lưu khi thoát giữa lúc đọc */
  readingElapsedMs: number
  /** Cho phép xem lại đoạn văn sau khi không trả lời được */
  allowReread: boolean
  answerDraft: string
  updatedAt: string
}

export type ScrollHabitLevelContent = {
  levelNumber: number
  title: string
  passage: string
  taskPrompt: string
  keywords: string[]
  maxXp: number
}

export type ScrollHabitScoreBreakdown = {
  overall: number
  accuracy: number
  memory: number
  depth: number
  focus: number
  xpEarned: number
}
