import React from 'react'
import {
  Modal,
  Pressable,
  Text,
  View,
  useWindowDimensions,
  Image
} from 'react-native'
import * as Location from 'expo-location'
import { toast } from '@/components/common/ToastManager'
import { images } from '@/constants'

type Props = {
  visible: boolean
  onClose: () => void
}

export function LocationPermissionModal({ visible, onClose }: Props) {
  const { width } = useWindowDimensions()
  const cardW = Math.min(width - 48, 360)

  const handleAllow = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        toast.error('Quyền vị trí', 'Bạn có thể bật sau trong Cài đặt hệ thống.')
      }
    } catch {
      toast.error('Lỗi', 'Không thể xin quyền vị trí.')
    } finally {
      onClose()
    }
  }

  const handleLater = () => {
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/55 justify-center items-center px-6">
        <Pressable className="absolute inset-0" onPress={handleLater} accessibilityRole="button" />
        <View
          className="bg-white rounded-3xl overflow-hidden"
          style={{ width: cardW }}
        >
          <View className="flex items-center">
            <Image source={images.location} className="w-[297px] h-[250px]" />
          </View>

          <View className="px-6 pt-6 pb-2">
            <Text className="text-xl font-bold text-center text-[#212B36] mb-3">
              Chia sẻ vị trí của bạn
            </Text>
            <Text className="text-sm text-center text-[#637381] leading-5 mb-6">
              Chúng tôi dùng vị trí để ghi lại quãng đường, theo dõi lộ trình và đo hiệu suất khi bạn đạp xe.
            </Text>

            <Pressable
              onPress={handleAllow}
              className="bg-brandLime rounded-full py-4 mb-3 active:opacity-90"
            >
              <Text className="text-center font-semibold text-[#212B36] text-base">
                Cho phép truy cập
              </Text>
            </Pressable>

            <Pressable
              onPress={handleLater}
              className="border border-[#919EAB52] rounded-full py-4 mb-6 active:opacity-80"
            >
              <Text className="text-center font-semibold text-[#212B36] text-base">
                Để sau
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}
