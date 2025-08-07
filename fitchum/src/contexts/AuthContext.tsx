'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {Session, User} from '@supabase/supabase-js';
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

let authProviderInstances = 0;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  authProviderInstances++;
  const instanceId = authProviderInstances;
  console.log(`🔍 AuthProvider #${instanceId} mounting`); 
  
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  
  console.log(`📡 AuthProvider #${instanceId} - Supabase client created`);

  const loadProfile = useCallback(async (userId: string) => {
    console.log(`📊 AuthProvider #${instanceId} - Loading profile for:`, userId);
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
          console.log('No profile found - creating new profile');
          
          // Create profile if it doesn't exist
          const { data: userData } = await supabase.auth.getUser();
          if (userData.user) {
            const newProfile = {
              user_id: userId,
              username: userData.user.user_metadata?.username || userData.user.email?.split('@')[0] || 'User',
              email: userData.user.email,
              profile_pic_url: userData.user.user_metadata?.avatar_url || null,
              theme_preference: 'dark' as const,
              subscription_plan: 'free' as const,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            
            console.log('Creating new profile:', newProfile);
            const { data: createdProfile, error: createError } = await supabase
              .from('profiles')
              .insert(newProfile)
              .select()
              .single();
              
            if (createError) {
              console.error('Error creating profile:', createError);
              setProfile(null);
            } else {
              console.log('Profile created successfully:', createdProfile);
              setProfile(createdProfile);
            }
          } else {
            setProfile(null);
          }
        } else {
          console.error('Other profile error:', error);
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
    console.log(`🚀 AuthContext #${instanceId} initializing...`);
    
    let isActive = true; // Prevent state updates after cleanup
    
    // Get initial session  
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log(`📋 AuthProvider #${instanceId} - Initial session:`, session?.user?.id || 'No user');
        
        if (!isActive) return; // Component was unmounted
        
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log(`👤 AuthProvider #${instanceId} - Loading profile for:`, session.user.id);
          await loadProfile(session.user.id);
        } else {
          if (isActive) setProfile(null);
        }
        
        if (isActive) {
          console.log(`✅ AuthProvider #${instanceId} - Setting initial loading to false`);
          setLoading(false);
        }
      } catch (error) {
        console.error(`❌ AuthProvider #${instanceId} - Init error:`, error);
        if (isActive) setLoading(false);
      }
    };
    
    initializeAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: string, session: Session) => {
      if (!isActive) return; // Ignore if component unmounted
      
      console.log(`🔄 AuthProvider #${instanceId} - Auth state changed:`, event, session?.user?.id || 'No user');
      
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Skip handleUserSignIn for now - it might be causing issues
        if (event === 'SIGNED_IN') {
          console.log(`🔐 AuthProvider #${instanceId} - Sign in detected - skipping handleUserSignIn for now`);
          // await handleUserSignIn(session.user); // Temporarily disabled
        }
        
        // Always load profile when user exists
        console.log(`👤 AuthProvider #${instanceId} - Loading profile for user:`, session.user.id);
        await loadProfile(session.user.id);
      } else {
        console.log(`❌ AuthProvider #${instanceId} - No user - clearing profile`);
        if (isActive) setProfile(null);
      }
      
      if (isActive) setLoading(false);
    });

    return () => {
      console.log(`🧹 AuthProvider #${instanceId} - Cleanup`);
      isActive = false;
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