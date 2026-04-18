'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { TimePicker } from '@/components/ui/time-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { TimeRangePicker } from '@/components/ui/time-range-picker';
import { useSearchForm } from '@/hooks/use-search-form';
import Images from '@/assets';
import type { SearchSectionConfig, SearchField } from '@/types/search-section';
import { Button } from '@/components/ui/button';

export const SearchSection = ({
  fields,
  itemsPerRow = 5,
  minItemWidth = 200,
  noExpand = false,
  onSearch,
  onReset,
  onFieldChange,
  searchButtonText,
  resetButtonText,
  expandButtonText,
  collapseButtonText,
  title,
  syncWithUrl = true,
  urlParamsPrefix = '',
  triggerSearchOnMount = true,
}: SearchSectionConfig) => {
  const { t } = useTranslation();

  const finalSearchButtonText =
    searchButtonText || t('common.search', 'Search');
  const finalResetButtonText = resetButtonText || t('common.reset', 'Reset');
  const finalExpandButtonText =
    expandButtonText || t('common.expand', 'Advanced Search');
  const finalCollapseButtonText =
    collapseButtonText || t('common.collapse', 'Hide Advanced Search');
  const finalTitle = title || t('common.searchTitle', 'Search');
  const {
    values,
    isExpanded,
    handleChange,
    handleRangeChange,
    handleSearch,
    handleReset,
    toggleExpanded,
  } = useSearchForm({
    fields,
    onSearch,
    onReset,
    syncWithUrl,
    urlParamsPrefix,
    triggerSearchOnMount,
  });

  // Check if we need to show expand button (more than itemsPerRow fields)
  // If noExpand is true, never show expand button
  const needsExpand = !noExpand && fields.length > itemsPerRow;

  // Fields to display based on expanded state
  // If noExpand is true, always show all fields
  const visibleFields = useMemo(() => {
    if (noExpand) {
      return fields;
    }
    if (!needsExpand || isExpanded) {
      return fields;
    }
    return fields.slice(0, itemsPerRow);
  }, [fields, needsExpand, isExpanded, itemsPerRow, noExpand]);

  // Render field based on type
  const renderField = (field: SearchField) => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            key={field.id}
            label={field.label}
            required={field.required}
            value={values[field.id] || ''}
            onChange={e => {
              handleChange(field.id, e.target.value);
              onFieldChange?.(field.id, e.target.value);
            }}
            {...field.props}
          />
        );

      case 'select':
        return (
          <Select
            key={field.id}
            label={field.label}
            required={field.required}
            options={field.options}
            value={values[field.id] || ''}
            onChange={e => {
              handleChange(field.id, e.target.value);
              onFieldChange?.(field.id, e.target.value);
            }}
            {...field.props}
          />
        );

      case 'date':
        return (
          <DatePicker
            key={field.id}
            label={field.label}
            required={field.required}
            value={values[field.id] || ''}
            onChange={e => {
              handleChange(field.id, e.target.value);
              onFieldChange?.(field.id, e.target.value);
            }}
            {...field.props}
          />
        );

      case 'time':
        return (
          <TimePicker
            key={field.id}
            label={field.label}
            required={field.required}
            value={values[field.id] || ''}
            onChange={e => handleChange(field.id, e.target.value)}
            {...field.props}
          />
        );

      case 'dateRange':
        return (
          <DateRangePicker
            key={field.id}
            label={field.label}
            required={field.required}
            startProps={{
              value: values[field.id]?.start || '',
              onChange: e => {
                handleRangeChange(field.id, 'start', e.target.value);
                onFieldChange?.(field.id, {
                  ...(values[field.id] || {}),
                  start: e.target.value,
                });
              },
            }}
            endProps={{
              value: values[field.id]?.end || '',
              onChange: e => {
                handleRangeChange(field.id, 'end', e.target.value);
                onFieldChange?.(field.id, {
                  ...(values[field.id] || {}),
                  end: e.target.value,
                });
              },
            }}
            {...field.props}
          />
        );

      case 'timeRange':
        return (
          <TimeRangePicker
            key={field.id}
            label={field.label}
            required={field.required}
            startProps={{
              value: values[field.id]?.start || '',
              onChange: e => {
                handleRangeChange(field.id, 'start', e.target.value);
                onFieldChange?.(field.id, {
                  ...(values[field.id] || {}),
                  start: e.target.value,
                });
              },
            }}
            endProps={{
              value: values[field.id]?.end || '',
              onChange: e => {
                handleRangeChange(field.id, 'end', e.target.value);
                onFieldChange?.(field.id, {
                  ...(values[field.id] || {}),
                  end: e.target.value,
                });
              },
            }}
            {...field.props}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full rounded-xl border border-theme-neutral-4 bg-theme-neutral-2/70 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-theme-neutral-7">
              {finalTitle}
            </p>
            <p className="mt-1 text-sm text-theme-neutral-8">
              {t(
                'common.filterHint',
                'Narrow the list with focused filters before running an action.'
              )}
            </p>
          </div>

          {needsExpand && (
            <button
              type="button"
              onClick={toggleExpanded}
              className="flex items-center gap-2 text-sm font-medium text-theme-main hover:text-theme-hover transition-colors"
            >
              {isExpanded ? finalCollapseButtonText : finalExpandButtonText}
              <Image
                src={isExpanded ? Images.IconCaretDown : Images.IconCaretUp}
                alt="arrow-up"
                width={20}
                height={20}
                style={{ filter: 'var(--theme-filter-main)' }}
              />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div
            className={cn(
              'grid flex-1 gap-3 transition-all duration-300 ease-in-out z-10 relative'
            )}
            style={{
              gridTemplateColumns: `repeat(${itemsPerRow}, minmax(${minItemWidth}px, 1fr))`,
            }}
          >
            {visibleFields.map(field => (
              <div
                key={field.id}
                className={cn(
                  'transition-all duration-300 ease-in-out',
                  isExpanded &&
                    !visibleFields.slice(0, itemsPerRow).includes(field) &&
                    'animate-slideDown'
                )}
              >
                {renderField(field)}
              </div>
            ))}
          </div>

          <div className="flex shrink-0 items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              className="h-10 min-w-[96px] border-theme-neutral-5 bg-white text-theme-neutral-8 hover:bg-theme-neutral-1"
            >
              {finalResetButtonText}
            </Button>
            <Button
              variant="primary"
              onClick={handleSearch}
              className="h-10 min-w-[128px] px-4 shadow-sm"
            >
              <Image
                src={Images.IconSearch}
                alt="search"
                width={18}
                height={18}
                className="mr-2"
              />
              {finalSearchButtonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
