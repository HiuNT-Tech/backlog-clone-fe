import React from 'react';
import { t, type TFunction } from 'i18next';

import { BoardInvitationStatus, PRIORITY, StatusColor } from '@/config/enum';
import type { BoardMemberRole } from '@/config/interface';
import { cn } from '@/lib/utils';

type MemberRoleStatusConfig = {
  labelKey: string;
  badgeClassName: string;
};

export const MEMBER_ROLE_STATUS_DATA = {
  MEMBER: {
    labelKey: 'settings.members.roleOptions.member',
    badgeClassName: 'bg-gray-100 text-gray-700',
  },
  ADMIN: {
    labelKey: 'settings.members.roleOptions.administrator',
    badgeClassName: 'bg-red-100 text-red-600',
  },
  PM: {
    labelKey: 'settings.members.roleOptions.projectManager',
    badgeClassName: 'bg-blue-100 text-blue-600',
  },
  GUEST: {
    labelKey: 'settings.members.roleOptions.guest',
    badgeClassName: 'bg-yellow-100 text-yellow-700',
  },
} satisfies Record<BoardMemberRole, MemberRoleStatusConfig>;

export const getMemberRoleStatusConfig = (
  role: BoardMemberRole | string | null | undefined
): MemberRoleStatusConfig | null => {
  const normalizedRole = role?.toUpperCase() as BoardMemberRole | undefined;
  return normalizedRole ? MEMBER_ROLE_STATUS_DATA[normalizedRole] : null;
};

export const renderMemberRoleBadge = (
  role: BoardMemberRole | string | null | undefined,
  t: TFunction,
  additionalText?: string
): React.ReactNode => {
  const config = getMemberRoleStatusConfig(role);
  if (!config) return null;

  return React.createElement(
    'span',
    {
      className: cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
        config.badgeClassName
      ),
    },
    `${t(config.labelKey)} ${additionalText || ''}`.trim()
  );
};

type InvitationStatusConfig = {
  labelKey: string;
  badgeClassName: string;
};

export const INVITATION_STATUS_DATA = {
  [BoardInvitationStatus.PENDING]: {
    labelKey: 'settings.invitations.status.pending',
    badgeClassName: 'border-theme-main-2 bg-theme-main-1 text-theme-main-6',
  },
  [BoardInvitationStatus.ACCEPTED]: {
    labelKey: 'settings.invitations.status.accepted',
    badgeClassName: 'border-theme-main-3 bg-theme-main-1 text-theme-main-7',
  },
  [BoardInvitationStatus.DECLINED]: {
    labelKey: 'settings.invitations.status.declined',
    badgeClassName:
      'border-theme-neutral-5 bg-theme-neutral-3 text-theme-neutral-8',
  },
  [BoardInvitationStatus.REVOKED]: {
    labelKey: 'settings.invitations.status.revoked',
    badgeClassName:
      'border-theme-neutral-5 bg-theme-neutral-3 text-theme-neutral-8',
  },
  [BoardInvitationStatus.EXPIRED]: {
    labelKey: 'settings.invitations.status.expired',
    badgeClassName:
      'border-theme-neutral-5 bg-theme-neutral-2 text-theme-neutral-7',
  },
} satisfies Record<BoardInvitationStatus, InvitationStatusConfig>;

export const getInvitationStatusConfig = (
  status: BoardInvitationStatus | string | null | undefined
): InvitationStatusConfig | null => {
  const normalizedStatus = status?.toUpperCase() as
    | BoardInvitationStatus
    | undefined;
  return normalizedStatus ? INVITATION_STATUS_DATA[normalizedStatus] : null;
};

export const getInvitationStatusLabelKey = (
  status: BoardInvitationStatus | string | null | undefined
): string => {
  return (
    getInvitationStatusConfig(status)?.labelKey ??
    'settings.invitations.status.unknown'
  );
};

export const renderInvitationStatusBadge = (
  status: BoardInvitationStatus | string | null | undefined,
  t: TFunction
): React.ReactNode => {
  const config = getInvitationStatusConfig(status);

  return React.createElement(
    'span',
    {
      className: cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold',
        config?.badgeClassName ??
          'border-theme-neutral-5 bg-theme-neutral-2 text-theme-neutral-8'
      ),
    },
    t(config?.labelKey ?? 'settings.invitations.status.unknown')
  );
};

// Issue Types - Color status options & renderer

