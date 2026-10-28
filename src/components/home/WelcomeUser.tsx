import { Text, View } from 'react-native'
import React from 'react'

type Props = {}

const WelcomeUser = (props: Props) => {
  return (
    <View className="gap-1 my-6">
      <Text className="text-4xl text-primary font-medium">Xin chào Bách!</Text>
      <Text className="text-sm text-secondary">Cùng quản lý chi tiêu hiệu quả.</Text>
    </View>
  )
}

export default WelcomeUser
