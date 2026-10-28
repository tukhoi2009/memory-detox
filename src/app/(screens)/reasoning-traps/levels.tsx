import React, { useMemo } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/context/auth-provider'
import { LevelCard } from '@/features/category-flow/components/LevelCard'
import { REASONING_FALLBACK_LEVELS } from '@/features/reasoning-traps/content'
import { reasoningSession } from '@/features/reasoning-traps/sessionStorage'
import { reasoningNavigation } from '@/features/reasoning-traps/navigation'
import { images } from '@/constants'
import {
  CyberSafetyGameService,
  type Lesson,
  type UserProgressRow,
} from '@/services/cyberSafetyGame.service'

type LevelItem = {
  lessonId: string
  levelNumber: number
  maxXp: number
}

const SCREEN_BG = '#FFF8FA'

export default function ReasoningTrapsLevelsScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>()

  const { data: category, isLoading: loadingCategory } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () =>
      categoryId ? CyberSafetyGameService.getCategoryById(categoryId) : null,
    enabled: !!categoryId,
  })

  const { data: lessons = [], isLoading: loadingLessons } = useQuery({
    queryKey: ['category-lessons', categoryId],
    queryFn: () =>
      categoryId ? CyberSafetyGameService.getLessonsByCategory(categoryId) : [],
    enabled: !!categoryId,
  })

  const { data: progressRows = [] } = useQuery({
    queryKey: ['user-progress', user?.id],
    queryFn: () =>
      user?.id ? CyberSafetyGameService.getUserProgress(user.id) : [],
    enabled: !!user?.id,
  })

  const levelItems: LevelItem[] = useMemo(() => {
    if (lessons.length > 0) {
      return lessons.map((lesson: Lesson) => ({
        lessonId: lesson.id,
        levelNumber: lesson.sort_order || 1,
        maxXp: (lesson.points_reward || 25) * 4,
      }))
    }
    return REASONING_FALLBACK_LEVELS.map((l) => ({
      lessonId: `rt-fallback-${l.levelNumber}`,
      levelNumber: l.levelNumber,
      maxXp: l.maxXp,
    }))
  }, [lessons])

  const progressMap = useMemo(() => {
    const map = new Map<string, UserProgressRow>()
    for (const row of progressRows) {
      map.set(row.lesson_id, row)
    }
    return map
  }, [progressRows])

  const openLevel = async (item: LevelItem, index: number) => {
    if (!categoryId || !user?.id) return

    const prev = levelItems[index - 1]
    const prevDone =
      index === 0 || Boolean(progressMap.get(prev?.lessonId)?.completed_at)
    if (!prevDone) return

    const saved = await reasoningSession.load(user.id, item.lessonId)
    if (saved && saved.phase !== 'completed' && saved.phase !== 'idle') {
      reasoningNavigation.resume(saved, categoryId)
      return
    }

    router.push({
      pathname: '/reasoning-traps/ready',
      params: {
        categoryId,
        lessonId: item.lessonId,
        levelNumber: String(item.levelNumber),
      },
    })
  }

  if (!categoryId) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FFF8FA]">
        <Text className="text-[#637381] font-semibold">Thiếu mã danh mục.</Text>
      </View>
    )
  }

  if (loadingCategory || loadingLessons) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FFF8FA]">
        <ActivityIndicator size="large" color="#9AE600" />
      </View>
    )
  }

  let currentIndex = levelItems.findIndex(
    (item) => !progressMap.get(item.lessonId)?.completed_at,
  )
  if (currentIndex < 0) currentIndex = levelItems.length

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: SCREEN_BG }} edges={['top']}>
      <View
        className="mx-4 mt-2 rounded-[32px] overflow-hidden px-5 pt-4 pb-5"
        style={{ minHeight: 200, backgroundColor: '#FFFDF5' }}
      >
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)/home')}
          className="w-11 h-11 rounded-full bg-white items-center justify-center mb-4"
        >
          <Ionicons name="chevron-back" size={22} color="#212B36" />
        </TouchableOpacity>

        <View className="flex-row items-start">
          <View className="flex-1 pr-2">
            <Text className="text-[#212B36] text-[22px] font-bold leading-8">
              {category?.name ?? 'Bẫy suy luận đánh lừa'}
            </Text>
            <Text className="text-[#919EAB] text-base mt-2">
              Đừng đoán. Hãy hiểu.
            </Text>
          </View>
          <Image
            source={images.home.categoryHandsBrain}
            contentFit="contain"
            style={{ width: 120, height: 120 }}
          />
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {levelItems.map((item, index) => {
          const row = progressMap.get(item.lessonId)
          const done = Boolean(row?.completed_at)
          const prevDone =
            index === 0 ||
            Boolean(progressMap.get(levelItems[index - 1]?.lessonId)?.completed_at)

          let state: 'completed' | 'current' | 'locked' = 'locked'
          if (done) state = 'completed'
          else if (index === currentIndex && prevDone) state = 'current'
          else if (!prevDone) state = 'locked'

          return (
            <LevelCard
              key={item.lessonId}
              levelNumber={item.levelNumber}
              xpEarned={row?.points_earned ?? 0}
              maxXp={item.maxXp}
              state={state}
              onPress={() => {
                if (state !== 'locked') void openLevel(item, index)
              }}
            />
          )
        })}
      </ScrollView>
    </SafeAreaView>
  )
}
