'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import Images from '@/assets';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StateMessage } from '@/components/ui/state-message';
import { useMe } from '@/hooks/use-me';
import {
  profileFormSchema,
  type ProfileFormData,
} from '@/validation/profile-form-schemas';
import type { UpdateProfileRequest } from '@/config/interface';

/** Ô chỉ đọc — dữ liệu người dùng không tự đổi được ở màn này. */
const ReadOnlyField = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-sm font-medium text-theme-neutral-11">{label}</span>
    <span className="rounded-md border border-theme-neutral-4 bg-theme-neutral-2 px-3 py-2 text-sm text-theme-neutral-9">
      {value}
    </span>
    {hint && <span className="text-xs text-theme-neutral-7">{hint}</span>}
  </div>
);

export function ProfileTab() {
  const { t } = useTranslation();
  const {
    profile,
    isLoading,
    profileError,
    refetchProfile,
    updateProfile,
    isUpdateProfilePending,
  } = useMe();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { displayName: '', avatar: '', phone: '' },
  });

  // Điền form khi profile về (hoặc sau khi refetch) — reset để `isDirty` tính
  // lại từ giá trị mới, tránh nút Lưu sáng lên khi chưa sửa gì.
  useEffect(() => {
    if (profile) {
      reset({
        displayName: profile.displayName,
        avatar: profile.avatar ?? '',
        phone: profile.phone ?? '',
      });
    }
  }, [profile, reset]);

  // useWatch thay vì watch(): watch() trả về hàm mới mỗi render nên React
  // Compiler bỏ qua memo hoá cả component.
  const avatarPreview = useWatch({ control, name: 'avatar' });

  const onSubmit = async (data: ProfileFormData) => {
    // BE validate avatar bằng @IsUrl() nên chuỗi rỗng sẽ bị từ chối — bỏ hẳn
    // field khỏi payload thay vì gửi ''. `phone` thì nhận chuỗi rỗng.
    const payload: UpdateProfileRequest = {
      displayName: data.displayName,
      phone: data.phone,
      ...(data.avatar ? { avatar: data.avatar } : {}),
    };
    await updateProfile(payload);
  };

  if (isLoading) {
    return (
      <StateMessage
        variant="block"
        spinner
        i18nKey="common.loading"
        className="py-16"
      />
    );
  }

  if (profileError || !profile) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm text-red-500">
          {t('personalSettings.profile.loadFailed')}
        </p>
        <Button variant="outline" size="sm" onClick={() => refetchProfile()}>
          {t('common.retry')}
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-w-2xl flex-col gap-6"
    >
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full border border-theme-neutral-4 bg-theme-neutral-2">
          <Image
            src={avatarPreview || Images.defaultAvatar}
            alt=""
            width={64}
            height={64}
            className="h-16 w-16 object-cover"
            // Ảnh avatar là URL người dùng tự dán, không nằm trong danh sách
            // domain cho phép của next/image nên phải tắt tối ưu hoá.
            unoptimized
          />
        </div>
        <div className="flex-1">
          <Input
            label={t('personalSettings.profile.avatarLabel')}
            placeholder={t('personalSettings.profile.avatarPlaceholder')}
            error={errors.avatar?.message}
            {...register('avatar')}
          />
          <p className="mt-1 text-xs text-theme-neutral-7">
            {t('personalSettings.profile.avatarHint')}
          </p>
        </div>
      </div>

      <Input
        label={t('personalSettings.profile.displayNameLabel')}
        error={errors.displayName?.message}
        requiredIndicator
        {...register('displayName')}
      />

      <Input
        label={t('personalSettings.profile.phoneLabel')}
        placeholder={t('personalSettings.profile.phonePlaceholder')}
        error={errors.phone?.message}
        {...register('phone')}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <ReadOnlyField
          label="Email"
          value={profile.email}
          hint={t('personalSettings.profile.emailHint')}
        />
        <ReadOnlyField
          label={t('personalSettings.profile.userCodeLabel')}
          value={profile.userCode ?? '—'}
          hint={t('personalSettings.profile.userCodeHint')}
        />
      </div>

      <div className="flex justify-end gap-2 border-t border-theme-neutral-4 pt-5">
        <Button
          type="button"
          variant="outline"
          disabled={!isDirty || isUpdateProfilePending}
          onClick={() =>
            reset({
              displayName: profile.displayName,
              avatar: profile.avatar ?? '',
              phone: profile.phone ?? '',
            })
          }
        >
          {t('personalSettings.profile.reset')}
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={!isDirty || isUpdateProfilePending}
        >
          {isUpdateProfilePending
            ? t('common.loading')
            : t('personalSettings.profile.submit')}
        </Button>
      </div>
    </form>
  );
}
