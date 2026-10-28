import React, { useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  BackHandler,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/context/auth-provider'
import { CyberSafetyGameService } from '@/services/cyberSafetyGame.service'
import { CalendarEdit, Game } from 'iconsax-react-native'
import { images } from '@/constants'
import Markdown from 'react-native-markdown-display'

export default function LessonDetailScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { lessonId, categoryId } = useLocalSearchParams<{ 
    lessonId: string
    categoryId?: string 
  }>()
  const [showHintModal, setShowHintModal] = useState(false)

  const { data: lesson, isLoading: lessonLoading } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () =>
      lessonId ? CyberSafetyGameService.getLessonById(lessonId) : null,
    enabled: !!lessonId,
  })

  const { data: progressRows } = useQuery({
    queryKey: ['user-progress', user?.id],
    queryFn: () => (user?.id ? CyberSafetyGameService.getUserProgress(user.id) : []),
    enabled: !!user?.id,
  })

  const markdownStyles = {
    body: {
      fontSize: 16,
      lineHeight: 24,
      color: '#374151',
      fontFamily: 'SpaceGrotesk_400Regular' as const
    },
    heading1: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: '#1F2937',
      marginTop: 16,
      fontFamily: 'SpaceGrotesk_600SemiBold' as const
    },
    heading2: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: '#1F2937',
      marginTop: 14,
      marginBottom: 6,
    },
    heading3: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: '#374151',
      marginTop: 12,
      marginBottom: 4,
    },
    paragraph: {
      marginTop: 0,
      marginBottom: 12,
      fontSize: 16,
      lineHeight: 24,
      color: '#374151',
    },
    bullet_list: {
      marginTop: 8,
      marginBottom: 12,
    },
    ordered_list: {
      marginTop: 8,
      marginBottom: 12,
    },
    list_item: {
      marginBottom: 6,
      fontSize: 16,
      lineHeight: 24,
      color: '#374151',
    },
    bullet_list_icon: {
      color: '#2BB08F',
      fontSize: 20,
      marginRight: 8,
    },
    code_inline: {
      backgroundColor: '#F3F4F6',
      color: '#1F2937',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      fontSize: 14,
    },
    code_block: {
      backgroundColor: '#F3F4F6',
      padding: 12,
      borderRadius: 8,
      marginTop: 8,
      marginBottom: 12,
      fontSize: 14,
    },
    fence: {
      backgroundColor: '#F3F4F6',
      padding: 12,
      borderRadius: 8,
      marginTop: 8,
      marginBottom: 12,
      fontSize: 14,
    },
    strong: {
      fontWeight: '700' as const,
      color: '#1F2937',
    },
    em: {
      fontStyle: 'italic' as const,
    },
    blockquote: {
      backgroundColor: '#F0F9FF',
      borderLeftWidth: 4,
      borderLeftColor: '#2BB08F',
      paddingLeft: 12,
      paddingVertical: 8,
      marginTop: 8,
      marginBottom: 12,
      fontStyle: 'italic' as const,
    },
  }

  const handleBack = () => {
    // If we have categoryId, navigate to category-lessons
    // Otherwise, try to go back (but use replace to avoid navigation stack issues)
    if (categoryId) {
      router.replace({
        pathname: '/category-lessons',
        params: { categoryId },
      })
    } else if (lesson?.category_id) {
      router.replace({
        pathname: '/category-lessons',
        params: { categoryId: lesson.category_id },
      })
    } else {
      // Fallback: navigate to home
      router.replace('/(tabs)/home')
    }
  }

  useEffect(() => {
    // Handle hardware back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleBack()
      return true // Prevent default back behavior
    })

    return () => backHandler.remove()
  }, [categoryId, lesson?.category_id])

  if (!lessonId) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FFF7ED] px-6">
        <Text className="text-gray-700 font-semibold">
          Thiếu mã bài học.
        </Text>
      </View>
    )
  }

  if (lessonLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FFF7ED]">
        <ActivityIndicator size="large" color="#2BB08F" />
      </View>
    )
  }

  if (!lesson) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FFF7ED] px-6">
        <Text className="text-gray-700 font-semibold">Không tìm thấy bài học.</Text>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-[#FFF7ED]">
      <View className="px-4 pt-16 pb-2 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={handleBack}
          className="w-10 h-10 rounded-full bg-white items-center justify-center"
        >
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </TouchableOpacity>
        <View style={{ width: 40 }} />
        <TouchableOpacity
          onPress={() => setShowHintModal(true)}
          className="w-12 h-12 rounded-full bg-white items-center justify-center"
        >
          <Ionicons name="bulb-outline" size={20} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="px-4">
          <View>
            <Text className="text-2xl font-extrabold text-[#2BB08F] tracking-widest">
              Chủ đề:
            </Text>
            <Text className="text-2xl font-extrabold text-[#241B5B] mt-2">
              {lesson.title}
            </Text>

            <View className="mt-5">
              <Markdown style={markdownStyles}>
                {lesson.content}
              </Markdown>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="mt-5 px-4 mb-4 items-center flex-row">
        <TouchableOpacity 
          onPress={() => router.push({
            pathname: '/quiz-history',
            params: { lessonId: lesson.id },
          })}
          className="h-14 w-14 rounded-full border border-primary-main flex-row items-center justify-center mr-2"
        >
          <CalendarEdit size="24" color="#00917A" variant="Bold" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/quiz-game',
              params: { lessonId: lesson.id },
            })
          }
          className="min-h-14 flex-1 flex-row items-center gap-2 justify-center bg-[#2BB08F] rounded-full"
        >
          <Game size="24" color="#FFF" variant="Bold" />
          <Text className="text-white font-medium">Trò chơi</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showHintModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowHintModal(false)}
      >
        <View
          className="flex-1"
          style={{
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            paddingHorizontal: 18,
          }}
        >
          <View className="bg-white rounded-3xl p-6">
            <TouchableOpacity
              className="absolute top-4 right-4 z-10"
              onPress={() => setShowHintModal(false)}
            >
              <Ionicons name="close" size={30} color="#1F2937" />
            </TouchableOpacity>
            <View className="items-center mb-4 mt-2">
              <Image
                source={images.hint}
                className="h-[180px] w-[180px]"
                resizeMode="cover"
              />
            </View>
            <Text className="text-secondary text-lg leading-8">
              {lesson.hint ??
                '• Dùng mật khẩu dài và phức tạp\n• Không dùng thông tin cá nhân\n• Không dùng chung mật khẩu\n• Bật xác thực 2 lớp'}
            </Text>
            <TouchableOpacity
              onPress={() => setShowHintModal(false)}
              className="mt-8 bg-[#162338] rounded-full py-4 items-center"
            >
              <Text className="text-white text-xl font-semibold">Xong</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
