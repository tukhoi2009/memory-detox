import React, { useCallback, useState } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import AppButton from '@/components/common/AppButton'
import { CategoryFlowScreen } from '@/features/category-flow/components/CategoryFlowScreen'
import { RequirementInstructionCard } from '@/features/category-flow/components/RequirementInstructionCard'
import { ChartRebuildBoard } from '@/features/fleeting-content/components/ChartRebuildBoard'
import { useFleetingLevel } from '@/features/fleeting-content/hooks/useFleetingLevel'
import { fleetingNavigation } from '@/features/fleeting-content/navigation'
import { scoreChartRebuild } from '@/features/fleeting-content/scoring'
import { fleetingSession } from '@/features/fleeting-content/sessionStorage'
import { MEMORIZE_DURATION_SEC } from '@/features/category-flow/constants'
import { useAuth } from '@/context/auth-provider'

export default function FleetingContentAnswerScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { categoryId, lessonId, levelNumber } = useLocalSearchParams<{
    categoryId: string
    lessonId: string
    levelNumber: string
  }>()

  const { content } = useFleetingLevel(lessonId)
  const [placements, setPlacements] = useState<(number | null)[]>(
    () => Array(6).fill(null),
  )
  const [notes, setNotes] = useState('')

  const handleExit = useCallback(async () => {
    if (!user?.id || !categoryId || !lessonId) {
      fleetingNavigation.goLevels(categoryId ?? '')
      return
    }
    const base =
      (await fleetingSession.load(user.id, lessonId)) ??
      fleetingSession.createSession({
        lessonId,
        categoryId,
        levelNumber: Number(levelNumber) || 1,
      })
    await fleetingSession.persistExitWhileAnswering(user.id, base)
    fleetingNavigation.goLevels(categoryId)
  }, [user?.id, categoryId, lessonId, levelNumber])

  const submit = async () => {
    if (!content || !user?.id || !categoryId || !lessonId) return

    const saved = await fleetingSession.load(user.id, lessonId)
    const readingMs = saved?.readingElapsedMs ?? MEMORIZE_DURATION_SEC * 1000

    const breakdown = scoreChartRebuild(
      placements,
      content.chart,
      notes,
      readingMs,
      MEMORIZE_DURATION_SEC * 1000,
      content.maxXp,
    )

    router.push({
      pathname: '/fleeting-content/result',
      params: {
        categoryId,
        lessonId,
        levelNumber,
        score: JSON.stringify(breakdown),
      },
    })
  }

  const reread = () => {
    router.push({
      pathname: '/fleeting-content/reading',
      params: { categoryId, lessonId, levelNumber, reread: '1' },
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
        Kéo thả các cột để tái hiện biểu đồ đúng như bạn nhớ.
      </RequirementInstructionCard>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-3xl p-4 mb-3 border border-[#F4F6F8]">
          {content ? (
            <ChartRebuildBoard
              chart={content.chart}
              placements={placements}
              onChange={setPlacements}
            />
          ) : null}
        </View>

        <Text className="text-[#212B36] font-semibold text-sm mb-2">Ghi chú:</Text>
        <TextInput
          className="bg-white border border-[#DFE3E8] rounded-3xl p-4 text-[#212B36] text-base min-h-[100px] mb-2"
          placeholder="Viết gì đó..."
          placeholderTextColor="#919EAB"
          multiline
          textAlignVertical="top"
          value={notes}
          onChangeText={setNotes}
        />

        <TouchableOpacity onPress={reread} className="items-center py-2 mb-4">
          <Text className="text-[#212B36] font-semibold underline">
            Xem lại biểu đồ
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </CategoryFlowScreen>
  )
}
