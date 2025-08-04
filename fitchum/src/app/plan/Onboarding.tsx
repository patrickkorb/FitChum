"use client"
import { useState } from 'react';
import Button from '../components/ui/Button';
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
  onComplete: (data: OnboardingData) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const totalSteps = 3;

  const handleSplitSelect = (split: WorkoutSplit) => {
    setOnboardingData(prev => ({ ...prev, workoutSplit: split }));
  };

  const handleFrequencySelect = (frequency: WorkoutFrequency) => {
    setOnboardingData(prev => ({ ...prev, frequency }));
  };

  const handleScheduleSelect = (schedule: SelectedDays) => {
    setOnboardingData(prev => ({ ...prev, schedule }));
  };

  const canProceed = () => {
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

  const handleNext = () => {
    if (currentStep < totalSteps && canProceed()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    console.log('Onboarding completed:', onboardingData);
    onComplete(onboardingData);
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
        return onboardingData.frequency ? (
          <DaySelection
            frequency={onboardingData.frequency.days}
            onSelect={handleScheduleSelect}
            selectedDays={onboardingData.schedule}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="col-span-3 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="text-primary" size={32} />
            <h1 className="text-4xl font-bold text-neutral-dark dark:text-neutral-light">
              Trainingsplan Setup
            </h1>
          </div>
          <p className="text-neutral-dark/70 dark:text-neutral-light/70 text-lg">
            Lass uns deinen perfekten Trainingsplan erstellen
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-neutral-dark dark:text-neutral-light">
              Schritt {currentStep} von {totalSteps}
            </span>
            <span className="text-sm text-neutral-dark/60 dark:text-neutral-light/60">
              {Math.round((currentStep / totalSteps) * 100)}% abgeschlossen
            </span>
          </div>
          <div className="w-full bg-neutral-dark/10 dark:bg-neutral-light/10 rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {renderCurrentStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={currentStep === 1 ? 'invisible' : ''}
          >
            <ChevronLeft size={20} />
            Zurück
          </Button>

          <div className="flex gap-2">
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
              disabled={!canProceed()}
              className="bg-secondary hover:bg-secondary/90"
            >
              <Check size={20} />
              Abschließen
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Weiter
              <ChevronRight size={20} />
            </Button>
          )}
        </div>

        {/* Summary (only on last step) */}
        {currentStep === totalSteps && onboardingData.workoutSplit && onboardingData.frequency && (
          <div className="mt-8 p-6 bg-neutral-dark/5 dark:bg-neutral-light/5 rounded-2xl">
            <h3 className="font-bold text-lg text-neutral-dark dark:text-neutral-light mb-4">
              Dein Trainingsplan im Überblick:
            </h3>
            <div className="space-y-2 text-neutral-dark/80 dark:text-neutral-light/80">
              <p><strong>Split:</strong> {onboardingData.workoutSplit.name}</p>
              <p><strong>Frequenz:</strong> {onboardingData.frequency.title}</p>
              <p>
                <strong>Trainingstage:</strong>{' '}
                {onboardingData.schedule?.pattern === 'interval'
                  ? 'Flexibel je nach Zeitplan'
                  : onboardingData.schedule?.days.join(', ') || 'Nicht ausgewählt'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}