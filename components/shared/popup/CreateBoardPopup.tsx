'use client';

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
import { toBoardCode } from '@/utils/board-code';

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
    formState: { errors, dirtyFields },
  } = useForm<CreateBoardFormData>({
    resolver: zodResolver(createBoardFormSchema),
    defaultValues: {
      title: '',
      boardCode: '',
    },
  });

  // `setValue` không kèm `shouldDirty` nên cờ này chỉ bật khi chính người dùng
  // gõ vào ô mã project.
  const isBoardCodeDirty = !!dirtyFields.boardCode;

  // Gợi ý mã project từ tên, nhưng chỉ khi người dùng chưa tự sửa mã — tránh
  // ghi đè giá trị họ đã chủ động nhập.
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue('title', value);
    if (!isBoardCodeDirty) {
      setValue('boardCode', toBoardCode(value), { shouldValidate: true });
    }
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
    <Modal
      isOpen={open}
      onClose={handleClose}
      size="md"
      title={t('dashboard.createProject.title')}
      closeOnOverlayClick={!isPending}
    >
      <div className="space-y-5">
        <p className="text-sm leading-5 text-theme-neutral-8">
          {t('dashboard.createProject.description')}
        </p>

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

        <div className="flex justify-end gap-3 border-t border-theme-neutral-4 pt-4">
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
        </div>
      </div>
    </Modal>
  );
}
