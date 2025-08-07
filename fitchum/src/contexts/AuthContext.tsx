'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<{ error: unknown }>;
  signIn: (email: string, password: string) => Promise<{ error: unknown }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: unknown }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const loadProfile = useCallback(async (userId: string) => {
    console.log('Loading profile for:', userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      console.log('Profile query result:', { data, error });

      if (error) {
        console.log('Profile error:', error.code, error.message);
        if (error.code === 'PGRST116') {
          console.log('No profile found - setting to null');
          setProfile(null);
        }
        return;
      }

      console.log('Profile loaded successfully:', data);
      setProfile(data);
    } catch (error) {
      console.error('Profile loading exception:', error);
      setProfile(null);
    }
  }, [supabase]);

  const handleUserSignIn = useCallback(async (user: User) => {
    console.log('handleUserSignIn for:', user.id);
    
    try {
      console.log('Starting profile check query...');
      
      // Simple query without Promise.race for now
      const { data: existingProfile, error } = await supabase
        .from('profiles')
        .select('profile_pic_url')
        .eq('user_id', user.id)
        .single();
      
      console.log('Profile query completed:', { data: existingProfile, error: error?.message });

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('No profile found - this is normal for new users');
        } else {
          console.error('Profile query error:', error);
        }
        return;
      }

      if (existingProfile?.profile_pic_url) {
        console.log('Profile already has picture, skipping update');
        return;
      }

      const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
      console.log('Avatar URL from metadata:', avatarUrl);
      
      if (avatarUrl) {
        console.log('Updating profile with avatar URL');
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            profile_pic_url: avatarUrl,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
          
        if (updateError) {
          console.error('Profile update error:', updateError);
        } else {
          console.log('Profile updated successfully');
        }
      }
    } catch (error) {
      console.error('handleUserSignIn error:', error);
    }
    console.log('handleUserSignIn completed');
  }, [supabase]);

  useEffect(() => {
    console.log('AuthContext initializing...');
    
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session:', session?.user?.id || 'No user');
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await loadProfile(session.user.id);
      } else {
        setProfile(null);
      }
      
      console.log('Setting initial loading to false');
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id || 'No user');
      
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Skip handleUserSignIn for now - it might be causing issues
        if (event === 'SIGNED_IN') {
          console.log('Sign in detected - skipping handleUserSignIn for now');
          // await handleUserSignIn(session.user); // Temporarily disabled
        }
        
        // Always load profile when user exists
        console.log('Loading profile for user:', session.user.id);
        await loadProfile(session.user.id);
      } else {
        console.log('No user - clearing profile');
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => {
      console.log('AuthContext cleanup');
      subscription.unsubscribe();
    };
  }, []); // Remove dependencies to avoid infinite loops

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (!error) {
        await loadProfile(user.id);
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}