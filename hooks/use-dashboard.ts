import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { BoardService } from '@/lib/apis/board';
import { toastHelpers } from '@/hooks/use-toast';
import { CreateBoardRequest } from '@/config/interface';

export const useDashboard = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Query: Lấy danh sách boards
  const {
    data: boardListData,
    isLoading,
    error: boardListError,
    refetch: refetchBoardList,
  } = useQuery({
    queryKey: ['dashboard-boards'],
    queryFn: async () => {
      return await BoardService.getBoard();
    },
  });

  // Mutation: Tạo board mới
  const {
    mutateAsync: createBoard,
    isPending: isCreateBoardPending,
    error: createBoardError,
  } = useMutation({
    mutationFn: async (data: CreateBoardRequest) => {
      return await BoardService.createNewBoard(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-boards'] });
      toastHelpers.success({
        description: t('toast.success.boardCreated'),
      });
    },
    onError: () => {
      toastHelpers.error({
        title: t('toast.error.boardCreateFailed'),
      });
    },
  });

  return {
    boards: boardListData ?? [],
    isLoading,
    boardListError,
    refetchBoardList,

    createBoard,
    isCreateBoardPending,
    createBoardError,
  };
};
