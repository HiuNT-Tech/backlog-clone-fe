'use client';

import React from 'react';
import { Modal } from '@/components/ui/modal';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Select } from '@/components/ui/select';
import { TimePicker } from '@/components/ui/time-picker';

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

  const [formData, setFormData] = React.useState<CardFormData>({
    title: '',
    description: '',
    status: undefined,
    assignee: undefined,
    priority: undefined,
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

  // Mock options - these should come from props or API in real implementation
  const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
    { value: 'closed', label: 'Closed' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

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
        <div className="space-y-1">
          <label className="text-sm font-medium text-theme-neutral-11">
            {t('column.addNewCard.popup.descriptionLabel')}
          </label>
          <textarea
            className="flex w-full rounded-md border border-theme-neutral-5 bg-theme-neutral-2 px-3 py-2 text-sm placeholder:text-theme-neutral-6 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            rows={4}
            placeholder={t('column.addNewCard.popup.descriptionPlaceholder')}
            value={formData.description}
            onChange={e => updateField('description', e.target.value)}
          />
        </div>

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
