import React, { useMemo, useState } from 'react'
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import {
  Notification,
  User,
  Lock,
  InfoCircle,
  Call,
  ShieldTick,
  DocumentText,
  ArrowRight2
} from 'iconsax-react-native'
import { useAuth } from '@/context/auth-provider'
import { useProfile } from '@/hooks/useProfile'
import { useNotificationCount } from '@/hooks/useNotificationCount'
import { AuthService } from '@/services/auth.service'
import { getAvatarSource } from '@/utils/avatar'
import { AppHeader } from '@/components/common/AppHeader'

export default function UserScreen() {
  const { user } = useAuth()
  const { profile } = useProfile()
  const { unreadCount } = useNotificationCount()
  const queryClient = useQueryClient()

  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true)
            try {
              await AuthService.signOut()
              await queryClient.clear()
              router.replace('/sign-in')
            } catch (e: any) {
              Alert.alert('Lỗi', e?.message ?? 'Không thể đăng xuất')
            } finally {
              setIsLoggingOut(false)
            }
          }
        }
      ]
    )
  }

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-[#FFF7FC] items-center justify-center px-6">
        <Text className="text-xl font-bold text-[#1F2937] text-center">Cần đăng nhập</Text>
        <Text className="text-gray-600 mt-2 text-center font-medium">
          Vui lòng đăng nhập để xem thông tin tài khoản.
        </Text>
      </SafeAreaView>
    )
  }

  if (!profile) {
    return (
      <View className="flex-1 bg-[#FFF7FC] items-center justify-center">
        <ActivityIndicator size="large" color="#2BB08F" />
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-[#FFF7FC]" edges={['top']}>
      <AppHeader title="Cá nhân" unreadCount={unreadCount} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile Info */}
        <View className="items-center mt-6">
          <View className="w-32 h-32 rounded-full border-4 border-white overflow-hidden">
            <Image
              source={getAvatarSource(profile.avatar_url, profile.username ?? 'User')}
              className="w-full h-full"
            />
          </View>
          <Text className="text-2xl font-bold text-[#1F2937] mt-4">{profile.username ?? 'Nhân Hóa'}</Text>
          <Text className="text-gray-400 text-sm mt-1">{user.email ?? 'nhanhoa@gmail.com'}</Text>
        </View>

        {/* Settings Section */}
        <View className="px-6 mt-8">
          <Text className="text-gray-400 font-medium mb-3 ml-2">Cài đặt</Text>
          <View className="bg-white rounded-[32px] p-2 ">
            <SettingsItem
              icon={<Notification size={20} color="#6B7280" />}
              label="Thông báo"
              onPress={() => router.push('/(screens)/notifications' as never)}
              rightElement={
                unreadCount > 0 ? (
                  <View className="min-w-[22px] rounded-full bg-primary-main px-2 py-0.5 items-center">
                    <Text className="text-xs font-bold text-primary">{unreadCount}</Text>
                  </View>
                ) : (
                  <ArrowRight2 size={18} color="#9CA3AF" />
                )
              }
            />
            <SettingsItem
              icon={<User size={20} color="#6B7280" />}
              label="Tài khoản"
              onPress={() => router.push('/account-profile' as any)}
            />
            <SettingsItem
              icon={<Lock size={20} color="#6B7280" />}
              label="Thay đổi mật khẩu"
              onPress={() => router.push('/account-password' as any)}
              isLast
            />
          </View>
        </View>

        {/* About Section */}
        <View className="px-6 mt-6">
          <Text className="text-gray-400 font-medium mb-3 ml-2">Giới thiệu</Text>
          <View className="bg-white rounded-[32px] p-2 ">
            <SettingsItem
              icon={<InfoCircle size={20} color="#6B7280" />}
              label="Giới thiệu"
              onPress={() => router.push('/account-about' as any)}
            />
            <SettingsItem
              icon={<Call size={20} color="#6B7280" />}
              label="Liên hệ & Hỗ trợ"
              onPress={() => router.push('/account-support' as any)}
            />
            <SettingsItem
              icon={<ShieldTick size={20} color="#6B7280" />}
              label="Chính sách bảo mật"
              onPress={() => router.push('/account-privacy' as any)}
            />
            <SettingsItem
              icon={<DocumentText size={20} color="#6B7280" />}
              label="Điều khoản & Điều kiện"
              onPress={() => router.push('/account-terms' as any)}
              isLast
            />
          </View>
        </View>

        {/* Logout Button */}
        <View className="px-6 mt-8">
          <TouchableOpacity
            onPress={handleLogout}
            disabled={isLoggingOut}
            className="bg-[#FEE2E2] py-4 rounded-3xl items-center justify-center active:opacity-70"
          >
            <Text className="text-[#EF4444] font-bold text-lg">
              {isLoggingOut ? 'Đang xử lý...' : 'Đăng xuất'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <Text className="text-center text-gray-400 mt-8 text-xs mb-20 font-medium">
          Phiên bản v2.4.1
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}

function SettingsItem({
  icon,
  label,
  onPress,
  rightElement,
  isLast = false
}: {
  icon: React.ReactNode,
  label: string,
  onPress?: () => void,
  rightElement?: React.ReactNode,
  isLast?: boolean
}) {
  const content = (
    <View className={`flex-row items-center py-4 px-4 ${!isLast ? 'border-b border-gray-50' : ''}`}>
      <View className="w-10 h-10 rounded-full bg-[#B3F00B29] items-center justify-center mr-4">
        {icon}
      </View>
      <Text className="flex-1 text-[#212B36] font-medium text-base">{label}</Text>
      {rightElement ? (
        rightElement
      ) : (
        <ArrowRight2 size={18} color="#919EAB" variant="Outline" />
      )}
    </View>
  )

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
        {content}
      </TouchableOpacity>
    )
  }

  return content
}


