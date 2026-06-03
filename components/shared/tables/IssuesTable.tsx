'use client';

import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { CustomTable, type TableColumn } from '@/components/ui/custome-table';
import { getIssueTypeBadgeClassName } from '@/constant/data';
import type { EntityId } from '@/config/interface';

export interface IssueBadgeValue {
  label: string;
  statusColor?: string | null;
}

export interface IssueRow {
  id: EntityId;
  issueType: IssueBadgeValue | null;
  key: string;
  subject: string;
  assignee: string;
  status: IssueBadgeValue | null;
  priority: string;
  milestone: string;
  created: string;
  startDate: string;
  dueDate: string;
  estimatedHours: string;
  actualHours: string;
  registerBy: string;
}

export interface IssuesTableProps {
  data: IssueRow[];
  loading?: boolean;
  totalCount?: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (limit: number) => void;
  onRowClick?: (row: IssueRow) => void;
}

export const IssuesTable: React.FC<IssuesTableProps> = ({
  data,
  loading,
  totalCount,
  page,
  limit,
  onPageChange,
  onPageSizeChange,
  onRowClick,
}) => {
  const { t } = useTranslation();

  const renderBadge = useCallback((value?: IssueBadgeValue | null) => {
    if (!value?.label) return <span className="text-theme-neutral-7">—</span>;

    return (
      <span
        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getIssueTypeBadgeClassName(value.statusColor)}`}
      >
        {value.label}
      </span>
    );
  }, []);

  const columns = useMemo<TableColumn<IssueRow>[]>(
    () => [
      {
        key: 'issueType',
        title: t('issues.table.issueType'),
        dataIndex: 'issueType',
        minWidth: 140,
        render: value => renderBadge(value),
      },
      {
        key: 'key',
        title: t('issues.table.key'),
        dataIndex: 'key',
        minWidth: 120,
      },
      {
        key: 'subject',
        title: t('issues.table.subject'),
        dataIndex: 'subject',
        minWidth: 260,
      },
      {
        key: 'assignee',
        title: t('issues.table.assignee'),
        dataIndex: 'assignee',
        minWidth: 160,
      },
      {
        key: 'status',
        title: t('issues.table.status'),
        dataIndex: 'status',
        minWidth: 140,
        render: value => renderBadge(value),
      },
      {
        key: 'priority',
        title: t('issues.table.priority'),
        dataIndex: 'priority',
        minWidth: 120,
      },
      {
        key: 'milestone',
        title: t('issues.table.milestone'),
        dataIndex: 'milestone',
        minWidth: 140,
      },
      {
        key: 'created',
        title: t('issues.table.created'),
        dataIndex: 'created',
        minWidth: 140,
      },
      {
        key: 'startDate',
        title: t('issues.table.startDate'),
        dataIndex: 'startDate',
        minWidth: 140,
      },
      {
        key: 'dueDate',
        title: t('issues.table.dueDate'),
        dataIndex: 'dueDate',
        minWidth: 140,
      },
      {
        key: 'estimatedHours',
        title: t('issues.table.estimatedHours'),
        dataIndex: 'estimatedHours',
        minWidth: 150,
      },
      {
        key: 'actualHours',
        title: t('issues.table.actualHours'),
        dataIndex: 'actualHours',
        minWidth: 150,
      },
      {
        key: 'registerBy',
        title: t('issues.table.registerBy'),
        dataIndex: 'registerBy',
        minWidth: 160,
      },
    ],
    [renderBadge, t]
  );

  const handleRow = useCallback(
    (record: IssueRow) => ({
      onClick: onRowClick ? () => onRowClick(record) : undefined,
    }),
    [onRowClick]
  );

  return (
    <CustomTable<IssueRow>
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={loading}
      emptyText={t('issues.table.empty')}
      horizontalScroll={true}
      onRow={handleRow}
      pagination={{
        current: page,
        total: totalCount || 0,
        pageSize: limit,
        onChange: onPageChange,
        onShowSizeChange: onPageSizeChange,
      }}
    />
  );
};
