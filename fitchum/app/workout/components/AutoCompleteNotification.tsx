'use client';

import { AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface AutoCompleteNotificationProps {
  onDismiss: () => void;
}

export default function AutoCompleteNotification({
  onDismiss,
}: AutoCompleteNotificationProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle size={24} className="text-warning flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Workout automatisch beendet
            </h2>
            <p className="text-muted-foreground">
              Dein letztes Workout wurde automatisch beendet, da es länger als 6 Stunden nicht abgeschlossen wurde.
            </p>
          </div>
        </div>

        <Button onClick={onDismiss} className="w-full">
          Verstanden
        </Button>
      </Card>
    </div>
  );
}
