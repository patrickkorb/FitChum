import React from 'react';
import { Trophy } from 'lucide-react';

interface PRBadgeProps {
  exercise: string;
  value: string; // e.g., "180kg" or "100 reps"
  className?: string;
}

export default function PRBadge({ exercise, value, className = '' }: PRBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full bg-accent-gold/10 px-2.5 py-1 text-xs font-medium text-accent-gold border border-accent-gold/20 max-w-full ${className}`}
    >
      <Trophy className="h-3 w-3 flex-shrink-0" />
      <span className="truncate">PR: {exercise} {value}</span>
    </div>
  );
}
