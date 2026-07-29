'use client';

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { CustomTable, type TableColumn } from '@/components/ui/custome-table';
import { renderMemberRoleBadge } from '@/constant/data';
import Images from '@/assets';
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
  onEditRole?: (member: UserBoardMember) => void;
  onRemove?: (member: UserBoardMember) => void;
  /** Chỉ Manager (ADMIN/PM) mới thấy các thao tác sửa role / xoá member. */
  canManage?: boolean;
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
  onEditRole,
  onRemove,
  canManage = false,
}) => {
  const { t } = useTranslation();

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
        key: 'userCode',
        title: t('settings.members.table.userCode'),
        dataIndex: 'userCode',
        render: value =>
          value ? (
            <span className="font-mono text-theme-neutral-9">
              {value as string}
            </span>
          ) : (
            // User tạo trước khi có tính năng mã người dùng thì để trống.
            <span className="text-theme-neutral-7">—</span>
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
      actions={
        canManage
          ? [
              {
                icon: Images.IconEdit,
                title: t('settings.members.table.editRole'),
                onClick: record => onEditRole?.(record),
              },
              {
                icon: Images.IconTrash,
                title: t('settings.members.table.delete'),
                onClick: record => onRemove?.(record),
              },
            ]
          : []
      }
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
