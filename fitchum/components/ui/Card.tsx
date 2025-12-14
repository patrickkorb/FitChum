import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Card({ children, className = '', ...props }: CardProps) {
  const baseStyles = 'rounded-lg bg-background ';
  const classes = `${baseStyles} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
