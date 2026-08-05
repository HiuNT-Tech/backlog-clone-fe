'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Icons from '@/assets/icons';
import { useDashboard } from '@/hooks/use-dashboard';
import BoardList from '@/components/dashboard/BoardList';
import CreateBoardDialog from '@/components/shared/popup/CreateBoardPopup';
import DuplicateBoardDialog from '@/components/shared/popup/DuplicateBoardPopup';
import SampleBoardDialog from '@/components/shared/popup/SampleBoardPopup';
import MyInvitationsBanner from '@/components/shared/invitations/MyInvitationsBanner';
import { Button } from '@/components/ui/button';
import { StateMessage } from '@/components/ui/state-message';
import type { CreateBoardFormData } from '@/validation/create-board-form-schemas';
import type { Board } from '@/config/interface';

export default function DashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSampleDialogOpen, setIsSampleDialogOpen] = useState(false);
  const [duplicateSource, setDuplicateSource] = useState<Board | null>(null);

  const {
    boards,
    isLoading,
    boardListError,
    refetchBoardList,
    createBoard,
    isCreateBoardPending,
    duplicateBoard,
    isDuplicateBoardPending,
    createSampleBoard,
    isCreateSampleBoardPending,
  } = useDashboard();

  const handleCreateBoard = async (data: CreateBoardFormData) => {
    await createBoard({
      title: data.title,
      boardCode: data.boardCode,
      type: 'PUBLIC',
    });
    setIsCreateDialogOpen(false);
  };

  const handleCreateSampleBoard = async (data: CreateBoardFormData) => {
    const newBoard = await createSampleBoard({
      title: data.title,
      boardCode: data.boardCode,
    });
    setIsSampleDialogOpen(false);
    router.push(`/project/${newBoard.id}/issues`);
  };

  const handleDuplicateBoard = async (data: CreateBoardFormData) => {
    if (!duplicateSource) return;
    const newBoard = await duplicateBoard({
      sourceBoardId: duplicateSource.id,
      data: {
        title: data.title,
        boardCode: data.boardCode,
      },
    });
    setDuplicateSource(null);
    router.push(`/project/${newBoard.id}/issues`);
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
        <div className="flex items-center gap-2">
          {/* Lối vào nhanh cho người chưa quen tool: xem trước một project thật
              trông như thế nào thay vì bắt đầu từ board trống. */}
          <Button
            id="create-sample-board-btn"
            variant="outline"
            size="md"
            onClick={() => setIsSampleDialogOpen(true)}
          >
            <Image
              src={Icons.Sparkles}
              alt=""
              width={16}
              height={16}
              className="mr-2 h-4 w-4"
            />
            {t('dashboard.createSampleProject')}
          </Button>
          <Button
            id="add-new-board-btn"
            variant="primary"
            size="md"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Image
              src={Icons.Plus}
              alt=""
              width={16}
              height={16}
              className="mr-2 h-4 w-4"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            {t('dashboard.addNewProject')}
          </Button>
        </div>
      </div>

      {/* Pending Invitations Banner */}
      <MyInvitationsBanner />

      {/* Content */}
      {isLoading && (
        <StateMessage
          variant="block"
          spinner
          i18nKey="common.loading"
          className="py-20"
        />
      )}

      {boardListError && !isLoading && (
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
              <Image
                src={Icons.RefreshCw}
                alt=""
                width={16}
                height={16}
                className="mr-2 h-4 w-4"
              />
              {t('common.retry')}
            </Button>
          </div>
        </div>
      )}

      {!isLoading && !boardListError && boards.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-theme-main-1">
              <Image
                src={Icons.LayoutDashboard}
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 text-theme-main-5"
                style={{ filter: 'var(--theme-filter-main)' }}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-theme-neutral-9">
                {t('dashboard.empty.title')}
              </h3>
              <p className="mt-1 max-w-sm text-sm text-theme-neutral-7">
                {t('dashboard.empty.description')}
              </p>
            </div>
            {/* Người dùng mới chưa có board nào — đây là chỗ họ cần gợi ý nhất,
                nên nút project mẫu được đặt làm hành động chính ở đây. */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsSampleDialogOpen(true)}
              >
                <Image
                  src={Icons.Sparkles}
                  alt=""
                  width={16}
                  height={16}
                  className="mr-2 h-4 w-4"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
                {t('dashboard.createSampleProject')}
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Image
                  src={Icons.Plus}
                  alt=""
                  width={16}
                  height={16}
                  className="mr-2 h-4 w-4"
                />
                {t('dashboard.addNewProject')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !boardListError && boards.length > 0 && (
        <BoardList boards={boards} onDuplicate={setDuplicateSource} />
      )}

      {/* Create Board Dialog */}
      <CreateBoardDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateBoard}
        isPending={isCreateBoardPending}
      />

      {/* Sample Board Dialog */}
      <SampleBoardDialog
        open={isSampleDialogOpen}
        onOpenChange={setIsSampleDialogOpen}
        onSubmit={handleCreateSampleBoard}
        isPending={isCreateSampleBoardPending}
      />

      {/* Duplicate Board Dialog */}
      <DuplicateBoardDialog
        open={!!duplicateSource}
        sourceTitle={duplicateSource?.title ?? ''}
        onOpenChange={open => {
          if (!open) setDuplicateSource(null);
        }}
        onSubmit={handleDuplicateBoard}
        isPending={isDuplicateBoardPending}
      />
    </div>
  );
}
