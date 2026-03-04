'use client';

import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  MemberResponse,
  MembersTable,
} from '@/components/shared/tables/MembersTable';
import { MemberRole } from '@/config/enum';

const INITIAL_MEMBER_ROWS: MemberResponse[] = [
  {
    id: '1',
    fullName: 'Nguyễn Văn A',
    role: MemberRole.MEMBER,
    joinedOn: '2025-11-19',
  },
  {
    id: '2',
    fullName: 'Nguyễn Văn B',
    role: MemberRole.ADMINISTRATOR,
    joinedOn: '2025-11-19',
  },
  {
    id: '3',
    fullName: 'Nguyễn Văn C',
    role: MemberRole.MEMBER,
    joinedOn: '2026-01-10',
  },
  {
    id: '4',
    fullName: 'Nguyễn Văn D',
    role: MemberRole.ADMINISTRATOR,
    joinedOn: '2025-11-19',
  },
  {
    id: '5',
    fullName: 'Nguyễn Văn E',
    role: MemberRole.PROJECT_MANAGER,
    joinedOn: '2025-11-19',
  },
  {
    id: '6',
    fullName: 'Nguyễn Văn F',
    role: MemberRole.MEMBER,
    joinedOn: '2025-12-02',
  },
  {
    id: '7',
    fullName: 'Nguyễn Văn G',
    role: MemberRole.MEMBER,
    joinedOn: '2025-12-02',
  },
  {
    id: '8',
    fullName: 'Nguyễn Văn H',
    role: MemberRole.MEMBER,
    joinedOn: '2025-11-19',
  },
];

export const MembersTab: React.FC<{ boardId: string }> = ({ boardId }) => {
  const { t } = useTranslation();
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');

  const roleOptions = useMemo(
    () => [
      { value: '', label: t('settings.members.roleOptions.all') },
      {
        value: MemberRole.MEMBER.toString(),
        label: t('settings.members.roleOptions.member'),
      },
      {
        value: MemberRole.ADMINISTRATOR.toString(),
        label: t('settings.members.roleOptions.administrator'),
      },
      {
        value: MemberRole.PROJECT_MANAGER.toString(),
        label: t('settings.members.roleOptions.projectManager'),
      },
    ],
    [t]
  );

  const filteredMembers = useMemo(() => {
    return INITIAL_MEMBER_ROWS.filter(member => {
      const matchedSearch = member.fullName
        .toLowerCase()
        .includes(memberSearch.trim().toLowerCase());
      const matchedRole = selectedRole
        ? member.role === Number(selectedRole)
        : true;
      return matchedSearch && matchedRole;
    });
  }, [memberSearch, selectedRole]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-theme-neutral-11">
            {t('settings.members.heading')}
          </h2>
          <p className="text-sm text-theme-neutral-8">
            {t('settings.members.hint')}
          </p>
        </div>
        <Button className="bg-theme-main text-theme-neutral-1 hover:bg-theme-hover">
          {t('settings.members.actions.invite')}
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <Input
          placeholder={t('settings.members.searchPlaceholder')}
          value={memberSearch}
          onChange={e => setMemberSearch(e.target.value)}
        />
        <Select
          options={roleOptions}
          value={selectedRole}
          onValueChange={value => setSelectedRole(value)}
          placeholder={t('settings.members.roleFilterPlaceholder')}
          allowClear
        />
      </div>

      <MembersTable boardId={boardId} data={filteredMembers} />
    </div>
  );
};
