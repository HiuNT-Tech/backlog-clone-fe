'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, LayoutDashboard, RefreshCw } from 'lucide-react';
import { useDashboard } from '@/hooks/use-dashboard';
import BoardList from '@/components/dashboard/BoardList';
import CreateBoardDialog from '@/components/dashboard/CreateBoardDialog';
import { Button } from '@/components/ui/button';
import type { CreateBoardFormData } from '@/validation/create-board-form-schemas';

export default function DashboardPage() {
  const { t } = useTranslation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const {
    boards,
    isBoardListLoading,
    boardListError,
    refetchBoardList,
    createBoard,
    isCreateBoardPending,
  } = useDashboard();

  const handleCreateBoard = async (data: CreateBoardFormData) => {
    await createBoard({
      title: data.title,
      description: data.description || '',
      type: 'public',
    });
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-theme-neutral-10">
            {t('dashboard.title')}
          </h1>
          <p className="mt-1 text-sm text-theme-neutral-7">
            {t('dashboard.description')}
          </p>
        </div>
        <Button
          id="add-new-board-btn"
          variant="primary"
          size="md"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('dashboard.addNewBoard')}
        </Button>
      </div>

      {/* Content */}
      {isBoardListLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-theme-neutral-5 border-t-theme-main" />
            <p className="text-sm text-theme-neutral-7">
              {t('common.loading')}
            </p>
          </div>
        </div>
      )}

      {boardListError && !isBoardListLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-sm text-red-500">
              {t('toast.error.boardLoadFailed')}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchBoardList()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      )}

      {!isBoardListLoading && !boardListError && boards.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-theme-main-1">
              <LayoutDashboard className="h-8 w-8 text-theme-main-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-theme-neutral-9">
                {t('dashboard.empty.title')}
              </h3>
              <p className="mt-1 max-w-sm text-sm text-theme-neutral-7">
                {t('dashboard.empty.description')}
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t('dashboard.addNewBoard')}
            </Button>
          </div>
        </div>
      )}

      {!isBoardListLoading && !boardListError && boards.length > 0 && (
        <BoardList boards={boards} />
      )}

      {/* Create Board Dialog */}
      <CreateBoardDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateBoard}
        isPending={isCreateBoardPending}
      />
    </div>
  );
}
