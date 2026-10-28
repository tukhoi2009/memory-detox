import { createCategoryFlowNavigation } from '@/features/category-flow/navigation'

/** Figma: đọc đoạn văn + câu hỏi + MCQ trên một màn */
const ROUTES = {
  base: '/reasoning-traps',
  ready: '/reasoning-traps/ready',
  reading: '/reasoning-traps/play',
  locked: '/reasoning-traps/play',
  answering: '/reasoning-traps/play',
  levels: '/reasoning-traps/levels',
} as const

export const reasoningNavigation = createCategoryFlowNavigation(ROUTES)
