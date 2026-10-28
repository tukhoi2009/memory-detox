import React from 'react'
import {
  ActivityIndicator,
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
import { CyberSafetyGameService } from '@/services/cyberSafetyGame.service'
import { CalendarEdit } from 'iconsax-react-native'
import IconStar20 from '~/assets/icons/home/star20'

export default function QuizHistoryScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>()

  const { data: lesson } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () =>
      lessonId ? CyberSafetyGameService.getLessonById(lessonId) : null,
    enabled: !!lessonId,
  })

  const { data: attempts, isLoading } = useQuery({
    queryKey: ['quiz-attempts', user?.id, lessonId],
    queryFn: () => {
      if (!user?.id || !lessonId) return []
      return CyberSafetyGameService.getQuizAttempts(user.id, lessonId)
    },
    enabled: !!user?.id && !!lessonId,
  })

  const handleBack = () => {
    router.back()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  if (!user?.id) {
    return (
      <SafeAreaView className="flex-1 bg-[#FFF7ED] px-6 justify-center">
        <Text className="text-center font-bold text-[#241B5B] text-xl">
          Cần đăng nhập
        </Text>
        <Text className="text-center text-gray-600 mt-2">
          Vui lòng đăng nhập để xem lịch sử.
        </Text>
      </SafeAreaView>
    )
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FFF7ED]">
        <ActivityIndicator size="large" color="#2BB08F" />
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-[#FFF7ED]">
      <View className="px-4 pt-16 pb-2">
        <TouchableOpacity
          onPress={handleBack}
          className="w-12 h-12 rounded-full bg-white items-center justify-center"
        >
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </TouchableOpacity>
      </View>

      <View className="px-4 pt-2 pb-3">
        <Text className="text-[#1F2937] text-4xl font-bold">Lịch sử</Text>
        <Text className="text-gray-500 mt-2 text-base">
          {lesson?.title ? `Bạn đã tiến xa đến đâu?` : 'Xem lại các lần chơi của bạn'}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 28 }}
      >
        <View className="bg-[#FF8B8B] rounded-[30px] p-3">
          {attempts && attempts.length > 0 ? (
            attempts.map((attempt, index) => {
              const isHighest = index === 0 || attempt.points_earned >= (attempts[index - 1]?.points_earned ?? 0)
              
              return (
                <View
                  key={attempt.id}
                  className="bg-white rounded-full px-4 py-3 mb-3 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center flex-1">
                    <View className="w-12 h-12 rounded-full bg-[#E0F7F4] items-center justify-center mr-3">
                      <CalendarEdit size="24" color="#00917A" variant="Bold" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-[#1F2937] text-base font-bold">
                        {formatDate(attempt.completed_at)}
                      </Text>
                      <Text className="text-[#6B7280] text-sm">
                        {formatTime(attempt.completed_at)}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-[#8B7DFF] text-lg font-bold mr-1">
                      {attempt.points_earned}/{attempt.total_questions * 100}
                    </Text>
                    <Text className="text-2xl">
                      <IconStar20 />
                    </Text>
                  </View>
                </View>
              )
            })
          ) : (
            <View className="bg-white rounded-3xl px-4 py-8 items-center">
              <Text className="text-[#1F2937] text-xl font-bold mb-2">
                Chưa có lịch sử
              </Text>
              <Text className="text-gray-600 text-center">
                Bạn chưa chơi quiz này lần nào.{'\n'}Hãy thử chơi ngay!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
