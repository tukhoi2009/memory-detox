import React, { useCallback } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { CategoryLockedView } from '@/features/category-flow/components/CategoryLockedView'
import { useFocusNoiseLevel } from '@/features/focus-noise/hooks/useFocusNoiseLevel'
import { focusNoiseNavigation } from '@/features/focus-noise/navigation'
import { focusNoiseSession } from '@/features/focus-noise/sessionStorage'
import { useAuth } from '@/context/auth-provider'

export default function FocusNoiseLockedScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { categoryId, lessonId, levelNumber } = useLocalSearchParams<{
    categoryId: string
    lessonId: string
    levelNumber: string
  }>()

  const { content } = useFocusNoiseLevel(lessonId)
  const title = content?.title ?? `Cấp độ ${levelNumber}`

  const handleExit = useCallback(async () => {
    if (!user?.id || !categoryId || !lessonId) {
      focusNoiseNavigation.goLevels(categoryId ?? '')
      return
    }
    const base =
      (await focusNoiseSession.load(user.id, lessonId)) ??
      focusNoiseSession.createSession({
        lessonId,
        categoryId,
        levelNumber: Number(levelNumber) || 1,
        phase: 'locked',
      })
    await focusNoiseSession.persistExitAfterReading(user.id, base)
    focusNoiseNavigation.goLevels(categoryId)
  }, [user?.id, categoryId, lessonId, levelNumber])

  const goAnswer = async () => {
    if (user?.id && lessonId && categoryId) {
      const base =
        (await focusNoiseSession.load(user.id, lessonId)) ??
        focusNoiseSession.createSession({
          lessonId,
          categoryId,
          levelNumber: Number(levelNumber) || 1,
          phase: 'locked',
        })
      await focusNoiseSession.save(user.id, {
        ...base,
        phase: 'answering',
        answerDraft: '',
      })
    }
    router.push({
      pathname: '/focus-noise/answer',
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
