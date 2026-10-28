export const SCROLL_HABIT_SLUG = 'scroll-habit'
export const FLEETING_CONTENT_SLUG = 'fleeting-content'
export const REASONING_TRAPS_SLUG = 'reasoning-traps'
export const FOCUS_NOISE_SLUG = 'focus-noise'
export const SUSTAINABLE_MEMORY_SLUG = 'sustainable-memory'

export function isScrollHabitCategory(slug: string | null | undefined): boolean {
  return slug === SCROLL_HABIT_SLUG
}

export function isFleetingContentCategory(slug: string | null | undefined): boolean {
  return slug === FLEETING_CONTENT_SLUG
}

export function isReasoningTrapsCategory(slug: string | null | undefined): boolean {
  return slug === REASONING_TRAPS_SLUG
}

export function isFocusNoiseCategory(slug: string | null | undefined): boolean {
  return slug === FOCUS_NOISE_SLUG
}

export function isSustainableMemoryCategory(slug: string | null | undefined): boolean {
  return slug === SUSTAINABLE_MEMORY_SLUG
}
