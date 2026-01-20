'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Images from '@/assets';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const menuItems = [
  {
    titleKey: 'sidebar.home',
    icon: Images.IconHome,
    href: '#1',
  },
  {
    titleKey: 'sidebar.addIssue',
    icon: Images.IconCreate,
    href: '#2',
  },
  {
    titleKey: 'sidebar.issue',
    icon: Images.IconList,
    href: '#3',
  },
  {
    titleKey: 'sidebar.board',
    icon: Images.IconBoard,
    href: '/board',
  },
];

const isPathActive = (href: string, currentPath: string): boolean => {
  if (href.startsWith('#')) {
    return currentPath === href;
  }

  if (href.startsWith('/')) {
    return currentPath === href || currentPath.startsWith(href + '/');
  }

  return currentPath === href;
};

const RowItem = ({
  item,
  isCollapsed,
}: {
  item: {
    titleKey: string;
    icon: string;
    href: string;
  };
  isCollapsed: boolean;
}) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const isActive = isPathActive(item.href, pathname);
  const router = useRouter();

  const handleRedirectLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    router.push(href);
  };

  const getFilterIcon = () => {
    if (isActive) {
      return 'var(--theme-filter-main)';
    }
    return 'brightness(0) invert(1)';
  };

  const getRowItemClassName = () => {
    if (isActive) {
      return 'bg-theme-neutral-1 text-theme-main';
    }
    return 'text-theme-neutral-1 hover:bg-white/20';
  };

  const linkContent = (
    <Link
      key={item.href}
      href={item.href}
      onClick={e => handleRedirectLink(e, item.href)}
      className={cn(
        'flex items-center text-base font-medium rounded-md transition-all duration-200',
        isCollapsed ? 'px-2 py-2 justify-center' : 'px-3 py-2',
        getRowItemClassName()
      )}
    >
      <Image
        src={item.icon}
        alt={item.titleKey}
        className={cn('h-5 w-5 flex-shrink-0', !isCollapsed && 'mr-3')}
        width={20}
        height={20}
        style={{
          filter: getFilterIcon(),
        }}
      />
      {!isCollapsed && (
        <span className="truncate transition-opacity duration-200">
          {t(item.titleKey)}
        </span>
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right" className="ml-2">
          {t(item.titleKey)}
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
};

export function Sidebar(
  { inline = true }: { inline?: boolean } = { inline: true }
) {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          'flex-shrink-0 bg-theme-main border-r border-theme-neutral-5 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-16' : 'w-50',
          inline ? 'hidden md:block' : 'block'
        )}
      >
        {/* Header with title and collapse button */}
        <div
          className={cn(
            'flex items-center justify-end px-4 py-2',
            isCollapsed && 'justify-center'
          )}
        >
          {!isCollapsed && (
            <>
              <Button
                size="sm"
                onClick={toggleCollapse}
                className="-mr-4 py-2 px-1 h-auto hover:bg-theme-hover transition-all duration-200 rounded-l-lg rounded-r-none"
              >
                <Image
                  src={Images.IconArrowCollapseSidebar}
                  alt="Toggle sidebar"
                  width={24}
                  height={24}
                  className={'transition-transform duration-200'}
                />
              </Button>
            </>
          )}
          {isCollapsed && (
            <Button
              size="sm"
              onClick={toggleCollapse}
              className="p-2 h-auto hover:bg-theme-hover transition-all duration-200 border border-theme-neutral-1"
            >
              <Image
                src={Images.IconCollapsedSidebar}
                alt="Toggle sidebar"
                width={16}
                height={16}
                className={'transition-transform duration-200'}
              />
            </Button>
          )}
        </div>

        {/* Main menu section */}
        <div
          className={cn(
            'transition-all duration-200',
            isCollapsed ? 'px-2' : ''
          )}
        >
          {isCollapsed && (
            <div className="flex items-center justify-between mb-4 gap-2">
              <div className="h-[1px] bg-gray-200 w-full"></div>
            </div>
          )}
          <nav className="space-y-2">
            {menuItems.map(item => (
              <RowItem key={item.href} item={item} isCollapsed={isCollapsed} />
            ))}
          </nav>
        </div>
      </div>
    </TooltipProvider>
  );
}
