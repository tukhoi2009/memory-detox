import React, { useCallback, useState } from 'react'
import { TextInput } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import AppButton from '@/components/common/AppButton'
import { CategoryFlowScreen } from '@/features/category-flow/components/CategoryFlowScreen'
import { RequirementInstructionCard } from '@/features/category-flow/components/RequirementInstructionCard'
import { useFocusNoiseLevel } from '@/features/focus-noise/hooks/useFocusNoiseLevel'
import { focusNoiseNavigation } from '@/features/focus-noise/navigation'
import {
  scoreFocusNoiseAnswer,
} from '@/features/focus-noise/scoring'
import { focusNoiseSession } from '@/features/focus-noise/sessionStorage'
import { MEMORIZE_DURATION_SEC } from '@/features/category-flow/constants'
import { useAuth } from '@/context/auth-provider'

export default function FocusNoiseAnswerScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { categoryId, lessonId, levelNumber } = useLocalSearchParams<{
    categoryId: string
    lessonId: string
    levelNumber: string
  }>()

  const { content } = useFocusNoiseLevel(lessonId)
  const [answer, setAnswer] = useState('')

  const handleExit = useCallback(async () => {
    if (!user?.id || !categoryId || !lessonId) {
      focusNoiseNavigation.goLevels(categoryId ?? '')
      return
    }
    const base =
      (await focusNoiseSession.load(user.id, lessonId)) ??
      focusNoiseSession.createSession({
        lessonId,
        categoryId,
        levelNumber: Number(levelNumber) || 1,
      })
    await focusNoiseSession.persistExitWhileAnswering(user.id, base)
    focusNoiseNavigation.goLevels(categoryId)
  }, [user?.id, categoryId, lessonId, levelNumber])

  const submit = async () => {
    if (!user?.id || !categoryId || !lessonId || !content) return

    const saved = await focusNoiseSession.load(user.id, lessonId)
    const readingMs = saved?.readingElapsedMs ?? MEMORIZE_DURATION_SEC * 1000
    const breakdown = scoreFocusNoiseAnswer(
      answer.trim(),
      content,
      readingMs,
      MEMORIZE_DURATION_SEC * 1000,
    )

    router.push({
      pathname: '/focus-noise/result',
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
        {content?.taskPrompt ?? 'Kể lại nội dung theo thứ tự logic.'}
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
