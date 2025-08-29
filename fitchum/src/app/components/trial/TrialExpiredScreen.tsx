'use client';

import { Lock, Zap, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';

interface TrialExpiredScreenProps {
  onUpgrade?: () => void;
}

export default function TrialExpiredScreen({ onUpgrade }: TrialExpiredScreenProps) {
  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      window.location.href = '/pricing';
    }
  };

  const proFeatures = [
    'Unlimited workout logging',
    'Custom workout plans',
    'Friends & social features',
    'Advanced streak tracking',
    'Progress analytics',
    'Custom challenges',
    'Priority support'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-primary/5 dark:from-neutral-dark dark:via-neutral-dark dark:to-primary/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-6">
            <Lock className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-dark dark:text-neutral-light mb-2">
            Trial Expired
          </h1>
          <p className="text-lg text-neutral-dark/70 dark:text-neutral-light/70 mb-8">
            Your 7-day free trial has ended. Upgrade to Pro to continue using FitChum and keep your progress.
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-dark/50 rounded-xl shadow-lg border border-neutral-dark/10 dark:border-neutral-light/10 p-6">
          <div className="flex items-center mb-4">
            <Zap className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold text-neutral-dark dark:text-neutral-light">
              Upgrade to Pro
            </h2>
          </div>
          
          <div className="space-y-3 mb-6">
            {proFeatures.map((feature, index) => (
              <div key={index} className="flex items-center">
                <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                <span className="text-neutral-dark dark:text-neutral-light text-sm">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <Button
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Upgrade to Pro - €10/month
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-neutral-dark/60 dark:text-neutral-light/60">
            Cancel anytime • 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
}