import React from 'react'
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

export default function AccountTermsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-neutral">
      <View className="px-4 pb-2 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()} className="w-11 h-11 rounded-full bg-white items-center justify-center">
          <Ionicons name="arrow-back" size={22} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-[#1F2937] font-semibold text-lg">Điều khoản & Điều kiện</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="px-4 mt-4">
          <Text className="text-[#1F2937] font-medium">
            {`Memory Detox là ứng dụng giáo dục và rèn luyện trí não, giúp người dùng cải thiện trí nhớ, tăng cường sự tập trung và xây dựng thói quen sống lành mạnh thông qua các bài học và bài tập tương tác.

1. Đối tượng sử dụng
• Ứng dụng phù hợp cho mọi lứa tuổi muốn cải thiện trí nhớ và sự tập trung.
• Người dùng dưới 13 tuổi nên có sự hướng dẫn của phụ huynh.

2. Mục đích sử dụng
• Cung cấp các bài tập rèn luyện não bộ, giải đố và trắc nghiệm kiến thức.
• Theo dõi tiến độ học tập và nhắc nhở xây dựng thói quen tốt (ngủ đủ giấc, uống nước,...).
• Không nhằm mục đích thay thế cho các phương pháp điều trị y khoa về thần kinh.

3. Tài khoản người dùng
• Người dùng cần đăng ký tài khoản để lưu trữ quá trình rèn luyện và thành tích.
• Cung cấp thông tin chính xác và có trách nhiệm bảo mật tài khoản cá nhân.
• Không chia sẻ tài khoản với người khác để đảm bảo dữ liệu thống kê cá nhân chính xác.

4. Quy định sử dụng
• Sử dụng ứng dụng với mục đích học tập và rèn luyện tích cực.
• Không can thiệp vào mã nguồn, hệ thống chấm điểm hay dữ liệu của ứng dụng.
• Không sử dụng các phần mềm gian lận để thay đổi kết quả bài tập.

5. Nội dung và bản quyền
• Mọi nội dung bài học, câu hỏi trắc nghiệm và hình ảnh thuộc sở hữu của Memory Detox.
• Nghiêm cấm sao chép, phát tán hoặc sử dụng cho mục đích thương mại khi chưa được phép.`}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
