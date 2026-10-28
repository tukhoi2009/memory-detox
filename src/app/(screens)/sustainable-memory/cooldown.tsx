import React, { useCallback, useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { CategoryCooldownView } from '@/features/category-flow/components/CategoryCooldownView'
import { useSustainableMemoryLevel } from '@/features/sustainable-memory/hooks/useSustainableMemoryLevel'
import { sustainableMemoryNavigation } from '@/features/sustainable-memory/navigation'
import { sustainableMemorySession } from '@/features/sustainable-memory/sessionStorage'
import { useAuth } from '@/context/auth-provider'

export default function SustainableMemoryCooldownScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { categoryId, lessonId, levelNumber } = useLocalSearchParams<{
    categoryId: string
    lessonId: string
    levelNumber: string
  }>()

  const { content } = useSustainableMemoryLevel(lessonId)
  const [cooldownEndsAt, setCooldownEndsAt] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id || !lessonId) return
    void (async () => {
      const saved = await sustainableMemorySession.load(user.id, lessonId)
      if (saved?.cooldownEndsAt) {
        setCooldownEndsAt(saved.cooldownEndsAt)
      }
    })()
  }, [user?.id, lessonId])

  const handleExit = useCallback(async () => {
    if (!user?.id || !categoryId || !lessonId) {
      sustainableMemoryNavigation.goLevels(categoryId ?? '')
      return
    }
    const base =
      (await sustainableMemorySession.load(user.id, lessonId)) ??
      sustainableMemorySession.createSession({
        lessonId,
        categoryId,
        levelNumber: Number(levelNumber) || 1,
        phase: 'cooldown',
      })
    await sustainableMemorySession.save(user.id, {
      ...base,
      phase: 'cooldown',
    })
    sustainableMemoryNavigation.goLevels(categoryId)
  }, [user?.id, categoryId, lessonId, levelNumber])

  const goAnswer = async () => {
    if (!user?.id || !categoryId || !lessonId) return
    const base =
      (await sustainableMemorySession.load(user.id, lessonId)) ??
      sustainableMemorySession.createSession({
        lessonId,
        categoryId,
        levelNumber: Number(levelNumber) || 1,
        phase: 'cooldown',
      })
    await sustainableMemorySession.save(user.id, {
      ...base,
      phase: 'answering',
      answerDraft: '',
    })
    router.push({
      pathname: '/sustainable-memory/answer',
      params: { categoryId, lessonId, levelNumber },
    })
  }

  const title = content?.title ?? `Cấp độ ${levelNumber}`

  if (!cooldownEndsAt) {
    return null
  }

  return (
    <CategoryCooldownView
      title={title}
      cooldownEndsAt={cooldownEndsAt}
      onExit={() => void handleExit()}
      onContinue={() => void goAnswer()}
    />
  )
}
