'use client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Images from '@/assets';
import { useTranslation } from 'react-i18next';
import { Title } from '@/components/ui/title';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function Header() {
  const { t } = useTranslation();
  return (
    <div className="bg-theme-header flex justify-between overflow-auto sticky top-0 z-50">
      <div className="flex gap-3 items-center p-3">
        <button className="px-2">
          <Image src={Images.IconDashboard} alt="logo" width={24} height={24} />
        </button>
        <Title>{t('appBar.title.dashboard')}</Title>
        <Title>{t('appBar.title.project')}</Title>
        <button>
          <Image src={Images.IconAdd} alt="logo" width={24} height={24} />
        </button>
      </div>
      <div className="flex gap-2 items-center p-3">
        <Input
          placeholder={t('appBar.placeholder.search')}
          prefixIcon={Images.gray.Search}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <button>
              <Image src={Images.Alert} alt="logo" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('tooltip.notification')}</p>
          </TooltipContent>
        </Tooltip>
        <Button className="w-10 h-10 p-0 rounded-full bg-theme-neutral-1 hover:bg-theme-neutral-2 border border-theme-neutral-5">
          <Image
            src={Images.defaultAvatar}
            alt="avatar"
            width={24}
            height={24}
          />
        </Button>
      </div>
    </div>
  );
}
