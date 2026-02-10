'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TimePicker } from '@/components/ui/time-picker';
import { DatePicker } from '@/components/ui/date-picker';

type AddIssueFormData = {
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  startDate: string;
  dueDate: string;
  estimatedHours: string;
  actualHours: string;
};

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export default function AddIssuePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [formData, setFormData] = useState<AddIssueFormData>({
    title: '',
    description: '',
    status: '',
    priority: '',
    assignee: '',
    startDate: '',
    dueDate: '',
    estimatedHours: '',
    actualHours: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call
    console.log('Form data:', formData);
  };

  const handleChange = (field: keyof AddIssueFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen w-full bg-theme-neutral-3/40">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-theme-neutral-12">
              {t('addIssue.title')}
            </h1>
            <p className="mt-1 text-sm text-theme-neutral-9">
              {t('addIssue.description') ?? ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="border-theme-neutral-5"
            >
              {t('common.preview')}
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="bg-theme-main hover:bg-theme-hover text-theme-neutral-1"
            >
              {t('common.add')}
            </Button>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-theme-neutral-5/60 bg-theme-neutral-1 shadow-sm">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-8 px-6 py-6 md:px-8 md:py-8"
          >
            {/* General information */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-theme-neutral-9">
                  {t('addIssue.section.general') ?? 'General information'}
                </p>
                <p className="text-xs text-theme-neutral-8">
                  {t('addIssue.section.generalHint') ??
                    'Basic details to identify this issue.'}
                </p>
              </div>

              <Input
                label={t('addIssue.label.title')}
                required
                value={formData.title}
                onChange={e => handleChange('title', e.target.value)}
                placeholder={t('addIssue.placeholder.title')}
              />

              <Textarea
                label={t('addIssue.label.description')}
                value={formData.description}
                onChange={e => handleChange('description', e.target.value)}
                placeholder={t('addIssue.placeholder.description')}
                className="min-h-[180px]"
              />
            </div>

            <div className="h-px w-full bg-theme-neutral-4" />

            {/* Meta information */}
            <div className="space-y-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-theme-neutral-9">
                  {t('addIssue.section.meta') ?? 'Issue metadata'}
                </p>
                <p className="text-xs text-theme-neutral-8">
                  {t('addIssue.section.metaHint') ??
                    'Status, assignee and time tracking.'}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Left column */}
                <div className="space-y-4">
                  <Select
                    label="Status"
                    options={STATUS_OPTIONS}
                    value={formData.status}
                    onValueChange={value => handleChange('status', value)}
                    placeholder="Select status"
                  />

                  <Select
                    label={t('addIssue.label.priority')}
                    options={PRIORITY_OPTIONS}
                    value={formData.priority}
                    onValueChange={value => handleChange('priority', value)}
                    placeholder={t('addIssue.placeholder.priority')}
                  />

                  <div>
                    <Select
                      label={t('addIssue.label.assignee')}
                      showSearch={true}
                      options={[
                        { value: 'user1', label: 'User 1' },
                        { value: 'user2', label: 'User 2' },
                      ]}
                      value={formData.assignee}
                      onValueChange={value => handleChange('assignee', value)}
                      placeholder={t('addIssue.placeholder.assignee')}
                    />
                    <button
                      type="button"
                      className="mt-2 text-sm text-theme-main hover:underline cursor-pointer"
                      onClick={() => handleChange('assignee', 'me')}
                    >
                      {t('addIssue.myself')}
                    </button>
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <DatePicker
                      label={t('addIssue.label.startDate')}
                      value={formData.startDate}
                      onChange={e => handleChange('startDate', e.target.value)}
                    />
                    <TimePicker
                      label={t('addIssue.label.estimatedHours')}
                      value={formData.estimatedHours}
                      onChange={e =>
                        handleChange('estimatedHours', e.target.value)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <DatePicker
                      label={t('addIssue.label.dueDate')}
                      value={formData.dueDate}
                      onChange={e => handleChange('dueDate', e.target.value)}
                    />
                    <TimePicker
                      label={t('addIssue.label.actualHours')}
                      value={formData.actualHours}
                      onChange={e =>
                        handleChange('actualHours', e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
