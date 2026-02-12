'use client';

import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

import Column from './Column/Column';
import type { Column as ColumnType } from '@/config/interface';
interface ListColumnsProps {
  columns: ColumnType[];
}

function ListColumns({ columns }: ListColumnsProps) {
  return (
    <SortableContext
      items={columns?.map(c => c._id) || []}
      strategy={horizontalListSortingStrategy}
    >
      <div className="w-full h-full flex overflow-x-auto overflow-y-hidden">
        {columns?.map(column => (
          <Column key={column._id} column={column} />
        ))}
      </div>
    </SortableContext>
  );
}

export default ListColumns;
