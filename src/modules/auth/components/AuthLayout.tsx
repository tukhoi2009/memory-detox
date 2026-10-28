import { Image, ImageBackground, SafeAreaView, StatusBar, TouchableOpacity, View } from 'react-native'
import React, { PropsWithChildren } from 'react'
import { images } from '@/constants'
import { ArrowCircleLeft } from 'iconsax-react-native'
import { router } from 'expo-router'

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <View className="flex-1 bg-white">
      <SafeAreaView
        className="flex-1 justify-between"
        style={{ paddingTop: StatusBar.currentHeight }}
      >
        <TouchableOpacity className="p-4 items-start" onPress={() => router.back()}>
          <ArrowCircleLeft size="48" color="#637381" variant="Bold"/>
        </TouchableOpacity>
        <View className="-mt-40">{children}</View>
        <View />
      </SafeAreaView>
    </View>
  )
}

export default AuthLayout
