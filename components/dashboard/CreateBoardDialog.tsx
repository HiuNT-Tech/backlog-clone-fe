'use client';

import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  createBoardFormSchema,
  CreateBoardFormData,
} from '@/validation/create-board-form-schemas';

interface CreateBoardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateBoardFormData) => Promise<void>;
  isPending: boolean;
}

export default function CreateBoardDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: CreateBoardDialogProps) {
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
      description: '',
    },
  });

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
          <DialogTitle>{t('dashboard.createBoard.title')}</DialogTitle>
          <DialogDescription>
            {t('dashboard.createBoard.description')}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-4"
          id="create-board-form"
        >
          <Input
            label={t('dashboard.createBoard.nameLabel')}
            placeholder={t('dashboard.createBoard.namePlaceholder')}
            error={errors.title?.message}
            requiredIndicator
            {...register('title')}
          />

          <Textarea
            label={t('dashboard.createBoard.descriptionLabel')}
            placeholder={t('dashboard.createBoard.descriptionPlaceholder')}
            error={errors.description?.message}
            {...register('description')}
          />
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
          >
            {t('dashboard.createBoard.cancel')}
          </Button>
          <Button
            type="submit"
            form="create-board-form"
            variant="primary"
            disabled={isPending}
          >
            {isPending
              ? t('common.loading')
              : t('dashboard.createBoard.submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
