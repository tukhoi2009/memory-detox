import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface QuizResultScreenProps {
  result: {
    correctAnswers: number
    pointsEarned: number
  }
  lessonTitle: string
  highestScore: number
  isSubmitting: boolean
  onReview: () => void
  onFinish: () => void
}

export default function QuizResultScreen({
  result,
  lessonTitle,
  highestScore,
  isSubmitting,
  onReview,
  onFinish,
}: QuizResultScreenProps) {
  return (
    <View
      className="flex-1 px-5 py-6 items-center justify-between"
      style={{ backgroundColor: '#00917A' }}
    >
      <View className="items-center mt-6">
        <View className="w-56 h-56 rounded-full bg-[#FFFFFF22] items-center justify-center mb-6">
          <Ionicons name="happy-outline" size={110} color="#FFFFFF" />
        </View>
        <Text className="text-white font-extrabold text-[48px]">Hoàn thành!</Text>
        <Text className="text-[#C9F7EE] font-medium text-center text-xl mt-2">
          Bạn đã hoàn thành chủ đề{'\n'}
          <Text className="font-bold text-white">{lessonTitle}</Text>
        </Text>
        <Text className="text-[#B6EDE4] text-xl mt-6">Điểm của bạn:</Text>
        <Text className="text-[#F0A8ED] text-[56px] font-extrabold mt-1">
          {result.pointsEarned} điểm
        </Text>
        <Text className="text-[#C9F7EE] text-xl mt-3">
          Điểm cao nhất: <Text className="text-white font-bold">{highestScore} điểm</Text>
        </Text>
      </View>

      <View className="w-full flex-row gap-3 mb-2">
        <TouchableOpacity
          onPress={onReview}
          className="flex-1 min-h-14 rounded-full bg-[#162338] items-center justify-center"
          disabled={isSubmitting}
        >
          <Text className="text-white font-semibold text-xl">Xem lại</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onFinish}
          className="flex-1 min-h-14 rounded-full bg-[#162338] items-center justify-center"
          disabled={isSubmitting}
        >
          <Text className="text-white font-semibold text-xl">Hoàn thành</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
