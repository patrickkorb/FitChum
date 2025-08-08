"use client"
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getUserWorkoutPlan, getUserWorkoutSchedule, getTodaysWorkout, getWorkoutExercises } from '@/lib/workoutPlan';
import { WorkoutPlan, WorkoutSchedule, Exercise } from '@/lib/supabase';
import PlanHeader from './PlanHeader';

type TodaysWorkoutData = WorkoutSchedule & {
  exercises: Exercise[];
};

type WeeklyScheduleDay = {
  day: string;
  name: string;
  type: string;
  isToday: boolean;
  isRestDay: boolean;
  exercises: Exercise[];
};

interface PlanOverviewProps {
  onEditPlan: () => void;
}

export default function PlanOverview({ onEditPlan }: PlanOverviewProps) {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [todaysWorkout, setTodaysWorkout] = useState<TodaysWorkoutData | null>(null);
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklyScheduleDay[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const initializeData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;


        // Load workout plan
        const plan = await getUserWorkoutPlan(user.id);
        setWorkoutPlan(plan);

        // Load today's workout
        const today = await getTodaysWorkout(user.id);
        if (today) {
          const exercises = await getWorkoutExercises(today.workout_type, plan?.split_type || '');
          setTodaysWorkout({ ...today, exercises });
        }

        // Load weekly schedule
        const schedule = await getUserWorkoutSchedule(user.id);
        const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        
        const formattedSchedule: WeeklyScheduleDay[] = await Promise.all(
          schedule.map(async (day) => {
            const exercises = day.workout_type !== 'rest' 
              ? await getWorkoutExercises(day.workout_type, plan?.split_type || '')
              : [];
            
            return {
              day: day.day_of_week,
              name: day.workout_name,
              type: day.workout_type,
              isToday: day.day_of_week === todayName,
              isRestDay: day.workout_type === 'rest',
              exercises
            };
          })
        );

        setWeeklySchedule(formattedSchedule);
      } catch (error) {
        console.error('Error loading workout data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [supabase.auth]);

  const handleDayClick = (day: WeeklyScheduleDay): void => {
    console.log('Clicked on day:', day);
    // Could show workout details or navigate to workout view
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-neutral-dark/70 dark:text-neutral-light/70">
            Loading your workout plan...
          </p>
        </div>
      </div>
    );
  }

  if (!workoutPlan) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center space-y-4">
          <p className="text-neutral-dark dark:text-neutral-light text-lg">
            No workout plan found. Please create one first.
          </p>
          <button
            onClick={onEditPlan}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Create Workout Plan
          </button>
        </div>
      </div>
    );
  }

  const planDisplayData = {
    workoutSplit: workoutPlan.split_type.replace('_', '/').toUpperCase(),
    frequency: `${workoutPlan.frequency}x per week`,
    schedule: workoutPlan.selected_days.join(', ')
  };

  return (
    <div className="px-4 sm:px-8 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <PlanHeader 
          planData={planDisplayData}
          onEditPlan={onEditPlan}
        />

        {/* Today's Workout */}
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-dark dark:text-neutral-light">
            Today&apos;s Workout
          </h2>
          {todaysWorkout ? (
            <div className="bg-white dark:bg-neutral-dark/50 rounded-2xl p-6 border border-neutral-dark/10 dark:border-neutral-light/10 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-neutral-dark dark:text-neutral-light">
                    {todaysWorkout.workout_name}
                  </h3>
                  <p className="text-neutral-dark/70 dark:text-neutral-light/70">
                    {todaysWorkout.exercises.length} exercises
                  </p>
                </div>
                <div className="text-primary font-bold text-lg">
                  Ready
                </div>
              </div>
              
              {/* Exercise List */}
              <div className="space-y-3">
                <h4 className="font-semibold text-neutral-dark dark:text-neutral-light mb-2">
                  Exercises:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {todaysWorkout.exercises.map((exercise, index) => (
                    <div key={index} className="bg-neutral-dark/5 dark:bg-neutral-light/5 p-3 rounded-lg">
                      <div className="font-medium text-neutral-dark dark:text-neutral-light">
                        {exercise.name}
                      </div>
                      <div className="text-sm text-neutral-dark/70 dark:text-neutral-light/70">
                        {exercise.sets} × {exercise.reps} • {exercise.rest} rest
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-neutral-dark/50 rounded-2xl p-6 border border-neutral-dark/10 dark:border-neutral-light/10 shadow-sm text-center">
              <h3 className="text-lg font-bold text-neutral-dark dark:text-neutral-light mb-2">
                Rest Day
              </h3>
              <p className="text-neutral-dark/70 dark:text-neutral-light/70">
                Take a well-deserved break today!
              </p>
            </div>
          )}
        </div>

        {/* Weekly Schedule */}
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-dark dark:text-neutral-light">
            This Week&apos;s Schedule
          </h2>
          
          {/* Mobile Layout - Stacked Cards */}
          <div className="block sm:hidden space-y-2">
            {weeklySchedule.map((day) => (
              <button
                key={day.day}
                onClick={() => handleDayClick(day)}
                className={`w-full p-4 rounded-xl text-left transition-all duration-200 flex items-center justify-between ${
                  day.isToday
                    ? 'bg-primary text-white shadow-lg'
                    : day.isRestDay
                    ? 'bg-neutral-dark/5 dark:bg-neutral-light/5 text-neutral-dark/50 dark:text-neutral-light/50'
                    : 'bg-white dark:bg-neutral-dark/50 text-neutral-dark dark:text-neutral-light border border-neutral-dark/10 dark:border-neutral-light/10'
                }`}
              >
                <div className="flex flex-col">
                  <div className="font-bold text-lg capitalize">
                    {day.day}
                    {day.isToday && <span className="ml-2 text-sm font-normal bg-white/20 px-2 py-0.5 rounded">Today</span>}
                  </div>
                  <div className="text-sm font-medium mt-1">{day.name}</div>
                  {!day.isRestDay && (
                    <div className="text-xs mt-1 opacity-80">
                      {day.exercises.length} exercises
                    </div>
                  )}
                </div>
                <div className="text-xs font-medium opacity-50">
                  {day.day.slice(0, 3).toUpperCase()}
                </div>
              </button>
            ))}
          </div>

          {/* Desktop Layout - Grid */}
          <div className="hidden sm:grid grid-cols-7 gap-2">
            {weeklySchedule.map((day) => (
              <button
                key={day.day}
                onClick={() => handleDayClick(day)}
                className={`p-4 rounded-lg text-center transition-all duration-200 min-h-[100px] flex flex-col justify-center ${
                  day.isToday
                    ? 'bg-primary text-white shadow-lg'
                    : day.isRestDay
                    ? 'bg-neutral-dark/5 dark:bg-neutral-light/5 text-neutral-dark/50 dark:text-neutral-light/50'
                    : 'bg-white dark:bg-neutral-dark/50 text-neutral-dark dark:text-neutral-light border border-neutral-dark/10 dark:border-neutral-light/10 hover:bg-neutral-dark/10 dark:hover:bg-neutral-light/10'
                }`}
              >
                <div className="text-xs font-medium mb-1">
                  {day.day.slice(0, 3).toUpperCase()}
                </div>
                <div className="text-sm font-semibold mb-1">
                  {day.name}
                </div>
                {!day.isRestDay && (
                  <div className="text-xs opacity-80">
                    {day.exercises.length} exercises
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}