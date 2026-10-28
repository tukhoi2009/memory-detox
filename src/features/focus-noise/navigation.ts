import { createCategoryFlowNavigation } from '@/features/category-flow/navigation'

const ROUTES = {
  base: '/focus-noise',
  ready: '/focus-noise/ready',
  reading: '/focus-noise/reading',
  locked: '/focus-noise/locked',
  answering: '/focus-noise/answer',
  levels: '/focus-noise/levels',
} as const

export const focusNoiseNavigation = createCategoryFlowNavigation(ROUTES)
