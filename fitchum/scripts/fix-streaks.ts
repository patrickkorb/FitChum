// Script to fix all user streaks using the new calculation logic
import { createClient } from '@supabase/supabase-js';
import { recalculateAllUserStreaks } from '../src/lib/workoutLogger';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixAllStreaks() {
  console.log('Starting streak recalculation for all users...');
  
  try {
    await recalculateAllUserStreaks();
    console.log('✅ All user streaks have been recalculated successfully!');
  } catch (error) {
    console.error('❌ Error recalculating streaks:', error);
  }
}

// Run the script
fixAllStreaks();