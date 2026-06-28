'use client';

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
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateBoardFormData>({
    resolver: zodResolver(createBoardFormSchema),
    defaultValues: {
      title: '',
      boardCode: '',
    },
  });

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
          <DialogTitle>{t('dashboard.createProject.title')}</DialogTitle>
          <DialogDescription>
            {t('dashboard.createProject.description')}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-4"
          id="create-board-form"
        >
          <Input
            label={t('dashboard.createProject.nameLabel')}
            error={errors.title?.message}
            requiredIndicator
            {...register('title')}
            onChange={handleTitleChange}
          />

          <Input
            label={t('dashboard.createProject.codeLable')}
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
            {t('dashboard.createProject.cancel')}
          </Button>
          <Button
            type="submit"
            form="create-board-form"
            variant="primary"
            disabled={isPending}
          >
            {isPending
              ? t('common.loading')
              : t('dashboard.createProject.submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
