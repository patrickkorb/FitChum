'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { formatElapsedTime } from '@/lib/workoutUtils';

interface WorkoutTimerProps {
  startTime: number;
}

export default function WorkoutTimer({ startTime }: WorkoutTimerProps) {
  const [elapsed, setElapsed] = useState(formatElapsedTime(startTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(formatElapsedTime(startTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50">
      <Clock size={20} className="text-muted-foreground" />
      <span className="text-lg font-mono font-semibold text-foreground">
        {elapsed}
      </span>
    </div>
  );
}
