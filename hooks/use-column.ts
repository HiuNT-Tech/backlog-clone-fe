import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { BoardService } from '@/lib/apis/board';
import { toastHelpers } from '@/hooks/use-toast';
import { Column } from '@/config/interface';

interface CreateColumnInput {
  boardId: string;
  title: string;
}

export const useColumn = (boardId: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const {
    mutateAsync: createNewColumn,
    isPending: isCreatePending,
    error: createNewColumnError,
  } = useMutation({
    mutationFn: async (input: CreateColumnInput): Promise<Column> => {
      return await BoardService.createNewColumn({
        boardId,
        column: input as Column,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
    onError: () => {
      toastHelpers.error({ title: t('toast.error.userVerificationFailed') });
    },
  });

  return {
    createNewColumn,
    isCreatePending,
    createNewColumnError,
  };
};
