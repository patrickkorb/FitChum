import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export interface UserStats {
  currentStreak: number;
  maxStreak: number;
  totalWorkouts: number;
  avgDuration: number;
}

export async function getUserStats(userId: string): Promise<UserStats | null> {
  try {
    // Get profile data for streaks and total workouts
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('current_streak, longest_streak, total_workouts')
      .eq('user_id', userId)
      .single();

    if (profileError) throw profileError;

    // Get average workout duration from journal entries
    const { data: journalEntries, error: journalError } = await supabase
      .from('journal_entries')
      .select('duration')
      .eq('user_id', userId)
      .not('duration', 'is', null)
      .gt('duration', 0); // Only get entries with duration > 0

    if (journalError) throw journalError;

    // Calculate average duration
    let avgDuration = 0;
    if (journalEntries && journalEntries.length > 0) {
      // Filter out any entries with invalid durations and convert to numbers
      const validDurations = journalEntries
        .map(entry => Number(entry.duration))
        .filter(duration => duration > 0);
      
      if (validDurations.length > 0) {
        const totalDuration = validDurations.reduce((sum, duration) => sum + duration, 0);
        avgDuration = totalDuration / validDurations.length;
      }
    }

    return {
      currentStreak: profile?.current_streak || 0,
      maxStreak: profile?.longest_streak || 0,
      totalWorkouts: profile?.total_workouts || 0,
      avgDuration
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }
}