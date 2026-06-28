'use client';

import { useEffect } from 'react';
import { Tabs } from 'antd';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
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
import { toEntityIdOrUndefined } from '@/lib/entity-id';

export default function SettingsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const currentActiveBoard = useSelector(selectCurrentActiveBoard);

  const boardId =
    toEntityIdOrUndefined(params?.projectId as string) ??
    toEntityIdOrUndefined(params?.id as string) ??
    toEntityIdOrUndefined(searchParams.get('boardId'));

  // Fetch board context if not already loaded
  useEffect(() => {
    if (boardId && !currentActiveBoard) {
      dispatch(fetchBoardDetailsAPI({ boardId }));
    }
  }, [dispatch, boardId, currentActiveBoard]);

  const currentTab = searchParams.get('tab') || 'members';

  const handleTabChange = (key: string) => {
    replaceWithUpdatedSearchParams(router, pathname, searchParams, params => {
      params.set('tab', key);
    });
  };

  if (!boardId) {
    return (
      <div className="min-h-screen w-full bg-theme-neutral-3/40 flex items-center justify-center">
        <p className="text-theme-neutral-8">{t('settings.noBoardSelected')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f6f7f9]">
      <div className="mx-auto w-full max-w-7xl px-8 py-8">
        <div className="mb-6 rounded-2xl border border-theme-neutral-4 bg-white px-8 py-7 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-theme-neutral-7">
                {currentActiveBoard?.title || t('settings.title')}
              </p>
              <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.02em] text-theme-neutral-11">
                {t('settings.title')}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-theme-neutral-8">
                {t('settings.description')}
              </p>
            </div>

            <div className="rounded-xl border border-theme-neutral-4 bg-theme-neutral-2/80 px-5 py-4 lg:max-w-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-theme-neutral-7">
                {t('settings.scopeTitle', 'Workspace scope')}
              </p>
              <p className="mt-2 text-sm leading-6 text-theme-neutral-8">
                {t('settings.scopeDescription')}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-theme-neutral-4 bg-theme-neutral-1 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <Tabs
            activeKey={currentTab}
            onChange={handleTabChange}
            items={[
              {
                key: 'members',
                label: t('settings.tabs.members'),
                children: <MembersTab boardId={boardId} />,
              },
              {
                key: 'issueTypes',
                label: t('settings.tabs.issueTypes'),
                children: <IssueTypesTab boardId={boardId} />,
              },
              {
                key: 'versions',
                label: t('settings.tabs.versions'),
                children: <VersionsTab boardId={boardId} />,
              },
              {
                key: 'statuses',
                label: t('settings.tabs.statuses'),
                children: <StatusesTab boardId={boardId} />,
              },
            ]}
            className="[&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-nav]:border-b [&_.ant-tabs-nav]:border-theme-neutral-4 [&_.ant-tabs-nav]:px-8 [&_.ant-tabs-nav]:pt-3 [&_.ant-tabs-tab]:py-4 [&_.ant-tabs-tab+.ant-tabs-tab]:ml-8 [&_.ant-tabs-tab-btn]:text-sm [&_.ant-tabs-tab-btn]:font-medium [&_.ant-tabs-tab-btn]:text-theme-neutral-8 [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:text-theme-neutral-11 [&_.ant-tabs-ink-bar]:bg-theme-main [&_.ant-tabs-content-holder]:px-8 [&_.ant-tabs-content-holder]:py-6"
          />
        </div>
      </div>
    </div>
  );
}
