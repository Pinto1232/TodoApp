'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'link';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const variantStyles = {
  primary: 'bg-teal-500 hover:bg-teal-600 text-white font-semibold',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium',
  danger: 'text-red-300 hover:text-red-500',
  link: 'text-amber-500 hover:text-amber-600 font-medium',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-6 py-3',
  lg: 'px-8 py-4 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'rounded-lg transition-colors';
  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${
    variant !== 'link' && variant !== 'danger' ? sizeStyles[size] : ''
  } ${className}`;

  return (
    <button className={combinedStyles} {...props}>
      {children}
    </button>
  );
}
