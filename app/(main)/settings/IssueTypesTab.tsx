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

export const IssueTypesTab: React.FC<{ boardId: string }> = ({ boardId }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { createNewIssueType, isCreatePending } = useIssueType(boardId);

  const isCreateModeFromUrl = searchParams.get('issueTypesMode') === 'create';
  const [isCreatingIssueType, setIsCreatingIssueType] =
    useState(isCreateModeFromUrl);

  useEffect(() => {
    setIsCreatingIssueType(isCreateModeFromUrl);
  }, [isCreateModeFromUrl]);

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
        name: data.name.trim(),
        statusColor,
      });
      toastHelpers.success({
        title: t('settings.issueTypes.createSuccess'),
      });
      handleCloseCreate();
    } catch {
      // Toast đã xử lý trong useIssueType
    }
  };

  if (isCreatingIssueType) {
    return (
      <IssueTypeCreateForm
        onClose={handleCloseCreate}
        onSubmit={handleSubmitIssueType}
        isPending={isCreatePending}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-theme-neutral-11">
            {t('settings.issueTypes.heading')}
          </h2>
          <p className="text-sm text-theme-neutral-8">
            {t('settings.issueTypes.hint')}
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

      <IssueTypesTable boardId={boardId} />
    </div>
  );
};
