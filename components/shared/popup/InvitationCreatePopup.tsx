'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Icons from '@/assets/icons';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Select, type SelectValue } from '@/components/ui/select';
import { MemberRole } from '@/config/enum';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  invitationFormSchema,
  type InvitationFormData,
} from '@/validation/invitation-form-schemas';

interface InvitationCreatePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InvitationFormData) => Promise<void>;
  isPending: boolean;
}

export default function InvitationCreatePopup({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: InvitationCreatePopupProps) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<InvitationFormData>({
    resolver: zodResolver(invitationFormSchema),
    defaultValues: {
      email: '',
      role: MemberRole.MEMBER,
    },
  });

  useEffect(() => {
    if (!open) {
      reset({
        email: '',
        role: MemberRole.MEMBER,
      });
    }
  }, [open, reset]);

  const roleOptions = [
    {
      value: MemberRole.MEMBER,
      label: t('settings.members.roleOptions.member'),
    },
    {
      value: MemberRole.PROJECT_MANAGER,
      label: t('settings.members.roleOptions.projectManager'),
    },
    {
      value: MemberRole.GUEST,
      label: t('settings.members.roleOptions.guest'),
    },
    {
      value: MemberRole.ADMINISTRATOR,
      label: t('settings.members.roleOptions.administrator'),
    },
  ];

  const selectedRole = useWatch({
    control,
    name: 'role',
  });

  const handleRoleChange = (value: SelectValue) => {
    setValue('role', value as InvitationFormData['role'], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleClose = () => {
    if (!isPending) {
      onOpenChange(false);
    }
  };

  const handleFormSubmit = async (data: InvitationFormData) => {
    await onSubmit({
      email: data.email.trim(),
      role: data.role,
    });
  };

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      size="md"
      title={
        <span className="flex items-center gap-2 text-theme-neutral-11">
          <Image
            src={Icons.Mail}
            alt=""
            width={20}
            height={20}
            className="h-5 w-5 text-theme-main"
            style={{ filter: 'var(--theme-filter-main)' }}
          />
          {t('settings.invitations.form.title')}
        </span>
      }
    >
      <div className="space-y-5">
        <p className="text-sm leading-5 text-theme-neutral-8">
          {t('settings.invitations.form.description')}
        </p>

        <form
          id="invitation-create-form"
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
          <Input
            type="email"
            label={t('settings.invitations.form.emailLabel')}
            placeholder={t('settings.invitations.form.emailPlaceholder')}
            error={errors.email?.message}
            requiredIndicator
            disabled={isPending}
            {...register('email', {
              setValueAs: (value: string) => value?.trim() || '',
            })}
          />

          <Select
            label={t('settings.invitations.form.roleLabel')}
            options={roleOptions}
            value={selectedRole}
            error={errors.role?.message}
            required
            disabled={isPending}
            onValueChange={handleRoleChange}
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
            form="invitation-create-form"
            variant="primary"
            disabled={isPending}
          >
            <Image
              src={Icons.Send}
              alt=""
              width={16}
              height={16}
              className="mr-2 h-4 w-4"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            {isPending
              ? t('common.loading')
              : t('settings.invitations.form.submit')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
