'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit, Type, Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import type { WorkoutTemplate } from '@/types/workout.types';

interface TemplateCardProps {
  template: WorkoutTemplate;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (newName: string) => void;
  onEdit: () => void;
}

export default function TemplateCard({
  template,
  onSelect,
  onDelete,
  onRename,
  onEdit,
}: TemplateCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(template.name);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  const handleRenameSubmit = () => {
    if (newName.trim() && newName.trim() !== template.name) {
      onRename(newName.trim());
    }
    setIsRenaming(false);
    setNewName(template.name);
  };

  const handleRenameCancel = () => {
    setIsRenaming(false);
    setNewName(template.name);
  };

  return (
    <Card className="cursor-pointer hover:border-primary transition-colors border border-border p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1">
          {isRenaming ? (
            <input
              ref={inputRef}
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameSubmit();
                if (e.key === 'Escape') handleRenameCancel();
              }}
              onBlur={handleRenameSubmit}
              onClick={(e) => e.stopPropagation()}
              className="font-semibold text-foreground bg-muted px-2 py-1 rounded border border-primary focus:outline-none focus:ring-2 focus:ring-primary w-full"
            />
          ) : (
            <h3
              className="font-semibold text-foreground"
              onClick={onSelect}
            >
              {template.name}
            </h3>
          )}
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Template options"
          >
            <MoreVertical size={18} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 bg-background border border-muted-foreground/20 rounded-lg shadow-lg min-w-[160px] z-50">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  setIsRenaming(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-foreground"
              >
                <Type size={16} />
                <span>Umbenennen</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onEdit();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-foreground"
              >
                <Edit size={16} />
                <span>Bearbeiten</span>
              </button>
              <div className="border-t border-muted-foreground/20" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onDelete();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-red-500"
              >
                <Trash2 size={16} />
                <span>Löschen</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1" onClick={onSelect}>
        {template.exercises.map((ex, index) => (
          <div key={index} className="text-sm text-muted-foreground">
            {ex.defaultSets} x {ex.name}
          </div>
        ))}
      </div>

      {template.exercises.length === 0 && (
        <p className="text-sm text-muted-foreground italic">
          Keine Übungen
        </p>
      )}
    </Card>
  );
}
