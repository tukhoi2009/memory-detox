import React from 'react'
import { Text, View } from 'react-native'
import { Image } from 'expo-image'
import { images } from '@/constants'

type Props = {
  children: string
}

/** Thẻ hồng "Nhiệm vụ của bạn" — dùng chung nhiều category */
export function MissionInstructionCard({ children }: Props) {
  return (
    <View className="bg-[#FFF0F5] rounded-3xl p-4 mb-4">
      <View className="flex-row items-start justify-between">
        <View className="bg-[#FFC2F7] rounded-full px-3 py-1">
          <Text className="text-[#212B36] text-xs font-semibold">
            Nhiệm vụ của bạn
          </Text>
        </View>
        <Image source={images.missionIcon} style={{ width: 48, height: 48 }} contentFit="contain" />
      </View>
      <Text className="text-[#212B36] text-base font-medium mt-3 leading-6">
        {children}
      </Text>
    </View>
  )
}
