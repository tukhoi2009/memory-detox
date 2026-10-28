import type { FocusNoiseLevelContent } from './types'

const PASSAGE_SOLAR = `Năng lượng mặt trời là nguồn năng lượng tái tạo được khai thác từ ánh sáng và nhiệt của mặt trời. Các tấm pin mặt trời có thể chuyển đổi ánh sáng thành điện năng, cung cấp cho các hộ gia đình và doanh nghiệp.

Ưu điểm của năng lượng mặt trời là sạch, không gây ô nhiễm và gần như vô tận. Tuy nhiên, hiệu suất của tấm pin phụ thuộc vào thời tiết và cần diện tích lắp đặt phù hợp.`

export const FOCUS_NOISE_FALLBACK_LEVELS: FocusNoiseLevelContent[] = Array.from(
  { length: 8 },
  (_, i) => ({
    levelNumber: i + 1,
    title: `Cấp độ ${i + 1}`,
    passage: PASSAGE_SOLAR,
    taskPrompt: 'Kể lại nội dung theo thứ tự logic.',
    keywords: [
      'năng lượng mặt trời',
      'pin mặt trời',
      'điện',
      'carbon',
      'thời tiết',
      'lắp đặt',
    ],
    maxXp: 100,
  }),
)

export function focusLevelFromLesson(
  sortOrder: number,
  title: string,
  content: string,
  hint: string | null,
  pointsReward: number,
): FocusNoiseLevelContent {
  const levelNumber = sortOrder || 1
  return {
    levelNumber,
    title: title || `Cấp độ ${levelNumber}`,
    passage: content || PASSAGE_SOLAR,
    taskPrompt: hint ?? 'Kể lại nội dung theo thứ tự logic.',
    keywords: [
      'năng lượng',
      'mặt trời',
      'pin',
      'điện',
      'thời tiết',
      'carbon',
    ],
    maxXp: pointsReward > 0 ? pointsReward * 4 : 100,
  }
}
