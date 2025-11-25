import { cn } from '@/app/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export default function Input({
  className,
  error,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      <input
        className={cn(
          'w-full px-4 py-3 rounded-lg border transition-colors',
          'bg-background text-foreground',
          'border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
          'placeholder:text-muted-foreground',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
