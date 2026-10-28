import React, { useCallback, useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import AppButton from '@/components/common/AppButton'
import { ScrollHabitScreen } from '@/features/scroll-habit/components/ScrollHabitScreen'
import { useScrollHabitLevel } from '@/features/scroll-habit/hooks/useScrollHabitLevel'
import { navigateScrollHabitLevels } from '@/features/scroll-habit/navigation'
import { useAuth } from '@/context/auth-provider'
import {
  loadScrollHabitSession,
  persistExitWhileAnswering,
  createSession,
} from '@/features/scroll-habit/sessionStorage'
import { images } from '@/constants'

export default function ScrollHabitAnswerScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { categoryId, lessonId, levelNumber } = useLocalSearchParams<{
    categoryId: string
    lessonId: string
    levelNumber: string
  }>()

  const { content } = useScrollHabitLevel(lessonId)
  const [answer, setAnswer] = useState('')

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
      })

    await persistExitWhileAnswering(user.id, base)
    navigateScrollHabitLevels(categoryId)
  }, [user?.id, categoryId, lessonId, levelNumber])

  const submit = async () => {
    if (!user?.id || !categoryId || !lessonId || !content) return

    router.push({
      pathname: '/scroll-habit/result',
      params: {
        categoryId,
        lessonId,
        levelNumber,
        answer: answer.trim(),
      },
    })
  }

  const title = content?.title ?? `Cấp độ ${levelNumber}`

  return (
    <ScrollHabitScreen
      title={title}
      showExitConfirm
      onConfirmExit={() => void handleExit()}
      footer={<AppButton title="Hoàn thành" variant="gradient" onPress={() => void submit()} />}
    >
      <View className="bg-[#FFF0F5] rounded-3xl p-4 mb-4">
        <View className="flex-row items-start justify-between">
          <View className="bg-[#FFC2F7] rounded-full px-3 py-1">
            <Text className="text-[#212B36] text-xs font-semibold">Yêu cầu</Text>
          </View>
          <Image
            source={images.requestIcon}
            style={{ width: 44, height: 44 }}
            contentFit="contain"
          />
        </View>
        <Text className="text-[#212B36] text-base font-medium mt-3 leading-6">
          {content?.taskPrompt ??
            'Viết 3 ý chính bằng từ khóa trong đoạn văn bạn vừa đọc được.'}
        </Text>
      </View>

      <TextInput
        className="flex-1 bg-white border border-[#DFE3E8] rounded-3xl p-4 text-[#212B36] text-base"
        placeholder="Viết gì đó..."
        placeholderTextColor="#919EAB"
        multiline
        textAlignVertical="top"
        value={answer}
        onChangeText={setAnswer}
      />
    </ScrollHabitScreen>
  )
}
