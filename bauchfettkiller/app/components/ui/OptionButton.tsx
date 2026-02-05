import { Check } from 'lucide-react';

interface OptionButtonProps {
  label: string;
  selected?: boolean;
  onClick: () => void;
  multiSelect?: boolean;
}

export default function OptionButton({
  label,
  selected = false,
  onClick,
  multiSelect = false,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full min-h-[60px] px-6 py-4 rounded-xl text-lg font-medium
        transition-all duration-200 active:scale-[0.98]
        flex items-center justify-between
        ${
          selected
            ? 'bg-primary text-white border-2 border-primary shadow-lg shadow-primary/20'
            : 'bg-white text-foreground border-2 border-border hover:border-primary hover:bg-primary/5'
        }
      `}
    >
      <span>{label}</span>
      {multiSelect && (
        <div
          className={`
            w-6 h-6 rounded-md flex items-center justify-center transition-all
            ${selected ? 'bg-white' : 'border-2 border-border'}
          `}
        >
          {selected && <Check className="w-4 h-4 text-primary" />}
        </div>
      )}
    </button>
  );
}
