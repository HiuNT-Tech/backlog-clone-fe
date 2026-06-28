'use client';

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { StateMessage } from './state-message';

export interface MultiOptionsListOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface MultiOptionsListProps {
  label?: string;
  options: MultiOptionsListOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  unselectLabel?: string;
  listHeight?: number;
  showSearch?: boolean;
  className?: string;
}

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

export const MultiOptionsList: React.FC<MultiOptionsListProps> = ({
  label,
  options,
  value = [],
  onChange,
  placeholder,
  unselectLabel,
  listHeight = 160,
  showSearch = true,
  className,
}) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const resolvedPlaceholder = placeholder ?? t('common.searchPlaceholder');
  const resolvedUnselectLabel = unselectLabel ?? t('common.unselect');

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const query = search.trim().toLowerCase();
    return options.filter(opt => {
      const labelText = getNodeText(opt.label);
      const valueText = String(opt.value).toLowerCase();
      return labelText.includes(query) || valueText.includes(query);
    });
  }, [options, search]);

  const selectedCount = value.length;

  const handleToggle = (optValue: string) => {
    if (value.includes(optValue)) {
      onChange?.(value.filter(v => v !== optValue));
    } else {
      onChange?.([...value, optValue]);
    }
  };

  const handleUnselectAll = () => {
    onChange?.([]);
  };

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Header: label + count + unselect */}
      <div className="mb-1.5 flex items-center gap-2">
        {label && (
          <span className="text-sm font-medium text-theme-neutral-11">
            {label}
          </span>
        )}
        {selectedCount > 0 && (
          <>
            <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
              {selectedCount}
            </span>
            <button
              type="button"
              onClick={handleUnselectAll}
              className="cursor-pointer text-sm font-medium text-theme-main transition-colors hover:text-theme-hover"
            >
              {resolvedUnselectLabel}
            </button>
          </>
        )}
      </div>

      {/* Search input */}
      {showSearch && (
        <div className="relative mb-1">
          <svg
            className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-theme-neutral-7"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={resolvedPlaceholder}
            className="w-full rounded border border-theme-neutral-5 bg-theme-neutral-2 py-1.5 pl-7 pr-2 text-sm text-theme-neutral-11 outline-none placeholder:text-theme-neutral-6 focus:border-theme-main"
          />
        </div>
      )}

      {/* Options list */}
      <div
        className="overflow-y-auto rounded border border-theme-neutral-5 bg-white"
        style={{ height: listHeight }}
      >
        {filteredOptions.length === 0 ? (
          <StateMessage
            i18nKey="common.noOptions"
            className="px-3 py-2 text-center text-theme-neutral-6"
          />
        ) : (
          filteredOptions.map(opt => {
            const isSelected = value.includes(opt.value);
            return (
              <div
                key={opt.value}
                onClick={() => !opt.disabled && handleToggle(opt.value)}
                className={cn(
                  'cursor-pointer select-none px-3 py-1.5 text-sm transition-colors',
                  isSelected
                    ? 'bg-theme-main-2 font-medium'
                    : 'text-theme-neutral-11 hover:bg-theme-neutral-3',
                  opt.disabled && 'cursor-not-allowed opacity-50'
                )}
              >
                {opt.label}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
