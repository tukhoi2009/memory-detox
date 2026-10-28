import type { ReasoningLevelContent } from './types'

const PASSAGE_MINH = `Minh là nhân viên văn phòng, thường đi làm đúng giờ và ít nói. Gần đây anh bắt đầu ở lại muộn và kiểm tra lại công việc nhiều lần hơn.

Một số đồng nghiệp cho rằng Minh đang cố gắng để được thăng chức. Người khác lại nghĩ anh đang gặp vấn đề về hiệu suất. Tuy nhiên, không có bằng chứng cho thấy hiệu suất trước đây của Minh kém.`

const QUESTION_MINH =
  'Điều nào giải thích hợp lý nhất cho hành vi gần đây của Minh?'

const OPTIONS_MINH = [
  { label: 'A', text: 'Minh đang cố gắng gây ấn tượng để được thăng chức' },
  { label: 'B', text: 'Minh đang gặp vấn đề về hiệu suất làm việc' },
  { label: 'C', text: 'Minh đang trở nên cẩn trọng hơn trong công việc' },
  { label: 'D', text: 'Minh bị quản lý gây áp lực nên phải làm thêm giờ' },
]

function level(n: number): ReasoningLevelContent {
  return {
    levelNumber: n,
    title: `Cấp độ ${n}`,
    passage: PASSAGE_MINH,
    question: QUESTION_MINH,
    options: OPTIONS_MINH,
    correctIndex: 2,
    maxXp: 100,
  }
}

export const REASONING_FALLBACK_LEVELS: ReasoningLevelContent[] = Array.from(
  { length: 8 },
  (_, i) => level(i + 1),
)
