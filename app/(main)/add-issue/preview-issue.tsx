'use client';

import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { getIssueTypeBadgeClassName } from '@/constant/data';
import { format } from '@/constant/format';
import type {
  Card,
  CardIssueType,
  CardStatus,
  Version,
} from '@/config/interface';
import { DescriptionCard } from '../issues/[id]/description-card';

const StatusBadge: React.FC<{
  label?: string;
  statusColor?: number | null;
}> = ({ label, statusColor }) => {
  if (!label) return <span className="text-theme-neutral-7">—</span>;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getIssueTypeBadgeClassName(statusColor)}`}
    >
      {label}
    </span>
  );
};

interface PreviewIssueProps {
  card: Card;
  versions: Version[];
  issueTypeInfo: CardIssueType | null;
  statusInfo: CardStatus | null;
  priorityLabel: string | null;
  resolveUser: (user: Card['assignee'], fallbackId?: string) => string;
  isSubmitting: boolean;
  onBack: () => void;
  onAdd: () => void;
}

export const PreviewIssue: React.FC<PreviewIssueProps> = ({
  card,
  versions,
  issueTypeInfo,
  statusInfo,
  priorityLabel,
  resolveUser,
  isSubmitting,
  onBack,
  onAdd,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen w-full flex-col bg-theme-neutral-3/40">
      <div className="border-b border-theme-neutral-4/60 bg-white px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="cursor-pointer text-theme-main hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            {issueTypeInfo && (
              <StatusBadge
                label={issueTypeInfo.name}
                statusColor={issueTypeInfo.statusColor}
              />
            )}
            <span className="font-mono text-sm text-theme-neutral-9">
              {format.shortKey(card._id)}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-4 text-sm text-theme-neutral-8">
            <span>
              Start Date:{' '}
              <strong className="text-theme-neutral-11">
                {format.date(card.startDate)}
              </strong>
            </span>
            <span>
              Due Date:{' '}
              <strong className="text-theme-neutral-11">
                {format.date(card.dueDate)}
              </strong>
            </span>
            {statusInfo && (
              <StatusBadge
                label={statusInfo.title}
                statusColor={statusInfo.statusColor}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-4">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h1 className="mr-4 flex-1 text-xl font-bold leading-tight text-theme-neutral-11">
            {card.title || '—'}
          </h1>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-theme-neutral-5 text-theme-neutral-9"
              onClick={onBack}
            >
              {t('issueDetail.edit')}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onAdd}
              disabled={isSubmitting}
              className="bg-theme-main text-theme-neutral-1 hover:bg-theme-hover"
            >
              {isSubmitting ? t('common.loading') : t('common.add')}
            </Button>
          </div>
        </div>

        <DescriptionCard
          card={card}
          versions={versions}
          issueTypeInfo={issueTypeInfo}
          priorityLabel={priorityLabel}
          resolveUser={resolveUser}
        />
      </div>
    </div>
  );
};
