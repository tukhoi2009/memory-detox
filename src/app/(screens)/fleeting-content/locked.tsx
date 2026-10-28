import React, { useCallback } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { CategoryLockedView } from '@/features/category-flow/components/CategoryLockedView'
import { useFleetingLevel } from '@/features/fleeting-content/hooks/useFleetingLevel'
import { fleetingNavigation } from '@/features/fleeting-content/navigation'
import { fleetingSession } from '@/features/fleeting-content/sessionStorage'
import { useAuth } from '@/context/auth-provider'

export default function FleetingContentLockedScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { categoryId, lessonId, levelNumber } = useLocalSearchParams<{
    categoryId: string
    lessonId: string
    levelNumber: string
  }>()

  const { content } = useFleetingLevel(lessonId)
  const title = content?.title ?? `Cấp độ ${levelNumber}`

  const handleExit = useCallback(async () => {
    if (!user?.id || !categoryId || !lessonId) {
      fleetingNavigation.goLevels(categoryId ?? '')
      return
    }
    const base =
      (await fleetingSession.load(user.id, lessonId)) ??
      fleetingSession.createSession({
        lessonId,
        categoryId,
        levelNumber: Number(levelNumber) || 1,
        phase: 'locked',
      })
    await fleetingSession.persistExitAfterReading(user.id, base)
    fleetingNavigation.goLevels(categoryId)
  }, [user?.id, categoryId, lessonId, levelNumber])

  const goAnswer = async () => {
    if (user?.id && lessonId && categoryId) {
      const base =
        (await fleetingSession.load(user.id, lessonId)) ??
        fleetingSession.createSession({
          lessonId,
          categoryId,
          levelNumber: Number(levelNumber) || 1,
          phase: 'locked',
        })
      await fleetingSession.save(user.id, {
        ...base,
        phase: 'answering',
        chartValues: Array(6).fill(null),
        notesDraft: '',
      })
    }
    router.push({
      pathname: '/fleeting-content/answer',
      params: { categoryId, lessonId, levelNumber },
    })
  }

  return (
    <CategoryLockedView
      title={title}
      onExit={() => void handleExit()}
      onNext={() => void goAnswer()}
    />
  )
}
