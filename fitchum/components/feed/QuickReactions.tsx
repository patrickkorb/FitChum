'use client';

import React, { useState } from 'react';
import { Flame, Zap, Heart, ThumbsUp } from 'lucide-react';

interface QuickReactionsProps {
  workoutId: string;
  onReact?: (reactionType: string) => void;
}

const reactions = [
  { type: 'fire', icon: Flame, color: 'text-accent-red', label: 'Fire' },
  { type: 'strong', icon: Zap, color: 'text-accent-gold', label: 'Strong' },
  { type: 'love', icon: Heart, color: 'text-accent-red', label: 'Love' },
  { type: 'thumbs', icon: ThumbsUp, color: 'text-primary', label: 'Nice' },
];

export default function QuickReactions({ workoutId, onReact }: QuickReactionsProps) {
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

  const handleReaction = (reactionType: string) => {
    setSelectedReaction(reactionType);
    onReact?.(reactionType);
  };

  return (
    <div className="flex items-center gap-0.5">
      {reactions.map(({ type, icon: Icon, color, label }) => {
        const isSelected = selectedReaction === type;
        return (
          <button
            key={type}
            onClick={() => handleReaction(type)}
            className={`p-1.5 rounded-full transition-all ${
              isSelected
                ? `${color} bg-card scale-110`
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
            aria-label={label}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
