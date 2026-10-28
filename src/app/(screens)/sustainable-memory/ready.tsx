import React from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { CategoryReadyView } from '@/features/category-flow/components/CategoryReadyView'
import { useAuth } from '@/context/auth-provider'
import { useSustainableMemoryLevel } from '@/features/sustainable-memory/hooks/useSustainableMemoryLevel'
import { sustainableMemorySession } from '@/features/sustainable-memory/sessionStorage'

export default function SustainableMemoryReadyScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { categoryId, lessonId, levelNumber } = useLocalSearchParams<{
    categoryId: string
    lessonId: string
    levelNumber: string
  }>()

  const { content } = useSustainableMemoryLevel(lessonId)

  const start = async () => {
    if (!user?.id || !categoryId || !lessonId) return

    await sustainableMemorySession.save(
      user.id,
      sustainableMemorySession.createSession({
        lessonId,
        categoryId,
        levelNumber: Number(levelNumber) || content?.levelNumber || 1,
        phase: 'reading',
      }),
    )

    router.push({
      pathname: '/sustainable-memory/reading',
      params: { categoryId, lessonId, levelNumber },
    })
  }

  return <CategoryReadyView onStart={() => void start()} />
}
