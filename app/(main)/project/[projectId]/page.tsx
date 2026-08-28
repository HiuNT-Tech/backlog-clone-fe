'use client';

import { useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import Images from '@/assets';
import { Button } from '@/components/ui/button';
import { getIssueTypeBadgeClassName, getStatusColorHex } from '@/constant/data';
import { toEntityIdOrUndefined } from '@/lib/entity-id';
import { BoardService } from '@/lib/apis/board';
import { useCard } from '@/hooks/use-card';
import { useColumn } from '@/hooks/use-column';
import { useUserBoard } from '@/hooks/use-user-board';
import { useVersion } from '@/hooks/use-version';
import type { Card, Column } from '@/config/interface';
import { HomeGanttChart } from './HomeGanttChart';

const RECENT_LIMIT = 100;

const getInitials = (name: string): string => {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('');
};

const formatAge = (value?: string | number | null): string => {
  if (!value) return '';
  const hours = dayjs().diff(dayjs(value), 'hour');
  if (hours < 1) return '<1h';
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
};

function StatBlock({
  label,
  value,
  pct,
  colorHex,
}: {
  label: string;
  value: number;
  pct: number;
  colorHex: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-[10px] border border-theme-neutral-4 bg-theme-neutral-1 px-4 py-3.5">
      <div className="flex items-center justify-between">
        <span className="truncate text-[11px] font-bold tracking-[0.08em] text-theme-neutral-7 uppercase">
          {label}
        </span>
        <span className="text-[10.5px] font-bold" style={{ color: colorHex }}>
          {pct}%
        </span>
      </div>
      <span
        className="text-[28px] leading-none font-extrabold tracking-[-0.03em]"
        style={{ color: colorHex }}
      >
        {value}
      </span>
      <div className="h-[3px] overflow-hidden rounded-full bg-theme-neutral-4">
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{ width: `${pct}%`, background: colorHex }}
        />
      </div>
    </div>
  );
}

