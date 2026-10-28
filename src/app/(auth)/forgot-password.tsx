import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppInput from '@/components/form/AppInput'
import AppButton from '@/components/common/AppButton'
import { AuthService } from '@/services/auth.service'
import { ERouteTable } from '@/constants/route-table'
import { toast } from '@/components/common/ToastManager'

const ForgotPasswordScreen = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [loading, setLoading] = useState(false)

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  }

  const handleSendResetEmail = async () => {
    setEmailError('')

    if (!email.trim()) {
      setEmailError('Email không được để trống')
      return
    }

    if (!validateEmail(email.trim())) {
      setEmailError('Email chưa chính xác. Vui lòng kiểm tra lại!')
      return
    }

    setLoading(true)

    try {
      await AuthService.sendPasswordResetOTP(email.trim())
      router.push({
        pathname: ERouteTable.VERIFY_OTP_RESET,
        params: { email: email.trim() },
      })
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Không thể gửi mã xác thực.'
      let errorMessage = 'Không thể gửi mã xác thực. Vui lòng thử lại sau.'
      if (message.includes('User not found')) {
        errorMessage = 'Email không tồn tại trong hệ thống'
      } else if (message.includes('Rate limit')) {
        errorMessage = 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.'
      }
      toast.error('Lỗi', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-row items-center justify-center px-4 pb-2 pt-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute left-4 h-10 w-10 items-center justify-center"
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
          >
            <Ionicons name="chevron-back" size={24} color="#212B36" />
          </TouchableOpacity>
          <Text className="font-bold text-lg text-primary">Quên mật khẩu</Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow px-6 pb-8 pt-6"
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-center text-sm leading-6 text-secondary">
            Vui lòng nhập địa chỉ email được liên kết với tài khoản của bạn. Chúng tôi sẽ gửi mã
            OTP để đặt lại mật khẩu.
          </Text>

          <View className="mt-8">
            <Text className="mb-2 text-sm font-medium text-primary">Email</Text>
            <AppInput
              className="h-14 rounded-full border border-input-outline bg-transparent px-4"
              placeholder="user@example.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text)
                if (emailError) setEmailError('')
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
            {emailError ? (
              <Text className="mt-2 text-sm text-[#E25B46]">{emailError}</Text>
            ) : null}
          </View>

          <View className="mt-6">
            <AppButton
              title={loading ? 'Đang gửi...' : 'Gửi mã xác thực'}
              onPress={handleSendResetEmail}
              disabled={loading}
              className="min-h-14 bg-primary"
            />
          </View>

          <TouchableOpacity
            onPress={() => router.replace(ERouteTable.SIGIN_IN)}
            className="mt-8 flex-row items-center justify-center"
            disabled={loading}
          >
            <Ionicons name="chevron-back" size={18} color="#637381" />
            <Text className="ml-1 text-sm text-secondary">Quay lại đăng nhập</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default ForgotPasswordScreen
