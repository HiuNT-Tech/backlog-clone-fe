import type React from 'react';
import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import Image from 'next/image';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  /** Hiển thị dấu * đỏ bên cạnh label, không set required lên input (dùng khi validate bằng Zod) */
  requiredIndicator?: boolean;
  prefixIcon?: string;
  suffixIcon?: React.ReactNode;
  className?: string;
  classNameContainer?: string;
  notShowErrorMessage?: boolean;
  onlyNumber?: boolean;
  onlyFloat?: boolean;
  classNameError?: string;
  customNode?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      error,
      requiredIndicator = false,
      prefixIcon,
      suffixIcon,
      classNameContainer,
      notShowErrorMessage = false,
      onlyNumber = false,
      onlyFloat = false,
      classNameError,
      customNode,
      required,
      ...props
    },
    ref
  ) => {
    const showAsterisk = required === true || requiredIndicator === true;
    const omitNativeRequired = requiredIndicator === true;
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
      if (onlyNumber) {
        const sanitized = e.target.value.replace(/[^\d]/g, '');
        if (sanitized !== e.target.value) {
          e.target.value = sanitized;
        }
      } else if (onlyFloat) {
        const sanitized = e.target.value.replace(/[^\d.,]/g, '');
        if (sanitized !== e.target.value) {
          e.target.value = sanitized;
        }
      }
      props.onChange?.(e);
    };

    return (
      <div className={cn('space-y-1', classNameContainer)}>
        {label && (
          <label className="text-sm font-medium text-theme-neutral-11">
            {label}
            {showAsterisk && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className={cn('relative', { 'mt-1': !!label })}>
          {prefixIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Image
                src={prefixIcon}
                alt="icon"
                width={20}
                height={20}
                className="w-5 h-5"
              />
            </div>
          )}
          <input
            type={type}
            className={cn(
              'flex h-10 w-full rounded-md border border-theme-neutral-5 bg-theme-neutral-2 py-2 text-sm placeholder:text-theme-neutral-6 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              prefixIcon ? 'pl-10 pr-3' : 'px-3',
              suffixIcon ? 'pr-10' : '',
              error && 'border-red-500 focus:ring-red-500 error-class',
              className
            )}
            ref={ref}
            data-error={error ? 'true' : undefined}
            aria-invalid={error ? 'true' : undefined}
            inputMode={onlyNumber || onlyFloat ? 'decimal' : props.inputMode}
            pattern={
              onlyNumber ? '[0-9]*' : onlyFloat ? '[0-9.,]*' : props.pattern
            }
            {...props}
            required={omitNativeRequired ? undefined : required}
            onChange={handleChange}
          />
          {suffixIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {suffixIcon}
            </div>
          )}
          {customNode && customNode}
        </div>
        {error && !notShowErrorMessage && (
          <p className={cn('text-sm text-red-500', classNameError)}>{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
