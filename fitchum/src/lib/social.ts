import { createClient } from '@/lib/supabase/client';
import type { ActivityLog } from './supabase';

const supabase = createClient();

export async function updateUserStreak(userId: string, workoutType: string): Promise<void> {
  try {
    // Get user's current profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('current_streak, longest_streak, last_workout_date, total_workouts')
      .eq('user_id', userId)
      .single();

    if (profileError) throw profileError;

    const today = new Date().toISOString().split('T')[0];
    const lastWorkout = profile.last_workout_date?.split('T')[0];
    
    let newStreak = profile.current_streak || 0;
    let newLongestStreak = profile.longest_streak || 0;
    
    // Calculate streak logic
    if (!lastWorkout) {
      // First workout ever
      newStreak = 1;
    } else {
      const lastWorkoutDate = new Date(lastWorkout);
      const todayDate = new Date(today);
      const daysDiff = Math.floor((todayDate.getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 0) {
        // Already logged today, don't change streak
        return;
      } else if (daysDiff === 1) {
        // Consecutive day
        newStreak = (profile.current_streak || 0) + 1;
      } else {
        // Streak broken
        newStreak = 1;
      }
    }
    
    // Update longest streak if needed
    if (newStreak > newLongestStreak) {
      newLongestStreak = newStreak;
    }

    // Update profile with new streak data
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        current_streak: newStreak,
        longest_streak: newLongestStreak,
        last_workout_date: new Date().toISOString(),
        total_workouts: (profile.total_workouts || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (updateError) throw updateError;

    // Log workout activity
    await logActivity(userId, 'workout_logged', { workout_type: workoutType });

    // Log streak milestone if it's a special number
    if (newStreak > 0 && (newStreak % 5 === 0 || newStreak === 1)) {
      await logActivity(userId, 'streak_milestone', { streak: newStreak });
    }

  } catch (error) {
    console.error('Error updating user streak:', error);
    throw error;
  }
}

export async function logActivity(
  userId: string, 
  activityType: 'workout_logged' | 'streak_milestone' | 'goal_achieved', 
  activityData: Record<string, unknown>
): Promise<void> {
  try {
    const { error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: userId,
        activity_type: activityType,
        activity_data: activityData,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error logging activity:', error);
    throw error;
  }
}

export async function getUserStreak(userId: string): Promise<{ current: number; longest: number } | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('current_streak, longest_streak')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    return {
      current: data.current_streak || 0,
      longest: data.longest_streak || 0
    };
  } catch (error) {
    console.error('Error fetching user streak:', error);
    return null;
  }
}

export async function getFriends(userId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('friendships')
      .select('requester_id, addressee_id')
      .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
      .eq('status', 'accepted');

    if (error) throw error;

    return data?.map(friendship => 
      friendship.requester_id === userId 
        ? friendship.addressee_id 
        : friendship.requester_id
    ) || [];
  } catch (error) {
    console.error('Error fetching friends:', error);
    return [];
  }
}

export async function sendFriendRequest(requesterId: string, addresseeId: string): Promise<boolean> {
  try {
    // Check if friendship already exists
    const { data: existing } = await supabase
      .from('friendships')
      .select('id')
      .or(`requester_id.eq.${requesterId},addressee_id.eq.${requesterId}`)
      .or(`requester_id.eq.${addresseeId},addressee_id.eq.${addresseeId}`);

    if (existing && existing.length > 0) {
      console.log('Friendship already exists');
      return false;
    }

    const { error } = await supabase
      .from('friendships')
      .insert({
        requester_id: requesterId,
        addressee_id: addresseeId,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error sending friend request:', error);
    return false;
  }
}

export async function acceptFriendRequest(friendshipId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('friendships')
      .update({
        status: 'accepted',
        updated_at: new Date().toISOString()
      })
      .eq('id', friendshipId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error accepting friend request:', error);
    return false;
  }
}