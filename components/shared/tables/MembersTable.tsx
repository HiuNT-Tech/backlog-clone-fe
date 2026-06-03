'use client';

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Avatar } from '@/components/ui/avatar';
import { CustomTable, type TableColumn } from '@/components/ui/custome-table';
import { renderMemberRoleBadge } from '@/constant/data';
import Images from '@/assets';
import StaticMethodConfirm from '@/components/modal/static-method-confirm';
import {
  EntityId,
  UserBoardMember,
  UsersBoardResponse,
} from '@/config/interface';

export interface MembersTableProps {
  boardId?: EntityId;
  listUser: UsersBoardResponse;
  isListLoading: boolean;
  listError: Error | null;
  refetchList: () => void;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (limit: number) => void;
}

export const MembersTable: React.FC<MembersTableProps> = ({
  boardId,
  listUser,
  isListLoading,
  listError,
  refetchList,
  page,
  limit,
  onPageChange,
  onPageSizeChange,
}) => {
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

  const columns = useMemo<TableColumn<UserBoardMember>[]>(
    () => [
      {
        key: 'member',
        title: t('settings.members.table.member'),
        dataIndex: 'displayName',
        render: (value, record) => (
          <div className="flex items-center gap-3">
            {(record.displayName || record.username).slice(0, 1).toUpperCase()}
            {record.displayName || record.username}
          </div>
        ),
      },
      {
        key: 'email',
        title: 'Email',
        dataIndex: 'email',
      },
      {
        key: 'role',
        title: t('settings.members.table.role'),
        dataIndex: 'role',
        align: 'center',
        render: value => renderMemberRoleBadge(value, t),
      },
      {
        key: 'createdAt',
        title: t('settings.members.table.joinedOn'),
        dataIndex: 'createdAt',
        align: 'center',
        render: value => (
          <span className="text-theme-neutral-9">
            {value ? new Date(value).toLocaleDateString() : ''}
          </span>
        ),
      },
    ],
    [t]
  );

  return (
    <CustomTable
      rowKey="userId"
      columns={columns}
      dataSource={listUser?.items ?? []}
      emptyText={t('settings.members.table.empty')}
      actions={[
        {
          icon: Images.IconTrash,
          title: t('settings.members.table.delete'),
          onClick: handleDelete,
        },
      ]}
      pagination={{
        current: page,
        total: listUser?.total || 0,
        pageSize: limit,
        onChange: onPageChange,
        onShowSizeChange: onPageSizeChange,
      }}
    />
  );
};
