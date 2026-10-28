/**
 * Toast Demo Component
 * 
 * Use this component for testing toast functionality
 * Add to any screen during development
 * 
 * Usage:
 * import { ToastDemo } from '@/components/common/ToastDemo'
 * 
 * // In your screen:
 * {__DEV__ && <ToastDemo />}
 */

import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { toast } from './ToastManager'

export const ToastDemo = () => {
  if (!__DEV__) return null

  return (
    <ScrollView className="bg-yellow-50 p-4 border border-yellow-300 rounded-xl">
      <Text className="text-lg font-bold mb-3 text-center">
        🧪 Toast Demo (Dev Only)
      </Text>

      <View className="space-y-2">
        {/* Success */}
        <TouchableOpacity
          onPress={() => toast.success('Thành công!', 'Đã lưu thông tin của bạn')}
          className="bg-green-500 p-3 rounded-lg"
        >
          <Text className="text-white font-semibold text-center">
            ✓ Success Toast
          </Text>
        </TouchableOpacity>

        {/* Error */}
        <TouchableOpacity
          onPress={() => toast.error('Lỗi!', 'Không thể kết nối đến server')}
          className="bg-red-500 p-3 rounded-lg"
        >
          <Text className="text-white font-semibold text-center">
            ✗ Error Toast
          </Text>
        </TouchableOpacity>

        {/* Info */}
        <TouchableOpacity
          onPress={() => toast.info('Thông tin', 'Bạn có 5 thông báo mới')}
          className="bg-blue-500 p-3 rounded-lg"
        >
          <Text className="text-white font-semibold text-center">
            ℹ️ Info Toast
          </Text>
        </TouchableOpacity>

        {/* Warning */}
        <TouchableOpacity
          onPress={() => toast.warning('Cảnh báo', 'Vui lòng kiểm tra lại thông tin')}
          className="bg-yellow-500 p-3 rounded-lg"
        >
          <Text className="text-white font-semibold text-center">
            ⚠️ Warning Toast
          </Text>
        </TouchableOpacity>

        {/* Notification - Water */}
        <TouchableOpacity
          onPress={() => toast.notification(
            'Uống nước',
            'Đã 2 tiếng rồi bạn chưa uống nước đấy. Một ly nước ngay lúc này sẽ giúp da đẹp!',
            '💧',
            '#DBEAFE',
            4000
          )}
          className="bg-purple-500 p-3 rounded-lg"
        >
          <Text className="text-white font-semibold text-center">
            💧 Water Reminder
          </Text>
        </TouchableOpacity>

        {/* Notification - Meal */}
        <TouchableOpacity
          onPress={() => toast.notification(
            'Check-in bữa trưa',
            'Giờ nghỉ trưa đến rồi! Đừng quên check-in để theo dõi lượng calo hôm nay nhé.',
            '🍔',
            '#FEE2E2',
            4000
          )}
          className="bg-purple-500 p-3 rounded-lg"
        >
          <Text className="text-white font-semibold text-center">
            🍔 Meal Reminder
          </Text>
        </TouchableOpacity>

        {/* Notification - Goal */}
        <TouchableOpacity
          onPress={() => toast.notification(
            'Hoàn thành mục tiêu',
            'Chúc mừng! Bạn đã uống đủ 2L nước hôm nay. Cơ thể đang cảm ơn bạn đấy!',
            '🏆',
            '#FEF3C7',
            5000
          )}
          className="bg-purple-500 p-3 rounded-lg"
        >
          <Text className="text-white font-semibold text-center">
            🏆 Goal Completed
          </Text>
        </TouchableOpacity>

        {/* Multiple Toasts */}
        <TouchableOpacity
          onPress={() => {
            toast.info('Toast 1', 'First message')
            setTimeout(() => toast.success('Toast 2', 'Second message'), 300)
            setTimeout(() => toast.warning('Toast 3', 'Third message'), 600)
          }}
          className="bg-gray-700 p-3 rounded-lg"
        >
          <Text className="text-white font-semibold text-center">
            📚 Multiple Toasts
          </Text>
        </TouchableOpacity>

        {/* Long Duration */}
        <TouchableOpacity
          onPress={() => toast.notification(
            'Long Toast',
            'This toast will stay for 10 seconds',
            '⏰',
            '#E0E7FF',
            10000
          )}
          className="bg-gray-700 p-3 rounded-lg"
        >
          <Text className="text-white font-semibold text-center">
            ⏰ Long Duration (10s)
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-xs text-gray-600 mt-3 text-center">
        Click any button to test toast
      </Text>
    </ScrollView>
  )
}
