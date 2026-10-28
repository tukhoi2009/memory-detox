import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { UserProfile } from '../types/user-profile.types'

interface ProfileHeaderProps {
    user: UserProfile
    onEditPress: () => void
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEditPress }) => {
    return (
        <View className="bg-[#919EAB14] rounded-3xl p-5 mx-4 mb-4">
            <View className="flex-row items-center">
                {/* Avatar */}

              {user?.avatar ? (
                <Image
                  key={user.avatar}
                  source={{
                    uri: user.avatar,
                  }}
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <View className="w-16 h-16 rounded-full bg-gray-300 items-center justify-center">
                  <Text className="text-gray-600 text-lg">👤</Text>
                </View>
              )}

                {/* User Info */}
                <View className="flex-1 ml-4">
                    <Text className="text-lg font-semibold text-gray-900">{user.name}</Text>
                    <Text className="text-sm text-gray-500 mt-1">{user.email}</Text>

                    {/* Edit Profile Button */}
                    <TouchableOpacity
                        onPress={onEditPress}
                        className="flex-row items-center mt-2"
                    >
                        <Ionicons name="create-outline" size={16} color="#6B7280" />
                        <Text className="text-sm text-gray-600 ml-1">Sửa hồ sơ</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default ProfileHeader
