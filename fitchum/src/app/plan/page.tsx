'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getUserWorkoutPlan } from '@/lib/workoutPlan';
import Onboarding from '@/app/plan/Onboarding';
import PlanOverview from '@/app/components/plan/PlanOverview';

export default function Plan() {
    const [hasPlan, setHasPlan] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    const supabase = createClient();

    useEffect(() => {
        const checkForExistingPlan = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const plan = await getUserWorkoutPlan(user.id);
                    setHasPlan(!!plan);
                }
            } catch (error) {
                console.error('Error checking for existing plan:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkForExistingPlan();
    }, [supabase.auth]);

    const handlePlanCompleted = () => {
        setHasPlan(true);
    };

    const handleEditPlan = () => {
        setHasPlan(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] px-4">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-neutral-dark/70 dark:text-neutral-light/70">
                        Loading your plan...
                    </p>
                </div>
            </div>
        );
    }

    if (!hasPlan) {
        return <Onboarding onComplete={handlePlanCompleted} />;
    }

    return <PlanOverview onEditPlan={handleEditPlan} />;
}