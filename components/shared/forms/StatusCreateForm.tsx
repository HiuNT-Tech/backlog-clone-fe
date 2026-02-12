'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { renderStatusBadge, getIssueTypeBadgeClassName } from '@/constant/data';
import type { ColorStatusKey } from '@/constant/data';
import { useColumn } from '@/hooks/use-column';
import {
  createIssueTypeFormSchema,
  type CreateIssueTypeFormData,
} from '@/validation/create-issue-type-form-schemas';
import { cn } from '@/lib/utils';

export interface StatusCreateFormProps {
  onClose: () => void;
  onSubmit: (data: CreateIssueTypeFormData) => Promise<void>;
  isPending: boolean;
}

export const StatusCreateForm: React.FC<StatusCreateFormProps> = ({
  onClose,
  onSubmit,
  isPending,
}) => {
  const { t } = useTranslation();
  const { columns, isLoadingList } = useColumn();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateIssueTypeFormData>({
    resolver: zodResolver(createIssueTypeFormSchema),
    defaultValues: {
      name: '',
      selectedColorKey: 'blue' as ColorStatusKey,
    },
  });

  const selectedColorKey = watch('selectedColorKey');
  const name = watch('name');

  const getFieldError = (
    field: keyof CreateIssueTypeFormData
  ): string | undefined => {
    const msg = errors[field]?.message;
    return typeof msg === 'string' ? msg : undefined;
  };

  const onError = () => {
    setTimeout(() => {}, 200);
  };

  const handleClose = () => {
    reset({ name: '', selectedColorKey: 'blue' });
    onClose();
  };

  return (
    <div className="space-y-4">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit, onError)}>
        <button
          type="button"
          className="text-sm text-theme-main hover:underline cursor-pointer"
          onClick={handleClose}
        >
          {t('settings.statuses.add.back')}
        </button>

        <div>
          <h2 className="text-lg font-semibold text-theme-neutral-11">
            {t('settings.statuses.add.title')}
          </h2>
          <p className="text-sm text-theme-neutral-8">
            {t('settings.statuses.add.description')}
          </p>
        </div>

        <div className="space-y-4 rounded-lg border border-theme-neutral-4 bg-theme-neutral-1 px-4 py-4">
          <Input
            label={t('settings.statuses.add.nameLabel')}
            requiredIndicator
            placeholder={t('settings.statuses.add.namePlaceholder')}
            error={getFieldError('name')}
            {...register('name')}
            disabled={isPending}
          />
          <p className="text-xs text-theme-neutral-8">
            {t('settings.statuses.add.nameHint')}
          </p>
        </div>

        <div className="space-y-3 rounded-lg border border-theme-neutral-4 bg-theme-neutral-1 px-4 py-4">
          <div>
            <p className="text-sm font-medium text-theme-neutral-11">
              {t('settings.statuses.add.backgroundLabel')}
              <span className="text-red-500 ml-1">*</span>
            </p>
            <p className="text-xs text-theme-neutral-8">
              {t('settings.statuses.add.backgroundHint')}
            </p>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {renderStatusBadge(
              selectedColorKey ?? 'blue',
              (key: ColorStatusKey) => setValue('selectedColorKey', key),
              t,
              name || t('settings.statuses.add.colorSample')
            )}
          </div>
          {getFieldError('selectedColorKey') && (
            <p className="text-xs text-red-500 mt-1">
              {getFieldError('selectedColorKey')}
            </p>
          )}
        </div>

        <div className="space-y-3 rounded-lg border border-theme-neutral-4 bg-theme-neutral-1 px-4 py-4">
          <p className="text-sm font-medium text-theme-neutral-11">
            {t('settings.statuses.add.existingLabel')}
          </p>
          <div className="flex flex-wrap gap-2">
            {isLoadingList ? (
              <p className="text-xs text-theme-neutral-8">
                {t('common.loading')}
              </p>
            ) : columns?.length === 0 ? (
              <p className="text-xs text-theme-neutral-8">
                {t('settings.statuses.table.empty')}
              </p>
            ) : (
              columns?.map(column => (
                <span
                  key={column._id}
                  className={cn(
                    'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-white',
                    getIssueTypeBadgeClassName(column.statusColor)
                  )}
                >
                  {column.title}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="border-theme-neutral-5 text-theme-neutral-9"
            onClick={handleClose}
          >
            {t('settings.statuses.add.cancel')}
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-theme-main text-theme-neutral-1 hover:bg-theme-hover"
          >
            {t('settings.statuses.add.save')}
          </Button>
        </div>
      </form>
    </div>
  );
};
