'use client';

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Images from '@/assets';
import { Column } from '@/config/interface';
import { CustomTable, type TableColumn } from '@/components/ui/custome-table';
import staticMethodConfirm from '@/components/modal/static-method-confirm';

export interface StatusesTableProps {
  boardId: string;
  data: Column[];
  loading?: boolean;
  totalCount?: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (limit: number) => void;
  onDelete?: (id: string) => void;
}

export const StatusesTable: React.FC<StatusesTableProps> = ({
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

  const columns = useMemo<TableColumn<Column>[]>(
    () => [
      {
        key: 'title',
        title: t('settings.issueTypes.table.type'),
        dataIndex: 'title',
        render: (_value, record) => record?.title ?? '—',
        minWidth: 300,
      },
      {
        key: 'issues',
        title: t('settings.issueTypes.table.issues'),
        align: 'center',
        render: (_value, record) => record?.cardOrderIds?.length ?? 0,
      },
    ],
    [t]
  );

  const handleDelete = async (record: Column) => {
    staticMethodConfirm.open({
      content: t('settings.issueTypes.deleteModal.content', {
        name: record?.title ?? '—',
      }),
      onOk: () => {
        if (record?._id) onDelete?.(record._id);
      },
    });
  };

  return (
    <CustomTable
      rowKey="_id"
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
