'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMe } from '@/hooks/use-me';
import {
  passwordFormSchema,
  type PasswordFormData,
} from '@/validation/profile-form-schemas';

export function PasswordTab() {
  const { t } = useTranslation();
  const { changePassword, isChangePasswordPending } = useMe();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: PasswordFormData) => {
    await changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    // Xoá form sau khi đổi thành công để không giữ mật khẩu trong input.
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-w-md flex-col gap-6"
    >
      <p className="text-sm text-theme-neutral-8">
        {t('personalSettings.password.description')}
      </p>

      <Input
        type="password"
        autoComplete="current-password"
        label={t('personalSettings.password.currentLabel')}
        error={errors.currentPassword?.message}
        requiredIndicator
        {...register('currentPassword')}
      />

      <Input
        type="password"
        autoComplete="new-password"
        label={t('personalSettings.password.newLabel')}
        error={errors.newPassword?.message}
        requiredIndicator
        {...register('newPassword')}
      />

      <Input
        type="password"
        autoComplete="new-password"
        label={t('personalSettings.password.confirmLabel')}
        error={errors.confirmPassword?.message}
        requiredIndicator
        {...register('confirmPassword')}
      />

      <div className="flex justify-end border-t border-theme-neutral-4 pt-5">
        <Button
          type="submit"
          variant="primary"
          disabled={isChangePasswordPending}
        >
          {isChangePasswordPending
            ? t('common.loading')
            : t('personalSettings.password.submit')}
        </Button>
      </div>
    </form>
  );
}
