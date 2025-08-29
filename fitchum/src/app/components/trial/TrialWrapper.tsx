'use client';

import { useState, useEffect, ReactNode } from 'react';
import { getUserPlan, hasTrialExpired } from '@/lib/subscription';
import TrialExpiredScreen from './TrialExpiredScreen';
import TrialBanner from './TrialBanner';

interface TrialWrapperProps {
  children: ReactNode;
  currentUserId?: string | null;
}

export default function TrialWrapper({ children, currentUserId }: TrialWrapperProps) {
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTrialStatus = async () => {
      if (!currentUserId) {
        setLoading(false);
        return;
      }

      try {
        const userPlan = await getUserPlan(currentUserId);
        if (userPlan) {
          const expired = hasTrialExpired(userPlan);
          setIsTrialExpired(expired);
        }
      } catch (error) {
        console.error('Error checking trial status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkTrialStatus();
    
    // Check every minute for trial expiry
    const interval = setInterval(checkTrialStatus, 60000);
    
    return () => clearInterval(interval);
  }, [currentUserId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-light to-primary/5 dark:from-neutral-dark dark:to-primary/10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUserId) {
    return <>{children}</>;
  }

  if (isTrialExpired) {
    return <TrialExpiredScreen />;
  }

  return (
    <>
      <TrialBanner currentUserId={currentUserId} />
      {children}
    </>
  );
}