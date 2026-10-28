import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'

export type DailyStatRow = Database['public']['Tables']['user_daily_stats']['Row']
export type StatsRangeKey = '7d' | '30d'

const RANGE_DAYS: Record<StatsRangeKey, number> = {
  '7d': 7,
  '30d': 30,
}

function localDateISO(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function startDateForRange(range: StatsRangeKey): string {
  const d = new Date()
  d.setDate(d.getDate() - (RANGE_DAYS[range] - 1))
  return localDateISO(d)
}

function formatChartLabel(isoDate: string): string {
  const [, m, day] = isoDate.split('-')
  return `${day}/${m}`
}

export type StatsChartPoint = { label: string; value: number; date: string }

export type StatsAverages = {
  accuracy_pct: number
  learned_pct: number
  completed_pct: number
  focus_pct: number
}

export const MemoryStatsService = {
  async fetchDailyStatsSeries(
    userId: string,
    range: StatsRangeKey
  ): Promise<StatsChartPoint[]> {
    const from = startDateForRange(range)
    const { data, error } = await supabase
      .from('user_daily_stats')
      .select('stat_date, level_pct')
      .eq('user_id', userId)
      .gte('stat_date', from)
      .order('stat_date', { ascending: true })

    if (error) throw error

    const byDate = new Map<string, number>()
    for (const row of data ?? []) {
      byDate.set(row.stat_date, Number(row.level_pct) || 0)
    }

    const points: StatsChartPoint[] = []
    const cursor = new Date(from)
    const end = new Date()
    while (cursor <= end) {
      const iso = localDateISO(cursor)
      points.push({
        date: iso,
        label: formatChartLabel(iso),
        value: byDate.get(iso) ?? 0,
      })
      cursor.setDate(cursor.getDate() + 1)
    }

    return points.slice(-RANGE_DAYS[range])
  },

  async fetchAverages(userId: string, range: StatsRangeKey): Promise<StatsAverages> {
    const from = startDateForRange(range)
    const { data, error } = await supabase
      .from('user_daily_stats')
      .select('accuracy_pct, learned_pct, completed_pct, focus_pct')
      .eq('user_id', userId)
      .gte('stat_date', from)

    if (error) throw error

    const rows = data ?? []
    if (rows.length === 0) {
      return {
        accuracy_pct: 0,
        learned_pct: 0,
        completed_pct: 0,
        focus_pct: 0,
      }
    }

    const sum = rows.reduce(
      (acc, r) => ({
        accuracy_pct: acc.accuracy_pct + Number(r.accuracy_pct),
        learned_pct: acc.learned_pct + Number(r.learned_pct),
        completed_pct: acc.completed_pct + Number(r.completed_pct),
        focus_pct: acc.focus_pct + Number(r.focus_pct),
      }),
      { accuracy_pct: 0, learned_pct: 0, completed_pct: 0, focus_pct: 0 }
    )

    const n = rows.length
    return {
      accuracy_pct: Math.round(sum.accuracy_pct / n),
      learned_pct: Math.round(sum.learned_pct / n),
      completed_pct: Math.round(sum.completed_pct / n),
      focus_pct: Math.round(sum.focus_pct / n),
    }
  },

  /** Gọi sau mỗi lần hoàn thành quiz để cập nhật thống kê ngày. */
  async recordQuizSession(params: {
    userId: string
    correctAnswers: number
    totalQuestions: number
    lessonNewlyCompleted: boolean
  }): Promise<void> {
    const { userId, correctAnswers, totalQuestions, lessonNewlyCompleted } = params
    const statDate = localDateISO()
    const attemptAccuracy =
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0

    const [{ count: totalLessons }, { count: completedLessons }] = await Promise.all([
      supabase.from('lessons').select('id', { count: 'exact', head: true }),
      supabase
        .from('user_progress')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .not('completed_at', 'is', null),
    ])

    const total = Math.max(1, totalLessons ?? 1)
    const completed = completedLessons ?? 0
    const completedPct = Math.min(100, Math.round((completed / total) * 100))
    const learnedPct = completedPct

    const { data: existing } = await supabase
      .from('user_daily_stats')
      .select('*')
      .eq('user_id', userId)
      .eq('stat_date', statDate)
      .maybeSingle()

    const prevQuizzes = existing?.quizzes_played ?? 0
    const prevAccuracy = Number(existing?.accuracy_pct ?? 0)
    const newQuizzes = prevQuizzes + 1
    const accuracyPct = Math.round(
      (prevAccuracy * prevQuizzes + attemptAccuracy) / newQuizzes
    )
    const focusPct = Math.min(100, Math.round(accuracyPct * 0.92))
    const lessonsCompleted =
      (existing?.lessons_completed ?? 0) + (lessonNewlyCompleted ? 1 : 0)
    const levelPct = Math.round(
      (accuracyPct + learnedPct + completedPct + focusPct) / 4
    )

    const payload = {
      user_id: userId,
      stat_date: statDate,
      accuracy_pct: accuracyPct,
      learned_pct: learnedPct,
      completed_pct: completedPct,
      focus_pct: focusPct,
      level_pct: levelPct,
      lessons_completed: lessonsCompleted,
      quizzes_played: newQuizzes,
    }

    const { error } = await supabase.from('user_daily_stats').upsert(payload, {
      onConflict: 'user_id,stat_date',
    })

    if (error) throw error
  },
}
