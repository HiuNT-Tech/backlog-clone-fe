'use client';

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Images from '@/assets';
import { Column } from '@/config/interface';
import { CustomTable, type TableColumn } from '@/components/ui/custome-table';
import { useColumn } from '@/hooks/use-column';
import staticMethodConfirm from '@/components/modal/static-method-confirm';

export const StatusesTable: React.FC = () => {
  const { t } = useTranslation();
  const { columns: columnList, isLoadingList, deleteColumn } = useColumn();

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
        deleteColumn(record?._id);
      },
    });
  };

  return (
    <CustomTable
      rowKey="_id"
      columns={columns}
      dataSource={columnList}
      loading={isLoadingList}
      emptyText={t('settings.issueTypes.table.empty')}
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
