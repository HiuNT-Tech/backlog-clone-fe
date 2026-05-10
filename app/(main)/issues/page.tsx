'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useRouter } from 'next/navigation';
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
import type { Card, CardListParams, User } from '@/config/interface';

const IssuesPage: React.FC = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const boardId = searchParams.get('boardId') ?? undefined;
  const pagination = usePagination();
  const [filterParams, setFilterParams] = useState<CardListParams>({});

  const apiParams = {
    ...pagination.apiParams,
    ...filterParams,
  };

  const { cards, totalCount, isLoadingList } = useCard(boardId, apiParams);
  const { versions } = useVersion(boardId, { skip: 0, limit: 100 });
  const { listUser } = useUserBoard(boardId, { skip: 0, limit: 100 });

  const toId = useCallback((value?: string | User | null) => {
    if (!value) return '';
    return typeof value === 'string' ? value : value._id;
  }, []);

  const formatDate = useCallback((value?: string | number | null) => {
    return value ? dayjs(value).format('DD/MM/YYYY') : '—';
  }, []);

  const issueRows = useMemo<IssueRow[]>(() => {
    const versionMap = new Map(
      versions.map(version => [String(version._id), version.name])
    );
    const userMap = new Map(
      listUser.items.map(user => [String(user.userId), user.displayName])
    );

    const getUserName = (value?: string | User | null, fallbackId?: string) => {
      if (value && typeof value !== 'string') {
        return value.displayName || value.username || '—';
      }

      const userId = toId(value) || fallbackId || '';
      return userMap.get(userId) ?? '—';
    };

    const getPriorityText = (priorityId?: number | null) => {
      return (
        PRIORITY_OPTIONS.find(option => option.value === String(priorityId))
          ?.label ?? '—'
      );
    };

    const getRegisterBy = (card: Card) => {
      return getUserName(
        card.registeredBy ?? card.createdBy,
        card.registeredById ?? card.createdById ?? undefined
      );
    };

    return cards.map(card => ({
      id: card._id,
      issueType: card.issueType
        ? {
            label: card.issueType.name,
            statusColor: card.issueType.statusColor,
          }
        : null,
      key: card._id ? `#${card._id.slice(-6).toUpperCase()}` : '—',
      subject: card.title ?? '—',
      assignee: getUserName(card.assignee, card.assigneeId ?? undefined),
      status: card.status
        ? {
            label: card.status.title,
            statusColor: card.status.statusColor,
          }
        : null,
      priority: getPriorityText(card.priorityId),
      milestone: versionMap.get(toId(card.versionId)) ?? '—',
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
      const query = boardId ? `?boardId=${boardId}` : '';
      router.push(`/issues/${row.id}${query}`);
    },
    [boardId, router]
  );

  return (
    <div className="space-y-5">
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
        loading={isLoadingList}
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
