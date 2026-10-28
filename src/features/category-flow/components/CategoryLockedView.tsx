import React from 'react'
import { Text, View } from 'react-native'
import { Image } from 'expo-image'
import AppButton from '@/components/common/AppButton'
import { CategoryFlowScreen } from './CategoryFlowScreen'
import { images } from '@/constants'

type Props = {
  title: string
  onExit: () => void
  onNext: () => void
}

export function CategoryLockedView({ title, onExit, onNext }: Props) {
  return (
    <CategoryFlowScreen
      title={title}
      showExitConfirm
      onConfirmExit={onExit}
      footer={<AppButton title="Tiếp theo" variant="gradient" onPress={onNext} />}
    >
      <View className="flex-1 items-center justify-center">
        <Image
          source={images.lockIcon}
          contentFit="contain"
          style={{ width: 200, height: 200 }}
        />
        <Text className="text-[#212B36] text-2xl font-bold text-center mt-6">
          Nội dung đã bị khóa
        </Text>
        <Text className="text-[#919EAB] text-base text-center mt-3 leading-6 px-2">
          Bạn còn nhớ chứ?{'\n'}Hãy tái hiện lại những gì bạn vừa xem.
        </Text>
      </View>
    </CategoryFlowScreen>
  )
}
