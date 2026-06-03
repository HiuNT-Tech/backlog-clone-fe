'use client';

import React from 'react';
import { Modal } from '@/components/ui/modal';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Select } from '@/components/ui/select';
import { TimePicker } from '@/components/ui/time-picker';
import { Textarea } from '@/components/ui/textarea';
import { useVersion } from '@/hooks/use-version';
import { useColumn } from '@/hooks/use-column';
import { useIssueType } from '@/hooks/use-issue-type';
import { PRIORITY } from '@/config/enum';

interface AddNewCardPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (cardData: CardFormData) => void;
}

export interface CardFormData {
  title: string;
  description: string;
  status?: string;
  assignee?: string;
  priority?: string;
  issueType?: string;
  version?: string;
  startDate?: string;
  dueDate?: string;
  estimatedHours?: string;
  actualHours?: string;
}

const AddNewCardPopup: React.FC<AddNewCardPopupProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();

  const { versions } = useVersion();
  const { columns } = useColumn();
  const { issueTypes } = useIssueType();

  const [formData, setFormData] = React.useState<CardFormData>({
    title: '',
    description: '',
    status: undefined,
    assignee: undefined,
    priority: undefined,
    issueType: undefined,
    version: undefined,
    startDate: undefined,
    dueDate: undefined,
    estimatedHours: undefined,
    actualHours: undefined,
  });

  React.useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '',
        description: '',
        status: undefined,
        assignee: undefined,
        priority: undefined,
        issueType: undefined,
        version: undefined,
        startDate: undefined,
        dueDate: undefined,
        estimatedHours: undefined,
        actualHours: undefined,
      });
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (formData.title.trim() && onConfirm) {
      onConfirm(formData);
    }
  };
  const updateField = (
    field: keyof CardFormData,
    value: string | undefined
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Options from hooks and enums
  const statusOptions = columns.map(column => ({
    value: String(column.id),
    label: column.title,
  }));

  const priorityOptions = [
    { value: String(PRIORITY.LOW), label: t('priority.low') },
    { value: String(PRIORITY.NORMAL), label: t('priority.normal') },
    { value: String(PRIORITY.HIGH), label: t('priority.high') },
  ];

  const versionOptions = versions.map(version => ({
    value: String(version.id),
    label: version.name,
  }));

  const issueTypeOptions = issueTypes.map(issueType => ({
    value: String(issueType.id),
    label: issueType.name,
  }));

  const assigneeOptions = [
    { value: 'user1', label: 'John Doe' },
    { value: 'user2', label: 'Jane Smith' },
    { value: 'user3', label: 'Bob Johnson' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('column.addNewCard.popup.title')}
      size="lg"
    >
      <div className="flex flex-col gap-4">
        {/* Title Field */}
        <Input
          label={t('column.addNewCard.popup.titleLabel')}
          placeholder={t('column.addNewCard.popup.titlePlaceholder')}
          value={formData.title}
          onChange={e => updateField('title', e.target.value)}
          required
        />

        {/* Description Field */}
        <Textarea
          label={t('column.addNewCard.popup.descriptionLabel')}
          placeholder={t('column.addNewCard.popup.descriptionPlaceholder')}
          value={formData.description}
          onChange={e => updateField('description', e.target.value)}
          className="min-h-[100px]"
        />

        {/* Two Column Layout for Status and Assignee */}
        <div className="grid grid-cols-2 gap-4">
          {/* Status */}
          <Select
            label={t('column.addNewCard.popup.statusLabel')}
            placeholder={t('column.addNewCard.popup.statusPlaceholder')}
            value={formData.status}
            onValueChange={(value: string) => updateField('status', value)}
            options={statusOptions}
          />

          {/* Assignee */}
          <Select
            label={t('column.addNewCard.popup.assigneeLabel')}
            placeholder={t('column.addNewCard.popup.assigneePlaceholder')}
            value={formData.assignee}
            onValueChange={(value: string) => updateField('assignee', value)}
            options={assigneeOptions}
          />
        </div>

        {/* Priority */}
        <Select
          label={t('column.addNewCard.popup.priorityLabel')}
          placeholder={t('column.addNewCard.popup.priorityPlaceholder')}
          value={formData.priority}
          onValueChange={(value: string) => updateField('priority', value)}
          options={priorityOptions}
        />

        {/* Issue Type */}
        <Select
          label={t('addIssue.label.issueType')}
          placeholder={t('addIssue.placeholder.issueType')}
          value={formData.issueType}
          onValueChange={(value: string) => updateField('issueType', value)}
          options={issueTypeOptions}
          showSearch={true}
        />

        {/* Version */}
        <Select
          label={t('addIssue.label.version')}
          placeholder={t('addIssue.placeholder.version')}
          value={formData.version}
          onValueChange={(value: string) => updateField('version', value)}
          options={versionOptions}
          showSearch={true}
        />

        {/* Two Column Layout for Dates */}
        <div className="grid grid-cols-2 gap-4">
          {/* Start Date */}
          <DatePicker
            label={t('column.addNewCard.popup.startDateLabel')}
            value={formData.startDate || ''}
            onChange={e => updateField('startDate', e.target.value)}
          />

          {/* Due Date */}
          <DatePicker
            label={t('column.addNewCard.popup.dueDateLabel')}
            value={formData.dueDate || ''}
            onChange={e => updateField('dueDate', e.target.value)}
          />
        </div>

        {/* Two Column Layout for Hours */}
        <div className="grid grid-cols-2 gap-4">
          {/* Estimated Hours */}
          <TimePicker
            label={t('column.addNewCard.popup.estimatedHoursLabel')}
            placeholder={t('column.addNewCard.popup.estimatedHoursPlaceholder')}
            value={formData.estimatedHours}
            onChange={e => updateField('estimatedHours', e.target.value)}
          />

          {/* Actual Hours */}
          <TimePicker
            label={t('column.addNewCard.popup.actualHoursLabel')}
            placeholder={t('column.addNewCard.popup.actualHoursPlaceholder')}
            value={formData.actualHours}
            onChange={e => updateField('actualHours', e.target.value)}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-theme-neutral-4">
          <Button variant="secondary" onClick={onClose} className="px-8">
            {t('common.cancel')}
          </Button>
          <Button
            variant="outline"
            onClick={() => console.log('Preview:', formData)}
            className="px-8"
          >
            {t('column.addNewCard.popup.preview')}
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!formData.title.trim()}
            className="px-8"
          >
            {t('common.add')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddNewCardPopup;
