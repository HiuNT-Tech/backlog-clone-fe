import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { BoardService } from '@/lib/apis/board';
import { toastHelpers } from '@/hooks/use-toast';
import { Column } from '@/config/interface';
import type { ColorStatusKey } from '@/constant/data';

const DEFAULT_BOARD_ID = '6957793c6042bc901f2a1c46';

export const useColumn = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const {
    data: columns = [],
    isLoading: isLoadingList,
    error: listError,
  } = useQuery({
    queryKey: ['columns'],
    queryFn: () => BoardService.getColumns(),
  });

  const {
    mutateAsync: createNewColumn,
    isPending: isCreatePending,
    error: createNewColumnError,
  } = useMutation({
    mutationFn: async (input: {
      title: string;
      statusColor: number;
      selectedColorKey: ColorStatusKey;
    }): Promise<Column> => {
      return await BoardService.createNewColumn({
        boardId: DEFAULT_BOARD_ID,
        title: input.title,
        statusColor: input.statusColor,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
    onError: () => {
      toastHelpers.error({ title: t('toast.error.userVerificationFailed') });
    },
  });

  const {
    mutateAsync: deleteColumn,
    isPending: isDeletePending,
    error: deleteColumnError,
  } = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      return await BoardService.deleteColumn(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['columns'] });
    },
    onError: () => {
      toastHelpers.error({ title: t('toast.error.userVerificationFailed') });
    },
  });

  return {
    columns: columns,
    isLoadingList: isLoadingList,
    listError: listError,

    createNewColumn: createNewColumn,
    isCreatePending: isCreatePending,
    createNewColumnError: createNewColumnError,

    deleteColumn: deleteColumn,
    isDeletePending: isDeletePending,
    deleteColumnError: deleteColumnError,
  };
};
