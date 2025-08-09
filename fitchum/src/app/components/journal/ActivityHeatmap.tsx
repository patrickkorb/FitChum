'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ActivityData {
  date: string;
  hasWorkout: boolean;
  duration?: number;
  type: 'workout' | 'none';
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
        
        activities.push({
          date: dateStr,
          hasWorkout,
          duration: journalData?.duration,
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
      // Different intensities based on duration
      if (activity.duration && activity.duration >= 60) {
        return 'bg-primary';
      } else if (activity.duration && activity.duration >= 30) {
        return 'bg-primary/70';
      } else {
        return 'bg-primary/40';
      }
    }
    return 'bg-neutral-100 dark:bg-neutral-700';
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
    }
    return `${date}: No workout`;
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

      {/* Mobile: Show 3 months at a time with horizontal scroll */}
      <div className="block sm:hidden">
        <div className="overflow-x-auto">
          <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
            {months.slice(-3).map((month) => (
              <div key={month.name} className="flex-shrink-0">
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2 text-center">
                  {month.name}
                </h3>
                <div className="grid grid-cols-7 gap-1">
                  {/* Day labels */}
                  {dayLabels.map((day) => (
                    <div key={day} className="text-xs text-neutral-500 dark:text-neutral-400 text-center font-medium">
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
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <span className="text-xs text-neutral-600 dark:text-neutral-400">Less active</span>
        <div className="flex gap-1 items-center">
          <div className="w-3 h-3 bg-neutral-100 dark:bg-neutral-700 rounded-sm"></div>
          <div className="w-3 h-3 bg-primary/40 rounded-sm"></div>
          <div className="w-3 h-3 bg-primary/70 rounded-sm"></div>
          <div className="w-3 h-3 bg-primary rounded-sm"></div>
        </div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">More active</span>
      </div>

      <div className="mt-2 text-center">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Color intensity based on workout duration
        </p>
      </div>
    </div>
  );
}