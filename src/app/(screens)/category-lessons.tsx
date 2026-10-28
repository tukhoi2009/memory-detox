import React, { useEffect, useMemo } from 'react'
import {
  ActivityIndicator,
  BackHandler,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/context/auth-provider'
import {
  CyberSafetyGameService,
  UserProgressRow,
} from '@/services/cyberSafetyGame.service'
import IconStar from '~/assets/icons/home/star'
import IconStar20 from '~/assets/icons/home/star20'
import { Book1, Lock1 } from 'iconsax-react-native'
import { useProfile } from '@/hooks/useProfile'

export default function CategoryLessonsScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>()
  const { profile } = useProfile()

  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () =>
      categoryId ? CyberSafetyGameService.getCategoryById(categoryId) : null,
    enabled: !!categoryId,
  })

  const { data: categoryLessons, isLoading: categoryLessonsLoading } = useQuery({
    queryKey: ['category-lessons', categoryId],
    queryFn: () =>
      categoryId ? CyberSafetyGameService.getLessonsByCategory(categoryId) : [],
    enabled: !!categoryId,
  })

  const { data: progressRows } = useQuery({
    queryKey: ['user-progress', user?.id],
    queryFn: () => (user?.id ? CyberSafetyGameService.getUserProgress(user.id) : []),
    enabled: !!user?.id,
  })

  const progressMap = useMemo(() => {
    const map = new Map<string, UserProgressRow>()
    for (const row of progressRows ?? []) {
      map.set(row.lesson_id, row)
    }
    return map
  }, [progressRows])

  const totalPoints = profile?.total_points ?? 0

  const handleBack = () => {
    // Navigate to home tab using replace to clear navigation stack
    router.replace('/(tabs)/home')
  }

  useEffect(() => {
    // Handle hardware back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleBack()
      return true // Prevent default back behavior
    })

    return () => backHandler.remove()
  }, [])

  if (!categoryId) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FFF7ED] px-6">
        <Text className="text-gray-700 font-semibold">
          Thiếu mã chủ đề.
        </Text>
      </View>
    )
  }

  if (categoryLoading || categoryLessonsLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FFF7ED]">
        <ActivityIndicator size="large" color="#2BB08F" />
      </View>
    )
  }

  const lessons = categoryLessons ?? []

  return (
    <SafeAreaView className="flex-1 bg-[#FFF7ED]">
      <View className="px-4 pt-16 pb-2 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={handleBack}
          className="w-12 h-12 rounded-full bg-white items-center justify-center"
        >
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-white rounded-full px-4 py-2 flex-row items-center"
          style={{ borderWidth: 1, borderColor: '#E5E7EB' }}
        >
          <Text className="font-semibold text-[#1F2937]">
            {totalPoints.toLocaleString()}
          </Text>
          <Text className="ml-1">
            <IconStar />
          </Text>
        </TouchableOpacity>
      </View>

      <View className="px-4 pt-2 pb-3">
        <Text className="text-[#1F2937] text-4xl font-bold">
          {category?.name ?? 'Chủ đề'}
        </Text>
        <Text className="text-gray-500 mt-2 text-base">
          Học theo từng chủ đề con, đọc nội dung và làm quiz để kiếm điểm.
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 28 }}
      >
        <View className="bg-[#04947A] rounded-[30px] p-3">
          {lessons.map((item, index) => {
            const row = progressMap.get(item.id)
            const done = Boolean(row?.completed_at)
            const prevDone =
              index === 0 ||
              Boolean(progressMap.get(lessons[index - 1]?.id)?.completed_at)
            const xpUnlocked =
              !item.is_locked || totalPoints >= (item.unlock_min_points ?? 0)
            const canOpen = prevDone && xpUnlocked
            const totalQ = row?.total_questions ?? 100
            const score = row?.points_earned ?? 0

            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                disabled={!canOpen}
                onPress={() =>
                  router.push({
                    pathname: '/lesson-detail',
                    params: { lessonId: item.id, categoryId },
                  })
                }
                className="bg-white rounded-full px-4 py-3 mb-3 flex-row items-center justify-between"
                style={{ opacity: canOpen ? 1 : 0.6 }}
              >
                <View className="flex-row items-center flex-1">
                  <View
                    className={`w-12 h-12 rounded-full ${
                      canOpen ? 'bg-[#FFDA57]' : 'bg-[#FFBBF4]'
                    } items-center justify-center mr-3`}
                  >
                    {canOpen ? (
                      <Book1 size="24" color="#00917A" variant="Bold" />
                    ) : (
                      <Lock1 size="24" color="#00917A" variant="Bold" />
                    )}
                  </View>
                  <View className="flex-1 pr-2">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-[#06A77D] text-xs font-semibold">
                        Chủ đề {index + 1}
                      </Text>
                      <Text className="text-[#8B7DFF] flex-row items-center font-bold">
                        {done ? `${score}/${totalQ*100}` : `0/${totalQ}`} <IconStar20 />
                      </Text>
                    </View>
                    <Text
                      className="text-[#1F2937] text-base font-semibold"
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          })}
          {!lessons.length && (
            <View className="bg-white rounded-3xl px-4 py-6 items-center">
              <Text className="text-gray-600 font-semibold">
                Chưa có chủ đề con.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
