'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Icons from '@/assets/icons';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Select, type SelectValue } from '@/components/ui/select';
import { MemberRole } from '@/config/enum';
import type { BoardMemberRole, UserBoardMember } from '@/config/interface';

interface MemberRoleEditPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: UserBoardMember | null;
  onSubmit: (userId: number, role: BoardMemberRole) => Promise<void>;
  isPending: boolean;
}

export default function MemberRoleEditPopup({
  open,
  onOpenChange,
  member,
  onSubmit,
  isPending,
}: MemberRoleEditPopupProps) {
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState<string>(
    member?.role ?? MemberRole.MEMBER
  );

  useEffect(() => {
    if (open && member) {
      setSelectedRole(member.role);
    }
  }, [open, member]);

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

  const handleRoleChange = (value: SelectValue) => {
    setSelectedRole(value as string);
  };

  const handleClose = () => {
    if (!isPending) {
      onOpenChange(false);
    }
  };

  const handleSubmit = async () => {
    if (!member) return;
    await onSubmit(member.userId, selectedRole as BoardMemberRole);
  };

  const isUnchanged = selectedRole === member?.role;

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      size="sm"
      title={
        <span className="flex items-center gap-2 text-theme-neutral-11">
          <Image
            src={Icons.Pencil}
            alt=""
            width={20}
            height={20}
            className="h-5 w-5 text-theme-main"
            style={{ filter: 'var(--theme-filter-main)' }}
          />
          {t('settings.members.editRoleModal.title')}
        </span>
      }
    >
      <div className="space-y-5">
        <p className="text-sm leading-5 text-theme-neutral-8">
          {t('settings.members.editRoleModal.description')}
        </p>

        {member && (
          <div className="flex items-center gap-3 rounded-lg bg-theme-neutral-2 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-theme-main text-sm font-semibold text-white">
              {(member.displayName || member.username)
                .slice(0, 1)
                .toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-theme-neutral-11">
                {member.displayName || member.username}
              </p>
              <p className="truncate text-xs text-theme-neutral-8">
                {member.email}
              </p>
            </div>
          </div>
        )}

        <Select
          label={t('settings.members.editRoleModal.roleLabel')}
          options={roleOptions}
          value={selectedRole}
          required
          disabled={isPending}
          onValueChange={handleRoleChange}
          allowClear={false}
        />

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
            type="button"
            variant="primary"
            disabled={isPending || isUnchanged}
            onClick={handleSubmit}
          >
            {isPending
              ? t('common.loading')
              : t('settings.members.editRoleModal.submit')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
