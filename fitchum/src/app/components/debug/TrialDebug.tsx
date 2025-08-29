'use client';

import { useState, useEffect } from 'react';
import { getUserPlan, isTrialActive, getTrialDaysRemaining, hasTrialExpired } from '@/lib/subscription';

interface TrialDebugProps {
  currentUserId?: string | null;
}

export default function TrialDebug({ currentUserId }: TrialDebugProps) {
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const fetchDebugInfo = async () => {
      if (!currentUserId) {
        setDebugInfo({ error: 'No user ID' });
        return;
      }

      try {
        const userPlan = await getUserPlan(currentUserId);
        const debug = {
          userId: currentUserId,
          userPlan,
          isTrialActive: userPlan ? isTrialActive(userPlan) : null,
          daysRemaining: userPlan ? getTrialDaysRemaining(userPlan) : null,
          hasExpired: userPlan ? hasTrialExpired(userPlan) : null,
        };
        setDebugInfo(debug);
      } catch (error) {
        setDebugInfo({ error: error.message });
      }
    };

    fetchDebugInfo();
  }, [currentUserId]);

  if (!debugInfo) {
    return <div className="bg-yellow-100 p-4 rounded mb-4">Loading debug info...</div>;
  }

  return (
    <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded mb-4 text-xs">
      <h3 className="font-bold mb-2">Trial Debug Info:</h3>
      <pre className="whitespace-pre-wrap">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
}