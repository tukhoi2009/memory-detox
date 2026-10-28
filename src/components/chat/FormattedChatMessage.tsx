import React from 'react'
import { Text, View } from 'react-native'

type Props = {
  text: string
  isUser: boolean
  baseClassName?: string
}

/** Split text by **bold** and return array of { bold: boolean, text: string } */
function splitBold(segment: string): { bold: boolean; text: string }[] {
  const result: { bold: boolean; text: string }[] = []
  let rest = segment
  while (rest.length > 0) {
    const open = rest.indexOf('**')
    if (open === -1) {
      if (rest) result.push({ bold: false, text: rest })
      break
    }
    if (open > 0) result.push({ bold: false, text: rest.slice(0, open) })
    const close = rest.indexOf('**', open + 2)
    if (close === -1) {
      result.push({ bold: false, text: rest.slice(open) })
      break
    }
    result.push({ bold: true, text: rest.slice(open + 2, close) })
    rest = rest.slice(close + 2)
  }
  return result
}

/**
 * Renders message with:
 * - Paragraph breaks (\n)
 * - **bold** text
 * - Bullet lines (lines starting with * or -)
 */
export function FormattedChatMessage({ text, isUser, baseClassName = '' }: Props) {
  const textColorClass = isUser ? 'text-white' : 'text-gray-900'

  const lines = text.split(/\n/)
  const elements: React.ReactNode[] = []

  lines.forEach((line, lineIndex) => {
    const trimmed = line.trim()
    const isBullet = /^[\*\-]\s+/.test(trimmed)
    const bulletContent = isBullet ? trimmed.replace(/^[\*\-]\s+/, '').trim() : trimmed

    if (isBullet && bulletContent) {
      const boldParts = splitBold(bulletContent)
      const parts = boldParts.map((p, i) =>
        p.bold ? (
          <Text key={i} className={`font-semibold ${textColorClass}`}>
            {p.text}
          </Text>
        ) : (
          <Text key={i} className={textColorClass}>
            {p.text}
          </Text>
        )
      )
      elements.push(
        <View
          key={`line-${lineIndex}`}
          className={`flex-row flex-wrap ${lineIndex > 0 ? 'mt-1' : ''}`}
        >
          <Text className={`${textColorClass} mr-1.5`}>• </Text>
          <Text className={`text-[15px] flex-1 ${baseClassName}`}>{parts}</Text>
        </View>
      )
    } else if (trimmed) {
      const boldParts = splitBold(trimmed)
      const lineParts = boldParts.map((p, i) =>
        p.bold ? (
          <Text key={i} className={`font-semibold ${textColorClass}`}>
            {p.text}
          </Text>
        ) : (
          <Text key={i} className={textColorClass}>
            {p.text}
          </Text>
        )
      )
      elements.push(
        <Text
          key={`line-${lineIndex}`}
          className={`text-[15px] ${lineIndex > 0 ? 'mt-1' : ''} ${baseClassName}`}
        >
          {lineParts}
        </Text>
      )
    } else {
      elements.push(<View key={`line-${lineIndex}`} className="h-2" />)
    }
  })

  return <View style={{ gap: 2 }}>{elements}</View>
}
