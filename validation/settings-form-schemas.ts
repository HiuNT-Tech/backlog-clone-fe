import { z } from 'zod';
import i18n from '@/i18n';
import regex from '@/constant/regex';

export const updateProfileFormSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, i18n.t('validation.fieldRequired'))
    .min(2, i18n.t('accountSettings.profile.validation.displayNameMin')),
  phone: z.string().trim(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileFormSchema>;

export const changePasswordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .trim()
      .min(1, i18n.t('validation.fieldRequired')),
    newPassword: z
      .string()
      .trim()
      .min(1, i18n.t('validation.fieldRequired'))
      .refine(value => regex.password.test(value), {
        message: i18n.t('validation.passwordRule'),
      }),
    confirmPassword: z
      .string()
      .trim()
      .min(1, i18n.t('validation.fieldRequired')),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: i18n.t('validation.passwordConfirmation'),
    path: ['confirmPassword'],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordFormSchema>;
