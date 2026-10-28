import React from 'react'
import { Text, View } from 'react-native'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import AppButton from '@/components/common/AppButton'
import { ScrollHabitScreen } from '@/features/scroll-habit/components/ScrollHabitScreen'
import { useScrollHabitLevel } from '@/features/scroll-habit/hooks/useScrollHabitLevel'
import images from '@/constants/images'
import { useAuth } from '@/context/auth-provider'
import {
  createSession,
  saveScrollHabitSession,
} from '@/features/scroll-habit/sessionStorage'
import readyIcon from '~/assets/images/ready-icon.png'

export default function ScrollHabitReadyScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { categoryId, lessonId, levelNumber } = useLocalSearchParams<{
    categoryId: string
    lessonId: string
    levelNumber: string
  }>()

  const { content } = useScrollHabitLevel(lessonId)

  const startReading = async () => {
    if (!user?.id || !categoryId || !lessonId) return

    const session = createSession({
      lessonId,
      categoryId,
      levelNumber: Number(levelNumber) || content?.levelNumber || 1,
      phase: 'reading',
    })
    await saveScrollHabitSession(user.id, session)

    router.push({
      pathname: '/scroll-habit/reading',
      params: { categoryId, lessonId, levelNumber },
    })
  }

  return (
    <ScrollHabitScreen bg="#FFF8FA">
      <View className="flex-1 items-center justify-center">
        <Image
          source={images.readyIcon}
          contentFit="contain"
          style={{ width: 300, height: 192 }}
        />
        <Text className="text-[#212B36] text-2xl font-bold text-center mt-8">
          Bạn đã sẵn sàng chưa?
        </Text>
        <Text className="text-[#919EAB] text-base text-center mt-3 px-4">
          Hãy đọc kỹ nội dung và ghi nhớ!
        </Text>
      </View>

      <AppButton title="Tiếp theo" variant="gradient" onPress={() => void startReading()} />
    </ScrollHabitScreen>
  )
}
