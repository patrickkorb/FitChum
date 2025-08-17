import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { recalculateAllUserStreaks } from '@/lib/workoutLogger';

export async function POST() {
  try {
    console.log('Starting streak recalculation for all users...');
    
    // Recalculate all user streaks using the new logic
    await recalculateAllUserStreaks();
    
    // Get updated streak data to return
    const supabase = await createClient();
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, current_streak, longest_streak, last_workout_date')
      .order('user_id');
    
    return NextResponse.json({
      success: true,
      message: 'All user streaks recalculated successfully',
      updatedProfiles: profiles
    });
  } catch (error) {
    console.error('Error recalculating streaks:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to recalculate streaks'
    }, { status: 500 });
  }
}