import React from 'react'
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

export default function AccountSupportScreen() {
  return (
    <SafeAreaView className="flex-1 bg-neutral">
      <View className="px-4 pb-2 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()} className="w-11 h-11 rounded-full bg-white items-center justify-center">
          <Ionicons name="arrow-back" size={22} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-[#1F2937] font-semibold text-lg">Liên hệ & Hỗ trợ</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="px-4 mt-4">
          <Text className="text-[#1F2937] font-medium">
            {`Đội ngũ Memory Detox luôn sẵn sàng lắng nghe và hỗ trợ để hành trình rèn luyện trí não và cải thiện sự tập trung của bạn trở nên hiệu quả nhất.

Nếu bạn có bất kỳ câu hỏi, góp ý hay gặp sự cố trong quá trình sử dụng ứng dụng, vui lòng liên hệ với chúng tôi:

• Email hỗ trợ: support@memorydetox.vn
• Điện thoại (Giờ hành chính): +84 9xx xxx xxx
• Fanpage: facebook.com/memorydetox`}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
