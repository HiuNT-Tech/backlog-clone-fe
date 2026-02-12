'use client';

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Images from '@/assets';
import type { Version } from '@/config/interface';
import { CustomTable, type TableColumn } from '@/components/ui/custome-table';
import dayjs from 'dayjs';

export interface VersionTableProps {
  data: Version[];
  loading?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (record: Version) => void;
}

export const VersionTable: React.FC<VersionTableProps> = ({
  data,
  loading,
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
      rowKey="_id"
      columns={columns}
      dataSource={data}
      loading={loading}
      emptyText={t('settings.versions.table.empty')}
      actions={[
        {
          icon: Images.IconTrash,
          title: t('settings.versions.table.delete'),
          onClick: (record: Version) => {
            if (record?._id) onDelete?.(record._id);
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
