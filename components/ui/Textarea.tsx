import React from 'react';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  helperText?: string;
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, id, className, rows = 3, ...props }, ref) => {
    const textareaId = id || props.name || Math.random().toString(36).substring(7);

    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-on-surface font-body"
          >
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-help` : undefined}
          className={`w-full px-3.5 py-2.5 rounded-lg border bg-surface text-on-surface placeholder:text-outline font-body text-base transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y ${
            error ? 'border-error ring-1 ring-error' : 'border-outline-variant hover:border-outline'
          } ${className ?? ''}`}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="text-xs text-error font-body">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${textareaId}-help`} className="text-xs text-on-surface-variant font-body">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
