export const WORKOUT_CHECKLIST_ITEMS = [
  'Kiểm tra phanh',
  'Kiểm tra lốp',
  'Mang nước',
  'Cảm thấy đủ sức',
] as const

export const WORKOUT_INSTRUCTIONS = [
  'Giữ tốc độ ổn định',
  'Nhịp tim ~60–70%',
] as const

export function workoutChecklistStorageKey(workoutId: string) {
  return `@fitness/workout-checklist/${workoutId}`
}

export function formatPlannedDistanceKm(km: number | null | undefined): string {
  if (km == null) return '–'
  const n = Number(km)
  if (Number.isNaN(n)) return '–'
  if (Number.isInteger(n)) return `${n}km`
  return `${n.toFixed(1).replace('.', ',')}km`
}

export function formatPlannedDurationMinutes(seconds: number | null | undefined): string {
  if (seconds == null) return '–'
  const mins = Math.round(Number(seconds) / 60)
  if (Number.isNaN(mins)) return '–'
  return `${mins} phút`
}
