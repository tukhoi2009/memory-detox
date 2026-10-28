import React from 'react'
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

export default function AccountAboutScreen() {
  return (
    <SafeAreaView className="flex-1 bg-neutral">
      <View className="px-4 pb-2 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()} className="w-11 h-11 rounded-full bg-white items-center justify-center">
          <Ionicons name="arrow-back" size={22} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-[#1F2937] font-semibold text-lg">Giới thiệu</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="px-4 mt-4">
          <Text className="text-[#1F2937] font-medium">
            {`Memory Detox là ứng dụng giáo dục kết hợp rèn luyện trí não, giúp bạn duy trì một tâm trí minh mẫn, tăng cường sự tập trung và cải thiện trí nhớ mỗi ngày thông qua các bài học và bài tập tương tác.

1. Bạn sẽ đạt được gì?
• Nâng cao khả năng ghi nhớ qua các bài tập trắc nghiệm đa dạng.
• Cải thiện mức độ tập trung (Focus) nhờ các chỉ số đo lường chi tiết.
• Xây dựng và duy trì các thói quen tốt cho não bộ như uống nước, ngủ đủ giấc và vận động đều đặn.
• Theo dõi sự tiến bộ qua từng ngày thông qua hệ thống phân tích và biểu đồ trực quan.

2. Tính năng nổi bật
• Học tập thông minh: Nội dung chia thành nhiều chủ đề và bài học, được mở khóa dần theo tiến độ.
• Thống kê chuyên sâu: Phân tích các chỉ số Mức độ (Level), Độ chính xác (Accuracy) và Độ tập trung (Focus).
• Hệ thống phần thưởng: Đạt điểm số, mở khóa thành tựu và thi đua trên bảng xếp hạng (Leaderboard) cùng người dùng khác.
• Nhắc nhở tiện ích: Hỗ trợ thông báo nhắc nhở lịch sinh hoạt lành mạnh theo cá nhân hóa.

3. Thông điệp
Thanh lọc tâm trí, rèn luyện não bộ – Vì một phiên bản sắc bén hơn của chính bạn.`}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
