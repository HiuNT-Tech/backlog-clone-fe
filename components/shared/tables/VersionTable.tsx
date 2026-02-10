'use client';

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Images from '@/assets';

import { CustomTable, type TableColumn } from '@/components/ui/custome-table';
import dayjs from 'dayjs';

export interface VersionResponse {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
}

export const VersionTable: React.FC<{ data: VersionResponse[] }> = ({
  data,
}) => {
  const { t } = useTranslation();

  const columns = useMemo<TableColumn<VersionResponse>[]>(
    () => [
      {
        key: 'name',
        title: t('settings.versions.table.name'),
        dataIndex: 'name',
        render: (_value, record) => record.name,
        minWidth: 300,
      },
      {
        key: 'startDate',
        title: t('settings.versions.table.startDate'),
        dataIndex: 'startDate',
        align: 'center',
        render: (_value, record) =>
          dayjs(record.startDate).format('DD/MM/YYYY'),
      },
      {
        key: 'endDate',
        title: t('settings.versions.table.endDate'),
        dataIndex: 'endDate',
        align: 'center',
        render: (_value, record) => dayjs(record.endDate).format('DD/MM/YYYY'),
      },
      {
        key: 'description',
        title: t('settings.versions.table.description'),
        dataIndex: 'description',
        render: (_value, record) => record.description,
      },
    ],
    [t]
  );

  return (
    <CustomTable
      rowKey="id"
      columns={columns}
      dataSource={data}
      emptyText={t('settings.versions.table.empty')}
      actions={[
        {
          icon: Images.IconTrash,
          title: t('settings.versions.table.delete'),
          onClick: (record, index) => {
            console.log(record, index);
          },
        },
      ]}
    />
  );
};
