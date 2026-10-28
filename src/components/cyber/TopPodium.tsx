import React from 'react'
import { Text, View } from 'react-native'
import { Image } from 'expo-image'
import type { LeaderboardProfile } from '@/services/cyberSafetyGame.service'
import { getAvatarSource } from '@/utils/avatar'
import IconCrown from '~/assets/icons/crown'

type TopPodiumProps = {
  profiles: LeaderboardProfile[]
}

const PODIUM_STYLES = {
  1: {
    blockHeight: 180,
    avatarSize: 76,
    borderColor: '#FFAB00',
    badgeColor: '#FFAB00',
    xpColor: '#FFAB00',
    showCrown: true,
  },
  2: {
    blockHeight: 160,
    avatarSize: 64,
    borderColor: '#637381',
    badgeColor: '#9CA3AF',
    xpColor: '#637381',
    showCrown: false,
  },
  3: {
    blockHeight: 150,
    avatarSize: 64,
    borderColor: '#FF8A50',
    badgeColor: '#FF8A50',
    xpColor: '#FF8A50',
    showCrown: false,
  },
} as const

function RankDiamond({
  rank,
  color,
}: {
  rank: 1 | 2 | 3
  color: string
}) {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: -10,
        alignSelf: 'center',
        width: 24,
        height: 24,
        backgroundColor: color,
        borderRadius: 6,
        transform: [{ rotate: '45deg' }],
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          transform: [{ rotate: '-45deg' }],
          color: '#FFFFFF',
          fontSize: 12,
          fontWeight: '700',
        }}
      >
        {rank}
      </Text>
    </View>
  )
}

function PodiumColumn({
  rank,
  profile,
}: {
  rank: 1 | 2 | 3
  profile: LeaderboardProfile
}) {
  const style = PODIUM_STYLES[rank]
  const displayName = profile.username ?? 'Player'
  const xp = (profile.total_points ?? 0).toLocaleString()

  return (
    <View className="flex-1 items-center" style={{ maxWidth: rank === 1 ? 128 : 112 }}>
      {style.showCrown && (
        <IconCrown />
      )}
      {!style.showCrown && <View style={{ height: 26 }} />}

      <View style={{ alignItems: 'center', zIndex: 2, marginBottom: -36 }}>
        <View
          style={{
            width: style.avatarSize,
            height: style.avatarSize,
            borderRadius: style.avatarSize / 2,
            borderWidth: 3,
            borderColor: style.borderColor,
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            source={getAvatarSource(profile.avatar_url ?? null, displayName)}
            style={{
              width: style.avatarSize - 10,
              height: style.avatarSize - 10,
              borderRadius: (style.avatarSize - 10) / 2,
            }}
            contentFit="cover"
          />
          <RankDiamond rank={rank} color={style.badgeColor} />
        </View>
      </View>

      <View
        style={{
          width: '100%',
          minHeight: style.blockHeight,
          backgroundColor: rank === 1 ? '#FFF0F7' : '#FFE0EF',
          paddingTop: 44,
          paddingBottom: 12,
          paddingHorizontal: 6,
          alignItems: 'center',
          borderTopLeftRadius: rank !== 3 ? 20 : 0,
          borderBottomLeftRadius: rank === 2 ? 20: 0,
          borderTopRightRadius: rank === 2 ? 0 : 20,
          borderBottomRightRadius: rank === 3 ? 20 : 0
        }}
      >
        <Text
          className="text-[#212B36] mt-4 text-sm font-medium text-center"
          numberOfLines={1}
        >
          {displayName}
        </Text>
        <Text
          style={{ color: style.xpColor }}
          className="text-base font-bold mt-1"
        >
          {xp} XP
        </Text>
      </View>
    </View>
  )
}

export default function TopPodium({ profiles }: TopPodiumProps) {
  const [p1, p2, p3] = profiles.slice(0, 3)

  if (!p1 && !p2 && !p3) return null

  return (
    <View className="flex-row items-end justify-center px-4 pt-2 pb-4">
      {p2 ? <PodiumColumn rank={2} profile={p2} /> : <View className="flex-1" />}
      {p1 ? <PodiumColumn rank={1} profile={p1} /> : <View className="flex-1" />}
      {p3 ? <PodiumColumn rank={3} profile={p3} /> : <View className="flex-1" />}
    </View>
  )
}
