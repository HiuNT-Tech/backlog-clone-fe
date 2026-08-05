import { z } from 'zod';
import i18n from '@/i18n';

/**
 * Bám đúng ràng buộc của BE (`UpdateProfileDto` / `ChangePasswordDto`) để lỗi
 * hiện ngay dưới ô input thay vì phải gửi lên mới biết.
 */
export const profileFormSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, i18n.t('personalSettings.validation.displayNameMin')),
  // BE validate @IsUrl() nên chuỗi rỗng sẽ bị 400 — dùng optional + literal('')
  // để "không đổi avatar" là hợp lệ, hook sẽ bỏ field này khi rỗng.
  avatar: z
    .string()
    .trim()
    .url(i18n.t('personalSettings.validation.avatarUrl'))
    .or(z.literal('')),
  phone: z.string().trim(),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

export const passwordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, i18n.t('personalSettings.validation.currentPasswordRequired')),
    newPassword: z
      .string()
      .min(8, i18n.t('personalSettings.validation.newPasswordMin')),
    confirmPassword: z
      .string()
      .min(1, i18n.t('personalSettings.validation.confirmPasswordRequired')),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: i18n.t('personalSettings.validation.confirmPasswordMismatch'),
  })
  .refine(data => data.currentPassword !== data.newPassword, {
    path: ['newPassword'],
    message: i18n.t('personalSettings.validation.newPasswordSameAsCurrent'),
  });

export type PasswordFormData = z.infer<typeof passwordFormSchema>;
