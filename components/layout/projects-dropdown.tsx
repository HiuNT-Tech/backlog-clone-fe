'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Dropdown, type MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';

import Icons from '@/assets/icons';
import { Title } from '@/components/ui/title';
import { BoardService } from '@/lib/apis/board';

export function ProjectsDropdown() {
  const { t } = useTranslation();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Dùng chung queryKey với Dashboard để không gọi lại API khi đã có cache;
  // chỉ fetch khi người dùng mở dropdown.
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-boards'],
    queryFn: () => BoardService.getBoard(),
    enabled: open,
  });

  const boards = data?.items ?? [];

  const items: MenuProps['items'] = [
    {
      key: 'projects',
      type: 'group',
      label: (
        <span className="text-xs font-semibold uppercase tracking-wider text-theme-neutral-8">
          {t('appBar.title.project')}
        </span>
      ),
      children: isLoading
        ? [{ key: 'loading', label: t('common.loading'), disabled: true }]
        : boards.length === 0
          ? [
              {
                key: 'empty',
                label: t('appBar.projects.empty'),
                disabled: true,
              },
            ]
          : boards.map(board => ({
              key: String(board.id),
              label: (
                <div className="flex items-center gap-3 py-1">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-theme-main-1 text-theme-main-5">
                    <Image
                      src={Icons.LayoutDashboard}
                      alt=""
                      width={16}
                      height={16}
                      className="h-4 w-4"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-theme-neutral-11">
                      {board.title}
                    </span>
                    <span className="block text-xs text-theme-neutral-7">
                      ({board.boardCode})
                    </span>
                  </span>
                </div>
              ),
            })),
    },
  ];

  const handleClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'loading' || key === 'empty') return;
    setOpen(false);
    router.push(`/project/${key}/issues`);
  };

  return (
    <Dropdown
      menu={{
        items,
        onClick: handleClick,
        // Danh sách project có thể dài — giới hạn chiều cao để không tràn màn hình.
        style: { maxHeight: '70vh', overflowY: 'auto', minWidth: 260 },
      }}
      trigger={['click']}
      placement="bottomLeft"
      open={open}
      onOpenChange={setOpen}
    >
      <button type="button" className="cursor-pointer">
        <Title>{t('appBar.title.project')}</Title>
      </button>
    </Dropdown>
  );
}

export default ProjectsDropdown;
