'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import ReactMarkdown from 'react-markdown';
import {
  ArrowLeft,
  Paperclip,
  ChevronUp,
  ChevronDown,
  Pencil,
  Star,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { MarkdownEditor } from '@/components/ui/markdown-editor';
import { useCardDetail } from '@/hooks/use-card-detail';
import { useVersion } from '@/hooks/use-version';
import { useUserBoard } from '@/hooks/use-user-board';
import { useColumn } from '@/hooks/use-column';
import { useIssueType } from '@/hooks/use-issue-type';
import { PRIORITY_OPTIONS, getIssueTypeBadgeClassName } from '@/constant/data';
import { PRIORITY } from '@/config/enum';
import { toastHelpers } from '@/hooks/use-toast';
import type { Card, User as UserType } from '@/config/interface';
import { format } from '@/constant/format';
import { DescriptionCard } from './description-card';
import { CommentList, StickyCommentBar } from './comment-section';

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

const DetailSkeleton: React.FC = () => (
  <div className="w-full animate-pulse px-6 py-6">
    <div className="h-6 w-40 bg-theme-neutral-4 rounded mb-4" />
    <div className="h-8 w-3/4 bg-theme-neutral-4 rounded mb-6" />
    <div className="h-40 bg-theme-neutral-4 rounded mb-4" />
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-10 bg-theme-neutral-4 rounded" />
      ))}
    </div>
  </div>
);

export default function IssueDetailPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const cardId = params.id as string;
  const boardId = searchParams.get('boardId') ?? undefined;

  const [commentValue, setCommentValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [metaCollapsed, setMetaCollapsed] = useState(false);
  const [isPreviewComment, setIsPreviewComment] = useState(false);

  const { card, isLoading, error, updateCard, isUpdating } =
    useCardDetail(cardId);
  const { versions } = useVersion(boardId, { skip: 0, limit: 100 });
  const { listUser } = useUserBoard(boardId, { skip: 0, limit: 100 });
  const { columns } = useColumn(boardId);
  const { issueTypes } = useIssueType(boardId);

  const STATUS_OPTIONS = useMemo(
    () => columns.map(c => ({ value: c._id, label: c.title })),
    [columns]
  );
  const VERSION_OPTIONS = useMemo(
    () => versions.map(v => ({ value: v._id, label: v.name })),
    [versions]
  );
  const ISSUE_TYPE_OPTIONS_LIST = useMemo(
    () => issueTypes.map(it => ({ value: it._id, label: it.name })),
    [issueTypes]
  );
  const PRIORITY_SELECT_OPTIONS = useMemo(
    () => [
      { value: String(PRIORITY.LOW), label: t('priority.low') },
      { value: String(PRIORITY.NORMAL), label: t('priority.normal') },
      { value: String(PRIORITY.HIGH), label: t('priority.high') },
    ],
    [t]
  );
  const USER_OPTIONS = useMemo(
    () =>
      listUser.items.map(u => ({
        value: String(u.userId),
        label: u.displayName,
      })),
    [listUser.items]
  );

  const userMap = useMemo(
    () => new Map(listUser.items.map(u => [String(u.userId), u.displayName])),
    [listUser.items]
  );

  const resolveUser = useCallback(
    (val?: string | UserType | null, fallbackId?: string) => {
      if (val && typeof val !== 'string')
        return val.displayName || val.username || '—';
      const id = (typeof val === 'string' ? val : '') || fallbackId || '';
      return userMap.get(id) ?? t('issueDetail.unassigned');
    },
    [userMap, t]
  );

  const statusInfo = useMemo(() => {
    if (card?.status) return card.status;
    if (card?.columnId) {
      const col = columns.find(c => c._id === card.columnId);
      if (col)
        return {
          _id: col._id,
          boardId: col.boardId,
          title: col.title,
          statusColor: col.statusColor,
        };
    }
    return null;
  }, [card, columns]);

  const issueTypeInfo = useMemo(() => {
    if (card?.issueType) return card.issueType;
    if (card?.issueTypeId) {
      const it = issueTypes.find(i => i._id === card.issueTypeId);
      if (it)
        return {
          _id: it._id,
          boardId: '',
          name: it.name,
          statusColor: it.statusColor,
        };
    }
    return null;
  }, [card, issueTypes]);

  const priorityLabel = useMemo(() => {
    if (!card?.priorityId) return null;
    return (
      PRIORITY_OPTIONS.find(o => o.value === String(card.priorityId))?.label ??
      null
    );
  }, [card?.priorityId]);

  const handleFieldUpdate = useCallback(
    async (field: string, value: any) => {
      if (!card) return;
      try {
        const payload: Record<string, any> = {};
        if (field === 'description')
          payload.description = value?.trim() || null;
        else if (field === 'priorityId')
          payload.priorityId = value ? Number(value) : null;
        else if (field === 'estimatedHours' || field === 'actualHours')
          payload[field] = value?.trim() || null;
        else payload[field] = value || null;
        await updateCard(payload);
        toastHelpers.success({ title: t('issueDetail.updateSuccess') });
      } catch {
        toastHelpers.error({ title: 'Update failed' });
      }
    },
    [card, updateCard, t]
  );

  const handleBack = () => {
    if (boardId) router.push(`/issues?boardId=${boardId}`);
    else router.back();
  };

  if (isLoading) return <DetailSkeleton />;

  if (error || !card) {
    return (
      <div className="px-6 py-8">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm text-theme-main hover:underline mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> {t('issueDetail.back')}
        </button>
        <div className="bg-white rounded-xl border border-theme-neutral-5/60 p-12 text-center">
          <p className="text-theme-neutral-8 text-lg">
            {t('issueDetail.notFound')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full w-full bg-theme-neutral-3/40">
      <div className="bg-white border-b border-theme-neutral-4/60 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="text-theme-main hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            {issueTypeInfo && (
              <StatusBadge
                label={issueTypeInfo.name}
                statusColor={issueTypeInfo.statusColor}
              />
            )}
            <span className="text-sm font-mono text-theme-neutral-9">
              {format.shortKey(card._id)}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-theme-neutral-8">
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
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-xl font-bold text-theme-neutral-11 leading-tight flex-1 mr-4">
            {card.title || '—'}
          </h1>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-theme-neutral-5 text-theme-neutral-9 gap-1.5"
              onClick={() => {
                if (boardId)
                  router.push(`/add-issue?boardId=${boardId}&editId=${cardId}`);
              }}
            >
              <Pencil className="w-3.5 h-3.5" /> {t('issueDetail.edit')}
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

        <CommentList />
      </div>

      <StickyCommentBar
        card={card}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        commentValue={commentValue}
        setCommentValue={setCommentValue}
        isPreviewComment={isPreviewComment}
        setIsPreviewComment={setIsPreviewComment}
        STATUS_OPTIONS={STATUS_OPTIONS}
        USER_OPTIONS={USER_OPTIONS}
        VERSION_OPTIONS={VERSION_OPTIONS}
        handleFieldUpdate={handleFieldUpdate}
      />
    </div>
  );
}
