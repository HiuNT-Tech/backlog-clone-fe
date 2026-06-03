'use client';

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Images from '@/assets';
import type { EntityId, Version } from '@/config/interface';
import { CustomTable, type TableColumn } from '@/components/ui/custome-table';
import dayjs from 'dayjs';

export interface VersionTableProps {
  boardId?: EntityId;
  data: Version[];
  loading?: boolean;
  totalCount?: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (limit: number) => void;
  onDelete?: (id: EntityId) => void;
  onEdit?: (record: Version) => void;
}

const VersionTable: React.FC<VersionTableProps> = ({
  boardId,
  data,
  loading,
  totalCount,
  page,
  limit,
  onPageChange,
  onPageSizeChange,
  onDelete,
  onEdit,
}) => {
  const { t } = useTranslation();

  const columns = useMemo<TableColumn<Version>[]>(
    () => [
      {
        key: 'name',
        title: t('settings.versions.table.name'),
        dataIndex: 'name',
        render: (_value, record) => record.name ?? '—',
        minWidth: 300,
      },
      {
        key: 'startDate',
        title: t('settings.versions.table.startDate'),
        dataIndex: 'startDate',
        align: 'center',
        render: (_value, record) =>
          record.startDate ? dayjs(record.startDate).format('DD/MM/YYYY') : '—',
      },
      {
        key: 'endDate',
        title: t('settings.versions.table.endDate'),
        dataIndex: 'endDate',
        align: 'center',
        render: (_value, record) =>
          record.endDate ? dayjs(record.endDate).format('DD/MM/YYYY') : '—',
      },
      {
        key: 'description',
        title: t('settings.versions.table.description'),
        dataIndex: 'description',
        render: (_value, record) => record.description ?? '—',
      },
    ],
    [t]
  );

  return (
    <CustomTable
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={loading}
      emptyText={t('settings.versions.table.empty')}
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
          title: t('settings.versions.table.delete'),
          onClick: (record: Version) => {
            if (record?.id) onDelete?.(record.id);
          },
        },
        {
          icon: Images.IconEdit,
          title: t('common.edit'),
          onClick: (record: Version) => onEdit?.(record),
        },
      ]}
    />
  );
};

export default VersionTable;
