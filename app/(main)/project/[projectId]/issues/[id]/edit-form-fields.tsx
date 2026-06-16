'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { TimePicker } from '@/components/ui/time-picker';
import { MarkdownEditor } from '@/components/ui/markdown-editor';

/* ─────────────────── Types ─────────────────── */

export interface EditFormData {
  title: string;
  description: string;
  columnId: string;
  priority: string;
  issueTypeId: string;
  assigneeUserId: string;
  versionId: string;
  startDate: string;
  dueDate: string;
  estimatedHours: string;
  actualHours: string;
}

export interface SelectOption {
  value: string;
  label: React.ReactNode;
}

export interface EditFormFieldsProps {
  formData: EditFormData;
  onChange: (field: keyof EditFormData, value: string) => void;
  statusOptions: SelectOption[];
  priorityOptions: SelectOption[];
  issueTypeOptions: SelectOption[];
  userOptions: SelectOption[];
  versionOptions: SelectOption[];
  onAssignToMyself?: () => void;
}

/* ─────────────────── Editable Title ─────────────────── */

export const EditableTitle: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <Input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={t('addIssue.placeholder.title')}
      className="text-xl font-bold border-theme-neutral-5 bg-theme-neutral-1 focus:border-theme-main h-12"
    />
  );
};

/* ─────────────────── Editable Description ─────────────────── */

export const EditableDescription: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <MarkdownEditor
      value={value}
      onChange={onChange}
      placeholder={t('addIssue.placeholder.description')}
    />
  );
};

/* ─────────────────── Editable Metadata ─────────────────── */

export const EditableMetadata: React.FC<EditFormFieldsProps> = ({
  formData,
  onChange,
  statusOptions,
  priorityOptions,
  issueTypeOptions,
  userOptions,
  versionOptions,
  onAssignToMyself,
}) => {
  const { t } = useTranslation();

  return (
    <div className="px-5 pb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {/* Left column */}
        <div className="space-y-4">
          <Select
            label={t('issueDetail.metadata.status', 'Status')}
            options={statusOptions}
            value={formData.columnId}
            onValueChange={v => onChange('columnId', v)}
            placeholder="—"
          />

          <Select
            label={t('issueDetail.metadata.priority', 'Priority')}
            options={priorityOptions}
            value={formData.priority}
            onValueChange={v => onChange('priority', v)}
            placeholder="—"
          />

          <Select
            label={t('issueDetail.metadata.issueType', 'Issue Type')}
            options={issueTypeOptions}
            value={formData.issueTypeId}
            onValueChange={v => onChange('issueTypeId', v)}
            placeholder="—"
            showSearch
          />

          <div>
            <Select
              label={t('issueDetail.metadata.assignee', 'Assignee')}
              options={userOptions}
              value={formData.assigneeUserId}
              onValueChange={v => onChange('assigneeUserId', v)}
              placeholder="—"
              showSearch
            />
            {onAssignToMyself && (
              <button
                type="button"
                className="mt-1.5 text-sm text-theme-main hover:underline cursor-pointer"
                onClick={onAssignToMyself}
              >
                {t('addIssue.myself', 'Assign to me')}
              </button>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <DatePicker
              label={t('addIssue.label.startDate', 'Start Date')}
              value={formData.startDate}
              onChange={e => onChange('startDate', e.target.value)}
            />
            <DatePicker
              label={t('addIssue.label.dueDate', 'Due Date')}
              value={formData.dueDate}
              onChange={e => onChange('dueDate', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              onlyFloat
              label={t('addIssue.label.estimatedHours', 'Estimated Hours')}
              value={formData.estimatedHours}
              onChange={e => onChange('estimatedHours', e.target.value)}
              placeholder="e.g. 4.5"
            />
            <Input
              onlyFloat
              label={t('addIssue.label.actualHours', 'Actual Hours')}
              value={formData.actualHours}
              onChange={e => onChange('actualHours', e.target.value)}
              placeholder="e.g. 2.5"
            />
          </div>

          <Select
            label={t('issueDetail.metadata.version', 'Version')}
            options={versionOptions}
            value={formData.versionId}
            onValueChange={v => onChange('versionId', v)}
            placeholder="—"
            showSearch
          />
        </div>
      </div>
    </div>
  );
};
