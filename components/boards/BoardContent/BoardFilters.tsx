'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Select, type SelectOption } from '@/components/ui/select';
import { renderIssueTypeBadge } from '@/constant/data';
import { useIssueType } from '@/hooks/use-issue-type';
import { useUserBoard } from '@/hooks/use-user-board';
import { selectCurrentUser } from '@/redux/user/userSlice';
import type { EntityId, UserBoardMember } from '@/config/interface';

export interface BoardFilterValue {
  issueTypeId: string;
  assigneeUserId: string;
}

interface BoardFiltersProps {
  boardId: EntityId;
  value: BoardFilterValue;
  totalCards: number;
  visibleCards: number;
  onChange: (value: BoardFilterValue) => void;
}

const LIST_PARAMS = { skip: 0, limit: 100 };

const getDisplayName = (user: UserBoardMember): string => {
  return user.displayName || user.username || user.email || String(user.userId);
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';

  return parts
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

const renderAssigneeOption = (user: UserBoardMember) => {
  const displayName = getDisplayName(user);

  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-theme-neutral-10 text-[10px] font-semibold text-white">
        {getInitials(displayName)}
      </span>
      <span className="truncate">{displayName}</span>
    </div>
  );
};

function BoardFilters({
  boardId,
  value,
  totalCards,
  visibleCards,
  onChange,
}: BoardFiltersProps) {
  const { t } = useTranslation();
  const currentUser = useSelector(selectCurrentUser);
  const { issueTypes, isLoading: isIssueTypesLoading } = useIssueType(
    boardId,
    LIST_PARAMS
  );
  const { listUser, isLoading: isUsersLoading } = useUserBoard(
    boardId,
    LIST_PARAMS
  );

  const issueTypeOptions = useMemo<SelectOption[]>(
    () =>
      issueTypes.map(issueType => ({
        value: issueType.id.toString(),
        label: renderIssueTypeBadge(issueType.statusColor, issueType.name),
      })),
    [issueTypes]
  );

  const assigneeOptions = useMemo<SelectOption[]>(
    () =>
      listUser.items.map(user => ({
        value: user.userId.toString(),
        label: renderAssigneeOption(user),
      })),
    [listUser.items]
  );

  const hasActiveFilter = Boolean(value.issueTypeId || value.assigneeUserId);

  const currentUserId = currentUser ? String(currentUser.id) : '';
  const isAssignedToMe =
    Boolean(currentUserId) && value.assigneeUserId === currentUserId;

  const handleReset = () => {
    onChange({
      issueTypeId: '',
      assigneeUserId: '',
    });
  };

  const handleToggleAssignedToMe = () => {
    if (!currentUserId) return;
    onChange({
      ...value,
      assigneeUserId: isAssignedToMe ? '' : currentUserId,
    });
  };

  return (
    <div className="flex flex-col gap-3 px-4 pb-3 md:flex-row md:items-end md:justify-between">
      <div className="grid w-full gap-3 sm:grid-cols-2 lg:flex lg:w-auto">
        <div className="w-full lg:w-[260px]">
          <Select
            label={t('issues.filters.issueType')}
            placeholder={t('issues.filters.issueTypePlaceholder')}
            options={issueTypeOptions}
            value={value.issueTypeId}
            disabled={isIssueTypesLoading}
            showSearch
            onValueChange={issueTypeId =>
              onChange({
                ...value,
                issueTypeId,
              })
            }
          />
        </div>

        <div className="w-full lg:w-[260px]">
          <Select
            label={t('issues.filters.assignee')}
            placeholder={t('issues.filters.assigneePlaceholder')}
            options={assigneeOptions}
            value={value.assigneeUserId}
            disabled={isUsersLoading}
            showSearch
            onValueChange={assigneeUserId =>
              onChange({
                ...value,
                assigneeUserId,
              })
            }
          />
        </div>

        {currentUser && (
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleToggleAssignedToMe}
              aria-pressed={isAssignedToMe}
              title={t('issues.filters.assignedToMe')}
              aria-label={t('issues.filters.assignedToMe')}
              className={`flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border transition-colors ${
                isAssignedToMe
                  ? 'border-theme-main bg-theme-main-1 text-theme-main'
                  : 'border-theme-neutral-5 bg-theme-neutral-1 text-theme-neutral-8 hover:border-theme-main hover:bg-theme-main-1'
              }`}
            >
              {currentUser.avatar ? (
                <Image
                  src={currentUser.avatar}
                  alt={t('issues.filters.assignedToMe')}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs font-semibold">
                  {getInitials(currentUser.displayName || currentUser.email)}
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BoardFilters;
