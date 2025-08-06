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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Weekly Progress */}
      <Card>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Target className="text-primary" size={20} />
            </div>
            <div>
              <div className="text-sm text-neutral-dark/60 dark:text-neutral-light/60">
                Wochenziel
              </div>
              <div className="text-lg font-bold text-neutral-dark dark:text-neutral-light">
                {stats.completedThisWeek}/{stats.weeklyGoal}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-dark/70 dark:text-neutral-light/70">Fortschritt</span>
              <span className="font-medium text-neutral-dark dark:text-neutral-light">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-neutral-dark/10 dark:bg-neutral-light/10 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Current Streak */}
      <Card>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary/10 rounded-xl">
            <Flame className="text-secondary" size={20} />
          </div>
          <div>
            <div className="text-sm text-neutral-dark/60 dark:text-neutral-light/60">
              Aktuelle Serie
            </div>
            <div className="text-lg font-bold text-neutral-dark dark:text-neutral-light">
              {stats.currentStreak} Tage
            </div>
          </div>
        </div>
      </Card>

      {/* Total Workouts */}
      <Card>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-xl">
            <TrendingUp className="text-accent" size={20} />
          </div>
          <div>
            <div className="text-sm text-neutral-dark/60 dark:text-neutral-light/60">
              Gesamt Workouts
            </div>
            <div className="text-lg font-bold text-neutral-dark dark:text-neutral-light">
              {stats.totalWorkouts}
            </div>
          </div>
        </div>
      </Card>

      {/* Average Duration */}
      <Card>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neutral-dark/10 dark:bg-neutral-light/10 rounded-xl">
            <Calendar className="text-neutral-dark dark:text-neutral-light" size={20} />
          </div>
          <div>
            <div className="text-sm text-neutral-dark/60 dark:text-neutral-light/60">
              Ø Dauer
            </div>
            <div className="text-lg font-bold text-neutral-dark dark:text-neutral-light">
              {stats.averageDuration} Min
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}