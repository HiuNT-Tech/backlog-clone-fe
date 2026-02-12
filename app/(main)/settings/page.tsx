'use client';

import { useEffect } from 'react';
import { Tabs } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { replaceWithUpdatedSearchParams } from '@/lib/url';
import { MembersTab } from './MembersTab';
import { IssueTypesTab } from './IssueTypesTab';
import { VersionsTab } from './VersionTab';
import {
  fetchBoardDetailsAPI,
  selectCurrentActiveBoard,
} from '@/redux/activeBoard/activeBoardSlice';
import type { AppDispatch } from '@/redux/store';
import { StatusesTab } from './StatusesTab';

// Cùng boardId mặc định như trang /board — sau có thể lấy từ URL/project
const DEFAULT_BOARD_ID = '6957793c6042bc901f2a1c46';

export default function SettingsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const currentActiveBoard = useSelector(selectCurrentActiveBoard);

  // Vào Settings mà chưa có board context (vd. vào thẳng /settings) → fetch board để IssueTypesTable etc. có currentActiveBoard
  useEffect(() => {
    if (!currentActiveBoard) {
      dispatch(fetchBoardDetailsAPI(DEFAULT_BOARD_ID));
    }
  }, [dispatch, currentActiveBoard]);

  const currentTab = searchParams.get('tab') || 'members';

  const handleTabChange = (key: string) => {
    replaceWithUpdatedSearchParams(router, pathname, searchParams, params => {
      params.set('tab', key);
    });
  };

  return (
    <div className="min-h-screen w-full bg-theme-neutral-3/40">
      <div className="mx-auto w-full max-w-6xl px-6 py-6">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-theme-neutral-11">
            {t('settings.title')}
          </h1>
          <p className="mt-1 text-sm text-theme-neutral-8">
            {t('settings.description')}
          </p>
        </div>

        <div className="rounded-xl border border-theme-neutral-5 bg-theme-neutral-1 p-5 shadow-sm">
          <Tabs
            activeKey={currentTab}
            onChange={handleTabChange}
            items={[
              {
                key: 'members',
                label: t('settings.tabs.members'),
                children: <MembersTab />,
              },
              {
                key: 'issueTypes',
                label: t('settings.tabs.issueTypes'),
                children: <IssueTypesTab />,
              },
              {
                key: 'versions',
                label: t('settings.tabs.versions'),
                children: <VersionsTab />,
              },
              {
                key: 'statuses',
                label: t('settings.tabs.statuses'),
                children: <StatusesTab />,
              },
            ]}
            className="[&_.ant-tabs-tab-btn]:font-medium [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:text-theme-main [&_.ant-tabs-ink-bar]:bg-theme-main"
          />
        </div>
      </div>
    </div>
  );
}
