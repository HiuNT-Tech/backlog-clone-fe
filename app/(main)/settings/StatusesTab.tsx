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

export const StatusesTab: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { createNewColumn, isCreatePending } = useColumn();

  const isCreateModeFromUrl = searchParams.get('statusesMode') === 'create';
  const [isCreatingStatus, setIsCreatingStatus] = useState(isCreateModeFromUrl);

  useEffect(() => {
    setIsCreatingStatus(isCreateModeFromUrl);
  }, [isCreateModeFromUrl]);

  const handleCloseCreate = () => {
    replaceWithUpdatedSearchParams(router, pathname, searchParams, params => {
      params.set('tab', 'statuses');
      params.delete('statusesMode');
    });
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
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-theme-neutral-11">
            {t('settings.statuses.heading')}
          </h2>
          <p className="text-sm text-theme-neutral-8">
            {t('settings.statuses.hint')}
          </p>
        </div>
        <Button
          className="bg-theme-main text-theme-neutral-1 hover:bg-theme-hover"
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
          }}
        >
          {t('settings.statuses.actions.add')}
        </Button>
      </div>

      <StatusesTable />
    </div>
  );
};
