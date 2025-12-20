import React from 'react';
import { Activity, Clock, CheckCircle2 } from 'lucide-react';

interface StatusBadgeProps {
  status: 'live' | 'pending' | 'completed';
  completedTime?: string; // e.g., "2h ago"
}

export default function StatusBadge({ status, completedTime }: StatusBadgeProps) {
  if (status === 'live') {
    return (
      <div className="flex items-center gap-1.5 text-primary">
        <div className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
        </div>
        <Activity className="h-4 w-4" />
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="flex items-center gap-1.5 text-accent-gold">
        <Clock className="h-4 w-4" />
      </div>
    );
  }

  // completed
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <CheckCircle2 className="h-4 w-4" />
      {completedTime && <span className="text-xs">{completedTime}</span>}
    </div>
  );
}
