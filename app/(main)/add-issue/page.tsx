'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TimePicker } from '@/components/ui/time-picker';
import { DatePicker } from '@/components/ui/date-picker';
import { PRIORITY } from '@/config/enum';
import { useVersion } from '@/hooks/use-version';
import { useColumn } from '@/hooks/use-column';
import { useIssueType } from '@/hooks/use-issue-type';
import { BoardService } from '@/lib/apis/board';
import { toastHelpers } from '@/hooks/use-toast';
import { CreateNewCardRequest } from '@/config/interface';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type AddIssueFormData = {
  title: string;
  description: string;
  status: string;
  priority: string;
  issueType: string;
  assignee: string;
  startDate: string;
  dueDate: string;
  estimatedHours: string;
  actualHours: string;
  version: string;
};

export default function AddIssuePage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const boardId = searchParams.get('boardId') || '';

  const { versions } = useVersion(boardId);
  const { columns } = useColumn(boardId);
  const { issueTypes } = useIssueType(boardId);
  const [formData, setFormData] = useState<AddIssueFormData>({
    title: '',
    description: '',
    status: '',
    priority: '',
    issueType: '',
    assignee: '',
    startDate: '',
    dueDate: '',
    estimatedHours: '',
    actualHours: '',
    version: '',
  });

  const STATUS_OPTIONS = columns.map(column => ({
    value: column._id,
    label: column.title,
  }));

  const VERSION_OPTIONS = versions.map(version => ({
    value: version._id,
    label: version.name,
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    mutateAsync: createNewCard,
    isPending: isCreateCardPending,
    error: createNewCardError,
  } = useMutation({
    mutationFn: async (card: CreateNewCardRequest) => {
      return await BoardService.createNewCard(card);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      toastHelpers.success({ title: t('toast.success.cardCreated') });
      router.back();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.status) return;

    setIsSubmitting(true);
    try {
      const payload: CreateNewCardRequest = {
        boardId: boardId,
        columnId: formData.status,
        title: formData.title.trim(),
        ...(formData.description && { description: formData.description }),
        ...(formData.priority && { priorityId: Number(formData.priority) }),
        ...(formData.issueType && { issueTypeId: formData.issueType }),
        ...(formData.version && { versionId: formData.version }),
        ...(formData.startDate && { startDate: formData.startDate }),
        ...(formData.dueDate && { dueDate: formData.dueDate }),
        ...(formData.estimatedHours && {
          estimatedHours: formData.estimatedHours,
        }),
        ...(formData.actualHours && { actualHours: formData.actualHours }),
      };

      await createNewCard(payload);
    } catch {
      toastHelpers.error({ title: t('toast.error.userLoginFailed') });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof AddIssueFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const PRIORITY_OPTIONS = [
    { value: String(PRIORITY.LOW), label: t('priority.low') },
    { value: String(PRIORITY.NORMAL), label: t('priority.normal') },
    { value: String(PRIORITY.HIGH), label: t('priority.high') },
  ];

  const ISSUE_TYPE_OPTIONS = issueTypes.map(issueType => ({
    value: issueType._id,
    label: issueType.name,
  }));

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
              disabled={isSubmitting}
              className="bg-theme-main hover:bg-theme-hover text-theme-neutral-1"
            >
              {isSubmitting ? t('common.loading') : t('common.add')}
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

                  <Select
                    label={t('addIssue.label.issueType')}
                    options={ISSUE_TYPE_OPTIONS}
                    value={formData.issueType}
                    onValueChange={value => handleChange('issueType', value)}
                    placeholder={t('addIssue.placeholder.issueType')}
                    showSearch={true}
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
                    <DatePicker
                      label={t('addIssue.label.dueDate')}
                      value={formData.dueDate}
                      onChange={e => handleChange('dueDate', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <TimePicker
                      label={t('addIssue.label.estimatedHours')}
                      value={formData.estimatedHours}
                      onChange={e =>
                        handleChange('estimatedHours', e.target.value)
                      }
                    />
                    <TimePicker
                      label={t('addIssue.label.actualHours')}
                      value={formData.actualHours}
                      onChange={e =>
                        handleChange('actualHours', e.target.value)
                      }
                    />
                  </div>
                  <Select
                    label={t('addIssue.label.version')}
                    showSearch={true}
                    options={VERSION_OPTIONS}
                    value={formData.version}
                    onValueChange={value => handleChange('version', value)}
                    placeholder={t('addIssue.placeholder.version')}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
