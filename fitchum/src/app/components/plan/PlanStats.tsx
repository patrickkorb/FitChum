"use client"
import Card from '../ui/Card';
import { TrendingUp, Target, Calendar, Flame } from 'lucide-react';

interface PlanStatsProps {
  stats: {
    weeklyGoal: number;
    completedThisWeek: number;
    currentStreak: number;
    totalWorkouts: number;
    averageDuration: number;
  };
}

export default function PlanStats({ stats }: PlanStatsProps) {
  const progressPercentage: number = Math.round((stats.completedThisWeek / stats.weeklyGoal) * 100);
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Weekly Progress */}
      <Card className="col-span-2 sm:col-span-1">
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg sm:rounded-xl">
              <Target className="text-primary" size={16} />
            </div>
            <div>
              <div className="text-xs sm:text-sm text-neutral-dark/60 dark:text-neutral-light/60">
                Wochenziel
              </div>
              <div className="text-base sm:text-lg font-bold text-neutral-dark dark:text-neutral-light">
                {stats.completedThisWeek}/{stats.weeklyGoal}
              </div>
            </div>
          </div>
          
          <div className="space-y-1 sm:space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-neutral-dark/70 dark:text-neutral-light/70">Fortschritt</span>
              <span className="font-medium text-neutral-dark dark:text-neutral-light">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-neutral-dark/10 dark:bg-neutral-light/10 rounded-full h-1.5 sm:h-2">
              <div
                className="bg-primary h-1.5 sm:h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Current Streak */}
      <Card>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-secondary/10 rounded-lg sm:rounded-xl">
            <Flame className="text-secondary" size={16} />
          </div>
          <div>
            <div className="text-xs sm:text-sm text-neutral-dark/60 dark:text-neutral-light/60">
              Serie
            </div>
            <div className="text-base sm:text-lg font-bold text-neutral-dark dark:text-neutral-light">
              {stats.currentStreak}d
            </div>
          </div>
        </div>
      </Card>

      {/* Total Workouts */}
      <Card>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-accent/10 rounded-lg sm:rounded-xl">
            <TrendingUp className="text-accent" size={16} />
          </div>
          <div>
            <div className="text-xs sm:text-sm text-neutral-dark/60 dark:text-neutral-light/60">
              Total
            </div>
            <div className="text-base sm:text-lg font-bold text-neutral-dark dark:text-neutral-light">
              {stats.totalWorkouts}
            </div>
          </div>
        </div>
      </Card>

      {/* Average Duration */}
      <Card>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-neutral-dark/10 dark:bg-neutral-light/10 rounded-lg sm:rounded-xl">
            <Calendar className="text-neutral-dark dark:text-neutral-light" size={16} />
          </div>
          <div>
            <div className="text-xs sm:text-sm text-neutral-dark/60 dark:text-neutral-light/60">
              Ø Dauer
            </div>
            <div className="text-base sm:text-lg font-bold text-neutral-dark dark:text-neutral-light">
              {stats.averageDuration}m
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}