import { z } from 'zod';
import i18n from '@/i18n';
import {
  BOARD_CODE_MAX_LENGTH,
  BOARD_CODE_MIN_LENGTH,
  BOARD_CODE_PATTERN,
} from '@/utils/board-code';

export const createBoardFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, i18n.t('dashboard.validation.nameRequired'))
    .max(50, i18n.t('dashboard.validation.nameMax'))
    .refine(val => val.trim().length > 0, {
      message: i18n.t('dashboard.validation.nameEmpty'),
    }),
  // Bám đúng ràng buộc của BE để lỗi hiện ngay dưới ô input, thay vì gửi lên
  // rồi nhận 400 kèm toast chung chung không nói được sai ở đâu.
  boardCode: z
    .string()
    .trim()
    .min(1, i18n.t('dashboard.validation.codeRequired'))
    .min(BOARD_CODE_MIN_LENGTH, i18n.t('dashboard.validation.codeMin'))
    .max(BOARD_CODE_MAX_LENGTH, i18n.t('dashboard.validation.codeMax'))
    .regex(BOARD_CODE_PATTERN, i18n.t('dashboard.validation.codeFormat')),
});

export type CreateBoardFormData = z.infer<typeof createBoardFormSchema>;
