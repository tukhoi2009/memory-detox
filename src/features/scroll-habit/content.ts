import type { ScrollHabitLevelContent } from './types'

const PASSAGE_SAMPLE = `Một nghiên cứu gần đây cho thấy hầu hết mọi người đọc trên màn hình theo kiểu "lướt" thay vì đọc sâu. Khi não không dừng lại đủ lâu để xử lý thông tin, trí nhớ làm việc sẽ không kịp ghi nhận. Hậu quả là bạn có cảm giác đã "đọc rồi" nhưng không nhớ được ý chính.

Để phá vỡ thói quen này, hãy đọc chậm, gạch chân ý quan trọng trong đầu và tự hỏi: "Ý chính của đoạn này là gì?" trước khi chuyển sang dòng tiếp theo.`

export const SCROLL_HABIT_FALLBACK_LEVELS: ScrollHabitLevelContent[] = [
  {
    levelNumber: 1,
    title: 'Cấp độ 1',
    passage: PASSAGE_SAMPLE,
    taskPrompt: 'Viết 3 ý chính bằng từ khóa trong đoạn văn bạn vừa đọc được.',
    keywords: ['lướt', 'đọc sâu', 'trí nhớ', 'ý chính'],
    maxXp: 100,
  },
  {
    levelNumber: 2,
    title: 'Cấp độ 2',
    passage: PASSAGE_SAMPLE,
    taskPrompt: 'Viết 3 ý chính bằng từ khóa trong đoạn văn bạn vừa đọc được.',
    keywords: ['lướt', 'đọc sâu', 'trí nhớ', 'ý chính'],
    maxXp: 100,
  },
  {
    levelNumber: 3,
    title: 'Cấp độ 3',
    passage: PASSAGE_SAMPLE,
    taskPrompt: 'Viết 3 ý chính bằng từ khóa trong đoạn văn bạn vừa đọc được.',
    keywords: ['lướt', 'đọc sâu', 'trí nhớ', 'ý chính'],
    maxXp: 100,
  },
  {
    levelNumber: 4,
    title: 'Cấp độ 4',
    passage: PASSAGE_SAMPLE,
    taskPrompt: 'Viết 3 ý chính bằng từ khóa trong đoạn văn bạn vừa đọc được.',
    keywords: ['lướt', 'đọc sâu', 'trí nhớ', 'ý chính'],
    maxXp: 100,
  },
  {
    levelNumber: 5,
    title: 'Cấp độ 5',
    passage: PASSAGE_SAMPLE,
    taskPrompt: 'Viết 3 ý chính bằng từ khóa trong đoạn văn bạn vừa đọc được.',
    keywords: ['lướt', 'đọc sâu', 'trí nhớ', 'ý chính'],
    maxXp: 100,
  },
  {
    levelNumber: 6,
    title: 'Cấp độ 6',
    passage: PASSAGE_SAMPLE,
    taskPrompt: 'Viết 3 ý chính bằng từ khóa trong đoạn văn bạn vừa đọc được.',
    keywords: ['lướt', 'đọc sâu', 'trí nhớ', 'ý chính'],
    maxXp: 100,
  },
  {
    levelNumber: 7,
    title: 'Cấp độ 7',
    passage: PASSAGE_SAMPLE,
    taskPrompt: 'Viết 3 ý chính bằng từ khóa trong đoạn văn bạn vừa đọc được.',
    keywords: ['lướt', 'đọc sâu', 'trí nhớ', 'ý chính'],
    maxXp: 100,
  },
  {
    levelNumber: 8,
    title: 'Cấp độ 8',
    passage: PASSAGE_SAMPLE,
    taskPrompt: 'Viết 3 ý chính bằng từ khóa trong đoạn văn bạn vừa đọc được.',
    keywords: ['lướt', 'đọc sâu', 'trí nhớ', 'ý chính'],
    maxXp: 100,
  },
]

export const READING_DURATION_SEC = 45

export function levelContentFromLesson(
  sortOrder: number,
  title: string,
  content: string,
  hint: string | null,
  pointsReward: number,
): ScrollHabitLevelContent {
  const levelNumber = sortOrder || 1
  return {
    levelNumber,
    title: title || `Cấp độ ${levelNumber}`,
    passage: content || PASSAGE_SAMPLE,
    taskPrompt:
      hint ??
      'Viết 3 ý chính bằng từ khóa trong đoạn văn bạn vừa đọc được.',
    keywords: ['lướt', 'đọc', 'trí nhớ', 'ý chính', 'tập trung'],
    maxXp: pointsReward > 0 ? pointsReward * 4 : 100,
  }
}
