import React, { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import { CategoryResultView } from '@/features/category-flow/components/CategoryResultView'
import type { CategoryFlowScoreBreakdown } from '@/features/category-flow/types'
import { isPassingScore } from '@/features/category-flow/scoring'
import { sustainableMemoryNavigation } from '@/features/sustainable-memory/navigation'
import { sustainableMemorySession } from '@/features/sustainable-memory/sessionStorage'
import { useAuth } from '@/context/auth-provider'
import { CyberSafetyGameService } from '@/services/cyberSafetyGame.service'

export default function SustainableMemoryResultScreen() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { categoryId, lessonId, score } = useLocalSearchParams<{
    categoryId: string
    lessonId: string
    score: string
  }>()

  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)

  const breakdown: CategoryFlowScoreBreakdown | null = useMemo(() => {
    if (!score) return null
    try {
      return JSON.parse(score) as CategoryFlowScoreBreakdown
    } catch {
      return null
    }
  }, [score])

  useEffect(() => {
    if (!user?.id || !lessonId || !breakdown || saved) return
    if (lessonId.startsWith('sm-fallback-')) {
      void sustainableMemorySession.clear(user.id, lessonId).then(() => setSaved(true))
      return
    }

    if (!isPassingScore(breakdown.overall)) {
      void sustainableMemorySession.clear(user.id, lessonId).then(() => setSaved(true))
      return
    }

    void (async () => {
      setSubmitting(true)
      try {
        await CyberSafetyGameService.upsertProgressAndAwardPoints({
          userId: user.id,
          lessonId,
          pointsEarned: breakdown.xpEarned,
          correctAnswers: breakdown.overall,
          totalQuestions: 100,
        })
        await sustainableMemorySession.clear(user.id, lessonId)
        await queryClient.invalidateQueries({ queryKey: ['user-progress'] })
        await queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
        setSaved(true)
      } finally {
        setSubmitting(false)
      }
    })()
  }, [user?.id, lessonId, breakdown, saved, queryClient])

  const finish = () => {
    if (categoryId) sustainableMemoryNavigation.goLevels(categoryId)
  }

  const exit = async () => {
    if (user?.id && lessonId) {
      await sustainableMemorySession.clear(user.id, lessonId)
    }
    finish()
  }

  if (!breakdown) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FFF8FA]">
        <ActivityIndicator size="large" color="#9AE600" />
      </View>
    )
  }

  return (
    <CategoryResultView
      breakdown={breakdown}
      submitting={submitting}
      onExit={() => void exit()}
      onNext={finish}
    />
  )
}
