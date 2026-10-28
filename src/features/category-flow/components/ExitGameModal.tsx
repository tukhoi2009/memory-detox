import React from 'react'
import { Modal, Pressable, Text, View } from 'react-native'
import AppButton from '@/components/common/AppButton'

type Props = {
  visible: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function ExitGameModal({ visible, onCancel, onConfirm }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable
        className="flex-1 bg-black/45 justify-center px-6"
        onPress={onCancel}
      >
        <Pressable
          className="bg-white rounded-3xl px-6 py-6"
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-[#212B36] text-xl font-bold text-center">
            Thoát trò chơi
          </Text>
          <Text className="text-[#637381] text-base text-center mt-3 leading-6">
            Bạn có chắc chắn muốn thoát trò chơi?
          </Text>
          <View className="flex-row gap-3 mt-6">
            <View className="flex-1">
              <AppButton title="Hủy bỏ" variant="outline" onPress={onCancel} />
            </View>
            <View className="flex-1">
              <AppButton title="Xác nhận" variant="gradient" onPress={onConfirm} />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}
