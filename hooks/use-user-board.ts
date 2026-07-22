import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { BoardService } from '@/lib/apis/board';
import { toastHelpers } from '@/hooks/use-toast';
import {
  BoardMemberRole,
  EntityId,
  UsersBoardParams,
  UsersBoardResponse,
} from '@/config/interface';

export const useUserBoard = (boardId?: EntityId, params?: UsersBoardParams) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    data = { items: [], total: 0 },
    isLoading,
    error: listError,
    refetch: refetchList,
  } = useQuery<UsersBoardResponse>({
    queryKey: ['users', 'board', boardId, params],
    queryFn: async () => await BoardService.getUsersBoard(boardId, params),
    staleTime: 30 * 1000,
    enabled: !!boardId,
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: EntityId;
      role: BoardMemberRole;
    }) => await BoardService.updateMemberRole(boardId!, userId, role),
    onSuccess: () => {
      toastHelpers.success({
        title: t('settings.members.editRoleModal.success'),
      });
      queryClient.invalidateQueries({
        queryKey: ['users', 'board', boardId],
      });
    },
    onError: () => {
      toastHelpers.error({
        title: t('settings.members.editRoleModal.error'),
      });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (userId: EntityId) =>
      await BoardService.removeMember(boardId!, userId),
    onSuccess: () => {
      toastHelpers.success({
        title: t('settings.members.removeModal.success'),
      });
      queryClient.invalidateQueries({
        queryKey: ['users', 'board', boardId],
      });
    },
    onError: () => {
      toastHelpers.error({
        title: t('settings.members.removeModal.error'),
      });
    },
  });

  return {
    listUser: data,
    isLoading,
    listError,
    refetchList,
    updateMemberRole: updateRoleMutation.mutateAsync,
    isUpdateRolePending: updateRoleMutation.isPending,
    removeMember: removeMemberMutation.mutateAsync,
    isRemoveMemberPending: removeMemberMutation.isPending,
  };
};
