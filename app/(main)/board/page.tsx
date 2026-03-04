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
import type { Board, Column as ColumnType, Card } from '@/config/interface';
import { useBoard } from '@/hooks/use-board';
import { useSearchParams } from 'next/navigation';

function BoardPageContent() {
  const dispatch = useDispatch<AppDispatch>();
  const board = useSelector(selectCurrentActiveBoard) as Board | null;
  const searchParams = useSearchParams();
  const boardId = searchParams.get('id');

  // Use the hook to get mutation functions
  const {
    updateBoardDetail,
    updateColumnDetails,
    moveCardToDifferentColumn: moveCardToDifferentColumnAPI,
  } = useBoard(boardId || '', '');

  useEffect(() => {
    if (!boardId) return;
    dispatch(fetchBoardDetailsAPI(boardId));
  }, [dispatch, boardId]);

  if (!board) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="text-theme-neutral-1 text-lg">Loading board...</div>
      </div>
    );
  }

  const moveColumns = (dndOrderedColumns: ColumnType[]) => {
    // Update cho chuẩn dữ liệu state Board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id);
    const newBoard = cloneDeep(board);
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    dispatch(updateCurrentActiveBoard(newBoard));

    // Gọi API update Board
    updateBoardDetail({
      _id: board._id,
      columnOrderIds: dndOrderedColumnsIds,
    });
  };

  /**
   * Khi di chuyển card trong cùng Column:
   * Chỉ cần gọi API để cập nhật mảng cardOrderIds của Column chứa nó (thay đổi vị trí trong mảng)
   */
  const moveCardInTheSameColumn = (
    dndOrderedCards: Card[],
    dndOrderedCardIds: string[],
    columnId: string
  ) => {
    // Update cho chuẩn dữ liệu state Board
    const newBoard = cloneDeep(board);
    const columnToUpdate = newBoard.columns.find(
      column => column._id === columnId
    );
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards;
      columnToUpdate.cardOrderIds = dndOrderedCardIds;
    }
    dispatch(updateCurrentActiveBoard(newBoard));

    // Gọi API update Column
    updateColumnDetails({ _id: columnId, cardOrderIds: dndOrderedCardIds });
  };

  const moveCardToDifferentColumn = (
    currentCardId: string,
    prevColumnId: string,
    nextColumnId: string,
    dndOrderedColumns: ColumnType[]
  ) => {
    // Update cho chuẩn dữ liệu state Board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id);
    const newBoard = cloneDeep(board);
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    dispatch(updateCurrentActiveBoard(newBoard));

    // Get prevCardOrderIds (filter out placeholder cards)
    let prevCardOrderIds =
      dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds || [];
    if (prevCardOrderIds[0]?.includes('placeholder-card')) {
      prevCardOrderIds = [];
    }

    // Get nextCardOrderIds
    const nextCardOrderIds =
      dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds || [];

    // Call API with correct payload structure
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds,
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
