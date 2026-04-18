'use client';

import { useTranslation } from 'react-i18next';
import { SearchSection } from '@/components/search/SearchSection';
import type { SearchField } from '@/types/search-section';

const StatusesFilter = ({
  onSearch,
}: {
  onSearch: (params: Record<string, any>) => void;
}) => {
  const { t } = useTranslation();

  const searchFields: SearchField[] = [
    {
      id: 'search',
      type: 'text',
      props: {
        placeholder: t('common.searchPlaceholder'),
      },
    },
  ];

  const handleSearch = (values: Record<string, any>) => {
    const { search, ...rest } = values;

    const params: Record<string, any> = { ...rest };

    if (search) {
      params.keyword = String(search).trim();
    }
    onSearch(params);
  };

  const handleReset = () => {
    onSearch({});
  };

  return (
    <div className="mt-0">
      <SearchSection
        itemsPerRow={1}
        noExpand
        title={t('common.search')}
        fields={searchFields}
        onSearch={handleSearch}
        onReset={handleReset}
      />
    </div>
  );
};

export default StatusesFilter;
