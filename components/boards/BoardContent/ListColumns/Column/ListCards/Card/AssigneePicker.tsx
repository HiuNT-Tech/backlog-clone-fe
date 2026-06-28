'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Popover } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { BoardService } from '@/lib/apis/board';
import { StateMessage } from '@/components/ui/state-message';
import type {
  EntityId,
  UserBoardMember,
  UsersBoardResponse,
} from '@/config/interface';

interface AssigneePickerProps {
  boardId: EntityId;
  assigneeUserId?: EntityId | null;
  assigneeName?: string;
  assigneeAvatar?: string | null;
  disabled?: boolean;
  onPick: (member: UserBoardMember | null) => void;
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return parts
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

function AssigneePicker({
  boardId,
  assigneeUserId,
  assigneeName,
  assigneeAvatar,
  disabled,
  onPick,
}: AssigneePickerProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery<UsersBoardResponse>({
    queryKey: ['users', 'board', boardId, { limit: 100 }],
    queryFn: () => BoardService.getUsersBoard(boardId, { limit: 100 }),
    enabled: open && !!boardId,
    staleTime: 30 * 1000,
  });

  const members = (data?.items ?? []).filter(member => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      member.displayName?.toLowerCase().includes(q) ||
      member.email?.toLowerCase().includes(q)
    );
  });

  const handlePick = (member: UserBoardMember | null) => {
    setOpen(false);
    setSearch('');
    onPick(member);
  };

  const content = (
    <div className="w-60" data-no-dnd onClick={e => e.stopPropagation()}>
      <input
        autoFocus
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder={t('column.assigneePicker.searchPlaceholder')}
        className="mb-2 w-full rounded-md border border-theme-neutral-4 px-2.5 py-1.5 text-sm outline-none focus:border-theme-main"
      />
      <ul className="-mx-1 max-h-60 overflow-y-auto">
        <li>
          <button
            type="button"
            onClick={() => handlePick(null)}
            className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-theme-neutral-3 ${
              assigneeUserId == null ? 'bg-theme-neutral-3' : ''
            }`}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-dashed border-theme-neutral-6 text-theme-neutral-7">
              –
            </span>
            <span className="text-theme-neutral-9">
              {t('column.assigneePicker.unassign')}
            </span>
          </button>
        </li>

        {isLoading && (
          <StateMessage
            as="li"
            i18nKey="common.loading"
            className="px-2 py-2"
          />
        )}

        {!isLoading && members.length === 0 && (
          <StateMessage
            as="li"
            i18nKey="column.assigneePicker.empty"
            className="px-2 py-2"
          />
        )}

        {members.map(member => {
          const selected = Number(member.userId) === Number(assigneeUserId);
          const name = member.displayName || member.email;
          return (
            <li key={String(member.userId)}>
              <button
                type="button"
                onClick={() => handlePick(member)}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-theme-neutral-3 ${
                  selected ? 'bg-theme-neutral-3' : ''
                }`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-theme-neutral-10">
                  {member.avatar ? (
                    <Image
                      src={member.avatar}
                      alt={name}
                      width={28}
                      height={28}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-[11px] font-semibold text-white">
                      {getInitials(name)}
                    </span>
                  )}
                </span>
                <span className="truncate text-theme-neutral-11">{name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <Popover
      open={open}
      onOpenChange={value => !disabled && setOpen(value)}
      trigger="click"
      placement="bottomLeft"
      getPopupContainer={() => document.body}
      content={content}
    >
      <button
        type="button"
        data-no-dnd
        onClick={e => e.stopPropagation()}
        title={
          assigneeName
            ? t('column.assigneePicker.assignedTo', { name: assigneeName })
            : t('column.assigneePicker.assign')
        }
        className="shrink-0 rounded-full outline-none focus:ring-2 focus:ring-theme-main"
      >
        {assigneeUserId != null ? (
          <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-theme-neutral-10">
            {assigneeAvatar ? (
              <Image
                src={assigneeAvatar}
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
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-theme-neutral-6 text-theme-neutral-7 hover:border-theme-main hover:text-theme-main">
            +
          </span>
        )}
      </button>
    </Popover>
  );
}

export default AssigneePicker;
