import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import AppButton from '@/components/common/AppButton'
import { CategoryFlowScreen } from '@/features/category-flow/components/CategoryFlowScreen'
import { MissionInstructionCard } from '@/features/category-flow/components/MissionInstructionCard'
import { MemorizeTimerHeader } from '@/features/category-flow/components/MemorizeTimerHeader'
import { MEMORIZE_DURATION_SEC } from '@/features/category-flow/constants'
import { useReadingCountdown } from '@/features/category-flow/hooks/useReadingCountdown'
import { READING_MISSION_TEXT } from '@/features/sustainable-memory/content'
import { MEMORY_COOLDOWN_MS } from '@/features/sustainable-memory/constants'
import { useSustainableMemoryLevel } from '@/features/sustainable-memory/hooks/useSustainableMemoryLevel'
import { sustainableMemoryNavigation } from '@/features/sustainable-memory/navigation'
import { sustainableMemorySession } from '@/features/sustainable-memory/sessionStorage'
import { useAuth } from '@/context/auth-provider'

export default function SustainableMemoryReadingScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { categoryId, lessonId, levelNumber } = useLocalSearchParams<{
    categoryId: string
    lessonId: string
    levelNumber: string
  }>()

  const { content } = useSustainableMemoryLevel(lessonId)
  const totalSec = MEMORIZE_DURATION_SEC
  const [sessionReady, setSessionReady] = useState(false)
  const [initialElapsedMs, setInitialElapsedMs] = useState(0)
  const goCooldownRef = useRef<() => Promise<void>>(async () => {})

  useEffect(() => {
    if (!user?.id || !lessonId) return
    void (async () => {
      const saved = await sustainableMemorySession.load(user.id, lessonId)
      setInitialElapsedMs(saved?.readingElapsedMs ?? 0)
      setSessionReady(true)
    })()
  }, [user?.id, lessonId])

  const { remainingSec, elapsedRef, triggerComplete } = useReadingCountdown({
    totalSec,
    onTimerComplete: () => goCooldownRef.current(),
    initialElapsedMs,
    enabled: sessionReady,
  })

  goCooldownRef.current = async () => {
    if (!user?.id || !categoryId || !lessonId) return
    const cooldownEndsAt = new Date(Date.now() + MEMORY_COOLDOWN_MS).toISOString()
    const base =
      (await sustainableMemorySession.load(user.id, lessonId)) ??
      sustainableMemorySession.createSession({
        lessonId,
        categoryId,
        levelNumber: Number(levelNumber) || content?.levelNumber || 1,
      })
    await sustainableMemorySession.save(user.id, {
      ...base,
      phase: 'cooldown',
      readingElapsedMs: Math.max(elapsedRef.current, totalSec * 1000),
      cooldownEndsAt,
      allowReread: false,
      answerDraft: '',
    })
    router.replace({
      pathname: '/sustainable-memory/cooldown',
      params: { categoryId, lessonId, levelNumber },
    })
  }

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
        phase: 'reading',
      })
    await sustainableMemorySession.persistExitWhileReading(
      user.id,
      base,
      elapsedRef.current,
    )
    sustainableMemoryNavigation.goLevels(categoryId)
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
      <MissionInstructionCard>{READING_MISSION_TEXT}</MissionInstructionCard>

      <Text className="text-[#919EAB] text-xs font-semibold tracking-wider mb-2">
        ĐOẠN VĂN
      </Text>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="bg-[#F4F6F8] rounded-3xl p-4 mb-4">
          <Text className="text-[#212B36] text-base leading-7">
            {content?.passage ?? ''}
          </Text>
        </View>
      </ScrollView>
    </CategoryFlowScreen>
  )
}
