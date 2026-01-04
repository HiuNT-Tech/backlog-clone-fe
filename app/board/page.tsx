'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import BoardContent from '@/components/boards/BoardContent/BoardContent';
import {
  fetchBoardDetailsAPI,
  selectCurrentActiveBoard,
} from '@/redux/activeBoard/activeBoardSlice';
import type { AppDispatch } from '@/redux/store';
import type { Board } from '@/config/interface';

function BoardPageContent() {
  const dispatch = useDispatch<AppDispatch>();
  const board = useSelector(selectCurrentActiveBoard) as Board | null;

  useEffect(() => {
    dispatch(fetchBoardDetailsAPI('board-id-01'));
  }, [dispatch]);

  if (!board) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="text-theme-neutral-1 text-lg">Loading board...</div>
      </div>
    );
  }

  return <BoardContent board={board} />;
}

function BoardPage() {
  return (
    <Provider store={store}>
      <BoardPageContent />
    </Provider>
  );
}

export default BoardPage;
