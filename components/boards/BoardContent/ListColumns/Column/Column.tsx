'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import ListCards from './ListCards/ListCards';
import type { Column as ColumnType } from '@/config/interface';

interface ColumnProps {
  column: ColumnType;
}

function Column({ column }: ColumnProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column._id,
    data: { ...column },
  });

  const dndKitColumnStyles: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined,
  };

  const orderedCards = column.cards;

  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <div
        {...listeners}
        className="min-w-[300px] max-w-[300px] bg-theme-neutral-3 ml-4 rounded-lg h-full max-h-[calc(100vh-6rem)]"
      >
        {/* Column Header */}
        <div className="h-14 p-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-theme-neutral-11 cursor-pointer">
            {column?.title}
          </h3>
        </div>

        {/* List Cards */}
        <ListCards cards={orderedCards} columnId={column._id} />
      </div>
    </div>
  );
}

export default Column;
