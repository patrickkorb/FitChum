interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export default function Card({ children, className = '', onClick, selected = false }: CardProps) {
  const baseClasses = 'p-6 rounded-2xl border-2 transition-all duration-200 hover:cursor-pointer';
  const interactiveClasses = onClick ? 'cursor-pointer hover:shadow-lg hover:scale-105' : '';
  const selectedClasses = selected 
    ? 'border-primary bg-primary/10 shadow-lg' 
    : 'border-neutral-dark/10 dark:border-neutral-light/10 bg-neutral-dark/5 dark:bg-neutral-light/5 hover:border-neutral-dark/20 dark:hover:border-neutral-light/20';

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${interactiveClasses} ${selectedClasses} ${className}`}
    >
      {children}
    </div>
  );
}