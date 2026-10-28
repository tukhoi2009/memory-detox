import React, { useMemo, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import type { SalesChartData } from '../types'

const BAR_COLORS = ['#D5E94B', '#FFC2F7'] as const

type Props = {
  chart: SalesChartData
  placements: (number | null)[]
  onChange: (next: (number | null)[]) => void
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function ChartRebuildBoard({ chart, placements, onChange }: Props) {
  const [selectedValue, setSelectedValue] = useState<number | null>(null)
  const [activeSlot, setActiveSlot] = useState<number | null>(null)

  const pool = useMemo(
    () => shuffle(chart.values),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shuffle once per chart
    [chart.months.join(',')],
  )

  const placeInSlot = (slotIndex: number, value: number) => {
    const next = [...placements]
    next[slotIndex] = value
    onChange(next)
    setSelectedValue(null)
    setActiveSlot(null)
  }

  const handleSlotPress = (index: number) => {
    if (selectedValue != null) {
      placeInSlot(index, selectedValue)
      return
    }
    setActiveSlot(index === activeSlot ? null : index)
  }

  const handlePoolPress = (value: number) => {
    if (activeSlot != null) {
      placeInSlot(activeSlot, value)
      return
    }
    setSelectedValue(selectedValue === value ? null : value)
  }

  const maxBar = chart.maxValue

  return (
    <View>
      <Text className="text-[#212B36] font-bold text-base mb-3">{chart.title}</Text>

      <View
        className="flex-row items-end justify-between bg-[#F9FAFB] rounded-2xl px-2 py-4 mb-2"
        style={{ minHeight: 140 }}
      >
        {chart.months.map((month, index) => {
          const value = placements[index]
          const filled = value != null
          const barH = filled ? Math.max(12, (value / maxBar) * 90) : 48

          return (
            <Pressable
              key={month}
              onPress={() => handleSlotPress(index)}
              className="items-center flex-1 mx-0.5"
              style={{
                borderWidth: activeSlot === index ? 2 : 1,
                borderColor: activeSlot === index ? '#D5E94B' : '#DFE3E8',
                borderStyle: 'dashed',
                borderRadius: 12,
                paddingVertical: 6,
                backgroundColor: filled ? '#FFFFFF' : 'transparent',
              }}
            >
              {filled ? (
                <>
                  <Text className="text-[#212B36] text-xs font-bold">{value}</Text>
                  <View
                    style={{
                      width: 22,
                      height: barH,
                      marginTop: 4,
                      borderTopLeftRadius: 6,
                      borderTopRightRadius: 6,
                      backgroundColor: BAR_COLORS[index % 2],
                    }}
                  />
                </>
              ) : (
                <Text className="text-[#919EAB] text-[9px] text-center px-0.5 mt-6">
                  Kéo thả{'\n'}vào đây
                </Text>
              )}
              <Text className="text-[#919EAB] text-[10px] mt-2">{month}</Text>
            </Pressable>
          )
        })}
      </View>

      <Text className="text-[#919EAB] text-xs text-center mb-3">
        Chọn cột bên dưới, rồi chạm vào ô trống (hoặc chạm ô trước rồi chọn cột)
      </Text>

      <View className="flex-row flex-wrap justify-center gap-2">
        {pool.map((value, i) => {
          const usedCount = placements.filter((p) => p === value).length
          const poolCount = chart.values.filter((v) => v === value).length
          const disabled = usedCount >= poolCount

          return (
            <Pressable
              key={`${value}-${i}`}
              disabled={disabled}
              onPress={() => handlePoolPress(value)}
              style={{
                opacity: disabled ? 0.35 : 1,
                borderWidth: selectedValue === value ? 2 : 0,
                borderColor: '#212B36',
                borderRadius: 12,
                padding: 4,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: Math.max(28, (value / maxBar) * 56),
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  backgroundColor: BAR_COLORS[i % 2],
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
              >
                <Text className="text-[#212B36] text-xs font-bold mb-1">{value}</Text>
              </View>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}
