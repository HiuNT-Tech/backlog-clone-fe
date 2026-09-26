'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/components/ui/modal';
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

const createDefaultSampleBoardCode = () =>
  `SAMPLE-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

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
      boardCode: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: t('dashboard.sampleProject.defaultTitle'),
        boardCode: createDefaultSampleBoardCode(),
      });
    }
  }, [open, reset, t]);

  const handleFormSubmit = async (data: CreateBoardFormData) => {
    await onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      size="md"
      title={t('dashboard.sampleProject.title')}
      closeOnOverlayClick={!isPending}
    >
      <div className="space-y-5">
        <p className="text-sm leading-5 text-theme-neutral-8">
          {t('dashboard.sampleProject.description')}
        </p>

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

        <div className="flex justify-end gap-3 border-t border-theme-neutral-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
          >
            {t('common.cancel')}
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
        </div>
      </div>
    </Modal>
  );
}
