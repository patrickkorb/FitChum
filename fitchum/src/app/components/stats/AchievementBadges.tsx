'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import AllAchievementsModal from './AllAchievementsModal';
import Button from '../ui/Button';
import ConfettiCelebration, { useConfetti } from '../ui/Confetti';
import { 
  Award, 
  Flame, 
  Target, 
  Calendar, 
  Clock, 
  TrendingUp,
  Star,
  Zap,
  Trophy,
  Medal,
  Eye
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  requirement: number;
  userValue: number;
  unlocked: boolean;
  category: 'streak' | 'workouts' | 'consistency' | 'duration';
}

interface AchievementBadgesProps {
  userId: string;
  userStats: {
    currentStreak: number;
    maxStreak: number;
    totalWorkouts: number;
    avgDuration: number;
  } | null;
}

export default function AchievementBadges({ userId, userStats }: AchievementBadgesProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllModal, setShowAllModal] = useState(false);
  const previousUnlockedCount = useRef<number>(0);
  const { trigger, type, key, celebrate, reset } = useConfetti();
  
  const supabase = createClient();

  useEffect(() => {
    if (userStats) {
      calculateAchievements();
    }
  }, [userId, userStats]);

  const calculateAchievements = async () => {
    setLoading(true);
    
    try {
      // Get additional data for consistency achievements
      const { data: journals } = await supabase
        .from('journal_entries')
        .select('created_at')
        .eq('user_id', userId)
        .order('created_at');

      let weeklyConsistency = 0;
      let monthlyConsistency = 0;
      
      if (journals) {
        // Calculate weekly consistency (workouts in last 4 weeks)
        const fourWeeksAgo = new Date();
        fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
        const recentWorkouts = journals.filter(j => new Date(j.created_at) >= fourWeeksAgo).length;
        weeklyConsistency = recentWorkouts;

        // Calculate monthly consistency (months with at least 8 workouts)
        const monthlyMap = new Map<string, number>();
        journals.forEach(j => {
          const monthKey = new Date(j.created_at).toISOString().slice(0, 7);
          monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + 1);
        });
        monthlyConsistency = Array.from(monthlyMap.values()).filter(count => count >= 8).length;
      }

      const allAchievements: Achievement[] = [
        // Streak Achievements
        {
          id: 'first-workout',
          title: 'Getting Started',
          description: 'Complete your first workout',
          icon: Target,
          color: 'from-blue-500 to-blue-600',
          requirement: 1,
          userValue: userStats?.totalWorkouts || 0,
          unlocked: (userStats?.totalWorkouts || 0) >= 1,
          category: 'workouts'
        },
        {
          id: 'streak-3',
          title: 'On Fire',
          description: 'Maintain a 3-day streak',
          icon: Flame,
          color: 'from-orange-500 to-red-500',
          requirement: 3,
          userValue: userStats?.maxStreak || 0,
          unlocked: (userStats?.maxStreak || 0) >= 3,
          category: 'streak'
        },
        {
          id: 'streak-7',
          title: 'Week Warrior',
          description: 'Maintain a 7-day streak',
          icon: Calendar,
          color: 'from-green-500 to-emerald-600',
          requirement: 7,
          userValue: userStats?.maxStreak || 0,
          unlocked: (userStats?.maxStreak || 0) >= 7,
          category: 'streak'
        },
        {
          id: 'streak-14',
          title: 'Fortnight Fighter',
          description: 'Maintain a 14-day streak',
          icon: Zap,
          color: 'from-yellow-500 to-amber-600',
          requirement: 14,
          userValue: userStats?.maxStreak || 0,
          unlocked: (userStats?.maxStreak || 0) >= 14,
          category: 'streak'
        },
        {
          id: 'streak-30',
          title: 'Monthly Master',
          description: 'Maintain a 30-day streak',
          icon: Star,
          color: 'from-purple-500 to-purple-600',
          requirement: 30,
          userValue: userStats?.maxStreak || 0,
          unlocked: (userStats?.maxStreak || 0) >= 30,
          category: 'streak'
        },
        {
          id: 'streak-100',
          title: 'Century Crusher',
          description: 'Maintain a 100-day streak',
          icon: Trophy,
          color: 'from-yellow-400 to-yellow-600',
          requirement: 100,
          userValue: userStats?.maxStreak || 0,
          unlocked: (userStats?.maxStreak || 0) >= 100,
          category: 'streak'
        },
        
        // Workout Count Achievements
        {
          id: 'workouts-10',
          title: 'Double Digits',
          description: 'Complete 10 total workouts',
          icon: TrendingUp,
          color: 'from-blue-500 to-cyan-500',
          requirement: 10,
          userValue: userStats?.totalWorkouts || 0,
          unlocked: (userStats?.totalWorkouts || 0) >= 10,
          category: 'workouts'
        },
        {
          id: 'workouts-50',
          title: 'Half Century',
          description: 'Complete 50 total workouts',
          icon: Medal,
          color: 'from-green-500 to-teal-500',
          requirement: 50,
          userValue: userStats?.totalWorkouts || 0,
          unlocked: (userStats?.totalWorkouts || 0) >= 50,
          category: 'workouts'
        },
        {
          id: 'workouts-100',
          title: 'Century Club',
          description: 'Complete 100 total workouts',
          icon: Award,
          color: 'from-purple-500 to-pink-500',
          requirement: 100,
          userValue: userStats?.totalWorkouts || 0,
          unlocked: (userStats?.totalWorkouts || 0) >= 100,
          category: 'workouts'
        },
        {
          id: 'workouts-365',
          title: 'Annual Athlete',
          description: 'Complete 365 total workouts',
          icon: Trophy,
          color: 'from-yellow-400 to-orange-500',
          requirement: 365,
          userValue: userStats?.totalWorkouts || 0,
          unlocked: (userStats?.totalWorkouts || 0) >= 365,
          category: 'workouts'
        },

        // Duration Achievements
        {
          id: 'duration-30',
          title: 'Time Keeper',
          description: 'Average 30+ minutes per workout',
          icon: Clock,
          color: 'from-indigo-500 to-blue-600',
          requirement: 30,
          userValue: userStats?.avgDuration || 0,
          unlocked: (userStats?.avgDuration || 0) >= 30,
          category: 'duration'
        },
        {
          id: 'duration-60',
          title: 'Hour Master',
          description: 'Average 60+ minutes per workout',
          icon: Clock,
          color: 'from-red-500 to-pink-600',
          requirement: 60,
          userValue: userStats?.avgDuration || 0,
          unlocked: (userStats?.avgDuration || 0) >= 60,
          category: 'duration'
        },

        // Consistency Achievements
        {
          id: 'weekly-consistency',
          title: 'Weekly Warrior',
          description: 'Complete 12+ workouts in 4 weeks',
          icon: Calendar,
          color: 'from-green-400 to-emerald-500',
          requirement: 12,
          userValue: weeklyConsistency,
          unlocked: weeklyConsistency >= 12,
          category: 'consistency'
        },
        {
          id: 'monthly-consistency',
          title: 'Consistent Champion',
          description: 'Have 3+ months with 8+ workouts',
          icon: Star,
          color: 'from-purple-400 to-purple-600',
          requirement: 3,
          userValue: monthlyConsistency,
          unlocked: monthlyConsistency >= 3,
          category: 'consistency'
        }
      ];

      // Check if new achievements were unlocked
      const currentUnlockedCount = allAchievements.filter(a => a.unlocked).length;
      
      // Only trigger confetti if we have achievements and this isn't the initial load
      if (previousUnlockedCount.current > 0 && currentUnlockedCount > previousUnlockedCount.current) {
        celebrate('achievement');
      }
      
      previousUnlockedCount.current = currentUnlockedCount;
      setAchievements(allAchievements);
    } catch (error) {
      console.error('Error calculating achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const nextAchievements = achievements
    .filter(a => !a.unlocked)
    .sort((a, b) => a.requirement - b.requirement)
    .slice(0, 3);

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-24 bg-neutral-200 dark:bg-neutral-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-bold text-neutral-dark dark:text-neutral-light">
                  Achievements Unlocked ({unlockedAchievements.length})
                </h3>
              </div>
              <Button
                onClick={() => setShowAllModal(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Eye size={16} />
                <span className="hidden sm:inline">Show All</span>
              </Button>
            </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {unlockedAchievements.map((achievement) => {
              const IconComponent = achievement.icon;
              return (
                <div
                  key={achievement.id}
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
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Next Achievements */}
      {nextAchievements.length > 0 && (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-neutral-dark dark:text-neutral-light">
                Next Achievements
              </h3>
            </div>
            {unlockedAchievements.length === 0 && (
              <Button
                onClick={() => setShowAllModal(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Eye size={16} />
                <span className="hidden sm:inline">Show All</span>
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            {nextAchievements.map((achievement) => {
              const IconComponent = achievement.icon;
              const progress = Math.min((achievement.userValue / achievement.requirement) * 100, 100);
              
              return (
                <div
                  key={achievement.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
                >
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${achievement.color} opacity-60`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-neutral-dark dark:text-neutral-light truncate">
                        {achievement.title}
                      </h4>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-2">
                        {achievement.userValue}/{achievement.requirement}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                      {achievement.description}
                    </p>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${achievement.color} transition-all duration-500`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Show All Button if no unlocked achievements */}
      {unlockedAchievements.length === 0 && nextAchievements.length === 0 && (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 text-center">
          <Target className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
          <h3 className="text-lg font-bold text-neutral-dark dark:text-neutral-light mb-2">
            Ready to Achieve?
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Start working out to unlock your first achievements!
          </p>
          <Button
            onClick={() => setShowAllModal(true)}
            variant="primary"
            className="flex items-center gap-2 mx-auto"
          >
            <Eye size={16} />
            View All Achievements
          </Button>
        </div>
      )}
    </div>
    
    <AllAchievementsModal
      isOpen={showAllModal}
      onClose={() => setShowAllModal(false)}
      achievements={achievements}
    />
    
    <ConfettiCelebration 
      key={key}
      trigger={trigger}
      type={type}
      onComplete={reset}
    />
  </>
  );
}