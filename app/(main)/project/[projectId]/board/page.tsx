'use client';

import { useEffect, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BoardContent from '@/components/boards/BoardContent/BoardContent';
import { cloneDeep } from 'lodash';
import {
  fetchBoardDetailsAPI,
  selectCurrentActiveBoard,
  updateCurrentActiveBoard,
} from '@/redux/activeBoard/activeBoardSlice';
import type { AppDispatch } from '@/redux/store';
import type {
  Board,
  Column as ColumnType,
  Card,
  EntityId,
} from '@/config/interface';
import { useBoard } from '@/hooks/use-board';
import { useParams } from 'next/navigation';
import { toPositionPayload, withSequentialPositions } from '@/utils/sorts';

function BoardPageContent() {
  const dispatch = useDispatch<AppDispatch>();
  const board = useSelector(selectCurrentActiveBoard) as Board | null;
  const params = useParams<{ projectId: string }>();
  const boardId = params.projectId;

  // Use the hook to get mutation functions - use board.id for mutations (numeric ID)
  const {
    updateBoardDetail,
    updateColumnDetails,
    moveCardToDifferentColumn: moveCardToDifferentColumnAPI,
  } = useBoard(board?.id);

  useEffect(() => {
    if (!boardId) return;
    dispatch(fetchBoardDetailsAPI(parseInt(boardId)));
  }, [dispatch, boardId]);

  if (!board) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="text-theme-neutral-1 text-lg">Loading board...</div>
      </div>
    );
  }

  const moveColumns = (dndOrderedColumns: ColumnType[]) => {
    const positionedColumns = withSequentialPositions(dndOrderedColumns);
    const newBoard = cloneDeep(board);
    newBoard.columns = positionedColumns;
    dispatch(updateCurrentActiveBoard(newBoard));

    updateBoardDetail({
      id: board.id,
      columns: toPositionPayload(positionedColumns),
    });
  };

  const moveCardInTheSameColumn = (
    dndOrderedCards: Card[],
    columnId: EntityId
  ) => {
    const positionedCards = withSequentialPositions(dndOrderedCards);
    const newBoard = cloneDeep(board);
    const columnToUpdate = newBoard.columns.find(
      column => column.id === columnId
    );
    if (columnToUpdate) {
      columnToUpdate.cards = positionedCards;
    }
    dispatch(updateCurrentActiveBoard(newBoard));

    updateColumnDetails({
      id: columnId,
      cards: toPositionPayload(positionedCards),
    });
  };

  const moveCardToDifferentColumn = (
    currentCardId: EntityId,
    prevColumnId: EntityId,
    nextColumnId: EntityId,
    dndOrderedColumns: ColumnType[]
  ) => {
    const newBoard = cloneDeep(board);
    newBoard.columns = dndOrderedColumns;
    dispatch(updateCurrentActiveBoard(newBoard));

    const prevCards =
      dndOrderedColumns.find(c => c.id === prevColumnId)?.cards || [];
    const nextCards =
      dndOrderedColumns.find(c => c.id === nextColumnId)?.cards || [];

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCards: toPositionPayload(prevCards),
      nextColumnId,
      nextCards: toPositionPayload(nextCards),
    });
  };

  return (
    <BoardContent
      board={board}
      moveColumns={moveColumns}
      moveCardInTheSameColumn={moveCardInTheSameColumn}
      moveCardToDifferentColumn={moveCardToDifferentColumn}
    />
  );
}

function BoardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
          <div className="text-theme-neutral-1 text-lg">Loading board...</div>
        </div>
      }
    >
      <BoardPageContent />
    </Suspense>
  );
}

export default BoardPage;
