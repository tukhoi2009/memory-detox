import React from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { CategoryReadyView } from '@/features/category-flow/components/CategoryReadyView'
import { useAuth } from '@/context/auth-provider'
import { useFleetingLevel } from '@/features/fleeting-content/hooks/useFleetingLevel'
import { fleetingSession } from '@/features/fleeting-content/sessionStorage'

export default function FleetingContentReadyScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { categoryId, lessonId, levelNumber } = useLocalSearchParams<{
    categoryId: string
    lessonId: string
    levelNumber: string
  }>()

  const { content } = useFleetingLevel(lessonId)

  const start = async () => {
    if (!user?.id || !categoryId || !lessonId) return

    const session = fleetingSession.createSession({
      lessonId,
      categoryId,
      levelNumber: Number(levelNumber) || content?.levelNumber || 1,
      phase: 'reading',
    })
    await fleetingSession.save(user.id, session)

    router.push({
      pathname: '/fleeting-content/reading',
      params: { categoryId, lessonId, levelNumber },
    })
  }

  return <CategoryReadyView onStart={() => void start()} />
}
