"use client"
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { createWorkoutPlan } from '@/lib/workoutPlan';
import Button from '../components/ui/Button';
import AuthModal from '../components/ui/AuthModal';
import WorkoutSplitSelection, { WorkoutSplit } from '../components/onboarding/WorkoutSplitSelection';
import FrequencySelection, { WorkoutFrequency } from '../components/onboarding/FrequencySelection';
import DaySelection, { SelectedDays } from '../components/onboarding/DaySelection';
import { ChevronLeft, ChevronRight, Check, Target } from 'lucide-react';

interface OnboardingData {
  workoutSplit?: WorkoutSplit;
  frequency?: WorkoutFrequency;
  schedule?: SelectedDays;
}

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const totalSteps: number = 3;
  
  const supabase = createClient();

  const handleSplitSelect = (split: WorkoutSplit): void => {
    setOnboardingData(prev => ({ ...prev, workoutSplit: split }));
  };

  const handleFrequencySelect = (frequency: WorkoutFrequency): void => {
    setOnboardingData(prev => ({ ...prev, frequency }));
  };

  const handleScheduleSelect = (schedule: SelectedDays): void => {
    setOnboardingData(prev => ({ ...prev, schedule }));
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!onboardingData.workoutSplit;
      case 2:
        return !!onboardingData.frequency;
      case 3:
        return !!onboardingData.schedule && 
               (onboardingData.schedule.pattern === 'interval' || 
                onboardingData.schedule.days.length === onboardingData.frequency?.days);
      default:
        return false;
    }
  };

  const handleNext = (): void => {
    if (currentStep < totalSteps && canProceed()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = (): void => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async (): Promise<void> => {
    if (!onboardingData.workoutSplit || !onboardingData.frequency || !onboardingData.schedule) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Show auth modal instead of alert
        setShowAuthModal(true);
        setIsSubmitting(false);
        return;
      }

      const planData = {
        splitType: onboardingData.workoutSplit.id as 'ppl' | 'upper_lower' | 'full_body' | 'ppl_arnold' | 'ppl_ul',
        frequency: onboardingData.frequency.days,
        selectedDays: onboardingData.schedule.days,
        isFlexible: onboardingData.schedule.pattern === 'interval'
      };

      const success = await createWorkoutPlan(user.id, planData);
      
      if (success) {
        onComplete();
      } else {
        alert('Failed to create workout plan. Please try again.');
      }
    } catch (error) {
      console.error('Error creating workout plan:', error);
      if (error instanceof Error && error.message === 'User not authenticated') {
        setShowAuthModal(true);
      } else {
        alert('An error occurred while creating your workout plan. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <WorkoutSplitSelection
            onSelect={handleSplitSelect}
            selectedSplit={onboardingData.workoutSplit}
          />
        );
      case 2:
        return (
          <FrequencySelection
            onSelect={handleFrequencySelect}
            selectedFrequency={onboardingData.frequency}
          />
        );
      case 3:
        return onboardingData.frequency && onboardingData.workoutSplit ? (
          <DaySelection
            frequency={onboardingData.frequency.days}
            splitType={onboardingData.workoutSplit.id}
            onSelect={handleScheduleSelect}
            selectedDays={onboardingData.schedule}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Almost There! 🎯"
        message="Your personalized workout plan is ready! Create an account to save it and start your fitness journey."
      />
      
      <div className="px-4 sm:px-8 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Target className="text-primary" size={24} />
            <h1 className="text-2xl sm:text-4xl font-bold text-neutral-dark dark:text-neutral-light">
              Workout Plan Setup
            </h1>
          </div>
          <p className="text-neutral-dark/70 dark:text-neutral-light/70 text-base sm:text-lg px-4">
            Let&apos;s create your perfect workout plan
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8 px-2">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm font-medium text-neutral-dark dark:text-neutral-light">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-xs sm:text-sm text-neutral-dark/60 dark:text-neutral-light/60">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-neutral-dark/10 dark:bg-neutral-light/10 rounded-full h-2 sm:h-3">
            <div
              className="bg-primary h-2 sm:h-3 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-6 sm:mb-8">
          {renderCurrentStep()}
        </div>

        {/* Navigation */}
        <div className="space-y-4">
          {/* Progress Dots - Mobile */}
          <div className="flex justify-center gap-2 sm:hidden">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  i + 1 === currentStep
                    ? 'bg-primary scale-125'
                    : i + 1 < currentStep
                    ? 'bg-primary/70'
                    : 'bg-neutral-dark/20 dark:bg-neutral-light/20'
                }`}
              />
            ))}
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`w-full sm:w-auto ${currentStep === 1 ? 'invisible' : ''}`}
              size="md"
            >
              <ChevronLeft size={18} />
              <span className="hidden sm:inline">Zurück</span>
              <span className="sm:hidden">Zurück</span>
            </Button>

            {/* Progress Dots - Desktop */}
            <div className="hidden sm:flex gap-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    i + 1 === currentStep
                      ? 'bg-primary scale-125'
                      : i + 1 < currentStep
                      ? 'bg-primary/70'
                      : 'bg-neutral-dark/20 dark:bg-neutral-light/20'
                  }`}
                />
              ))}
            </div>

            {currentStep === totalSteps ? (
              <Button
                onClick={handleComplete}
                disabled={!canProceed() || isSubmitting}
                className="bg-secondary hover:bg-secondary/90 w-full sm:w-auto"
                size="md"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Creating Plan...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Complete Setup
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="w-full sm:w-auto"
                size="md"
              >
                <span className="hidden sm:inline">Weiter</span>
                <span className="sm:hidden">Weiter</span>
                <ChevronRight size={18} />
              </Button>
            )}
          </div>
        </div>

        {/* Summary (only on last step) */}
        {currentStep === totalSteps && onboardingData.workoutSplit && onboardingData.frequency && (
          <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-neutral-dark/5 dark:bg-neutral-light/5 rounded-xl sm:rounded-2xl">
            <h3 className="font-bold text-base sm:text-lg text-neutral-dark dark:text-neutral-light mb-3 sm:mb-4">
              Your Workout Plan Summary:
            </h3>
            <div className="space-y-2 text-sm sm:text-base text-neutral-dark/80 dark:text-neutral-light/80">
              <p><strong>Split:</strong> {onboardingData.workoutSplit.name}</p>
              <p><strong>Frequency:</strong> {onboardingData.frequency.title}</p>
              <p>
                <strong>Training Days:</strong>{' '}
                {onboardingData.schedule?.pattern === 'interval'
                  ? 'Flexible based on schedule'
                  : onboardingData.schedule?.days.join(', ') || 'Not selected'
                }
              </p>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
}