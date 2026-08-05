import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { BoardService } from '@/lib/apis/board';
import { toastHelpers } from '@/hooks/use-toast';
import {
  CreateBoardRequest,
  CreateSampleBoardRequest,
  DuplicateBoardRequest,
  EntityId,
} from '@/config/interface';

export const useDashboard = () => {
  const { t, i18n } = useTranslation();
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

  // Mutation: Nhân bản board (cột, loại issue, milestone, card)
  const {
    mutateAsync: duplicateBoard,
    isPending: isDuplicateBoardPending,
    error: duplicateBoardError,
  } = useMutation({
    mutationFn: async ({
      sourceBoardId,
      data,
    }: {
      sourceBoardId: EntityId;
      data: DuplicateBoardRequest;
    }) => {
      return await BoardService.duplicateBoard(sourceBoardId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-boards'] });
      toastHelpers.success({
        description: t('toast.success.boardDuplicated'),
      });
    },
    onError: () => {
      toastHelpers.error({
        title: t('toast.error.boardDuplicateFailed'),
      });
    },
  });

  // Mutation: Tạo project mẫu (board demo có sẵn cột, loại issue, milestone,
  // ticket) cho người dùng chưa quen tool. Nội dung mẫu do BE sinh ra, FE chỉ
  // gửi kèm ngôn ngữ đang dùng để ticket mẫu đúng tiếng người dùng đang đọc.
  const {
    mutateAsync: createSampleBoard,
    isPending: isCreateSampleBoardPending,
    error: createSampleBoardError,
  } = useMutation({
    mutationFn: async (data: Omit<CreateSampleBoardRequest, 'locale'>) => {
      return await BoardService.createSampleBoard({
        ...data,
        locale: i18n.language.startsWith('vi') ? 'vi' : 'en',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-boards'] });
      toastHelpers.success({
        description: t('toast.success.sampleBoardCreated'),
      });
    },
    onError: () => {
      toastHelpers.error({
        title: t('toast.error.sampleBoardCreateFailed'),
      });
    },
  });

  return {
    boards: boardListData?.items ?? [],
    isLoading,
    boardListError,
    refetchBoardList,

    createBoard,
    isCreateBoardPending,
    createBoardError,

    duplicateBoard,
    isDuplicateBoardPending,
    duplicateBoardError,

    createSampleBoard,
    isCreateSampleBoardPending,
    createSampleBoardError,
  };
};
