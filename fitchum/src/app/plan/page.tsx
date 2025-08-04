"use client"
import { useState, useEffect } from 'react';
import Onboarding from "@/app/plan/Onboarding";
import PlanOverview from "@/app/components/plan/PlanOverview";

export default function Plan() {
    const [hasPlan, setHasPlan] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate checking if user has a plan (in real app: check localStorage/API)
        const checkForExistingPlan = () => {
            const existingPlan = localStorage.getItem('fitchum-plan');
            setHasPlan(!!existingPlan);
            setIsLoading(false);
        };

        // Small delay to simulate loading
        setTimeout(checkForExistingPlan, 500);
    }, []);

    const handlePlanCompleted = (planData: any) => {
        // Save plan data (in real app: save to API)
        localStorage.setItem('fitchum-plan', JSON.stringify(planData));
        setHasPlan(true);
    };

    const handleEditPlan = () => {
        // Allow user to edit their plan
        setHasPlan(false);
    };

    if (isLoading) {
        return (
            <div className="col-span-3 flex items-center justify-center min-h-[60vh]">
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