import React from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { CategoryReadyView } from '@/features/category-flow/components/CategoryReadyView'
import { useAuth } from '@/context/auth-provider'
import { useFocusNoiseLevel } from '@/features/focus-noise/hooks/useFocusNoiseLevel'
import { focusNoiseSession } from '@/features/focus-noise/sessionStorage'

export default function FocusNoiseReadyScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { categoryId, lessonId, levelNumber } = useLocalSearchParams<{
    categoryId: string
    lessonId: string
    levelNumber: string
  }>()

  const { content } = useFocusNoiseLevel(lessonId)

  const start = async () => {
    if (!user?.id || !categoryId || !lessonId) return

    await focusNoiseSession.save(
      user.id,
      focusNoiseSession.createSession({
        lessonId,
        categoryId,
        levelNumber: Number(levelNumber) || content?.levelNumber || 1,
        phase: 'reading',
      }),
    )

    router.push({
      pathname: '/focus-noise/reading',
      params: { categoryId, lessonId, levelNumber },
    })
  }

  return <CategoryReadyView onStart={() => void start()} />
}
