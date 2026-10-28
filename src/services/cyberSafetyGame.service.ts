import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'
import { MemoryStatsService } from '@/services/memoryStats.service'

export type Category = Database['public']['Tables']['categories']['Row']
export type Lesson = Database['public']['Tables']['lessons']['Row']

export type QuizRow = Database['public']['Tables']['quizzes']['Row']
export type QuizQuestion = {
  id: string
  lesson_id: string
  question: string
  options: string[]
  correct_index: number
  question_index: number
  hint?: string | null
}

export type UserProgressRow =
  Database['public']['Tables']['user_progress']['Row']

export type QuizAttemptRow = {
  id: string
  user_id: string
  lesson_id: string
  points_earned: number
  correct_answers: number
  total_questions: number
  completed_at: string
  created_at: string
}

export type LeaderboardProfile = Pick<
  Database['public']['Tables']['profiles']['Row'],
  'id' | 'username' | 'avatar_url' | 'total_points'
>

export type LeaderboardRow = Database['public']['Views']['leaderboard']['Row']

export const CyberSafetyGameService = {
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, image_url, color_code, icon_name, sort_order')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })

    if (error) throw error
    return (data ?? []) as Category[]
  },

  async getLessons(): Promise<Lesson[]> {
    const { data, error } = await supabase
      .from('lessons')
      .select('id, category_id, title, summary, content, hint, image_url')
      .order('title', { ascending: true })

    if (error) throw error
    return (data ?? []) as Lesson[]
  },

  async getLessonById(lessonId: string): Promise<Lesson | null> {
    const { data, error } = await supabase
      .from('lessons')
      .select(
        'id, category_id, title, summary, content, hint, image_url, sort_order, points_reward'
      )
      .eq('id', lessonId)
      .maybeSingle()

    if (error) throw error
    return (data ?? null) as Lesson | null
  },

  async getCategoryById(categoryId: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, image_url')
      .eq('id', categoryId)
      .maybeSingle()

    if (error) throw error
    return (data ?? null) as Category | null
  },

  async getLessonsByCategory(categoryId: string): Promise<Lesson[]> {
    const { data, error } = await supabase
      .from('lessons')
      .select(
        'id, category_id, title, summary, content, hint, image_url, sort_order, is_locked, unlock_min_points, points_reward'
      )
      .eq('category_id', categoryId)
      .order('sort_order', { ascending: true })
      .order('title', { ascending: true })

    if (error) throw error
    return (data ?? []) as Lesson[]
  },

  async getQuizzesByLesson(lessonId: string): Promise<QuizQuestion[]> {
    const { data, error } = await supabase
      .from('quizzes')
      .select(
        'id, lesson_id, question, options, correct_index, question_index, hint'
      )
      .eq('lesson_id', lessonId)

    if (error) throw error

    const rows = (data ?? []) as QuizRow[]
    return rows
      .map((r) => ({
        id: r.id,
        lesson_id: r.lesson_id,
        question: r.question,
        options: r.options ?? [],
        correct_index: r.correct_index,
        question_index: r.question_index ?? 0,
        hint: (r as QuizRow & { hint?: string | null }).hint ?? null,
      }))
      .sort((a, b) => a.question_index - b.question_index)
  },

  async getTopLeaderboard(limit = 50): Promise<LeaderboardProfile[]> {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('id, username, avatar_url, total_points')
      .order('rank', { ascending: true })
      .limit(limit)

    if (error) throw error
    return (data ?? []) as LeaderboardProfile[]
  },

  async getLeaderboardWithRank(limit = 50): Promise<LeaderboardRow[]> {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('id, username, full_name, avatar_url, total_points, rank')
      .order('rank', { ascending: true })
      .limit(limit)

    if (error) throw error
    return (data ?? []) as LeaderboardRow[]
  },

  async getUserProgress(userId: string): Promise<UserProgressRow[]> {
    const { data, error } = await supabase
      .from('user_progress')
      .select('id, user_id, lesson_id, completed_at, points_earned, correct_answers, total_questions')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })

    if (error) throw error
    return (data ?? []) as UserProgressRow[]
  },

  async getLessonsByIds(lessonIds: string[]): Promise<Lesson[]> {
    if (!lessonIds.length) return []
    const { data, error } = await supabase
      .from('lessons')
      .select('id, category_id, title, summary, content, hint, image_url')
      .in('id', lessonIds)

    if (error) throw error
    return (data ?? []) as Lesson[]
  },

  async upsertProgressAndAwardPoints(params: {
    userId: string
    lessonId: string
    pointsEarned: number
    correctAnswers: number
    totalQuestions: number
  }) {
    const { userId, lessonId, pointsEarned, correctAnswers, totalQuestions } =
      params

    // 1) Save to quiz_attempts history
    const { error: attemptError } = await supabase
      .from('quiz_attempts')
      .insert({
        user_id: userId,
        lesson_id: lessonId,
        points_earned: pointsEarned,
        correct_answers: correctAnswers,
        total_questions: totalQuestions,
        completed_at: new Date().toISOString(),
      })

    if (attemptError) throw attemptError

    // 2) Get current progress for this lesson
    const { data: existingProgress } = await supabase
      .from('user_progress')
      .select('points_earned, correct_answers, completed_at')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .maybeSingle()

    const previousPoints = existingProgress?.points_earned ?? 0
    const previousScore = existingProgress?.correct_answers ?? 0
    const hadCompleted = Boolean(existingProgress?.completed_at)

    // Giữ điểm cao nhất — chơi lại không cộng chồng, chỉ thay nếu cao hơn
    const bestPoints = Math.max(pointsEarned, previousPoints)
    const bestScore = Math.max(correctAnswers, previousScore)
    const pointsDifference = bestPoints - previousPoints
    const isNewHighScore = pointsDifference > 0 || bestScore > previousScore

    // 3) Cộng vào tổng profile chỉ phần chênh lệch XP (không cộng lại toàn bộ lần chơi cũ)
    if (pointsDifference > 0) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('total_points')
        .eq('id', userId)
        .maybeSingle()

      const currentTotalPoints = profile?.total_points ?? 0
      const newTotalPoints = currentTotalPoints + pointsDifference

      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({
          total_points: newTotalPoints,
        })
        .eq('id', userId)

      if (updateProfileError) throw updateProfileError
    }

    // 4) Upsert progress — luôn giữ điểm/XP cao nhất từng đạt
    const completedAt = new Date().toISOString()

    const { error: upsertProgressError } = await supabase
      .from('user_progress')
      .upsert(
        {
          user_id: userId,
          lesson_id: lessonId,
          completed_at: completedAt,
          points_earned: bestPoints,
          correct_answers: bestScore,
          total_questions: totalQuestions,
        },
        { onConflict: 'user_id,lesson_id' }
      )

    if (upsertProgressError) throw upsertProgressError

    const lessonNewlyCompleted = !hadCompleted && Boolean(completedAt)
    try {
      await MemoryStatsService.recordQuizSession({
        userId,
        correctAnswers,
        totalQuestions,
        lessonNewlyCompleted,
      })
    } catch (statsError) {
      console.warn('recordQuizSession:', statsError)
    }

    return {
      isNewHighScore,
      highestScore: bestPoints,
      highestPerformance: bestScore,
    }
  },

  async getQuizAttempts(userId: string, lessonId: string): Promise<QuizAttemptRow[]> {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('id, user_id, lesson_id, points_earned, correct_answers, total_questions, completed_at, created_at')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .order('completed_at', { ascending: false })
      .limit(50) // Limit to 50 most recent attempts

    if (error) throw error
    return (data ?? []) as QuizAttemptRow[]
  },
}

