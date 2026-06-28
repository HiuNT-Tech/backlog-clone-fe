'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

type StateMessageElement = 'div' | 'li' | 'p' | 'span';
type StateMessageVariant = 'inline' | 'block';
type StateMessageTone = 'neutral' | 'danger';

interface StateMessageProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'children'
> {
  as?: StateMessageElement;
  i18nKey?: string;
  i18nValues?: Record<string, unknown>;
  children?: React.ReactNode;
  variant?: StateMessageVariant;
  tone?: StateMessageTone;
  spinner?: boolean;
  spinnerClassName?: string;
  textClassName?: string;
}

const variantClassNames: Record<StateMessageVariant, string> = {
  inline: 'text-sm text-theme-neutral-7',
  block:
    'flex flex-col items-center justify-center gap-3 py-16 text-center text-sm text-theme-neutral-7',
};

const toneClassNames: Record<StateMessageTone, string> = {
  neutral: 'text-theme-neutral-7',
  danger: 'text-red-500',
};

export function StateMessage({
  as: Component = 'div',
  i18nKey,
  i18nValues,
  children,
  variant = 'inline',
  tone = 'neutral',
  spinner = false,
  spinnerClassName,
  textClassName,
  className,
  'aria-live': ariaLive,
  ...props
}: StateMessageProps) {
  const { t } = useTranslation();
  const content = children ?? (i18nKey ? t(i18nKey, i18nValues) : null);

  return (
    <Component
      className={cn(
        variantClassNames[variant],
        toneClassNames[tone],
        className
      )}
      aria-live={ariaLive ?? (spinner ? 'polite' : undefined)}
      {...props}
    >
      {spinner && (
        <span
          aria-hidden="true"
          className={cn(
            'h-8 w-8 animate-spin rounded-full border-2 border-theme-neutral-5 border-t-theme-main',
            spinnerClassName
          )}
        />
      )}
      <span className={textClassName}>{content}</span>
    </Component>
  );
}
