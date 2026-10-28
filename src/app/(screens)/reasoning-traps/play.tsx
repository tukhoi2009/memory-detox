import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import AppButton from '@/components/common/AppButton'
import { CategoryFlowScreen } from '@/features/category-flow/components/CategoryFlowScreen'
import { MissionInstructionCard } from '@/features/category-flow/components/MissionInstructionCard'
import { QuizOptionCards } from '@/features/category-flow/components/QuizOptionCards'
import { useReasoningLevel } from '@/features/reasoning-traps/hooks/useReasoningLevel'
import { reasoningNavigation } from '@/features/reasoning-traps/navigation'
import { scoreReasoningAnswer } from '@/features/reasoning-traps/scoring'
import { reasoningSession } from '@/features/reasoning-traps/sessionStorage'
import { useAuth } from '@/context/auth-provider'

const INSTRUCTION =
  'Đọc đoạn văn dưới đây và trả lời câu hỏi. Cẩn thận: Thông tin gây nhiễu có thể khiến bạn suy luận sai.'

export default function ReasoningTrapsPlayScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { categoryId, lessonId, levelNumber } = useLocalSearchParams<{
    categoryId: string
    lessonId: string
    levelNumber: string
  }>()

  const { content, isLoading } = useReasoningLevel(lessonId)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!user?.id || !lessonId || !categoryId) return
    void (async () => {
      const saved = await reasoningSession.load(user.id, lessonId)
      if (saved?.answerDraft !== undefined && saved.answerDraft !== '') {
        const idx = Number(saved.answerDraft)
        if (!Number.isNaN(idx)) setSelectedIndex(idx)
        return
      }
      await reasoningSession.save(
        user.id,
        reasoningSession.createSession({
          lessonId,
          categoryId,
          levelNumber: Number(levelNumber) || 1,
          phase: 'answering',
        }),
      )
    })()
  }, [user?.id, lessonId, categoryId, levelNumber])

  const persistSelection = async (index: number | null) => {
    if (!user?.id || !lessonId || !categoryId) return
    const base =
      (await reasoningSession.load(user.id, lessonId)) ??
      reasoningSession.createSession({
        lessonId,
        categoryId,
        levelNumber: Number(levelNumber) || 1,
        phase: 'answering',
      })
    await reasoningSession.save(user.id, {
      ...base,
      phase: 'answering',
      answerDraft: index == null ? '' : String(index),
    })
  }

  const handleExit = useCallback(async () => {
    if (!user?.id || !categoryId || !lessonId) {
      reasoningNavigation.goLevels(categoryId ?? '')
      return
    }
    const base =
      (await reasoningSession.load(user.id, lessonId)) ??
      reasoningSession.createSession({
        lessonId,
        categoryId,
        levelNumber: Number(levelNumber) || 1,
      })
    await reasoningSession.persistExitWhileAnswering(user.id, base)
    reasoningNavigation.goLevels(categoryId)
  }, [user?.id, categoryId, lessonId, levelNumber])

  const submit = async () => {
    if (!content || selectedIndex == null || !user?.id || !categoryId || !lessonId) {
      return
    }

    const isCorrect = selectedIndex === content.correctIndex
    const breakdown = scoreReasoningAnswer(isCorrect, content.maxXp)

    router.push({
      pathname: '/reasoning-traps/result',
      params: {
        categoryId,
        lessonId,
        levelNumber,
        score: JSON.stringify(breakdown),
        isCorrect: isCorrect ? '1' : '0',
      },
    })
  }

  const title = content?.title ?? `Cấp độ ${levelNumber}`

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#9AE600" />
      </View>
    )
  }

  return (
    <CategoryFlowScreen
      title={title}
      showExitConfirm
      onConfirmExit={() => void handleExit()}
      footer={
        <AppButton
          title="Hoàn thành"
          variant="gradient"
          disabled={selectedIndex == null}
          onPress={() => void submit()}
        />
      }
    >
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <MissionInstructionCard>{INSTRUCTION}</MissionInstructionCard>

        <Text className="text-[#919EAB] text-xs font-semibold tracking-wider mb-2">
          ĐOẠN VĂN
        </Text>
        <View className="bg-[#F4F6F8] rounded-3xl p-4 mb-5">
          <Text className="text-[#212B36] text-base leading-7">
            {content?.passage ?? ''}
          </Text>
        </View>

        <Text
          className="text-xs font-semibold tracking-wider mb-3"
          style={{ color: '#FFAB00' }}
        >
          CÂU HỎI
        </Text>
        <Text className="text-[#212B36] text-base font-semibold leading-6 mb-4">
          {content?.question ?? ''}
        </Text>

        {content ? (
          <QuizOptionCards
            options={content.options}
            selectedIndex={selectedIndex}
            onSelect={(index) => {
              setSelectedIndex(index)
              void persistSelection(index)
            }}
          />
        ) : null}

        <View className="h-6" />
      </ScrollView>
    </CategoryFlowScreen>
  )
}
