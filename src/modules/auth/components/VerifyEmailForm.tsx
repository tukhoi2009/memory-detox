import { Text, TouchableOpacity, View } from 'react-native'
import React, { useMemo, useState } from 'react'
import AppButton from '@/components/common/AppButton'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import OtpInput from '@/components/form/OtpInput'
import { ArrowLeft2 } from 'iconsax-react-native'
import { AuthService } from '@/services/auth.service'
import { toast } from '@/components/common/ToastManager'

type Props = {}

const VerifyEmailForm = ({}: Props) => {
  const router = useRouter()
  const params = useLocalSearchParams<{ email?: string; username?: string }>()
  const email = (params.email ?? '').trim()
  const username = (params.username ?? '').trim()
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  const maskedEmail = useMemo(() => {
    if (!email) return 'u************@e******.com'
    const [namePart = '', domainPart = ''] = email.split('@')
    const maskedName = `${namePart.slice(0, 1)}${'*'.repeat(Math.max(3, namePart.length - 1))}`
    const maskedDomain = `${domainPart.slice(0, 1)}${'*'.repeat(Math.max(3, domainPart.length - 1))}`
    return `${maskedName}@${maskedDomain}`
  }, [email])

  const _handleVerify = async () => {
    if (!email) {
      toast.error('Lỗi', 'Thiếu email xác thực')
      return
    }
    if (otp.length !== 6) {
      toast.error('Lỗi', 'Vui lòng nhập đủ 6 số OTP')
      return
    }

    setLoading(true)
    try {
      await AuthService.verifySignUpOTP(email, otp)
      toast.success('Thành công', 'Email đã được xác thực')
      router.replace({
        pathname: ERouteTable.USER_INFO,
        params: { username: username || '' },
      })
    } catch (error: any) {
      toast.error('Lỗi xác thực', error?.message ?? 'OTP không hợp lệ')
    } finally {
      setLoading(false)
    }
  }

  const _onResendCode = async () => {
    if (!email) {
      toast.error('Lỗi', 'Thiếu email để gửi lại mã')
      return
    }
    try {
      await AuthService.resendSignUpOTP(email)
      toast.success('Đã gửi lại mã', 'Vui lòng kiểm tra email')
    } catch (error: any) {
      toast.error('Lỗi', error?.message ?? 'Không gửi lại được mã')
    }
  }

  const _onSignIn = () => {
    router.push(ERouteTable.SIGIN_IN)
  }

  const _handleOtpChange = (value: string) => {
    setOtp(value)
  }
  return (
    <View className="px-8">
      <Text className="text-3xl text-center text-primary mb-10">Kiểm tra email</Text>
      <View className="p-6">
        <Text className="text-sm text-center text-disabled">
          Chúng tôi đã gửi cho bạn một mã xác nhận. {`\n`}
          Vui lòng kiểm tra hộp thư đến của bạn tại {`\n`}{maskedEmail}.
        </Text>
      </View>
      <View className="flex-col gap-4">
        <View>
          <OtpInput length={6} onChange={_handleOtpChange} />
        </View>

        <AppButton variant="gradient" title={loading ? 'Đang xác thực...' : 'Xác thực'} onPress={_handleVerify} disabled={loading} />
        <View className="items-center gap-4">
          <Text className="text-primary text-sm">Gửi lại mã. Vui lòng kiểm tra email của bạn.</Text>
          <TouchableOpacity onPress={_onResendCode}>
            <Text className=" text-secondary">Gửi lại mã</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={_onSignIn} className="flex-row gap-1 items-center mt-8">
            <ArrowLeft2 size="20" color="#212B36" />
            <Text className="text-primary">Quay lại đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default VerifyEmailForm
