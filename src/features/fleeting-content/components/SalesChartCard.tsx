import React from 'react'
import { Text, View } from 'react-native'
import type { SalesChartData } from '../types'

const BAR_COLORS = ['#D5E94B', '#FFC2F7'] as const
const Y_TICKS = [0, 50, 100, 150, 200] as const

type Props = {
  chart: SalesChartData
  compact?: boolean
}

export function SalesChartCard({ chart, compact = false }: Props) {
  const chartHeight = compact ? 100 : 130
  const maxValue = chart.maxValue || 200

  return (
    <View
      className="bg-white rounded-3xl p-4"
      style={{
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <Text className="text-[#212B36] font-bold text-base mb-3">{chart.title}</Text>

      <View className="flex-row" style={{ height: chartHeight + 36 }}>
        <View className="justify-between pr-2" style={{ height: chartHeight + 8 }}>
          {[...Y_TICKS].reverse().map((tick) => (
            <Text key={tick} className="text-[#919EAB] text-[10px]">
              {tick}
            </Text>
          ))}
        </View>

        <View className="flex-1">
          <View style={{ height: chartHeight, position: 'relative' }}>
            {Y_TICKS.map((tick) => {
              const top =
                chartHeight - (tick / maxValue) * chartHeight
              return (
                <View
                  key={tick}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top,
                    borderTopWidth: tick === 0 ? 1 : 1,
                    borderStyle: tick === 0 ? 'solid' : 'dashed',
                    borderColor: '#DFE3E8',
                  }}
                />
              )
            })}

            <View
              className="flex-row items-end justify-between absolute bottom-0 left-0 right-0"
              style={{ height: chartHeight }}
            >
              {chart.values.map((value, index) => {
                const barH = Math.max(8, (value / maxValue) * chartHeight)
                return (
                  <View key={chart.months[index]} className="items-center flex-1">
                    <Text className="text-[#212B36] text-xs font-bold mb-1">
                      {value}
                    </Text>
                    <View
                      style={{
                        width: compact ? 20 : 26,
                        height: barH,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        backgroundColor: BAR_COLORS[index % 2],
                      }}
                    />
                  </View>
                )
              })}
            </View>
          </View>

          <View className="flex-row justify-between mt-2">
            {chart.months.map((month) => (
              <Text
                key={month}
                className="text-[#919EAB] text-[10px] flex-1 text-center"
              >
                {month}
              </Text>
            ))}
          </View>
        </View>
      </View>

      {!compact && chart.notes.length > 0 && (
        <View className="mt-4 pt-3 border-t border-[#F4F6F8]">
          <Text className="text-[#212B36] font-semibold text-sm mb-2">Ghi chú:</Text>
          {chart.notes.map((note) => (
            <Text key={note} className="text-[#637381] text-sm leading-5 mb-1">
              • {note}
            </Text>
          ))}
        </View>
      )}
    </View>
  )
}
