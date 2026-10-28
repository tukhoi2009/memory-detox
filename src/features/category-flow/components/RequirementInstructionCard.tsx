import React from 'react'
import { Text, View } from 'react-native'
import { Image } from 'expo-image'
import { images } from '@/constants'
import requestIcon from '~/assets/images/request-icon.png'

type Props = {
  children: string
}

/** Thẻ hồng "Yêu cầu" — màn trả lời / tái hiện */
export function RequirementInstructionCard({ children }: Props) {
  return (
    <View className="bg-[#FFF0F5] rounded-3xl p-4 mb-4">
      <View className="flex-row items-start justify-between">
        <View className="bg-[#FFC2F7] rounded-full px-3 py-1">
          <Text className="text-[#212B36] text-xs font-semibold">Yêu cầu</Text>
        </View>
        <Image source={images.requestIcon} style={{ width: 44, height: 44 }} contentFit="contain" />
      </View>
      <Text className="text-[#212B36] text-base font-medium mt-3 leading-6">
        {children}
      </Text>
    </View>
  )
}
