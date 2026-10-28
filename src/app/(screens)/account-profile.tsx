import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useAuth } from '@/context/auth-provider'
import { useProfile } from '@/hooks/useProfile'
import { getAvatarSource } from '@/utils/avatar'
import AvatarPicker from '@/components/cyber/AvatarPicker'
import { toast } from '@/components/common/ToastManager'
import { Camera } from 'iconsax-react-native'

const DEFAULT_AVATAR_ID = 'avatar_default'

export default function AccountProfileScreen() {
  const { user } = useAuth()
  const { profile, updateProfile } = useProfile()
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const [usernameDraft, setUsernameDraft] = useState('')
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [pendingAvatarId, setPendingAvatarId] = useState<string | null>(null)
  const [isSavingAvatar, setIsSavingAvatar] = useState(false)
  const [showNameModal, setShowNameModal] = useState(false)
  const [pendingName, setPendingName] = useState('')
  const [isSavingName, setIsSavingName] = useState(false)

  useEffect(() => {
    setSelectedAvatar(profile?.avatar_url ?? null)
    setUsernameDraft(profile?.username ?? '')
  }, [profile?.avatar_url, profile?.username])

  const openAvatarModal = () => {
    setPendingAvatarId(selectedAvatar ?? DEFAULT_AVATAR_ID)
    setShowAvatarModal(true)
  }

  const closeAvatarModal = () => {
    setShowAvatarModal(false)
    setPendingAvatarId(null)
  }

  const handleConfirmAvatar = async () => {
    if (!user?.id) return
    const id = pendingAvatarId ?? DEFAULT_AVATAR_ID
    setIsSavingAvatar(true)
    try {
      await updateProfile({
        userId: user.id,
        updates: {
          avatar_url: id,
        },
      })
      setSelectedAvatar(id)
      setShowAvatarModal(false)
      setPendingAvatarId(null)
      toast.success('Thành công', 'Đã cập nhật ảnh đại diện.')
    } catch (e: any) {
      toast.error('Lỗi', 'Không thể cập nhật ảnh đại diện')
    } finally {
      setIsSavingAvatar(false)
    }
  }

  const openNameModal = () => {
    setPendingName(usernameDraft)
    setShowNameModal(true)
  }

  const closeNameModal = () => {
    setShowNameModal(false)
  }

  const handleConfirmName = async () => {
    if (!user?.id) return
    const trimmed = pendingName.trim()
    if (!trimmed) {
      toast.error('Lỗi', 'Tên không được để trống.')
      return
    }

    setIsSavingName(true)
    try {
      await updateProfile({
        userId: user.id,
        updates: {
          username: trimmed,
        },
      })
      setUsernameDraft(trimmed)
      setShowNameModal(false)
      toast.success('Thành công', 'Đã cập nhật tên.')
    } catch (e: any) {
      toast.error('Lỗi', 'Không thể cập nhật tên')
    } finally {
      setIsSavingName(false)
    }
  }

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-neutral items-center justify-center px-6">
        <Text className="text-xl font-bold text-[#1F2937] text-center">Cần đăng nhập</Text>
      </SafeAreaView>
    )
  }

  if (!profile) {
    return (
      <View className="flex-1 bg-neutral items-center justify-center">
        <ActivityIndicator size="large" color="#2BB08F" />
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral">
      <View className="px-4 pb-2 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()} className="w-11 h-11 rounded-full bg-white items-center justify-center">
          <Ionicons name="arrow-back" size={22} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-[#1F2937] font-semibold font-sans text-lg">Hồ sơ</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="px-4 items-center mt-4">
          <View className="relative" style={{ width: 144, height: 144 }}>
            <View className="w-36 h-36 rounded-full bg-[#C6F0D2] items-center justify-center overflow-hidden">
              <Image
                source={getAvatarSource(selectedAvatar, usernameDraft || 'Player')}
                style={{ width: 132, height: 132, borderRadius: 66 }}
              />
            </View>
            <TouchableOpacity
              onPress={openAvatarModal}
              activeOpacity={0.85}
              className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-white items-center justify-center"
              style={{
                borderWidth: 1,
                borderColor: '#E5E7EB',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 2,
                elevation: 2,
              }}
              accessibilityLabel="Chọn ảnh đại diện"
            >
              <Camera size="20" color="#637381"/>
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-4 mt-8">
          <Text className="text-[#1F2937] !font-sans font-semibold text-xl mb-2">Tên</Text>
          <TouchableOpacity
            onPress={openNameModal}
            activeOpacity={0.85}
            className="h-14 px-5 rounded-full bg-transparent font-sans border border-input-outline flex-row items-center"
            accessibilityRole="button"
            accessibilityLabel="Chỉnh sửa tên"
          >
            <Text
              className="text-xl flex-1 font-sans"
              style={{ color: usernameDraft ? '#1F2937' : '#9CA3AF' }}
              numberOfLines={1}
            >
              {usernameDraft.trim() ? usernameDraft : 'Nhập tên'}
            </Text>
          </TouchableOpacity>

          <Text className="text-[#1F2937] !font-sans font-semibold text-xl mt-5 mb-2">Email</Text>
          <TextInput
            editable={false}
            value={user.email ?? ''}
            className="h-14 px-5 rounded-full font-sans bg-[#EEF0F2] border border-[#EEF0F2] text-lg text-[#8D96A0]"
          />
        </View>
      </ScrollView>

      <Modal
        visible={showAvatarModal}
        transparent
        animationType="fade"
        onRequestClose={closeAvatarModal}
      >
        <View
          className="flex-1 justify-center px-5"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        >
          <View className="bg-white rounded-[28px] p-5 pt-6">
            <TouchableOpacity
              onPress={closeAvatarModal}
              disabled={isSavingAvatar}
              className="absolute top-4 right-4 z-10 w-10 h-10 items-center justify-center"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={28} color="#1F2937" />
            </TouchableOpacity>

            <Text className="text-[#1F2937] text-xl font-bold text-center mb-1 pr-8">
              Chọn ảnh đại diện
            </Text>
            <Text className="text-gray-500 text-center text-sm mb-4">
              Chọn một avatar và nhấn Xác nhận
            </Text>

            <View className="mt-2">
              <AvatarPicker
                value={pendingAvatarId}
                onChange={setPendingAvatarId}
                columns={3}
                size={64}
                hideLabels
              />
            </View>

            <TouchableOpacity
              onPress={handleConfirmAvatar}
              disabled={isSavingAvatar || !pendingAvatarId}
              activeOpacity={0.9}
              className="mt-6 min-h-14 rounded-full bg-[#162338] items-center justify-center"
              style={{ opacity: isSavingAvatar || !pendingAvatarId ? 0.55 : 1 }}
            >
              <Text className="text-white text-lg font-semibold">
                {isSavingAvatar ? 'Đang lưu...' : 'Xác nhận'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showNameModal}
        transparent
        animationType="fade"
        onRequestClose={closeNameModal}
      >
        <View
          className="flex-1 justify-center px-5"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        >
          <View className="bg-neutral rounded-[28px] p-5 pt-6">
            <TouchableOpacity
              onPress={closeNameModal}
              disabled={isSavingName}
              className="absolute top-4 right-4 z-10 w-10 h-10 items-center justify-center"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={28} color="#1F2937" />
            </TouchableOpacity>

            <Text className="text-[#1F2937] text-xl font-bold text-center mb-6 pr-8">
              Sửa tên
            </Text>

            <TextInput
              value={pendingName}
              onChangeText={setPendingName}
              placeholder="Nhập tên"
              placeholderTextColor="#9CA3AF"
              autoFocus
              autoCapitalize="words"
              autoCorrect={false}
              editable={!isSavingName}
              className="h-14 px-5 rounded-full bg-white border border-[#E5E7EB] text-xl text-[#1F2937]"
            />

            <TouchableOpacity
              onPress={handleConfirmName}
              disabled={isSavingName}
              activeOpacity={0.9}
              className="mt-6 min-h-14 rounded-full bg-[#162338] items-center justify-center"
              style={{ opacity: isSavingName ? 0.55 : 1 }}
            >
              <Text className="text-white text-lg font-semibold">
                {isSavingName ? 'Đang lưu...' : 'Xác nhận'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
