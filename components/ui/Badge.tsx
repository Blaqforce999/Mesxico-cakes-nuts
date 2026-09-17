import React from 'react';

type BadgeProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'leadTime' | 'urgent';
  className?: string;
};

export function Badge({
  children,
  variant = 'primary',
  className,
}: BadgeProps) {
  const variants = {
    primary: 'bg-primary-container text-on-primary-container border-none',
    secondary: 'bg-secondary-container text-on-secondary-container border-none',
    outline: 'bg-surface text-on-surface border border-outline',
    leadTime: 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold',
    urgent: 'bg-red-100 text-red-900 border border-red-300 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-body transition-colors ${variants[variant]} ${className ?? ''}`}
    >
      {children}
    </span>
  );
}