export default function ProjectHomePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams<{ projectId: string }>();
  const boardId = toEntityIdOrUndefined(params?.projectId);

  useEffect(() => {
    if (!boardId) {
      router.replace('/dashboard');
    }
  }, [boardId, router]);

  const { data: board, isLoading: isBoardLoading } = useQuery({
    queryKey: ['board-detail', boardId],
    queryFn: () => BoardService.getBoardById(boardId!),
    enabled: !!boardId,
  });

  const { columns, isLoading: isColumnsLoading } = useColumn(boardId);
  const { cards: recentCards } = useCard(boardId, {
    limit: RECENT_LIMIT,
  });
  const { listUser } = useUserBoard(boardId, { skip: 0, limit: 100 });
  const { versions } = useVersion(boardId, { skip: 0, limit: 100 });

  const sortedColumns = useMemo<Column[]>(
    () => [...columns].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
    [columns]
  );
  const lastColumn = sortedColumns[sortedColumns.length - 1];
  const secondColumn = sortedColumns[1];

  const totalCardCount = sortedColumns.reduce(
    (sum, col) => sum + (col._count?.cards ?? 0),
    0
  );

  // Sprint = version đang chạy (today nằm trong [startDate, endDate]); nếu
  // không có, lấy version sắp tới gần nhất. Không có version nào phù hợp thì
  // ẩn hẳn khối sprint.
  const activeVersion = useMemo(() => {
    const now = dayjs();
    const withDates = versions.filter(v => v.startDate && v.endDate);

    const running = withDates.find(v => {
      const start = dayjs(v.startDate);
      const end = dayjs(v.endDate);
      return !now.isBefore(start) && !now.isAfter(end);
    });
    if (running) return running;

    const upcoming = withDates
      .filter(v => dayjs(v.startDate).isAfter(now))
      .sort(
        (a, b) => dayjs(a.startDate).valueOf() - dayjs(b.startDate).valueOf()
      );
    return upcoming[0];
  }, [versions]);

  const { totalCount: sprintTotal } = useCard(
    activeVersion ? boardId : undefined,
    activeVersion
      ? { versionId: String(activeVersion.id), limit: 1 }
      : undefined
  );
  const { totalCount: sprintDone } = useCard(
    activeVersion && lastColumn ? boardId : undefined,
    activeVersion && lastColumn
      ? {
          versionId: String(activeVersion.id),
          columnId: String(lastColumn.id),
          limit: 1,
        }
      : undefined
  );

  const { cards: inProgressCards } = useCard(
    secondColumn ? boardId : undefined,
    secondColumn ? { columnId: String(secondColumn.id), limit: 8 } : undefined
  );

  const scheduledCards = useMemo(
    () => recentCards.filter(c => c.startDate && c.dueDate),
    [recentCards]
  );

  const recentIssues = useMemo(() => recentCards.slice(0, 8), [recentCards]);

  const memberMap = useMemo(
    () => new Map(listUser.items.map(u => [u.userId, u])),
    [listUser.items]
  );

  const getAssignee = (card: Card) => {
    if (card.assignee) return card.assignee;
    if (card.assigneeUserId) return memberMap.get(card.assigneeUserId);
    return undefined;
  };

  if (!boardId) return null;

  const isLoading = isBoardLoading || isColumnsLoading;
  const sprintPct =
    activeVersion && sprintTotal > 0
      ? Math.round((sprintDone / sprintTotal) * 100)
      : 0;
  const sprintDaysLeft = activeVersion?.endDate
    ? Math.max(0, dayjs(activeVersion.endDate).diff(dayjs(), 'day'))
    : null;

  return (
    <div className="h-full overflow-y-auto bg-theme-neutral-2/40">
      {/* Project header */}
      <div className="border-b border-theme-neutral-4 bg-theme-neutral-1 px-7 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-theme-main text-[10px] font-extrabold text-white">
              {board?.boardCode?.slice(0, 4) ?? '—'}
            </div>
            <div>
              <h1 className="text-lg leading-tight font-extrabold tracking-[-0.02em] text-theme-neutral-11">
                {isLoading ? t('common.loading') : (board?.title ?? '—')}
              </h1>
              {board?.description && (
                <p className="mt-1 text-[12.5px] text-theme-neutral-7">
                  {board.description}
                </p>
              )}
            </div>
          </div>

          <Button
            onClick={() => router.push(`/project/${boardId}/add-issue`)}
            className="h-[34px] shrink-0 gap-1.5 bg-theme-neutral-11 px-3.5 text-[13px] font-semibold text-white hover:opacity-85"
          >
            <Image src={Images.IconAdd} alt="" width={11} height={11} />
            {t('projectHome.newIssue')}
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px]">
        {/* Left: main content */}
        <div className="flex flex-col gap-6 border-theme-neutral-3 px-7 py-5.5 lg:border-r">
          {/* Stat row */}
          {sortedColumns.length > 0 && (
            <div className="flex flex-wrap gap-2.5">
              {sortedColumns.map(col => {
                const count = col._count?.cards ?? 0;
                const pct = totalCardCount
                  ? Math.round((count / totalCardCount) * 100)
                  : 0;
                return (
                  <StatBlock
                    key={col.id}
                    label={col.title}
                    value={count}
                    pct={pct}
                    colorHex={getStatusColorHex(col.statusColor)}
                  />
                );
              })}
            </div>
          )}

          {/* Sprint card */}
          {activeVersion && (
            <div className="rounded-xl border border-theme-neutral-4 bg-theme-neutral-1 px-5 py-4.5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-[15px] font-bold tracking-[-0.01em] text-theme-neutral-11">
                    {activeVersion.name}
                    <span className="ml-2 rounded-[4px] bg-theme-main-1 px-1.5 py-0.5 text-[11px] font-semibold text-theme-main-6">
                      {t('projectHome.sprint.active')}
                    </span>
                  </div>
                  <div className="mt-0.5 text-xs text-theme-neutral-7">
                    {sprintDaysLeft !== null &&
                      t('projectHome.sprint.daysLeft', {
                        count: sprintDaysLeft,
                      }) + ' · '}
                    {t('projectHome.sprint.closedOfTotal', {
                      done: sprintDone,
                      total: sprintTotal,
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[26px] leading-none font-extrabold tracking-[-0.03em] text-theme-main-6">
                    {sprintPct}%
                  </div>
                  <div className="text-[11px] text-theme-neutral-7">
                    {t('projectHome.sprint.complete')}
                  </div>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-theme-neutral-4">
                <div
                  className="h-full rounded-full bg-theme-main transition-[width] duration-500"
                  style={{ width: `${sprintPct}%` }}
                />
              </div>
            </div>
          )}

          {/* Gantt */}
          <HomeGanttChart
            cards={scheduledCards}
            totalScheduledCount={
              // Không chắc BE có nhiều hơn RECENT_LIMIT card lịch trình hay
              // không, nên chỉ so sánh trong tập đã tải để quyết định có hiện
              // ghi chú "đã rút gọn" hay không.
              scheduledCards.length
            }
          />

          {/* Recent issues */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10.5px] font-bold tracking-[0.1em] text-theme-neutral-7 uppercase">
                {t('projectHome.recentIssues')}
              </span>
              <button
                type="button"
                onClick={() => router.push(`/project/${boardId}/issues`)}
                className="cursor-pointer text-xs font-semibold text-theme-main-6 hover:underline"
              >
                {t('projectHome.viewAll')}
              </button>
            </div>

            {recentIssues.length === 0 ? (
              <p className="text-sm text-theme-neutral-6 italic">
                {t('projectHome.noIssues')}
              </p>
            ) : (
              <div>
                {recentIssues.map(issue => {
                  const assignee = getAssignee(issue);
                  return (
                    <div
                      key={issue.id}
                      className="flex items-center gap-3 border-b border-theme-neutral-3 py-2.5 last:border-b-0"
                    >
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{
                          background: getStatusColorHex(
                            issue.column?.statusColor
                          ),
                        }}
                      />
                      <Link
                        href={`/project/${boardId}/issues/${issue.id}`}
                        className="w-14 shrink-0 text-[11px] text-theme-neutral-7 hover:text-theme-main-6 hover:underline"
                      >
                        {issue.cardCode}
                      </Link>
                      <span className="flex-1 truncate text-[13px] font-medium text-theme-neutral-11">
                        {issue.title}
                      </span>
                      {issue.issueType && (
                        <span
                          className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${getIssueTypeBadgeClassName(issue.issueType.statusColor).replace('min-w-[100px] justify-center text-center', '')}`}
                        >
                          {issue.issueType.name}
                        </span>
                      )}
                      {assignee && (
                        <div
                          title={assignee.displayName}
                          className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-theme-main-2 text-[8.5px] font-bold text-theme-main-7"
                        >
                          {getInitials(assignee.displayName ?? '?')}
                        </div>
                      )}
                      <span className="w-7 shrink-0 text-right text-[11px] text-theme-neutral-6">
                        {formatAge(issue.updatedAt)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: sidebar */}
        <div className="flex flex-col gap-5.5 px-5 py-5.5">
          {/* Second column bucket (analogous to "In Progress") */}
          {secondColumn && (
            <div>
              <div className="mb-2.5 text-[10.5px] font-bold tracking-[0.1em] text-theme-neutral-7 uppercase">
                {secondColumn.title}
              </div>
              {inProgressCards.length === 0 ? (
                <p className="text-[12.5px] text-theme-neutral-6 italic">
                  {t('projectHome.noIssues')}
                </p>
              ) : (
                inProgressCards.map(issue => {
                  const assignee = getAssignee(issue);
                  return (
                    <div
                      key={issue.id}
                      className="flex items-center gap-2 border-b border-theme-neutral-3 py-1.5 last:border-b-0"
                    >
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{
                          background: getStatusColorHex(
                            secondColumn.statusColor
                          ),
                        }}
                      />
                      <span className="flex-1 truncate text-[12.5px] font-medium text-theme-neutral-11">
                        {issue.title}
                      </span>
                      {assignee && (
                        <div
                          title={assignee.displayName}
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-theme-main-2 text-[7.5px] font-bold text-theme-main-7"
                        >
                          {getInitials(assignee.displayName ?? '?')}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Team */}
          <div>
            <div className="mb-2.5 text-[10.5px] font-bold tracking-[0.1em] text-theme-neutral-7 uppercase">
              {t('projectHome.team')}
            </div>
            {listUser.items.map(member => {
              const assigned = recentCards.filter(
                c =>
                  (c.assigneeUserId === member.userId ||
                    c.assignee?.id === member.userId) &&
                  c.column?.id !== lastColumn?.id
              );
              const inProg = secondColumn
                ? assigned.filter(c => c.column?.id === secondColumn.id).length
                : 0;
              return (
                <div
                  key={member.userId}
                  className="flex items-center gap-2.5 border-b border-theme-neutral-3 py-2 last:border-b-0"
                >
                  <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-theme-main-2 text-[11px] font-bold text-theme-main-7">
                    {getInitials(member.displayName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] leading-none font-semibold text-theme-neutral-11">
                      {member.displayName}
                    </div>
                    <div className="mt-0.5 text-[11.5px] text-theme-neutral-7">
                      {t('projectHome.openInProgress', {
                        open: assigned.length,
                        inProgress: inProg,
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick access */}
          <div>
            <div className="mb-2.5 text-[10.5px] font-bold tracking-[0.1em] text-theme-neutral-7 uppercase">
              {t('projectHome.quickAccess')}
            </div>
            <div className="flex flex-col gap-1">
              {[
                {
                  label: t('sidebar.board'),
                  href: `/project/${boardId}/board`,
                  icon: Images.IconBoard,
                },
                {
                  label: t('sidebar.issue'),
                  href: `/project/${boardId}/issues`,
                  icon: Images.IconList,
                },
                {
                  label: t('sidebar.chat'),
                  href: `/project/${boardId}/chat`,
                  icon: Images.IconChat,
                },
              ].map(link => (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => router.push(link.href)}
                  className="flex h-[34px] cursor-pointer items-center gap-2.5 rounded-lg border border-theme-neutral-4 px-3 text-left text-[13px] text-theme-neutral-9 transition-colors hover:border-theme-neutral-6 hover:bg-theme-neutral-2"
                >
                  <Image src={link.icon} alt="" width={14} height={14} />
                  {link.label}
                  <span className="ml-auto opacity-40">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
