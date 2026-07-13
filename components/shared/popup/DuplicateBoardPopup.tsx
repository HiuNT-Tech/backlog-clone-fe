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

interface DuplicateBoardDialogProps {
  open: boolean;
  sourceTitle: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateBoardFormData) => Promise<void>;
  isPending: boolean;
}

export default function DuplicateBoardDialog({
  open,
  sourceTitle,
  onOpenChange,
  onSubmit,
  isPending,
}: DuplicateBoardDialogProps) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateBoardFormData>({
    resolver: zodResolver(createBoardFormSchema),
    defaultValues: {
      title: '',
      boardCode: '',
    },
  });

  // Gợi ý sẵn tên/mã dựa trên board nguồn mỗi khi mở dialog cho 1 board mới.
  useEffect(() => {
    if (open) {
      reset({ title: `${sourceTitle} (copy)`, boardCode: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, sourceTitle]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue('title', value);
    setValue('boardCode', value.toUpperCase());
  };

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
          <DialogTitle>{t('dashboard.duplicateProject.title')}</DialogTitle>
          <DialogDescription>
            {t('dashboard.duplicateProject.description', { sourceTitle })}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-4"
          id="duplicate-board-form"
        >
          <Input
            label={t('dashboard.duplicateProject.nameLabel')}
            error={errors.title?.message}
            requiredIndicator
            {...register('title')}
            onChange={handleTitleChange}
          />

          <Input
            label={t('dashboard.duplicateProject.codeLable')}
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
            {t('dashboard.duplicateProject.cancel')}
          </Button>
          <Button
            type="submit"
            form="duplicate-board-form"
            variant="primary"
            disabled={isPending}
          >
            {isPending
              ? t('common.loading')
              : t('dashboard.duplicateProject.submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
