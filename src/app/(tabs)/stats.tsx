import React, { useCallback, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { LineChart } from 'react-native-gifted-charts'
import { Ionicons } from '@expo/vector-icons'
import { Cloud, Eye, LampOn, TickCircle } from 'iconsax-react-native'
import { useAuth } from '@/context/auth-provider'
import { useNotificationCount } from '@/hooks/useNotificationCount'
import { useProfile } from '@/hooks/useProfile'
import {
  MemoryStatsService,
  type StatsRangeKey,
} from '@/services/memoryStats.service'
import IconStar from '~/assets/icons/home/star'

const SCREEN_BG = '#FFF7FC'
const CHART_GREEN = '#9AE600'
const CHART_FILL = '#C1F800'

const RANGE_OPTIONS: { key: StatsRangeKey; label: string }[] = [
  { key: '7d', label: '7 ngày qua' },
  { key: '30d', label: '30 ngày qua' },
]

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 10,
  elevation: 4,
} as const

type MetricConfig = {
  key: string
  label: string
  field: keyof Awaited<ReturnType<typeof MemoryStatsService.fetchAverages>>
  cardBg: string
  iconColor: string
  Icon: typeof TickCircle
}

const METRICS: MetricConfig[] = [
  {
    key: 'accuracy',
    label: 'Độ chính xác',
    field: 'accuracy_pct',
    cardBg: '#22C55E14',
    iconColor: '#22C55E',
    Icon: TickCircle,
  },
  {
    key: 'memory',
    label: 'Ghi nhớ',
    field: 'learned_pct',
    cardBg: '#00B8D914',
    iconColor: '#3B82F6',
    Icon: Cloud,
  },
  {
    key: 'depth',
    label: 'Độ hiểu sâu',
    field: 'completed_pct',
    cardBg: '#FF563014',
    iconColor: '#EF4444',
    Icon: LampOn,
  },
  {
    key: 'focus',
    label: 'Độ tập trung',
    field: 'focus_pct',
    cardBg: '#FFAB0014',
    iconColor: '#F59E0B',
    Icon: Eye,
  },
]

