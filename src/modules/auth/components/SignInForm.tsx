import { Image, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import GoogleButton from '@/components/common/GoogleButton'
import AppInput from '@/components/form/AppInput'
import AppButton from '@/components/common/AppButton'
import { useRouter } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import { AuthService } from '@/services/auth.service'
import { toast } from '@/components/common/ToastManager'
import { images } from '@/constants'

type Props = {}

const SignInForm = ({}: Props) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const _handleLogin = async () => {
    // Validate inputs
    if (!email.trim() || !password.trim()) {
      toast.error('Lỗi', 'Vui lòng điền đầy đủ thông tin')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Lỗi', 'Email không hợp lệ')
      return
    }

    setLoading(true)

    try {
      const { session, user } = await AuthService.signIn(email, password)

      if (session && user) {
        // Check if user has completed profile setup
        // If not, redirect to profile setup, otherwise to home
        router.replace(ERouteTable.HOME)
        // router.replace(ERouteTable.PLAN_ONBOARDING)
      }
    } catch (error: any) {
      let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại.'

      if (error?.message?.includes('Invalid login credentials')) {
        errorMessage = 'Email hoặc mật khẩu không đúng'
      } else if (error?.message?.includes('Email not confirmed')) {
        errorMessage = 'Vui lòng xác nhận email trước khi đăng nhập'
      }

      toast.error('Lỗi đăng nhập', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const _onSignUpScreen = () => {
    router.push(ERouteTable.SIGIN_UP)
  }

  const _onForgotPassword = () => {
    router.push(ERouteTable.FORGOT_PASSWORD)
  }

  return (
    <View className="px-8">
      <View className="justify-center items-center mb-4">
        <Image source={images.logoApp} className="w-40 h-40" resizeMode="contain" />
      </View>
      <Text className="text-4xl text-center text-primary mb-10 font-normal">Đăng nhập</Text>
      <View className="flex-col gap-4">
        <View>
          <AppInput
            className="h-14 border border-[#919EAB52] pl-6 rounded-full bg-transparent font-normal"
            placeholder="user@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
          <AppInput
            className="h-14 border border-[#919EAB52] pl-6 rounded-full bg-transparent font-normal"
            placeholder="Mật khẩu"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />
        </View>

        <AppButton
          title={loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          onPress={_handleLogin}
          variant="gradient"
          disabled={loading}
        />
        <View className="flex-row gap-2 justify-center">
          <Text className="text-secondary text-sm font-normal">Bạn cần một tài khoản?</Text>
          <TouchableOpacity onPress={_onSignUpScreen} disabled={loading}>
            <Text className="underline text-primary font-normal">Đăng ký</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity className="items-center" onPress={_onForgotPassword} disabled={loading}>
          <Text className="underline text-secondary font-normal">Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default SignInForm
