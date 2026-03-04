'use client';

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Images from '@/assets';
import type { IssueType } from '@/config/interface';
import { CustomTable, type TableColumn } from '@/components/ui/custome-table';
import { useIssueType } from '@/hooks/use-issue-type';
import staticMethodConfirm from '@/components/modal/static-method-confirm';
import { renderIssueTypeBadge } from '@/constant/data';

export const IssueTypesTable: React.FC<{ boardId: string }> = ({ boardId }) => {
  const { t } = useTranslation();
  const { issueTypes, isLoadingList } = useIssueType(boardId);
  const { deleteIssueType, isDeletePending } = useIssueType(boardId);

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
        deleteIssueType(record?._id);
      },
    });
  };

  return (
    <CustomTable
      rowKey="_id"
      columns={columns}
      dataSource={issueTypes}
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
