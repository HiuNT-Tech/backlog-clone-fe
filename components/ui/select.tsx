import type React from 'react';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Select as AntdSelect } from 'antd';
import { cn } from '@/lib/utils';

type NativeOnChange = React.ChangeEventHandler<HTMLSelectElement>;
type ValueOnChange = (value: string, option?: SelectOption) => void;

export interface SelectOption {
  value: string;
  label: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  label?: string;
  error?: string;
  showSearch?: boolean;
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
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
}

const Select = forwardRef<HTMLInputElement, SelectProps>(
  (
    {
      showSearch = false,
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
      onFocus,
      onBlur,
      allowClear = true,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(
      (value as string | undefined) ??
        (defaultValue as string | undefined) ??
        ''
    );
    const hiddenInputRef = useRef<HTMLInputElement | null>(null);

    useImperativeHandle(ref, () => hiddenInputRef.current as HTMLInputElement);

    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value as string);
      }
    }, [value]);

    const triggerNativeChange = (nextValue: string) => {
      if (onChange) {
        const syntheticEvent = {
          target: {
            value: nextValue,
            name,
          } as unknown as HTMLSelectElement,
          currentTarget: {
            value: nextValue,
            name,
          } as unknown as HTMLSelectElement,
        } as React.ChangeEvent<HTMLSelectElement>;

        onChange(syntheticEvent);
      }
    };

    const handleAntdChange = (nextValue: string) => {
      setInternalValue(nextValue ?? '');
      const selectedOption = options.find(
        opt => opt.value === (nextValue ?? '')
      );
      onValueChange?.(nextValue ?? '', selectedOption);
      triggerNativeChange(nextValue ?? '');
    };

    return (
      <div className="space-y-1">
        {label && (
          <label className="text-sm font-medium text-theme-neutral-11">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className={cn('relative', { 'mt-1': !!label })}>
          <AntdSelect
            className={cn(
              'w-full',
              'h-10 rounded-md border border-theme-neutral-5 bg-theme-neutral-2 px-3 shadow-none  text-theme-neutral-11 items-center',
              '[&_.ant-select-selector]:h-10! [&_.ant-select-selector]:rounded-md! [&_.ant-select-selector]:border-theme-neutral-5!',
              '[&_.ant-select-selector]:bg-theme-neutral-2! [&_.ant-select-selector]:px-3!',
              '[&_.ant-select-selector]:shadow-none! [&_.ant-select-selection-placeholder]:text-theme-neutral-6!',
              '[&_.ant-select-selection-item]:text-theme-neutral-11!',
              '[&_.ant-select-selector]:items-center!',
              error && '[&_.ant-select-selector]:border-red-500! error-class',
              className
            )}
            value={internalValue || undefined}
            defaultValue={defaultValue}
            options={options}
            placeholder={placeholder}
            disabled={disabled}
            onChange={handleAntdChange}
            showSearch={showSearch}
            onClear={() => {
              setInternalValue('');
              onValueChange?.('', undefined);
              triggerNativeChange('');
            }}
            onFocus={onFocus}
            onBlur={onBlur}
            allowClear={allowClear}
          />

          <input
            ref={hiddenInputRef}
            name={name}
            value={internalValue}
            readOnly
            hidden
            aria-hidden="true"
          />
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
