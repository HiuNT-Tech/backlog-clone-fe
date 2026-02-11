'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Images from '@/assets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from 'antd';
import { Title } from '@/components/ui/title';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const LANGUAGE_OPTIONS = [
  {
    value: 'vi',
    label: (
      <div className="flex justify-center items-center gap-2">
        <Image
          src={Images.FlagVN}
          alt="flag"
          width={18}
          height={18}
          className="cursor-pointer"
        />
        <span>VI</span>
      </div>
    ),
  },
  {
    value: 'en',
    label: (
      <div className="flex justify-center items-center gap-2">
        <Image
          src={Images.FlagUSA}
          alt="flag"
          width={18}
          height={18}
          className="cursor-pointer"
        />
        <span>EN</span>
      </div>
    ),
  },
];

const SUPPORTED_LANGS = ['vi', 'en'];

export function Header() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const langFromUrl = searchParams.get('lang');
  const currentLang =
    langFromUrl && SUPPORTED_LANGS.includes(langFromUrl)
      ? langFromUrl
      : i18n.language === 'vi'
        ? 'vi'
        : 'en';

  useEffect(() => {
    const langFromUrl = searchParams.get('lang');
    if (
      langFromUrl &&
      SUPPORTED_LANGS.includes(langFromUrl) &&
      i18n.language !== langFromUrl
    ) {
      i18n.changeLanguage(langFromUrl);
    }
  }, [searchParams, i18n]);

  const handleChangeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', lng);

    router.push(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="bg-theme-header flex justify-between overflow-auto sticky top-0 z-10">
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
      <div className="flex gap-5 items-center p-3">
        <Input
          placeholder={t('appBar.placeholder.search')}
          prefixIcon={Images.gray.Search}
        />
        <button>
          <Image src={Images.Alert} alt="logo" className="cursor-pointer" />
        </button>
        <div>
          <Select
            className="cursor-pointer z-50 w-23"
            options={LANGUAGE_OPTIONS}
            value={currentLang}
            onChange={value => handleChangeLanguage(value)}
            allowClear
          />
        </div>
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
