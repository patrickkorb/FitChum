'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getUserStats, UserStats } from '@/lib/userStats';
import ActivityHeatmap from '@/app/components/journal/ActivityHeatmap';
import YearlyProgress from '@/app/components/stats/YearlyProgress';
import AchievementBadges from '@/app/components/stats/AchievementBadges';
import ProgressInsights from '@/app/components/stats/ProgressInsights';
import DemoStats from '@/app/components/stats/DemoStats';
import { TrendingUp, Target, Clock, Zap, LucideIcon, Calendar } from 'lucide-react';

export default function StatsPage() {
    const [user, setUser] = useState<{ id: string } | null>(null);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        checkAuthAndLoadStats();
    }, []);

    const checkAuthAndLoadStats = async () => {
        try {
            const { data: userData, error } = await supabase.auth.getUser();
            
            if (error || !userData.user) {
                // User is not authenticated, we'll show demo stats
                setUser(null);
                setStats(null);
                setLoading(false);
                return;
            }

            setUser({ id: userData.user.id });
            
            // Load user stats
            const userStats = await getUserStats(userData.user.id);
            setStats(userStats);
        } catch (error) {
            console.error('Error loading stats:', error);
            // On error, also show demo stats
            setUser(null);
            setStats(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    // Show demo stats for non-authenticated users
    if (!user) {
        return <DemoStats />;
    }

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
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow">
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
    );

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="space-y-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-neutral-dark dark:text-neutral-light mb-2">
                        Your Fitness Journey
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                        Track progress, celebrate achievements, stay motivated
                    </p>
                </div>

                {/* Progress Insights */}
                <ProgressInsights userId={user.id} userStats={stats} />

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Current Streak"
                        value={stats?.currentStreak || 0}
                        subtitle={stats?.currentStreak === 1 ? "day" : "days"}
                        icon={Zap}
                        color="bg-primary"
                    />
                    
                    <StatCard
                        title="Best Streak"
                        value={stats?.maxStreak || 0}
                        subtitle="personal record"
                        icon={Target}
                        color="bg-secondary"
                    />
                    
                    <StatCard
                        title="Total Workouts"
                        value={stats?.totalWorkouts || 0}
                        subtitle="all time"
                        icon={TrendingUp}
                        color="bg-blue-600"
                    />
                    
                    <StatCard
                        title="Avg Duration"
                        value={stats?.avgDuration ? `${Math.round(stats.avgDuration)}m` : '0m'}
                        subtitle="per workout"
                        icon={Clock}
                        color="bg-purple-600"
                    />
                </div>

                {/* Yearly Progress Overview */}
                <YearlyProgress userId={user.id} />

                {/* Achievement Badges */}
                <AchievementBadges userId={user.id} userStats={stats} />

                {/* Activity Heatmap */}
                <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-primary" />
                        <h3 className="text-xl font-bold text-neutral-dark dark:text-neutral-light">
                            Activity Calendar
                        </h3>
                    </div>
                    <ActivityHeatmap userId={user.id} />
                </div>
            </div>
        </div>
    );
}