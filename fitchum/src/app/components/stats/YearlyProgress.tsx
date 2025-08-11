'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MonthlyData {
  month: number;
  year: number;
  workouts: number;
  avgDuration: number;
  maxStreak: number;
  totalDays: number;
}

interface YearlyProgressProps {
  userId: string;
}

export default function YearlyProgress({ userId }: YearlyProgressProps) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  useEffect(() => {
    fetchYearlyData();
  }, [selectedYear, userId]);

  const fetchYearlyData = async () => {
    setLoading(true);
    try {
      const { data: journals } = await supabase
        .from('journal_entries')
        .select('created_at, duration')
        .eq('user_id', userId)
        .gte('created_at', `${selectedYear}-01-01`)
        .lte('created_at', `${selectedYear}-12-31`)
        .order('created_at');

      if (journals) {
        // Group by month
        const monthlyMap = new Map<number, MonthlyData>();
        
        // Initialize all months
        for (let i = 0; i < 12; i++) {
          monthlyMap.set(i, {
            month: i,
            year: selectedYear,
            workouts: 0,
            avgDuration: 0,
            maxStreak: 0,
            totalDays: new Date(selectedYear, i + 1, 0).getDate()
          });
        }

        // Calculate monthly stats
        journals.forEach(journal => {
          const date = new Date(journal.created_at);
          const month = date.getMonth();
          const existing = monthlyMap.get(month)!;
          
          existing.workouts += 1;
          existing.avgDuration = journal.duration 
            ? (existing.avgDuration * (existing.workouts - 1) + journal.duration) / existing.workouts
            : existing.avgDuration;
        });

        setMonthlyData(Array.from(monthlyMap.values()));
      }
    } catch (error) {
      console.error('Error fetching yearly data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthCompletion = (monthData: MonthlyData) => {
    // Aim for 20 workouts per month as a good target
    const targetWorkouts = 20;
    return Math.min((monthData.workouts / targetWorkouts) * 100, 100);
  };

  const getComparisonTrend = (currentMonth: number) => {
    if (currentMonth === 0) return null;
    
    const current = monthlyData[currentMonth];
    const previous = monthlyData[currentMonth - 1];
    
    if (!current || !previous) return null;
    
    const currentScore = current.workouts;
    const previousScore = previous.workouts;
    
    if (currentScore > previousScore) return 'up';
    if (currentScore < previousScore) return 'down';
    return 'same';
  };

  const getTrendIcon = (trend: string | null) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-red-500" />;
      case 'same': return <Minus className="w-3 h-3 text-gray-500" />;
      default: return null;
    }
  };

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3"></div>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                <div className="h-20 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-neutral-dark dark:text-neutral-light">
          Yearly Progress
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedYear(prev => prev - 1)}
            className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          </button>
          <span className="font-semibold text-neutral-dark dark:text-neutral-light min-w-[4rem] text-center">
            {selectedYear}
          </span>
          <button
            onClick={() => setSelectedYear(prev => prev + 1)}
            disabled={selectedYear >= currentYear}
            className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>
      </div>

      {/* Monthly Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-3">
        {monthlyData.map((monthData, index) => {
          const completion = getMonthCompletion(monthData);
          const trend = getComparisonTrend(index);
          const isCurrentMonth = selectedYear === currentYear && index === currentMonth;
          
          return (
            <div
              key={index}
              className={`relative group cursor-pointer transition-all duration-200 hover:transform hover:scale-105 ${
                isCurrentMonth ? 'ring-2 ring-primary ring-opacity-50' : ''
              }`}
            >
              {/* Month Label */}
              <div className="text-center mb-2">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    {monthNames[index]}
                  </span>
                  {getTrendIcon(trend)}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-20 bg-neutral-100 dark:bg-neutral-700 rounded-lg overflow-hidden">
                <div
                  className={`absolute bottom-0 left-0 right-0 rounded-lg transition-all duration-500 ${
                    completion >= 80 
                      ? 'bg-gradient-to-t from-green-500 to-green-400'
                      : completion >= 50
                      ? 'bg-gradient-to-t from-primary to-primary/80'
                      : completion >= 25
                      ? 'bg-gradient-to-t from-yellow-500 to-yellow-400'
                      : completion > 0
                      ? 'bg-gradient-to-t from-red-500 to-red-400'
                      : 'bg-neutral-200 dark:bg-neutral-600'
                  }`}
                  style={{ height: `${Math.max(completion, 8)}%` }}
                />
                
                {/* Workout count */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white drop-shadow-md">
                    {monthData.workouts}
                  </span>
                </div>
              </div>

              {/* Completion percentage */}
              <div className="text-center mt-1">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {Math.round(completion)}%
                </span>
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                <div className="bg-neutral-dark dark:bg-neutral-light text-neutral-light dark:text-neutral-dark text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                  <div className="font-semibold">{monthNames[index]} {selectedYear}</div>
                  <div>{monthData.workouts} workouts</div>
                  {monthData.avgDuration > 0 && (
                    <div>{Math.round(monthData.avgDuration)}min avg</div>
                  )}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-neutral-dark dark:border-t-neutral-light"></div>
                </div>
              </div>

              {/* Current month indicator */}
              {isCurrentMonth && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-neutral-dark dark:text-neutral-light">
              {monthlyData.reduce((sum, month) => sum + month.workouts, 0)}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">Total Workouts</div>
          </div>
          <div>
            <div className="text-lg font-bold text-neutral-dark dark:text-neutral-light">
              {Math.round(monthlyData.reduce((sum, month) => sum + month.avgDuration, 0) / 12) || 0}m
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">Avg Duration</div>
          </div>
          <div>
            <div className="text-lg font-bold text-neutral-dark dark:text-neutral-light">
              {monthlyData.filter(month => month.workouts > 0).length}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">Active Months</div>
          </div>
          <div>
            <div className="text-lg font-bold text-neutral-dark dark:text-neutral-light">
              {Math.round((monthlyData.reduce((sum, month) => sum + getMonthCompletion(month), 0) / 12))}%
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">Year Progress</div>
          </div>
        </div>
      </div>
    </div>
  );
}