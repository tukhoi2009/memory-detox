import React, { useEffect, useRef, useState } from 'react'
import { BackHandler, ImageBackground, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CyberSafetyGameService } from '@/services/cyberSafetyGame.service'
import { useAuth } from '@/context/auth-provider'
import { images } from '@/constants'

export default function QuizResultScreen() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const params = useLocalSearchParams<{
    lessonId: string
    pointsEarned: string
    correctAnswers: string
    totalQuestions: string
    highestScore: string
    answers: string
  }>()

  const lessonId = params.lessonId ?? ''
  const pointsEarned = parseInt(params.pointsEarned ?? '0', 10)
  const correctAnswers = parseInt(params.correctAnswers ?? '0', 10)
  const totalQuestions = parseInt(params.totalQuestions ?? '0', 10)
  const highestScore = parseInt(params.highestScore ?? '0', 10)
  const answers = params.answers ? JSON.parse(params.answers) : []

  const [isSubmitting, setIsSubmitting] = useState(false)
  const hasSubmittedRef = useRef(false)

  const { data: lesson } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => CyberSafetyGameService.getLessonById(lessonId),
    enabled: !!lessonId,
  })

  const { data: questions } = useQuery({
    queryKey: ['quizzes', lessonId],
    queryFn: () => CyberSafetyGameService.getQuizzesByLesson(lessonId),
    enabled: !!lessonId,
  })

  const handleSubmitResult = async () => {
    if (!user?.id || !lessonId) return
    if (hasSubmittedRef.current) return
    hasSubmittedRef.current = true

    setIsSubmitting(true)
    try {
      await CyberSafetyGameService.upsertProgressAndAwardPoints({
        userId: user.id,
        lessonId: lessonId,
        pointsEarned: pointsEarned,
        correctAnswers: correctAnswers,
        totalQuestions: totalQuestions,
      })

      // Invalidate queries to refresh data on other screens
      await queryClient.invalidateQueries({ queryKey: ['user-progress', user.id] })
      await queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
      await queryClient.invalidateQueries({ queryKey: ['stats-chart', user.id] })
      await queryClient.invalidateQueries({ queryKey: ['stats-averages', user.id] })
      await queryClient.invalidateQueries({ queryKey: ['profile', user.id] })
    } catch (error) {
      console.error('Error submitting result:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    // Auto-submit when screen loads
    handleSubmitResult()
  }, [])

  useEffect(() => {
    // Prevent hardware back button from going back to quiz game
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Navigate to lesson detail instead of going back
      handleFinish()
      return true // Prevent default back behavior
    })

    return () => backHandler.remove()
  }, [lessonId])

  const handleReview = async () => {
    router.replace({
      pathname: '/quiz-review',
      params: {
        lessonId: lessonId,
        answers: JSON.stringify(answers),
      },
    })
  }

  const handleFinish = () => {
    router.replace({
      pathname: '/lesson-detail',
      params: { 
        lessonId: lessonId,
        categoryId: lesson?.category_id || undefined,
      },
    })
  }

  return (
    <ImageBackground source={images.bgResult} className="flex-1">
      <View className="flex-1 px-5 py-8 items-center justify-end">
        <View className="items-center mb-6">
          <Text className="text-white font-extrabold text-4xl">Hoàn thành!</Text>
          <Text className="text-[#C9F7EE] font-medium text-center text-base mt-2">
            Bạn đã hoàn thành chủ đề{'\n'}
            <Text className="font-bold text-white">{lesson?.title ?? ''}</Text>
          </Text>
          <Text className="text-[#B6EDE4] text-xl mt-6">Điểm của bạn:</Text>
          <Text className="text-[#F0A8ED] text-3xl font-extrabold mt-1">
            {pointsEarned} điểm
          </Text>
          <Text className="text-[#C9F7EE] text-xl mt-3">
            Điểm cao nhất: <Text className="text-white font-bold">{highestScore} điểm</Text>
          </Text>
        </View>

        <View className="w-full flex-row gap-3 mb-2">
          <TouchableOpacity
            onPress={handleReview}
            className="flex-1 min-h-14 rounded-full bg-[#162338] items-center justify-center"
            disabled={isSubmitting}
          >
            <Text className="text-white font-semibold text-xl">Xem lại</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleFinish}
            className="flex-1 min-h-14 rounded-full bg-[#162338] items-center justify-center"
            disabled={isSubmitting}
          >
            <Text className="text-white font-semibold text-xl">Hoàn thành</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  )
}
