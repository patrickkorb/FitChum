'use client';

import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Zap, 
  Calendar,
  Award,
  Users,
  Trophy,
  Star,
  Heart,
  UserPlus,
  Sparkles,
  LucideIcon
} from 'lucide-react';
import Button from '../ui/Button';

// Demo data for non-authenticated users
const demoStats = {
  currentStreak: 12,
  maxStreak: 28,
  totalWorkouts: 156,
  avgDuration: 42
};

const demoInsights = [
  {
    title: '🔥 Amazing Streak!',
    message: 'You\'re on fire with a 12-day streak! Keep the momentum going!',
    type: 'positive' as const,
    icon: Zap,
    color: 'from-orange-400 to-red-500'
  },
  {
    title: '💪 Consistent Progress',
    message: '5 workouts this week shows your dedication to building a healthy habit!',
    type: 'positive' as const,
    icon: TrendingUp,
    color: 'from-green-400 to-emerald-500'
  },
  {
    title: '⏰ Quality Sessions',
    message: 'Average 42 minutes per workout shows your commitment to quality training!',
    type: 'positive' as const,
    icon: Award,
    color: 'from-indigo-400 to-purple-500'
  }
];

const demoAchievements = [
  {
    title: 'On Fire',
    description: 'Maintain a 3-day streak',
    icon: Zap,
    color: 'from-orange-500 to-red-500',
    unlocked: true
  },
  {
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: Calendar,
    color: 'from-green-500 to-emerald-600',
    unlocked: true
  },
  {
    title: 'Half Century',
    description: 'Complete 50 total workouts',
    icon: Trophy,
    color: 'from-green-500 to-teal-500',
    unlocked: true
  },
  {
    title: 'Century Club',
    description: 'Complete 100 total workouts',
    icon: Award,
    color: 'from-purple-500 to-pink-500',
    unlocked: true
  },
  {
    title: 'Time Keeper',
    description: 'Average 30+ minutes per workout',
    icon: Clock,
    color: 'from-indigo-500 to-blue-600',
    unlocked: true
  },
  {
    title: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: Star,
    color: 'from-purple-500 to-purple-600',
    unlocked: false
  }
];

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
            Track progress, celebrate achievements, stay motivated
          </p>
        </div>


        {/* Demo Progress Insights */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 relative">
          <div className="absolute top-4 right-4 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
            Demo Data
          </div>
          <div className="flex items-center gap-2 mb-6">
            <Heart className="w-5 h-5 text-pink-500" />
            <h3 className="text-xl font-bold text-neutral-dark dark:text-neutral-light">
              Your Progress Insights
            </h3>
          </div>

          <div className="space-y-4">
            {demoInsights.map((insight, index) => {
              const IconComponent = insight.icon;
              
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${insight.color} opacity-5 group-hover:opacity-10 transition-opacity duration-200`}></div>
                  
                  <div className="relative p-4 flex items-start gap-4">
                    <div className={`flex-shrink-0 p-2 rounded-lg bg-gradient-to-r ${insight.color}`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-neutral-dark dark:text-neutral-light mb-1">
                        {insight.title}
                      </h4>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                        {insight.message}
                      </p>
                    </div>
                    
                    <div className="flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      ✨ Great
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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

        {/* Demo Achievement Badges */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 relative">
          <div className="absolute top-4 right-4 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
            Demo Data
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-bold text-neutral-dark dark:text-neutral-light">
              Achievements Unlocked (5)
            </h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {demoAchievements.filter(a => a.unlocked).map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div
                  key={index}
                  className="relative group cursor-pointer"
                >
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${achievement.color} text-white transform transition-all duration-200 hover:scale-105 hover:shadow-lg`}>
                    <div className="flex flex-col items-center text-center space-y-2">
                      <IconComponent className="w-6 h-6" />
                      <div>
                        <h4 className="font-semibold text-sm">{achievement.title}</h4>
                        <p className="text-xs opacity-90">{achievement.description}</p>
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Next Achievement Preview */}
          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
            <h4 className="text-sm font-semibold text-neutral-dark dark:text-neutral-light mb-3">
              Next Achievement
            </h4>
            <div className="flex items-center gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 opacity-60">
                <Star className="w-5 h-5 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-neutral-dark dark:text-neutral-light">
                    Monthly Master
                  </h4>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    12/30
                  </span>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                  Maintain a 30-day streak
                </p>
                
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500"
                    style={{ width: '40%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Final CTA */}
        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-white/10"></div>
          <div className="relative">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Trophy className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Start Your Fitness Journey Today!</h2>
            </div>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Join thousands of fitness enthusiasts tracking their progress, earning achievements, and staying motivated with FitChum.
              Create your account to unlock personalized insights and connect with friends!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <Button
                  onClick={handleSignUp}
                  variant={"primary"}
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Create Free Account
              </Button>
              <div className="text-sm text-white/80">
                ✨ Free forever • No credit card required
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}