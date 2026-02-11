'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  IssueTypesTable,
  type IssueResponse,
} from '@/components/shared/tables/IssueTypesTable';
import { renderStatusBadge } from '@/constant/data';
import { replaceWithUpdatedSearchParams } from '@/lib/url';
import { cn } from '@/lib/utils';

const INITIAL_ISSUE_TYPES: IssueResponse[] = [
  {
    id: '1',
    name: 'Deploy Production',
    issueCount: 0,
    templateRegistered: true,
  },
  { id: '2', name: 'Task', issueCount: 447, templateRegistered: true },
  { id: '3', name: 'Bug', issueCount: 306, templateRegistered: true },
  { id: '4', name: 'Risk', issueCount: 0, templateRegistered: false },
  { id: '5', name: 'Issue', issueCount: 0, templateRegistered: true },
  { id: '6', name: 'Change Request', issueCount: 0, templateRegistered: false },
];

export const IssueTypesTab: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isCreateModeFromUrl = searchParams.get('issueTypesMode') === 'create';
  const [isCreatingIssueType, setIsCreatingIssueType] =
    useState(isCreateModeFromUrl);

  useEffect(() => {
    setIsCreatingIssueType(isCreateModeFromUrl);
  }, [isCreateModeFromUrl]);
  const [newIssueTypeName, setNewIssueTypeName] = useState('');
  const [templateSubject, setTemplateSubject] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [selectedColorKey, setSelectedColorKey] = useState('default');

  const handleResetIssueTypeForm = () => {
    setNewIssueTypeName('');
    setTemplateSubject('');
    setTemplateDescription('');
    setSelectedColorKey('default');
  };

  const handleSubmitIssueType = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with API to save issue type
    handleResetIssueTypeForm();
    setIsCreatingIssueType(false);
  };

  if (isCreatingIssueType) {
    return (
      <div className="space-y-4">
        <form onSubmit={handleSubmitIssueType} className="space-y-6">
          <button
            type="button"
            className="text-sm text-theme-main hover:underline cursor-pointer"
            onClick={() => {
              replaceWithUpdatedSearchParams(
                router,
                pathname,
                searchParams,
                params => {
                  params.set('tab', 'issueTypes');
                  params.delete('issueTypesMode');
                }
              );

              handleResetIssueTypeForm();
              setIsCreatingIssueType(false);
            }}
          >
            {t('settings.issueTypes.add.back')}
          </button>

          <div>
            <h2 className="text-lg font-semibold text-theme-neutral-11">
              {t('settings.issueTypes.add.title')}
            </h2>
            <p className="text-sm text-theme-neutral-8">
              {t('settings.issueTypes.add.description')}
            </p>
          </div>

          <div className="space-y-4 rounded-lg border border-theme-neutral-4 bg-theme-neutral-1 px-4 py-4">
            <Input
              label={t('settings.issueTypes.add.nameLabel')}
              required
              value={newIssueTypeName}
              onChange={e => setNewIssueTypeName(e.target.value)}
              placeholder={t('settings.issueTypes.add.namePlaceholder')}
            />
            <p className="text-xs text-theme-neutral-8">
              {t('settings.issueTypes.add.nameHint')}
            </p>
          </div>

          <div className="space-y-3 rounded-lg border border-theme-neutral-4 bg-theme-neutral-1 px-4 py-4">
            <div>
              <p className="text-sm font-medium text-theme-neutral-11">
                {t('settings.issueTypes.add.backgroundLabel')}
                <span className="text-red-500 ml-1">*</span>
              </p>
              <p className="text-xs text-theme-neutral-8">
                {t('settings.issueTypes.add.backgroundHint')}
              </p>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {renderStatusBadge(
                selectedColorKey,
                key => setSelectedColorKey(key),
                t
              )}
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-theme-neutral-4 bg-theme-neutral-1 px-4 py-4">
            <p className="text-sm font-medium text-theme-neutral-11">
              {t('settings.issueTypes.add.existingLabel')}
            </p>
            <div className="flex flex-wrap gap-2">
              {INITIAL_ISSUE_TYPES.map(type => (
                <span
                  key={type.id}
                  className="inline-flex items-center rounded-full bg-theme-neutral-2 px-3 py-1 text-xs font-medium text-theme-neutral-9"
                >
                  {type.name}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="border-theme-neutral-5 text-theme-neutral-9"
              onClick={() => {
                replaceWithUpdatedSearchParams(
                  router,
                  pathname,
                  searchParams,
                  params => {
                    params.set('tab', 'issueTypes');
                    params.delete('issueTypesMode');
                  }
                );

                handleResetIssueTypeForm();
                setIsCreatingIssueType(false);
              }}
            >
              {t('settings.issueTypes.add.cancel')}
            </Button>
            <Button
              className="bg-theme-main text-theme-neutral-1 hover:bg-theme-hover"
              disabled={!newIssueTypeName.trim()}
            >
              {t('settings.issueTypes.add.save')}
            </Button>
          </div>
        </form>
      </div>
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

      <IssueTypesTable data={INITIAL_ISSUE_TYPES} />
    </div>
  );
};
