import React from 'react'
import { Text, View } from 'react-native'
import { Image, type ImageSource } from 'expo-image'
import AppButton from '@/components/common/AppButton'
import { CategoryFlowScreen } from './CategoryFlowScreen'
import images from '@/constants/images'

type Props = {
  onStart: () => void
  illustration?: ImageSource
}

export function CategoryReadyView({
  onStart,
  illustration = images.ob2,
}: Props) {
  return (
    <CategoryFlowScreen bg="#FFF8FA">
      <View className="flex-1 items-center justify-center">
        <Image
          source={images.readyIcon}
          contentFit="contain"
          style={{ width: 220, height: 200 }}
        />
        <Text className="text-[#212B36] text-2xl font-bold text-center">
          Bạn đã sẵn sàng chưa?
        </Text>
        <Text className="text-[#637381] text-base text-center mt-3 px-4">
          Hãy đọc kỹ nội dung và ghi nhớ!
        </Text>
      </View>
      <AppButton title="Tiếp theo" variant="gradient" onPress={onStart} />
    </CategoryFlowScreen>
  )
}
