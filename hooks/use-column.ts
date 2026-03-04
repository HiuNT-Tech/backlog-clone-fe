import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { BoardService } from '@/lib/apis/board';
import { toastHelpers } from '@/hooks/use-toast';
import { Column } from '@/config/interface';
import type { ColorStatusKey } from '@/constant/data';

export const useColumn = (boardId?: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const {
    data: columns = [],
    isLoading: isLoadingList,
    error: listError,
  } = useQuery({
    queryKey: ['columns'],
    queryFn: () => BoardService.getColumns(boardId!),
    enabled: !!boardId,
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
        boardId: boardId!,
        title: input.title,
        statusColor: input.statusColor,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['columns', boardId] });
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
      queryClient.invalidateQueries({ queryKey: ['columns', boardId] });
    },
    onError: () => {
      toastHelpers.error({ title: t('toast.error.userVerificationFailed') });
    },
  });

  return {
    columns,
    isLoadingList,
    listError,

    createNewColumn,
    isCreatePending,
    createNewColumnError,

    deleteColumn,
    isDeletePending,
    deleteColumnError,
  };
};
