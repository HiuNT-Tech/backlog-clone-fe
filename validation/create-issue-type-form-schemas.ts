import { z } from 'zod';
import type { ColorStatusKey } from '@/constant/data';
import i18n from '@/i18n';

const COLOR_KEYS: ColorStatusKey[] = [
  'red',
  'orange',
  'pink',
  'indigo',
  'blue',
  'teal',
  'green',
  'yellow',
  'bright-red',
  'black',
];

export const createIssueTypeFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, i18n.t('validation.fieldRequired'))
    .min(3, i18n.t('settings.issueTypes.validation.titleMin'))
    .max(50, i18n.t('settings.issueTypes.validation.titleMax')),
  selectedColorKey: z.enum(
    COLOR_KEYS as unknown as [ColorStatusKey, ...ColorStatusKey[]],
    {
      required_error: i18n.t('settings.issueTypes.validation.colorRequired'),
    }
  ),
});

export type CreateIssueTypeFormData = z.infer<typeof createIssueTypeFormSchema>;
