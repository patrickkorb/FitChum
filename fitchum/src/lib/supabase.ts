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
  created_at: string
  updated_at: string
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
    }
  }
}