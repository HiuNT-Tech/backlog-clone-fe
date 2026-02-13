'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import VersionTable from '@/components/shared/tables/VersionTable';
import { VersionForm } from '@/components/shared/forms/VersionForm';
import { replaceWithUpdatedSearchParams } from '@/lib/url';
import { useVersion } from '@/hooks/use-version';
import { toastHelpers } from '@/hooks/use-toast';
import type { Version } from '@/config/interface';
import type { CreateVersionFormData } from '@/validation/version-form-schema';

export const VersionsTab: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    versions,
    isLoadingList,
    createNewVersion,
    updateVersion,
    deleteVersion,
    isCreatePending,
    isUpdatePending,
  } = useVersion();

  const isCreateModeFromUrl = searchParams.get('versionsMode') === 'create';
  const [isCreatingVersion, setIsCreatingVersion] =
    useState(isCreateModeFromUrl);
  const [editingVersion, setEditingVersion] = useState<Version | null>(null);

  const isFormOpen = isCreatingVersion || editingVersion !== null;

  useEffect(() => {
    setIsCreatingVersion(isCreateModeFromUrl);
    if (isCreateModeFromUrl) setEditingVersion(null);
  }, [isCreateModeFromUrl]);

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
        await updateVersion({ id: editingVersion._id, payload });
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
    } catch {
      toastHelpers.error({ title: t('toast.error.userVerificationFailed') });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteVersion(id);
      toastHelpers.success({
        title: t('settings.versions.table.delete'),
      });
    } catch {
      toastHelpers.error({ title: t('toast.error.userVerificationFailed') });
    }
  };

  const isPending = isCreatePending || isUpdatePending;

  if (isFormOpen) {
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
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-theme-neutral-11">
            {t('settings.versions.heading')}
          </h2>
          <p className="text-sm text-theme-neutral-8">
            {t('settings.versions.hint')}
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
      </div>

      <VersionTable
        data={versions}
        loading={isLoadingList}
        onDelete={id => void handleDelete(id)}
        onEdit={record => {
          setEditingVersion(record);
          setIsCreatingVersion(false);
        }}
      />
    </div>
  );
};
