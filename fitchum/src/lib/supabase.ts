// Database type definitions for FitChum
export type Profile = {
  id: string
  user_id: string
  username: string | null
  email: string | null
  profile_pic_url: string | null
  theme_preference: 'light' | 'dark'
  subscription_plan: 'free' | 'pro'
  subscription_status: string | null
  stripe_payment_id: string | null
  current_streak: number
  longest_streak: number
  last_workout_date: string | null
  total_workouts: number
  created_at: string
  updated_at: string
}

export type WorkoutEntry = {
  id: string
  user_id: string
  workout_type: string
  notes: string | null
  created_at: string
  updated_at: string
}

export type JournalEntry = {
  id: string
  user_id: string
  date: string
  workout_type: string
  workout_name: string
  notes: string | null
  duration: number | null
  difficulty: number | null
  completed: boolean
  created_at: string
  updated_at: string
}

export type ActivityLog = {
  id: string
  user_id: string
  activity_type: 'workout_logged' | 'streak_milestone' | 'goal_achieved'
  activity_data: Record<string, unknown>
  created_at: string
}

export type Friendship = {
  id: string
  requester_id: string
  addressee_id: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
}

export type Exercise = {
  name: string
  sets: number
  reps: string
  rest: string
}

export type WorkoutPlan = {
  id: string
  user_id: string
  split_type: 'ppl' | 'upper_lower' | 'full_body' | 'ppl_arnold' | 'ppl_ul'
  frequency: number
  selected_days: string[]
  is_flexible: boolean
  created_at: string
  updated_at: string
}

export type WorkoutSchedule = {
  id: string
  user_id: string
  workout_plan_id: string
  day_of_week: string
  workout_type: string
  workout_name: string
  exercises: Exercise[]
  created_at: string
  updated_at: string
}

export type WorkoutTemplate = {
  id: string
  workout_type: string
  split_type: string
  exercises: Exercise[]
  created_at: string
}

export type User = {
  id: string
  email: string
  user_metadata: {
    username?: string
  }
}

// Database schema types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
      }
      workout_entries: {
        Row: WorkoutEntry
        Insert: Omit<WorkoutEntry, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<WorkoutEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
      }
      journal_entries: {
        Row: JournalEntry
        Insert: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<JournalEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
      }
      activity_logs: {
        Row: ActivityLog
        Insert: Omit<ActivityLog, 'id' | 'created_at'>
        Update: Partial<Omit<ActivityLog, 'id' | 'user_id' | 'created_at'>>
      }
      friendships: {
        Row: Friendship
        Insert: Omit<Friendship, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Friendship, 'id' | 'requester_id' | 'addressee_id' | 'created_at' | 'updated_at'>>
      }
      workout_plans: {
        Row: WorkoutPlan
        Insert: Omit<WorkoutPlan, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<WorkoutPlan, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
      }
      workout_schedule: {
        Row: WorkoutSchedule
        Insert: Omit<WorkoutSchedule, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<WorkoutSchedule, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
      }
      workout_templates: {
        Row: WorkoutTemplate
        Insert: Omit<WorkoutTemplate, 'id' | 'created_at'>
        Update: Partial<Omit<WorkoutTemplate, 'id' | 'created_at'>>
      }
    }
  }
}