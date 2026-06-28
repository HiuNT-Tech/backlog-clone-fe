'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Select, type SelectValue } from '@/components/ui/select';
import { MultiOptionsList } from '@/components/ui/multi-options-list';
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

  const finalSearchButtonText = searchButtonText || t('common.search');
  const finalResetButtonText = resetButtonText || t('common.reset');
  const finalExpandButtonText = expandButtonText || t('common.expand');
  const finalCollapseButtonText = collapseButtonText || t('common.collapse');
  const finalTitle = title || t('common.searchTitle');
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

      case 'select': {
        const selectValue = field.selectMulti
          ? Array.isArray(values[field.id])
            ? values[field.id]
            : values[field.id]
              ? [values[field.id]]
              : []
          : Array.isArray(values[field.id])
            ? (values[field.id][0] ?? '')
            : (values[field.id] ?? '');

        return (
          <Select
            key={field.id}
            {...field.props}
            label={field.label}
            required={field.required}
            options={field.options}
            value={selectValue}
            mode={field.selectMulti ? 'multiple' : undefined}
            showSearch={field.selectMulti ? true : field.props?.showSearch}
            clearAllLabel={
              field.selectMulti
                ? (field.props?.clearAllLabel ?? t('common.unselect'))
                : field.props?.clearAllLabel
            }
            onValueChange={(nextValue: SelectValue) => {
              handleChange(field.id, nextValue);
              onFieldChange?.(field.id, nextValue);
            }}
          />
        );
      }

      case 'multiOptions': {
        const multiValue = Array.isArray(values[field.id])
          ? values[field.id]
          : values[field.id]
            ? [values[field.id]]
            : [];

        return (
          <MultiOptionsList
            key={field.id}
            label={field.label}
            options={field.options}
            value={multiValue}
            onChange={(nextValue: string[]) => {
              handleChange(field.id, nextValue);
              onFieldChange?.(field.id, nextValue);
            }}
            {...field.props}
          />
        );
      }

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
              {t('common.filterHint')}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div
            className={cn(
              'grid flex-1 gap-3 transition-all duration-300 ease-in-out z-10 relative'
            )}
            style={{
              gridTemplateColumns: `repeat(${itemsPerRow}, minmax(${minItemWidth}px, 1fr))`,
            }}
          >
            {fields.map(field => (
              <div key={field.id} className="">
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
