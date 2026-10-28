import { Alert, Image, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import AppInput from '@/components/form/AppInput'
import AppButton from '@/components/common/AppButton'
import GoogleButton from '@/components/common/GoogleButton'
import { useRouter } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import { AuthService } from '@/services/auth.service'
import { toast } from '@/components/common/ToastManager'
import { images } from '@/constants'

type Props = {}

const SignUpForm = ({ }: Props) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const _handleSignUp = async () => {
    // Validate inputs
    if (!name.trim()) {
      toast.error('Lỗi', 'Vui lòng nhập tên')
      return
    }

    if (!email.trim() || !password.trim()) {
      toast.error('Lỗi', 'Vui lòng nhập email và mật khẩu')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Lỗi', 'Email không hợp lệ')
      return
    }

    // Validate password length
    if (password.length < 6) {
      toast.error('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    setLoading(true)

    try {
      const data = await AuthService.signUp(email, password, name.trim())

      if (data.session) {
        toast.success('Đăng ký thành công', 'Hoàn tất hồ sơ của bạn')
        router.replace({
          pathname: ERouteTable.USER_INFO,
          params: { username: name.trim() },
        })
      } else {
        toast.success(
          'Đăng ký thành công',
          'Vui lòng nhập mã OTP đã gửi qua email.'
        )
        router.replace({
          pathname: ERouteTable.VERIFY_EMAIL as any,
          params: {
            email: email.trim(),
            username: name.trim(),
          },
        })
      }
    } catch (error: any) {
      let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại.'

      if (error?.message) {
        const msg = error.message.toLowerCase()

        if (msg.includes('already registered') || msg.includes('already been registered')) {
          errorMessage = 'Email này đã được đăng ký'
        } else if (msg.includes('password should be') || msg.includes('password is too weak')) {
          errorMessage = 'Mật khẩu không đủ mạnh. Vui lòng dùng mật khẩu mạnh hơn.'
        } else if (msg.includes('invalid email') || msg.includes('email is invalid') || msg.includes('email address') && msg.includes('invalid')) {
          errorMessage = 'Email không hợp lệ. Vui lòng sử dụng email thật (Gmail, Outlook, v.v.)'
        } else if (msg.includes('network') || msg.includes('fetch')) {
          errorMessage = 'Không thể kết nối. Vui lòng kiểm tra internet.'
        } else if (msg.includes('user already registered')) {
          errorMessage = 'Email này đã được đăng ký'
        } else {
          // Show actual error message for debugging
          errorMessage = `Lỗi: ${error.message}`
        }
      }

      if (error?.code === 'email_address_invalid') {
        errorMessage = 'Email không hợp lệ. Vui lòng sử dụng email thật (Gmail, Outlook, Yahoo, v.v.)'
      }

      Alert.alert('Lỗi đăng ký', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const _onSignInScreen = () => {
    router.push(ERouteTable.SIGIN_IN)
  }

  return (
    <View className="px-8">
      <View className="justify-center items-center mb-4">
        <Image source={images.logoApp} className="w-40 h-40" resizeMode="contain" />
      </View>
      <Text className="text-3xl text-center text-primary mb-6 font-normal">Tạo tài khoản</Text>
      {/*<GoogleButton title="Đăng ký bằng Google" />*/}
      {/*<Text className="text-secondary text-center mt-4 mb-2">*/}
      {/*  Hoặc sử dụng email của bạn*/}
      {/*</Text>*/}
      <View className="flex-col gap-4">
        <View>
          <AppInput
            className="h-14 border border-[#919EAB52] pl-4 rounded-full font-normal bg-transparent"
            placeholder="Tên của bạn?"
            value={name}
            onChangeText={setName}
            editable={!loading}
          />
          <AppInput
            className="h-14 border border-[#919EAB52] pl-4 rounded-full font-normal bg-transparent"
            placeholder="user@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
          <AppInput
            className="h-14 border border-[#919EAB52] pl-4 rounded-full font-normal bg-transparent"
            placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
        </View>

        <AppButton
          title={loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
          onPress={_handleSignUp}
          disabled={loading}
          variant="gradient"
        />
        <View className="flex-row gap-2 justify-center">
          <Text className="text-secondary text-sm font-normal">Bạn có một tài khoản?</Text>
          <TouchableOpacity onPress={_onSignInScreen} disabled={loading}>
            <Text className="underline text-primary font-normal">Đăng nhập</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-secondary text-xs text-center font-normal mt-6 leading-5">
          Bằng cách đăng ký, bạn đồng ý với {'\n'}
          Điều khoản, Chính sách bảo mật và {'\n'}
          quyền riêng tư của chúng tôi.
        </Text>
      </View>
    </View>
  )
}

export default SignUpForm
