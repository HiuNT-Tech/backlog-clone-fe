'use client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Images from '@/assets'
import { useTranslation } from "react-i18next";
import { Title } from '@/components/ui/title'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export function Header() {
  const { t } = useTranslation();
  return (
    <div className="bg-theme-main flex justify-between overflow-auto sticky top-0 z-50">
      <div className="flex gap-3 items-center p-3">
        <Button
          className='px-2'
        >
          <Image
            src={Images.IconDashboard}
            alt="logo"
            width={24}
            height={24}
          />
        </Button>
        <Title>{t('appBar.title.dashboard')}</Title>
        <Title>{t('appBar.title.project')}</Title>
        <Button>
          <Image
            src={Images.IconAdd}
            alt="logo"
            width={24}
            height={24}
          />
        </Button>
      </div>
      <div className="flex gap-2 items-center p-3">
        <Input
          placeholder={t('appBar.placeholder.search')}
          prefixIcon={Images.gray.Search}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="xs">
              <Image
                src={Images.Alert}
                alt="logo"
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('tooltip.notification')}</p>
          </TooltipContent>
        </Tooltip>
        <Button size="icon" className='rounded-full bg-theme-neutral-1 hover:bg-theme-neutral-2'>
          <Image
            src={Images.defaultAvatar}
            alt="avatar"
            width={20}
            height={20}
          />
        </Button>
      </div>
    </div >
  )
}
