'use client';

import React, { useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import {
  createVersionFormSchema,
  type CreateVersionFormData,
} from '@/validation/version-form-schema';
import type { Version } from '@/config/interface';

export interface VersionFormProps {
  /** null = create, Version = edit */
  editingVersion: Version | null;
  onClose: () => void;
  onSubmit: (data: CreateVersionFormData) => Promise<void>;
  isPending: boolean;
}

export const VersionForm: React.FC<VersionFormProps> = ({
  editingVersion,
  onClose,
  onSubmit,
  isPending,
}) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<CreateVersionFormData>({
    resolver: zodResolver(
      createVersionFormSchema
    ) as Resolver<CreateVersionFormData>,
    defaultValues: {
      name: '',
      startDate: '',
      endDate: '',
      description: '',
    },
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  useEffect(() => {
    if (editingVersion) {
      reset({
        name: editingVersion.name,
        startDate: editingVersion.startDate ?? '',
        endDate: editingVersion.endDate ?? '',
        description: editingVersion.description ?? '',
      });
    } else {
      reset({
        name: '',
        startDate: '',
        endDate: '',
        description: '',
      });
    }
  }, [editingVersion, reset]);

  const getFieldError = (
    field: keyof CreateVersionFormData
  ): string | undefined => {
    const msg = errors[field]?.message;
    return typeof msg === 'string' ? msg : undefined;
  };

  const onError = () => {
    setTimeout(() => {}, 200);
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        className="text-sm text-theme-main hover:underline cursor-pointer"
        onClick={onClose}
      >
        {t('settings.issueTypes.add.back')}
      </button>

      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-theme-neutral-11">
          {t('settings.versions.heading')}
        </h2>
        <p className="text-sm text-theme-neutral-8">
          {t('settings.versions.hint')}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        <div className="space-y-2">
          <Input
            label={t('settings.versions.add.nameLabel')}
            requiredIndicator
            placeholder={t('settings.versions.add.namePlaceholder')}
            error={getFieldError('name')}
            {...register('name')}
            disabled={isPending}
          />
        </div>

        <div className="space-y-3 rounded-lg border border-theme-neutral-4 bg-theme-neutral-1 px-4 py-4">
          <p className="text-sm font-medium text-theme-neutral-11">
            {t('settings.versions.add.setDateLabel')}
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <DatePicker
                label={t('settings.versions.table.startDate')}
                value={startDate ?? ''}
                {...register('startDate')}
                error={getFieldError('startDate')}
                onChange={e => {
                  setValue('startDate', e.target.value);
                  void trigger('endDate');
                }}
                placeholder={t('settings.versions.add.datePlaceholder')}
              />
            </div>
            <div className="space-y-1">
              <DatePicker
                label={t('settings.versions.table.endDate')}
                value={endDate ?? ''}
                {...register('endDate')}
                error={getFieldError('endDate')}
                onChange={e => {
                  setValue('endDate', e.target.value);
                  void trigger('endDate');
                }}
                placeholder={t('settings.versions.add.datePlaceholder')}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Textarea
            label={t('settings.versions.add.descriptionLabel')}
            placeholder={t('settings.versions.add.descriptionPlaceholder')}
            error={getFieldError('description')}
            rows={4}
            {...register('description')}
            disabled={isPending}
          />
          <p className="text-xs text-theme-neutral-8">
            {t('settings.versions.add.descriptionHint')}
          </p>
        </div>

        <div className="flex justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="border-theme-neutral-5 text-theme-neutral-9"
            onClick={onClose}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            className="bg-theme-main text-theme-neutral-1 hover:bg-theme-hover min-w-[120px]"
            disabled={isPending}
          >
            {t('common.submit')}
          </Button>
        </div>
      </form>
    </div>
  );
};
