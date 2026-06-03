'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { MembersTable } from '@/components/shared/tables/MembersTable';
import MembersFilter from '@/components/shared/filters/MembersFilter';
import { EntityId, UsersBoardParams } from '@/config/interface';
import { usePagination } from '@/hooks/use-pagination';
import { useUserBoard } from '@/hooks/use-user-board';

export const MembersTab: React.FC<{ boardId: EntityId }> = ({ boardId }) => {
  const { t } = useTranslation();
  const { page, limit, setPage, setLimit, apiParams } = usePagination();
  const [searchParamsState, setSearchParamsState] =
    useState<UsersBoardParams>();

  const staffParams: UsersBoardParams = {
    ...apiParams,
    ...searchParamsState,
  };

  const { listUser, isLoading, listError, refetchList } = useUserBoard(
    boardId,
    staffParams
  );

  const handleSearch = (params: UsersBoardParams) => {
    setSearchParamsState(params);
    setPage(1);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 border-b border-theme-neutral-4 pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-theme-neutral-11">
            {t('settings.members.heading')}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-theme-neutral-8">
            {t('settings.members.hint')}
          </p>
        </div>
        <Button className="h-10 rounded-md bg-theme-main px-4 text-theme-neutral-1 shadow-sm hover:bg-theme-hover">
          {t('settings.members.actions.invite')}
        </Button>
      </div>

      <MembersFilter onSearch={handleSearch} />

      {listUser ? (
        <MembersTable
          boardId={boardId}
          listUser={listUser}
          isListLoading={isLoading}
          listError={listError}
          refetchList={refetchList}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onPageSizeChange={setLimit}
        />
      ) : null}
    </div>
  );
};
