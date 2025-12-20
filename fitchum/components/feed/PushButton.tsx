'use client';

import React, { useState } from 'react';
import { BellRing, Check } from 'lucide-react';

interface PushButtonProps {
  userId: string;
  userName: string;
  onPush?: () => void;
}

export default function PushButton({ userId, userName, onPush }: PushButtonProps) {
  const [isPushed, setIsPushed] = useState(false);

  const handlePush = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click
    setIsPushed(true);
    onPush?.();

    // Reset after animation
    setTimeout(() => setIsPushed(false), 2000);
  };

  return (
    <button
      onClick={handlePush}
      disabled={isPushed}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
        isPushed
          ? 'bg-primary/10 text-primary'
          : 'bg-secondary/10 text-secondary hover:bg-secondary/20'
      }`}
      aria-label={`Push ${userName} to workout`}
    >
      {isPushed ? (
        <>
          <Check className="h-3.5 w-3.5" />
          <span>Pushed!</span>
        </>
      ) : (
        <>
          <BellRing className="h-3.5 w-3.5" />
          <span>Push</span>
        </>
      )}
    </button>
  );
}
