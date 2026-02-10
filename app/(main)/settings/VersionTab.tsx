'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  VersionTable,
  type VersionResponse,
} from '@/components/shared/tables/VersionTable';
import { replaceWithUpdatedSearchParams } from '@/lib/url';
import dayjs from 'dayjs';
import { DatePicker } from '@/components/ui/date-picker';

const INITIAL_VERSIONS: VersionResponse[] = [
  {
    id: '1',
    name: 'Version 1',
    startDate: '2026-01-01',
    endDate: '2026-01-01',
    description: 'Description of Version 1',
  },
  {
    id: '2',
    name: 'Version 2',
    startDate: '2026-01-01',
    endDate: '2026-01-01',
    description: 'Description of Version 2',
  },
  {
    id: '3',
    name: 'Version 3',
    startDate: '2026-01-01',
    endDate: '2026-01-01',
    description: 'Description of Version 3',
  },
];

export const VersionsTab: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isCreateModeFromUrl = searchParams.get('versionsMode') === 'create';
  const [isCreatingVersion, setIsCreatingVersion] =
    useState(isCreateModeFromUrl);

  useEffect(() => {
    setIsCreatingVersion(isCreateModeFromUrl);
  }, [isCreateModeFromUrl]);
  const [versionName, setVersionName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');

  const handleResetVersionForm = () => {
    setVersionName('');
    setStartDate('');
    setEndDate('');
    setDescription('');
  };

  const handleSubmitVersion = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with API to save version
    handleResetVersionForm();
    replaceWithUpdatedSearchParams(router, pathname, searchParams, params => {
      params.set('tab', 'versions');
      params.delete('versionsMode');
    });
    setIsCreatingVersion(false);
  };

  if (isCreatingVersion) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          className="text-sm text-theme-main hover:underline cursor-pointer"
          onClick={() => {
            replaceWithUpdatedSearchParams(
              router,
              pathname,
              searchParams,
              params => {
                params.set('tab', 'versions');
                params.delete('versionsMode');
              }
            );

            handleResetVersionForm();
            setIsCreatingVersion(false);
          }}
        >
          {t('settings.issueTypes.add.back')}
        </button>

        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-theme-neutral-11">
            {t('settings.versions.heading')}
          </h2>
          <p className="text-sm text-theme-neutral-8">
            {t('settings.versions.hint')}
          </p>
        </div>

        <form onSubmit={handleSubmitVersion} className="space-y-6">
          <div className="space-y-2">
            <Input
              label={t('settings.versions.add.nameLabel')}
              required
              value={versionName}
              onChange={e => setVersionName(e.target.value)}
              placeholder={t('settings.versions.add.namePlaceholder')}
            />
          </div>

          <div className="space-y-3 rounded-lg border border-theme-neutral-4 bg-theme-neutral-1 px-4 py-4">
            <p className="text-sm font-medium text-theme-neutral-11">
              {t('settings.versions.add.setDateLabel')}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <DatePicker
                  label={t('settings.versions.table.startDate')}
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  placeholder={t('settings.versions.add.datePlaceholder')}
                />
              </div>
              <div className="space-y-1">
                <DatePicker
                  label={t('settings.versions.table.endDate')}
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  placeholder={t('settings.versions.add.datePlaceholder')}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Textarea
              label={t('settings.versions.add.descriptionLabel')}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={t('settings.versions.add.descriptionPlaceholder')}
              rows={4}
            />
            <p className="text-xs text-theme-neutral-8">
              {t('settings.versions.add.descriptionHint')}
            </p>
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              className="bg-theme-main text-theme-neutral-1 hover:bg-theme-hover min-w-[120px]"
              disabled={!versionName.trim()}
            >
              {t('common.submit')}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
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

            setIsCreatingVersion(true);
          }}
        >
          {t('settings.versions.actions.add')}
        </Button>
      </div>

      <VersionTable data={INITIAL_VERSIONS} />
    </div>
  );
};
