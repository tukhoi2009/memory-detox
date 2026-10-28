import React, { useCallback, useState } from 'react'
import { TextInput } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import AppButton from '@/components/common/AppButton'
import { CategoryFlowScreen } from '@/features/category-flow/components/CategoryFlowScreen'
import { RequirementInstructionCard } from '@/features/category-flow/components/RequirementInstructionCard'
import { useSustainableMemoryLevel } from '@/features/sustainable-memory/hooks/useSustainableMemoryLevel'
import { sustainableMemoryNavigation } from '@/features/sustainable-memory/navigation'
import {
  scoreSustainableMemoryAnswer,
} from '@/features/sustainable-memory/scoring'
import { MEMORIZE_DURATION_SEC } from '@/features/category-flow/constants'
import { sustainableMemorySession } from '@/features/sustainable-memory/sessionStorage'
import { useAuth } from '@/context/auth-provider'

export default function SustainableMemoryAnswerScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { categoryId, lessonId, levelNumber } = useLocalSearchParams<{
    categoryId: string
    lessonId: string
    levelNumber: string
  }>()

  const { content } = useSustainableMemoryLevel(lessonId)
  const [answer, setAnswer] = useState('')

  const handleExit = useCallback(async () => {
    if (!user?.id || !categoryId || !lessonId) {
      sustainableMemoryNavigation.goLevels(categoryId ?? '')
      return
    }
    const base =
      (await sustainableMemorySession.load(user.id, lessonId)) ??
      sustainableMemorySession.createSession({
        lessonId,
        categoryId,
        levelNumber: Number(levelNumber) || 1,
      })
    await sustainableMemorySession.persistExitWhileAnswering(user.id, base)
    sustainableMemoryNavigation.goLevels(categoryId)
  }, [user?.id, categoryId, lessonId, levelNumber])

  const submit = async () => {
    if (!user?.id || !categoryId || !lessonId || !content) return
    const saved = user?.id
      ? await sustainableMemorySession.load(user.id, lessonId)
      : null
    const readingMs = saved?.readingElapsedMs ?? MEMORIZE_DURATION_SEC * 1000
    const breakdown = scoreSustainableMemoryAnswer(
      answer.trim(),
      content,
      readingMs,
      MEMORIZE_DURATION_SEC * 1000,
    )
    router.push({
      pathname: '/sustainable-memory/result',
      params: {
        categoryId,
        lessonId,
        levelNumber,
        score: JSON.stringify(breakdown),
      },
    })
  }

  const title = content?.title ?? `Cấp độ ${levelNumber}`

  return (
    <CategoryFlowScreen
      title={title}
      showExitConfirm
      onConfirmExit={() => void handleExit()}
      footer={
        <AppButton title="Hoàn thành" variant="gradient" onPress={() => void submit()} />
      }
    >
      <RequirementInstructionCard>
        {content?.taskPrompt ?? 'Hãy viết lại những gì bạn nhớ về đoạn văn.'}
      </RequirementInstructionCard>

      <TextInput
        className="flex-1 bg-white border border-[#DFE3E8] rounded-3xl p-4 text-[#212B36] text-base min-h-[200px]"
        placeholder="Viết gì đó..."
        placeholderTextColor="#919EAB"
        multiline
        textAlignVertical="top"
        value={answer}
        onChangeText={setAnswer}
      />
    </CategoryFlowScreen>
  )
}
