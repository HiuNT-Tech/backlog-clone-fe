'use client';

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Avatar } from '@/components/ui/avatar';
import { CustomTable, type TableColumn } from '@/components/ui/custome-table';
import { MemberRole } from '@/config/enum';
import { renderMemberRoleBadge } from '@/constant/data';
import Images from '@/assets';
import StaticMethodConfirm from '@/components/modal/static-method-confirm';

export interface MemberResponse {
  id: string;
  fullName: string;
  role: MemberRole;
  joinedOn: string;
}

export const MembersTable: React.FC<{
  boardId?: string;
  data: MemberResponse[];
}> = ({ boardId, data }) => {
  const { t } = useTranslation();
  const handleDelete = () => {
    StaticMethodConfirm.open({
      title: t('settings.members.table.delete'),
      content: t('settings.members.table.deleteContent'),
      onOk: () => {
        console.log('delete');
      },
    });
  };

  const columns = useMemo<TableColumn<MemberResponse>[]>(
    () => [
      {
        key: 'member',
        title: t('settings.members.table.member'),
        dataIndex: 'fullName',
        render: (value, record) => (
          <div className="flex items-center gap-3">
            <Avatar
              size={28}
              className="bg-theme-main text-theme-neutral-1 text-xs"
            >
              {record.fullName.slice(0, 1).toUpperCase()}
            </Avatar>
            {record.fullName}
          </div>
        ),
      },
      {
        key: 'role',
        title: t('settings.members.table.role'),
        dataIndex: 'role',
        align: 'center',
        render: value => renderMemberRoleBadge(value, t),
      },
      {
        key: 'joinedOn',
        title: t('settings.members.table.joinedOn'),
        dataIndex: 'joinedOn',
        align: 'center',
        render: value => <span className="text-theme-neutral-9">{value}</span>,
      },
    ],
    [t]
  );

  return (
    <CustomTable
      rowKey="id"
      columns={columns}
      dataSource={data}
      emptyText={t('settings.members.table.empty')}
      actions={[
        {
          icon: Images.IconTrash,
          title: t('settings.members.table.delete'),
          onClick: handleDelete,
        },
      ]}
    />
  );
};
