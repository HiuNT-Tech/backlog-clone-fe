'use client';

import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { getStatusColorHex } from '@/constant/data';
import type { Card } from '@/config/interface';

const DAY_WIDTH = 22;
const LABEL_WIDTH = 160;
const MAX_TASKS = 20;

const getInitials = (name: string): string => {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('');
};

export interface HomeGanttChartProps {
  /** Card đã có sẵn startDate/dueDate — lấy từ danh sách card gần đây của board */
  cards: Card[];
  totalScheduledCount: number;
}

export function HomeGanttChart({
  cards,
  totalScheduledCount,
}: HomeGanttChartProps) {
  const { t } = useTranslation();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const tasks = useMemo(() => cards.slice(0, MAX_TASKS), [cards]);

  const range = useMemo(() => {
    const today = dayjs().startOf('day');

    if (tasks.length === 0) {
      return { startDay: today, totalDays: 14, todayIndex: 0 };
    }

    const times = tasks.flatMap(card => [
      dayjs(card.startDate).startOf('day').valueOf(),
      dayjs(card.dueDate).startOf('day').valueOf(),
    ]);
    const minTime = Math.min(...times, today.valueOf());
    const maxTime = Math.max(...times, today.valueOf());
    const startDay = dayjs(minTime);
    // +2 ngày đệm cuối cho dễ nhìn thanh cuối cùng
    const totalDays = dayjs(maxTime).diff(startDay, 'day') + 3;
    const todayIndex = today.diff(startDay, 'day');

    return { startDay, totalDays, todayIndex };
  }, [tasks]);

  const { startDay, totalDays, todayIndex } = range;
  const labelEvery = totalDays > 24 ? 3 : totalDays > 14 ? 2 : 1;

  const dayColumns = Array.from({ length: totalDays }, (_, i) => {
    const date = startDay.add(i, 'day');
    const showLabel = i === todayIndex || i % labelEvery === 0;
    return { index: i, date, showLabel };
  });

  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-theme-neutral-7">
          {t('projectHome.gantt.title')}
        </span>
        {totalScheduledCount > tasks.length && (
          <span className="text-[11px] text-theme-neutral-6">
            {t('projectHome.gantt.truncated', {
              shown: tasks.length,
              total: totalScheduledCount,
            })}
          </span>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-xl border border-theme-neutral-4 bg-theme-neutral-1 px-4 py-6 text-center text-sm text-theme-neutral-7">
          {t('projectHome.gantt.empty')}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-theme-neutral-4 bg-theme-neutral-1">
          <div className="overflow-x-auto">
            <div
              className="relative"
              style={{ minWidth: LABEL_WIDTH + totalDays * DAY_WIDTH }}
            >
              {/* header: date labels */}
              <div className="sticky top-0 z-[2] flex border-b border-theme-neutral-4 bg-theme-neutral-2">
                <div
                  className="flex shrink-0 items-center border-r border-theme-neutral-4 px-3.5"
                  style={{ width: LABEL_WIDTH }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-theme-neutral-6">
                    {t('projectHome.gantt.issueColumn')}
                  </span>
                </div>
                <div className="flex flex-1">
                  {dayColumns.map(({ index, date, showLabel }) => (
                    <div
                      key={index}
                      className="flex h-8 shrink-0 items-center justify-center"
                      style={{
                        width: DAY_WIDTH,
                        background:
                          index === todayIndex
                            ? 'var(--color-theme-main-1, rgba(0,0,0,.04))'
                            : undefined,
                        borderRight:
                          index === todayIndex
                            ? '1.5px solid var(--color-theme-main, #16a34a)'
                            : undefined,
                      }}
                    >
                      {showLabel && (
                        <span className="whitespace-nowrap text-[9px] text-theme-neutral-6">
                          {date.format('D/M')}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* rows */}
              {tasks.map((task, idx) => {
                const isHovered = hoveredId === task.id;
                const startOffset = dayjs(task.startDate)
                  .startOf('day')
                  .diff(startDay, 'day');
                const endOffset =
                  dayjs(task.dueDate).startOf('day').diff(startDay, 'day') + 1;
                const barLeft = startOffset * DAY_WIDTH;
                const barWidth = Math.max(
                  (endOffset - startOffset) * DAY_WIDTH,
                  DAY_WIDTH
                );
                const colorHex = getStatusColorHex(task.column?.statusColor);
                const assignee = task.assignee;

                return (
                  <div
                    key={task.id}
                    onMouseEnter={() => setHoveredId(task.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`flex h-8 items-center transition-colors ${
                      idx < tasks.length - 1
                        ? 'border-b border-theme-neutral-3'
                        : ''
                    } ${isHovered ? 'bg-theme-neutral-2' : 'bg-theme-neutral-1'}`}
                  >
                    <div
                      className="flex shrink-0 items-center gap-1.5 overflow-hidden border-r border-theme-neutral-3 px-3.5"
                      style={{ width: LABEL_WIDTH }}
                    >
                      <span className="shrink-0 text-[9.5px] text-theme-neutral-6">
                        {task.cardCode ?? '—'}
                      </span>
                      <span className="truncate text-[11px] text-theme-neutral-9">
                        {task.title}
                      </span>
                    </div>

                    <div className="relative h-full flex-1">
                      {/* today column tint */}
                      <div
                        className="pointer-events-none absolute top-0 bottom-0"
                        style={{
                          left: todayIndex * DAY_WIDTH,
                          width: DAY_WIDTH,
                          background: 'rgba(59,157,183,0.08)',
                        }}
                      />

                      <div
                        title={`${task.cardCode ?? ''} ${task.title ?? ''}`}
                        className="absolute top-1/2 flex items-center overflow-hidden rounded"
                        style={{
                          left: barLeft + 2,
                          width: barWidth - 4,
                          height: 16,
                          transform: 'translateY(-50%)',
                          background: isHovered ? colorHex : `${colorHex}26`,
                          border: `1.5px solid ${colorHex}`,
                          paddingLeft: 5,
                        }}
                      >
                        {barWidth > 50 && (
                          <span
                            className="truncate text-[9.5px] font-medium"
                            style={{ color: isHovered ? '#fff' : colorHex }}
                          >
                            {task.title}
                          </span>
                        )}
                      </div>

                      {assignee && (
                        <div
                          title={assignee.displayName}
                          className="absolute top-1/2 flex h-4 w-4 items-center justify-center rounded-full border-[1.5px] border-theme-neutral-1 bg-theme-main-2 text-[6.5px] font-bold text-theme-main-7"
                          style={{
                            left: barLeft + barWidth - 2,
                            transform: 'translateY(-50%)',
                          }}
                        >
                          {getInitials(assignee.displayName ?? '?')}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* today line overlay */}
              {todayIndex >= 0 && todayIndex < totalDays && (
                <div
                  className="pointer-events-none absolute bottom-0 z-[3] w-px bg-theme-main"
                  style={{
                    top: 32,
                    left: LABEL_WIDTH + todayIndex * DAY_WIDTH + DAY_WIDTH / 2,
                  }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-[3px] bg-theme-main px-1.5 py-px text-[8px] font-bold whitespace-nowrap text-white">
                    {t('projectHome.gantt.today')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomeGanttChart;
