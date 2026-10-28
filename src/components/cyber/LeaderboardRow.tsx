import React from 'react'
import { Text, View, type ViewStyle } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { APP_BUTTON_GRADIENT } from '@/components/common/AppButton'
import { getAvatarSource } from '@/utils/avatar'
import type { LeaderboardRow as LeaderboardRowType } from '@/services/cyberSafetyGame.service'

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 3,
} as const

const ROW_INNER = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  gap: 12,
  paddingVertical: 12,
  paddingHorizontal: 16,
  minHeight: 72,
}

type Props = {
  item: LeaderboardRowType
  isMe: boolean
}

export function LeaderboardRow({ item, isMe }: Props) {
  const displayName = item.username ?? item.full_name ?? 'Player'
  const xpLabel = `${(item.total_points ?? 0).toLocaleString()} XP`

  const inner = (
    <View style={ROW_INNER}>
      <Image
        source={getAvatarSource(item.avatar_url, displayName)}
        style={{ width: 48, height: 48, borderRadius: 24 }}
        contentFit="cover"
      />
      <View className="flex-1">
        <Text
          className="text-[#212B36] text-base font-semibold"
          numberOfLines={1}
        >
          {displayName}
        </Text>
        <Text
          className={`text-sm font-medium mt-0.5 ${isMe ? 'text-[#454F5B]' : 'text-[#919EAB]'}`}
        >
          {xpLabel}
        </Text>
      </View>
      <Text
        className={`text-base font-semibold ${isMe ? 'text-[#454F5B]' : 'text-[#919EAB]'}`}
      >
        #{item.rank}
      </Text>
    </View>
  )

  const shellStyle: ViewStyle = {
    borderRadius: 24,
    marginBottom: 8,
    overflow: 'hidden',
    ...CARD_SHADOW,
  }

  if (isMe) {
    return (
      <LinearGradient
        colors={[...APP_BUTTON_GRADIENT]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={shellStyle}
      >
        {inner}
      </LinearGradient>
    )
  }

  return (
    <View style={[shellStyle, { backgroundColor: '#F4F6F8' }]}>
      {inner}
    </View>
  )
}
