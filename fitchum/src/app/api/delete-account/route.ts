import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createAdminClient();
    
    // Get the user from the request
    const { userId } = await req.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Delete user data from profiles table first (due to foreign key constraints)
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('user_id', userId);

    if (profileError) {
      console.error('Error deleting profile:', profileError);
      return NextResponse.json({ error: 'Failed to delete profile data' }, { status: 500 });
    }

    // Delete other user data if needed (journal entries, workout plans, etc.)
    
    // Delete journal entries
    await supabase
      .from('journal_entries')
      .delete()
      .eq('user_id', userId);

    // Delete workout plans
    await supabase
      .from('workout_plans')
      .delete()
      .eq('user_id', userId);

    // Delete workout schedule
    await supabase
      .from('workout_schedule')
      .delete()
      .eq('user_id', userId);

    // Delete activity logs
    await supabase
      .from('activity_logs')
      .delete()
      .eq('user_id', userId);

    // Delete friendships
    await supabase
      .from('friendships')
      .delete()
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`);

    // Finally, delete the user from auth (this must be done with admin client)
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) {
      console.error('Error deleting user from auth:', authError);
      return NextResponse.json({ error: 'Failed to delete user account' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Account deleted successfully' });

  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}