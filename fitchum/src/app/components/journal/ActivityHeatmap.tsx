'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ActivityData {
  date: string;
  hasWorkout: boolean;
  duration?: number;
  type: 'workout' | 'rest' | 'none';
}

interface ActivityHeatmapProps {
  userId: string;
}

export default function ActivityHeatmap({ userId }: ActivityHeatmapProps) {
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);

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
        .select('date, completed, duration')
        .eq('user_id', userId)
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (journalError) throw journalError;

      // Create activity data for each day of the year
      const activities: ActivityData[] = [];
      const journalMap = new Map(journalEntries?.map(entry => [entry.date, { completed: entry.completed, duration: entry.duration }]) || []);

      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const journalData = journalMap.get(dateStr);
        const hasWorkout = journalData?.completed || false;
        
        // Determine if it's a rest day (assuming rest days are planned every 4th day or weekends)
        const dayOfWeek = d.getDay(); // 0 = Sunday, 6 = Saturday
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const isPastDay = d < new Date();
        
        let type: 'workout' | 'rest' | 'none' = 'none';
        if (hasWorkout) {
          type = 'workout';
        } else if (isPastDay && !hasWorkout) {
          // Auto-assign rest days for weekends or if no workout was logged
          type = isWeekend ? 'rest' : 'none';
        }
        
        activities.push({
          date: dateStr,
          hasWorkout,
          duration: journalData?.duration,
          type
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
      return 'bg-primary'; // Green for workouts
    } else if (activity.type === 'rest') {
      return 'bg-secondary'; // Orange for rest days
    }
    return 'bg-neutral-100 dark:bg-neutral-700'; // Gray for empty days
  };

  const getTooltipText = (activity: ActivityData) => {
    const date = new Date(activity.date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    
    if (activity.type === 'workout') {
      const duration = activity.duration ? ` (${activity.duration} min)` : '';
      return `${date}: Workout completed${duration}`;
    } else if (activity.type === 'rest') {
      return `${date}: Rest day`;
    }
    return `${date}: No activity`;
  };

  // Group activities by month for better organization
  const getMonthsFromActivities = () => {
    const months: { name: string; activities: ActivityData[] }[] = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Group by month
    const monthGroups: { [key: string]: ActivityData[] } = {};
    
    activityData.forEach(activity => {
      const date = new Date(activity.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;
      
      if (!monthGroups[monthKey]) {
        monthGroups[monthKey] = [];
      }
      monthGroups[monthKey].push(activity);
    });

    // Convert to array and sort by date
    Object.keys(monthGroups).sort().forEach(monthKey => {
      const [year, monthNum] = monthKey.split('-');
      const monthName = `${monthNames[parseInt(monthNum)]} ${year}`;
      months.push({
        name: monthName,
        activities: monthGroups[monthKey]
      });
    });

    return months.slice(-12); // Show last 12 months
  };

  const months = getMonthsFromActivities();
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  if (loading) {
    return (
      <div className="animate-pulse bg-neutral-200 dark:bg-neutral-700 rounded-2xl h-64 w-full"></div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl p-4 sm:p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-dark dark:text-neutral-light mb-2">
          Activity Heatmap
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
          Your workout consistency over the past year
        </p>
      </div>

      {/* Mobile: Show weekly streaks with better UX */}
      <div className="block sm:hidden">
        <div className="space-y-4">
          {/* Recent weeks overview */}
          {months.slice(-2).map((month) => {
            // Group month activities into weeks
            const weeks: ActivityData[][] = [];
            let currentWeek: ActivityData[] = [];
            
            month.activities.forEach((activity, index) => {
              const date = new Date(activity.date);
              const dayOfWeek = date.getDay();
              
              // If it's Sunday and we have a current week, push it and start new one
              if (dayOfWeek === 0 && currentWeek.length > 0) {
                weeks.push(currentWeek);
                currentWeek = [];
              }
              
              currentWeek.push(activity);
              
              // If it's the last item, push the current week
              if (index === month.activities.length - 1) {
                weeks.push(currentWeek);
              }
            });

            return (
              <div key={month.name} className="bg-neutral-50 dark:bg-neutral-700/50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
                  {month.name}
                </h3>
                <div className="space-y-3">
                  {weeks.slice(-4).map((week, weekIndex) => (
                    <div key={weekIndex} className="flex items-center gap-2">
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 w-16">
                        Week {weeks.length - 3 + weekIndex}
                      </span>
                      <div className="flex gap-1 flex-1">
                        {dayLabels.map((day, dayIndex) => {
                          const activity = week.find(a => new Date(a.date).getDay() === dayIndex);
                          return (
                            <div
                              key={dayIndex}
                              className={`flex-1 h-8 rounded-md flex items-center justify-center text-xs font-medium transition-all ${
                                activity 
                                  ? getIntensityClass(activity) + ' text-white' 
                                  : 'bg-neutral-200 dark:bg-neutral-600 text-neutral-500'
                              }`}
                              title={activity ? getTooltipText(activity) : ''}
                            >
                              {day}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop: Show all months in a grid */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-4 gap-6">
          {months.map((month) => (
            <div key={month.name}>
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3 text-center">
                {month.name}
              </h3>
              <div className="grid grid-cols-7 gap-1">
                {/* Day labels */}
                {dayLabels.map((day) => (
                  <div key={day} className="text-xs text-neutral-500 dark:text-neutral-400 text-center font-medium mb-1">
                    {day}
                  </div>
                ))}
                
                {/* Fill empty cells at start of month */}
                {month.activities.length > 0 && 
                  Array.from({ length: new Date(month.activities[0].date).getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} className="w-4 h-4" />
                  ))
                }
                
                {/* Activity cells */}
                {month.activities.map((activity) => (
                  <div
                    key={activity.date}
                    className={`w-4 h-4 rounded-sm cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-primary transition-all ${getIntensityClass(activity)}`}
                    title={getTooltipText(activity)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded-sm"></div>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Workout</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-secondary rounded-sm"></div>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Rest Day</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-neutral-100 dark:bg-neutral-700 rounded-sm"></div>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">No Activity</span>
          </div>
        </div>
      </div>
    </div>
  );
}