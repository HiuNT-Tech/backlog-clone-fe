import React from 'react';
import type { TFunction } from 'i18next';

import { MemberRole } from '@/config/enum';
import { cn } from '@/lib/utils';

export const MEMBER_ROLE_STATUS_DATA = {
  [MemberRole.MEMBER]: {
    labelKey: 'settings.members.roleOptions.member',
    badgeClassName: 'bg-gray-100 text-gray-700',
  },
  [MemberRole.ADMINISTRATOR]: {
    labelKey: 'settings.members.roleOptions.administrator',
    badgeClassName: 'bg-red-100 text-red-600',
  },
  [MemberRole.PROJECT_MANAGER]: {
    labelKey: 'settings.members.roleOptions.projectManager',
    badgeClassName: 'bg-blue-100 text-blue-600',
  },
} as const;

type MemberRoleStatusConfig = {
  labelKey: string;
  badgeClassName: string;
};

export const getMemberRoleStatusConfig = (
  role: MemberRole | string | number
): MemberRoleStatusConfig => {
  const numericRole = Number(role) as MemberRole;
  return (
    MEMBER_ROLE_STATUS_DATA[numericRole] || {
      labelKey: '',
      badgeClassName: '',
    }
  );
};

export const renderMemberRoleBadge = (
  role: MemberRole | string | number,
  t: TFunction,
  additionalText?: string
): React.ReactNode => {
  const config = getMemberRoleStatusConfig(role);
  if (!config.labelKey) return null;

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

// Issue Types - Color status options & renderer

export const COLOR_STATUS_OPTIONS = [
  // Đỏ cam
  {
    key: 'red',
    className: 'bg-[#E52E00] text-[#ffffff] border-[#E52E00]',
  },
  // Cam
  {
    key: 'orange',
    className: 'bg-[#E68A40] text-[#ffffff] border-[#E68A40]',
  },
  // Hồng nhạt
  {
    key: 'pink',
    className: 'bg-[#DB7F9B] text-[#ffffff] border-[#DB7F9B]',
  },
  // Tím/indigo
  {
    key: 'indigo',
    className: 'bg-[#868DB8] text-[#ffffff] border-[#868DB8]',
  },
  // Xanh dương
  {
    key: 'blue',
    className: 'bg-[#3B9DB7] text-[#ffffff] border-[#3B9DB7]',
  },
  // Xanh ngọc
  {
    key: 'teal',
    className: 'bg-[#45AC94] text-[#ffffff] border-[#45AC94]',
  },
  // Xanh lá
  {
    key: 'green',
    className: 'bg-[#90A631] text-[#ffffff] border-[#90A631]',
  },
  // Vàng
  {
    key: 'yellow',
    className: 'bg-[#D8921B] text-[#ffffff] border-[#D8921B]',
  },
  // Đỏ tươi (Hồng cánh sen)
  {
    key: 'bright-red',
    className: 'bg-[#F2245F] text-[#ffffff] border-[#F2245F]',
  },
  // Đen
  {
    key: 'black',
    className: 'bg-[#333333] text-[#ffffff] border-[#333333]',
  },
] as const;

export type ColorStatusKey = (typeof COLOR_STATUS_OPTIONS)[number]['key'];

export const renderStatusBadge = (
  selectedKey: ColorStatusKey | string,
  setSelectedColorKey: (key: ColorStatusKey) => void,
  t: TFunction
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
      t('settings.issueTypes.add.colorSample')
    )
  );
