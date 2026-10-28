import { createCategoryFlowNavigation } from '@/features/category-flow/navigation'

const ROUTES = {
  base: '/fleeting-content',
  ready: '/fleeting-content/ready',
  reading: '/fleeting-content/reading',
  locked: '/fleeting-content/locked',
  answering: '/fleeting-content/answer',
  levels: '/fleeting-content/levels',
} as const

export const fleetingNavigation = createCategoryFlowNavigation(ROUTES)
