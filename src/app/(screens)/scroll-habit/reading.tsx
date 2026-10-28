import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import AppButton from '@/components/common/AppButton'
import { APP_BUTTON_GRADIENT } from '@/components/common/AppButton'
import { ScrollHabitScreen } from '@/features/scroll-habit/components/ScrollHabitScreen'
import { useReadingCountdown } from '@/features/category-flow/hooks/useReadingCountdown'
import { READING_DURATION_SEC } from '@/features/scroll-habit/content'
import { useScrollHabitLevel } from '@/features/scroll-habit/hooks/useScrollHabitLevel'
import { navigateScrollHabitLevels } from '@/features/scroll-habit/navigation'
import { useAuth } from '@/context/auth-provider'
import {
  loadScrollHabitSession,
  persistExitWhileReading,
  saveScrollHabitSession,
  createSession,
} from '@/features/scroll-habit/sessionStorage'
import { images } from '@/constants'
import { Image } from 'expo-image'
import { Timer1 } from 'iconsax-react-native'

function formatTimer(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function ScrollHabitReadingScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { categoryId, lessonId, levelNumber, reread } = useLocalSearchParams<{
    categoryId: string
    lessonId: string
    levelNumber: string
    reread?: string
  }>()

  const { content } = useScrollHabitLevel(lessonId)
  const totalSec = READING_DURATION_SEC
  const [sessionReady, setSessionReady] = useState(false)
  const [initialElapsedMs, setInitialElapsedMs] = useState(0)
  const isReread = reread === '1'

  useEffect(() => {
    if (!user?.id || !lessonId) return

    if (isReread) {
      setInitialElapsedMs(0)
      setSessionReady(true)
      void saveScrollHabitSession(user.id, {
        ...(createSession({
          lessonId,
          categoryId: categoryId ?? '',
          levelNumber: Number(levelNumber) || 1,
          phase: 'reading',
        })),
        allowReread: false,
        readingElapsedMs: 0,
      })
      return
    }

    void (async () => {
      const saved = await loadScrollHabitSession(user.id, lessonId)
      setInitialElapsedMs(saved?.readingElapsedMs ?? 0)
      setSessionReady(true)
    })()
  }, [user?.id, lessonId, isReread, categoryId, levelNumber])

  const goLockedRef = useRef<() => Promise<void>>(async () => {})

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
      (await loadScrollHabitSession(user.id, lessonId)) ??
      createSession({
        lessonId,
        categoryId,
        levelNumber: Number(levelNumber) || content?.levelNumber || 1,
      })

    await saveScrollHabitSession(user.id, {
      ...base,
      phase: 'locked',
      readingElapsedMs: Math.max(elapsedRef.current, totalSec * 1000),
      allowReread: false,
      answerDraft: '',
    })

    router.replace({
      pathname: '/scroll-habit/locked',
      params: { categoryId, lessonId, levelNumber },
    })
  }

  const goLocked = () => triggerComplete()

  const progress = 1 - remainingSec / totalSec

  const handleExit = useCallback(async () => {
    if (!user?.id || !categoryId || !lessonId) {
      navigateScrollHabitLevels(categoryId ?? '')
      return
    }

    const base =
      (await loadScrollHabitSession(user.id, lessonId)) ??
      createSession({
        lessonId,
        categoryId,
        levelNumber: Number(levelNumber) || 1,
        phase: 'reading',
      })

    await persistExitWhileReading(user.id, base, elapsedRef.current)
    navigateScrollHabitLevels(categoryId)
  }, [user?.id, categoryId, lessonId, levelNumber])
  const title = content?.title ?? `Cấp độ ${levelNumber}`

  return (
    <ScrollHabitScreen
      title={title}
      showExitConfirm
      onConfirmExit={() => void handleExit()}
      footer={
        <AppButton
          title="Tiếp theo"
          variant="gradient"
          onPress={() => void goLocked()}
        />
      }
    >
      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-primary text-xs font-semibold tracking-wider">
            THỜI GIAN
          </Text>
          <LinearGradient
            colors={[...APP_BUTTON_GRADIENT]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              gap: 6,
            }}
          >
            <Timer1 size={24} color="#212B36" variant="Bold"/>
            <Text className="text-[#212B36] font-semibold text-sm">
              {formatTimer(remainingSec)}
            </Text>
          </LinearGradient>
        </View>
        <View className="h-2 rounded-full bg-[#F4F6F8] overflow-hidden">
          <View
            className="h-full rounded-full bg-[#D5E94B]"
            style={{ width: `${Math.min(100, progress * 100)}%` }}
          />
        </View>
      </View>

      <View className="bg-[#FFF0F5] rounded-3xl p-4 mb-4">
        <View className="flex-row items-start justify-between">
          <View className="bg-[#FFC2F7] rounded-full px-3 py-1">
            <Text className="text-[#212B36] text-xs font-semibold">
              Nhiệm vụ của bạn
            </Text>
          </View>
          <Image
            source={images.missionIcon}
            style={{ width: 48, height: 48 }}
            contentFit="contain"
          />
        </View>
        <Text className="text-[#212B36] text-base font-medium mt-3 leading-6">
          Tập trung đọc đoạn văn dưới đây. Bạn sẽ không thể cuộn màn hình.
        </Text>
      </View>

      <Text className="text-[#919EAB] text-xs font-semibold tracking-wider mb-2">
        ĐOẠN VĂN
      </Text>
      <View className="flex-1 bg-[#F4F6F8] rounded-3xl p-4 mb-2">
        <Text className="text-[#212B36] text-base leading-7">
          {content?.passage ?? ''}
        </Text>
      </View>
    </ScrollHabitScreen>
  )
}
