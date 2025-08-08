import { createClient } from '@/lib/supabase/client';
import type { JournalEntry } from './supabase';

const supabase = createClient();

export interface LogWorkoutData {
  userId: string;
  workoutType: string;
  workoutName: string;
  notes?: string;
  duration?: number;
  difficulty?: number;
}

/**
 * Check if user has already logged a workout today
 */
export async function hasLoggedWorkoutToday(userId: string): Promise<boolean> {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data } = await supabase
      .from('journal_entries')
      .select('id')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    return !!data;
  } catch (error) {
    return false;
  }
}

/**
 * Get today's journal entry if it exists
 */
export async function getTodaysJournalEntry(userId: string): Promise<JournalEntry | null> {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    if (error) return null;
    return data;
  } catch (error) {
    return null;
  }
}

/**
 * Log a workout entry
 */
export async function logWorkout(data: LogWorkoutData): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  
  // Check if already logged today
  const existingEntry = await hasLoggedWorkoutToday(data.userId);
  if (existingEntry) {
    throw new Error('Workout already logged for today');
  }

  // Create journal entry
  const journalEntry = {
    user_id: data.userId,
    date: today,
    workout_type: data.workoutType,
    workout_name: data.workoutName,
    notes: data.notes?.trim() || null,
    duration: data.duration || null,
    difficulty: data.difficulty || null,
    completed: true
  };

  const { error: entryError } = await supabase
    .from('journal_entries')
    .insert(journalEntry);

  if (entryError) {
    console.error('Error creating journal entry:', entryError);
    throw new Error('Failed to log workout');
  }

  // Update user streak
  await updateUserStreak(data.userId);

  // Log activity
  await logWorkoutActivity(data.userId, data.workoutName);
}

/**
 * Update user's workout streak
 */
export async function updateUserStreak(userId: string): Promise<void> {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('current_streak, longest_streak, last_workout_date, total_workouts')
      .eq('user_id', userId)
      .single();

    if (!profile) return;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newCurrentStreak = 1;
    
    if (profile.last_workout_date === yesterdayStr) {
      // Continue streak
      newCurrentStreak = (profile.current_streak || 0) + 1;
    } else if (profile.last_workout_date === today) {
      // Already logged today, don't change streak
      newCurrentStreak = profile.current_streak || 1;
    }
    // If gap is more than 1 day, streak resets to 1

    const newLongestStreak = Math.max(profile.longest_streak || 0, newCurrentStreak);
    const newTotalWorkouts = (profile.total_workouts || 0) + 1;

    const { error } = await supabase
      .from('profiles')
      .update({
        current_streak: newCurrentStreak,
        longest_streak: newLongestStreak,
        last_workout_date: today,
        total_workouts: newTotalWorkouts
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating streak:', error);
    }

    // Log streak milestone if it's a significant achievement
    if (newCurrentStreak > 0 && newCurrentStreak % 7 === 0) {
      await logStreakMilestone(userId, newCurrentStreak);
    }
  } catch (error) {
    console.error('Error updating user streak:', error);
  }
}

/**
 * Log workout activity for the activity feed
 */
export async function logWorkoutActivity(userId: string, workoutName: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: userId,
        activity_type: 'workout_logged',
        activity_data: {
          workout_type: workoutName,
          date: new Date().toISOString().split('T')[0]
        }
      });

    if (error) {
      console.error('Error logging workout activity:', error);
    }
  } catch (error) {
    console.error('Error logging workout activity:', error);
  }
}

/**
 * Log streak milestone achievement
 */
export async function logStreakMilestone(userId: string, streak: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: userId,
        activity_type: 'streak_milestone',
        activity_data: {
          streak: streak,
          date: new Date().toISOString().split('T')[0]
        }
      });

    if (error) {
      console.error('Error logging streak milestone:', error);
    }
  } catch (error) {
    console.error('Error logging streak milestone:', error);
  }
}

/**
 * Get user's recent journal entries
 */
export async function getUserJournalEntries(userId: string, limit: number = 10): Promise<JournalEntry[]> {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching journal entries:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return [];
  }
}