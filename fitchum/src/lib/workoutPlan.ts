import { createClient } from '@/lib/supabase/client';
import { WorkoutPlan, WorkoutSchedule, Exercise } from './supabase';

const supabase = createClient();

export interface CreatePlanData {
  splitType: 'ppl' | 'upper_lower' | 'full_body' | 'ppl_arnold' | 'ppl_ul';
  frequency: number;
  selectedDays: string[];
  isFlexible: boolean;
}

export async function createWorkoutPlan(userId: string, planData: CreatePlanData): Promise<boolean> {
  try {
    // Delete existing plan for user (only one active plan allowed)
    await supabase
      .from('workout_plans')
      .delete()
      .eq('user_id', userId);

    // Create new workout plan
    const { data: newPlan, error: planError } = await supabase
      .from('workout_plans')
      .insert({
        user_id: userId,
        split_type: planData.splitType,
        frequency: planData.frequency,
        selected_days: planData.selectedDays,
        is_flexible: planData.isFlexible,
      })
      .select()
      .single();

    if (planError) throw planError;

    // Generate workout schedule
    if (!planData.isFlexible && planData.selectedDays.length > 0) {
      await generateWorkoutSchedule(userId, newPlan.id, planData.splitType, planData.selectedDays);
    }

    return true;
  } catch (error) {
    console.error('Error creating workout plan:', error);
    return false;
  }
}

async function generateWorkoutSchedule(
  userId: string,
  workoutPlanId: string,
  splitType: string,
  selectedDays: string[]
): Promise<void> {
  try {
    // Clear existing schedule
    await supabase
      .from('workout_schedule')
      .delete()
      .eq('user_id', userId);

    const allDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const scheduleEntries: Array<{
      user_id: string;
      workout_plan_id: string;
      day_of_week: string;
      workout_type: string;
      workout_name: string;
      exercises: Exercise[];
    }> = [];

    // Generate workouts for selected days
    selectedDays.forEach((day, index) => {
      const { workoutType, workoutName } = getWorkoutAssignment(splitType, index);
      
      scheduleEntries.push({
        user_id: userId,
        workout_plan_id: workoutPlanId,
        day_of_week: day,
        workout_type: workoutType,
        workout_name: workoutName,
        exercises: [] // Will be populated from templates on the frontend
      });
    });

    // Add rest days for non-selected days
    allDays.forEach(day => {
      if (!selectedDays.includes(day)) {
        scheduleEntries.push({
          user_id: userId,
          workout_plan_id: workoutPlanId,
          day_of_week: day,
          workout_type: 'rest',
          workout_name: 'Rest Day',
          exercises: []
        });
      }
    });

    const { error } = await supabase
      .from('workout_schedule')
      .insert(scheduleEntries);

    if (error) throw error;
  } catch (error) {
    console.error('Error generating workout schedule:', error);
    throw error;
  }
}

function getWorkoutAssignment(splitType: string, dayIndex: number): { workoutType: string; workoutName: string } {
  switch (splitType) {
    case 'ppl':
      const pplTypes = ['push', 'pull', 'legs'];
      const pplNames = ['Push Day', 'Pull Day', 'Leg Day'];
      const pplIndex = dayIndex % 3;
      return { workoutType: pplTypes[pplIndex], workoutName: pplNames[pplIndex] };

    case 'upper_lower':
      const ulTypes = ['upper', 'lower'];
      const ulNames = ['Upper Body', 'Lower Body'];
      const ulIndex = dayIndex % 2;
      return { workoutType: ulTypes[ulIndex], workoutName: ulNames[ulIndex] };

    case 'full_body':
      return { workoutType: 'full_body', workoutName: 'Full Body' };

    case 'ppl_arnold':
      const arnoldTypes = ['arnold_chest_back', 'arnold_shoulders_arms', 'legs'];
      const arnoldNames = ['Chest & Back', 'Shoulders & Arms', 'Leg Day'];
      const arnoldIndex = dayIndex % 3;
      return { workoutType: arnoldTypes[arnoldIndex], workoutName: arnoldNames[arnoldIndex] };

    case 'ppl_ul':
      const pplUlTypes = ['push', 'pull', 'legs', 'upper', 'lower'];
      const pplUlNames = ['Push Day', 'Pull Day', 'Leg Day', 'Upper Body', 'Lower Body'];
      const pplUlIndex = dayIndex % 5;
      return { workoutType: pplUlTypes[pplUlIndex], workoutName: pplUlNames[pplUlIndex] };

    default:
      return { workoutType: 'full_body', workoutName: 'Workout' };
  }
}

export async function getUserWorkoutPlan(userId: string): Promise<WorkoutPlan | null> {
  try {
    const { data, error } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) return null;
    return data;
  } catch (error) {
    console.error('Error fetching user workout plan:', error);
    return null;
  }
}

export async function getUserWorkoutSchedule(userId: string): Promise<WorkoutSchedule[]> {
  try {
    const { data, error } = await supabase
      .from('workout_schedule')
      .select('*')
      .eq('user_id', userId)
      .order('day_of_week');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user workout schedule:', error);
    return [];
  }
}

export async function getTodaysWorkout(userId: string): Promise<WorkoutSchedule | null> {
  try {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    const { data, error } = await supabase
      .from('workout_schedule')
      .select('*')
      .eq('user_id', userId)
      .eq('day_of_week', today)
      .single();

    if (error) return null;
    return data;
  } catch (error) {
    console.error('Error fetching today\'s workout:', error);
    return null;
  }
}

export async function getWorkoutExercises(workoutType: string, splitType: string) {
  try {
    const { data, error } = await supabase
      .from('workout_templates')
      .select('exercises')
      .eq('workout_type', workoutType)
      .eq('split_type', splitType)
      .single();

    if (error) throw error;
    return data?.exercises || [];
  } catch (error) {
    console.error('Error fetching workout exercises:', error);
    return [];
  }
}