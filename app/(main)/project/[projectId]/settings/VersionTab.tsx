'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import VersionTable from '@/components/shared/tables/VersionTable';
import { VersionForm } from '@/components/shared/forms/VersionForm';
import { replaceWithUpdatedSearchParams } from '@/lib/url';
import { usePagination } from '@/hooks/use-pagination';
import { useVersion } from '@/hooks/use-version';
import { useBoardRole } from '@/hooks/use-board-role';
import { toastHelpers } from '@/hooks/use-toast';
import type { EntityId, Version } from '@/config/interface';
import type { CreateVersionFormData } from '@/validation/version-form-schema';
import VersionsFilter from '@/components/shared/filters/VersionsFilter';

export const VersionsTab: React.FC<{ boardId: EntityId }> = ({ boardId }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pagination = usePagination();
  const { isManager } = useBoardRole(boardId);

  const [searchParamsState, setSearchParamsState] =
    useState<Record<string, any>>();

  const apiParams = {
    ...pagination.apiParams,
    ...searchParamsState,
  };

  const {
    versions,
    totalCount,
    isLoading,
    createNewVersion,
    updateVersion,
    deleteVersion,
    isCreatePending,
    isUpdatePending,
  } = useVersion(boardId, apiParams);

  const isCreateModeFromUrl = searchParams.get('versionsMode') === 'create';
  const [isCreatingVersion, setIsCreatingVersion] =
    useState(isCreateModeFromUrl);
  const [editingVersion, setEditingVersion] = useState<Version | null>(null);

  const isFormOpen = isCreatingVersion || editingVersion !== null;

  useEffect(() => {
    setIsCreatingVersion(isCreateModeFromUrl);
    if (isCreateModeFromUrl) setEditingVersion(null);
  }, [isCreateModeFromUrl]);

  const handleSearch = (params: Record<string, any>) => {
    setSearchParamsState(params);
    pagination.setPage(1);
  };

  const handleCloseForm = () => {
    replaceWithUpdatedSearchParams(router, pathname, searchParams, params => {
      params.set('tab', 'versions');
      params.delete('versionsMode');
    });
    setIsCreatingVersion(false);
    setEditingVersion(null);
  };

  const handleSubmitVersion = async (data: CreateVersionFormData) => {
    const payload = {
      name: data.name.trim(),
      startDate: data.startDate?.trim() || undefined,
      endDate: data.endDate?.trim() || undefined,
      description: data.description?.trim() || undefined,
    };

    try {
      if (editingVersion) {
        await updateVersion({ id: editingVersion.id, payload });
        toastHelpers.success({
          title: t('settings.versions.updateSuccess'),
        });
      } else {
        await createNewVersion(payload);
        toastHelpers.success({
          title: t('settings.versions.createSuccess'),
        });
      }
      handleCloseForm();
    } catch {}
  };

  const handleDelete = async (id: EntityId) => {
    try {
      await deleteVersion(id);
      toastHelpers.success({
        title: t('settings.versions.table.delete'),
      });
    } catch {}
  };

  const isPending = isCreatePending || isUpdatePending;

  if (isFormOpen && isManager) {
    return (
      <VersionForm
        editingVersion={editingVersion}
        onClose={handleCloseForm}
        onSubmit={handleSubmitVersion}
        isPending={isPending}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 border-b border-theme-neutral-4 pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-theme-neutral-11">
            {t('settings.versions.heading')}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-theme-neutral-8">
            {t('settings.versions.hint')}
          </p>
        </div>
        {isManager && (
          <Button
            className="h-10 rounded-md bg-theme-main px-4 text-theme-neutral-1 shadow-sm hover:bg-theme-hover"
            onClick={() => {
              replaceWithUpdatedSearchParams(
                router,
                pathname,
                searchParams,
                params => {
                  params.set('tab', 'versions');
                  params.set('versionsMode', 'create');
                }
              );
              setEditingVersion(null);
              setIsCreatingVersion(true);
            }}
          >
            {t('settings.versions.actions.add')}
          </Button>
        )}
      </div>

      <VersionsFilter onSearch={handleSearch} />

      <VersionTable
        boardId={boardId}
        data={versions}
        loading={isLoading}
        totalCount={totalCount}
        page={pagination.page}
        limit={pagination.limit}
        onPageChange={pagination.setPage}
        onPageSizeChange={pagination.setLimit}
        onDelete={id => void handleDelete(id)}
        onEdit={record => {
          setEditingVersion(record);
          setIsCreatingVersion(false);
        }}
        canManage={isManager}
      />
    </div>
  );
};
