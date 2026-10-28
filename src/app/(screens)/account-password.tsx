import React, { useState } from 'react'
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useAuth } from '@/context/auth-provider'
import { AuthService } from '@/services/auth.service'
import AppButton from '@/components/common/AppButton'
import { toast } from '@/components/common/ToastManager'

export default function AccountPasswordScreen() {
  const { user } = useAuth()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChangePassword = async () => {
    if (!user?.id || !user.email) return
    if (!oldPassword.trim()) {
      toast.error('Lỗi', 'Vui lòng nhập mật khẩu cũ')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Lỗi', 'Mật khẩu xác nhận không khớp')
      return
    }

    setIsSubmitting(true)
    try {
      // Xác thực lại mật khẩu cũ trước khi đổi mật khẩu mới.
      await AuthService.signIn(user.email, oldPassword)
      await AuthService.updatePassword(newPassword)
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast.success('Thành công!', 'Đã cập nhật mật khẩu.')
      router.back()
    } catch (e: any) {
      toast.error('Lỗi', 'Không thể cập nhật mật khẩu.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral">
      <View className="px-4 pb-2 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()} className="w-11 h-11 rounded-full bg-white items-center justify-center">
          <Ionicons name="arrow-back" size={22} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-[#1F2937] font-semibold text-lg">Đổi mật khẩu</Text>
        <View style={{ width: 44 }} />
      </View>

      <View className="px-4 mt-20">
        <Text className="text-[#6B7280] font-medium">
          Đặt mật khẩu mạnh để bảo vệ tài khoản của bạn an toàn hơn.
        </Text>
        <TextInput
          value={oldPassword}
          onChangeText={setOldPassword}
          placeholder="Nhập mật khẩu cũ"
          secureTextEntry
          className="h-14 px-5 rounded-full bg-white border border-input-outline mt-7"
        />
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Nhập mật khẩu mới"
          secureTextEntry
          className="h-14 px-5 rounded-full bg-white border border-input-outline mt-4"
        />
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Nhập lại mật khẩu mới"
          secureTextEntry
          className="h-14 px-5 rounded-full bg-white border border-input-outline mt-4"
        />
      </View>
      <View className="px-4 absolute left-0 right-0 bottom-6">
        <AppButton
          title={isSubmitting ? 'Đang cập nhật...' : 'Xác nhận đổi mật khẩu'}
          onPress={handleChangePassword}
          disabled={isSubmitting}
          className="min-h-14"
        />
      </View>
    </SafeAreaView>
  )
}
