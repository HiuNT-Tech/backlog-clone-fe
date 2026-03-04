'use client';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { LayoutDashboard } from 'lucide-react';
import type { Board } from '@/config/interface';

interface BoardListProps {
  boards: Board[];
}

export default function BoardList({ boards }: BoardListProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const handleBoardClick = (boardId: string) => {
    router.push(`/board?id=${boardId}`);
  };

  if (boards.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {boards.map(board => (
        <div
          key={board._id}
          onClick={() => handleBoardClick(board._id)}
          className="group relative cursor-pointer rounded-lg border border-theme-neutral-5 bg-theme-neutral-1 p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-theme-main hover:-translate-y-0.5"
        >
          {/* Color accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg bg-linear-to-r from-theme-main to-theme-main-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-theme-main-1 text-theme-main-5 transition-colors group-hover:bg-theme-main-2">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-theme-neutral-10 truncate text-sm leading-5">
                {board.title}
              </h3>
              <p className="mt-1 text-xs text-theme-neutral-7 line-clamp-2">
                {board.description || t('dashboard.boardCard.noDescription')}
              </p>
            </div>
          </div>

          {/* Board meta */}
          <div className="mt-3 flex items-center gap-3 text-xs text-theme-neutral-6">
            <span className="inline-flex items-center gap-1 rounded-full bg-theme-neutral-3 px-2 py-0.5 capitalize">
              {board.type}
            </span>
            <span>{board.columnOrderIds?.length ?? 0} columns</span>
          </div>
        </div>
      ))}
    </div>
  );
}
