'use client';

import { useState, useEffect } from 'react';
import Onboarding from '@/app/plan/Onboarding';
import PlanOverview from '@/app/components/plan/PlanOverview';
import { WorkoutSplit } from '@/app/components/onboarding/WorkoutSplitSelection';
import { WorkoutFrequency } from '@/app/components/onboarding/FrequencySelection';
import { SelectedDays } from '@/app/components/onboarding/DaySelection';

type PlanData = {
    workoutSplit?: WorkoutSplit;
    frequency?: WorkoutFrequency;
    schedule?: SelectedDays;
};

export default function Plan() {
    const [hasPlan, setHasPlan] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkForExistingPlan = () => {
            const existingPlan = localStorage.getItem('fitchum-plan');
            setHasPlan(!!existingPlan);
            setIsLoading(false);
        };

        setTimeout(checkForExistingPlan, 500);
    }, []);

    const handlePlanCompleted = (planData: PlanData) => {
        localStorage.setItem('fitchum-plan', JSON.stringify(planData));
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
                        Plan wird geladen...
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