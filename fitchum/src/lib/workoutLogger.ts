import { createClient } from '@/lib/supabase/client';
import type { JournalEntry } from './supabase';
import { getTodayDateString, getWeekdayLowercase, getDateString, getDaysDifference } from './dateUtils';

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
    const today = getTodayDateString();
    
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
    const today = getTodayDateString();
    
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
 * Update user's workout streak based on their workout schedule
 */
export async function updateUserStreak(userId: string): Promise<void> {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('current_streak, longest_streak, last_workout_date, total_workouts')
      .eq('user_id', userId)
      .single();

    if (!profile) return;

    // Calculate the new streak based on workout schedule
    const newCurrentStreak = await calculateCurrentStreak(userId);
    const newLongestStreak = Math.max(profile.longest_streak || 0, newCurrentStreak);
    const newTotalWorkouts = (profile.total_workouts || 0) + 1;
    const today = getTodayDateString();

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
 * Calculate current streak based on workout schedule and logged workouts
 */
export async function calculateCurrentStreak(userId: string): Promise<number> {
  try {
    // Get user's workout schedule
    const { data: schedule } = await supabase
      .from('workout_schedule')
      .select('day_of_week, workout_type')
      .eq('user_id', userId);

    if (!schedule || schedule.length === 0) return 1;

    // Get user's journal entries
    const { data: journalEntries } = await supabase
      .from('journal_entries')
      .select('date, workout_type')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (!journalEntries || journalEntries.length === 0) return 1;

    // Create a map of workout days (excluding rest days)
    const workoutDays = new Set(
      schedule
        .filter(s => s.workout_type !== 'rest')
        .map(s => s.day_of_week)
    );

    // Create a map of logged workout dates
    const loggedDates = new Set(journalEntries.map(entry => entry.date));

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Check if there are any missed workout days before today
    // Start from yesterday and check backwards until we find the last logged workout
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - 1); // Start from yesterday

    // First, check for any missed workout days before today
    while (checkDate >= new Date('2020-01-01')) { // reasonable limit
      const dateStr = getDateString(checkDate);
      const dayOfWeek = getWeekdayLowercase(checkDate);

      // If this is a scheduled workout day
      if (workoutDays.has(dayOfWeek)) {
        if (loggedDates.has(dateStr)) {
          // Found the most recent logged workout, stop checking
          break;
        } else {
          // Found a missed workout day, streak should reset to 1 (just today's workout)
          return 1;
        }
      }
      // If it's a rest day, continue checking without affecting streak

      // Move to previous day
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // If we reach here, no workout days were missed before today
    // Now calculate the actual streak starting from today and going backwards
    let currentStreak = 0;
    const streakCheckDate = new Date(today);

    // Start from today and work backwards
    while (true) {
      const dateStr = streakCheckDate.toISOString().split('T')[0];
      const dayOfWeek = streakCheckDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

      // If this is a scheduled workout day
      if (workoutDays.has(dayOfWeek)) {
        if (loggedDates.has(dateStr)) {
          // User logged workout on this day, continue streak
          currentStreak++;
        } else {
          // User missed a scheduled workout day, streak breaks
          break;
        }
      }
      // If it's a rest day, continue checking without affecting streak

      // Move to previous day
      streakCheckDate.setDate(streakCheckDate.getDate() - 1);

      // Safety check: don't go back more than 365 days
      const daysDiff = Math.floor((today.getTime() - streakCheckDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff > 365) break;
    }

    return Math.max(currentStreak, 1); // Minimum streak of 1 when logging a workout
  } catch (error) {
    console.error('Error calculating current streak:', error);
    return 1;
  }
}

/**
 * Recalculate and update all user streaks (for fixing existing data)
 */
export async function recalculateAllUserStreaks(): Promise<void> {
  try {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id');

    if (!profiles) return;

    for (const profile of profiles) {
      await recalculateUserStreak(profile.user_id);
    }
  } catch (error) {
    console.error('Error recalculating all user streaks:', error);
  }
}

/**
 * Recalculate a single user's streak without logging a new workout
 */
export async function recalculateUserStreak(userId: string): Promise<void> {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('longest_streak')
      .eq('user_id', userId)
      .single();

    if (!profile) return;

    // Calculate the current streak based on existing journal entries
    const currentStreak = await calculateExistingStreak(userId);
    const longestStreak = Math.max(profile.longest_streak || 0, currentStreak);

    const { error } = await supabase
      .from('profiles')
      .update({
        current_streak: currentStreak,
        longest_streak: longestStreak
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error recalculating user streak:', error);
    }
  } catch (error) {
    console.error('Error recalculating user streak:', error);
  }
}

/**
 * Calculate current streak based on existing journal entries (for recalculation)
 */
async function calculateExistingStreak(userId: string): Promise<number> {
  try {
    // Get user's workout schedule
    const { data: schedule } = await supabase
      .from('workout_schedule')
      .select('day_of_week, workout_type')
      .eq('user_id', userId);

    if (!schedule || schedule.length === 0) return 0;

    // Get user's journal entries
    const { data: journalEntries } = await supabase
      .from('journal_entries')
      .select('date, workout_type')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (!journalEntries || journalEntries.length === 0) return 0;

    // Create a map of workout days (excluding rest days)
    const workoutDays = new Set(
      schedule
        .filter(s => s.workout_type !== 'rest')
        .map(s => s.day_of_week)
    );

    // Create a map of logged workout dates
    const loggedDates = new Set(journalEntries.map(entry => entry.date));

    // Find the most recent logged workout date
    const mostRecentWorkout = journalEntries[0]?.date;
    if (!mostRecentWorkout) return 0;

    const today = new Date();
    const mostRecentWorkoutDate = new Date(mostRecentWorkout);
    
    // First, check if there are any missed workout days between the most recent workout and today
    // If yes, streak should be reset to 0 immediately
    const checkFromDate = new Date(mostRecentWorkoutDate);
    checkFromDate.setDate(checkFromDate.getDate() + 1); // Start checking from the day after the last workout

    while (checkFromDate <= today) {
      const dateStr = checkFromDate.toISOString().split('T')[0];
      const dayOfWeek = checkFromDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

      // If this is a scheduled workout day and user didn't log it, streak is broken
      if (workoutDays.has(dayOfWeek) && !loggedDates.has(dateStr)) {
        return 0; // Streak is broken, return 0 immediately
      }

      checkFromDate.setDate(checkFromDate.getDate() + 1);
    }

    // If we reach here, no workout days were missed between last workout and today
    // Now calculate the actual streak by going backwards from the most recent workout
    let currentStreak = 0;
    const checkDate = new Date(mostRecentWorkoutDate);

    // Start from most recent workout and work backwards
    while (true) {
      const dateStr = getDateString(checkDate);
      const dayOfWeek = getWeekdayLowercase(checkDate);

      // If this is a scheduled workout day
      if (workoutDays.has(dayOfWeek)) {
        if (loggedDates.has(dateStr)) {
          // User logged workout on this day, continue streak
          currentStreak++;
        } else {
          // User missed a scheduled workout day, streak breaks
          break;
        }
      }
      // If it's a rest day, continue checking without affecting streak

      // Move to previous day
      checkDate.setDate(checkDate.getDate() - 1);

      // Safety check: don't go back more than 365 days
      if (getDaysDifference(today, checkDate) > 365) break;
    }

    return currentStreak;
  } catch (error) {
    console.error('Error calculating existing streak:', error);
    return 0;
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
          date: getTodayDateString()
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
          date: getTodayDateString()
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