import React from 'react'
import { Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { APP_BUTTON_GRADIENT } from '@/components/common/AppButton'
import { Timer1 } from 'iconsax-react-native'

export function formatMemorizeTimer(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

type Props = {
  remainingSec: number
  totalSec: number
}

export function MemorizeTimerHeader({ remainingSec, totalSec }: Props) {
  const progress = 1 - remainingSec / totalSec

  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-primary text-xs font-semibold tracking-wider">
          THỜI GIAN
        </Text>
        <LinearGradient
          colors={[...APP_BUTTON_GRADIENT]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            gap: 6,
          }}
        >
          <Timer1 size={24} color="#212B36" variant="Bold"/>
          <Text className="text-[#212B36] font-semibold text-sm">
            {formatMemorizeTimer(remainingSec)}
          </Text>
        </LinearGradient>
      </View>
      <View className="h-2 rounded-full bg-[#F4F6F8] overflow-hidden">
        <View
          className="h-full rounded-full bg-[#D5E94B]"
          style={{ width: `${Math.min(100, progress * 100)}%` }}
        />
      </View>
    </View>
  )
}
