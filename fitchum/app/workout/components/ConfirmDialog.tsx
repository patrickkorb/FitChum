'use client';

import { X } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDanger?: boolean;
}

export default function ConfirmDialog({
  title,
  message,
  confirmText,
  cancelText = 'Abbrechen',
  onConfirm,
  onCancel,
  isDanger = false,
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg max-w-md w-full p-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <button
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <p className="text-muted-foreground mb-6">{message}</p>

        <div className="flex gap-3">
          <Button onClick={onCancel} variant="outline" className="flex-1">
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            variant="primary"
            className={`flex-1 ${isDanger ? 'bg-red-500 hover:bg-red-600' : ''}`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
