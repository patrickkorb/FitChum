'use client';

import { useState, useEffect } from 'react';
import { Clock, Zap, X } from 'lucide-react';
import { getUserPlan, isTrialActive, getTrialDaysRemaining } from '@/lib/subscription';
import Button from '../ui/Button';

interface TrialBannerProps {
  currentUserId?: string | null;
}

export default function TrialBanner({ currentUserId }: TrialBannerProps) {
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTrialStatus = async () => {
      if (!currentUserId) {
        setLoading(false);
        return;
      }

      try {
        const userPlan = await getUserPlan(currentUserId);
        if (userPlan && isTrialActive(userPlan)) {
          const remaining = getTrialDaysRemaining(userPlan);
          setDaysRemaining(remaining);
        } else {
          setDaysRemaining(null);
        }
      } catch (error) {
        console.error('Error checking trial status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkTrialStatus();
  }, [currentUserId]);

  if (loading || !currentUserId || daysRemaining === null || !isVisible) {
    return null;
  }

  const getTrialMessage = () => {
    if (daysRemaining === 0) {
      return "Your trial expires today!";
    } else if (daysRemaining === 1) {
      return "1 day left in your free trial";
    } else {
      return `${daysRemaining} days left in your free trial`;
    }
  };

  const getBannerColor = () => {
    if (daysRemaining <= 1) {
      return 'bg-gradient-to-r from-red-500 to-red-600';
    } else if (daysRemaining <= 3) {
      return 'bg-gradient-to-r from-orange-500 to-orange-600';
    } else {
      return 'bg-gradient-to-r from-primary to-secondary';
    }
  };

  return (
    <div className={`${getBannerColor()} text-white shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {daysRemaining <= 1 ? (
                <Zap className="h-5 w-5 animate-pulse" />
              ) : (
                <Clock className="h-5 w-5" />
              )}
              <span className="font-semibold text-sm sm:text-base">
                {getTrialMessage()}
              </span>
            </div>
            <div className="hidden sm:block text-sm opacity-90">
              Upgrade now to keep your progress and unlock all features
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-white/20 hover:bg-white/30 border-white/30 text-white text-xs sm:text-sm px-3 py-1.5"
              onClick={() => {
                // Navigate to pricing page
                window.location.href = '/pricing';
              }}
            >
              Upgrade Now
            </Button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-white/20 rounded"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}