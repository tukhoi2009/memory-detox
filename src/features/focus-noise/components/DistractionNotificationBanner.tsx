import React, { useEffect, useRef } from 'react'
import { Animated, Text, View } from 'react-native'
import * as Haptics from 'expo-haptics'
import { Sms } from 'iconsax-react-native'

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.12,
  shadowRadius: 12,
  elevation: 6,
} as const

/**
 * Banner thông báo giả — xuất hiện giữa nhiệm vụ và đoạn văn, không đè status bar hay nội dung đọc.
 */
export function DistractionNotificationBanner() {
  const translateY = useRef(new Animated.Value(-16)).current
  const opacity = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(0.96)).current

  useEffect(() => {
    const timer = setTimeout(() => {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          friction: 9,
          tension: 55,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 8,
          tension: 50,
        }),
      ]).start()
    }, 2500)

    return () => clearTimeout(timer)
  }, [opacity, scale, translateY])

  return (
    <Animated.View
      pointerEvents="none"
      className="mb-4"
      style={{
        opacity,
        transform: [{ translateY }, { scale }],
      }}
    >
      <View
        className="flex-row items-center rounded-2xl px-3 py-2.5 border border-[#E5E7EB]"
        style={[{ backgroundColor: '#FFFFFF' }, CARD_SHADOW]}
      >
        <View className="w-10 h-10 rounded-xl bg-[#77ED8B] items-center justify-center mr-3">
          <Sms color="#212B36" size={20} variant="Bold" />
        </View>
        <View className="flex-1 min-w-0">
          <Text className="text-[#637381] text-[11px] font-medium">Tin nhắn · vừa xong</Text>
          <Text className="text-[#212B36] text-sm font-semibold mt-0.5" numberOfLines={2}>
            Mai: Đi ăn tối không?
          </Text>
        </View>
      </View>
    </Animated.View>
  )
}
