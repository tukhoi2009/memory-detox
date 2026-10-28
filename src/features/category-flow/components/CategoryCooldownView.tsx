import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import AppButton from '@/components/common/AppButton'
import { CategoryFlowScreen } from './CategoryFlowScreen'
import { images } from '@/constants'

function formatRemaining(ms: number): string {
  if (ms <= 0) return '0 phút'
  const totalMin = Math.ceil(ms / 60_000)
  if (totalMin < 60) return `${totalMin} phút`
  const hours = Math.floor(totalMin / 60)
  const mins = totalMin % 60
  if (mins === 0) return `${hours} giờ`
  return `${hours} giờ ${mins} phút`
}

type Props = {
  title: string
  cooldownEndsAt: string
  onExit: () => void
  onContinue: () => void
}

/** Màn khóa + đếm ngược củng cố (Ghi nhớ bền vững) */
export function CategoryCooldownView({
  title,
  cooldownEndsAt,
  onExit,
  onContinue,
}: Props) {
  const endMs = new Date(cooldownEndsAt).getTime()
  const [remainingMs, setRemainingMs] = useState(() =>
    Math.max(0, endMs - Date.now()),
  )

  useEffect(() => {
    const tick = () => setRemainingMs(Math.max(0, endMs - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [endMs])

  return (
    <CategoryFlowScreen
      title={title}
      showExitConfirm
      onConfirmExit={onExit}
      footer={
        <AppButton title="Tiếp theo" variant="gradient" onPress={onContinue} />
      }
    >
      <View className="flex-1 items-center justify-center px-2">
        <Image
          source={images.lockIcon}
          contentFit="contain"
          style={{ width: 200, height: 200 }}
        />
        <Text className="text-[#212B36] text-2xl font-bold text-center mt-6">
          Nội dung đã bị khóa
        </Text>
        <Text className="text-[#919EAB] text-base text-center mt-3 leading-6 px-1">
          Bạn vừa hoàn thành một phiên luyện trí nhớ. Để thông tin được lưu trữ tốt
          hơn, não cần thời gian xử lý và củng cố.
        </Text>
        <Text className="text-[#637381] text-base mt-6">Mở lại sau:</Text>
        <View className="flex-row items-center mt-2 gap-2">
          <Ionicons name="hourglass-outline" size={22} color="#FFAB00" />
          <Text className="text-[#212B36] text-xl font-bold">
            {formatRemaining(remainingMs)}
          </Text>
        </View>
      </View>
    </CategoryFlowScreen>
  )
}
