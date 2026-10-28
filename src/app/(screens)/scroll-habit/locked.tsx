import React, { useCallback } from 'react'
import { Text, View } from 'react-native'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import AppButton from '@/components/common/AppButton'
import { ScrollHabitScreen } from '@/features/scroll-habit/components/ScrollHabitScreen'
import { useScrollHabitLevel } from '@/features/scroll-habit/hooks/useScrollHabitLevel'
import { navigateScrollHabitLevels } from '@/features/scroll-habit/navigation'
import { useAuth } from '@/context/auth-provider'
import {
  loadScrollHabitSession,
  persistExitAfterReading,
  saveScrollHabitSession,
  createSession,
} from '@/features/scroll-habit/sessionStorage'
import { images } from '@/constants'

export default function ScrollHabitLockedScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { categoryId, lessonId, levelNumber } = useLocalSearchParams<{
    categoryId: string
    lessonId: string
    levelNumber: string
  }>()

  const { content } = useScrollHabitLevel(lessonId)
  const title = content?.title ?? `Cấp độ ${levelNumber}`

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
        phase: 'locked',
      })

    await persistExitAfterReading(user.id, base)
    navigateScrollHabitLevels(categoryId)
  }, [user?.id, categoryId, lessonId, levelNumber])

  const goAnswer = async () => {
    if (user?.id && lessonId && categoryId) {
      const base =
        (await loadScrollHabitSession(user.id, lessonId)) ??
        createSession({
          lessonId,
          categoryId,
          levelNumber: Number(levelNumber) || 1,
          phase: 'locked',
        })
      await saveScrollHabitSession(user.id, {
        ...base,
        phase: 'answering',
        answerDraft: '',
      })
    }

    router.push({
      pathname: '/scroll-habit/answer',
      params: { categoryId, lessonId, levelNumber },
    })
  }

  return (
    <ScrollHabitScreen
      title={title}
      showExitConfirm
      onConfirmExit={() => void handleExit()}
      footer={
        <AppButton
          title="Tiếp theo"
          variant="gradient"
          onPress={() => void goAnswer()}
        />
      }
    >
      <View className="flex-1 items-center justify-center">
        <Image
          source={images.lockIcon}
          contentFit="contain"
          style={{ width: 200, height: 200 }}
        />
        <Text className="text-[#212B36] text-2xl font-bold text-center mt-6">
          Nội dung đã bị khóa
        </Text>
        <Text className="text-[#919EAB] text-base text-center mt-3 leading-6 px-2">
          Bạn còn nhớ chứ?{'\n'}Hãy tái hiện lại những gì bạn vừa xem.
        </Text>
      </View>
    </ScrollHabitScreen>
  )
}
