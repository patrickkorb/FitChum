'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Leaderboard from '../components/social/Leaderboard';
import ActivityFeed from '../components/social/ActivityFeed';

export default function Social() {
    const [userId, setUserId] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUserId(user?.id || null);
        };
        getUser();
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-dark dark:text-neutral-light mb-4">
                        Social Hub
                    </h1>
                    <p className="text-base sm:text-lg text-neutral-dark/70 dark:text-neutral-light/70 max-w-2xl mx-auto">
                        Connect with your fitness community, compete on leaderboards, and stay motivated by tracking everyone's progress.
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                    {/* Leaderboard Section */}
                    <div className="order-1 lg:order-1">
                        <div className="bg-neutral-light dark:bg-neutral-dark/50 rounded-2xl p-6 sm:p-8 shadow-lg border border-neutral-dark/10 dark:border-neutral-light/10">
                            <Leaderboard currentUserId={userId} />
                        </div>
                    </div>

                    {/* Activity Feed Section */}
                    <div className="order-2 lg:order-2">
                        <div className="bg-neutral-light dark:bg-neutral-dark/50 rounded-2xl p-6 sm:p-8 shadow-lg border border-neutral-dark/10 dark:border-neutral-light/10">
                            <ActivityFeed currentUserId={userId} />
                        </div>
                    </div>
                </div>

                {/* Call to Action Section */}
                <div className="mt-12 sm:mt-16 text-center">
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5 rounded-2xl p-6 sm:p-8 border border-primary/20 dark:border-primary/10">
                        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-dark dark:text-neutral-light mb-4">
                            Ready to Join the Competition?
                        </h2>
                        <p className="text-neutral-dark/70 dark:text-neutral-light/70 text-base sm:text-lg mb-6 max-w-2xl mx-auto">
                            Start logging your workouts to climb the leaderboard and inspire others in the FitChum community!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
                                Log Today's Workout
                            </button>
                            <button className="bg-transparent border-2 border-neutral-dark/20 dark:border-neutral-light/20 text-neutral-dark dark:text-neutral-light font-semibold py-3 px-6 rounded-xl hover:bg-neutral-dark/5 dark:hover:bg-neutral-light/5 transition-colors">
                                View My Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}