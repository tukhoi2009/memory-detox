import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import AppButton from '@/components/common/AppButton'
import { CategoryFlowScreen } from '@/features/category-flow/components/CategoryFlowScreen'
import { MissionInstructionCard } from '@/features/category-flow/components/MissionInstructionCard'
import { MemorizeTimerHeader } from '@/features/category-flow/components/MemorizeTimerHeader'
import { MEMORIZE_DURATION_SEC } from '@/features/category-flow/constants'
import { useReadingCountdown } from '@/features/category-flow/hooks/useReadingCountdown'
import { AudioDistractionPill } from '@/features/focus-noise/components/AudioDistractionPill'
import { DistractionNotificationBanner } from '@/features/focus-noise/components/DistractionNotificationBanner'
import { useFocusNoiseLevel } from '@/features/focus-noise/hooks/useFocusNoiseLevel'
import { focusNoiseNavigation } from '@/features/focus-noise/navigation'
import { focusNoiseSession } from '@/features/focus-noise/sessionStorage'
import { useAuth } from '@/context/auth-provider'

const INSTRUCTION =
  'Đọc đoạn văn bên dưới và ghi nhớ thông tin quan trọng. Đừng để những yếu tố gây nhiễu làm bạn mất tập trung.'

export default function FocusNoiseReadingScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { categoryId, lessonId, levelNumber, reread } = useLocalSearchParams<{
    categoryId: string
    lessonId: string
    levelNumber: string
    reread?: string
  }>()

  const { content } = useFocusNoiseLevel(lessonId)
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
      void focusNoiseSession.save(user.id, {
        ...focusNoiseSession.createSession({
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
      const saved = await focusNoiseSession.load(user.id, lessonId)
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
      (await focusNoiseSession.load(user.id, lessonId)) ??
      focusNoiseSession.createSession({
        lessonId,
        categoryId,
        levelNumber: Number(levelNumber) || content?.levelNumber || 1,
      })
    await focusNoiseSession.save(user.id, {
      ...base,
      phase: 'locked',
      readingElapsedMs: Math.max(elapsedRef.current, totalSec * 1000),
      allowReread: false,
      answerDraft: '',
    })
    router.replace({
      pathname: '/focus-noise/locked',
      params: { categoryId, lessonId, levelNumber },
    })
  }

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
        phase: 'reading',
      })
    await focusNoiseSession.persistExitWhileReading(
      user.id,
      base,
      elapsedRef.current,
    )
    focusNoiseNavigation.goLevels(categoryId)
  }, [user?.id, categoryId, lessonId, levelNumber])

  const title = content?.title ?? `Cấp độ ${levelNumber}`

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
      <MissionInstructionCard>{INSTRUCTION}</MissionInstructionCard>
      <DistractionNotificationBanner />

      <Text className="text-[#919EAB] text-xs font-semibold tracking-wider mb-2">
        ĐOẠN VĂN
      </Text>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="bg-[#F4F6F8] rounded-3xl p-4 mb-2">
          <Text className="text-[#212B36] text-base leading-7">
            {content?.passage ?? ''}
          </Text>
        </View>
        <AudioDistractionPill />
      </ScrollView>
    </CategoryFlowScreen>
  )
}
