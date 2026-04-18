'use client';

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { CustomTable, type TableColumn } from '@/components/ui/custome-table';
import { usePagination } from '@/hooks/use-pagination';

export interface IssueRow {
  id: string;
  issueType: string;
  key: string;
  subject: string;
  assignee: string;
  status: string;
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
  totalCount?: number;
}

export const IssuesTable: React.FC<IssuesTableProps> = ({
  data,
  totalCount,
}) => {
  const { t } = useTranslation();
  const { page, limit, setPage, setLimit } = usePagination();

  const columns = useMemo<TableColumn<IssueRow>[]>(
    () => [
      {
        key: 'issueType',
        title: t('issues.table.issueType'),
        dataIndex: 'issueType',
        minWidth: 140,
        render: value => (
          <span className="inline-flex items-center rounded-full border border-theme-main bg-theme-main-light px-3 py-1 text-xs font-semibold text-theme-main">
            {value}
          </span>
        ),
      },
      {
        key: 'key',
        title: t('issues.table.key'),
        dataIndex: 'key',
        minWidth: 120,
        render: value => (
          <button
            type="button"
            className="text-theme-main hover:underline text-sm font-medium"
          >
            {value}
          </button>
        ),
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
        render: value => (
          <span className="inline-flex items-center rounded-full bg-theme-main-light px-3 py-1 text-xs font-semibold text-theme-main">
            {value}
          </span>
        ),
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
    [t]
  );

  return (
    <CustomTable<IssueRow>
      rowKey="id"
      columns={columns}
      dataSource={data}
      emptyText={t('issues.table.empty')}
      horizontalScroll={true}
      pagination={{
        current: page,
        total: totalCount || 0,
        pageSize: limit,
        onChange: setPage,
        onShowSizeChange: setLimit,
      }}
    />
  );
};
