'use client';

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Images from '@/assets';
import type { EntityId, IssueType } from '@/config/interface';
import { CustomTable, type TableColumn } from '@/components/ui/custome-table';
import staticMethodConfirm from '@/components/modal/static-method-confirm';
import { renderIssueTypeBadge } from '@/constant/data';

export interface IssueTypesTableProps {
  boardId: EntityId;
  data: IssueType[];
  loading?: boolean;
  totalCount?: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (limit: number) => void;
  onDelete?: (id: EntityId) => void;
}

export const IssueTypesTable: React.FC<IssueTypesTableProps> = ({
  boardId,
  data,
  loading,
  totalCount,
  page,
  limit,
  onPageChange,
  onPageSizeChange,
  onDelete,
}) => {
  const { t } = useTranslation();

  const columns = useMemo<TableColumn<IssueType>[]>(
    () => [
      {
        key: 'type',
        title: t('settings.issueTypes.table.type'),
        dataIndex: 'name',
        align: 'center',
        render: (_value, record) =>
          renderIssueTypeBadge(record?.statusColor, record?.name),
        minWidth: 300,
      },
      {
        key: 'issues',
        title: t('settings.issueTypes.table.issues'),
        align: 'center',
        render: (_value, record) => record.issueCount ?? 0,
      },
    ],
    [t]
  );

  const handleDelete = async (record: IssueType) => {
    staticMethodConfirm.open({
      content: t('settings.issueTypes.deleteModal.content', {
        name: record?.name ?? '—',
      }),
      onOk: () => {
        if (record?.id) onDelete?.(record.id);
      },
    });
  };

  return (
    <CustomTable
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={loading}
      emptyText={t('settings.issueTypes.table.empty')}
      pagination={{
        current: page,
        total: totalCount || 0,
        pageSize: limit,
        onChange: onPageChange,
        onShowSizeChange: onPageSizeChange,
      }}
      actions={[
        {
          icon: Images.IconTrash,
          title: t('settings.issueTypes.table.delete'),
          onClick: record => handleDelete(record),
        },
      ]}
    />
  );
};
