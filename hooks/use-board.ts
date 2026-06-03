import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { BoardService } from '@/lib/apis/board';
import { toastHelpers } from '@/hooks/use-toast';
import {
  Board,
  Card,
  Column,
  EntityId,
  MoveCardToDifferentColumnRequest,
  UpdateBoardDetailRequest,
  UpdateColumnDetailsRequest,
} from '@/config/interface';

export const useBoard = (
  boardId: EntityId | undefined,
  columnId?: EntityId
) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    mutateAsync: createNewColumn,
    isPending: isCreatePending,
    error: createNewColumnError,
  } = useMutation({
    mutationFn: async (data: { title: string }) => {
      return await BoardService.createNewColumn({
        boardId: boardId!,
        title: data.title,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  const {
    mutateAsync: updateColumnDetails,
    isPending: isUpdatePending,
    error: updateColumnDetailsError,
  } = useMutation({
    mutationFn: async (
      column: UpdateColumnDetailsRequest['updateData'] & { id?: EntityId }
    ) => {
      const { id, ...updateData } = column;
      return await BoardService.updateColumnDetails({
        boardId: boardId!,
        columnId: id ?? columnId!,
        updateData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  const {
    mutateAsync: updateBoardDetail,
    isPending: isUpdateBoardDetailPending,
    error: updateBoardDetailError,
  } = useMutation({
    mutationFn: async (
      board: UpdateBoardDetailRequest['updateData'] & { id?: EntityId }
    ) => {
      const { id, ...updateData } = board;
      return await BoardService.updateBoardDetail({
        boardId: id ?? boardId!,
        updateData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  const {
    mutateAsync: deleteColumnDetails,
    isPending: isDeletePending,
    error: deleteColumnDetailsError,
  } = useMutation({
    mutationFn: async (columnId: EntityId) => {
      return await BoardService.deleteColumnDetails({
        boardId: boardId!,
        columnId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  const {
    mutateAsync: moveCardToDifferentColumn,
    isPending: isMovePending,
    error: moveCardToDifferentColumnError,
  } = useMutation({
    mutationFn: async (data: MoveCardToDifferentColumnRequest) => {
      return await BoardService.moveCardToDifferentColumn(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  const {
    mutateAsync: createNewCard,
    isPending: isCreateCardPending,
    error: createNewCardError,
  } = useMutation({
    mutationFn: async (card: {
      boardId: EntityId;
      columnId: EntityId;
      title: string;
    }) => {
      return await BoardService.createNewCard(card);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  return {
    createNewColumn,
    isCreatePending,
    createNewColumnError,

    updateColumnDetails,
    isUpdatePending,
    updateColumnDetailsError,

    updateBoardDetail,
    isUpdateBoardDetailPending,
    updateBoardDetailError,

    deleteColumnDetails,
    isDeletePending,
    deleteColumnDetailsError,

    moveCardToDifferentColumn,
    isMovePending,
    moveCardToDifferentColumnError,

    createNewCard,
    isCreateCardPending,
    createNewCardError,
  };
};
