'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { renderStatusBadge, getIssueTypeBadgeClassName } from '@/constant/data';
import type { ColorStatusKey } from '@/constant/data';
import { useIssueType } from '@/hooks/use-issue-type';
import {
  createIssueTypeFormSchema,
  type CreateIssueTypeFormData,
} from '@/validation/create-issue-type-form-schemas';
import { cn } from '@/lib/utils';
import type { EntityId } from '@/config/interface';

export interface IssueTypeCreateFormProps {
  boardId: EntityId;
  onClose: () => void;
  onSubmit: (data: CreateIssueTypeFormData) => Promise<void>;
  isPending: boolean;
}

export const IssueTypeCreateForm: React.FC<IssueTypeCreateFormProps> = ({
  boardId,
  onClose,
  onSubmit,
  isPending,
}) => {
  const { t } = useTranslation();
  const { issueTypes, isLoading } = useIssueType(boardId);

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
          {t('settings.issueTypes.add.back')}
        </button>

        <div>
          <h2 className="text-lg font-semibold text-theme-neutral-11">
            {t('settings.issueTypes.add.title')}
          </h2>
          <p className="text-sm text-theme-neutral-8">
            {t('settings.issueTypes.add.description')}
          </p>
        </div>

        <div className="space-y-4 rounded-lg border border-theme-neutral-4 bg-theme-neutral-1 px-4 py-4">
          <Input
            label={t('settings.issueTypes.add.nameLabel')}
            requiredIndicator
            placeholder={t('settings.issueTypes.add.namePlaceholder')}
            error={getFieldError('name')}
            {...register('name')}
            disabled={isPending}
          />
          <p className="text-xs text-theme-neutral-8">
            {t('settings.issueTypes.add.nameHint')}
          </p>
        </div>

        <div className="space-y-3 rounded-lg border border-theme-neutral-4 bg-theme-neutral-1 px-4 py-4">
          <div>
            <p className="text-sm font-medium text-theme-neutral-11">
              {t('settings.issueTypes.add.backgroundLabel')}
              <span className="text-red-500 ml-1">*</span>
            </p>
            <p className="text-xs text-theme-neutral-8">
              {t('settings.issueTypes.add.backgroundHint')}
            </p>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {renderStatusBadge(
              selectedColorKey ?? 'blue',
              (key: ColorStatusKey) => setValue('selectedColorKey', key),
              t,
              name || t('settings.issueTypes.add.colorSample')
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
            {t('settings.issueTypes.add.existingLabel')}
          </p>
          <div className="flex flex-wrap gap-2">
            {isLoading ? (
              <p className="text-xs text-theme-neutral-8">
                {t('common.loading')}
              </p>
            ) : issueTypes.length === 0 ? (
              <p className="text-xs text-theme-neutral-8">
                {t('settings.issueTypes.table.empty')}
              </p>
            ) : (
              issueTypes.map(type => (
                <span
                  key={type.id}
                  className={cn(
                    'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-white',
                    getIssueTypeBadgeClassName(type.statusColor)
                  )}
                >
                  {type.name}
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
            {t('settings.issueTypes.add.cancel')}
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-theme-main text-theme-neutral-1 hover:bg-theme-hover"
          >
            {t('settings.issueTypes.add.save')}
          </Button>
        </div>
      </form>
    </div>
  );
};