export const COLOR_STATUS_OPTIONS = [
  { key: 'red', className: 'bg-[#E52E00] text-[#ffffff] border-[#E52E00]' },
  { key: 'orange', className: 'bg-[#E68A40] text-[#ffffff] border-[#E68A40]' },
  { key: 'pink', className: 'bg-[#DB7F9B] text-[#ffffff] border-[#DB7F9B]' },
  { key: 'indigo', className: 'bg-[#868DB8] text-[#ffffff] border-[#868DB8]' },
  { key: 'blue', className: 'bg-[#3B9DB7] text-[#ffffff] border-[#3B9DB7]' },
  { key: 'teal', className: 'bg-[#45AC94] text-[#ffffff] border-[#45AC94]' },
  { key: 'green', className: 'bg-[#90A631] text-[#ffffff] border-[#90A631]' },
  { key: 'yellow', className: 'bg-[#D8921B] text-[#ffffff] border-[#D8921B]' },
  {
    key: 'bright-red',
    className: 'bg-[#F2245F] text-[#ffffff] border-[#F2245F]',
  },
  { key: 'black', className: 'bg-[#333333] text-[#ffffff] border-[#333333]' },
] as const;

export type ColorStatusKey = (typeof COLOR_STATUS_OPTIONS)[number]['key'];

/** Map key chọn màu (UI) sang giá trị statusColor gửi API (StatusColor) */
export const COLOR_KEY_TO_STATUS: Record<ColorStatusKey, StatusColor> = {
  red: StatusColor.RED,
  orange: StatusColor.ORANGE,
  pink: StatusColor.PINK,
  indigo: StatusColor.INDIGO,
  blue: StatusColor.BLUE,
  teal: StatusColor.TEAL,
  green: StatusColor.GREEN,
  yellow: StatusColor.YELLOW,
  'bright-red': StatusColor.BRIGHT_RED,
  black: StatusColor.BLACK,
};

/** Map statusColor (API) về key màu (UI) để hiển thị badge */
export const STATUS_TO_COLOR_KEY: Record<StatusColor, ColorStatusKey> = {
  [StatusColor.RED]: 'red',
  [StatusColor.ORANGE]: 'orange',
  [StatusColor.PINK]: 'pink',
  [StatusColor.INDIGO]: 'indigo',
  [StatusColor.BLUE]: 'blue',
  [StatusColor.TEAL]: 'teal',
  [StatusColor.GREEN]: 'green',
  [StatusColor.YELLOW]: 'yellow',
  [StatusColor.BRIGHT_RED]: 'bright-red',
  [StatusColor.BLACK]: 'black',
};

/** Trả về cấu hình badge (màu sắc) cho issue type */
export const renderIssueTypeBadge = (
  statusColor?: string | null,
  name?: string
): React.ReactNode => {
  return React.createElement(
    'span',
    {
      className: cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
        getIssueTypeBadgeClassName(statusColor)
      ),
    },
    name
  );
};

/** Trả về className badge theo statusColor (số từ API); mặc định blue nếu không khớp */
export const getIssueTypeBadgeClassName = (
  statusColor?: string | null
): string => {
  // Support legacy db records
  const legacyMap: Record<string, string> = {
    GRAY: 'bg-theme-neutral-5 text-theme-neutral-10 border-theme-neutral-5', // actual gray
    PURPLE: 'bg-[#9b59b6] text-white border-[#9b59b6]',
  };

  if (statusColor && legacyMap[statusColor]) {
    return cn(
      legacyMap[statusColor],
      'min-w-[100px] justify-center text-center'
    );
  }

  const key =
    statusColor != null
      ? ((STATUS_TO_COLOR_KEY as Record<string, ColorStatusKey>)[statusColor] ??
        'blue')
      : 'blue';
  const option = COLOR_STATUS_OPTIONS.find(o => o.key === key);
  const baseClassName =
    option?.className ?? 'bg-[#3B9DB7] text-[#ffffff] border-[#3B9DB7]';
  return cn(baseClassName, 'min-w-[100px] justify-center text-center');
};

export const renderStatusBadge = (
  selectedKey: ColorStatusKey | string,
  setSelectedColorKey: (key: ColorStatusKey) => void,
  t: TFunction,
  name?: string
): React.ReactNode =>
  COLOR_STATUS_OPTIONS.map(option =>
    React.createElement(
      'button',
      {
        key: option.key,
        type: 'button',
        onClick: () => setSelectedColorKey(option.key),
        className: cn(
          'flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
          option.className,
          selectedKey === option.key && 'ring-2 ring-theme-main ring-offset-1'
        ),
      },
      name
    )
  );

export const PRIORITY_OPTIONS = [
  {
    value: String(PRIORITY.LOW),
    label: t('issues.priority.low'),
  },
  {
    value: String(PRIORITY.NORMAL),
    label: t('issues.priority.normal'),
  },
  {
    value: String(PRIORITY.HIGH),
    label: t('issues.priority.high'),
  },
];
