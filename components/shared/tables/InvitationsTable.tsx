'use client';

import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import Images from '@/assets';
import { CustomTable, type TableColumn } from '@/components/ui/custome-table';
import { BoardInvitationStatus } from '@/config/enum';
import {
  renderInvitationStatusBadge,
  renderMemberRoleBadge,
} from '@/constant/data';
import type {
  BoardInvitation,
  EntityId,
  InvitationListResponse,
} from '@/config/interface';

interface InvitationsTableProps {
  data: InvitationListResponse;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (limit: number) => void;
  onRevoke: (invitation: BoardInvitation) => void;
  onResend: (invitation: BoardInvitation) => void;
  isActionPending?: boolean;
  isResendPending?: boolean;
}

const formatDateTime = (value?: string | null) => {
  if (!value) return '';
  return dayjs(value).format('YYYY/MM/DD HH:mm');
};

export const InvitationsTable: React.FC<InvitationsTableProps> = ({
  data,
  loading,
  error,
  refetch,
  page,
  limit,
  onPageChange,
  onPageSizeChange,
  onRevoke,
  onResend,
  isActionPending,
  isResendPending,
}) => {
  const { t } = useTranslation();

  const pagedItems = useMemo(() => {
    const start = (page - 1) * limit;
    return data.items.slice(start, start + limit);
  }, [data.items, limit, page]);

  const columns = useMemo<TableColumn<BoardInvitation>[]>(
    () => [
      {
        key: 'email',
        title: t('settings.invitations.table.email'),
        dataIndex: 'email',
        minWidth: 220,
        render: value => (
          <span className="font-medium text-theme-neutral-11">{value}</span>
        ),
      },
      {
        key: 'role',
        title: t('settings.invitations.table.role'),
        dataIndex: 'role',
        align: 'center',
        minWidth: 140,
        render: value => renderMemberRoleBadge(value, t),
      },
      {
        key: 'status',
        title: t('settings.invitations.table.status'),
        dataIndex: 'status',
        align: 'center',
        minWidth: 140,
        render: value => renderInvitationStatusBadge(value, t),
      },
      {
        key: 'invitedBy',
        title: t('settings.invitations.table.invitedBy'),
        dataIndex: 'invitedByUserId',
        minWidth: 180,
        render: (_value, record) => (
          <div className="flex flex-col">
            <span className="font-medium text-theme-neutral-10">
              {record.invitedBy?.displayName || t('common.unknown')}
            </span>
            <span className="text-xs text-theme-neutral-7">
              {record.invitedBy?.email || t('common.unknown')}
            </span>
          </div>
        ),
      },
      {
        key: 'expiresAt',
        title: t('settings.invitations.table.expiresAt'),
        dataIndex: 'expiresAt',
        align: 'center',
        minWidth: 160,
        render: value => (
          <span className="text-theme-neutral-8">{formatDateTime(value)}</span>
        ),
      },
      {
        key: 'createdAt',
        title: t('settings.invitations.table.createdAt'),
        dataIndex: 'createdAt',
        align: 'center',
        minWidth: 160,
        render: value => (
          <span className="text-theme-neutral-8">{formatDateTime(value)}</span>
        ),
      },
    ],
    [t]
  );

  return (
    <CustomTable
      rowKey={(record: BoardInvitation) => String(record.id as EntityId)}
      columns={columns}
      dataSource={pagedItems}
      loading={loading}
      error={Boolean(error)}
      emptyText={t('settings.invitations.table.empty')}
      loadingText={t('common.loading')}
      errorText={t('settings.invitations.table.error')}
      onRetry={refetch}
      actions={[
        {
          icon: Images.IconResend,
          title: t('settings.invitations.table.resend'),
          onClick: record => onResend(record),
          disabled: isResendPending,
          hidden: record =>
            record.status !== BoardInvitationStatus.PENDING &&
            record.status !== BoardInvitationStatus.EXPIRED,
        },
        {
          icon: Images.IconTrash,
          title: t('settings.invitations.table.revoke'),
          onClick: record => onRevoke(record),
          disabled: isActionPending,
          hidden: record => record.status !== BoardInvitationStatus.PENDING,
        },
      ]}
      pagination={{
        current: page,
        total: data.total,
        pageSize: limit,
        onChange: onPageChange,
        onShowSizeChange: onPageSizeChange,
      }}
    />
  );
};
