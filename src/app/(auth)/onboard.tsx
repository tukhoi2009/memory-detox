import React from 'react'
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { images } from '@/constants'
import AppButton from '@/components/common/AppButton'
import { ERouteTable } from '@/constants/route-table'

export default function OnboardScreen() {
  const router = useRouter()

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View className="flex-1 px-6 pb-8">
        <View className="flex-1 justify-center items-center mt-2">
          <Text className="text-center text-secondary mb-8 text-base font-semibold tracking-[3px] uppercase">
            MEMORY DETOX
          </Text>
          <Image
            source={images.onboardingHero}
            contentFit="contain"
            style={{ width: '100%', height: 329 }}
            accessibilityLabel="Minh họa rèn luyện trí nhớ"
          />
        </View>

        <View className="items-center px-2 mb-8">
          <Text className="text-[#1A202C] text-[26px] font-bold text-center leading-8">
            Bắt đầu {'\n'} rèn luyện trí nhớ
          </Text>
          <Text className="text-[#718096] text-base text-center mt-3 leading-6">
            Đọc chậm giúp bạn hiểu{'\n'} và nhớ sâu hơn.
          </Text>
        </View>

        <View className="gap-3">
          <AppButton
            title="Bắt đầu ngay"
            variant="gradient"
            onPress={() => router.push(ERouteTable.SIGIN_IN)}
          />
          <AppButton
            title="Tạo tài khoản"
            variant="outline"
            onPress={() => router.push(ERouteTable.SIGIN_UP)}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}
