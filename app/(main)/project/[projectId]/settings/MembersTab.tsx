'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MailPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { MembersTable } from '@/components/shared/tables/MembersTable';
import MembersFilter from '@/components/shared/filters/MembersFilter';
import InvitationCreateDialog from '@/components/shared/forms/InvitationCreateDialog';
import InvitationsFilter from '@/components/shared/filters/InvitationsFilter';
import { InvitationsTable } from '@/components/shared/tables/InvitationsTable';
import StaticMethodConfirm from '@/components/modal/static-method-confirm';
import {
  BoardInvitation,
  EntityId,
  InvitationListParams,
  UsersBoardParams,
} from '@/config/interface';
import { usePagination } from '@/hooks/use-pagination';
import { useUserBoard } from '@/hooks/use-user-board';
import { useBoardInvitations } from '@/hooks/use-invitation';
import type { InvitationFormData } from '@/validation/invitation-form-schemas';

export const MembersTab: React.FC<{ boardId: EntityId }> = ({ boardId }) => {
  const { t } = useTranslation();
  const { page, limit, setPage, setLimit, apiParams } = usePagination();
  const invitationPagination = usePagination();
  const [searchParamsState, setSearchParamsState] =
    useState<UsersBoardParams>();
  const [invitationParams, setInvitationParams] =
    useState<InvitationListParams>();
  const [isInvitationDialogOpen, setIsInvitationDialogOpen] = useState(false);

  const staffParams: UsersBoardParams = {
    ...apiParams,
    ...searchParamsState,
  };

  const { listUser, isLoading, listError, refetchList } = useUserBoard(
    boardId,
    staffParams
  );

  const {
    invitationsData,
    isInvitationsLoading,
    isInvitationsFetching,
    invitationListError,
    refetchInvitationList,
    createInvitation,
    isCreateInvitationPending,
    revokeInvitation,
    isRevokeInvitationPending,
  } = useBoardInvitations(boardId, invitationParams);

  const handleSearch = (params: UsersBoardParams) => {
    setSearchParamsState(params);
    setPage(1);
  };

  const handleInvitationSearch = (params: InvitationListParams) => {
    setInvitationParams(params);
    invitationPagination.setPage(1);
  };

  const handleCreateInvitation = async (data: InvitationFormData) => {
    await createInvitation(data);
    setIsInvitationDialogOpen(false);
    invitationPagination.setPage(1);
  };

  const handleRevokeInvitation = (invitation: BoardInvitation) => {
    StaticMethodConfirm.open({
      title: t('settings.invitations.revokeModal.title'),
      content: t('settings.invitations.revokeModal.content', {
        email: invitation.email,
      }),
      okText: t('settings.invitations.revokeModal.okText'),
      cancelText: t('common.cancel'),
      type: 'delete',
      onOk: async () => {
        await revokeInvitation(invitation.id);
      },
    });
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
        <Button
          className="h-10 rounded-md bg-theme-main px-4 text-theme-neutral-1 shadow-sm hover:bg-theme-hover"
          onClick={() => setIsInvitationDialogOpen(true)}
        >
          <MailPlus className="mr-2 h-4 w-4" />
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

      <div className="space-y-5 border-t border-theme-neutral-4 pt-5">
        <div>
          <h3 className="text-lg font-semibold text-theme-neutral-11">
            {t('settings.invitations.heading')}
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-theme-neutral-8">
            {t('settings.invitations.hint')}
          </p>
        </div>

        <InvitationsFilter onSearch={handleInvitationSearch} />

        <InvitationsTable
          data={invitationsData}
          loading={isInvitationsLoading || isInvitationsFetching}
          error={invitationListError}
          refetch={refetchInvitationList}
          page={invitationPagination.page}
          limit={invitationPagination.limit}
          onPageChange={invitationPagination.setPage}
          onPageSizeChange={invitationPagination.setLimit}
          onRevoke={handleRevokeInvitation}
          isActionPending={isRevokeInvitationPending}
        />
      </div>

      <InvitationCreateDialog
        open={isInvitationDialogOpen}
        onOpenChange={setIsInvitationDialogOpen}
        onSubmit={handleCreateInvitation}
        isPending={isCreateInvitationPending}
      />
    </div>
  );
};
