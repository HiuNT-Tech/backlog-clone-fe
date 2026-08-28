'use client';

import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMe } from '@/hooks/use-me';
import {
  changePasswordFormSchema,
  type ChangePasswordFormData,
} from '@/validation/settings-form-schemas';

export function PasswordTab() {
  const { t } = useTranslation();
  const { changePassword, isChangePasswordPending } = useMe();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(
      changePasswordFormSchema
    ) as Resolver<ChangePasswordFormData>,
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const getFieldError = (
    field: keyof ChangePasswordFormData
  ): string | undefined => {
    const msg = errors[field]?.message;
    return typeof msg === 'string' ? msg : undefined;
  };

  const onSubmit = async (data: ChangePasswordFormData) => {
    await changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-theme-neutral-11">
          {t('accountSettings.password.heading')}
        </h2>
        <p className="text-sm text-theme-neutral-8">
          {t('accountSettings.password.hint')}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md space-y-6"
        autoComplete="off"
      >
        <Input
          type="password"
          label={t('accountSettings.password.currentPasswordLabel')}
          requiredIndicator
          error={getFieldError('currentPassword')}
          {...register('currentPassword')}
          disabled={isChangePasswordPending}
          autoComplete="current-password"
        />

        <Input
          type="password"
          label={t('accountSettings.password.newPasswordLabel')}
          requiredIndicator
          error={getFieldError('newPassword')}
          {...register('newPassword')}
          disabled={isChangePasswordPending}
          autoComplete="new-password"
        />

        <Input
          type="password"
          label={t('accountSettings.password.confirmPasswordLabel')}
          requiredIndicator
          error={getFieldError('confirmPassword')}
          {...register('confirmPassword')}
          disabled={isChangePasswordPending}
          autoComplete="new-password"
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-theme-main text-theme-neutral-1 hover:bg-theme-hover min-w-[120px]"
            disabled={isChangePasswordPending}
          >
            {t('common.submit')}
          </Button>
        </div>
      </form>
    </div>
  );
}
