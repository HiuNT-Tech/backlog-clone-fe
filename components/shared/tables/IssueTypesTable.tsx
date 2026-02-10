'use client';

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Images from '@/assets';

import { CustomTable, type TableColumn } from '@/components/ui/custome-table';

export interface IssueResponse {
  id: string;
  name: string;
  issueCount: number;
  templateRegistered: boolean;
}

export const IssueTypesTable: React.FC<{ data: IssueResponse[] }> = ({
  data,
}) => {
  const { t } = useTranslation();

  const columns = useMemo<TableColumn<IssueResponse>[]>(
    () => [
      {
        key: 'type',
        title: t('settings.issueTypes.table.type'),
        dataIndex: 'name',
        render: (_value, record) => record.name,
        minWidth: 300,
      },
      {
        key: 'issues',
        title: t('settings.issueTypes.table.issues'),
        dataIndex: 'issueCount',
        align: 'center',
        render: (_value, record) => record.issueCount,
      },
    ],
    [t]
  );

  return (
    <CustomTable
      rowKey="id"
      columns={columns}
      dataSource={data}
      emptyText={t('settings.issueTypes.table.empty')}
      actions={[
        {
          icon: Images.IconTrash,
          title: t('settings.issueTypes.table.delete'),
          onClick: (record, index) => {
            console.log(record, index);
          },
        },
      ]}
    />
  );
};
