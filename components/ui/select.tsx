/* eslint-disable react-hooks/set-state-in-effect */
import type React from 'react';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';

type NativeOnChange = React.ChangeEventHandler<HTMLSelectElement>;
type ValueOnChange = (value: string, option?: SelectOption) => void;

export interface SelectOption {
  value: string;
  label: string;
  className?: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange' | 'value'
> {
  label?: string;
  error?: string;
  options: SelectOption[];
  notShowErrorMessage?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  placeholder?: string;
  allowClear?: boolean;
  onChange?: NativeOnChange;
  onValueChange?: ValueOnChange;
}

const Select = forwardRef<HTMLInputElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      options,
      notShowErrorMessage = false,
      onChange,
      onValueChange,
      required,
      name,
      value,
      defaultValue,
      disabled,
      placeholder,
      allowClear = false,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [internalValue, setInternalValue] = useState(
      (value as string | undefined) ??
        (defaultValue as string | undefined) ??
        ''
    );
    const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>(
      'bottom'
    );
    const [searchTerm, setSearchTerm] = useState('');
    const triggerRef = useRef<HTMLDivElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const hiddenInputRef = useRef<HTMLInputElement | null>(null);

    useImperativeHandle(ref, () => hiddenInputRef.current as HTMLInputElement);

    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value as string);
      }
    }, [value]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        if (
          triggerRef.current?.contains(target) ||
          dropdownRef.current?.contains(target)
        ) {
          return;
        }
        setOpen(false);
      };

      if (open) {
        if (triggerRef.current) {
          const rect = triggerRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const estimatedItemHeight = 40; // px per option
          const maxDropdownHeight = 240; // max-h-60 ~ 15rem
          const estimatedDropdownHeight = Math.min(
            options.length * estimatedItemHeight,
            maxDropdownHeight
          );

          const spaceBelow = viewportHeight - rect.bottom;
          const spaceAbove = rect.top;

          if (spaceBelow < estimatedDropdownHeight && spaceAbove > spaceBelow) {
            setDropdownPosition('top');
          } else {
            setDropdownPosition('bottom');
          }
        }

        document.addEventListener('mousedown', handleClickOutside);
      }

      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    const selectedOption = options.find(opt => opt.value === internalValue);

    const handleSelect = (option: SelectOption) => {
      setInternalValue(option.value);
      onValueChange?.(option.value, option);

      if (onChange) {
        const syntheticEvent = {
          target: {
            value: option.value,
            name,
          } as unknown as HTMLSelectElement,
          currentTarget: {
            value: option.value,
            name,
          } as unknown as HTMLSelectElement,
        } as React.ChangeEvent<HTMLSelectElement>;

        onChange(syntheticEvent);
      }

      setOpen(false);
    };

    const handleTriggerFocus = (event: React.FocusEvent<HTMLButtonElement>) => {
      onFocus?.(event);
    };

    const handleTriggerBlur = (event: React.FocusEvent<HTMLButtonElement>) => {
      onBlur?.(event);
    };

    const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setInternalValue('');
      onValueChange?.('', undefined);

      if (onChange) {
        const syntheticEvent = {
          target: {
            value: '',
            name,
          } as unknown as HTMLSelectElement,
          currentTarget: {
            value: '',
            name,
          } as unknown as HTMLSelectElement,
        } as React.ChangeEvent<HTMLSelectElement>;

        onChange(syntheticEvent);
      }
    };

    const showClearIcon = allowClear && isHovered && internalValue && !disabled;

    return (
      <div className="space-y-1">
        {label && (
          <label className="text-sm font-medium text-theme-neutral-11">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className={cn('relative', { 'mt-1': !!label })} ref={triggerRef}>
          <button
            type="button"
            className={cn(
              'flex h-10 w-full items-center justify-between rounded-lg border px-3 text-left text-sm transition-all duration-200',
              'bg-theme-neutral-2 text-theme-neutral-11',
              'focus:outline-none',
              disabled && 'cursor-not-allowed opacity-50',
              error ? 'border-red-500 error-class' : 'border-theme-neutral-5',
              className
            )}
            onClick={() => !disabled && setOpen(prev => !prev)}
            onFocus={handleTriggerFocus}
            onBlur={handleTriggerBlur}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-haspopup="listbox"
            aria-expanded={open}
            {...props}
          >
            <span
              className={cn(
                'flex-1 truncate text-theme-neutral-11',
                !selectedOption && 'text-theme-neutral-6'
              )}
            >
              {selectedOption?.label ?? placeholder ?? ''}
            </span>
            {showClearIcon ? (
              <button
                type="button"
                onClick={handleClear}
                className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-theme-neutral-6 text-white hover:bg-theme-neutral-7 transition-colors"
                aria-label="Clear selection"
              >
                <svg
                  className="h-2.5 w-2.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            ) : (
              <svg
                className={cn(
                  'h-4 w-4 text-theme-neutral-7 transition-transform duration-200',
                  open && 'rotate-180'
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </button>

          <input
            ref={hiddenInputRef}
            name={name}
            value={internalValue}
            readOnly
            hidden
            aria-hidden="true"
          />

          {open && (
            <div
              ref={dropdownRef}
              className={cn(
                'absolute z-50 w-full rounded-lg border border-theme-neutral-4 bg-theme-neutral-1 shadow-lg',
                'animate-in fade-in-0 zoom-in-95',
                dropdownPosition === 'bottom'
                  ? 'mt-1 top-full'
                  : 'mb-1 bottom-full'
              )}
            >
              <div className="max-h-60 overflow-auto py-1">
                {options.map(option => {
                  const isSelected = option.value === internalValue;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option)}
                      disabled={option.disabled}
                      className={cn(
                        'flex w-full items-start justify-between px-3 py-2 text-left text-sm transition-colors',
                        'hover:bg-theme-main-1/50',
                        option.className,
                        isSelected &&
                          'bg-theme-main text-theme-neutral-1 font-semibold hover:bg-theme-main',
                        option.disabled && 'opacity-50 cursor-default'
                      )}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <span className="flex-1">{option.label}</span>
                      {isSelected && (
                        <svg
                          className="ml-2 h-4 w-4 text-theme-main"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {error && !notShowErrorMessage && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
