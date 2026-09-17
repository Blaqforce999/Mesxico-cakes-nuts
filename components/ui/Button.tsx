import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      'bg-primary text-on-primary hover:opacity-90 active:scale-[0.98] shadow-sm',
    secondary:
      'bg-surface text-on-surface border border-outline hover:bg-surface-variant active:scale-[0.98]',
    ghost:
      'bg-transparent text-on-surface hover:bg-surface-variant active:scale-[0.98]',
    danger:
      'bg-error text-on-error hover:opacity-90 active:scale-[0.98]',
    gold:
      'bg-secondary text-on-secondary hover:opacity-90 active:scale-[0.98] shadow-sm',
  };

  const sizes = {
    sm: 'min-h-[36px] px-3 text-sm py-1.5',
    md: 'min-h-[44px] px-5 text-base py-2.5', // Touch target minimum 44px
    lg: 'min-h-[50px] px-7 text-lg py-3',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-medium font-body rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${variants[variant]} ${sizes[size]} ${className ?? ''}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center space-x-2">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Processing...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
