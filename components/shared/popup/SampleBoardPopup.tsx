'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  createBoardFormSchema,
  CreateBoardFormData,
} from '@/validation/create-board-form-schemas';

interface SampleBoardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateBoardFormData) => Promise<void>;
  isPending: boolean;
}

/** Mã project mặc định — hợp lệ với BE (chữ in hoa, không dấu, không khoảng trắng). */
const DEFAULT_SAMPLE_BOARD_CODE = 'SAMPLE';

export default function SampleBoardDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: SampleBoardDialogProps) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBoardFormData>({
    resolver: zodResolver(createBoardFormSchema),
    defaultValues: {
      title: '',
      boardCode: DEFAULT_SAMPLE_BOARD_CODE,
    },
  });

  // Điền sẵn tên/mã hợp lệ mỗi lần mở dialog, để người dùng chưa quen tool chỉ
  // cần bấm "Tạo" là có ngay project mẫu, không phải tự nghĩ ra tên.
  useEffect(() => {
    if (open) {
      reset({
        title: t('dashboard.sampleProject.defaultTitle'),
        boardCode: DEFAULT_SAMPLE_BOARD_CODE,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleFormSubmit = async (data: CreateBoardFormData) => {
    await onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] bg-white">
        <DialogHeader>
          <DialogTitle>{t('dashboard.sampleProject.title')}</DialogTitle>
          <DialogDescription>
            {t('dashboard.sampleProject.description')}
          </DialogDescription>
        </DialogHeader>

        <ul className="flex flex-col gap-1 rounded-md bg-theme-neutral-1 p-3 text-sm text-theme-neutral-8">
          <li>• {t('dashboard.sampleProject.includesColumns')}</li>
          <li>• {t('dashboard.sampleProject.includesIssueTypes')}</li>
          <li>• {t('dashboard.sampleProject.includesMilestones')}</li>
          <li>• {t('dashboard.sampleProject.includesTickets')}</li>
        </ul>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-4"
          id="sample-board-form"
        >
          <Input
            label={t('dashboard.sampleProject.nameLabel')}
            error={errors.title?.message}
            requiredIndicator
            {...register('title')}
          />

          <Input
            label={t('dashboard.sampleProject.codeLabel')}
            error={errors.boardCode?.message}
            requiredIndicator
            {...register('boardCode')}
          />
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
          >
            {t('dashboard.sampleProject.cancel')}
          </Button>
          <Button
            type="submit"
            form="sample-board-form"
            variant="primary"
            disabled={isPending}
          >
            {isPending
              ? t('common.loading')
              : t('dashboard.sampleProject.submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
