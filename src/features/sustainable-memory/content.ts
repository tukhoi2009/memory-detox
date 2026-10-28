import type { SustainableMemoryLevelContent } from './types'

const PASSAGE_SLEEP = `Giấc ngủ đóng vai trò quan trọng trong việc củng cố trí nhớ. Trong khi ngủ, não bộ xử lý và sắp xếp lại thông tin đã học trong ngày, chuyển chúng từ trí nhớ ngắn hạn sang trí nhớ dài hạn.

Nghiên cứu cho thấy ngủ đủ 7–9 tiếng mỗi đêm giúp cải thiện khả năng ghi nhớ, học tập và giải quyết vấn đề. Thiếu ngủ không chỉ làm giảm sự tập trung mà còn ảnh hưởng đến khả năng ghi nhớ lâu dài.`

export const SUSTAINABLE_MEMORY_FALLBACK_LEVELS: SustainableMemoryLevelContent[] =
  Array.from({ length: 8 }, (_, i) => ({
    levelNumber: i + 1,
    title: `Cấp độ ${i + 1}`,
    passage: PASSAGE_SLEEP,
    taskPrompt: 'Hãy viết lại những gì bạn nhớ về đoạn văn.',
    keywords: [
      'giấc ngủ',
      'trí nhớ',
      'ngắn hạn',
      'dài hạn',
      '7',
      '9',
      'tập trung',
    ],
    maxXp: 100,
  }))

export function sustainableLevelFromLesson(
  sortOrder: number,
  title: string,
  content: string,
  hint: string | null,
  pointsReward: number,
): SustainableMemoryLevelContent {
  const levelNumber = sortOrder || 1
  return {
    levelNumber,
    title: title || `Cấp độ ${levelNumber}`,
    passage: content || PASSAGE_SLEEP,
    taskPrompt: hint ?? 'Hãy viết lại những gì bạn nhớ về đoạn văn.',
    keywords: ['giấc ngủ', 'trí nhớ', 'ngủ', 'não', 'học tập', 'tập trung'],
    maxXp: pointsReward > 0 ? pointsReward * 4 : 100,
  }
}

export const READING_MISSION_TEXT =
  'Đọc kỹ đoạn văn dưới đây và ghi nhớ nội dung trong 24h.'
