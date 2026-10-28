import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  BackHandler,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { CyberSafetyGameService } from '@/services/cyberSafetyGame.service'
import AppButton from '@/components/common/AppButton'

export default function QuizReviewScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ lessonId: string; answers: string }>()
  
  const lessonIdStr = params.lessonId ?? ''
  const answers: number[] = params.answers ? JSON.parse(params.answers) : []
  const [reviewIdx, setReviewIdx] = useState(0)

  const { data: questions, isLoading } = useQuery({
    queryKey: ['quizzes', lessonIdStr],
    queryFn: () => CyberSafetyGameService.getQuizzesByLesson(lessonIdStr),
    enabled: !!lessonIdStr,
  })

  const { data: lesson } = useQuery({
    queryKey: ['lesson', lessonIdStr],
    queryFn: () => CyberSafetyGameService.getLessonById(lessonIdStr),
    enabled: !!lessonIdStr,
  })

  const totalQuestions = questions?.length ?? 0
  const reviewQuestion = questions?.[reviewIdx] ?? null

  const handleFinish = () => {
    router.replace({
      pathname: '/lesson-detail',
      params: { 
        lessonId: lessonIdStr,
        categoryId: lesson?.category_id || undefined,
      },
    })
  }

  useEffect(() => {
    // Prevent hardware back button from going back to result screen
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Navigate to lesson detail instead of going back
      handleFinish()
      return true // Prevent default back behavior
    })

    return () => backHandler.remove()
  }, [lessonIdStr, lesson?.category_id])

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FFF7ED]">
        <ActivityIndicator size="large" color="#2BB08F" />
      </View>
    )
  }

  if (!totalQuestions || !reviewQuestion) {
    return (
      <SafeAreaView className="flex-1 bg-[#FFF7ED] px-6 justify-center">
        <Text className="text-center font-bold text-[#241B5B] text-xl">
          Không có câu hỏi để xem lại
        </Text>
        <View className="mt-6">
          <AppButton title="Quay lại bài học" onPress={handleFinish} />
        </View>
      </SafeAreaView>
    )
  }

  const renderProgress = () => (
    <View className="px-4 mt-2">
      <View className="flex-row items-center justify-between gap-1">
        {Array.from({ length: totalQuestions }).map((_, barIdx) => (
          <View
            key={barIdx}
            className="h-1 flex-1 rounded-full"
            style={{
              backgroundColor: barIdx <= reviewIdx ? '#9D8AF6' : '#D9DDE2',
            }}
          />
        ))}
      </View>
    </View>
  )

  return (
    <SafeAreaView className="flex-1 bg-[#FFF7ED]">
      <View className="px-4 pt-16 pb-2 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={handleFinish}
          className="w-12 h-12 rounded-full bg-white items-center justify-center"
        >
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </TouchableOpacity>

        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={() => setReviewIdx((p) => Math.max(0, p - 1))}
            disabled={reviewIdx <= 0}
            className="w-11 h-11 rounded-full bg-white items-center justify-center"
            style={{ opacity: reviewIdx > 0 ? 1 : 0.45 }}
          >
            <Ionicons name="chevron-back" size={20} color="#1F2937" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setReviewIdx((p) => Math.min(totalQuestions - 1, p + 1))}
            disabled={reviewIdx >= totalQuestions - 1}
            className="w-11 h-11 rounded-full bg-white items-center justify-center"
            style={{ opacity: reviewIdx < totalQuestions - 1 ? 1 : 0.45 }}
          >
            <Ionicons name="chevron-forward" size={20} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      {renderProgress()}

      <View className="flex-1 px-4 pt-4">
        <View className="flex-1">
          <Text className="text-[#00917A] text-2xl mb-2 font-extrabold">
            Câu {reviewIdx + 1}:
          </Text>
          <Text className="text-[#1F2937] font-extrabold text-5xl leading-[58px]">
            {reviewQuestion.question}
          </Text>
        </View>

        <View className="rounded-[34px] p-3 mb-6" style={{ backgroundColor: '#F5D658' }}>
          <View className="gap-3">
            {reviewQuestion.options.map((opt, optionIndex) => {
              const reviewAnswer = answers[reviewIdx]
              const isCorrectOption = optionIndex === reviewQuestion.correct_index

              let bg = '#F4F6F8'
              let border = 'transparent'

              if (isCorrectOption) {
                bg = '#6AE08D'
                border = '#6AE08D'
              } else if (reviewAnswer === optionIndex) {
                bg = '#F6B184'
                border = '#F6B184'
              }

              return (
                <View key={optionIndex}>
                  <View
                    className="rounded-full px-4 py-3"
                    style={{
                      backgroundColor: bg,
                      borderWidth: 1.5,
                      borderColor: border,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <View
                      className="w-11 h-11 rounded-full items-center justify-center"
                      style={{ backgroundColor: '#DDF3EE' }}
                    >
                      <Text className="text-[#4C5A68] font-semibold text-xl">
                        {String.fromCharCode(65 + optionIndex)}
                      </Text>
                    </View>
                    <Text
                      className="text-[#1F2937] font-medium flex-1 ml-3 text-xl"
                      numberOfLines={2}
                    >
                      {opt}
                    </Text>
                  </View>
                </View>
              )
            })}
          </View>

          <View className="mt-4">
            <AppButton
              title="Hoàn thành"
              onPress={handleFinish}
              className="min-h-14 !bg-[#162338]"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
