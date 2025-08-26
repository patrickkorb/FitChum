'use client';

import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  Target,
  Clock,
  Zap,
  Trophy,
  UserPlus,
  LucideIcon, Sparkles
} from 'lucide-react';
import Button from '../ui/Button';

// Demo data for non-authenticated users
const demoStats = {
  currentStreak: 12,
  maxStreak: 28,
  totalWorkouts: 156,
  avgDuration: 42
};



// Demo monthly data for the year
const demoMonthlyData = [
  { month: 'Jan', workouts: 18, completion: 90 },
  { month: 'Feb', workouts: 16, completion: 80 },
  { month: 'Mar', workouts: 22, completion: 110 },
  { month: 'Apr', workouts: 15, completion: 75 },
  { month: 'May', workouts: 20, completion: 100 },
  { month: 'Jun', workouts: 17, completion: 85 },
  { month: 'Jul', workouts: 19, completion: 95 },
  { month: 'Aug', workouts: 21, completion: 105 },
  { month: 'Sep', workouts: 14, completion: 70 },
  { month: 'Oct', workouts: 23, completion: 115 },
  { month: 'Nov', workouts: 18, completion: 90 },
  { month: 'Dec', workouts: 12, completion: 60 }
];

export default function DemoStats() {
  const router = useRouter();

  const handleSignUp = () => {
    router.push('/auth/login');
  };

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    color 
  }: { 
    title: string; 
    value: string | number; 
    subtitle: string; 
    icon: LucideIcon; 
    color: string; 
  }) => (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-50"></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon size={24} className="text-white" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {title}
          </h3>
          <p className="text-3xl font-bold text-neutral-dark dark:text-neutral-light">
            {value}
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="space-y-8">
        {/* Header with Demo Badge */}
        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Demo Preview</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-dark dark:text-neutral-light mb-2">
            Your Fitness Journey
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">
            Track progress, analyze patterns, stay motivated
          </p>
        </div>



        {/* Demo Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Current Streak"
            value={demoStats.currentStreak}
            subtitle="days"
            icon={Zap}
            color="bg-primary"
          />
          
          <StatCard
            title="Best Streak"
            value={demoStats.maxStreak}
            subtitle="personal record"
            icon={Target}
            color="bg-secondary"
          />
          
          <StatCard
            title="Total Workouts"
            value={demoStats.totalWorkouts}
            subtitle="all time"
            icon={TrendingUp}
            color="bg-blue-600"
          />
          
          <StatCard
            title="Avg Duration"
            value={`${demoStats.avgDuration}m`}
            subtitle="per workout"
            icon={Clock}
            color="bg-purple-600"
          />
        </div>

        {/* Demo Yearly Progress */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 relative">
          <div className="absolute top-4 right-4 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
            Demo Data
          </div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-neutral-dark dark:text-neutral-light">
              Yearly Progress
            </h3>
            <span className="font-semibold text-neutral-dark dark:text-neutral-light">
              2024
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-3">
            {demoMonthlyData.map((monthData, index) => {
              const completion = Math.min(monthData.completion, 100);
              
              return (
                <div key={index} className="relative group cursor-pointer transition-all duration-200 hover:transform hover:scale-105">
                  <div className="text-center mb-2">
                    <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                      {monthData.month}
                    </span>
                  </div>

                  <div className="relative h-20 bg-neutral-100 dark:bg-neutral-700 rounded-lg overflow-hidden">
                    <div
                      className={`absolute bottom-0 left-0 right-0 rounded-lg transition-all duration-500 ${
                        completion >= 80 
                          ? 'bg-gradient-to-t from-green-500 to-green-400'
                          : completion >= 50
                          ? 'bg-gradient-to-t from-primary to-primary/80'
                          : completion >= 25
                          ? 'bg-gradient-to-t from-yellow-500 to-yellow-400'
                          : 'bg-gradient-to-t from-red-500 to-red-400'
                      }`}
                      style={{ height: `${Math.max(completion, 8)}%` }}
                    />
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-white drop-shadow-md">
                        {monthData.workouts}
                      </span>
                    </div>
                  </div>

                  <div className="text-center mt-1">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {Math.round(completion)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-neutral-dark dark:text-neutral-light">215</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">Total Workouts</div>
              </div>
              <div>
                <div className="text-lg font-bold text-neutral-dark dark:text-neutral-light">42m</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">Avg Duration</div>
              </div>
              <div>
                <div className="text-lg font-bold text-neutral-dark dark:text-neutral-light">12</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">Active Months</div>
              </div>
              <div>
                <div className="text-lg font-bold text-neutral-dark dark:text-neutral-light">89%</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">Year Progress</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}