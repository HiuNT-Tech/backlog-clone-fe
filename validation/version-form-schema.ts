import { z } from 'zod';
import i18n from '@/i18n';
import dayjs from 'dayjs';

/** Schema cho form tạo version mới (name bắt buộc) */
export const createVersionFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, i18n.t('validation.fieldRequired'))
      .min(3, i18n.t('settings.versions.validation.nameMin'))
      .max(50, i18n.t('settings.versions.validation.nameMax')),
    startDate: z.string().trim(),
    endDate: z.string().trim(),
    description: z
      .string()
      .trim()
      .max(500, i18n.t('settings.versions.validation.descriptionMax')),
  })
  .refine(
    data => {
      const start = (data.startDate ?? '').trim();
      const end = (data.endDate ?? '').trim();
      if (!start || !end) return true;
      return (
        dayjs(start).startOf('day').valueOf() <=
        dayjs(end).startOf('day').valueOf()
      );
    },
    {
      message: i18n.t('settings.versions.validation.startDateBeforeEndDate'),
      path: ['endDate'],
    }
  );

export type CreateVersionFormData = z.infer<typeof createVersionFormSchema>;

/** Schema cho form cập nhật version (name không cần min length 1) */
export const updateVersionFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, i18n.t('settings.versions.validation.nameMin'))
      .max(50, i18n.t('settings.versions.validation.nameMax')),
    startDate: z.string().trim().default(''),
    endDate: z.string().trim().default(''),
    description: z
      .string()
      .trim()
      .max(500, i18n.t('settings.versions.validation.descriptionMax'))
      .default(''),
  })
  .refine(
    data => {
      const start = (data.startDate ?? '').trim();
      const end = (data.endDate ?? '').trim();
      if (!start || !end) return true;
      return (
        dayjs(start).startOf('day').valueOf() <=
        dayjs(end).startOf('day').valueOf()
      );
    },
    {
      message: i18n.t('settings.versions.validation.startDateBeforeEndDate'),
      path: ['endDate'],
    }
  );

export type UpdateVersionFormData = z.infer<typeof updateVersionFormSchema>;
