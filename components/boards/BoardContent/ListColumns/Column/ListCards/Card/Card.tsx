'use client';

import { memo, type ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import type { Card as CardType } from '@/config/interface';
import dayjs from 'dayjs';
import { renderIssueTypeBadge } from '@/constant/data';
import Images from '@/assets';
import { useCardQuickUpdate } from '@/hooks/use-card-quick-update';
import AssigneePicker from './AssigneePicker';
import DueDatePicker from './DueDatePicker';

interface CardProps {
  card: CardType;
}

interface CardInnerProps {
  card: CardType;
  assigneeControl: ReactNode;
  dueDateControl: ReactNode;
}

const isOverdue = (dateStr: string): boolean =>
  dayjs(dateStr).endOf('day').isBefore(dayjs());

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return parts
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

const CARD_CLASS =
  'rounded-lg border border-transparent bg-theme-neutral-1 px-3 py-2.5 shadow-sm transition-colors hover:border-theme-main flex flex-col gap-1.5 h-32 shrink-0 w-full min-w-[256px] overflow-hidden';

const CardInner = memo(function CardInner({
  card,
  assigneeControl,
  dueDateControl,
}: CardInnerProps) {
  const countComment = card.countComment ?? 0;

  return (
    <>
      {/* Row 1: IssueType badge + CardCode + menu */}
      <div className="flex items-center gap-2">
        {card.issueType && (
          <span className="shrink-0 [&>span]:!px-2 [&>span]:!py-0.5 [&>span]:!min-w-0 [&>span]:!text-[10px]">
            {renderIssueTypeBadge(
              card.issueType.statusColor,
              card.issueType.name
            )}
          </span>
        )}
        {card.cardCode && (
          <span className="text-xs font-medium text-theme-neutral-7 truncate">
            {card.cardCode}
          </span>
        )}
      </div>

      {/* Row 2: Title */}
      <div className="line-clamp-2 text-sm font-medium leading-snug text-theme-neutral-11">
        {card.title}
      </div>

      {/* Row 3: Assignee + CommentCount + DueDate (pinned to bottom) */}
      <div className="mt-auto flex items-center justify-between gap-2 border-t border-theme-neutral-3 pt-2">
        {assigneeControl}

        <div className="flex items-center gap-2">
          {countComment > 0 && (
            <span
              className="flex items-center gap-1 text-xs font-semibold text-theme-neutral-7"
              title={`${countComment} bình luận`}
            >
              <Image
                src={Images.IconChat}
                alt="comments"
                width={16}
                height={16}
              />
              {countComment}
            </span>
          )}

          {dueDateControl}
        </div>
      </div>
    </>
  );
});

const StaticAssignee = memo(function StaticAssignee({
  card,
}: {
  card: CardType;
}) {
  const assigneeName = card.assignee?.displayName || card.assignee?.email;

  if (card.assigneeUserId == null) {
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-dashed border-theme-neutral-6 text-theme-neutral-7">
        +
      </span>
    );
  }

  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-theme-neutral-10">
      {card.assignee?.avatar ? (
        <Image
          src={card.assignee.avatar}
          alt={assigneeName || ''}
          width={28}
          height={28}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-[11px] font-semibold text-white">
          {getInitials(assigneeName || '?')}
        </span>
      )}
    </span>
  );
});

const StaticDueDate = memo(function StaticDueDate({
  value,
  overdue,
}: {
  value?: string | null;
  overdue: boolean;
}) {
  return (
    <span
      className={`flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold ${
        value
          ? overdue
            ? 'bg-red-100 text-red-600'
            : 'bg-theme-neutral-3 text-theme-neutral-8'
          : 'text-theme-neutral-6 opacity-60'
      }`}
    >
      <Image src={Images.IconCalendar} alt="calendar" width={14} height={14} />
      {value && dayjs(value).format('DD/MM')}
    </span>
  );
});

const InteractiveCardInner = memo(function InteractiveCardInner({
  card,
}: CardProps) {
  const overdue = card.dueDate ? isOverdue(card.dueDate) : false;
  const { assign, setDueDate, isUpdating } = useCardQuickUpdate(card);

  return (
    <CardInner
      card={card}
      assigneeControl={
        <AssigneePicker
          boardId={card.boardId}
          assigneeUserId={card.assigneeUserId}
          assigneeName={card.assignee?.displayName || card.assignee?.email}
          assigneeAvatar={card.assignee?.avatar}
          disabled={isUpdating}
          onPick={assign}
        />
      }
      dueDateControl={
        <DueDatePicker
          value={card.dueDate}
          overdue={overdue}
          disabled={isUpdating}
          onChange={setDueDate}
        />
      }
    />
  );
});

export const CardPreview = memo(function CardPreview({ card }: CardProps) {
  const overdue = card.dueDate ? isOverdue(card.dueDate) : false;

  return (
    <div className={`${CARD_CLASS} pointer-events-none`}>
      <CardInner
        card={card}
        assigneeControl={<StaticAssignee card={card} />}
        dueDateControl={
          <StaticDueDate value={card.dueDate} overdue={overdue} />
        }
      />
    </div>
  );
});

function Card({ card }: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: card,
  });

  const dndKitCardStyles: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #2ecc71' : undefined,
    willChange: 'transform',
  };

  return (
    <div
      ref={setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...listeners}
      className={`${CARD_CLASS} cursor-pointer`}
    >
      <InteractiveCardInner card={card} />
    </div>
  );
}

export default memo(Card);
