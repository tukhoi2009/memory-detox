import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import AppButton from '@/components/common/AppButton'
import { CategoryFlowScreen } from './CategoryFlowScreen'
import type { CategoryFlowScoreBreakdown } from '../types'
import images from '@/constants/images'

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

type Props = {
  breakdown: CategoryFlowScoreBreakdown
  submitting?: boolean
  onExit: () => void
  onNext: () => void
}

export function CategoryResultView({
  breakdown,
  submitting = false,
  onExit,
  onNext,
}: Props) {
  return (
    <LinearGradient
      colors={['#F0FDE4', '#E8F4FC', '#FFF0F8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <CategoryFlowScreen bg="transparent" onBack={onExit}>
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
              onPress={onExit}
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
              onPress={onNext}
              disabled={submitting}
            />
          </View>
        </View>
      </CategoryFlowScreen>
    </LinearGradient>
  )
}
