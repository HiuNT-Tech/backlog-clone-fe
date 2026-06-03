'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { IssueTypesTable } from '@/components/shared/tables/IssueTypesTable';
import { IssueTypeCreateForm } from '@/components/shared/forms/IssueTypesCreateForm';
import { replaceWithUpdatedSearchParams } from '@/lib/url';
import { useIssueType } from '@/hooks/use-issue-type';
import { toastHelpers } from '@/hooks/use-toast';
import { COLOR_KEY_TO_STATUS } from '@/constant/data';
import type { CreateIssueTypeFormData } from '@/validation/create-issue-type-form-schemas';
import IssueTypesFilter from '@/components/shared/filters/IssueTypesFilter';
import { usePagination } from '@/hooks/use-pagination';
import type { EntityId } from '@/config/interface';

export const IssueTypesTab: React.FC<{ boardId: EntityId }> = ({ boardId }) => {
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
    issueTypes,
    totalCount,
    isLoading,
    createNewIssueType,
    deleteIssueType,
    isCreatePending,
  } = useIssueType(boardId, apiParams);

  const isCreateModeFromUrl = searchParams.get('issueTypesMode') === 'create';
  const [isCreatingIssueType, setIsCreatingIssueType] =
    useState(isCreateModeFromUrl);

  useEffect(() => {
    setIsCreatingIssueType(isCreateModeFromUrl);
  }, [isCreateModeFromUrl]);

  const handleSearch = (params: Record<string, any>) => {
    setSearchParamsState(params);
    pagination.setPage(1);
  };

  const handleCloseCreate = () => {
    replaceWithUpdatedSearchParams(router, pathname, searchParams, params => {
      params.set('tab', 'issueTypes');
      params.delete('issueTypesMode');
    });
    setIsCreatingIssueType(false);
  };

  const handleSubmitIssueType = async (data: CreateIssueTypeFormData) => {
    try {
      const statusColor = COLOR_KEY_TO_STATUS[data.selectedColorKey];
      await createNewIssueType({
        boardId,
        name: data.name.trim(),
        statusColor,
      });
      toastHelpers.success({
        title: t('common.success.add'),
      });
      handleCloseCreate();
    } catch {
      // Toast đã xử lý trong useIssueType
    }
  };

  const handleDelete = async (id: EntityId) => {
    try {
      await deleteIssueType(id);
      toastHelpers.success({
        title: t('common.success.delete'),
      });
    } catch {}
  };

  if (isCreatingIssueType) {
    return (
      <IssueTypeCreateForm
        boardId={boardId}
        onClose={handleCloseCreate}
        onSubmit={handleSubmitIssueType}
        isPending={isCreatePending}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 border-b border-theme-neutral-4 pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-theme-neutral-11">
            {t('settings.issueTypes.heading')}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-theme-neutral-8">
            {t('settings.issueTypes.hint')}
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
                params.set('tab', 'issueTypes');
                params.set('issueTypesMode', 'create');
              }
            );
            setIsCreatingIssueType(true);
          }}
        >
          {t('settings.issueTypes.actions.add')}
        </Button>
      </div>

      <IssueTypesFilter onSearch={handleSearch} />

      <IssueTypesTable
        boardId={boardId}
        data={issueTypes}
        loading={isLoading}
        totalCount={totalCount}
        page={pagination.page}
        limit={pagination.limit}
        onPageChange={pagination.setPage}
        onPageSizeChange={pagination.setLimit}
        onDelete={handleDelete}
      />
    </div>
  );
};
