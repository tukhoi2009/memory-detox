export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type NotificationType =
  | 'welcome'
  | 'system'
  | 'achievement'
  | 'lesson_unlock'
  | 'practice_reminder'
  | 'streak'
  | 'meal_reminder'
  | 'water_reminder'
  | 'exercise_reminder'
  | 'sleep_reminder'
  | 'goal_completed'
  | 'weight_update'
  | 'new_article'
  | 'tip'

export type HomeTab = 'home' | 'stats' | 'leaderboard' | 'profile'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          avatar_preset_id: string | null
          total_points: number
          notifications_enabled: boolean
          preferred_language: string
          default_home_tab: HomeTab
          onboarding_completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          avatar_preset_id?: string | null
          total_points?: number
          notifications_enabled?: boolean
          preferred_language?: string
          default_home_tab?: HomeTab
          onboarding_completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          avatar_preset_id?: string | null
          total_points?: number
          notifications_enabled?: boolean
          preferred_language?: string
          default_home_tab?: HomeTab
          onboarding_completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          image_url: string | null
          color_code: string | null
          icon_name: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          image_url?: string | null
          color_code?: string | null
          icon_name?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          image_url?: string | null
          color_code?: string | null
          icon_name?: string | null
          sort_order?: number
          created_at?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          id: string
          category_id: string
          title: string
          summary: string | null
          content: string
          hint: string | null
          image_url: string | null
          sort_order: number
          is_locked: boolean
          unlock_min_points: number
          points_reward: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          title: string
          summary?: string | null
          content?: string
          hint?: string | null
          image_url?: string | null
          sort_order?: number
          is_locked?: boolean
          unlock_min_points?: number
          points_reward?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          title?: string
          summary?: string | null
          content?: string
          hint?: string | null
          image_url?: string | null
          sort_order?: number
          is_locked?: boolean
          unlock_min_points?: number
          points_reward?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          id: string
          lesson_id: string
          question: string
          options: string[]
          correct_index: number
          question_index: number
          hint: string | null
          created_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          question: string
          options: string[] | Json
          correct_index: number
          question_index?: number
          hint?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          lesson_id?: string
          question?: string
          options?: string[] | Json
          correct_index?: number
          question_index?: number
          hint?: string | null
          created_at?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed_at: string | null
          points_earned: number
          correct_answers: number
          total_questions: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          completed_at?: string | null
          points_earned?: number
          correct_answers?: number
          total_questions?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          completed_at?: string | null
          points_earned?: number
          correct_answers?: number
          total_questions?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          points_earned: number
          correct_answers: number
          total_questions: number
          accuracy_pct: number
          focus_seconds: number | null
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          points_earned?: number
          correct_answers?: number
          total_questions: number
          focus_seconds?: number | null
          completed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          points_earned?: number
          correct_answers?: number
          total_questions?: number
          focus_seconds?: number | null
          completed_at?: string
          created_at?: string
        }
        Relationships: []
      }
      user_daily_stats: {
        Row: {
          id: string
          user_id: string
          stat_date: string
          level_pct: number
          accuracy_pct: number
          learned_pct: number
          completed_pct: number
          focus_pct: number
          lessons_completed: number
          quizzes_played: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stat_date: string
          level_pct?: number
          accuracy_pct?: number
          learned_pct?: number
          completed_pct?: number
          focus_pct?: number
          lessons_completed?: number
          quizzes_played?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stat_date?: string
          level_pct?: number
          accuracy_pct?: number
          learned_pct?: number
          completed_pct?: number
          focus_pct?: number
          lessons_completed?: number
          quizzes_played?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      achievements: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          icon_url: string | null
          requirement_type: string
          requirement_value: number
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string | null
          icon_url?: string | null
          requirement_type?: string
          requirement_value?: number
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string | null
          icon_url?: string | null
          requirement_type?: string
          requirement_value?: number
          sort_order?: number
          created_at?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          earned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          earned_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          earned_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: NotificationType
          title: string
          message: string
          icon: string
          icon_bg: string
          is_read: boolean
          related_id: string | null
          metadata: Json
          created_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type?: NotificationType
          title: string
          message: string
          icon?: string
          icon_bg?: string
          is_read?: boolean
          related_id?: string | null
          metadata?: Json
          created_at?: string
          read_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: NotificationType
          title?: string
          message?: string
          icon?: string
          icon_bg?: string
          is_read?: boolean
          related_id?: string | null
          metadata?: Json
          created_at?: string
          read_at?: string | null
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          id: string
          user_id: string
          breakfast_enabled: boolean
          breakfast_time: string
          lunch_enabled: boolean
          lunch_time: string
          dinner_enabled: boolean
          dinner_time: string
          water_enabled: boolean
          water_interval_hours: number
          exercise_enabled: boolean
          exercise_time: string
          sleep_enabled: boolean
          sleep_time: string
          goal_notifications_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          breakfast_enabled?: boolean
          breakfast_time?: string
          lunch_enabled?: boolean
          lunch_time?: string
          dinner_enabled?: boolean
          dinner_time?: string
          water_enabled?: boolean
          water_interval_hours?: number
          exercise_enabled?: boolean
          exercise_time?: string
          sleep_enabled?: boolean
          sleep_time?: string
          goal_notifications_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          breakfast_enabled?: boolean
          breakfast_time?: string
          lunch_enabled?: boolean
          lunch_time?: string
          dinner_enabled?: boolean
          dinner_time?: string
          water_enabled?: boolean
          water_interval_hours?: number
          exercise_enabled?: boolean
          exercise_time?: string
          sleep_enabled?: boolean
          sleep_time?: string
          goal_notifications_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      app_content: {
        Row: {
          id: string
          slug: string
          title: string
          content: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          content: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          content?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      leaderboard: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          total_points: number
          rank: number
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      home_tab: 'home' | 'stats' | 'leaderboard' | 'profile'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
