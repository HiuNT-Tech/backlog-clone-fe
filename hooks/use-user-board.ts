import { useQuery } from '@tanstack/react-query';
import { BoardService } from '@/lib/apis/board';
import { UsersBoardParams, UsersBoardResponse } from '@/config/interface';

export const useUserBoard = (boardId: string, params?: UsersBoardParams) => {
  const {
    data: listUser,
    isLoading: isListLoading,
    error: listError,
    refetch: refetchList,
  } = useQuery<UsersBoardResponse>({
    queryKey: ['users', 'board', boardId, params],
    queryFn: async () => await BoardService.getUsersBoard(boardId, params),
    staleTime: 30 * 1000,
    enabled: !!boardId,
  });

  return {
    listUser,
    isListLoading,
    listError,
    refetchList,
  };
};
