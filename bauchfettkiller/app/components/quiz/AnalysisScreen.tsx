'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface AnalysisScreenProps {
  onComplete: () => void;
  isVisible: boolean;
}

const analysisSteps = [
  'Analysiere deine Angaben...',
  'Berechne deinen Stoffwechseltyp...',
  'Erstelle deinen persönlichen Plan...',
  'Optimiere für maximale Ergebnisse...',
];

export default function AnalysisScreen({ onComplete, isVisible }: AnalysisScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      setCurrentStep(0);
      return;
    }

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < analysisSteps.length - 1 ? prev + 1 : prev));
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
      <div className="w-20 h-20 mb-8 relative">
        <div className="absolute inset-0 rounded-full border-4 border-muted" />
        <div
          className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
        />
        <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
        Dein Ergebnis wird berechnet
      </h2>

      <p className="text-lg text-muted-foreground text-center mb-8 h-7">
        {analysisSteps[currentStep]}
      </p>

      <div className="w-full max-w-sm">
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          {progress}%
        </p>
      </div>
    </div>
  );
}
