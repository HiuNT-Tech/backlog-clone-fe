'use client';

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { InvitationService } from '@/lib/apis/invitation';
import { toastHelpers } from '@/hooks/use-toast';
import type {
  BoardInvitation,
  CreateInvitationRequest,
  EntityId,
  InvitationListParams,
  InvitationListResponse,
  MyBoardInvitation,
  MyInvitationListResponse,
} from '@/config/interface';

const emptyInvitationList: InvitationListResponse = {
  items: [],
  total: 0,
};

const emptyMyInvitationList: MyInvitationListResponse = {
  items: [],
  total: 0,
};

export const invitationQueryKeys = {
  boardList: (boardId?: EntityId, params?: InvitationListParams) =>
    ['invitations', 'board', boardId, params] as const,
  detail: (token?: string) => ['invitations', 'detail', token] as const,
  mine: () => ['invitations', 'mine'] as const,
};

export const useBoardInvitations = (
  boardId?: EntityId,
  params?: InvitationListParams
) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const listQuery = useQuery<InvitationListResponse>({
    queryKey: invitationQueryKeys.boardList(boardId, params),
    queryFn: async () =>
      await InvitationService.getBoardInvitations(boardId!, params),
    enabled: !!boardId,
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });

  const createMutation = useMutation({
    mutationFn: async (payload: CreateInvitationRequest) =>
      await InvitationService.createBoardInvitation(boardId!, payload),
    onSuccess: () => {
      toastHelpers.success({
        title: t('settings.invitations.toast.created'),
      });
      queryClient.invalidateQueries({
        queryKey: ['invitations', 'board', boardId],
      });
    },
  });

  const revokeMutation = useMutation({
    mutationFn: async (invitationId: EntityId) =>
      await InvitationService.revokeBoardInvitation(boardId!, invitationId),
    onSuccess: () => {
      toastHelpers.success({
        title: t('settings.invitations.toast.revoked'),
      });
      queryClient.invalidateQueries({
        queryKey: ['invitations', 'board', boardId],
      });
    },
  });

  const resendMutation = useMutation({
    mutationFn: async (invitationId: EntityId) =>
      await InvitationService.resendBoardInvitation(boardId!, invitationId),
    onSuccess: () => {
      toastHelpers.success({
        title: t('settings.invitations.toast.resent'),
      });
      queryClient.invalidateQueries({
        queryKey: ['invitations', 'board', boardId],
      });
    },
  });

  return {
    invitationsData: listQuery.data ?? emptyInvitationList,
    isInvitationsLoading: listQuery.isLoading,
    isInvitationsFetching: listQuery.isFetching,
    invitationListError: listQuery.error,
    refetchInvitationList: listQuery.refetch,
    createInvitation: createMutation.mutateAsync,
    isCreateInvitationPending: createMutation.isPending,
    revokeInvitation: revokeMutation.mutateAsync,
    isRevokeInvitationPending: revokeMutation.isPending,
    resendInvitation: resendMutation.mutateAsync,
    isResendInvitationPending: resendMutation.isPending,
  };
};

export const useInvitationToken = (token?: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const detailQuery = useQuery<BoardInvitation>({
    queryKey: invitationQueryKeys.detail(token),
    queryFn: async () => await InvitationService.getInvitationByToken(token!),
    enabled: !!token,
    staleTime: 30 * 1000,
  });

  const acceptMutation = useMutation({
    mutationFn: async () => await InvitationService.acceptInvitation(token!),
    onSuccess: invitation => {
      toastHelpers.success({
        title: t('settings.invitations.toast.accepted'),
      });
      queryClient.setQueryData(invitationQueryKeys.detail(token), invitation);
      queryClient.invalidateQueries({ queryKey: invitationQueryKeys.mine() });
      queryClient.invalidateQueries({ queryKey: ['dashboard-boards'] });
    },
  });

  const declineMutation = useMutation({
    mutationFn: async () => await InvitationService.declineInvitation(token!),
    onSuccess: invitation => {
      toastHelpers.success({
        title: t('settings.invitations.toast.declined'),
      });
      queryClient.setQueryData(invitationQueryKeys.detail(token), invitation);
      queryClient.invalidateQueries({ queryKey: invitationQueryKeys.mine() });
    },
  });

  return {
    invitation: detailQuery.data,
    isInvitationLoading: detailQuery.isLoading,
    invitationError: detailQuery.error,
    refetchInvitation: detailQuery.refetch,
    acceptInvitation: acceptMutation.mutateAsync,
    isAcceptInvitationPending: acceptMutation.isPending,
    declineInvitation: declineMutation.mutateAsync,
    isDeclineInvitationPending: declineMutation.isPending,
  };
};

export const useMyInvitations = (enabled = false) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const removeHandledInvitation = (invitation: BoardInvitation) => {
    queryClient.setQueryData<MyInvitationListResponse>(
      invitationQueryKeys.mine(),
      current => {
        if (!current) return current;

        const items = current.items.filter(item => item.id !== invitation.id);

        return {
          ...current,
          items,
          total: items.length,
        };
      }
    );
  };

  const query = useQuery<MyInvitationListResponse>({
    queryKey: invitationQueryKeys.mine(),
    queryFn: async () => await InvitationService.getMyInvitations(),
    enabled,
    staleTime: 30 * 1000,
  });

  const acceptMutation = useMutation({
    mutationFn: async (token: MyBoardInvitation['token']) =>
      await InvitationService.acceptInvitation(token),
    onSuccess: invitation => {
      toastHelpers.success({
        title: t('settings.invitations.toast.accepted'),
      });
      removeHandledInvitation(invitation);
      queryClient.invalidateQueries({ queryKey: invitationQueryKeys.mine() });
      queryClient.invalidateQueries({ queryKey: ['dashboard-boards'] });
    },
  });

  const declineMutation = useMutation({
    mutationFn: async (token: MyBoardInvitation['token']) =>
      await InvitationService.declineInvitation(token),
    onSuccess: invitation => {
      toastHelpers.success({
        title: t('settings.invitations.toast.declined'),
      });
      removeHandledInvitation(invitation);
      queryClient.invalidateQueries({ queryKey: invitationQueryKeys.mine() });
    },
  });

  return {
    myInvitationsData: query.data ?? emptyMyInvitationList,
    isMyInvitationsLoading: query.isLoading,
    myInvitationsError: query.error,
    refetchMyInvitations: query.refetch,
    acceptMyInvitation: acceptMutation.mutateAsync,
    isAcceptMyInvitationPending: acceptMutation.isPending,
    declineMyInvitation: declineMutation.mutateAsync,
    isDeclineMyInvitationPending: declineMutation.isPending,
  };
};
