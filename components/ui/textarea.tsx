import type React from 'react';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  className?: string;
  classNameContainer?: string;
  notShowErrorMessage?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      classNameContainer,
      notShowErrorMessage = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('space-y-1', classNameContainer)}>
        {label && (
          <label className="text-sm font-medium text-theme-neutral-11">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className={cn('relative', { 'mt-1': !!label })}>
          <textarea
            className={cn(
              'flex min-h-[120px] w-full rounded-md border border-theme-neutral-5 bg-theme-neutral-2 px-3 py-2 text-sm placeholder:text-theme-neutral-6 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none',
              error && 'border-red-500 focus:ring-red-500 error-class',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && !notShowErrorMessage && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
