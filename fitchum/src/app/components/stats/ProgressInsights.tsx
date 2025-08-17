'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  TrendingUp, 
  Heart, 
  Target, 
  Calendar,
  Zap,
  Award,
  Sun,
  Moon,
  Coffee
} from 'lucide-react';

interface Insight {
  id: string;
  title: string;
  message: string;
  type: 'positive' | 'motivational' | 'tip' | 'achievement';
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}

interface ProgressInsightsProps {
  userId: string;
  userStats: {
    currentStreak: number;
    maxStreak: number;
    totalWorkouts: number;
    avgDuration: number;
  } | null;
}

export default function ProgressInsights({ userId, userStats }: ProgressInsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  useEffect(() => {
    if (userStats) {
      generateInsights();
    }
  }, [userId, userStats]);

  const generateInsights = async () => {
    setLoading(true);
    
    try {
      const { data: recentJournals } = await supabase
        .from('journal_entries')
        .select('created_at, duration, difficulty')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(30);

      const generatedInsights: Insight[] = [];

      if (recentJournals && userStats) {
        // Analyze recent trends
        const last7Days = recentJournals.slice(0, 7);
        
        // Streak insights
        if (userStats.currentStreak > 0) {
          if (userStats.currentStreak >= 7) {
            generatedInsights.push({
              id: 'great-streak',
              title: '🔥 Amazing Streak!',
              message: `You're on fire with a ${userStats.currentStreak}-day streak! Keep the momentum going!`,
              type: 'positive',
              icon: Zap,
              color: 'from-orange-400 to-red-500'
            });
          } else if (userStats.currentStreak >= 3) {
            generatedInsights.push({
              id: 'good-streak',
              title: '💪 Building Momentum',
              message: `${userStats.currentStreak} days strong! You're building a great habit!`,
              type: 'positive',
              icon: TrendingUp,
              color: 'from-green-400 to-emerald-500'
            });
          } else {
            generatedInsights.push({
              id: 'starting-streak',
              title: '🌱 Great Start',
              message: `Day ${userStats.currentStreak} of your streak! Every journey starts with a single step.`,
              type: 'motivational',
              icon: Target,
              color: 'from-blue-400 to-blue-600'
            });
          }
        } else {
          generatedInsights.push({
            id: 'comeback',
            title: '💚 Ready for a Comeback?',
            message: 'Today is a perfect day to start a new streak. Your body is ready!',
            type: 'motivational',
            icon: Heart,
            color: 'from-pink-400 to-red-400'
          });
        }

        // Weekly performance
        if (last7Days.length >= 4) {
          generatedInsights.push({
            id: 'weekly-strong',
            title: '📅 Consistent Week',
            message: `${last7Days.length} workouts this week! You're showing great consistency.`,
            type: 'positive',
            icon: Calendar,
            color: 'from-purple-400 to-purple-600'
          });
        } else if (last7Days.length >= 2) {
          generatedInsights.push({
            id: 'weekly-good',
            title: '⚡ Making Progress',
            message: `${last7Days.length} workouts this week. Try to add one more to boost your momentum!`,
            type: 'motivational',
            icon: TrendingUp,
            color: 'from-yellow-400 to-orange-500'
          });
        }

        // Duration insights
        if (userStats.avgDuration > 0) {
          if (userStats.avgDuration >= 45) {
            generatedInsights.push({
              id: 'duration-excellent',
              title: '⏰ Quality Sessions',
              message: `Average ${Math.round(userStats.avgDuration)} minutes per workout shows your dedication to quality!`,
              type: 'positive',
              icon: Award,
              color: 'from-indigo-400 to-purple-500'
            });
          } else if (userStats.avgDuration >= 30) {
            generatedInsights.push({
              id: 'duration-good',
              title: '🎯 Solid Workouts',
              message: `${Math.round(userStats.avgDuration)} minutes average is great! Quality over quantity always wins.`,
              type: 'positive',
              icon: Target,
              color: 'from-green-400 to-blue-400'
            });
          }
        }

        // Milestone insights
        if (userStats.totalWorkouts >= 100) {
          generatedInsights.push({
            id: 'century-club',
            title: '🏆 Century Club Member!',
            message: `${userStats.totalWorkouts} total workouts! You're in the elite century club!`,
            type: 'achievement',
            icon: Award,
            color: 'from-yellow-400 to-yellow-600'
          });
        } else if (userStats.totalWorkouts >= 50) {
          generatedInsights.push({
            id: 'halfway-hero',
            title: '🌟 Halfway Hero',
            message: `${userStats.totalWorkouts} workouts completed! You're more than halfway to the century club!`,
            type: 'positive',
            icon: TrendingUp,
            color: 'from-cyan-400 to-blue-500'
          });
        } else if (userStats.totalWorkouts >= 10) {
          generatedInsights.push({
            id: 'double-digits',
            title: '🚀 Double Digits!',
            message: `${userStats.totalWorkouts} workouts and counting! You're building something special.`,
            type: 'positive',
            icon: Target,
            color: 'from-green-400 to-emerald-500'
          });
        }

        // Time-based motivational messages
        const hour = new Date().getHours();
        if (hour < 12) {
          generatedInsights.push({
            id: 'morning-motivation',
            title: '🌅 Morning Energy',
            message: 'Morning workouts set a powerful tone for the entire day ahead!',
            type: 'tip',
            icon: Sun,
            color: 'from-yellow-300 to-orange-400'
          });
        } else if (hour >= 18) {
          generatedInsights.push({
            id: 'evening-boost',
            title: '🌙 Evening Power',
            message: 'Evening workouts are perfect for releasing the day\'s stress and tension.',
            type: 'tip',
            icon: Moon,
            color: 'from-indigo-400 to-purple-500'
          });
        } else {
          generatedInsights.push({
            id: 'midday-momentum',
            title: '☕ Midday Boost',
            message: 'A midday workout can energize your afternoon and boost productivity!',
            type: 'tip',
            icon: Coffee,
            color: 'from-amber-400 to-orange-500'
          });
        }

        // Record achievements
        if (userStats.maxStreak > userStats.currentStreak && userStats.maxStreak >= 7) {
          generatedInsights.push({
            id: 'personal-record',
            title: '🎖️ Personal Best',
            message: `Your record streak is ${userStats.maxStreak} days. You've done it before, you can do it again!`,
            type: 'motivational',
            icon: Award,
            color: 'from-purple-400 to-pink-500'
          });
        }
      }

      // Always include at least one general motivational message
      if (generatedInsights.length < 3) {
        const motivationalMessages = [
          {
            id: 'general-1',
            title: '💪 You\'re Stronger Than Yesterday',
            message: 'Every workout makes you stronger, both physically and mentally.',
            type: 'motivational' as const,
            icon: Heart,
            color: 'from-pink-400 to-red-400'
          },
          {
            id: 'general-2',
            title: '🎯 Progress Not Perfection',
            message: 'Focus on consistent progress rather than perfect performance.',
            type: 'tip' as const,
            icon: Target,
            color: 'from-blue-400 to-cyan-500'
          },
          {
            id: 'general-3',
            title: '🚀 Momentum is Everything',
            message: 'Small consistent actions create unstoppable momentum over time.',
            type: 'motivational' as const,
            icon: TrendingUp,
            color: 'from-green-400 to-emerald-500'
          }
        ];
        
        generatedInsights.push(...motivationalMessages.slice(0, 3 - generatedInsights.length));
      }

      setInsights(generatedInsights.slice(0, 4)); // Show max 4 insights
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3"></div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-4 border rounded-xl">
                <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl p-4 sm:p-6 border border-neutral-200 dark:border-neutral-700">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
        <h3 className="text-lg sm:text-xl font-bold text-neutral-dark dark:text-neutral-light">
          Progress Insights
        </h3>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => {
          const IconComponent = insight.icon;
          
          return (
            <div
              key={insight.id}
              className="group relative overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700 transition-all duration-200"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${insight.color} opacity-5`}></div>
              
              <div className="relative p-3 sm:p-4">
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 p-1.5 sm:p-2 rounded-lg bg-gradient-to-r ${insight.color}`}>
                    <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-sm sm:text-base text-neutral-dark dark:text-neutral-light leading-tight">
                        {insight.title}
                      </h4>
                      <div className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
                        insight.type === 'positive' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                        insight.type === 'achievement' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                        insight.type === 'tip' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                        'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                      }`}>
                        {insight.type === 'positive' ? '✨' :
                         insight.type === 'achievement' ? '🏆' :
                         insight.type === 'tip' ? '💡' : '🚀'}
                      </div>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed mt-1">
                      {insight.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}