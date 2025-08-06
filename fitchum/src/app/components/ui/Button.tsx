interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'submit' | 'button';
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  type,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false
}: ButtonProps) {
  const baseClasses: string = 'font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:cursor-pointer';
  
  const variantClasses: Record<string, string> = {
    primary: 'bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-secondary hover:bg-secondary/90 text-white shadow-lg hover:shadow-xl',
    outline: 'border-2 border-neutral-dark/20 dark:border-neutral-light/20 text-neutral-dark dark:text-neutral-light hover:bg-neutral-dark/5 dark:hover:bg-neutral-light/5'
  };

  const sizeClasses: Record<string, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const disabledClasses: string = disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-100';

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
}