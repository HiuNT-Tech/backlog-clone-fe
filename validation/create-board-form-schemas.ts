import { z } from 'zod';
import i18n from '@/i18n';

export const createBoardFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, i18n.t('dashboard.validation.nameRequired'))
    .max(50, i18n.t('dashboard.validation.nameMax'))
    .refine(val => val.trim().length > 0, {
      message: i18n.t('dashboard.validation.nameEmpty'),
    }),
  description: z
    .string()
    .trim()
    .max(255, i18n.t('dashboard.validation.descriptionMax'))
    .optional()
    .or(z.literal('')),
});

export type CreateBoardFormData = z.infer<typeof createBoardFormSchema>;
