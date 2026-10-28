import React, { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { CyberSafetyGameService } from '@/services/cyberSafetyGame.service'
import { useAuth } from '@/context/auth-provider'
import AppButton from '@/components/common/AppButton'

const POINTS_PER_CORRECT = 100
const MOCK_TIME = '02:54'

export default function QuizGameScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>()

  const lessonIdStr = lessonId ?? ''

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

  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [showExitModal, setShowExitModal] = useState(false)

  useEffect(() => {
    setIdx(0)
    setSelected(null)
    setAnswers([])
  }, [lessonIdStr])

  const currentQuestion = questions?.[idx] ?? null

  const progressCount = Math.max(answers.length, idx + 1)

  const handleChoose = (optionIndex: number) => {
    setSelected(optionIndex)
  }

  const handleBackToLesson = () => {
    router.replace({
      pathname: '/lesson-detail',
      params: { lessonId: lessonIdStr },
    })
  }

  const handleNext = () => {
    if (selected === null || !currentQuestion) return

    const nextAnswers = [...answers]
    nextAnswers[idx] = selected
    setAnswers(nextAnswers)

    if (idx + 1 >= totalQuestions) {
      // Calculate results
      const correctAnswers = nextAnswers.reduce((acc, answer, questionIndex) => {
        const question = questions?.[questionIndex]
        if (!question) return acc
        return acc + (answer === question.correct_index ? 1 : 0)
      }, 0)
      const pointsEarned = correctAnswers * POINTS_PER_CORRECT

      // Get existing progress to determine highest score
      if (user?.id) {
        CyberSafetyGameService.getUserProgress(user.id)
          .then((progress) => {
            const existingProgress = progress.find((p) => p.lesson_id === lessonIdStr)
            const previousPoints = existingProgress?.points_earned ?? 0
            const highestScore = Math.max(pointsEarned, previousPoints)

            // Navigate to result screen
            router.replace({
              pathname: '/quiz-result',
              params: {
                lessonId: lessonIdStr,
                pointsEarned: pointsEarned.toString(),
                correctAnswers: correctAnswers.toString(),
                totalQuestions: totalQuestions.toString(),
                highestScore: highestScore.toString(),
                answers: JSON.stringify(nextAnswers),
              },
            })
          })
          .catch((error) => {
            console.error('Error fetching user progress:', error)
            // Fallback if error occurs
            router.replace({
              pathname: '/quiz-result',
              params: {
                lessonId: lessonIdStr,
                pointsEarned: pointsEarned.toString(),
                correctAnswers: correctAnswers.toString(),
                totalQuestions: totalQuestions.toString(),
                highestScore: pointsEarned.toString(),
                answers: JSON.stringify(nextAnswers),
              },
            })
          })
      } else {
        // No user, just show the result
        router.replace({
          pathname: '/quiz-result',
          params: {
            lessonId: lessonIdStr,
            pointsEarned: pointsEarned.toString(),
            correctAnswers: correctAnswers.toString(),
            totalQuestions: totalQuestions.toString(),
            highestScore: pointsEarned.toString(),
            answers: JSON.stringify(nextAnswers),
          },
        })
      }
      return
    }

    setIdx((prev) => prev + 1)
    setSelected(nextAnswers[idx + 1] ?? null)
  }

  useEffect(() => {
    if (!currentQuestion) return
    setSelected(answers[idx] ?? null)
  }, [idx, answers, currentQuestion])

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FFF7ED]">
        <ActivityIndicator size="large" color="#2BB08F" />
      </View>
    )
  }

  if (!user?.id) {
    return (
      <SafeAreaView className="flex-1 bg-[#FFF7ED] px-6 justify-center">
        <Text className="text-center font-bold text-[#241B5B] text-xl">
          Cần đăng nhập để chơi
        </Text>
        <Text className="text-center text-gray-600 mt-2">
          Vui lòng đăng nhập trước khi bắt đầu quiz.
        </Text>
        <View className="mt-6">
          <AppButton title="Đến trang đăng nhập" onPress={() => router.replace('/sign-in')} />
        </View>
      </SafeAreaView>
    )
  }

  if (!totalQuestions || !currentQuestion) {
    return (
      <SafeAreaView className="flex-1 bg-[#FFF7ED] px-6 justify-center">
        <Text className="text-center font-bold text-[#241B5B] text-xl">
          Quiz chưa sẵn sàng
        </Text>
        <Text className="text-center text-gray-600 mt-2">
          Không tìm thấy câu hỏi cho bài học này.
        </Text>
        <View className="mt-6">
          <AppButton title="Quay lại bài học" onPress={handleBackToLesson} />
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
              backgroundColor:
                barIdx <= idx && barIdx < progressCount ? '#9D8AF6' : '#D9DDE2',
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
          onPress={() => setShowExitModal(true)}
          className="w-12 h-12 rounded-full bg-white items-center justify-center"
        >
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </TouchableOpacity>

        <View className="bg-white rounded-full px-4 py-2 flex-row items-center">
          <Text className="text-[#1F2937] font-bold text-xl">{MOCK_TIME}</Text>
          <Ionicons name="time-outline" size={20} color="#6B7280" style={{ marginLeft: 4 }} />
        </View>
      </View>

      {renderProgress()}

      <View className="flex-1 px-4 pt-4">
        <View className="flex-1">
          <Text className="text-[#00917A] text-2xl mb-2 font-extrabold">
            Câu {idx + 1}:
          </Text>
          <Text className="text-[#1F2937] font-extrabold text-5xl leading-[58px]">
            {currentQuestion?.question}
          </Text>
        </View>

        <View
          className="rounded-[34px] p-3 mb-6"
          style={{ backgroundColor: '#F5D658' }}
        >
          <View className="gap-3">
            {currentQuestion?.options.map((opt, optionIndex) => {
              let bg = '#F4F6F8'
              let border = 'transparent'
              
              if (selected === optionIndex) {
                bg = '#21A38F'
                border = '#21A38F'
              }

              return (
                <TouchableOpacity
                  key={optionIndex}
                  onPress={() => handleChoose(optionIndex)}
                  activeOpacity={0.9}
                >
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
                      style={{ color: selected === optionIndex ? '#FFFFFF' : '#1F2937' }}
                      numberOfLines={2}
                    >
                      {opt}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>

          <View className="mt-4">
            <AppButton
              title={idx + 1 >= totalQuestions ? 'Nộp bài' : 'Tiếp theo  →'}
              onPress={handleNext}
              disabled={selected === null}
              className="min-h-14 bg-[#162338]"
            />
          </View>
        </View>
      </View>

      <Modal
        visible={showExitModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowExitModal(false)}
      >
        <View className="flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', paddingHorizontal: 18 }}>
          <View className="bg-[#FFF7ED] rounded-[30px] p-6">
            <TouchableOpacity
              className="absolute top-4 right-4 z-10"
              onPress={() => setShowExitModal(false)}
            >
              <Ionicons name="close" size={32} color="#1F2937" />
            </TouchableOpacity>
            <View className="items-center">
              <View className="w-44 h-44 rounded-2xl bg-[#F4D96855] items-center justify-center mt-6">
                <Ionicons name="exit-outline" size={96} color="#6B7280" />
              </View>
              <Text className="text-[#1F2937] text-4xl font-extrabold mt-6">Thoát trò chơi?</Text>
              <Text className="text-[#6B7280] text-center text-xl mt-2">
                Bạn có chắc chắn muốn thoát trò chơi?
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleBackToLesson}
              className="bg-[#162338] rounded-full py-4 mt-8 items-center"
            >
              <Text className="text-white text-xl font-semibold">Thoát</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

