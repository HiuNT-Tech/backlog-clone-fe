'use client';

import { Tabs } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { replaceWithUpdatedSearchParams } from '@/lib/url';
import { ProfileTab } from './ProfileTab';
import { PasswordTab } from './PasswordTab';

/**
 * Cài đặt cá nhân — vào từ menu avatar ở header (`/settings`).
 * Khác với `project/[projectId]/settings` là cài đặt của board.
 */
export default function PersonalSettingsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get('tab') || 'profile';

  // Giữ tab trong URL để reload/chia sẻ link vẫn về đúng tab, giống cài đặt board.
  const handleTabChange = (key: string) => {
    replaceWithUpdatedSearchParams(router, pathname, searchParams, params => {
      params.set('tab', key);
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#f6f7f9]">
      <div className="mx-auto w-full max-w-4xl px-8 py-8">
        <div className="mb-6 rounded-2xl border border-theme-neutral-4 bg-white px-8 py-7 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-theme-neutral-7">
            {t('personalSettings.eyebrow')}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-theme-neutral-11">
            {t('personalSettings.title')}
          </h1>
          <p className="mt-1 text-sm text-theme-neutral-8">
            {t('personalSettings.description')}
          </p>
        </div>

        <div className="rounded-2xl border border-theme-neutral-4 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <Tabs
            activeKey={currentTab}
            onChange={handleTabChange}
            items={[
              {
                key: 'profile',
                label: t('personalSettings.tabs.profile'),
                children: <ProfileTab />,
              },
              {
                key: 'password',
                label: t('personalSettings.tabs.password'),
                children: <PasswordTab />,
              },
            ]}
            className="[&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-nav]:border-b [&_.ant-tabs-nav]:border-theme-neutral-4 [&_.ant-tabs-nav]:px-8 [&_.ant-tabs-nav]:pt-3 [&_.ant-tabs-tab]:py-4 [&_.ant-tabs-tab+.ant-tabs-tab]:ml-8 [&_.ant-tabs-tab-btn]:text-sm [&_.ant-tabs-tab-btn]:font-medium [&_.ant-tabs-tab-btn]:text-theme-neutral-8 [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:text-theme-neutral-11 [&_.ant-tabs-ink-bar]:bg-theme-main [&_.ant-tabs-content-holder]:px-8 [&_.ant-tabs-content-holder]:py-6"
          />
        </div>
      </div>
    </div>
  );
}
