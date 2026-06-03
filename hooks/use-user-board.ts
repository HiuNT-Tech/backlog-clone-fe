import { useQuery } from '@tanstack/react-query';
import { BoardService } from '@/lib/apis/board';
import {
  EntityId,
  UsersBoardParams,
  UsersBoardResponse,
} from '@/config/interface';

export const useUserBoard = (boardId?: EntityId, params?: UsersBoardParams) => {
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

  return {
    listUser: data,
    isLoading,
    listError,
    refetchList,
  };
};
