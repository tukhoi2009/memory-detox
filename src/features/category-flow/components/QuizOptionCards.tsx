import React from 'react'
import { Pressable, Text, View } from 'react-native'

export type QuizOptionItem = {
  label: string
  text: string
}

type Props = {
  options: QuizOptionItem[]
  selectedIndex: number | null
  onSelect: (index: number) => void
}

export function QuizOptionCards({ options, selectedIndex, onSelect }: Props) {
  return (
    <View className="gap-3">
      {options.map((opt, index) => {
        const selected = selectedIndex === index
        return (
          <Pressable
            key={opt.label}
            onPress={() => onSelect(index)}
            className="rounded-2xl px-4 py-3.5"
            style={{
              backgroundColor: selected ? '#E8F9D4' : '#FFFFFF',
              borderWidth: 1,
              borderColor: selected ? '#D5E94B' : '#DFE3E8',
            }}
          >
            <Text className="text-[#212B36] text-base leading-6">
              <Text className="font-bold">{opt.label}. </Text>
              {opt.text}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
