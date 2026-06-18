'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, type SelectValue } from '@/components/ui/select';
import { MemberRole } from '@/config/enum';
import {
  invitationFormSchema,
  type InvitationFormData,
} from '@/validation/invitation-form-schemas';

interface InvitationCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InvitationFormData) => Promise<void>;
  isPending: boolean;
}

export default function InvitationCreateDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: InvitationCreateDialogProps) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
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

  const selectedRole = watch('role');

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
    <Dialog open={open} onOpenChange={nextOpen => !nextOpen && handleClose()}>
      <DialogContent className="bg-theme-neutral-1 sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-theme-neutral-11">
            <Mail className="h-5 w-5 text-theme-main" />
            {t('settings.invitations.form.title')}
          </DialogTitle>
          <DialogDescription className="text-theme-neutral-8">
            {t('settings.invitations.form.description')}
          </DialogDescription>
        </DialogHeader>

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

        <DialogFooter>
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
            <Send className="mr-2 h-4 w-4" />
            {isPending
              ? t('common.loading')
              : t('settings.invitations.form.submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
