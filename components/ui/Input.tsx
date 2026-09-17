import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, className, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(7);

    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-on-surface font-body"
          >
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined}
          className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border bg-surface text-on-surface placeholder:text-outline font-body text-base transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            error ? 'border-error ring-1 ring-error' : 'border-outline-variant hover:border-outline'
          } ${className ?? ''}`}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-error font-body">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-help`} className="text-xs text-on-surface-variant font-body">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
