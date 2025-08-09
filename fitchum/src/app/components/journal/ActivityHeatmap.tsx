'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ActivityData {
  date: string;
  hasWorkout: boolean;
  type: 'workout' | 'rest' | 'none';
}

interface ActivityHeatmapProps {
  userId: string;
}

export default function ActivityHeatmap({ userId }: ActivityHeatmapProps) {
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [totalWorkouts, setTotalWorkouts] = useState(0);

  const supabase = createClient();

  useEffect(() => {
    loadActivityData();
  }, [userId]);

  const loadActivityData = async () => {
    if (!userId) return;
    
    try {
      // Get data for the last year (365 days)
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      
      const endDate = new Date();
      
      // Get all journal entries for the year
      const { data: journalEntries, error: journalError } = await supabase
        .from('journal_entries')
        .select('date, completed')
        .eq('user_id', userId)
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (journalError) throw journalError;

      // Get user profile for streak and total workouts
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('current_streak, total_workouts')
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;

      setStreak(profile?.current_streak || 0);
      setTotalWorkouts(profile?.total_workouts || 0);

      // Create activity data for each day of the year
      const activities: ActivityData[] = [];
      const journalMap = new Map(journalEntries?.map(entry => [entry.date, entry.completed]) || []);

      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const hasWorkout = journalMap.get(dateStr) || false;
        
        activities.push({
          date: dateStr,
          hasWorkout,
          type: hasWorkout ? 'workout' : 'none'
        });
      }

      setActivityData(activities);
    } catch (error) {
      console.error('Error loading activity data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIntensityClass = (activity: ActivityData) => {
    if (activity.type === 'workout') {
      return 'bg-primary';
    }
    return 'bg-neutral-200 dark:bg-neutral-700';
  };

  const getTooltipText = (activity: ActivityData) => {
    const date = new Date(activity.date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    
    if (activity.type === 'workout') {
      return `${date}: Workout completed`;
    }
    return `${date}: No workout`;
  };

  // Group activities by week
  const getWeeksFromActivities = () => {
    const weeks: ActivityData[][] = [];
    let currentWeek: ActivityData[] = [];
    
    activityData.forEach((activity, index) => {
      const date = new Date(activity.date);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      // If it's Sunday and we have a current week, push it and start new one
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      currentWeek.push(activity);
      
      // If it's the last item, push the current week
      if (index === activityData.length - 1) {
        weeks.push(currentWeek);
      }
    });
    
    return weeks;
  };

  const weeks = getWeeksFromActivities();
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  if (loading) {
    return (
      <div className="animate-pulse bg-neutral-200 dark:bg-neutral-700 rounded-lg h-32 w-full"></div>
    );
  }

  const calculateConsistency = () => {
    if (activityData.length === 0) return 0;
    const workoutDays = activityData.filter(activity => activity.type === 'workout').length;
    return Math.round((workoutDays / activityData.length) * 100);
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl p-4 sm:p-6 border border-neutral-200 dark:border-neutral-700">
      {/* Header Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-dark dark:text-neutral-light">
          Activity Overview
        </h2>
        
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex flex-col items-center bg-neutral-100 dark:bg-neutral-700 rounded-lg px-3 py-2">
            <span className="text-2xl font-bold text-primary">{streak}</span>
            <span className="text-neutral-600 dark:text-neutral-400">Streak</span>
          </div>
          
          <div className="flex flex-col items-center bg-neutral-100 dark:bg-neutral-700 rounded-lg px-3 py-2">
            <span className="text-2xl font-bold text-secondary">{calculateConsistency()}%</span>
            <span className="text-neutral-600 dark:text-neutral-400">Consistency</span>
          </div>
          
          <div className="flex flex-col items-center bg-neutral-100 dark:bg-neutral-700 rounded-lg px-3 py-2">
            <span className="text-2xl font-bold text-blue-600">{totalWorkouts}</span>
            <span className="text-neutral-600 dark:text-neutral-400">Total</span>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Month labels */}
          <div className="flex mb-2 text-xs text-neutral-600 dark:text-neutral-400 ml-8">
            {monthLabels.map((month, index) => (
              <div key={month} className="flex-1 text-center min-w-[2rem]">
                {index % 3 === 0 ? month : ''}
              </div>
            ))}
          </div>

          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 mr-2 text-xs text-neutral-600 dark:text-neutral-400 justify-start pt-1">
              {dayLabels.map((day, index) => (
                <div key={day} className="h-3 flex items-center justify-center">
                  {index % 2 === 1 ? day : ''}
                </div>
              ))}
            </div>

            {/* Activity grid */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }, (_, dayIndex) => {
                    const activity = week.find((a, i) => {
                      const date = new Date(a.date);
                      return date.getDay() === dayIndex;
                    }) || week[dayIndex];
                    
                    if (!activity) {
                      return (
                        <div
                          key={`empty-${weekIndex}-${dayIndex}`}
                          className="w-3 h-3 bg-neutral-100 dark:bg-neutral-800 rounded-sm"
                        />
                      );
                    }

                    return (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`w-3 h-3 rounded-sm cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-primary transition-all ${getIntensityClass(activity)}`}
                        title={getTooltipText(activity)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 text-xs text-neutral-600 dark:text-neutral-400">
        <span>Less</span>
        <div className="flex gap-1 items-center">
          <div className="w-3 h-3 bg-neutral-200 dark:bg-neutral-700 rounded-sm"></div>
          <div className="w-3 h-3 bg-primary/30 rounded-sm"></div>
          <div className="w-3 h-3 bg-primary/60 rounded-sm"></div>
          <div className="w-3 h-3 bg-primary rounded-sm"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
}