
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import ActivityHeatmap from '@/app/components/journal/ActivityHeatmap';

export default function LogPage() {
    const [user, setUser] = useState<{ id: string } | null>(null);
    const [loading, setLoading] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const { data: userData, error } = await supabase.auth.getUser();
            
            if (error || !userData.user) {
                console.error('No authenticated user found');
                return;
            }

            setUser({ id: userData.user.id });
        } catch (error) {
            console.error('Error checking auth:', error);
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

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] text-neutral-600 dark:text-neutral-400">
                Please log in to view your activity history.
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-6xl">
            <div className="space-y-6">
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-neutral-dark dark:text-neutral-light mb-2">
                        Your Fitness Journey
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                        Track your consistency and celebrate your progress
                    </p>
                </div>

                <ActivityHeatmap userId={user.id} />
            </div>
        </div>
    );
}