'use client';

import { useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageUpload } from '@/components/shared/image-upload';
import { UserAvatar } from '@/components/ui/user-avatar';
import { useMe } from '@/hooks/use-me';
import {
  updateProfileFormSchema,
  type UpdateProfileFormData,
} from '@/validation/settings-form-schemas';

export function ProfileTab() {
  const { t } = useTranslation();
  const {
    profile,
    isProfileLoading,
    updateProfile,
    isUpdateProfilePending,
    uploadAvatar,
  } = useMe();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(
      updateProfileFormSchema
    ) as Resolver<UpdateProfileFormData>,
    defaultValues: { displayName: '', phone: '' },
  });

  useEffect(() => {
    if (profile) {
      reset({
        displayName: profile.displayName,
        phone: profile.phone ?? '',
      });
    }
  }, [profile, reset]);

  const displayName = watch('displayName');

  const getFieldError = (
    field: keyof UpdateProfileFormData
  ): string | undefined => {
    const msg = errors[field]?.message;
    return typeof msg === 'string' ? msg : undefined;
  };

  const onSubmit = async (data: UpdateProfileFormData) => {
    await updateProfile({
      displayName: data.displayName,
      phone: data.phone || undefined,
    });
  };

  if (isProfileLoading) {
    return (
      <p className="text-sm text-theme-neutral-8">{t('common.loading')}</p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-theme-neutral-11">
          {t('accountSettings.profile.heading')}
        </h2>
        <p className="text-sm text-theme-neutral-8">
          {t('accountSettings.profile.hint')}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center gap-4">
          <ImageUpload
            value={profile?.avatar}
            onUpload={uploadAvatar}
            size={64}
            alt={displayName || profile?.email || ''}
            fallback={
              <UserAvatar name={displayName || profile?.email} size={64} />
            }
          />
        </div>

        <Input
          label={t('accountSettings.profile.emailLabel')}
          value={profile?.email ?? ''}
          disabled
        />

        {profile?.userCode && (
          <Input
            label={t('accountSettings.profile.userCodeLabel')}
            value={profile.userCode}
            disabled
          />
        )}

        <Input
          label={t('accountSettings.profile.displayNameLabel')}
          requiredIndicator
          placeholder={t('accountSettings.profile.displayNamePlaceholder')}
          error={getFieldError('displayName')}
          {...register('displayName')}
          disabled={isUpdateProfilePending}
        />

        <Input
          label={t('accountSettings.profile.phoneLabel')}
          placeholder={t('accountSettings.profile.phonePlaceholder')}
          error={getFieldError('phone')}
          {...register('phone')}
          disabled={isUpdateProfilePending}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-theme-main text-theme-neutral-1 hover:bg-theme-hover min-w-[120px]"
            disabled={isUpdateProfilePending}
          >
            {t('common.submit')}
          </Button>
        </div>
      </form>
    </div>
  );
}
