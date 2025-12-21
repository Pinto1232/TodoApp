'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated';
}

export function Card({ children, className = '', variant = 'default' }: CardProps) {
  const baseStyles = 'rounded-xl';
  const variantStyles = {
    default: 'bg-white shadow-sm',
    elevated: 'bg-[#f5f5f5] rounded-2xl shadow-lg',
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}
