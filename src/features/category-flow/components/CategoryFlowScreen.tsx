import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
  type ViewProps,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { ExitGameModal } from './ExitGameModal'

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 3,
} as const

type Props = ViewProps & {
  title?: string
  onBack?: () => void
  showExitConfirm?: boolean
  onConfirmExit?: () => void
  footer?: React.ReactNode
  children: React.ReactNode
  bg?: string
}

export function CategoryFlowScreen({
  title,
  onBack,
  showExitConfirm = false,
  onConfirmExit,
  footer,
  children,
  bg = '#FFFFFF',
  className,
  ...rest
}: Props) {
  const router = useRouter()
  const [exitVisible, setExitVisible] = useState(false)

  const handleBackPress = () => {
    if (showExitConfirm) {
      setExitVisible(true)
      return
    }
    if (onBack) {
      onBack()
      return
    }
    router.back()
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: bg }} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="px-5 pt-2 pb-3 flex-row items-center">
          <TouchableOpacity
            onPress={handleBackPress}
            activeOpacity={0.85}
            className="w-11 h-11 rounded-full bg-white items-center justify-center"
            style={CARD_SHADOW}
          >
            <Ionicons name="chevron-back" size={22} color="#212B36" />
          </TouchableOpacity>
          {title ? (
            <Text
              className="flex-1 text-center text-[#212B36] text-lg font-bold mr-11"
              numberOfLines={1}
            >
              {title}
            </Text>
          ) : (
            <View className="flex-1" />
          )}
        </View>

        <View className={`flex-1 px-5 ${className ?? ''}`} {...rest}>
          {children}
        </View>

        {footer ? <View className="px-5 pb-4">{footer}</View> : null}
      </KeyboardAvoidingView>

      <ExitGameModal
        visible={exitVisible}
        onCancel={() => setExitVisible(false)}
        onConfirm={() => {
          setExitVisible(false)
          onConfirmExit?.()
        }}
      />
    </SafeAreaView>
  )
}

/** @deprecated Use CategoryFlowScreen */
export const ScrollHabitScreen = CategoryFlowScreen
