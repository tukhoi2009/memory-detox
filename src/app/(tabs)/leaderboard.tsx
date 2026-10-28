import React from 'react'
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { Notification } from 'iconsax-react-native'
import { useAuth } from '@/context/auth-provider'
import { useProfile } from '@/hooks/useProfile'
import { useNotificationCount } from '@/hooks/useNotificationCount'
import TopPodium from '@/components/cyber/TopPodium'
import { LeaderboardRow } from '@/components/cyber/LeaderboardRow'
import { CyberSafetyGameService } from '@/services/cyberSafetyGame.service'
import IconStar from '~/assets/icons/home/star'

const SCREEN_BG = '#FFF8FA'

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 10,
  elevation: 4,
} as const

export default function LeaderboardScreen() {
  const { user } = useAuth()
  const { profile } = useProfile()
  const { unreadCount } = useNotificationCount()

  const { data: rows = [], isPending } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => CyberSafetyGameService.getLeaderboardWithRank(50),
  })

  const top3 = rows.slice(0, 3).map((r) => ({
    id: r.id,
    username: r.username ?? r.full_name ?? 'Player',
    avatar_url: r.avatar_url,
    total_points: r.total_points,
  }))

  const rest = rows.slice(3)
  const totalPoints = profile?.total_points ?? 0

  const openNotifications = () => {
    router.push('/(screens)/notifications' as never)
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: SCREEN_BG }} edges={['top']}>
      <View className="flex-row items-center justify-between px-5 pt-2 pb-1">
        <Text className="text-2xl font-bold text-[#212B36]">Xếp hạng</Text>

        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={openNotifications}
            activeOpacity={0.85}
            className="w-11 h-11 rounded-full bg-white items-center justify-center"
            style={CARD_SHADOW}
          >
            <Notification size={22} color="#212B36" variant="Outline" />
            {unreadCount > 0 && (
              <View className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#4CC9F0] border border-white" />
            )}
          </TouchableOpacity>

          <View
            className="flex-row items-center bg-white rounded-full px-3.5 py-2 ml-2.5"
            style={CARD_SHADOW}
          >
            <Text className="font-semibold text-[#212B36] text-[15px]">
              {totalPoints.toLocaleString()}
            </Text>
            <View className="ml-1">
              <IconStar />
            </View>
          </View>
        </View>
      </View>

      {isPending ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#06A77D" />
        </View>
      ) : (
        <>
          <TopPodium profiles={top3} />

          <View
            className="flex-1 bg-white mt-1"
            style={{
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              paddingTop: 20,
              backgroundColor: SCREEN_BG
            }}
          >
            <FlatList
              data={rest}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <LeaderboardRow
                  item={item}
                  isMe={item.id === user?.id}
                />
              )}
              ListEmptyComponent={
                rows.length <= 3 ? (
                  <Text className="text-center text-[#919EAB] mt-4 text-sm">
                    Chưa có thêm người chơi trên bảng xếp hạng.
                  </Text>
                ) : null
              }
            />
          </View>
        </>
      )}
    </SafeAreaView>
  )
}
