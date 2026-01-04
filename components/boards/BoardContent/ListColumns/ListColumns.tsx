'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, X } from 'lucide-react';
import { Input, Button } from 'antd';

import Column from './Column/Column';
import { generatePlaceholderCard } from '@/utils/formatters';
import {
  updateCurrentActiveBoard,
  selectCurrentActiveBoard,
} from '@/redux/activeBoard/activeBoardSlice';
import type { Column as ColumnType, Board } from '@/config/interface';

interface ListColumnsProps {
  columns: ColumnType[];
}

function ListColumns({ columns }: ListColumnsProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const board = useSelector(selectCurrentActiveBoard) as Board | null;

  const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const toggleOpenNewColumnForm = () =>
    setOpenNewColumnForm(!openNewColumnForm);

  const addNewColumn = async () => {
    if (!newColumnTitle) {
      return;
    }

    // Create mock column data (API call would go here)
    const createdColumn: ColumnType = {
      _id: `column-${Date.now()}`,
      boardId: board?._id || '',
      title: newColumnTitle,
      cardOrderIds: [],
      cards: [],
    };

    // Add placeholder card for empty column
    const placeholderCard = generatePlaceholderCard(createdColumn);
    createdColumn.cards = [placeholderCard];
    createdColumn.cardOrderIds = [placeholderCard._id];

    if (board) {
      const newBoard = cloneDeep(board);
      newBoard.columns.push(createdColumn);
      newBoard.columnOrderIds.push(createdColumn._id);
      dispatch(updateCurrentActiveBoard(newBoard));
    }

    toggleOpenNewColumnForm();
    setNewColumnTitle('');
  };

  return (
    <SortableContext
      items={columns?.map(c => c._id) || []}
      strategy={horizontalListSortingStrategy}
    >
      <div className="w-full h-full flex overflow-x-auto overflow-y-hidden">
        {/* Render columns */}
        {columns?.map(column => (
          <Column key={column._id} column={column} />
        ))}

        {/* Add new column CTA */}
        {!openNewColumnForm ? (
          <div
            onClick={toggleOpenNewColumnForm}
            className="min-w-[250px] max-w-[250px] mx-4 rounded-md h-fit bg-white/25 cursor-pointer"
          >
            <Button
              type="text"
              icon={<Plus className="h-4 w-4" />}
              className="w-full justify-start text-theme-neutral-1 hover:text-theme-neutral-1 py-4 pl-4"
            >
              {t('board.addNewColumn', { defaultValue: 'Add new column' })}
            </Button>
          </div>
        ) : (
          <div className="min-w-[250px] max-w-[250px] mx-4 p-2 rounded-md h-fit bg-white/25 flex flex-col gap-2">
            <Input
              placeholder={t('board.enterColumnTitle', {
                defaultValue: 'Enter column title...',
              })}
              autoFocus
              value={newColumnTitle}
              onChange={e => setNewColumnTitle(e.target.value)}
              onPressEnter={addNewColumn}
              className="bg-white/80"
            />
            <div className="flex items-center gap-2">
              <Button
                type="primary"
                size="small"
                onClick={addNewColumn}
                className="bg-green-500 hover:bg-green-600 border-green-500"
              >
                {t('board.addColumn', { defaultValue: 'Add Column' })}
              </Button>
              <button
                onClick={toggleOpenNewColumnForm}
                className="p-1 text-theme-neutral-1 hover:text-orange-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </SortableContext>
  );
}

export default ListColumns;
