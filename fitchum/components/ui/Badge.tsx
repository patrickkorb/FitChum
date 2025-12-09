import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'muted';
  children: React.ReactNode;
}

export default function Badge({
  variant = 'default',
  children,
  className = '',
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-sm px-2 py-1 text-lg font-medium';

  const variantStyles = {
    default: 'bg-primary text-primary-foreground',
    success: 'bg-success text-success-foreground',
    warning: 'bg-warning text-warning-foreground',
    muted: 'bg-muted text-muted-foreground',
  };

  const classes = `${baseStyles} ${variantStyles[variant]} ${className}`;

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}
