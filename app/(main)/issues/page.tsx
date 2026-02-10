'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { Input } from '@/components/ui/input';
import { Select, type SelectOption } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import {
  IssuesTable,
  type IssueRow,
} from '@/components/shared/tables/IssuesTable';

const MOCK_ISSUES: IssueRow[] = [
  {
    id: '1',
    issueType: 'Task',
    key: 'PRJ-001',
    subject: 'Implement login page',
    assignee: 'John Doe',
    status: 'In Progress',
    priority: 'High',
    milestone: 'v1.0-M1',
    created: '2026-02-01',
    startDate: '2026-02-02',
    dueDate: '2026-02-10',
    estimatedHours: '8h',
    actualHours: '4h',
    registerBy: 'Admin',
  },
];

const IssuesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen w-full bg-theme-neutral-3/40 overflow-x-hidden">
      <div className="w-full px-6 py-6 space-y-4">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-2xl font-semibold text-theme-neutral-11">
            {t('issues.title')}
          </h1>
          <p className="mt-1 text-sm text-theme-neutral-8">
            {t('issues.description')}
          </p>
        </div>

        {/* Search conditions */}
        <div className="rounded-xl border border-theme-neutral-5 bg-theme-neutral-1 p-4 shadow-sm space-y-4">
          <div className="flex flex-wrap gap-3 justify-between items-center">
            <div className="flex flex-wrap gap-2 text-sm">
              <Button
                type="button"
                variant="outline"
                className="border-theme-main text-theme-main bg-theme-main-light hover:bg-theme-hover hover:text-theme-neutral-1"
              >
                {t('issues.filters.status.all')}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-theme-neutral-5 text-theme-neutral-9"
              >
                {t('issues.filters.status.open')}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-theme-neutral-5 text-theme-neutral-9"
              >
                {t('issues.filters.status.inProgress')}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-theme-neutral-5 text-theme-neutral-9"
              >
                {t('issues.filters.status.resolved')}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-theme-neutral-5 text-theme-neutral-9"
              >
                {t('issues.filters.status.closed')}
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                className="bg-theme-main text-theme-neutral-1 hover:bg-theme-hover"
              >
                {t('issues.actions.search')}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-theme-neutral-5 text-theme-neutral-9"
              >
                {t('issues.actions.advancedSearch')}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Select
              label={t('issues.filters.issueType')}
              options={[]}
              placeholder={t('issues.filters.issueTypePlaceholder')}
            />
            <Select
              label={t('issues.filters.category')}
              options={[]}
              placeholder={t('issues.filters.categoryPlaceholder')}
            />
            <Select
              label={t('issues.filters.milestone')}
              options={[]}
              placeholder={t('issues.filters.milestonePlaceholder')}
            />
            <Select
              label={t('issues.filters.assignee')}
              options={[]}
              placeholder={t('issues.filters.assigneePlaceholder')}
            />
            <DatePicker
              label={t('issues.filters.startDate')}
              placeholder={t('issues.filters.datePlaceholder')}
            />
            <DatePicker
              label={t('issues.filters.dueDate')}
              placeholder={t('issues.filters.datePlaceholder')}
            />
            <Input
              label={t('issues.filters.keyword')}
              placeholder={t('issues.filters.keywordPlaceholder')}
            />
          </div>
        </div>

        {/* Table actions + Table */}
        <div className="flex justify-end mb-2 gap-2">
          <Button
            type="button"
            variant="outline"
            className="border-theme-neutral-5 text-theme-neutral-9"
          >
            {t('issues.actions.import')}
          </Button>
          <Button
            type="button"
            className="bg-theme-main text-theme-neutral-1 hover:bg-theme-hover"
          >
            {t('issues.actions.export')}
          </Button>
        </div>

        <IssuesTable data={MOCK_ISSUES} />
      </div>
    </div>
  );
};

export default IssuesPage;
