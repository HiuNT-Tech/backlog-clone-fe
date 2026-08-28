'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import dayjs from 'dayjs';

import {
  IssuesTable,
  type IssueRow,
} from '@/components/shared/tables/IssuesTable';
import IssuesFilter from '@/components/shared/filters/IssuesFilter';
import { PRIORITY_OPTIONS } from '@/constant/data';
import { useCard } from '@/hooks/use-card';
import { usePagination } from '@/hooks/use-pagination';
import { useUserBoard } from '@/hooks/use-user-board';
import { useVersion } from '@/hooks/use-version';
import type { Card, CardListParams, EntityId, User } from '@/config/interface';
import { toEntityIdOrUndefined } from '@/lib/entity-id';

const IssuesPage: React.FC = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const boardId =
    toEntityIdOrUndefined(params?.projectId as string) ??
    toEntityIdOrUndefined(params?.id as string) ??
    toEntityIdOrUndefined(searchParams.get('boardId'));
  const pagination = usePagination();
  const [filterParams, setFilterParams] = useState<CardListParams>({});

  useEffect(() => {
    if (!boardId) {
      router.replace('/dashboard');
    }
  }, [boardId, router]);

  const apiParams = {
    ...pagination.apiParams,
    ...filterParams,
  };

  const { cards, totalCount, isLoading } = useCard(boardId, apiParams);
  const { versions } = useVersion(boardId, { skip: 0, limit: 100 });
  const { listUser } = useUserBoard(boardId, { skip: 0, limit: 100 });

  const toId = useCallback((value?: EntityId | User | null) => {
    if (!value) return undefined;
    return typeof value === 'number' ? value : value.id;
  }, []);

  const formatDate = useCallback((value?: string | number | null) => {
    return value ? dayjs(value).format('DD/MM/YYYY') : '—';
  }, []);

  const issueRows = useMemo<IssueRow[]>(() => {
    const versionMap = new Map(
      versions.map(version => [version.id, version.name])
    );
    const userMap = new Map(
      listUser.items.map(user => [user.userId, user.displayName])
    );

    const getUserName = (
      value?: EntityId | User | null,
      fallbackId?: EntityId
    ) => {
      if (value && typeof value !== 'number') {
        return value.displayName || '—';
      }

      const userId = toId(value) ?? fallbackId;
      if (!userId) return '—';
      return userMap.get(userId) ?? '—';
    };

    const getPriority = (priorityId?: number | null) => {
      const label = PRIORITY_OPTIONS.find(
        option => option.value === String(priorityId)
      )?.label;

      return label ? { label, value: priorityId } : null;
    };

    const getRegisterBy = (card: Card) => {
      return getUserName(
        card.registeredBy ?? card.createdBy,
        card.registeredByUserId ?? card.createdByUserId ?? undefined
      );
    };

    return cards.map(card => ({
      id: card.id,
      issueType: card.issueType
        ? {
            label: card.issueType.name,
            statusColor: card.issueType.statusColor,
          }
        : null,
      key: card.cardCode ?? '—',
      subject: card.title ?? '—',
      assignee: getUserName(card.assignee, card.assigneeUserId ?? undefined),
      status: card.column
        ? {
            label: card.column.title,
            statusColor: card.column.statusColor,
          }
        : null,
      priority: getPriority(card.priority),
      milestone: card.versionId ? (versionMap.get(card.versionId) ?? '—') : '—',
      created: formatDate(card.createdAt),
      startDate: formatDate(card.startDate),
      dueDate: formatDate(card.dueDate),
      estimatedHours: card.estimatedHours ?? '—',
      actualHours: card.actualHours ?? '—',
      registerBy: getRegisterBy(card),
    }));
  }, [cards, formatDate, listUser.items, toId, versions]);

  const handleSearch = (params: CardListParams) => {
    setFilterParams(params);
    pagination.setPage(1);
  };

  const handleRowClick = useCallback(
    (row: IssueRow) => {
      router.push(`/project/${boardId}/issues/${row.id}`);
    },
    [boardId, router]
  );

  return (
    <div className="space-y-5 ml-3">
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.01em] text-theme-neutral-11">
          {t('issues.title')}
        </h1>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-theme-neutral-8">
          {t('issues.description')}
        </p>
      </div>

      <IssuesFilter boardId={boardId} onSearch={handleSearch} />
      <IssuesTable
        data={issueRows}
        loading={isLoading}
        totalCount={totalCount}
        page={pagination.page}
        limit={pagination.limit}
        onPageChange={pagination.setPage}
        onPageSizeChange={pagination.setLimit}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default IssuesPage;
