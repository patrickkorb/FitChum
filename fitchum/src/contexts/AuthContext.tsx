'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signUp: (email: string, password: string, username: string) => Promise<{ error: unknown }>
  signIn: (email: string, password: string) => Promise<{ error: unknown }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: unknown }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const loadProfile = useCallback(async (userId: string) => {
    console.log('=== LOADING PROFILE DEBUG ===')
    console.log('Loading profile for user ID:', userId)
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      console.log('Profile query result:', { data, error: error?.message, errorCode: error?.code })

      if (error) {
        console.error('Error loading profile:', error)
        if (error.code === 'PGRST116') {
          console.log('No profile found for user, this might be expected for new users')
        }
        return
      }

      console.log('Profile loaded successfully:', data)
      setProfile(data)
    } catch (error) {
      console.error('Profile loading exception:', error)
    }
    console.log('=== END PROFILE LOADING DEBUG ===')
  }, [supabase])

  const handleUserSignIn = useCallback(async (user: User) => {
    try {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      // If profile exists and already has a profile picture, don't update
      if (existingProfile && existingProfile.profile_pic_url) {
        return
      }

      // Get Google profile picture if available
      const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture
      
      if (avatarUrl && (!existingProfile || !existingProfile.profile_pic_url)) {
        await supabase
          .from('profiles')
          .update({ 
            profile_pic_url: avatarUrl,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
      }
    } catch (error) {
      console.error('Error handling user sign in:', error)
    }
  }, [supabase])

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Auth session loaded:', { user: !!session?.user, userId: session?.user?.id })
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', { event, user: !!session?.user, userId: session?.user?.id })
      setUser(session?.user ?? null)
      
      if (session?.user) {
        // Check if this is a new user (first sign in)
        if (event === 'SIGNED_IN') {
          await handleUserSignIn(session.user)
        }
        await loadProfile(session.user.id)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [handleUserSignIn, loadProfile, supabase.auth])

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username
          }
        }
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'No user logged in' }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (!error) {
        // Reload profile after update
        await loadProfile(user.id)
      }

      return { error }
    } catch (error) {
      return { error }
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}