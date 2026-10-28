import React from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { CategoryReadyView } from '@/features/category-flow/components/CategoryReadyView'
import { useAuth } from '@/context/auth-provider'
import { useReasoningLevel } from '@/features/reasoning-traps/hooks/useReasoningLevel'
import { reasoningSession } from '@/features/reasoning-traps/sessionStorage'

export default function ReasoningTrapsReadyScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { categoryId, lessonId, levelNumber } = useLocalSearchParams<{
    categoryId: string
    lessonId: string
    levelNumber: string
  }>()

  const { content } = useReasoningLevel(lessonId)

  const start = async () => {
    if (!user?.id || !categoryId || !lessonId) return

    await reasoningSession.save(
      user.id,
      reasoningSession.createSession({
        lessonId,
        categoryId,
        levelNumber: Number(levelNumber) || content?.levelNumber || 1,
        phase: 'reading',
      }),
    )

    router.push({
      pathname: '/reasoning-traps/play',
      params: { categoryId, lessonId, levelNumber },
    })
  }

  return <CategoryReadyView onStart={() => void start()} />
}
