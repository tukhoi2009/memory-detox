import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import AppButton from '@/components/common/AppButton'
import { CategoryFlowScreen } from '@/features/category-flow/components/CategoryFlowScreen'
import { MemorizeTimerHeader } from '@/features/category-flow/components/MemorizeTimerHeader'
import { MissionInstructionCard } from '@/features/category-flow/components/MissionInstructionCard'
import { MEMORIZE_DURATION_SEC } from '@/features/category-flow/constants'
import { useReadingCountdown } from '@/features/category-flow/hooks/useReadingCountdown'
import { useFleetingLevel } from '@/features/fleeting-content/hooks/useFleetingLevel'
import { SalesChartCard } from '@/features/fleeting-content/components/SalesChartCard'
import { fleetingNavigation } from '@/features/fleeting-content/navigation'
import { fleetingSession } from '@/features/fleeting-content/sessionStorage'
import { useAuth } from '@/context/auth-provider'

export default function FleetingContentReadingScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { categoryId, lessonId, levelNumber, reread } = useLocalSearchParams<{
    categoryId: string
    lessonId: string
    levelNumber: string
    reread?: string
  }>()

  const { content } = useFleetingLevel(lessonId)
  const totalSec = MEMORIZE_DURATION_SEC
  const isReread = reread === '1'
  const [sessionReady, setSessionReady] = useState(false)
  const [initialElapsedMs, setInitialElapsedMs] = useState(0)
  const goLockedRef = useRef<() => Promise<void>>(async () => {})

  useEffect(() => {
    if (!user?.id || !lessonId) return

    if (isReread) {
      setInitialElapsedMs(0)
      setSessionReady(true)
      void fleetingSession.save(user.id, {
        ...fleetingSession.createSession({
          lessonId,
          categoryId: categoryId ?? '',
          levelNumber: Number(levelNumber) || 1,
          phase: 'reading',
        }),
        allowReread: false,
        readingElapsedMs: 0,
      })
      return
    }

    void (async () => {
      const saved = await fleetingSession.load(user.id, lessonId)
      setInitialElapsedMs(saved?.readingElapsedMs ?? 0)
      setSessionReady(true)
    })()
  }, [user?.id, lessonId, isReread, categoryId, levelNumber])

  const { remainingSec, elapsedRef, triggerComplete } = useReadingCountdown({
    totalSec,
    onTimerComplete: () => goLockedRef.current(),
    initialElapsedMs,
    reset: isReread,
    enabled: sessionReady,
  })

  goLockedRef.current = async () => {
    if (!user?.id || !categoryId || !lessonId) return
    const base =
      (await fleetingSession.load(user.id, lessonId)) ??
      fleetingSession.createSession({
        lessonId,
        categoryId,
        levelNumber: Number(levelNumber) || content?.levelNumber || 1,
      })
    await fleetingSession.save(user.id, {
      ...base,
      phase: 'locked',
      readingElapsedMs: Math.max(elapsedRef.current, totalSec * 1000),
    })
    router.replace({
      pathname: '/fleeting-content/locked',
      params: { categoryId, lessonId, levelNumber },
    })
  }

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
        phase: 'reading',
      })
    await fleetingSession.persistExitWhileReading(
      user.id,
      base,
      elapsedRef.current,
    )
    fleetingNavigation.goLevels(categoryId)
  }, [user?.id, categoryId, lessonId, levelNumber])

  const title = content?.title ?? `Cấp độ ${levelNumber}`
  const chart = content?.chart

  return (
    <CategoryFlowScreen
      title={title}
      showExitConfirm
      onConfirmExit={() => void handleExit()}
      footer={
        <AppButton title="Tiếp theo" variant="gradient" onPress={triggerComplete} />
      }
    >
      <MemorizeTimerHeader remainingSec={remainingSec} totalSec={totalSec} />

      <MissionInstructionCard>
        Quan sát biểu đồ dưới đây và ghi nhớ. Sau đó vẽ lại biểu đồ bằng cách kéo thả.
      </MissionInstructionCard>

      <Text className="text-[#919EAB] text-xs font-semibold tracking-wider mb-2">
        BIỂU ĐỒ
      </Text>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {chart ? <SalesChartCard chart={chart} /> : null}
      </ScrollView>
    </CategoryFlowScreen>
  )
}
