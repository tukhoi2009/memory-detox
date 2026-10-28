import React from 'react'
import { Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

type Props = {
  label?: string
}

/** Nhãn âm thanh gây nhiễu — hiển thị dưới đoạn văn, không đè lên nội dung đọc */
export function AudioDistractionPill({
  label = 'Âm thanh: Tiếng xe cộ trên đường, còi xe',
}: Props) {
  return (
    <View
      pointerEvents="none"
      className="mt-3 self-start flex-row items-center rounded-full px-3 py-2"
      style={{ backgroundColor: '#FFDA57', maxWidth: '100%' }}
    >
      <Ionicons name="volume-high" size={16} color="#212B36" />
      <Text className="text-[#212B36] text-xs font-medium ml-1.5 flex-shrink">
        {label}
      </Text>
    </View>
  )
}
