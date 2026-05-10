import React from 'react';
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
export type SelectValue = string | string[];
type ValueOnChangeSingle = {
  bivarianceHack: (value: string, option?: SelectOption) => void;
}['bivarianceHack'];
type ValueOnChangeMultiple = {
  bivarianceHack: (value: string[], option?: SelectOption[]) => void;
}['bivarianceHack'];

export interface SelectOption {
  value: string;
  label: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

interface BaseSelectProps extends Omit<
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
  disabled?: boolean;
  placeholder?: string;
  allowClear?: boolean;
  listHeight?: number;
  showSelectedCount?: boolean;
  clearAllLabel?: string;
  onChange?: NativeOnChange;
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
}

interface SingleSelectProps extends BaseSelectProps {
  mode?: undefined;
  value?: string;
  defaultValue?: string;
  onValueChange?: ValueOnChangeSingle;
}

interface MultipleSelectProps extends BaseSelectProps {
  mode: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: ValueOnChangeMultiple;
}

export type SelectProps = SingleSelectProps | MultipleSelectProps;

const getNodeText = (node: React.ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node).toLowerCase();
  }

  if (Array.isArray(node)) {
    return node.map(getNodeText).join(' ').trim();
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return getNodeText(node.props.children);
  }

  return '';
};

const normalizeSelectValue = (
  nextValue: SelectValue | undefined,
  isMultiple: boolean
): SelectValue => {
  if (isMultiple) {
    if (Array.isArray(nextValue)) {
      return nextValue.filter(Boolean);
    }

    return nextValue ? [nextValue] : [];
  }

  if (Array.isArray(nextValue)) {
    return nextValue[0] ?? '';
  }

  return nextValue ?? '';
};

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
      mode,
      listHeight = 180,
      showSelectedCount = true,
      clearAllLabel = 'Unselect',
    },
    ref
  ) => {
    const isMultiple = mode === 'multiple';
    const [internalValue, setInternalValue] = useState(
      normalizeSelectValue(value ?? defaultValue, isMultiple)
    );
    const hiddenInputRef = useRef<HTMLInputElement | null>(null);

    useImperativeHandle(ref, () => hiddenInputRef.current as HTMLInputElement);

    useEffect(() => {
      setInternalValue(normalizeSelectValue(value ?? defaultValue, isMultiple));
    }, [defaultValue, isMultiple, value]);

    const triggerNativeChange = (nextValue: SelectValue) => {
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

    const handleAntdChange = (
      nextValue: string | string[],
      selectedOption?: SelectOption | SelectOption[]
    ) => {
      const normalizedValue = normalizeSelectValue(nextValue, isMultiple);
      setInternalValue(normalizedValue);
      if (isMultiple) {
        (onValueChange as ValueOnChangeMultiple | undefined)?.(
          normalizedValue as string[],
          Array.isArray(selectedOption)
            ? selectedOption
            : selectedOption
              ? [selectedOption]
              : undefined
        );
      } else {
        (onValueChange as ValueOnChangeSingle | undefined)?.(
          normalizedValue as string,
          Array.isArray(selectedOption) ? selectedOption[0] : selectedOption
        );
      }
      triggerNativeChange(normalizedValue);
    };

    const handleClear = () => {
      const clearedValue = normalizeSelectValue(undefined, isMultiple);
      setInternalValue(clearedValue);
      if (isMultiple) {
        (onValueChange as ValueOnChangeMultiple | undefined)?.(
          clearedValue as string[],
          undefined
        );
      } else {
        (onValueChange as ValueOnChangeSingle | undefined)?.(
          clearedValue as string,
          undefined
        );
      }
      triggerNativeChange(clearedValue);
    };

    const selectedCount = Array.isArray(internalValue)
      ? internalValue.length
      : internalValue
        ? 1
        : 0;
    const serializedValue = Array.isArray(internalValue)
      ? JSON.stringify(internalValue)
      : internalValue;
    const selectValue = isMultiple
      ? (internalValue as string[])
      : (internalValue as string) || undefined;

    return (
      <div className="space-y-1">
        {label && (
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-sm font-medium text-theme-neutral-11">
              {label}
              {required && <span className="ml-1 text-red-500">*</span>}
            </label>

            {isMultiple && showSelectedCount && selectedCount > 0 && (
              <>
                <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-emerald-500 px-1.5 py-0.5 text-xs font-semibold text-white">
                  {selectedCount}
                </span>
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={disabled}
                  className="cursor-pointer text-sm font-medium text-theme-main transition-colors hover:text-theme-hover disabled:cursor-not-allowed disabled:text-theme-neutral-6"
                >
                  {clearAllLabel}
                </button>
              </>
            )}
          </div>
        )}

        <div className={cn('relative', { 'mt-1': !!label })}>
          <AntdSelect
            className={cn(
              'w-full',
              'rounded-md border border-theme-neutral-5 bg-theme-neutral-2 px-3 text-theme-neutral-11 shadow-none',
              '[&_.ant-select-selector]:rounded-md! [&_.ant-select-selector]:border-theme-neutral-5!',
              '[&_.ant-select-selector]:bg-theme-neutral-2! [&_.ant-select-selector]:px-3!',
              '[&_.ant-select-selector]:shadow-none! [&_.ant-select-selection-placeholder]:text-theme-neutral-6!',
              '[&_.ant-select-selection-item]:text-theme-neutral-11!',
              isMultiple
                ? [
                    'min-h-[50px]',
                    '[&_.ant-select-selector]:min-h-[50px]! [&_.ant-select-selector]:py-1!',
                    '[&_.ant-select-selection-overflow]:min-h-[40px]!',
                    '[&_.ant-select-selection-search]:min-h-[32px]!',
                    '[&_.ant-select-selection-placeholder]:self-center!',
                  ]
                : [
                    'h-10 items-center',
                    '[&_.ant-select-selector]:h-10! [&_.ant-select-selector]:items-center!',
                  ],
              error && '[&_.ant-select-selector]:border-red-500! error-class',
              className
            )}
            value={selectValue}
            defaultValue={defaultValue}
            options={options}
            placeholder={placeholder}
            disabled={disabled}
            onChange={handleAntdChange}
            showSearch={isMultiple || showSearch}
            mode={mode}
            listHeight={listHeight}
            maxTagCount={isMultiple ? 0 : undefined}
            maxTagPlaceholder={omittedValues =>
              omittedValues.length > 0 ? (
                <span className="text-theme-neutral-7">
                  {omittedValues.length} selected
                </span>
              ) : null
            }
            filterOption={(input, option) => {
              const query = input.trim().toLowerCase();

              if (!query) {
                return true;
              }

              const labelText = getNodeText(option?.label);
              const valueText = String(option?.value ?? '').toLowerCase();

              return labelText.includes(query) || valueText.includes(query);
            }}
            onClear={handleClear}
            onFocus={onFocus}
            onBlur={onBlur}
            allowClear={isMultiple ? false : allowClear}
          />

          <input
            ref={hiddenInputRef}
            name={name}
            value={serializedValue}
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
