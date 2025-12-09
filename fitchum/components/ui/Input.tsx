import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = '',
  ...props
}: InputProps) {
  const baseStyles = 'w-full px-3 py-2 rounded-lg border transition-colors';
  const normalStyles = 'border-muted bg-background text-foreground focus:outline-none focus:border-primary';
  const errorStyles = 'border-red-500 focus:border-red-500';

  const inputClasses = `${baseStyles} ${error ? errorStyles : normalStyles} ${className}`;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input className={inputClasses} {...props} />
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  );
}
