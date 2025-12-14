'use client';

import { Calendar } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function EmptyHistoryState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="bg-muted/30 rounded-full p-6 mb-6">
        <Calendar className="w-16 h-16 text-muted-foreground" />
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-2">
        Keine Workouts
      </h2>

      <p className="text-muted-foreground mb-8 max-w-sm">
        Du hast noch keine Workouts abgeschlossen. Starte dein erstes Training und es wird hier erscheinen.
      </p>

      <Link href="/workout">
        <Button size="lg">
          Erstes Workout starten
        </Button>
      </Link>
    </div>
  );
}