export default function StatsScreen() {
  const { width } = useWindowDimensions()
  const { user } = useAuth()
  const { profile } = useProfile()
  const userId = user?.id
  const [range, setRange] = useState<StatsRangeKey>('7d')
  const { unreadCount } = useNotificationCount()

  const chartWidth = Math.max(260, width - 72)
  const rangeLabel =
    RANGE_OPTIONS.find((o) => o.key === range)?.label ?? '7 ngày qua'

  const chartQuery = useQuery({
    queryKey: ['stats-chart', userId, range],
    queryFn: () => MemoryStatsService.fetchDailyStatsSeries(userId!, range),
    enabled: !!userId,
  })

  const averagesQuery = useQuery({
    queryKey: ['stats-averages', userId, range],
    queryFn: () => MemoryStatsService.fetchAverages(userId!, range),
    enabled: !!userId,
  })

  const lineData = useMemo(() => {
    const raw = chartQuery.data ?? []
    if (raw.length === 0) {
      return [{ value: 0, label: '' }]
    }
    return raw.map((p) => ({
      value: Math.round(p.value),
      label: p.label,
    }))
  }, [chartQuery.data])

  const lineSpacing = useMemo(() => {
    const n = Math.max(2, lineData.length)
    return (chartWidth - 56) / (n - 1)
  }, [chartWidth, lineData.length])

  const metricValues = useMemo(() => {
    const a = averagesQuery.data
    return METRICS.map((m) => ({
      ...m,
      value: a?.[m.field] ?? 0,
    }))
  }, [averagesQuery.data])

  const [dropdownOpen, setDropdownOpen] = useState(false)

  const openNotifications = useCallback(() => {
    router.push('/(screens)/notifications' as never)
  }, [])

  if (!userId) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: SCREEN_BG }}
        edges={['top']}
      >
        <Text className="text-[#637381]">Đăng nhập để xem thống kê</Text>
      </SafeAreaView>
    )
  }

  const loading = chartQuery.isPending || averagesQuery.isPending

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: SCREEN_BG }} edges={['top']}>
      <View className="flex-row items-center px-5 pt-2 pb-3">
        <Text className="flex-1 text-[26px] font-bold text-[#1F2937]">Thống kê</Text>

        <TouchableOpacity
          onPress={openNotifications}
          activeOpacity={0.85}
          className="w-11 h-11 rounded-full bg-white items-center justify-center"
          style={CARD_SHADOW}
        >
          <Ionicons name="notifications-outline" size={22} color="#212B36" />
          {unreadCount > 0 && (
            <View className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#4CC9F0] border border-white" />
          )}
        </TouchableOpacity>

        <View
          className="flex-row items-center bg-white rounded-full px-3.5 py-2 ml-2.5"
          style={CARD_SHADOW}
        >
          <Text className="font-semibold text-[#1F2937] text-[15px]">
            {(profile?.total_points ?? 0).toLocaleString()}
          </Text>
          <View className="ml-1">
            <IconStar />
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-5 z-50 relative">
          <Pressable
            onPress={() => setDropdownOpen(!dropdownOpen)}
            className="flex-row items-center justify-between bg-white rounded-full px-5 py-4"
            style={CARD_SHADOW}
          >
            <Text className="text-[#1F2937] font-semibold text-base">{rangeLabel}</Text>
            <Ionicons name={dropdownOpen ? 'chevron-up' : 'chevron-down'} size={20} color="#637381" />
          </Pressable>

          {dropdownOpen && (
            <View className="absolute top-[60px] left-0 right-0 bg-white rounded-2xl py-2 shadow-sm border border-gray-100" style={{ elevation: 5, zIndex: 100 }}>
              {RANGE_OPTIONS.map((opt, index) => (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => {
                    setRange(opt.key)
                    setDropdownOpen(false)
                  }}
                  className={`px-5 py-3 flex-row justify-between items-center ${
                    index < RANGE_OPTIONS.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <Text className={`text-[15px] ${range === opt.key ? 'text-[#9AE600] font-bold' : 'text-[#1F2937]'}`}>
                    {opt.label}
                  </Text>
                  {range === opt.key && <Ionicons name="checkmark" size={18} color="#9AE600" />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {loading ? (
          <View className="py-16 items-center">
            <ActivityIndicator size="large" color={CHART_GREEN} />
          </View>
        ) : (
          <>
            <View className="bg-white rounded-[28px] px-4 pt-5 pb-4 mb-6" style={CARD_SHADOW}>
              <Text className="text-[#1F2937] font-bold text-[15px] mb-4">
                Biểu đồ trí nhớ
              </Text>
              <LineChart
                areaChart
                curved
                data={lineData}
                width={chartWidth}
                height={200}
                spacing={lineSpacing}
                initialSpacing={16}
                endSpacing={16}
                color={CHART_GREEN}
                thickness={3}
                startFillColor={CHART_FILL}
                endFillColor={CHART_FILL}
                startOpacity={0.35}
                endOpacity={0.02}
                dataPointsColor={CHART_GREEN}
                dataPointsRadius={5}
                hideDataPoints={false}
                maxValue={100}
                noOfSections={4}
                yAxisLabelTexts={['0%', '25%', '50%', '75%', '100%']}
                yAxisTextStyle={{ color: '#9CA3AF', fontSize: 11 }}
                xAxisLabelTextStyle={{ color: '#9CA3AF', fontSize: 10 }}
                rulesType="solid"
                rulesColor="#F0F2F5"
                yAxisThickness={0}
                xAxisThickness={0}
                pointerConfig={{
                  pointerStripColor: CHART_GREEN,
                  pointerStripWidth: 2,
                  pointerStripUptoDataPoint: true,
                  pointerColor: CHART_GREEN,
                  radius: 6,
                  pointerLabelWidth: 44,
                  pointerLabelHeight: 22,
                  activatePointersOnLongPress: false,
                  autoAdjustPointerLabelPosition: true,
                  pointerLabelComponent: (items: { value: number }[]) => (
                    <Text
                      style={{
                        color: CHART_GREEN,
                        fontSize: 13,
                        fontWeight: '700',
                        textAlign: 'center',
                      }}
                    >
                      {items[0]?.value ?? 0}%
                    </Text>
                  ),
                }}
              />
            </View>

            <Text className="text-[#1F2937] font-bold text-lg mb-4">
              Chỉ số trung bình
            </Text>

            <View className="flex-row flex-wrap justify-between">
              {metricValues.map((m) => (
                <View
                  key={m.key}
                  className="w-[48%] rounded-[20px] p-3.5 mb-3 flex-row items-center"
                  style={{ backgroundColor: m.cardBg }}
                >
                  <View className="w-11 h-11 rounded-full bg-white items-center justify-center">
                    <m.Icon size={22} color={m.iconColor} variant="Bold" />
                  </View>
                  <View className="flex-1 ml-2.5">
                    <Text className="text-[#637381] text-xs" numberOfLines={1}>
                      {m.label}
                    </Text>
                    <Text className="text-[#1F2937] text-xl font-bold mt-0.5">
                      {m.value}%
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
