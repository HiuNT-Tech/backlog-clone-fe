'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { replaceWithUpdatedSearchParams } from '@/lib/url';
import { useColumn } from '@/hooks/use-column';
import { toastHelpers } from '@/hooks/use-toast';
import { COLOR_KEY_TO_STATUS } from '@/constant/data';
import type { CreateIssueTypeFormData } from '@/validation/create-issue-type-form-schemas';
import { Button } from '@/components/ui/button';
import { StatusesTable } from '@/components/shared/tables/StatusesTable';
import { StatusCreateForm } from '@/components/shared/forms/StatusCreateForm';
import StatusesFilter from '@/components/shared/filters/StatusesFilter';
import { usePagination } from '@/hooks/use-pagination';

export const StatusesTab: React.FC<{ boardId: string }> = ({ boardId }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pagination = usePagination();

  const [searchParamsState, setSearchParamsState] =
    useState<Record<string, any>>();

  const apiParams = {
    ...pagination.apiParams,
    ...searchParamsState,
  };

  const {
    columns: columnList,
    isLoadingList,
    createNewColumn,
    deleteColumn,
    isCreatePending,
  } = useColumn(boardId, apiParams);

  const isCreateModeFromUrl = searchParams.get('statusesMode') === 'create';
  const [isCreatingStatus, setIsCreatingStatus] = useState(isCreateModeFromUrl);

  useEffect(() => {
    setIsCreatingStatus(isCreateModeFromUrl);
  }, [isCreateModeFromUrl]);

  const handleSearch = (params: Record<string, any>) => {
    setSearchParamsState(params);
    pagination.setPage(1);
  };

  const handleCloseCreate = () => {
    replaceWithUpdatedSearchParams(router, pathname, searchParams, params => {
      params.set('tab', 'statuses');
      params.delete('statusesMode');
    });
    setIsCreatingStatus(false);
  };

  const handleSubmitColumn = async (data: CreateIssueTypeFormData) => {
    try {
      const statusColor = COLOR_KEY_TO_STATUS[data.selectedColorKey];
      await createNewColumn({
        title: data.name.trim(),
        statusColor,
        selectedColorKey: data.selectedColorKey,
      });
      toastHelpers.success({
        title: t('settings.issueTypes.createSuccess'),
      });
      handleCloseCreate();
    } catch {
      // Toast đã xử lý trong hook
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteColumn(id);
      toastHelpers.success({
        title: t('common.success.delete'),
      });
    } catch {}
  };

  if (isCreatingStatus) {
    return (
      <StatusCreateForm
        onClose={handleCloseCreate}
        onSubmit={handleSubmitColumn}
        isPending={isCreatePending}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 border-b border-theme-neutral-4 pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-theme-neutral-11">
            {t('settings.statuses.heading')}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-theme-neutral-8">
            {t('settings.statuses.hint')}
          </p>
        </div>
        <Button
          className="h-10 rounded-md bg-theme-main px-4 text-theme-neutral-1 shadow-sm hover:bg-theme-hover"
          onClick={() => {
            replaceWithUpdatedSearchParams(
              router,
              pathname,
              searchParams,
              params => {
                params.set('tab', 'statuses');
                params.set('statusesMode', 'create');
              }
            );
            setIsCreatingStatus(true);
          }}
        >
          {t('settings.statuses.actions.add')}
        </Button>
      </div>

      <StatusesFilter onSearch={handleSearch} />

      <StatusesTable
        boardId={boardId}
        data={columnList}
        loading={isLoadingList}
        page={pagination.page}
        limit={pagination.limit}
        onPageChange={pagination.setPage}
        onPageSizeChange={pagination.setLimit}
        onDelete={handleDelete}
      />
    </div>
  );
};
