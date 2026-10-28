import React from 'react'
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

export default function AccountPrivacyScreen() {
  return (
    <SafeAreaView className="flex-1 bg-neutral">
      <View className="px-4 pb-2 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()} className="w-11 h-11 rounded-full bg-white items-center justify-center">
          <Ionicons name="arrow-back" size={22} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-[#1F2937] font-semibold text-lg">Chính sách bảo mật</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="px-4 mt-4">
          <Text className="text-[#1F2937] font-medium">
            {`1. Chấp nhận điều khoản
Bằng việc truy cập và sử dụng ứng dụng Memory Detox, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu dưới đây.

2. Tuyên bố từ chối trách nhiệm
Nội dung trên ứng dụng chỉ mang tính chất giáo dục, rèn luyện trí nhớ và tham khảo, không thay thế cho các chẩn đoán y tế chuyên nghiệp.

3. Dữ liệu người dùng và quyền riêng tư
• Chúng tôi thu thập dữ liệu về tiến trình học tập, lịch sử làm bài và thói quen sinh hoạt (uống nước, ngủ...) để cá nhân hóa trải nghiệm.
• Chúng tôi cam kết bảo mật thông tin cá nhân của bạn.
• Dữ liệu thống kê được ẩn danh khi phân tích tổng hợp nhằm cải thiện ứng dụng.

4. Quyền sở hữu trí tuệ
Mọi nội dung bài học, hình ảnh, mã nguồn và thiết kế giao diện đều thuộc quyền sở hữu của Memory Detox.

5. Giới hạn trách nhiệm
Chúng tôi nỗ lực đảm bảo hệ thống hoạt động ổn định và chính xác; tuy nhiên không chịu trách nhiệm cho các sự cố kỹ thuật hoặc kết quả rèn luyện không như mong đợi.

6. Thay đổi điều khoản
Chính sách có thể được cập nhật trong quá trình phát triển; mọi thay đổi sẽ có hiệu lực ngay khi được thông báo trên ứng dụng.`}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
