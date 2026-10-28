export type ReasoningQuizOption = {
  label: string
  text: string
}

export type ReasoningLevelContent = {
  levelNumber: number
  title: string
  passage: string
  question: string
  options: ReasoningQuizOption[]
  correctIndex: number
  maxXp: number
}
