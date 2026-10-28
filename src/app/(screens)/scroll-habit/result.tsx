import React, { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useQueryClient } from '@tanstack/react-query'
import AppButton from '@/components/common/AppButton'
import { APP_BUTTON_GRADIENT } from '@/components/common/AppButton'
import { ScrollHabitScreen } from '@/features/scroll-habit/components/ScrollHabitScreen'
import { READING_DURATION_SEC } from '@/features/scroll-habit/content'
import { useScrollHabitLevel } from '@/features/scroll-habit/hooks/useScrollHabitLevel'
import { navigateScrollHabitLevels } from '@/features/scroll-habit/navigation'
import { scoreScrollHabitAnswer } from '@/features/scroll-habit/scoring'
import { isPassingScore } from '@/features/category-flow/scoring'
import { useAuth } from '@/context/auth-provider'
import { clearScrollHabitSession, loadScrollHabitSession } from '@/features/scroll-habit/sessionStorage'
import { CyberSafetyGameService } from '@/services/cyberSafetyGame.service'
import images from '../../../constants/images'
import { Image } from 'expo-image'

function StatRow({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <View className="flex-row items-center justify-between py-3 border-b border-[#F4F6F8]">
      <Text className="text-[#637381] text-base">{label}</Text>
      <Text style={{ color }} className="text-base font-bold">
        {value}%
      </Text>
    </View>
  )
}

export default function ScrollHabitResultScreen() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { categoryId, lessonId, levelNumber, answer } = useLocalSearchParams<{
    categoryId: string
    lessonId: string
    levelNumber: string
    answer: string
  }>()

  const { content } = useScrollHabitLevel(lessonId)
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)

  const [readingMs, setReadingMs] = useState<number | null>(null)

  useEffect(() => {
    if (!user?.id || !lessonId) return
    void (async () => {
      const saved = await loadScrollHabitSession(user.id, lessonId)
      setReadingMs(saved?.readingElapsedMs ?? READING_DURATION_SEC * 1000)
    })()
  }, [user?.id, lessonId])

  const breakdown = useMemo(() => {
    if (!content || readingMs == null) return null
    return scoreScrollHabitAnswer(
      answer ?? '',
      content,
      readingMs,
      READING_DURATION_SEC * 1000,
    )
  }, [answer, content, readingMs])

  React.useEffect(() => {
    if (!user?.id || !lessonId || !breakdown || saved) return
    if (lessonId.startsWith('sh-fallback-')) {
      void clearScrollHabitSession(user.id, lessonId)
      setSaved(true)
      return
    }

    if (!isPassingScore(breakdown.overall)) {
      void clearScrollHabitSession(user.id, lessonId).then(() => setSaved(true))
      return
    }

    void (async () => {
      setSubmitting(true)
      try {
        await CyberSafetyGameService.upsertProgressAndAwardPoints({
          userId: user.id,
          lessonId,
          pointsEarned: breakdown.xpEarned,
          correctAnswers: breakdown.overall,
          totalQuestions: 100,
        })
        await clearScrollHabitSession(user.id, lessonId)
        await queryClient.invalidateQueries({ queryKey: ['user-progress'] })
        await queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
        setSaved(true)
      } finally {
        setSubmitting(false)
      }
    })()
  }, [user?.id, lessonId, breakdown, saved, queryClient])

  const finish = () => {
    if (categoryId) navigateScrollHabitLevels(categoryId)
  }

  const exit = async () => {
    if (user?.id && lessonId) {
      await clearScrollHabitSession(user.id, lessonId)
    }
    finish()
  }

  if (!breakdown) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FFF8FA]">
        <ActivityIndicator size="large" color="#9AE600" />
      </View>
    )
  }

  return (
    <LinearGradient
      colors={['#F0FDE4', '#E8F4FC', '#FFF0F8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollHabitScreen bg="transparent" onBack={() => void exit()}>
        <View className="flex-1 items-center pt-4">
          <Image
            source={images.trophyIcon}
            contentFit="contain"
            style={{ width: 200, height: 200, marginBottom: 16 }}
          />

          <Text className="text-primary font-semibold text-base">Kết quả của bạn</Text>
          <Text className="text-[#22C55E] text-[56px] font-bold mt-1">
            {breakdown.overall}%
          </Text>
          <Text className="text-[#212B36] text-xl font-bold mt-1">Tuyệt vời!</Text>
          <Text className="text-[#919EAB] text-sm text-center mt-2 px-6">
            Tiếp tục duy trì cách tiếp cận này.
          </Text>

          <View className="bg-[#FFC2F7] rounded-full px-4 py-2 mt-4">
            <Text className="text-[#212B36] font-bold">+{breakdown.xpEarned} XP</Text>
          </View>

          <View className="w-full bg-white/90 rounded-3xl px-5 mt-8">
            <StatRow label="Độ chính xác" value={breakdown.accuracy} color="#22C55E" />
            <StatRow label="Ghi nhớ" value={breakdown.memory} color="#22C55E" />
            <StatRow label="Độ hiểu sâu" value={breakdown.depth} color="#22C55E" />
            <StatRow label="Độ tập trung" value={breakdown.focus} color="#F59E0B" />
          </View>
        </View>

        <View className="flex-row gap-3 pb-2">
          <View className="flex-1">
            <TouchableOpacity
              onPress={() => void exit()}
              className="flex-row items-center justify-center rounded-3xl border border-[#DFE3E8] bg-white py-4 gap-2"
              disabled={submitting}
            >
              <Ionicons name="log-out-outline" size={20} color="#212B36" />
              <Text className="text-[#212B36] font-semibold">Thoát</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-1">
            <AppButton
              title="Tiếp theo"
              variant="gradient"
              onPress={finish}
              disabled={submitting}
            />
          </View>
        </View>
      </ScrollHabitScreen>
    </LinearGradient>
  )
}
