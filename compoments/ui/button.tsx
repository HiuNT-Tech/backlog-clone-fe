import type React from 'react';
import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'data';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'cursor-pointer inline-flex items-center justify-center rounded-md text-base font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-theme-main text-theme-neutral-1 hover:bg-theme-hover focus:ring-theme-main':
              variant === 'primary',
            'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500':
              variant === 'secondary',
            'border border-theme-main bg-theme-neutral-1 text-theme-main hover:bg-theme-neutral-2 focus:ring-theme-main-2':
              variant === 'outline',
            'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500':
              variant === 'danger',
            'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500':
              variant === 'data',
          },
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-sm': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
            'h-10 w-10 p-0': size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

// Button variants function
export const buttonVariants = (
  options: { variant?: ButtonProps['variant']; size?: ButtonProps['size'] } = {}
) => {
  const { variant = 'primary', size = 'md' } = options;
  return cn(
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
    {
      'bg-theme-main text-white hover:bg-theme-hover focus:ring-theme-main':
        variant === 'primary',
      'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500':
        variant === 'secondary',
      'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500':
        variant === 'outline',
      'text-gray-700 hover:bg-gray-100 focus:ring-gray-500':
        variant === 'ghost',
      'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500':
        variant === 'danger',
    },
    {
      'h-8 px-3 text-sm': size === 'sm',
      'h-10 px-4 text-sm': size === 'md',
      'h-12 px-6 text-base': size === 'lg',
      'h-10 w-10 p-0': size === 'icon',
    }
  );
};

export { Button };
