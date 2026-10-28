import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { APP_BUTTON_GRADIENT } from '@/components/common/AppButton'
import { Lock1, Play, TickCircle } from 'iconsax-react-native'

export type LevelCardState = 'completed' | 'current' | 'locked'

type Props = {
  levelNumber: number
  xpEarned: number
  maxXp: number
  state: LevelCardState
  onPress?: () => void
}

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 6,
  elevation: 2,
} as const

function LevelCardInner({
  levelNumber,
  xpEarned,
  maxXp,
  state,
}: Omit<Props, 'onPress'>) {
  return (
    <>
      <View>
        <Text className="text-[#637381] text-xs font-medium">
          {xpEarned}/{maxXp} XP
        </Text>
        <Text className="text-[#212B36] text-lg font-bold mt-1">
          Cấp độ {levelNumber}
        </Text>
      </View>
      {state === 'completed' ? (
        <View className="w-14 h-14 rounded-2xl bg-[#919EAB14] items-center justify-center">
          <TickCircle size="24" color="#212B36" variant="Bold"/>
        </View>
      ) : state === 'current' ? (
        <View className="w-14 h-14 rounded-2xl bg-[#919EAB14] items-center justify-center">
          <Play size="24" color="#212B36" variant="Bold"/>
        </View>
      ) : (
        <View className="w-14 h-14 rounded-2xl bg-[#919EAB14] items-center justify-center">
          <Lock1 size="24" color="#212B36" variant="Bold"/>
        </View>
      )}
    </>
  )
}

export function LevelCard({
  levelNumber,
  xpEarned,
  maxXp,
  state,
  onPress,
}: Props) {
  const disabled = state === 'locked'

  const shell = (
    <View
      className="flex-row items-center justify-between rounded-3xl px-4 py-4 mb-3"
      style={[
        CARD_SHADOW,
        state === 'completed' && { backgroundColor: '#B3F00B29' },
        state === 'locked' && { backgroundColor: '#919EAB14' },
      ]}
    >
      <LevelCardInner
        levelNumber={levelNumber}
        xpEarned={xpEarned}
        maxXp={maxXp}
        state={state}
      />
    </View>
  )

  if (state === 'current') {
    return (
      <Pressable onPress={onPress} disabled={disabled}>
        <LinearGradient
          colors={[...APP_BUTTON_GRADIENT]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ borderRadius: 24, marginBottom: 12, ...CARD_SHADOW }}
        >
          <View className="flex-row items-center justify-between px-4 py-4">
            <LevelCardInner
              levelNumber={levelNumber}
              xpEarned={xpEarned}
              maxXp={maxXp}
              state={state}
            />
          </View>
        </LinearGradient>
      </Pressable>
    )
  }

  return (
    <Pressable onPress={onPress} disabled={disabled} style={{ opacity: disabled ? 0.85 : 1 }}>
      {shell}
    </Pressable>
  )
}
